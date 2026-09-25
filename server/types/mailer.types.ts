export interface MailerPayload {
    fromEmail?: string; //for auth
    replyTo?: string | null;
    from: string;
    to: string[] | string;
    subject: string;
    text?: string;
    html?: string;

    retries?: number;
}