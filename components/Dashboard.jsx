import StatCard from "./ui/StatCard";
import Badge from "./ui/Badge";
import { fmt, fmtDate } from "@/lib/utils";

/**
 * Dashboard view — summary stats + recent invoices list.
 */
export default function Dashboard({
  stats,
  recentInvoices,
  onViewAll,
  onView,
  onEmail,
  onMarkPaid,
}) {
  const overdueAmt = recentInvoices
    .filter((i) => i.status === "overdue")
    .reduce((a, i) => a + i.amount, 0);

  return (
    <div>
      {/* Page heading */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 26,
            fontFamily: "var(--font-display)",
            color: "#e2e8f0",
          }}
        >
          Business Overview
        </h1>
        <p style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards — 4 col desktop, 2 col mobile (via .stat-grid in globals.css) */}
      <div className="stat-grid">
        <StatCard
          label="Total Invoices"
          value={stats.total}
          sub={`${stats.paidCount} paid · ${stats.pendingCount} pending`}
        />
        <StatCard
          label="Unpaid Amount"
          value={fmt(stats.unpaidAmt)}
          sub={`${stats.overdueCount} overdue`}
          accent="#f59e0b"
        />
        <StatCard
          label="Collected"
          value={fmt(stats.paidAmt)}
          sub="Total received"
          accent="#22c55e"
        />
        <StatCard
          label="Overdue"
          value={stats.overdueCount}
          sub="Needs attention"
          accent={stats.overdueCount > 0 ? "#ef4444" : "#22c55e"}
        />
      </div>

      {/* Overdue alert banner */}
      {stats.overdueCount > 0 && (
        <div
          style={{
            background: "#ef444410",
            border: "1px solid #ef444430",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: "#f87171", fontSize: 14 }}>
              ⚠ {stats.overdueCount} overdue invoice{stats.overdueCount > 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              Send reminders to recover {fmt(overdueAmt)}
            </div>
          </div>
          <button
            onClick={onViewAll}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#ef444420",
              border: "1px solid #ef4444",
              color: "#f87171",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            View Overdue →
          </button>
        </div>
      )}

      {/* Recent invoices */}
      <div
        style={{
          background: "#0b1528",
          border: "1px solid #1e293b",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 600, color: "#e2e8f0" }}>
            Recent Invoices
          </span>
          <button
            onClick={onViewAll}
            style={{
              background: "none",
              border: "none",
              color: "#6366f1",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            View all →
          </button>
        </div>

        {recentInvoices.map((inv) => (
          <div
            key={inv.id}
            onClick={() => onView(inv)}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #111d30",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0f1f38")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  color: "#e2e8f0",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {inv.client}
              </div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 1 }}>
                {inv.id} · Due {fmtDate(inv.dueDate)}
              </div>
            </div>
            <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14, flexShrink: 0 }}>
              {fmt(inv.amount)}
            </div>
            <Badge status={inv.status} />
          </div>
        ))}

        {recentInvoices.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#334155" }}>
            No invoices yet. Create your first one →
          </div>
        )}
      </div>
    </div>
  );
}
