// // ─── Formatting helpers ───────────────────────────────────────────────────────

// /** Format a number as Indian Rupees: ₹1,20,000 */
// export const fmt = (n) =>
//   "₹" + Number(n).toLocaleString("en-IN");

// /** Format an ISO date string: "01 Apr 2025" */
// export const fmtDate = (d) =>
//   new Date(d).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

// /** Today's date as YYYY-MM-DD (for date input default values) */
// export const today = () => new Date().toISOString().split("T")[0];

// // ─── Invoice logic ────────────────────────────────────────────────────────────

// /**
//  * Returns true if an invoice is past its due date and not paid/draft.
//  * Used on app load to auto-transition pending → overdue.
//  */
// export const isOverdue = (inv) =>
//   inv.status !== "paid" &&
//   inv.status !== "draft" &&
//   new Date(inv.dueDate) < new Date();

// /** How many days ago was the invoice due? */
// export const daysOverdue = (inv) =>
//   Math.floor((Date.now() - new Date(inv.dueDate)) / 86_400_000);

// // ─── Email template builder ───────────────────────────────────────────────────
// // Returns { subject, html } ready to pass to Resend.
// // Keeping templates here (not in the API route) means they can be previewed
// // on the client side before sending.

// export function buildEmailTemplate(invoice, type = "reminder") {
//   const amount = fmt(invoice.amount);
//   const due = fmtDate(invoice.dueDate);
//   const id = invoice.id;
//   const client = invoice.client;

//   if (type === "overdue") {
//     return {
//       subject: `OVERDUE: Invoice ${id} – ${amount} requires immediate attention`,
//       html: `
//         <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
//           <div style="background:#ef4444;padding:24px;border-radius:12px 12px 0 0">
//             <h1 style="margin:0;color:#fff;font-size:20px">⚠ Overdue Invoice</h1>
//           </div>
//           <div style="background:#f8fafc;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0">
//             <p>Dear <strong>${client}</strong>,</p>
//             <p>Your invoice <strong>${id}</strong> for <em>${invoice.description}</em> is now <strong style="color:#ef4444">overdue</strong>.</p>
//             <div style="background:#fff;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0">
//               <div style="display:flex;justify-content:space-between;margin-bottom:8px">
//                 <span style="color:#64748b">Invoice</span><strong>${id}</strong>
//               </div>
//               <div style="display:flex;justify-content:space-between;margin-bottom:8px">
//                 <span style="color:#64748b">Due Date</span><strong style="color:#ef4444">${due}</strong>
//               </div>
//               <div style="display:flex;justify-content:space-between">
//                 <span style="color:#64748b">Amount Due</span><strong style="font-size:18px">${amount}</strong>
//               </div>
//             </div>
//             <p>Please arrange payment immediately to avoid any service interruption.</p>
//             <p>If you have already paid, please ignore this message or reply to confirm.</p>
//             <p style="margin-top:28px;color:#64748b;font-size:13px">
//               This is an automated reminder from PayTrack.
//             </p>
//           </div>
//         </div>
//       `,
//     };
//   }

//   // Default: friendly reminder
//   return {
//     subject: `Payment Reminder: Invoice ${id} – ${amount} due ${due}`,
//     html: `
//       <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
//         <div style="background:#6366f1;padding:24px;border-radius:12px 12px 0 0">
//           <h1 style="margin:0;color:#fff;font-size:20px">Payment Reminder</h1>
//         </div>
//         <div style="background:#f8fafc;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0">
//           <p>Dear <strong>${client}</strong>,</p>
//           <p>This is a friendly reminder that the following invoice is due for payment.</p>
//           <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0">
//             <div style="display:flex;justify-content:space-between;margin-bottom:8px">
//               <span style="color:#64748b">Invoice</span><strong>${id}</strong>
//             </div>
//             <div style="display:flex;justify-content:space-between;margin-bottom:8px">
//               <span style="color:#64748b">Description</span><span>${invoice.description}</span>
//             </div>
//             <div style="display:flex;justify-content:space-between;margin-bottom:8px">
//               <span style="color:#64748b">Due Date</span><strong>${due}</strong>
//             </div>
//             <div style="display:flex;justify-content:space-between">
//               <span style="color:#64748b">Amount Due</span><strong style="font-size:18px">${amount}</strong>
//             </div>
//           </div>
//           <p>Please process payment at your earliest convenience. Reply to this email if you have any questions.</p>
//           <p style="margin-top:28px;color:#64748b;font-size:13px">
//             This is an automated reminder from PayTrack.
//           </p>
//         </div>
//       </div>
//     `,
//   };
// }

// ─── Formatting helpers ───────────────────────────────────────────────────────
 
/** Format a number as Indian Rupees: ₹1,20,000 */
export const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");
 
/** Format an ISO date string: "01 Apr 2025" */
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
 
/** Format date + time: "16 May 2025, 2:32 PM" */
export const fmtDateTime = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};
 
/** Today's date as YYYY-MM-DD (for date input default values) */
export const today = () => new Date().toISOString().split("T")[0];
 
/** Full ISO timestamp for reminder logs: includes date + time */
export const nowISO = () => new Date().toISOString();
 
// ─── Invoice logic ────────────────────────────────────────────────────────────
 
/**
 * Returns true if an invoice is past its due date and not paid/draft.
 * Used on app load to auto-transition pending → overdue.
 */
export const isOverdue = (inv) =>
  inv.status !== "paid" &&
  inv.status !== "draft" &&
  new Date(inv.dueDate) < new Date();
 
/** How many days ago was the invoice due? */
export const daysOverdue = (inv) =>
  Math.floor((Date.now() - new Date(inv.dueDate)) / 86_400_000);
 
// ─── Email template builder ───────────────────────────────────────────────────
// Returns { subject, html } ready to pass to Resend.
// Keeping templates here (not in the API route) means they can be previewed
// on the client side before sending.
 
export function buildEmailTemplate(invoice, type = "reminder") {
  const amount = fmt(invoice.amount);
  const due = fmtDate(invoice.dueDate);
  const id = invoice.id;
  const client = invoice.client;
 
  if (type === "overdue") {
    return {
      subject: `OVERDUE: Invoice ${id} – ${amount} requires immediate attention`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <div style="background:#ef4444;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="margin:0;color:#fff;font-size:20px">⚠ Overdue Invoice</h1>
          </div>
          <div style="background:#f8fafc;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0">
            <p>Dear <strong>${client}</strong>,</p>
            <p>Your invoice <strong>${id}</strong> for <em>${invoice.description}</em> is now <strong style="color:#ef4444">overdue</strong>.</p>
            <div style="background:#fff;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="color:#64748b">Invoice</span><strong>${id}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="color:#64748b">Due Date</span><strong style="color:#ef4444">${due}</strong>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="color:#64748b">Amount Due</span><strong style="font-size:18px">${amount}</strong>
              </div>
            </div>
            <p>Please arrange payment immediately to avoid any service interruption.</p>
            <p>If you have already paid, please ignore this message or reply to confirm.</p>
            <p style="margin-top:28px;color:#64748b;font-size:13px">
              This is an automated reminder from PayTrack.
            </p>
          </div>
        </div>
      `,
    };
  }
 
  // Default: friendly reminder
  return {
    subject: `Payment Reminder: Invoice ${id} – ${amount} due ${due}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#6366f1;padding:24px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;color:#fff;font-size:20px">Payment Reminder</h1>
        </div>
        <div style="background:#f8fafc;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0">
          <p>Dear <strong>${client}</strong>,</p>
          <p>This is a friendly reminder that the following invoice is due for payment.</p>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#64748b">Invoice</span><strong>${id}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#64748b">Description</span><span>${invoice.description}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="color:#64748b">Due Date</span><strong>${due}</strong>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:#64748b">Amount Due</span><strong style="font-size:18px">${amount}</strong>
            </div>
          </div>
          <p>Please process payment at your earliest convenience. Reply to this email if you have any questions.</p>
          <p style="margin-top:28px;color:#64748b;font-size:13px">
            This is an automated reminder from PayTrack.
          </p>
        </div>
      </div>
    `,
  };
}