// ─── Status configuration ─────────────────────────────────────────────────────
// Single source of truth for status labels, colors, and icons.
// Import this wherever you render a badge or filter pill.
 
export const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
    icon: "✓",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    icon: "⏳",
  },
  overdue: {
    label: "Overdue",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)",
    icon: "!",
  },
  draft: {
    label: "Draft",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.25)",
    icon: "✏",
  },
};
 
// ─── Seed invoices ────────────────────────────────────────────────────────────
// Loaded on first visit so reviewers immediately see a realistic state.
// Stored in localStorage after that; seed never overwrites existing data.
 
export const SEED_INVOICES = [
  {
    id: "INV-001",
    client: "Arjun Sharma",
    email: "arjun@example.com",
    amount: 45000,
    currency: "INR",
    issueDate: "2025-04-01",
    dueDate: "2025-04-15",
    status: "overdue",
    description: "Website Redesign – Phase 1",
    reminders: [
      { date: "2025-04-16", type: "email", note: "Reminder email sent" },
    ],
  },
  {
    id: "INV-002",
    client: "Priya Mehta",
    email: "priya@example.com",
    amount: 18500,
    currency: "INR",
    issueDate: "2025-04-10",
    dueDate: "2025-04-30",
    status: "pending",
    description: "Brand Identity Package",
    reminders: [],
  },
  {
    id: "INV-003",
    client: "Tech Ventures Ltd.",
    email: "accounts@techventures.in",
    amount: 120000,
    currency: "INR",
    issueDate: "2025-03-15",
    dueDate: "2025-04-05",
    status: "paid",
    description: "Mobile App Development – Sprint 3",
    reminders: [
      { date: "2025-04-01", type: "call", note: "Called client, confirmed payment incoming" },
    ],
  },
  {
    id: "INV-004",
    client: "Ravi Nair",
    email: "ravi@example.com",
    amount: 8200,
    currency: "INR",
    issueDate: "2025-04-20",
    dueDate: "2025-05-10",
    status: "pending",
    description: "Logo & Social Media Kit",
    reminders: [],
  },
  {
    id: "INV-005",
    client: "CloudBase Inc.",
    email: "billing@cloudbase.io",
    amount: 75000,
    currency: "INR",
    issueDate: "2025-03-01",
    dueDate: "2025-03-31",
    status: "overdue",
    description: "API Integration Services",
    reminders: [
      { date: "2025-04-01", type: "email", note: "First reminder sent" },
      { date: "2025-04-10", type: "call", note: "Follow-up call, no answer" },
    ],
  },
  {
    id: "INV-006",
    client: "Neha Joshi",
    email: "neha.joshi@example.com",
    amount: 23000,
    currency: "INR",
    issueDate: "2025-04-25",
    dueDate: "2025-05-15",
    status: "draft",
    description: "Content Strategy Consulting",
    reminders: [],
  },
];