/**
 * Fixed-position toast notification.
 * Rendered at the page level; appears for ~2.8 s then is removed by parent.
 */
export default function Toast({ message, color = "#22c55e" }) {
  return (
    <div
      className="toast"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        background: color,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 13,
        zIndex: 9999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        animation: "slideUp 0.2s ease",
        maxWidth: 320,
      }}
    >
      {message}
    </div>
  );
}
