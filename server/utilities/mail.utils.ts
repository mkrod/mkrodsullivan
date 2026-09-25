import type { ComposeMailPayload } from "../types/mail.types.js";

export const validateComposeMailPayload = (data: Partial<ComposeMailPayload>): { error?: string | undefined } => {
    let error: string | undefined = undefined;
    if (!data.from_email) {
        error = "Sender Email is required!";
    }
    if (!data.subject) {
        error = "Subject Email is required!";
    }
    if (!data.name) {
        error = "Sender Name is required!";
    }
    if (data?.options?.audience === "custom" && data.options.custom_audience.length === 0) {
        error = "Please Select atleast one recipient!";
    }
    if (!data.html?.trim() && !data.text?.trim()) {
        error = "Please Compose Mail body!";
    }
    return { error }
}