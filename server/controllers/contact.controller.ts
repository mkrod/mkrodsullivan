import crypto from "crypto";
import { db } from "@/config/db.config.js";
import { htmls } from "@/services/html/htmls.js";
import { richMailTemplate } from "@/services/html/mail_template.js";
import type { ContactForm } from "@/types/mail.types.js";
import type { Request, Response } from "express";
import { mailer } from "./mailer.controller.js";

export const sendContactMessage = async (req: Request, res: Response) => {
    const data = req.body as ContactForm;

    if (
        !data.email ||
        !data.name ||
        (!data.message && !data.service?.length)
    ) {
        return res.status(400).json({
            status: 400,
            message: "Required fields are missing",
        });
    }

    const adminId = "mkrodsullivan";
    const recipient = "mkrodsullivan@gmail.com";

    const content = htmls.contact_mail?.(data) ||
        `${data.message || ""} from ${data.email}`;

    const text = data.message || "";

    const emailConfigs = {
        from_email: "contact@mkrodsullivan.com",
        name: "Portfolio",
        email: data.email,
        subject: `Portfolio Contact — ${data.name}`,
        html: content,
    };

    const { from_email, name, email, subject, html } = emailConfigs;

    try {
        const mailId = crypto.randomUUID();
        const recipient_mode = "custom";

        const recipients = JSON.stringify([
            {
                email: recipient,
            },
        ]);

        console.log("Inserting..")
        await db.query(
            `
                INSERT INTO composed_mails
                (
                    mail_id,
                    admin_id,
                    from_email,
                    reply_to,
                    name,
                    recipient_mode,
                    recipients,
                    subject,
                    text_body,
                    html_body
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                mailId,
                adminId,
                from_email,
                email,
                name,
                recipient_mode,
                recipients,
                subject,
                text || null,
                html || null,
            ],
        );

        const htmlData = await richMailTemplate({
            mail_html: html,
        });

        await mailer.send({
            replyTo: email,
            from: `"${name}" <${from_email}>`,
            to: recipient,
            subject,
            html: htmlData,
        });

        return res.status(200).json({
            status: 200,
            message: "Message sent successfully",
        });
    } catch (err) {
        console.error(
            "Error sending contact message:",
            err,
        );

        const message = err instanceof Error
            ? err.message
            : "Internal server error";

        return res.status(500).json({
            status: 500,
            message,
        });
    }
};