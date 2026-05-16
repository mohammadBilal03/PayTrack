import { useMemo, useState } from "react";
import Badge from "./ui/Badge";
import { fmt, fmtDate, fmtDateTime } from "@/lib/utils";

const TYPE_CONFIG = {
  email: { label: "Email",  color: "#818cf8", bg: "#6366f120", icon: "✉" },
  auto:  { label: "Auto",   color: "#fbbf24", bg: "#f59e0b20", icon: "⏰" },
  call:  { label: "Call",   color: "#34d399", bg: "#22c55e20", icon: "📞" },
  manual:{ label: "Manual", color: "#94a3b8", bg: "#1e293b",   icon: "✏" },
};

/**
 * ReminderHistory — shows every reminder log entry across all invoices,
 * sorted newest first. Filterable by reminder type.
 *
 * Also shows a "Scheduled" section listing invoices with active auto-reminders
 * and their next send date.
 */
export default function ReminderHistory({ invoices }) {
  const [typeFilter, setTypeFilter] = useState("all");

  // Flatten all reminder entries from all invoices into one list
  const allReminders = useMemo(() => {
    const entries = [];
    for (const inv of invoices) {
      for (const r of inv.reminders) {
        entries.push({ ...r, invoice: inv });
      }
    }
    // Sort newest first
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices]);

  // Invoices with active scheduled reminders
  const scheduled = useMemo(() =>
    invoices
      .filter((i) => i.schedule?.enabled && i.status !== "paid")
      .sort((a, b) => new Date(a.schedule.nextSendDate) - new Date(b.schedule.nextSendDate)),
    [invoices]
  );

  const filtered = typeFilter === "all"
    ? allReminders
    : allReminders.filter((r) => r.type === typeFilter);

  const typePill = (type, label) => {
    const active = typeFilter === type;
    return (
      <button
        key={type}
        onClick={() => setTypeFilter(type)}
        style={{
          padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
          cursor: "pointer", border: "1px solid", fontFamily: "var(--font-body)",
          borderColor: active ? "#6366f1" : "#1e293b",
          background: active ? "#6366f120" : "#0f172a",
          color: active ? "#818cf8" : "#64748b",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </button>
    );
  };

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

      {/* ── Scheduled section ─────────────────────────────────────────────────── */}
      {scheduled.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            Active Schedules ({scheduled.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scheduled.map((inv) => {
              const isOverdueNow = new Date(inv.schedule.nextSendDate) < new Date();
              return (
                <div
                  key={inv.id}
                  style={{
                    background: "#0b1528", border: `1px solid ${isOverdueNow ? "#f59e0b40" : "#1e293b"}`,
                    borderRadius: 10, padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontSize: 18 }}>⏰</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, color: "#e2e8f0", fontSize: 13 }}>{inv.client}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                      {inv.id} · Every {inv.schedule.frequencyDays}d · {inv.schedule.emailType}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: isOverdueNow ? "#fbbf24" : "#94a3b8" }}>
                      {isOverdueNow ? "⚡ Due now" : "Next"}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: isOverdueNow ? "#fbbf24" : "#e2e8f0" }}>
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

      {/* ── Activity log ──────────────────────────────────────────────────────── */}
      <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
        Activity Log
      </div>

      {/* Type filter */}
      <div className="filter-pills" style={{ marginBottom: 16, display: "flex", gap: 6 }}>
        {typePill("all", "All")}
        {typePill("email", "✉ Email")}
        {typePill("auto", "⏰ Auto")}
        {typePill("call", "📞 Call")}
        {typePill("manual", "✏ Manual")}
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
                  display: "grid",
                  gridTemplateColumns: "36px 1fr auto",
                  gap: 12,
                  padding: "14px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #111d30" : "none",
                  alignItems: "flex-start",
                }}
              >
                {/* Type icon */}
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: cfg.bg, border: `1px solid ${cfg.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, flexShrink: 0,
                }}>
                  {cfg.icon}
                </div>

                {/* Details */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 13 }}>
                      {r.invoice.client}
                    </span>
                    <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
                      {r.invoice.id}
                    </span>
                    <span style={{
                      fontSize: 11, padding: "2px 7px", borderRadius: 10,
                      background: cfg.bg, color: cfg.color, fontWeight: 600,
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{r.note}</div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
                    🕐 {fmtDateTime(r.date)}
                  </div>
                </div>

                {/* Amount + status */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                    {fmt(r.invoice.amount)}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <Badge status={r.invoice.status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
