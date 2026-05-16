"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/lib/auth";

/**
 * LoginPage — shown when no session exists.
 * Handles both login and registration in one clean UI.
 * onSuccess(session) is called after a successful login or register.
 */
export default function LoginPage({ onSuccess }) {
  const [mode,     setMode]     = useState("login"); // "login" | "register"
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const reset = (newMode) => {
    setMode(newMode);
    setError("");
    setName("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async () => {
    setError("");

    // ── Validation ────────────────────────────────────────────────────────────
    if (!email.trim())    { setError("Email is required");    return; }
    if (!password)        { setError("Password is required"); return; }

    if (mode === "register") {
      if (!name.trim())   { setError("Name is required");     return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
      if (password !== confirm) { setError("Passwords do not match"); return; }
    }

    setLoading(true);
    try {
      let session;
      if (mode === "register") {
        const user = await registerUser(name, email, password);
        // Auto-login after register
        session = await loginUser(email, password);
      } else {
        session = await loginUser(email, password);
      }
      onSuccess(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inp = (value, onChange, placeholder, type = "text") => (
    <input
      type={type}
      value={value}
      onChange={(e) => { onChange(e.target.value); setError(""); }}
      onKeyDown={handleKey}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 10,
        padding: "13px 16px",
        color: "#f1f5f9",
        fontSize: 14,
        outline: "none",
        fontFamily: "var(--font-body)",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
      }}
      onFocus={(e)  => (e.target.style.borderColor = "#6366f1")}
      onBlur={(e)   => (e.target.style.borderColor = "#1e293b")}
    />
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060d1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      fontFamily: "var(--font-body)",
    }}>

      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 40%, #6366f115 0%, transparent 70%)",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#0b1528",
        border: "1px solid #1e293b",
        borderRadius: 20,
        padding: "36px 32px",
        position: "relative",
      }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 32,
            fontFamily: "var(--font-display)",
            color: "#818cf8",
            marginBottom: 6,
          }}>
            PayTrack
          </div>
          <div style={{ fontSize: 13, color: "#475569" }}>
            {mode === "login"
              ? "Sign in to your account"
              : "Create your free account"}
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {mode === "register" && inp(name, setName, "Your full name")}
          {inp(email,    setEmail,    "Email address",  "email")}
          {inp(password, setPassword, "Password",       "password")}
          {mode === "register" && inp(confirm, setConfirm, "Confirm password", "password")}

          {/* Error */}
          {error && (
            <div style={{
              background: "#ef444415",
              border: "1px solid #ef444440",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#f87171",
              fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 10,
              background: loading ? "#4f46e5" : "#6366f1",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              fontFamily: "var(--font-body)",
              marginTop: 4,
              transition: "background 0.15s",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading
              ? (mode === "login" ? "Signing in…" : "Creating account…")
              : (mode === "login" ? "Sign In"     : "Create Account")}
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          margin: "24px 0 20px",
        }}>
          <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
          <span style={{ fontSize: 12, color: "#334155" }}>
            {mode === "login" ? "New to PayTrack?" : "Already have an account?"}
          </span>
          <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
        </div>

        {/* Toggle mode */}
        <button
          onClick={() => reset(mode === "login" ? "register" : "login")}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            background: "transparent",
            border: "1px solid #1e293b",
            color: "#818cf8",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#6366f1";
            e.target.style.background  = "#6366f110";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "#1e293b";
            e.target.style.background  = "transparent";
          }}
        >
          {mode === "login" ? "Create an account" : "Sign in instead"}
        </button>

        {/* Demo hint */}
        <div style={{
          marginTop: 24,
          padding: "10px 14px",
          background: "#6366f108",
          border: "1px solid #6366f120",
          borderRadius: 8,
          fontSize: 12,
          color: "#475569",
          textAlign: "center",
          lineHeight: 1.6,
        }}>
          Demo: register with any email and password to get started.
          Each account has its own separate invoices.
        </div>

      </div>
    </div>
  );
}
