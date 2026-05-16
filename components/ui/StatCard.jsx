/**
 * Dashboard metric card.
 * Props:
 *   label  – small uppercase label
 *   value  – large prominent number / text
 *   sub    – optional secondary line
 *   accent – optional color override for value text
 */
export default function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 14,
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: accent ?? "#f1f5f9",
          fontFamily: "var(--font-display)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "#475569", marginTop: 7 }}>{sub}</div>
      )}
    </div>
  );
}
