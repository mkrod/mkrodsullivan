import type { User } from "./user.types.js";

export interface ComposeMailOption {
    audience: "all" | "subscribers" | "non_subscribers" | "custom";
    custom_audience: Partial<User>[];
}

export interface ComposeMailPayload {
    from_email: string;
    replyTo?: string;
    name: string;
    subject: string;
    html: string;
    text?: string;
    options: ComposeMailOption;
}

export interface ContactForm {
    service?: string[];
    name?: string;
    email?: string;
    message?: string;
}

export type ComposedMailStatus = "queued" | "failed" | "sent" | "draft";

export interface ComposedMail {
    mail_id: string;
    admin_id: string;
    smtp_message_id?: string;
    from_email: string;
    reply_to: string | null;
    name: string;
    recipients: string; // JSON stringified
    recipient_mode: ComposeMailOption['audience'];
    subject: string;
    text_body: string;
    html_body: string;
    status: ComposedMailStatus;
    smtp_response?: string;
    created_at: string;
    sent_at?: string;
}