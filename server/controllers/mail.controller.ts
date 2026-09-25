import { Response } from "express";
import { AuthRequest } from "../types/auth.type.js";
import { ComposedMail, ComposeMailPayload } from "../types/mail.types.js";
import { validateComposeMailPayload } from "../utilities/mail.utils.js";
import { db } from "../config/db.config.js";
import { workQueue } from "../services/task.queue.js";
import { User } from "../types/user.types.js";
import { Response as CustomResponse } from "../types/global.types.js";
import { mailer } from "./mailer.controller.js";
import { MailerPayload } from "../types/mailer.types.js";
import { genMailContent } from "../services/html/mail_template.js";
import { PoolConnection } from "mysql2/promise";



export const QueueComposedMail = async (d: { req?: AuthRequest, res?: Response, local_data?: { user: Partial<User>, payload: Partial<ComposeMailPayload>, conn: PoolConnection } }) => {
    const { req, res, local_data } = d;

    const responseHelper = (response: CustomResponse) => {
        if (res) return res.status(response.status as number).json(response);
        return response;
    }

    const data = req ? req.body as ComposeMailPayload : local_data?.payload;
    const adminId = req ? req.user?.user_id : local_data?.user.user_id;

    if (!adminId || !data) {
        return responseHelper({ status: 401, message: "unauthorised!" });
    }

    // 1. Track if we created the connection ourselves
    const isInternalCall = Boolean(local_data?.conn);
    const conn = local_data?.conn || await db.getConnection();

    try {
        // Validate payload BEFORE messing with transaction states
        const { error } = validateComposeMailPayload(data);
        if (error) {
            // ONLY rollback and release if WE own the transaction connection lifecycle
            if (!isInternalCall) {
                await conn.rollback();
                conn.release();
            }
            return responseHelper({ status: 400, message: error });
        }

        // 2. Only start a transaction if we are the root controller execution context
        if (!isInternalCall) {
            await conn.beginTransaction();
        }

        const rand = crypto.randomUUID().split('-')[0] ?? adminId;
        const mailId = `${rand}-${Date.now()}`;
        const recipient_mode = data.options?.audience ?? "all";
        const cleanRecipient = data.options?.custom_audience
            .map((u) => ({ email: u.email, newsletter: u.newsletter }))
            .filter((u) => Boolean(u.newsletter ?? 1));
        const recipients = JSON.stringify(cleanRecipient ?? []);

        await conn.query(`
            INSERT INTO composed_mails 
            (mail_id, admin_id, from_email, reply_to, name, recipient_mode, recipients, subject, text_body, html_body) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [mailId, adminId, data.from_email, data.replyTo || null, data.name || null, recipient_mode, recipients, data.subject, data.text || null, data.html || null]
        );

        // 3. Only commit if we started the transaction block here
        // Inside the try block success path:
        if (!isInternalCall) {
            await conn.commit();
            await workQueue.add("composed-mail", { mailId });
        }

        // Return the mailId so the parent controller can queue it after committing
        if (res) {
            return responseHelper({ status: 200, message: "Mail added to queue..." });
        } else {
            return responseHelper({ status: 200, message: "Mail added to database context", data: { mailId, jobName: "composed-mail" } });
        }

        //return responseHelper({ status: 200, message: "Mail added to queue, check composed-mails/mailbox for update!" });

    } catch (err) {
        console.log("Error adding request to queue: ", err);

        // 4. Only roll back if we own the connection lifecycle
        if (!isInternalCall) {
            try { await conn.rollback(); } catch (e) { }
        } else {
            // If we are part of a larger transaction, pass the error UP to the parent controller 
            // so the parent controller knows it needs to roll back the entire operation chain
            throw err;
        }

        return responseHelper({ status: 500, message: "Mail Compose Failed!", error: (err as any)?.message ?? err });
    } finally {
        // 5. CRITICAL: Only release back to the pool if we fetched it using db.getConnection()
        if (!isInternalCall) {
            conn.release();
        }
    }
}




export const sendQueuedComposedMail = async (data: { mailId?: string }) => {
    const { mailId } = data;

    console.log("========== MAIL JOB START ==========");
    console.log("[MAIL] mailId:", mailId);

    if (!mailId) {
        console.log("[MAIL] STOP: mailId is missing");
        return;
    }

    console.log("[MAIL] Getting DB connection...");

    const conn = await db.getConnection();

    console.log("[MAIL] DB connection acquired");

    try {
        // --------------------------------------------------
        // 1. Mark mail as processing
        // --------------------------------------------------

        console.log("[MAIL] Updating status -> processing...");

        const [processingResult]: any = await conn.query(
            `UPDATE composed_mails
             SET status = 'processing'
             WHERE mail_id = ? AND status != 'sent'`,
            [mailId]
        );

        console.log("[MAIL] Status update completed:", processingResult);

        // --------------------------------------------------
        // 2. Fetch mail
        // --------------------------------------------------

        console.log("[MAIL] Fetching mail from database...");

        const [result]: any = await conn.query(
            "SELECT * FROM composed_mails WHERE mail_id = ? LIMIT 1",
            [mailId]
        );

        console.log("[MAIL] Mail fetch completed");

        const mailData = (result as ComposedMail[])[0];

        if (!mailData) {
            console.log("[MAIL] STOP: invalid mailId, mail not found:", mailId);
            return;
        }

        console.log("[MAIL] Mail found:", {
            mailId,
            status: mailData.status,
            recipientMode: mailData.recipient_mode,
            subject: mailData.subject,
        });

        if (mailData.status === "sent") {
            console.log("[MAIL] STOP: mail is already sent");
            return;
        }

        // --------------------------------------------------
        // 3. Build recipient conditions
        // --------------------------------------------------

        console.log("[MAIL] Building recipient conditions...");

        const conditions: string[] = [];

        if (mailData.recipient_mode === "subscribers") {
            conditions.push("vs.expires_at IS NOT NULL");
        }

        if (mailData.recipient_mode === "non_subscribers") {
            conditions.push("vs.expires_at IS NULL");
        }

        console.log("[MAIL] Conditions:", conditions);

        // --------------------------------------------------
        // 4. Get recipients
        // --------------------------------------------------

        const baseSql = `
            SELECT
                u.*,
                vs.package as active_sub,
                vs.expires_at as sub_expires_at
            FROM users u
            LEFT JOIN (
                SELECT *
                FROM subscriptions
                WHERE expires_at > NOW()
            ) vs
            ON u.user_id = vs.user_id
        `;

        type Recipient = Pick<User, "email" | "newsletter">;

        let recipients: Recipient[] = [];

        if (mailData.recipient_mode === "custom") {

            console.log("[MAIL] Using custom audience");

            recipients = mailData.recipients
                ? JSON.parse(mailData.recipients)
                : [];

            console.log("[MAIL] Custom recipients:", recipients.length);

        } else {

            console.log("[MAIL] Fetching recipients from database...");

            const sql = `
                ${baseSql}
                ${conditions.length > 0
                    ? `WHERE ${conditions.join(" AND ")}`
                    : ""
                }
            `;

            console.log("[MAIL] Recipient query starting...");

            const [results]: [any[], any] = await conn.query(sql);

            console.log(
                "[MAIL] Recipient query completed. Count:",
                results.length
            );

            recipients = results as Recipient[];
        }

        console.log("[MAIL] Total recipients:", recipients.length);

        // --------------------------------------------------
        // 5. Generate mail HTML
        // --------------------------------------------------

        console.log("[MAIL] Generating mail content...");

        const html = await genMailContent({
            mail_html: mailData.html_body
        });

        console.log("[MAIL] Mail content generated");

        // --------------------------------------------------
        // 6. Send emails
        // --------------------------------------------------

        // --------------------------------------------------
        // 6. Send emails sequentially with a delay
        // --------------------------------------------------

        let successfulCount = 0;
        let failedCount = 0;

        console.log("[MAIL] Starting email delivery sequentially...");

        for (let i = 0; i < recipients.length; i++) {
            const user = recipients[i];

            console.log(`[MAIL] Sending ${i + 1} of ${recipients.length}:`, user?.email);

            const payload: MailerPayload = {
                fromEmail: mailData.from_email,
                replyTo: mailData.reply_to,
                from: `${mailData.name} <${mailData.from_email}>`,
                to: user?.email || "",
                subject: mailData.subject,
                html,
                text: mailData.text_body
            };

            try {
                await mailer.customSend(payload);
                successfulCount++;
                console.log("[MAIL] Success:", user?.email);
            } catch (err: any) {
                failedCount++;
                console.log("[MAIL] Individual mail failed:", user?.email, err);
            }

            // Add a 500ms delay between emails to prevent rate-limiting (adjust as needed)
            if (i < recipients.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        // --------------------------------------------------
        // 7. Determine final status
        // --------------------------------------------------

        console.log("[MAIL] All batches completed");

        let finalStatus: "sent" | "failed" | "partial" = "sent";

        if (successfulCount === 0 && failedCount > 0) {
            finalStatus = "failed";
        }

        if (successfulCount > 0 && failedCount > 0) {
            finalStatus = "partial";
        }

        console.log("[MAIL] Final result:", {
            successfulCount,
            failedCount,
            finalStatus
        });

        // --------------------------------------------------
        // 8. Update database
        // --------------------------------------------------

        console.log("[MAIL] Updating final mail status...");

        const [finalUpdate]: any = await conn.query(
            `
            UPDATE composed_mails
            SET
                status = ?,
                successful_count = ?,
                failed_count = ?,
                sent_at = NOW()
            WHERE mail_id = ?
            `,
            [
                finalStatus,
                successfulCount,
                failedCount,
                mailId
            ]
        );

        console.log("[MAIL] Final DB update completed:", finalUpdate);

        // --------------------------------------------------
        // 9. Completed
        // --------------------------------------------------

        console.log("Mail Job Completed:", {
            mailId,
            successfulCount,
            failedCount,
            finalStatus
        });

        console.log("========== MAIL JOB END ==========");

    } catch (err) {

        console.log("========== MAIL JOB ERROR ==========");
        console.log("[MAIL] Error:", err);

        // --------------------------------------------------
        // Mark failed
        // --------------------------------------------------

        try {

            console.log("[MAIL] Updating failed status...");

            const [failedUpdate]: any = await conn.query(
                `
                UPDATE composed_mails
                SET status = 'failed'
                WHERE mail_id = ?
                `,
                [mailId]
            );

            console.log(
                "[MAIL] Failed status update completed:",
                failedUpdate
            );

        } catch (updateErr) {

            console.log(
                "[MAIL] FAILED to update mail status:",
                updateErr
            );
        }

    } finally {

        console.log("[MAIL] Releasing DB connection...");

        conn.release();

        console.log("[MAIL] DB connection released");
        console.log("========== MAIL JOB FINISHED ==========");
    }
};




// export const sendQueuedComposedMail = async (data: { mailId?: string }) => {
//     const { mailId } = data;

//     console.log("========== MAIL JOB START ==========");
//     console.log("[MAIL] mailId:", mailId);

//     if (!mailId) {
//         console.log("[MAIL] STOP: mailId is missing");
//         return;
//     }

//     console.log("[MAIL] Getting DB connection...");

//     const conn = await db.getConnection();

//     console.log("[MAIL] DB connection acquired");

//     try {
//         // --------------------------------------------------
//         // 1. Mark mail as processing
//         // --------------------------------------------------

//         console.log("[MAIL] Updating status -> processing...");

//         const [processingResult]: any = await conn.query(
//             `UPDATE composed_mails
//              SET status = 'processing'
//              WHERE mail_id = ? AND status != 'sent'`,
//             [mailId]
//         );

//         console.log("[MAIL] Status update completed:", processingResult);

//         // --------------------------------------------------
//         // 2. Fetch mail
//         // --------------------------------------------------

//         console.log("[MAIL] Fetching mail from database...");

//         const [result]: any = await conn.query(
//             "SELECT * FROM composed_mails WHERE mail_id = ? LIMIT 1",
//             [mailId]
//         );

//         console.log("[MAIL] Mail fetch completed");

//         const mailData = (result as ComposedMail[])[0];

//         if (!mailData) {
//             console.log("[MAIL] STOP: invalid mailId, mail not found:", mailId);
//             return;
//         }

//         console.log("[MAIL] Mail found:", {
//             mailId,
//             status: mailData.status,
//             recipientMode: mailData.recipient_mode,
//             subject: mailData.subject
//         });

//         if (mailData.status === "sent") {
//             console.log("[MAIL] STOP: mail is already sent");
//             return;
//         }

//         // --------------------------------------------------
//         // 3. Build recipient conditions
//         // --------------------------------------------------

//         console.log("[MAIL] Building recipient conditions...");

//         const conditions: string[] = [];

//         if (mailData.recipient_mode === "subscribers") {
//             conditions.push("vs.expires_at IS NOT NULL");
//         }

//         if (mailData.recipient_mode === "non_subscribers") {
//             conditions.push("vs.expires_at IS NULL");
//         }

//         console.log("[MAIL] Conditions:", conditions);

//         // --------------------------------------------------
//         // 4. Get recipients
//         // --------------------------------------------------

//         const baseSql = `
//             SELECT
//                 u.*,
//                 vs.package as active_sub,
//                 vs.expires_at as sub_expires_at
//             FROM users u
//             LEFT JOIN (
//                 SELECT *
//                 FROM subscriptions
//                 WHERE expires_at > NOW()
//             ) vs
//             ON u.user_id = vs.user_id
//         `;

//         type Recipient = Pick<User, "email" | "newsletter">;

//         let recipients: Recipient[] = [];

//         if (mailData.recipient_mode === "custom") {

//             console.log("[MAIL] Using custom audience");

//             recipients = mailData.recipients
//                 ? JSON.parse(mailData.recipients)
//                 : [];

//             console.log("[MAIL] Custom recipients:", recipients.length);

//         } else {

//             console.log("[MAIL] Fetching recipients from database...");

//             const sql = `
//                 ${baseSql}
//                 ${conditions.length > 0
//                     ? `WHERE ${conditions.join(" AND ")}`
//                     : ""
//                 }
//             `;

//             console.log("[MAIL] Recipient query starting...");

//             const [results]: [any[], any] = await conn.query(sql);

//             console.log(
//                 "[MAIL] Recipient query completed. Count:",
//                 results.length
//             );

//             recipients = results as Recipient[];
//         }

//         console.log("[MAIL] Total recipients:", recipients.length);

//         // --------------------------------------------------
//         // 5. Generate mail HTML
//         // --------------------------------------------------

//         console.log("[MAIL] Generating mail content...");

//         const html = await genMailContent({
//             mail_html: mailData.html_body
//         });

//         console.log("[MAIL] Mail content generated");

//         // --------------------------------------------------
//         // 6. Send emails
//         // --------------------------------------------------

//         const CHUNK_SIZE = 5;

//         let successfulCount = 0;
//         let failedCount = 0;

//         console.log("[MAIL] Starting email delivery...");
//         console.log("[MAIL] Chunk size:", CHUNK_SIZE);
//         console.log("[MAIL] Number of batches:", Math.ceil(recipients.length / CHUNK_SIZE));

//         for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {

//             const batch = recipients.slice(i, i + CHUNK_SIZE);

//             console.log("[MAIL] --------------------------------");
//             console.log("[MAIL] Starting batch:", {
//                 batchNumber: Math.floor(i / CHUNK_SIZE) + 1,
//                 batchSize: batch.length,
//                 startIndex: i
//             });

//             const tasks = batch.map(async (user) => {

//                 console.log("[MAIL] Starting send:", user.email);

//                 const payload: MailerPayload = {
//                     fromEmail: mailData.from_email,
//                     replyTo: mailData.reply_to,
//                     from: `${mailData.name} <${mailData.from_email}>`,
//                     to: user.email,
//                     subject: mailData.subject,
//                     html,
//                     text: mailData.text_body
//                 };

//                 console.log("[MAIL] Calling mailer.customSend:", user.email);

//                 const result = await mailer.customSend(payload);

//                 console.log("[MAIL] mailer.customSend completed:", user.email);

//                 return result;
//             });

//             console.log("[MAIL] Waiting for batch Promise.allSettled...");

//             const results = await Promise.allSettled(tasks);

//             console.log("[MAIL] Batch Promise.allSettled completed");

//             const successful = results.filter(
//                 r => r.status === "fulfilled"
//             ).length;

//             const failed = results.filter(
//                 r => r.status === "rejected"
//             ).length;

//             successfulCount += successful;
//             failedCount += failed;

//             console.log("[MAIL] Batch result:", {
//                 successful,
//                 failed,
//                 totalSuccessful: successfulCount,
//                 totalFailed: failedCount
//             });

//             results.forEach((result, index) => {
//                 if (result.status === "rejected") {
//                     console.log(
//                         "[MAIL] Individual mail failed:",
//                         batch[index]?.email,
//                         result.reason
//                     );
//                 }
//             });
//         }

//         // --------------------------------------------------
//         // 7. Determine final status
//         // --------------------------------------------------

//         console.log("[MAIL] All batches completed");

//         let finalStatus: "sent" | "failed" | "partial" = "sent";

//         if (successfulCount === 0 && failedCount > 0) {
//             finalStatus = "failed";
//         }

//         if (successfulCount > 0 && failedCount > 0) {
//             finalStatus = "partial";
//         }

//         console.log("[MAIL] Final result:", {
//             successfulCount,
//             failedCount,
//             finalStatus
//         });

//         // --------------------------------------------------
//         // 8. Update database
//         // --------------------------------------------------

//         console.log("[MAIL] Updating final mail status...");

//         const [finalUpdate]: any = await conn.query(
//             `
//             UPDATE composed_mails
//             SET
//                 status = ?,
//                 successful_count = ?,
//                 failed_count = ?,
//                 sent_at = NOW()
//             WHERE mail_id = ?
//             `,
//             [
//                 finalStatus,
//                 successfulCount,
//                 failedCount,
//                 mailId
//             ]
//         );

//         console.log("[MAIL] Final DB update completed:", finalUpdate);

//         // --------------------------------------------------
//         // 9. Completed
//         // --------------------------------------------------

//         console.log("Mail Job Completed:", {
//             mailId,
//             successfulCount,
//             failedCount,
//             finalStatus
//         });

//         console.log("========== MAIL JOB END ==========");

//     } catch (err) {

//         console.log("========== MAIL JOB ERROR ==========");
//         console.log("[MAIL] Error:", err);

//         // --------------------------------------------------
//         // Mark failed
//         // --------------------------------------------------

//         try {

//             console.log("[MAIL] Updating failed status...");

//             const [failedUpdate]: any = await conn.query(
//                 `
//                 UPDATE composed_mails
//                 SET status = 'failed'
//                 WHERE mail_id = ?
//                 `,
//                 [mailId]
//             );

//             console.log(
//                 "[MAIL] Failed status update completed:",
//                 failedUpdate
//             );

//         } catch (updateErr) {

//             console.log(
//                 "[MAIL] FAILED to update mail status:",
//                 updateErr
//             );
//         }

//     } finally {

//         console.log("[MAIL] Releasing DB connection...");

//         conn.release();

//         console.log("[MAIL] DB connection released");
//         console.log("========== MAIL JOB FINISHED ==========");
//     }
// };