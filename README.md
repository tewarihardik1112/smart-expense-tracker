# 💰 Smart Expense Tracker

**A full-stack, AI-powered expense tracker with real-time analytics, Google OAuth, and a Gemini-powered financial assistant.**

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Gemini API](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-smart--expense--tracker--nine--ebon.vercel.app-2ea44f?style=for-the-badge)](https://smart-expense-tracker-nine-ebon.vercel.app)

> ⚠️ **Cold start notice:** The backend runs on a free-tier instance that spins down after 15 minutes of inactivity. The first request after idling may take 30–60 seconds to respond — subsequent requests will be fast.

---

## 📖 Overview

Smart Expense Tracker is a production-deployed personal finance app that goes beyond basic CRUD — it uses Google's Gemini API to automatically categorize expenses, generate monthly financial insights, and answer natural-language questions about your spending. Built end-to-end with a Node/Express + PostgreSQL backend and a React/Vite frontend, then deployed across Vercel, Render, and Neon.

---

## ✨ Features

### 🔐 Authentication
- Email/password registration and login with bcrypt password hashing
- Google Sign-In (OAuth 2.0 via Passport.js) with automatic account linking to matching local accounts
- JWT-based stateless authentication

### 💸 Expense & Income Management
- Full CRUD for transactions — income and expense unified under one model
- Filter by type/category, search by title, and paginate results
- AI auto-categorization — leave the category blank and Gemini infers it from the transaction title

### 📊 Dashboard & Visualization
- Real-time totals for income, expense, and balance, computed via SQL aggregation
- Pie, bar, and line charts (Recharts) for category breakdown, income vs. expense, and monthly trends

### 🤖 AI Features (Google Gemini)

| Feature | What it does |
|---|---|
| **Auto-Categorization** | Classifies expenses into a fixed category set based on the transaction title |
| **Monthly Insights** | Generates a summary, top spending category, saving tip, and budget recommendation |
| **Conversational Chatbot** | Answers natural-language questions grounded in the user's actual transaction data |

### 🎨 UX
- Dark mode with persisted preference
- Fully responsive design with a mobile hamburger menu and adaptive charts
- Subtle Framer Motion animations for modals and page transitions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS v4, React Router, Axios, Recharts, Framer Motion |
| **Backend** | Node.js, Express, JWT, bcrypt, Passport.js |
| **Database** | PostgreSQL (Neon — serverless) |
| **AI** | Google Gemini API (`gemini-flash-lite-latest`) |
| **Hosting** | Vercel (frontend) · Render (backend) · Neon (database) |

---

## 🏗️ Architecture

```
smart-expense-tracker/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Reusable UI (modals, dialogs)
│       ├── context/        # Auth & Theme context providers
│       ├── layouts/        # Shared navbar/layout wrapper
│       ├── pages/          # Route-level pages
│       ├── routes/         # Protected route guard
│       └── services/       # Axios API service layer
│
└── server/                 # Express backend
    ├── config/             # Passport strategy configuration
    ├── controllers/        # Request handlers
    ├── db/                 # Connection pool & schema
    ├── middleware/         # JWT auth middleware
    ├── models/             # Parameterized SQL queries
    ├── routes/             # Express route definitions
    ├── services/           # Gemini AI service layer
    └── utils/              # JWT helpers
```

The backend follows an MVC pattern with clear separation between routing, business logic, and data access. Every protected route validates a JWT and scopes all database queries to the authenticated user, preventing cross-user data access at the query level.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register with email/password | Public |
| `POST` | `/api/auth/login` | Login with email/password | Public |
| `GET` | `/api/auth/google` | Initiate Google OAuth flow | Public |
| `GET` | `/api/auth/google/callback` | Google OAuth callback | Public |
| `GET` | `/api/auth/me` | Get current authenticated user | 🔒 |
| `GET` | `/api/expenses` | List transactions (filter/search/paginate) | 🔒 |
| `POST` | `/api/expenses` | Create a transaction (AI auto-categorizes if omitted) | 🔒 |
| `PUT` | `/api/expenses/:id` | Update a transaction | 🔒 |
| `DELETE` | `/api/expenses/:id` | Delete a transaction | 🔒 |
| `GET` | `/api/dashboard/summary` | Aggregated totals, chart data, recent transactions | 🔒 |
| `GET` | `/api/insights/monthly` | AI-generated financial insights | 🔒 |
| `POST` | `/api/chatbot/ask` | Ask the AI chatbot a question | 🔒 |

---

## 🤖 AI Design Notes

- Categorization is constrained to a fixed list of categories via prompt engineering, with a safe fallback (`Other`) if Gemini returns anything unexpected.
- Insights are requested as structured JSON, not free text, with defensive parsing so the frontend can reliably render distinct UI sections.
- The chatbot is intentionally stateless and single-turn — each question is answered using the user's financial summary and recent transactions as context, and the model is instructed to refuse questions it can't answer from the data rather than hallucinate.
- The app uses `gemini-flash-lite-latest` rather than standard Flash for a significantly higher free-tier rate limit, with no measurable drop in output quality for these use cases.
- Every AI call has defensive error handling — if Gemini is unavailable, the app degrades gracefully instead of breaking.

---

## 🔒 Security

- Passwords hashed with bcrypt, never stored or transmitted in plain text
- All SQL queries use parameterized statements to prevent SQL injection
- JWTs are short-lived (7 days) and signed with a server-side secret
- CORS is restricted to explicitly allowed frontend origins
- Ownership checks (`WHERE user_id = $1`) are enforced at the database query level on every read/write

---

## 🚀 Running Locally

Prerequisites: Node.js, PostgreSQL, a Google Cloud OAuth client, and a Gemini API key.

```bash
git clone https://github.com/tewarihardik1112/smart-expense-tracker.git
cd smart-expense-tracker

# Backend
cd server
npm install
# create server/.env (see below), then run db/schema.sql against your database
npm run dev

# Frontend (in a new terminal)
cd client
npm install
# create client/.env (see below)
npm run dev
```

**`server/.env`**
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/smart_expense_tracker
JWT_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

**`client/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📌 Roadmap

- [ ] **Automated testing** — unit tests for controllers/models and integration tests for critical auth and expense flows
- [ ] **Multi-turn chatbot memory** — allow follow-up questions that reference earlier context in the same conversation
- [ ] **Recurring transactions** — auto-log fixed monthly expenses like subscriptions or rent
- [ ] **Budget alerts** — notify users when spending in a category approaches a self-set limit
- [ ] **Custom domain** — move off the default Vercel/Render subdomains
---

### Built by Hardik Tewari

[![GitHub](https://img.shields.io/badge/GitHub-tewarihardik1112-181717?logo=github&logoColor=white)](https://github.com/tewarihardik1112)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/hardik-tewari-8412aa299)
