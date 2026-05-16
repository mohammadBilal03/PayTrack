// import { useState, useMemo } from "react";
// import Badge from "./ui/Badge";
// import { fmt, fmtDate, daysOverdue } from "@/lib/utils";

// /**
//  * Responsive strategy:
//  *  Desktop (>640px) → standard 6-column grid table  (.invoice-table-row)
//  *  Mobile  (≤640px) → compact card per invoice      (.invoice-card)
//  *  CSS in globals.css toggles visibility between the two.
//  */

// const FILTERS = ["all", "pending", "overdue", "paid", "draft"];

// /**
//  * Full invoice list with real-time search + status filter.
//  */
// export default function InvoiceList({ invoices, onView, onEdit, onEmail, onMarkPaid, onDelete }) {
//   const [search, setSearch]           = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   // Combines search text + status filter with AND logic
//   const filtered = useMemo(() => {
//     const q = search.toLowerCase();
//     return invoices.filter((inv) => {
//       const matchSearch =
//         !q ||
//         inv.client.toLowerCase().includes(q) ||
//         inv.id.toLowerCase().includes(q) ||
//         inv.email.toLowerCase().includes(q) ||
//         (inv.description || "").toLowerCase().includes(q);
//       const matchStatus = filterStatus === "all" || inv.status === filterStatus;
//       return matchSearch && matchStatus;
//     });
//   }, [invoices, search, filterStatus]);

//   const inputStyle = {
//     background: "var(--bg-input)",
//     border: "1px solid var(--border)",
//     borderRadius: 8,
//     padding: "10px 14px",
//     color: "var(--text)",
//     fontSize: 13,
//     outline: "none",
//     fontFamily: "var(--font-body)",
//   };

//   const btnStyle = (active) => ({
//     padding: "8px 14px",
//     borderRadius: 8,
//     fontSize: 12,
//     fontWeight: 500,
//     cursor: "pointer",
//     border: "1px solid",
//     borderColor: active ? "#6366f1" : "var(--border)",
//     background: active ? "#6366f120" : "var(--bg-input)",
//     color: active ? "#818cf8" : "var(--text-muted)",
//     textTransform: "capitalize",
//     fontFamily: "var(--font-body)",
//     transition: "all 0.15s",
//   });

//   const actionBtn = (bg, border, color) => ({
//     padding: "6px 10px",
//     borderRadius: 6,
//     background: bg,
//     border: `1px solid ${border}`,
//     color,
//     cursor: "pointer",
//     fontSize: 12,
//     fontFamily: "var(--font-body)",
//   });

//   // const actionBtn = (bg, border, color) => ({
//   //   padding: "6px 10px", borderRadius: 6, background: bg,
//   //   border: `1px solid ${border}`, color, cursor: "pointer",
//   //   fontSize: 12, fontFamily: "var(--font-body)",
//   // });

//   // Reused in both desktop row and mobile card
//   const actionButtons = (inv) => (
//     <>
//       <button title="Send email" onClick={() => onEmail(inv)} style={actionBtn("#1e293b", "#334155", "#818cf8")}>✉</button>
//       {inv.status !== "paid" && (
//         <button title="Mark paid" onClick={() => onMarkPaid(inv.id)} style={actionBtn("#22c55e15", "#22c55e40", "#4ade80")}>✓</button>
//       )}
//       <button title="Edit" onClick={() => onEdit(inv)} style={actionBtn("#1e293b", "#334155", "#94a3b8")}>✏</button>
//       <button
//         title="Delete"
//         onClick={() => {
//           if (window.confirm(`Delete ${inv.id} for ${inv.client}? This cannot be undone.`)) {
//             onDelete(inv.id);
//           }
//         }}
//         style={actionBtn("transparent", "#ef444440", "#ef4444")}
//       >
//         🗑
//       </button>
//     </>
//   );

//   return (
//     <div>
//       {/* Header */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
//         <div>
//           <h1 style={{ fontSize: 22, fontFamily: "var(--font-display)", color: "#e2e8f0" }}>
//             Invoices
//           </h1>
//           <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
//             {filtered.length} of {invoices.length} shown
//           </div>
//         </div>
//       </div>

//       {/* Search + Filter bar — stacks vertically on mobile via .filter-row */}
//       <div className="filter-row">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by client, ID, email, description…"
//           style={{ ...inputStyle, flex: 1, minWidth: 200 }}
//         />
//         {/* .filter-pills scrolls horizontally on mobile so all pills stay on one line */}
//         <div className="filter-pills">
//           {FILTERS.map((f) => (
//             <button key={f} onClick={() => setFilterStatus(f)} style={btnStyle(filterStatus === f)}>
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       {filtered.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}>
//           <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
//           <div>No invoices match your search</div>
//         </div>
//       ) : (
//         <div
//           style={{
//             background: "var(--bg-card)",
//             border: "1px solid var(--border)",
//             borderRadius: 14,
//             overflow: "hidden",
//           }}
//         >
//           {/* Column headers — hidden on mobile via CSS */}
//           <div className="invoice-table-header">
//             <span>Client</span>
//             <span className="col-desc">Description</span>
//             <span>Due Date</span>
//             <span>Amount</span>
//             <span>Status</span>
//             <span>Actions</span>
//           </div>

//           {filtered.map((inv) => (
//             <div key={inv.id}>

//               {/* ── DESKTOP TABLE ROW (hidden on mobile) ──────────────────── */}
//               <div
//                 className="invoice-table-row"
//                 onClick={() => onView(inv)}
//               >
//                 <div>
//                   <div style={{ fontWeight: 500, color: "#e2e8f0", fontSize: 13 }}>{inv.client}</div>
//                   <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{inv.id}</div>
//                 </div>
//                 <div className="col-desc" style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                   {inv.description}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 13, color: inv.status === "overdue" ? "#ef4444" : "#94a3b8" }}>{fmtDate(inv.dueDate)}</div>
//                   {inv.status === "overdue" && <div style={{ fontSize: 11, color: "#ef444480" }}>{daysOverdue(inv)}d overdue</div>}
//                 </div>
//                 <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14 }}>{fmt(inv.amount)}</div>
//                 <div><Badge status={inv.status} /></div>
//                 <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
//                   {actionButtons(inv)}
//                 </div>
//               </div>

//               {/* ── MOBILE CARD (hidden on desktop) ───────────────────────── */}
//               <div className="invoice-card" onClick={() => onView(inv)}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
//                   <div>
//                     <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14 }}>{inv.client}</div>
//                     <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
//                       {inv.id} · Due {fmtDate(inv.dueDate)}
//                       {inv.status === "overdue" && (
//                         <span style={{ color: "#ef4444", marginLeft: 6 }}>({daysOverdue(inv)}d overdue)</span>
//                       )}
//                     </div>
//                   </div>
//                   <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15, flexShrink: 0, marginLeft: 12 }}>
//                     {fmt(inv.amount)}
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <Badge status={inv.status} />
//                   <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
//                     {actionButtons(inv)}
//                   </div>
//                 </div>
//               </div>

//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useMemo } from "react";
import Badge from "./ui/Badge";
import { fmt, fmtDate, daysOverdue } from "@/lib/utils";

/**
 * Responsive strategy:
 *  Desktop (>640px) → standard 6-column grid table  (.invoice-table-row)
 *  Mobile  (≤640px) → compact card per invoice      (.invoice-card)
 *  CSS in globals.css toggles visibility between the two.
 */

const FILTERS = ["all", "pending", "overdue", "paid", "draft"];

/**
 * Full invoice list with real-time search + status filter.
 */
export default function InvoiceList({ invoices, onView, onEdit, onEmail, onMarkPaid, onDelete }) {
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Combines search text + status filter with AND logic
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices.filter((inv) => {
      const matchSearch =
        !q ||
        inv.client.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.email.toLowerCase().includes(q) ||
        (inv.description || "").toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || inv.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, filterStatus]);

  const inputStyle = {
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
    fontFamily: "var(--font-body)",
  };

  const btnStyle = (active) => ({
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid",
    borderColor: active ? "#6366f1" : "var(--border)",
    background: active ? "#6366f120" : "var(--bg-input)",
    color: active ? "#818cf8" : "var(--text-muted)",
    textTransform: "capitalize",
    fontFamily: "var(--font-body)",
    transition: "all 0.15s",
  });

  const actionBtn = (bg, border, color) => ({
    padding: "6px 10px",
    borderRadius: 6,
    background: bg,
    border: `1px solid ${border}`,
    color,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "var(--font-body)",
  });

  // const actionBtn = (bg, border, color) => ({
  //   padding: "6px 10px", borderRadius: 6, background: bg,
  //   border: `1px solid ${border}`, color, cursor: "pointer",
  //   fontSize: 12, fontFamily: "var(--font-body)",
  // });

  // Reused in both desktop row and mobile card
  const actionButtons = (inv) => (
    <>
      <button title="Send email" onClick={() => onEmail(inv)} style={actionBtn("#1e293b", "#334155", "#818cf8")}>✉</button>
      {inv.status !== "paid" && (
        <button title="Mark paid" onClick={() => onMarkPaid(inv.id)} style={actionBtn("#22c55e15", "#22c55e40", "#4ade80")}>✓</button>
      )}
      <button title="Edit" onClick={() => onEdit(inv)} style={actionBtn("#1e293b", "#334155", "#94a3b8")}>✏</button>
      <button
        title="Delete"
        onClick={() => {
          if (window.confirm(`Delete ${inv.id} for ${inv.client}? This cannot be undone.`)) {
            onDelete(inv.id);
          }
        }}
        style={actionBtn("transparent", "#ef444440", "#ef4444")}
      >
        🗑
      </button>
    </>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontFamily: "var(--font-display)", color: "#e2e8f0" }}>
            Invoices
          </h1>
          <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
            {filtered.length} of {invoices.length} shown
          </div>
        </div>
      </div>

      {/* Search + Filter bar — stacks vertically on mobile via .filter-row */}
      <div className="filter-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client, ID, email, description…"
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        />
        {/* .filter-pills scrolls horizontally on mobile so all pills stay on one line */}
        <div className="filter-pills">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)} style={btnStyle(filterStatus === f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          <div>No invoices match your search</div>
        </div>
      ) : (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {/* Column headers — hidden on mobile via CSS */}
          <div className="invoice-table-header">
            <span>Client</span>
            <span className="col-desc">Description</span>
            <span>Due Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.map((inv) => (
            <div key={inv.id}>

              {/* ── DESKTOP TABLE ROW (hidden on mobile) ──────────────────── */}
              <div
                className="invoice-table-row"
                onClick={() => onView(inv)}
              >
                <div>
                  <div style={{ fontWeight: 500, color: "#e2e8f0", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    {inv.client}
                    {inv.schedule?.enabled && (
                      <span title="Auto-reminder on" style={{ fontSize: 10, background: "#f59e0b20", color: "#fbbf24", border: "1px solid #f59e0b30", borderRadius: 6, padding: "1px 5px" }}>⏰</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{inv.id}</div>
                </div>
                <div className="col-desc" style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {inv.description}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: inv.status === "overdue" ? "#ef4444" : "#94a3b8" }}>{fmtDate(inv.dueDate)}</div>
                  {inv.status === "overdue" && <div style={{ fontSize: 11, color: "#ef444480" }}>{daysOverdue(inv)}d overdue</div>}
                </div>
                <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14 }}>{fmt(inv.amount)}</div>
                <div><Badge status={inv.status} /></div>
                <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  {actionButtons(inv)}
                </div>
              </div>

              {/* ── MOBILE CARD (hidden on desktop) ───────────────────────── */}
              <div className="invoice-card" onClick={() => onView(inv)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    {inv.client}
                    {inv.schedule?.enabled && (
                      <span style={{ fontSize: 10, background: "#f59e0b20", color: "#fbbf24", border: "1px solid #f59e0b30", borderRadius: 6, padding: "1px 5px" }}>⏰</span>
                    )}
                  </div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                      {inv.id} · Due {fmtDate(inv.dueDate)}
                      {inv.status === "overdue" && (
                        <span style={{ color: "#ef4444", marginLeft: 6 }}>({daysOverdue(inv)}d overdue)</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15, flexShrink: 0, marginLeft: 12 }}>
                    {fmt(inv.amount)}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge status={inv.status} />
                  <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                    {actionButtons(inv)}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
