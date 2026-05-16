import { useState } from "react";
import Modal from "./ui/Modal";
import { fmtDateTime } from "@/lib/utils";

const FREQUENCIES = [
  { label: "Every day",     days: 1  },
  { label: "Every 2 days",  days: 2  },
  { label: "Every 3 days",  days: 3  },
  { label: "Every 5 days",  days: 5  },
  { label: "Every week",    days: 7  },
  { label: "Every 2 weeks", days: 14 },
  { label: "Every month",   days: 30 },
];

/**
 * First send = frequencyDays from right now.
 * No start-date input — removes the confusion of "why is it showing tomorrow
 * when I picked every 7 days". The frequency itself defines the first send.
 */
function firstSendDate(frequencyDays) {
  const d = new Date();
  d.setDate(d.getDate() + Number(frequencyDays));
  return d.toISOString();
}

export default function ScheduleModal({ invoice, onClose, onSave }) {
  const existing = invoice.schedule;

  const [enabled,       setEnabled]       = useState(existing?.enabled ?? true);
  const [frequencyDays, setFrequencyDays] = useState(String(existing?.frequencyDays ?? 7));
  const [emailType,     setEmailType]     = useState(existing?.emailType ?? "reminder");

  // Recompute live so preview always reflects the current frequency selection
  const nextSendPreview = enabled ? firstSendDate(frequencyDays) : null;

  const inp = {
    background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
    padding: "10px 12px", color: "#f1f5f9", fontSize: 14,
    width: "100%", outline: "none", fontFamily: "var(--font-body)",
  };
  const lbl = { fontSize: 12, color: "#94a3b8", marginBottom: 5, display: "block", fontWeight: 500 };

  const handleSave = () => {
    onSave({
      enabled,
      frequencyDays: Number(frequencyDays),
      emailType,
      // Always recalculate from NOW when saving — not from a stored date
      nextSendDate:  enabled ? firstSendDate(frequencyDays) : null,
      createdAt:     existing?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <Modal title={`Schedule Reminders – ${invoice.id}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Invoice summary */}
        <div style={{ background: "#1e293b", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{invoice.client}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{invoice.description}</div>
        </div>

        {/* Enable / disable toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0c1426", borderRadius: 8, padding: "12px 14px", border: "1px solid #1e293b" }}>
          <div>
            <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>Auto-reminders</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Send reminder emails on a repeating schedule</div>
          </div>
          <button
            onClick={() => setEnabled(e => !e)}
            style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: enabled ? "#6366f1" : "#334155", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
          >
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: enabled ? 23 : 3, transition: "left 0.2s" }} />
          </button>
        </div>

        {enabled && (
          <>
            {/* Frequency picker */}
            <div>
              <label style={lbl}>How often to send</label>
              <select style={inp} value={frequencyDays} onChange={e => setFrequencyDays(e.target.value)}>
                {FREQUENCIES.map(f => (
                  <option key={f.days} value={f.days}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Email template */}
            <div>
              <label style={lbl}>Email template</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["reminder", "Friendly Reminder"], ["overdue", "Overdue Notice"]].map(([t, label]) => (
                  <button key={t} onClick={() => setEmailType(t)} style={{
                    flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer",
                    border: "1px solid", fontFamily: "var(--font-body)", fontSize: 13,
                    borderColor: emailType === t ? "#6366f1" : "#334155",
                    background:  emailType === t ? "#6366f130" : "#1e293b",
                    color:       emailType === t ? "#818cf8" : "#94a3b8",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview — shows exactly what will happen */}
            <div style={{ background: "#6366f110", border: "1px solid #6366f130", borderRadius: 8, padding: "14px 16px", lineHeight: 1.9 }}>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                📅 First email: <strong style={{ color: "#818cf8" }}>{fmtDateTime(nextSendPreview)}</strong>
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                🔁 Then every <strong style={{ color: "#818cf8" }}>{frequencyDays} day{Number(frequencyDays) > 1 ? "s" : ""}</strong> automatically
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                ✉ Template: <strong style={{ color: "#818cf8", textTransform: "capitalize" }}>{emailType}</strong>
              </div>
            </div>
          </>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 8, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{ flex: 2, padding: 11, borderRadius: 8, background: enabled ? "#6366f1" : "#334155", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-body)" }}>
            {enabled ? "Save Schedule" : "Disable Schedule"}
          </button>
        </div>

      </div>
    </Modal>
  );
}





// import { useState, useMemo } from "react";
// import Modal from "./ui/Modal";
// import { today } from "@/lib/utils";

// const FREQUENCIES = [
//   { label: "Every day", days: 1 },
//   { label: "Every 2 days", days: 2 },
//   { label: "Every 3 days", days: 3 },
//   { label: "Every 5 days", days: 5 },
//   { label: "Every week", days: 7 },
//   { label: "Every 2 weeks", days: 14 },
//   { label: "Every month", days: 30 },
// ];

// export default function ScheduleModal({
//   invoice,
//   onClose,
//   onSave,
// }) {
//   // SAFE COPY (VERY IMPORTANT)
//   const existing = useMemo(() => {
//     return invoice?.schedule
//       ? { ...invoice.schedule }
//       : null;
//   }, [invoice]);

//   const [enabled, setEnabled] = useState(
//     Boolean(existing?.enabled ?? true)
//   );

//   const [frequencyDays, setFrequency] =
//     useState(
//       Number(existing?.frequencyDays ?? 7)
//     );

//   const [emailType, setEmailType] =
//     useState(
//       existing?.emailType ?? "reminder"
//     );

//   const [startDate, setStartDate] =
//     useState(
//       existing?.nextSendDate
//         ? existing.nextSendDate.split("T")[0]
//         : today()
//     );

//   // ─────────────────────────────────────────────
//   // STYLES
//   // ─────────────────────────────────────────────

//   const inp = {
//     background: "#1e293b",

//     border: "1px solid #334155",

//     borderRadius: 8,

//     padding: "10px 12px",

//     color: "#f1f5f9",

//     fontSize: 14,

//     width: "100%",

//     outline: "none",

//     fontFamily: "var(--font-body)",
//   };

//   const lbl = {
//     fontSize: 12,

//     color: "#94a3b8",

//     marginBottom: 5,

//     display: "block",

//     fontWeight: 500,
//   };

//   // ─────────────────────────────────────────────
//   // SAVE
//   // ─────────────────────────────────────────────

//   const handleSave = () => {
//     if (enabled && !startDate) {
//       alert("Please set a start date");
//       return;
//     }

//     const nextSendDate = enabled
//       ? new Date(
//           `${startDate}T09:00:00`
//         ).toISOString()
//       : null;

//     // IMPORTANT:
//     // CREATE BRAND NEW OBJECT
//     // NEVER REUSE EXISTING REFERENCES

//     const schedule = {
//       enabled: Boolean(enabled),

//       frequencyDays: Number(
//         frequencyDays
//       ),

//       emailType: String(emailType),

//       nextSendDate,

//       lastSent:
//         existing?.lastSent ?? null,

//       createdAt:
//         existing?.createdAt ??
//         new Date().toISOString(),
//     };

//     onSave({ ...schedule });
//   };

//   return (
//     <Modal
//       title={`Schedule Reminders – ${invoice.id}`}
//       onClose={onClose}
//     >
//       <div
//         style={{
//           display: "flex",

//           flexDirection: "column",

//           gap: 16,
//         }}
//       >
//         {/* Invoice summary */}
//         <div
//           style={{
//             background: "#1e293b",

//             borderRadius: 8,

//             padding: "12px 14px",
//           }}
//         >
//           <div
//             style={{
//               fontSize: 13,

//               color: "#e2e8f0",

//               fontWeight: 600,
//             }}
//           >
//             {invoice.client}
//           </div>

//           <div
//             style={{
//               fontSize: 12,

//               color: "#64748b",

//               marginTop: 2,
//             }}
//           >
//             {invoice.description}
//           </div>
//         </div>

//         {/* TOGGLE */}
//         <div
//           style={{
//             display: "flex",

//             justifyContent:
//               "space-between",

//             alignItems: "center",

//             background: "#0c1426",

//             borderRadius: 8,

//             padding: "12px 14px",

//             border:
//               "1px solid #1e293b",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: 13,

//                 color: "#e2e8f0",

//                 fontWeight: 500,
//               }}
//             >
//               Auto-reminders
//             </div>

//             <div
//               style={{
//                 fontSize: 12,

//                 color: "#64748b",

//                 marginTop: 2,
//               }}
//             >
//               Send emails automatically
//               on a schedule
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={() =>
//               setEnabled((prev) => !prev)
//             }
//             style={{
//               width: 44,

//               height: 24,

//               borderRadius: 12,

//               border: "none",

//               cursor: "pointer",

//               background: enabled
//                 ? "#6366f1"
//                 : "#334155",

//               position: "relative",

//               transition:
//                 "background 0.2s",

//               flexShrink: 0,
//             }}
//           >
//             <div
//               style={{
//                 width: 18,

//                 height: 18,

//                 borderRadius: "50%",

//                 background: "#fff",

//                 position: "absolute",

//                 top: 3,

//                 left: enabled
//                   ? 23
//                   : 3,

//                 transition: "left 0.2s",
//               }}
//             />
//           </button>
//         </div>

//         {/* SETTINGS */}
//         {enabled && (
//           <>
//             {/* Frequency */}
//             <div>
//               <label style={lbl}>
//                 Frequency
//               </label>

//               <select
//                 style={inp}
//                 value={frequencyDays}
//                 onChange={(e) =>
//                   setFrequency(
//                     Number(e.target.value)
//                   )
//                 }
//               >
//                 {FREQUENCIES.map((f) => (
//                   <option
//                     key={f.days}
//                     value={f.days}
//                   >
//                     {f.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* EMAIL TYPE */}
//             <div>
//               <label style={lbl}>
//                 Email template
//               </label>

//               <div
//                 style={{
//                   display: "flex",

//                   gap: 8,
//                 }}
//               >
//                 {[
//                   "reminder",
//                   "overdue",
//                 ].map((t) => (
//                   <button
//                     type="button"
//                     key={t}
//                     onClick={() =>
//                       setEmailType(t)
//                     }
//                     style={{
//                       flex: 1,

//                       padding: "9px",

//                       borderRadius: 8,

//                       cursor: "pointer",

//                       border:
//                         "1px solid",

//                       fontFamily:
//                         "var(--font-body)",

//                       fontSize: 13,

//                       borderColor:
//                         emailType === t
//                           ? "#6366f1"
//                           : "#334155",

//                       background:
//                         emailType === t
//                           ? "#6366f130"
//                           : "#1e293b",

//                       color:
//                         emailType === t
//                           ? "#818cf8"
//                           : "#94a3b8",

//                       textTransform:
//                         "capitalize",
//                     }}
//                   >
//                     {t === "reminder"
//                       ? "Friendly Reminder"
//                       : "Overdue Notice"}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* DATE */}
//             <div>
//               <label style={lbl}>
//                 First send date
//               </label>

//               <input
//                 style={inp}
//                 type="date"
//                 value={startDate}
//                 onChange={(e) =>
//                   setStartDate(
//                     e.target.value
//                   )
//                 }
//               />

//               <div
//                 style={{
//                   fontSize: 11,

//                   color: "#475569",

//                   marginTop: 5,
//                 }}
//               >
//                 Emails send at 9:00 AM.
//                 After each send, the next
//                 one is scheduled{" "}
//                 {frequencyDays} day
//                 {frequencyDays > 1
//                   ? "s"
//                   : ""}{" "}
//                 later.
//               </div>
//             </div>

//             {/* PREVIEW */}
//             <div
//               style={{
//                 background: "#6366f110",

//                 border:
//                   "1px solid #6366f130",

//                 borderRadius: 8,

//                 padding: "12px 14px",

//                 fontSize: 13,

//                 color: "#94a3b8",

//                 lineHeight: 1.7,
//               }}
//             >
//               📅 First email on{" "}
//               <strong
//                 style={{
//                   color: "#818cf8",
//                 }}
//               >
//                 {startDate || "—"}
//               </strong>

//               <br />

//               🔁 Then every{" "}
//               <strong
//                 style={{
//                   color: "#818cf8",
//                 }}
//               >
//                 {frequencyDays} day
//                 {frequencyDays > 1
//                   ? "s"
//                   : ""}
//               </strong>{" "}
//               automatically

//               <br />

//               ✉ Template:{" "}
//               <strong
//                 style={{
//                   color: "#818cf8",

//                   textTransform:
//                     "capitalize",
//                 }}
//               >
//                 {emailType}
//               </strong>
//             </div>
//           </>
//         )}

//         {/* ACTIONS */}
//         <div
//           style={{
//             display: "flex",

//             gap: 10,
//           }}
//         >
//           <button
//             type="button"
//             onClick={onClose}
//             style={{
//               flex: 1,

//               padding: 11,

//               borderRadius: 8,

//               background: "#1e293b",

//               border:
//                 "1px solid #334155",

//               color: "#94a3b8",

//               cursor: "pointer",

//               fontFamily:
//                 "var(--font-body)",
//             }}
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleSave}
//             style={{
//               flex: 2,

//               padding: 11,

//               borderRadius: 8,

//               background: enabled
//                 ? "#6366f1"
//                 : "#334155",

//               border: "none",

//               color: "#fff",

//               cursor: "pointer",

//               fontWeight: 600,

//               fontFamily:
//                 "var(--font-body)",
//             }}
//           >
//             {enabled
//               ? "Save Schedule"
//               : "Disable Schedule"}
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }