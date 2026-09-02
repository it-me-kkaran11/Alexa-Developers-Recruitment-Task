import { Resend } from "resend";
import RegistrationConfirmationEmail from "@/emails/RegistrationConfirmation";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@workshop.dev";

export const resend = apiKey ? new Resend(apiKey) : null;

export interface EmailData {
  to: string;
  attendeeName: string;
  workshopName: string;
  registrationNumber: string;
  date: string;
  time: string;
  location: string;
  amount: string;
}

export async function sendConfirmationEmail(
  data: EmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    // If Resend is not configured, log and return success to not block payment flow
    if (!resend) {
      console.warn("Resend API key not configured, skipping email");
      return { success: true };
    }

    const result = await resend.emails.send({
      from: fromEmail,
      to: data.to,
      subject: `Registration Confirmed: ${data.workshopName}`,
      react: RegistrationConfirmationEmail(data),
    });

    if (result.error) {
      console.error("Email send error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected email error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown email error",
    };
  }
}
