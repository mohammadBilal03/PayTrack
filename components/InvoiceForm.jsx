import { useState } from "react";
import { STATUS_CONFIG } from "@/lib/constants";
import { today } from "@/lib/utils";

/**
 * Shared form for creating and editing invoices.
 * When `initial` is provided, the form is in "edit" mode.
 */
export default function InvoiceForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial ?? {
      client: "",
      email: "",
      amount: "",
      description: "",
      issueDate: today(),
      dueDate: "",
      status: "pending",
    }
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.client.trim())   return "Client name is required";
    if (!form.email.trim())    return "Client email is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
                               return "Enter a valid amount";
    if (!form.dueDate)         return "Due date is required";
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) { alert(err); return; }
    onSave(form);
  };

  const inp = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#f1f5f9",
    fontSize: 14,
    width: "100%",
    outline: "none",
    fontFamily: "var(--font-body)",
  };

  const lbl = {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 5,
    display: "block",
    fontWeight: 500,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="form-row">
        <div>
          <label style={lbl}>Client Name *</label>
          <input style={inp} value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="Arjun Sharma" />
        </div>
        <div>
          <label style={lbl}>Client Email *</label>
          <input style={inp} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="client@example.com" />
        </div>
      </div>

      <div>
        <label style={lbl}>Description</label>
        <input style={inp} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Website redesign, consulting fee…" />
      </div>

      <div className="form-row">
        <div>
          <label style={lbl}>Amount (₹) *</label>
          <input style={inp} type="number" min="1" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="25000" />
        </div>
        <div>
          <label style={lbl}>Status</label>
          <select style={inp} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div>
          <label style={lbl}>Issue Date</label>
          <input style={inp} type="date" value={form.issueDate} onChange={(e) => set("issueDate", e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Due Date *</label>
          <input style={inp} type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          onClick={onClose}
          style={{ flex: 1, padding: 11, borderRadius: 8, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", fontSize: 14, fontFamily: "var(--font-body)" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{ flex: 2, padding: 11, borderRadius: 8, background: "#6366f1", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)" }}
        >
          {initial ? "Update Invoice" : "Create Invoice"}
        </button>
      </div>
    </div>
  );
}
