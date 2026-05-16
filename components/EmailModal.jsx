import { useState } from "react";
import Modal from "./ui/Modal";
import { buildEmailTemplate } from "@/lib/utils";
import { fmt } from "@/lib/utils";

/**
 * Email reminder modal.
 *
 * Flow:
 * 1. User picks template (reminder / overdue)
 * 2. Previews the email body
 * 3. Clicks Send → POST /api/send-reminder → Resend delivers the real email
 * 4. On success: onSent(type) is called so the parent can log the reminder
 */
export default function EmailModal({ invoice, onClose, onSent }) {
  const [emailType, setEmailType] = useState("reminder");
  const [status, setStatus]       = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg]   = useState("");

  // Preview the email on the client side (same function the server uses)
  const preview = buildEmailTemplate(invoice, emailType);

  const handleSend = async () => {
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice, emailType }),
      });

      // ── Guard: if the server returned HTML (crash page), don't try to parse it as JSON
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          `Server error (${res.status}). Check your terminal for the full error message.`
        );
      }

      const data = await res.json();

      if (!res.ok) {
        // Server returned JSON with an error message — show it directly
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      setStatus("success");
      setTimeout(() => {
        onSent(emailType);
        onClose();
      }, 1000);

    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const templateBtn = (type, label) => (
    <button
      onClick={() => setEmailType(type)}
      style={{
        padding: "8px 18px",
        borderRadius: 8,
        border: "1px solid",
        borderColor: emailType === type ? "#6366f1" : "#334155",
        background: emailType === type ? "#6366f130" : "#1e293b",
        color: emailType === type ? "#818cf8" : "#94a3b8",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "var(--font-body)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );

  return (
    <Modal title={`Send Email – ${invoice.id}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Template selector */}
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Choose template</div>
          <div style={{ display: "flex", gap: 8 }}>
            {templateBtn("reminder", "Friendly Reminder")}
            {templateBtn("overdue", "Overdue Notice")}
          </div>
        </div>

        {/* Recipient info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#0c1426", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>To:</span>
          <span style={{ fontSize: 13, color: "#818cf8" }}>{invoice.email}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: fmt(invoice.amount).length > 0 ? "#f59e0b" : undefined }}>
            {fmt(invoice.amount)}
          </span>
        </div>

        {/* Subject preview */}
        <div style={{ background: "#1e293b", borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ fontSize: 11, color: "#64748b", marginRight: 8 }}>Subject:</span>
          <span style={{ fontSize: 13, color: "#cbd5e1" }}>{preview.subject}</span>
        </div>

        {/* Body preview (rendered HTML as text for simplicity) */}
        <div
          style={{
            background: "#1e293b",
            borderRadius: 10,
            padding: "14px 16px",
            fontSize: 12,
            color: "#94a3b8",
            maxHeight: 180,
            overflowY: "auto",
            lineHeight: 1.7,
            fontFamily: "monospace",
          }}
          dangerouslySetInnerHTML={{ __html: preview.html }}
        />

        {/* Error message */}
        {status === "error" && (
          <div
            style={{
              background: "#ef444415",
              border: "1px solid #ef444440",
              borderRadius: 8,
              padding: "12px 14px",
              color: "#f87171",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>⚠ Failed to send</div>
            <div>{errorMsg}</div>
            {errorMsg.includes("RESEND_API_KEY") && (
              <div
                style={{
                  marginTop: 8,
                  padding: "8px 10px",
                  background: "#1e293b",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              >
                In your project root, create <strong style={{ color: "#818cf8" }}>.env.local</strong> and add:<br />
                RESEND_API_KEY=re_your_key_here
              </div>
            )}
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={status === "sending" || status === "success"}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 8,
            background:
              status === "success" ? "#22c55e" :
              status === "error"   ? "#ef4444" :
                                     "#6366f1",
            border: "none",
            color: "#fff",
            cursor: status === "sending" || status === "success" ? "default" : "pointer",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            transition: "background 0.2s",
            opacity: status === "sending" ? 0.7 : 1,
          }}
        >
          {status === "sending" ? "Sending…" :
           status === "success" ? "✓ Sent!" :
           status === "error"   ? "Retry" :
                                  "Send Email"}
        </button>
      </div>
    </Modal>
  );
}
