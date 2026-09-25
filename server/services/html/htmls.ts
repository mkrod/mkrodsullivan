import type { ContactForm } from "@/types/mail.types.js";

export const htmls: Record<string, (data: any) => string> = {
  contact_mail: (data: ContactForm) => {
    return `
            <div style="font-family: Arial, Helvetica, sans-serif; color: #171914; line-height: 1.6;">
                <h2 style="margin: 0 0 1.5rem; font-size: 1.5rem;">
                    New Contact Form Submission
                </h2>

                <div style="margin-bottom: 1.25rem;">
                    <strong>Name</strong>
                    <div>${data.name || "Not provided"}</div>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <strong>Email</strong>
                    <div>
                        <a
                            href="mailto:${data.email || ""}"
                            style="color: #8da900; text-decoration: none;"
                        >
                            ${data.email || "Not provided"}
                        </a>
                    </div>
                </div>

                ${data.service?.length ? `
                            <div style="margin-bottom: 1.25rem;">
                                <strong>Service</strong>
                                <div>${data.service.join(", ")}</div>
                            </div>
                        ` : ""}

                ${data.message ? `
                            <div>
                                <strong>Message</strong>
                                <div style="white-space: pre-wrap;">${data.message}</div>
                            </div>
                        ` : ""}
            </div>
        `;
  },
};



