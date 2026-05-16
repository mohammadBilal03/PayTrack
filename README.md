# PayTrack – Payment Reminder System

🚀 **Live Demo:** [https://pay-track-sage.vercel.app/](https://pay-track-sage.vercel.app/)

A mini payment reminder system built for the BinaryAutomates Software Engineering Internship assignment.

## Features

- Create, edit, and delete invoices
- Track payment status — Pending, Overdue, Paid, Draft
- Send real email reminders via Resend
- Schedule automatic repeating reminders
- Full reminder activity history with timestamps
- Search and filter invoices
- Dashboard with summary stats
- User authentication (register / login)
- Responsive UI — works on desktop and mobile

## Tech Stack

- **Frontend** — Next.js 14, React 18
- **Email** — Resend API
- **Storage** — localStorage (per user)
- **Auth** — SHA-256 password hashing via Web Crypto API
- **Deployment** — Vercel

## Setup

**1. Clone the repository**
```bash
git clone https://github.com/mohammadBilal03/PayTrack.git
cd PayTrack
```

**2. Install dependencies**
```bash
npm install
```

**3. Create environment file**
```bash
cp .env.local.example .env.local
```

**4. Add your keys to `.env.local`**
```
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=onboarding@resend.dev
RESEND_TEST_EMAIL=your@email.com
```

**5. Run the development server**
```bash
npm run dev
```

**6. Open** http://localhost:3000

---

## Environment Variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key from resend.com |
| `EMAIL_FROM` | Sender email address |
| `RESEND_TEST_EMAIL` | Redirects all emails to your inbox during testing — remove for production |

---

## Project Structure

```
paytrack/
├── app/
│   ├── page.jsx                  # Main app + auth gate
│   ├── layout.jsx                # Root HTML layout
│   ├── globals.css               # Global styles + responsive breakpoints
│   └── api/
│       └── send-reminder/        # Server-side email API (Resend)
├── components/
│   ├── ui/                       # Badge, Modal, StatCard, Toast
│   ├── LoginPage.jsx             # Login + Register
│   ├── Dashboard.jsx             # Stats overview
│   ├── InvoiceList.jsx           # Search, filter, table/cards
│   ├── InvoiceForm.jsx           # Create / Edit form
│   ├── InvoiceDetail.jsx         # Detail modal + reminder history
│   ├── EmailModal.jsx            # Send reminder email
│   ├── ScheduleModal.jsx         # Auto-reminder setup
│   └── ReminderHistory.jsx       # All activity across invoices
└── lib/
    ├── auth.js                   # Register, login, session, password hashing
    ├── storage.js                # Per-user localStorage helpers
    ├── utils.js                  # Formatters, helpers, email templates
    └── constants.js              # Seed data, status config
```

---

## Notes

- Data is stored in localStorage per user account — each account has its own invoices
- Passwords are hashed with SHA-256 via the browser's Web Crypto API before storing
- `RESEND_TEST_EMAIL` redirects all outgoing emails to your inbox (remove for production with a verified domain)
- The auto-scheduler runs client-side while the app is open — for production, replace with a Vercel Cron Job + database