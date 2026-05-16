// // This runs SERVER-SIDE only. The Resend API key is never sent to the browser.
 
// import { Resend } from "resend";
// import { buildEmailTemplate } from "@/lib/utils";
 
// export async function POST(request) {
//   // ── 1. Check env variable FIRST ─────────────────────────────────────────────
//   // This is the most common cause of the "<!DOCTYPE" error:
//   // the key is missing, Resend throws, Next.js returns an HTML crash page.
//   if (!process.env.RESEND_API_KEY) {
//     return Response.json(
//       {
//         error:
//           "RESEND_API_KEY is not set. Create a .env.local file in your project root and add: RESEND_API_KEY=re_yourkey",
//       },
//       { status: 500 }
//     );
//   }
 
//   // ── 2. Parse request body ────────────────────────────────────────────────────
//   let body;
//   try {
//     body = await request.json();
//   } catch {
//     return Response.json({ error: "Invalid request body — expected JSON" }, { status: 400 });
//   }
 
//   const { invoice, emailType } = body;
 
//   // ── 3. Validate inputs ───────────────────────────────────────────────────────
//   if (!invoice?.email || !invoice?.id) {
//     return Response.json(
//       { error: "Missing required fields: invoice.id and invoice.email" },
//       { status: 400 }
//     );
//   }
 
//   if (!["reminder", "overdue"].includes(emailType)) {
//     return Response.json(
//       { error: "emailType must be 'reminder' or 'overdue'" },
//       { status: 400 }
//     );
//   }
 
//   // ── 4. Build and send email ──────────────────────────────────────────────────
//   try {
//     const resend = new Resend(process.env.RESEND_API_KEY);
//     const { subject, html } = buildEmailTemplate(invoice, emailType);
 
//     const { data, error } = await resend.emails.send({
//       from: process.env.EMAIL_FROM || "onboarding@resend.dev",
//       to: [invoice.email],
//       subject,
//       html,
//     });
 
//     if (error) {
//       // Resend returned a structured error (bad key, unverified domain, etc.)
//       console.error("Resend API error:", error);
//       return Response.json(
//         { error: `Resend error: ${error.message}` },
//         { status: 502 }
//       );
//     }
 
//     return Response.json({
//       success: true,
//       messageId: data.id,
//       sentTo: invoice.email,
//     });
 
//   } catch (err) {
//     // Unexpected crash — log it and return JSON (never let it become HTML)
//     console.error("send-reminder unexpected error:", err);
//     return Response.json(
//       { error: err.message || "Unexpected server error" },
//       { status: 500 }
//     );
//   }
// }

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