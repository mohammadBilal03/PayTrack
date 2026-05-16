import { STATUS_CONFIG } from "@/lib/constants";

/**
 * Status badge pill.
 * Usage: <Badge status="paid" />  <Badge status="overdue" />
 */
export default function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}
