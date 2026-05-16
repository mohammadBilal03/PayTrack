// ─── Auth helpers ─────────────────────────────────────────────────────────────
// Credentials are stored in localStorage for this demo.
// In production: move to a server-side DB with bcrypt hashing.
 
const USERS_KEY   = "paytrack_users";
const SESSION_KEY = "paytrack_session";
 
// ── Password hashing ──────────────────────────────────────────────────────────
// Uses the browser's built-in Web Crypto API (SHA-256).
// Never stored in plain text — always hashed before saving.
export async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
 
// ── User storage ──────────────────────────────────────────────────────────────
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
 
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
 
// ── Register ──────────────────────────────────────────────────────────────────
export async function registerUser(name, email, password) {
  const users = getUsers();
 
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }
 
  const user = {
    id:           crypto.randomUUID(),
    name:         name.trim(),
    email:        email.trim().toLowerCase(),
    passwordHash: await hashPassword(password),
    createdAt:    new Date().toISOString(),
  };
 
  saveUsers([...users, user]);
  return user;
}
 
// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const users = getUsers();
  const user  = users.find((u) => u.email === email.trim().toLowerCase());
 
  if (!user) throw new Error("No account found with this email");
 
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) throw new Error("Incorrect password");
 
  // Save session — excludes passwordHash for safety
  const session = {
    userId:    user.id,
    name:      user.name,
    email:     user.email,
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
 
// ── Session ───────────────────────────────────────────────────────────────────
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
 
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
 
// ── Per-user invoice key ──────────────────────────────────────────────────────
// Each user's invoices are stored separately so accounts don't share data.
export function invoiceKey(userId) {
  return `paytrack_invoices_${userId}`;
}