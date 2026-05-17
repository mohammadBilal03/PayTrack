// This runs SERVER-SIDE only. The Resend API key is never sent to the browser.
import { Resend } from "resend";
import { buildEmailTemplate } from "@/lib/utils";

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json(
      { error: "RESEND_API_KEY is not set. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { invoice, emailType } = body;

  if (!invoice?.email || !invoice?.id) {
    return Response.json({ error: "Missing invoice.id or invoice.email" }, { status: 400 });
  }

  // ← THIS IS THE KEY PART — redirects all emails to your own address
  const testEmail = process.env.RESEND_TEST_EMAIL;
  const actualRecipient = testEmail || invoice.email;
  const isTestMode = !!testEmail;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, html } = buildEmailTemplate(invoice, emailType);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: [actualRecipient],                                     // ← sends to YOUR email
      subject: isTestMode ? `[TEST – to: ${invoice.email}] ${subject}` : subject,
      html,
    });

    if (error) {
      return Response.json({ error: `Resend error: ${error.message}` }, { status: 502 });
    }

    return Response.json({
      success: true,
      messageId: data.id,
      sentTo: actualRecipient,
      testMode: isTestMode,
      originalRecipient: invoice.email,
    });

  } catch (err) {
    return Response.json({ error: err.message || "Unexpected server error" }, { status: 500 });
  }
}