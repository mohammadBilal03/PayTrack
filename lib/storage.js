import { SEED_INVOICES } from "./constants";
import { invoiceKey } from "./auth";
 
/**
 * Ensures every invoice has the fields all components expect.
 * Acts as a migration layer — old data missing fields won't crash the app.
 */
function normalizeInvoice(inv) {
  return {
    ...inv,
    reminders:   Array.isArray(inv.reminders) ? inv.reminders : [],
    schedule:    inv.schedule ?? null,
    currency:    inv.currency ?? "INR",
    description: inv.description ?? "",
  };
}
 
/**
 * Load invoices for a specific user from localStorage.
 * Falls back to seed data on first login.
 */
export function loadInvoices(userId) {
  try {
    const key  = invoiceKey(userId);
    const raw  = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : SEED_INVOICES;
    return list.map(normalizeInvoice);
  } catch {
    return SEED_INVOICES.map(normalizeInvoice);
  }
}
 
/**
 * Persist invoices for a specific user.
 */
export function saveInvoices(invoices, userId) {
  try {
    const key = invoiceKey(userId);
    localStorage.setItem(key, JSON.stringify(invoices));
  } catch {
    console.warn("PayTrack: could not save to localStorage");
  }
}
 
/**
 * Wipe a user's invoices and restore seed data.
 */
export function resetStorage(userId) {
  try {
    localStorage.removeItem(invoiceKey(userId));
  } catch {}
}