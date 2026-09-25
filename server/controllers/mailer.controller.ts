import { type CreateEmailOptions, Resend } from 'resend';
import type { MailerPayload } from '../types/mailer.types.js';
import { createTransport } from "nodemailer";


export type MailSender = "INFO" | "NOREPLY" | "SUPPORT" | "CONTACT";

const resend = new Resend(process.env.RESEND_KEY);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


const send = async (payload: MailerPayload): Promise<any> => {
    const retries = payload.retries ?? 20;

    try {
        const res = await resend.emails.send(payload as CreateEmailOptions);
        if (res.error) throw new Error(JSON.stringify(res.error));
        return res;
    } catch (err) {
        if (retries > 0) {
            console.log("Retrying email in 10 seconds...", retries);
            await delay(10000); //10seconds
            return send({ ...payload, retries: retries - 1 }); // ✅ return + await chain
        }
        throw err;
    }
};

const transporter = (u: string) => {
    const user = u || process.env[`SMTP_${u}_USER`];
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT || "587");

    if (!user || !pass) {
        throw new Error("Invalid mail credentials");
    }

    return createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        },
    })
}


const customSend = async (payload: MailerPayload): Promise<any> => {
    const retries = payload.retries ?? 20;

    try {
        if (!payload.fromEmail) return;
        //console.log("NodeMailer :", { payload })
        const tp = transporter(payload.fromEmail);
        const { fromEmail, ...rest } = payload;
        return tp.sendMail({ ...rest, replyTo: rest.replyTo || undefined });
    } catch (err) {
        if (retries > 0) {
            console.log(`Error - ${err} BUT Retrying email in 10 seconds... ${retries}`);
            await delay(10000); //10seconds
            return send({ ...payload, retries: retries - 1 }); // ✅ return + await chain
        }
        throw err;
    }
};


export const mailer = {
    send,
    customSend,
}