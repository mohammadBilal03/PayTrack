"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { loadInvoices, saveInvoices } from "@/lib/storage";
import { getSession, logout }         from "@/lib/auth";
import { isOverdue, nowISO }          from "@/lib/utils";
import LoginPage     from "@/components/LoginPage";
import Navbar        from "@/components/Navbar";
import Dashboard     from "@/components/Dashboard";
import InvoiceList   from "@/components/InvoiceList";
import InvoiceForm   from "@/components/InvoiceForm";
import InvoiceDetail from "@/components/InvoiceDetail";
import EmailModal    from "@/components/EmailModal";
import ScheduleModal from "@/components/ScheduleModal";
import ReminderHistory from "@/components/ReminderHistory";
import Modal  from "@/components/ui/Modal";
import Toast  from "@/components/ui/Toast";

// Module-level lock — survives React StrictMode double-mount
let autoSendLock = false;

export default function Page() {

  // ── Auth ───────────────────────────────────────────────────────────────────
  const [session, setSession] = useState(null);   // null = not checked yet
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const s = getSession();
    setSession(s);
    setAuthReady(true);
  }, []);

  const handleLogin = useCallback((newSession) => {
    setSession(newSession);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setSession(null);
    setInvoices([]);
  }, []);

  // ── Core data ──────────────────────────────────────────────────────────────
  const [invoices, setInvoices] = useState([]);
  const [view,     setView]     = useState("dashboard");
  const [toast,    setToast]    = useState(null);

  // Modal state — IDs only, objects derived below
  const [showCreate, setShowCreate] = useState(false);
  const [detailId,   setDetailId]   = useState(null);
  const [editId,     setEditId]     = useState(null);
  const [emailId,    setEmailId]    = useState(null);
  const [scheduleId, setScheduleId] = useState(null);

  // Always fresh from invoices array — eliminates stale state bugs
  const detailInvoice   = useMemo(() => invoices.find(i => i.id === detailId)   ?? null, [invoices, detailId]);
  const editInvoice     = useMemo(() => invoices.find(i => i.id === editId)     ?? null, [invoices, editId]);
  const emailInvoice    = useMemo(() => invoices.find(i => i.id === emailId)    ?? null, [invoices, emailId]);
  const scheduleInvoice = useMemo(() => invoices.find(i => i.id === scheduleId) ?? null, [invoices, scheduleId]);

  const invoicesRef = useRef([]);
  useEffect(() => { invoicesRef.current = invoices; }, [invoices]);

  // ── Load invoices when session is ready ────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const raw     = loadInvoices(session.userId);
    const cloned  = JSON.parse(JSON.stringify(raw));
    const updated = cloned.map(inv =>
      isOverdue(inv) && inv.status === "pending" ? { ...inv, status: "overdue" } : inv
    );
    setInvoices(updated);
  }, [session]);

  // ── Persist whenever invoices change ───────────────────────────────────────
  useEffect(() => {
    if (session && invoices.length > 0) saveInvoices(invoices, session.userId);
  }, [invoices, session]);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, color = "#22c55e") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Invoice CRUD ───────────────────────────────────────────────────────────
  const addInvoice = useCallback((form) => {
    const id = `INV-${String(invoices.length + 1).padStart(3, "0")}-${Date.now().toString(36).slice(-3).toUpperCase()}`;
    setInvoices(prev => [{
      client: form.client, email: form.email,
      amount: Number(form.amount), description: form.description || "",
      issueDate: form.issueDate, dueDate: form.dueDate,
      status: form.status || "pending",
      currency: "INR", id, reminders: [], schedule: null,
    }, ...prev]);
    setShowCreate(false);
    showToast(`${id} created`);
  }, [invoices.length, showToast]);

  const updateInvoice = useCallback((form) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === form.id ? { ...form, amount: Number(form.amount) } : inv
    ));
    setEditId(null);
    showToast("Invoice updated");
  }, [showToast]);

  const markStatus = useCallback((id, status) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    showToast(`Marked as ${status}`, status === "paid" ? "#22c55e" : "#f59e0b");
  }, [showToast]);

  const deleteInvoice = useCallback((id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    setDetailId(prev => prev === id ? null : prev);
    showToast("Invoice deleted", "#ef4444");
  }, [showToast]);

  const logReminder = useCallback((invoiceId, type, note) => {
    const entry = { date: nowISO(), type, note };
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, reminders: [...inv.reminders, entry] } : inv
    ));
  }, []);

  const saveSchedule = useCallback((invoiceId, schedule) => {
    const safe = JSON.parse(JSON.stringify(schedule));
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, schedule: safe } : inv
    ));
    setScheduleId(null);
    showToast(schedule.enabled ? "Auto-reminder scheduled ⏰" : "Schedule disabled", "#6366f1");
  }, [showToast]);

  const disableSchedule = useCallback((id) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === id ? { ...inv, schedule: { ...inv.schedule, enabled: false } } : inv
    ));
    showToast("Auto-reminder turned off", "#ef4444");
  }, [showToast]);

  // ── Auto-scheduler ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;

    const checkAndSend = async () => {
      if (autoSendLock) return;
      autoSendLock = true;
      try {
        const now = new Date();
        const due = invoicesRef.current.filter(inv =>
          inv.schedule?.enabled &&
          inv.status !== "paid" &&
          inv.schedule?.nextSendDate &&
          new Date(inv.schedule.nextSendDate) <= now
        );

        for (const inv of due) {
          const next = new Date(now);
          next.setDate(next.getDate() + Number(inv.schedule.frequencyDays));
          const nextISO = next.toISOString();

          // Update ref synchronously — prevents repeat sends before re-render
          invoicesRef.current = invoicesRef.current.map(i =>
            i.id === inv.id
              ? { ...i, schedule: { ...i.schedule, nextSendDate: nextISO, lastSent: now.toISOString() } }
              : i
          );

          try {
            const res = await fetch("/api/send-reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ invoice: inv, emailType: inv.schedule.emailType }),
            });
            if (res.ok) {
              const entry = { date: nowISO(), type: "auto", note: `Auto-reminder sent (every ${inv.schedule.frequencyDays}d)` };
              setInvoices(prev => prev.map(i =>
                i.id === inv.id
                  ? { ...i, reminders: [...i.reminders, entry], schedule: { ...i.schedule, nextSendDate: nextISO, lastSent: nowISO() } }
                  : i
              ));
              showToast(`Auto-reminder sent for ${inv.id}`);
            }
          } catch (err) {
            console.error("Auto-send failed:", inv.id, err);
            // Roll back ref so it retries next tick
            invoicesRef.current = invoicesRef.current.map(i =>
              i.id === inv.id ? { ...i, schedule: { ...i.schedule, nextSendDate: inv.schedule.nextSendDate } } : i
            );
          }
        }
      } finally {
        autoSendLock = false;
      }
    };

    checkAndSend();
    const timerId = setInterval(checkAndSend, 60_000);
    return () => { clearInterval(timerId); autoSendLock = false; };
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const paid    = invoices.filter(i => i.status === "paid");
    const overdue = invoices.filter(i => i.status === "overdue");
    const pending = invoices.filter(i => i.status === "pending");
    return {
      total: invoices.length,
      paidCount: paid.length, overdueCount: overdue.length, pendingCount: pending.length,
      paidAmt:   paid.reduce((a, i) => a + i.amount, 0),
      unpaidAmt: [...overdue, ...pending].reduce((a, i) => a + i.amount, 0),
    };
  }, [invoices]);

  const handlers = {
    onView:            (inv) => setDetailId(inv.id),
    onEdit:            (inv) => { setEditId(inv.id); setDetailId(null); },
    onEmail:           (inv) => setEmailId(inv.id),
    onMarkPaid:        (id)  => markStatus(id, "paid"),
    onDelete:          deleteInvoice,
    onSchedule:        (inv) => setScheduleId(inv.id),
    onDisableSchedule: disableSchedule,
    onLogActivity:     logReminder,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  // Wait for localStorage check before rendering anything
  if (!authReady) return null;

  // Not logged in — show login page
  if (!session) return <LoginPage onSuccess={handleLogin} />;

  // Logged in — show main app
  return (
    <>
      <Navbar
        activeView={view}
        onViewChange={setView}
        onNewInvoice={() => setShowCreate(true)}
        session={session}
        onLogout={handleLogout}
      />

      <main className="page-main">
        {view === "dashboard" ? (
          <Dashboard stats={stats} recentInvoices={invoices.slice(0, 5)} onViewAll={() => setView("invoices")} {...handlers} />
        ) : view === "reminders" ? (
          <ReminderHistory invoices={invoices} />
        ) : (
          <InvoiceList invoices={invoices} {...handlers} />
        )}
      </main>

      {showCreate && (
        <Modal title="New Invoice" onClose={() => setShowCreate(false)}>
          <InvoiceForm onSave={addInvoice} onClose={() => setShowCreate(false)} />
        </Modal>
      )}
      {editInvoice && (
        <Modal title={`Edit ${editInvoice.id}`} onClose={() => setEditId(null)}>
          <InvoiceForm initial={editInvoice} onSave={updateInvoice} onClose={() => setEditId(null)} />
        </Modal>
      )}
      {detailInvoice && (
        <InvoiceDetail
          invoice={detailInvoice}
          onClose={() => setDetailId(null)}
          onStatusChange={markStatus}
          onSendEmail={() => setEmailId(detailInvoice.id)}
          onEdit={(inv) => { setEditId(inv.id); setDetailId(null); }}
          onDelete={deleteInvoice}
          onSchedule={() => setScheduleId(detailInvoice.id)}
          onDisableSchedule={disableSchedule}
          onLogActivity={logReminder}
        />
      )}
      {emailInvoice && (
        <EmailModal
          invoice={emailInvoice}
          onClose={() => setEmailId(null)}
          onSent={(type) => {
            logReminder(emailInvoice.id, "email", `${type === "overdue" ? "Overdue" : "Reminder"} email sent to ${emailInvoice.email}`);
            showToast(`Email sent to ${emailInvoice.email} ✉`);
          }}
        />
      )}
      {scheduleInvoice && (
        <ScheduleModal
          invoice={scheduleInvoice}
          onClose={() => setScheduleId(null)}
          onSave={(schedule) => saveSchedule(scheduleInvoice.id, schedule)}
        />
      )}
      {toast && <Toast message={toast.msg} color={toast.color} />}
    </>
  );
}