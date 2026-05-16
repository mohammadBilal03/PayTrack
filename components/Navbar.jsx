/**
 * Navbar — sticky top bar with tabs, new invoice button,
 * and logged-in user info with logout.
 */
export default function Navbar({ activeView, onViewChange, onNewInvoice, session, onLogout }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "invoices",  label: "Invoices"  },
    { id: "reminders", label: "Reminders" },
  ];

  // First letter of name for the avatar circle
  const initial = session?.name ? session.name.charAt(0).toUpperCase() : "?";

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "#080f1e", borderBottom: "1px solid #1e293b",
      padding: "0 20px", display: "flex", alignItems: "center", gap: 0,
    }}>
      {/* Brand */}
      <div className="nav-brand" style={{
        fontFamily: "var(--font-display)", fontSize: 20, color: "#818cf8",
        paddingRight: 20, borderRight: "1px solid #1e293b",
        marginRight: 14, lineHeight: "60px", flexShrink: 0,
      }}>
        PayTrack
      </div>

      {/* Nav tabs */}
      {tabs.map(({ id, label }) => {
        const active = activeView === id;
        return (
          <button key={id} onClick={() => onViewChange(id)} style={{
            padding: "0 14px", lineHeight: "60px", cursor: "pointer",
            fontSize: 13, fontWeight: 500,
            color: active ? "#818cf8" : "#64748b",
            background: "none", border: "none",
            borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
            fontFamily: "var(--font-body)", transition: "color 0.15s, border-color 0.15s",
          }}>
            {label}
          </button>
        );
      })}

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>

        {/* New Invoice */}
        <button onClick={onNewInvoice} style={{
          padding: "7px 16px", borderRadius: 8,
          background: "#6366f1", border: "none", color: "#fff",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
          fontFamily: "var(--font-body)", flexShrink: 0,
        }}>
          + New Invoice
        </button>

        {/* User avatar + name — hidden on very small screens */}
        {session && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            borderLeft: "1px solid #1e293b", paddingLeft: 12,
          }}>
            {/* Avatar circle */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#6366f130", border: "1px solid #6366f1",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#818cf8", flexShrink: 0,
            }}>
              {initial}
            </div>

            {/* Name — hidden on mobile */}
            <div className="nav-user-name" style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap" }}>
                {session.name}
              </div>
              <div style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.email}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Sign out"
              style={{
                padding: "6px 12px", borderRadius: 7,
                background: "transparent", border: "1px solid #1e293b",
                color: "#64748b", cursor: "pointer", fontSize: 12,
                fontFamily: "var(--font-body)", flexShrink: 0,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#ef4444"; e.target.style.color = "#f87171"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "#1e293b"; e.target.style.color = "#64748b"; }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
