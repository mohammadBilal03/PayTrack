import { useMemo, useState } from "react";
import Badge from "./ui/Badge";
import { fmt, fmtDate, fmtDateTime } from "@/lib/utils";

const TYPE_CONFIG = {
  email:  { label: "Email",  color: "#818cf8", bg: "#6366f120", icon: "✉"  },
  auto:   { label: "Auto",   color: "#fbbf24", bg: "#f59e0b20", icon: "⏰" },
  call:   { label: "Call",   color: "#34d399", bg: "#22c55e20", icon: "📞" },
  manual: { label: "Manual", color: "#94a3b8", bg: "#1e293b",   icon: "✏"  },
};

export default function ReminderHistory({ invoices }) {
  const [typeFilter, setTypeFilter] = useState("all");

  // Flatten all reminders from all invoices, newest first
  const allReminders = useMemo(() => {
    const entries = [];
    for (const inv of invoices) {
      for (const r of (inv.reminders || [])) {
        entries.push({ ...r, invoice: inv });
      }
    }
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices]);

  // Active scheduled invoices
  const scheduled = useMemo(() =>
    invoices
      .filter(i => i.schedule?.enabled && i.status !== "paid")
      .sort((a, b) => new Date(a.schedule.nextSendDate) - new Date(b.schedule.nextSendDate)),
    [invoices]
  );

  const filtered = typeFilter === "all"
    ? allReminders
    : allReminders.filter(r => r.type === typeFilter);

  const pillStyle = (active) => ({
    padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
    cursor: "pointer", border: "1px solid", fontFamily: "var(--font-body)",
    borderColor: active ? "#6366f1" : "#1e293b",
    background:  active ? "#6366f120" : "#0f172a",
    color:       active ? "#818cf8"   : "#64748b",
    whiteSpace: "nowrap", flexShrink: 0,
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontFamily: "var(--font-display)", color: "#e2e8f0" }}>
          Reminder Activity
        </h1>
        <p style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
          {allReminders.length} total reminder{allReminders.length !== 1 ? "s" : ""} across {invoices.length} invoices
        </p>
      </div>

      {/* ── Active Schedules ─────────────────────────────────────────────────── */}
      {scheduled.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            Active Schedules ({scheduled.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scheduled.map(inv => {
              const isDue = new Date(inv.schedule.nextSendDate) < new Date();
              return (
                <div key={inv.id} style={{
                  background: "#0b1528",
                  border: `1px solid ${isDue ? "#f59e0b40" : "#1e293b"}`,
                  borderRadius: 10, padding: "12px 16px",
                  display: "flex", alignItems: "center",
                  gap: 10, flexWrap: "wrap",
                }}>
                  <div style={{ fontSize: 18, flexShrink: 0 }}>⏰</div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 500, color: "#e2e8f0", fontSize: 13 }}>{inv.client}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                      {inv.id} · Every {inv.schedule.frequencyDays}d · {inv.schedule.emailType}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: isDue ? "#fbbf24" : "#94a3b8" }}>
                      {isDue ? "⚡ Due now" : "Next send"}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: isDue ? "#fbbf24" : "#e2e8f0" }}>
                      {fmtDateTime(inv.schedule.nextSendDate)}
                    </div>
                  </div>
                  <Badge status={inv.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Activity Log ─────────────────────────────────────────────────────── */}
      <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
        Activity Log
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {["all", "email", "auto", "call", "manual"].map(f => (
          <button key={f} onClick={() => setTypeFilter(f)} style={pillStyle(typeFilter === f)}>
            {f === "all" ? "All" :
             f === "email"  ? "✉ Email"  :
             f === "auto"   ? "⏰ Auto"  :
             f === "call"   ? "📞 Call"  : "✏ Manual"}
          </button>
        ))}
      </div>

      {/* Log entries */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#334155" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <div>No reminder activity yet</div>
          <div style={{ fontSize: 12, color: "#1e293b", marginTop: 6 }}>
            Send a reminder from any invoice to see it here
          </div>
        </div>
      ) : (
        <div style={{ background: "#0b1528", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
          {filtered.map((r, i) => {
            const cfg = TYPE_CONFIG[r.type] ?? TYPE_CONFIG.manual;
            return (
              <div
                key={i}
                style={{
                  padding: "14px 16px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #111d30" : "none",
                }}
              >
                {/* Row 1: icon + client + type badge + amount */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}>
                  {/* Type icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: cfg.bg, border: `1px solid ${cfg.color}30`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 14,
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Client + invoice ID */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, color: "#e2e8f0", fontSize: 13,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {r.invoice.client}
                    </div>
                    <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
                      {r.invoice.id}
                    </div>
                  </div>

                  {/* Type badge */}
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 10,
                    background: cfg.bg, color: cfg.color, fontWeight: 600,
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}>
                    {cfg.label}
                  </span>

                  {/* Amount */}
                  <div style={{
                    fontWeight: 600, color: "#f1f5f9", fontSize: 13,
                    flexShrink: 0,
                  }}>
                    {fmt(r.invoice.amount)}
                  </div>
                </div>

                {/* Row 2: note text */}
                <div style={{
                  fontSize: 13, color: "#94a3b8",
                  paddingLeft: 42,   /* aligns under client name */
                  wordBreak: "break-word",
                  lineHeight: 1.5,
                }}>
                  {r.note}
                </div>

                {/* Row 3: timestamp + status */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap", gap: 6,
                  paddingLeft: 42,
                  marginTop: 4,
                }}>
                  <div style={{ fontSize: 11, color: "#334155" }}>
                    🕐 {fmtDateTime(r.date)}
                  </div>
                  <Badge status={r.invoice.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
