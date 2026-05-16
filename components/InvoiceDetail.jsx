// import Modal from "./ui/Modal";
// import Badge from "./ui/Badge";
// import { fmt, fmtDate, fmtDateTime } from "@/lib/utils";

// /**
//  * Invoice detail modal — shows all fields, reminder history,
//  * and action buttons (edit, send email, mark paid).
//  */
// export default function InvoiceDetail({
//   invoice, onClose, onStatusChange, onSendEmail, onEdit, onDelete, onSchedule,
// }) {
//   const row = (label, value, valueColor) => (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
//       <span style={{ fontSize: 13, color: "#64748b", flexShrink: 0 }}>{label}</span>
//       <span style={{ fontSize: 13, color: valueColor ?? "#cbd5e1", textAlign: "right" }}>{value}</span>
//     </div>
//   );

//   const actionBtn = (label, onClick, bg, border, color) => (
//     <button
//       onClick={onClick}
//       style={{
//         flex: 1,
//         padding: "9px 0",
//         borderRadius: 8,
//         background: bg,
//         border: `1px solid ${border}`,
//         color,
//         cursor: "pointer",
//         fontSize: 13,
//         fontFamily: "var(--font-body)",
//         fontWeight: 500,
//       }}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <Modal title={`Invoice ${invoice.id}`} onClose={onClose}>
//       <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

//         {/* Amount + description header */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//           <div>
//             <div style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", fontFamily: "var(--font-display)" }}>
//               {fmt(invoice.amount)}
//             </div>
//             <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
//               {invoice.description}
//             </div>
//           </div>
//           <Badge status={invoice.status} />
//         </div>

//         <hr style={{ border: "none", borderTop: "1px solid #1e293b" }} />

//         {/* Fields */}
//         {row("Client", invoice.client)}
//         {row("Email", invoice.email, "#818cf8")}
//         {row("Invoice ID", invoice.id)}
//         {row("Issue Date", fmtDate(invoice.issueDate))}
//         {row("Due Date", fmtDate(invoice.dueDate), invoice.status === "overdue" ? "#ef4444" : undefined)}

//         <hr style={{ border: "none", borderTop: "1px solid #1e293b" }} />

//         {/* Reminder history */}
//         <div>
//           <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
//             Reminder History ({invoice.reminders.length})
//           </div>
//           {invoice.reminders.length === 0 ? (
//             <div style={{ fontSize: 13, color: "#334155", fontStyle: "italic" }}>No reminders sent yet</div>
//           ) : (
//             invoice.reminders.map((r, i) => (
//               <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
//                 <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.type === "auto" ? "#f59e0b" : "#6366f1", marginTop: 6, flexShrink: 0 }} />
//                 <div>
//                   <div style={{ fontSize: 11, color: "#94a3b8" }}>
//                     {fmtDateTime(r.date)} ·{" "}
//                     <span style={{ color: r.type === "auto" ? "#f59e0b" : "#64748b", textTransform: "capitalize" }}>
//                       {r.type}
//                     </span>
//                   </div>
//                   <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 1 }}>{r.note}</div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Schedule info */}
//         {invoice.schedule?.enabled && (
//           <div style={{ background: "#6366f110", border: "1px solid #6366f130", borderRadius: 8, padding: "10px 14px" }}>
//             <div style={{ fontSize: 12, color: "#818cf8", fontWeight: 600, marginBottom: 4 }}>⏰ Auto-reminder active</div>
//             <div style={{ fontSize: 12, color: "#64748b" }}>
//               Every {invoice.schedule.frequencyDays} day{invoice.schedule.frequencyDays > 1 ? "s" : ""} ·{" "}
//               Next: {fmtDateTime(invoice.schedule.nextSendDate)}
//             </div>
//           </div>
//         )}

//         <hr style={{ border: "none", borderTop: "1px solid #1e293b" }} />

//         {/* Actions */}
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           {actionBtn("✏ Edit", () => onEdit(invoice), "#1e293b", "#334155", "#94a3b8")}
//           {actionBtn("✉ Send Email", () => onSendEmail(invoice), "#6366f130", "#6366f1", "#818cf8")}
//           {actionBtn("⏰ Schedule", () => onSchedule(invoice), "#f59e0b20", "#f59e0b", "#fbbf24")}
//           {invoice.status !== "paid" &&
//             actionBtn("✓ Mark Paid", () => { onStatusChange(invoice.id, "paid"); onClose(); }, "#22c55e20", "#22c55e", "#4ade80")}
//         </div>

//         {/* Delete — separated visually so it's harder to hit by accident */}
//         <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
//           <button
//             onClick={() => {
//               if (window.confirm(`Delete ${invoice.id} for ${invoice.client}? This cannot be undone.`)) {
//                 onDelete(invoice.id);
//               }
//             }}
//             style={{
//               width: "100%",
//               padding: "9px",
//               borderRadius: 8,
//               background: "transparent",
//               border: "1px solid #ef444440",
//               color: "#ef4444",
//               cursor: "pointer",
//               fontSize: 13,
//               fontFamily: "var(--font-body)",
//             }}
//           >
//             🗑 Delete Invoice
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }


import { useState } from "react";
import Modal from "./ui/Modal";
import Badge from "./ui/Badge";
import { fmt, fmtDate, fmtDateTime } from "@/lib/utils";

const LOG_TYPES = [
  { type: "call",   icon: "📞", label: "Phone Call"  },
  { type: "manual", icon: "✏",  label: "Manual Note" },
];

export default function InvoiceDetail({
  invoice, onClose, onStatusChange, onSendEmail,
  onEdit, onDelete, onSchedule, onDisableSchedule, onLogActivity,
}) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [logType, setLogType]         = useState("call");
  const [logNote, setLogNote]         = useState("");

  const handleLog = () => {
    if (!logNote.trim()) return;
    onLogActivity(invoice.id, logType, logNote.trim());
    setLogNote("");
    setShowLogForm(false);
  };

  const row = (label, value, valueColor) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <span style={{ fontSize: 13, color: "#64748b", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: valueColor ?? "#cbd5e1", textAlign: "right" }}>{value}</span>
    </div>
  );

  const btn = (label, onClick, bg, border, color) => (
    <button onClick={onClick} style={{
      flex: 1, padding: "9px 0", borderRadius: 8, background: bg,
      border: `1px solid ${border}`, color, cursor: "pointer",
      fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500,
    }}>
      {label}
    </button>
  );

  const hasSchedule = invoice.schedule?.enabled;

  return (
    <Modal title={`Invoice ${invoice.id}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Amount + badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", fontFamily: "var(--font-display)" }}>
              {fmt(invoice.amount)}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{invoice.description}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <Badge status={invoice.status} />
            {hasSchedule && (
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 600,
                background: "#f59e0b20", color: "#fbbf24", border: "1px solid #f59e0b30",
              }}>
                ⏰ Auto on
              </span>
            )}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #1e293b" }} />

        {row("Client",     invoice.client)}
        {row("Email",      invoice.email, "#818cf8")}
        {row("Invoice ID", invoice.id)}
        {row("Issue Date", fmtDate(invoice.issueDate))}
        {row("Due Date",   fmtDate(invoice.dueDate), invoice.status === "overdue" ? "#ef4444" : undefined)}

        <hr style={{ border: "none", borderTop: "1px solid #1e293b" }} />

        {/* Active schedule panel with one-click Turn off */}
        {hasSchedule && (
          <div style={{ background: "#f59e0b10", border: "1px solid #f59e0b30", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600, marginBottom: 4 }}>⏰ Auto-reminder active</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Every {invoice.schedule.frequencyDays} day{invoice.schedule.frequencyDays > 1 ? "s" : ""} · {invoice.schedule.emailType}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  Next: <span style={{ color: "#94a3b8" }}>{fmtDateTime(invoice.schedule.nextSendDate)}</span>
                </div>
              </div>
              <button
                onClick={() => onDisableSchedule(invoice.id)}
                style={{ padding: "5px 12px", borderRadius: 6, background: "transparent", border: "1px solid #ef444440", color: "#f87171", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-body)", flexShrink: 0 }}
              >
                Turn off
              </button>
            </div>
          </div>
        )}

        {/* Reminder history — newest first */}
        <div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Reminder History ({invoice.reminders.length})
          </div>

          {invoice.reminders.length === 0 ? (
            <div style={{ fontSize: 13, color: "#334155", fontStyle: "italic" }}>No reminders sent yet</div>
          ) : (
            [...invoice.reminders].reverse().map((r, i) => {
              const dotColor =
                r.type === "auto"   ? "#f59e0b" :
                r.type === "call"   ? "#34d399" :
                r.type === "email"  ? "#818cf8" : "#64748b";
              return (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {fmtDateTime(r.date)} · <span style={{ color: dotColor, textTransform: "capitalize" }}>{r.type}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 1 }}>{r.note}</div>
                  </div>
                </div>
              );
            })
          )}

          {/* Log a call or note */}
          {showLogForm ? (
            <div style={{ marginTop: 12, background: "#1e293b", borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {LOG_TYPES.map((t) => (
                  <button key={t.type} onClick={() => setLogType(t.type)} style={{
                    flex: 1, padding: "7px", borderRadius: 6, cursor: "pointer",
                    border: "1px solid", fontFamily: "var(--font-body)", fontSize: 12,
                    borderColor: logType === t.type ? "#6366f1" : "#334155",
                    background:  logType === t.type ? "#6366f130" : "transparent",
                    color:       logType === t.type ? "#818cf8" : "#64748b",
                  }}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <input
                autoFocus
                value={logNote}
                onChange={(e) => setLogNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLog()}
                placeholder={logType === "call" ? "Called client, left voicemail…" : "Add a note…"}
                style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 6, padding: "9px 12px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "var(--font-body)" }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowLogForm(false)} style={{ flex: 1, padding: "8px", borderRadius: 6, background: "transparent", border: "1px solid #334155", color: "#64748b", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13 }}>Cancel</button>
                <button onClick={handleLog} disabled={!logNote.trim()} style={{ flex: 2, padding: "8px", borderRadius: 6, background: "#6366f1", border: "none", color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, opacity: logNote.trim() ? 1 : 0.5 }}>Save Note</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowLogForm(true)} style={{ marginTop: 8, fontSize: 12, color: "#475569", background: "none", border: "1px dashed #334155", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
              + Log a call or note
            </button>
          )}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #1e293b" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {btn("✏ Edit",       () => onEdit(invoice),              "#1e293b",   "#334155", "#94a3b8")}
          {btn("✉ Send Email", () => onSendEmail(invoice),          "#6366f130", "#6366f1", "#818cf8")}
          {btn("⏰ Schedule",  () => onSchedule(invoice),           "#f59e0b20", "#f59e0b", "#fbbf24")}
          {invoice.status !== "paid" &&
            btn("✓ Mark Paid", () => { onStatusChange(invoice.id, "paid"); onClose(); }, "#22c55e20", "#22c55e", "#4ade80")}
        </div>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
          <button
            onClick={() => { if (window.confirm(`Delete ${invoice.id}? This cannot be undone.`)) onDelete(invoice.id); }}
            style={{ width: "100%", padding: "9px", borderRadius: 8, background: "transparent", border: "1px solid #ef444440", color: "#ef4444", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)" }}
          >
            🗑 Delete Invoice
          </button>
        </div>

      </div>
    </Modal>
  );
}
