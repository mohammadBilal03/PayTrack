# PayTrack – Payment Reminder System

A mini payment reminder system built for the BinaryAutomates Software Engineering Internship assignment.

## Features

- Create, edit, and delete invoices
- Track payment status — Pending, Overdue, Paid, Draft
- Send real email reminders via Resend
- Schedule automatic repeating reminders
- Full reminder activity history with timestamps
- Search and filter invoices
- Dashboard with summary stats
- User authentication (register/login)
- Responsive UI — works on desktop and mobile

## Tech Stack

- **Frontend** — Next.js 14, React 18
- **Email** — Resend API
- **Storage** — localStorage (per user)
- **Auth** — SHA-256 password hashing via Web Crypto API
- **Deployment** — Vercel

## Setup

1. Clone the repository
   git clone https://github.com/mohammadBilal03/PayTrack.git
   cd PayTrack

2. Install dependencies
   npm install

3. Create environment file
   cp .env.local.example .env.local

4. Add your Resend API key to .env.local
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=onboarding@resend.dev
   RESEND_TEST_EMAIL=your@email.com

5. Run the development server
   npm run dev

6. Open http://localhost:3000

## Environment Variables

| Variable | Description |
|---|---|
| RESEND_API_KEY | Your Resend API key from resend.com |
| EMAIL_FROM | Sender email address |
| RESEND_TEST_EMAIL | Redirect all emails here during testing |

## Notes

- Data is stored in localStorage per user account
- Passwords are hashed with SHA-256 before storing
- RESEND_TEST_EMAIL redirects all outgoing emails to your inbox (remove for production)