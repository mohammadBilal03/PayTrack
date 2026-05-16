/**
 * Navbar — sticky top bar.
 *
 * Desktop: Brand | Dashboard | Invoices | Reminders | [+ New Invoice] [avatar name sign-out]
 * Mobile:  Brand | [tabs row below] with condensed right side
 *
 * Two-row layout on mobile prevents horizontal overflow.
 */
export default function Navbar({ activeView, onViewChange, onNewInvoice, session, onLogout }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "invoices",  label: "Invoices"  },
    { id: "reminders", label: "Reminders" },
  ];

  const initial = session?.name ? session.name.charAt(0).toUpperCase() : "?";

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "#080f1e", borderBottom: "1px solid #1e293b",
      fontFamily: "var(--font-body)",
    }}>

      {/* ── Top row — brand + actions ────────────────────────────────────── */}
      <div style={{
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        height: 56,
        gap: 8,
      }}>
        {/* Brand */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          color: "#818cf8",
          flexShrink: 0,
          marginRight: 4,
        }}>
          PayTrack
        </div>

        {/* Desktop tabs — hidden on mobile */}
        <div className="nav-tabs-desktop" style={{ display: "flex", alignItems: "center" }}>
          {tabs.map(({ id, label }) => {
            const active = activeView === id;
            return (
              <button key={id} onClick={() => onViewChange(id)} style={{
                padding: "0 14px", lineHeight: "56px", cursor: "pointer",
                fontSize: 13, fontWeight: 500,
                color: active ? "#818cf8" : "#64748b",
                background: "none", border: "none",
                borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
                fontFamily: "var(--font-body)",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
              }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* New Invoice button */}
        <button onClick={onNewInvoice} style={{
          padding: "7px 14px", borderRadius: 8,
          background: "#6366f1", border: "none", color: "#fff",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
          fontFamily: "var(--font-body)", flexShrink: 0,
          whiteSpace: "nowrap",
        }}>
          <span className="btn-full-text">+ New Invoice</span>
          <span className="btn-short-text" style={{ display: "none" }}>+</span>
        </button>

        {/* User section */}
        {session && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#6366f130", border: "1px solid #6366f1",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#818cf8", flexShrink: 0,
            }}>
              {initial}
            </div>

            {/* Name + email — hidden on mobile */}
            <div className="nav-user-text" style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap" }}>
                {session.name}
              </div>
              <div style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.email}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={onLogout}
              title="Sign out"
              style={{
                padding: "5px 10px", borderRadius: 7,
                background: "transparent", border: "1px solid #1e293b",
                color: "#64748b", cursor: "pointer", fontSize: 12,
                fontFamily: "var(--font-body)", flexShrink: 0,
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#ef4444"; e.target.style.color = "#f87171"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "#1e293b"; e.target.style.color = "#64748b"; }}
            >
              <span className="nav-signout-text">Sign out</span>
              <span className="nav-signout-icon" style={{ display: "none" }}>⏏</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Bottom row — mobile tabs only ────────────────────────────────── */}
      <div className="nav-tabs-mobile" style={{
        display: "none",
        borderTop: "1px solid #1e293b",
        padding: "0 4px",
      }}>
        {tabs.map(({ id, label }) => {
          const active = activeView === id;
          return (
            <button key={id} onClick={() => onViewChange(id)} style={{
              flex: 1, padding: "10px 0", cursor: "pointer",
              fontSize: 12, fontWeight: 500,
              color: active ? "#818cf8" : "#64748b",
              background: "none", border: "none",
              borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
              fontFamily: "var(--font-body)",
            }}>
              {label}
            </button>
          );
        })}
      </div>

    </nav>
  );
}
