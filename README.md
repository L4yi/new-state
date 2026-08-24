# 🏫 New State High School — Enterprise Digital Campus & Portal

[![Live Production](https://img.shields.io/badge/Live%20Site-Firebase%20Hosting-008751?style=for-the-badge&logo=firebase)](https://newstatehighschool.web.app/)
[![Backend Status](https://img.shields.io/badge/Backend%20API-Active%20%26%20Protected-06452C?style=for-the-badge&logo=express)](https://newstatehighschool.web.app/portal)
[![Security Level](https://img.shields.io/badge/Security-RBAC%20%7C%20JWT%20%7C%20IDOR--Hardened-emerald?style=for-the-badge&logo=shield)](https://github.com/L4yi/new-state)

> **Motto**: *Domine Dirige Nos* (Lord, Direct Us)  
> **Location**: 36 Palm Avenue, Mushin, Lagos State, Nigeria  
> **Production URL**: [https://newstatehighschool.web.app/](https://newstatehighschool.web.app/)

---

## 📖 Executive Overview

**New State High School Web Portal** is an enterprise-grade full-stack school management system, admission engine, and digital portal built specifically for Nigerian secondary school standards (WAEC / NECO / BECE / Lagos State Ministry of Basic & Secondary Education).

It replaces legacy paper logbooks with real-time academic broadsheets, official cryptographic result print engines, multi-role dashboards, automated financial reconciliation, and robust anti-tamper security.

---

## 🛠️ Complete Technology Stack

```
                   NEW STATE HIGH SCHOOL ARCHITECTURE
 ┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
 │     Frontend Layer        │       Backend Layer       │     Database & Storage    │
 ├───────────────────────────┼───────────────────────────┼───────────────────────────┤
 │ • React 18 (SPA)          │ • Node.js (ES Modules)    │ • MongoDB Atlas (Cloud)   │
 │ • Vite 8.2 (Fast Bundler) │ • Express.js REST API     │ • Mongoose 8.4 Schemas    │
 │ • Tailwind CSS v3         │ • JWT Auth + RBAC Gate    │ • localStorage Cache Sync │
 │ • Lucide React Icons      │ • Bcrypt.js (PIN Hashing) │ • UTF-8 BOM CSV Engine    │
 │ • HTML5 Print Engine      │ • Helmet & Strict CORS    │ • SVG Dynamic Charts      │
 └───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 👥 Multi-Role Portal System & Credentials

The portal features 4 distinct, isolated roles with role-based access control (RBAC):

| Role | Access Level | Demo Credentials | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **🧑‍🎓 Student / Parent** | Personal Portal | `NSHS/2026/001` / PIN `1234` | View term grades, download printable report card, submit bank transfer receipt, access e-library & timetable |
| **👨‍🏫 Subject / Class Teacher** | Academic Engine | `science@newstateschools.org` / `1234` | Enter CA1 (20), CA2 (20), Exam (60) scores with auto WAEC grading (A1–F9), upload homework assignments |
| **💼 Bursar Office** | Finance Ledger | Username `bursar` / PIN `1234` | Approve/decline bank payments, reconcile outstanding student balances, view revenue stats |
| **🏛️ Admin / Principal** | Master Registry | Username `admin` / PIN `1234` | Manage student roster, allocate teachers to classes, publish announcements, 1-click CSV broadsheet export |

---

## 🛡️ Security Architecture & Hardening Matrix

This codebase incorporates enterprise defensive measures to protect student bio-data and financial records:

```
                              SECURITY MATRIX
 ┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
 │  1. RBAC Data Isolation   │  2. 100% IDOR Immunity    │  3. NoSQL / SQLi Defense  │
 │     /api/portal/data is   │     Student ID derived    │     Inputs forced to      │
 │     role-filtered via JWT │     from verified token   │     primitive strings     │
 ├───────────────────────────┼───────────────────────────┼───────────────────────────┤
 │  4. Anti-Brute-Force      │  5. User Enumeration Fix  │  6. Mass Assignment Guard │
 │     Max 10 login tries    │     Uniform 401 response  │     Strict whitelist on   │
 │     per 15 min per IP     │     for all login errors  │     all database updates  │
 └───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

- **Role-Filtered Data Access**: Public unauthenticated visitors only receive general school info. Students receive only their own records; teachers receive only their assigned class broadsheet; only admins receive master data.
- **IDOR Immunity**: Endpoints for result retrieval and fee payment discard client-supplied IDs and strictly read `req.user.id` from the cryptographically signed JWT.
- **Rate Limiting**: `express-rate-limit` prevents brute-force credential stuffing and admission spam.
- **ReDoS & Injection Defense**: Regex special characters are sanitized with `escapeRegex()`, and all identifiers/passwords are cast to primitive strings before MongoDB evaluation.

---

## 📂 Project Directory Structure

```
new-state/
├── public/                     # Static assets & standalone presentation documents
│   ├── board-presentation.html # Standalone Board of Governors presentation & script
│   ├── sitemap.xml             # Production SEO sitemap
│   └── robots.txt              # Search crawler directives
├── server/                     # Express.js REST API & Database Models
│   ├── models/                 # Mongoose Schemas (Student, Staff, Result, Payment, etc.)
│   ├── routes/                 # Express API routes (portalRoutes.js with RBAC & Auth)
│   ├── scripts/                # Database seed scripts (seed.js)
│   ├── server.js               # Express entrypoint with Helmet, CORS & Rate Limiting
│   └── package.json            # Backend dependencies
├── src/                        # React Frontend (Vite + Tailwind)
│   ├── components/             # Reusable UI widgets & dashboards
│   │   ├── portal/             # Student, Teacher, Bursar, Admin & Report Card Dashboards
│   │   ├── Navbar.jsx          # Top navigation bar with active route highlight
│   │   ├── Footer.jsx          # Site footer with legal links (Privacy, Terms)
│   │   ├── MobileQuickBar.jsx  # Mobile quick action bar (Call, WhatsApp, Apply)
│   │   └── PrivacyBanner.jsx   # NDPR cookie & session consent banner
│   ├── data/                   # Mock fallback datasets (mockPortalData.js)
│   ├── pages/                  # Route views (Home, About, Academics, Admission, Portal, etc.)
│   ├── config/                 # API connection endpoints (api.js)
│   ├── App.jsx                 # Master router with history pushState & 404 handler
│   └── index.css               # Tailwind CSS & custom animations
├── DEVELOPER_HANDOVER.md       # Full architectural handover & print engine documentation
├── firebase.json               # Firebase hosting configuration & SPA rewrite rules
├── package.json                # Frontend package dependencies & scripts
└── vite.config.js              # Vite bundler configuration
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance running on port 27017, or a MongoDB Atlas URI

---

### 2. Clone & Install Dependencies

```bash
# 1. Clone repository
git clone https://github.com/L4yi/new-state.git
cd new-state

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install
cd ..
```

---

### 3. Environment Variables Setup

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/newstate
JWT_SECRET=your_super_secret_jwt_key_2026_production
NODE_ENV=development
```

*(Optional)* Create a `.env` file in the root directory for frontend API configuration:
```env
VITE_API_URL=http://localhost:5000/api/portal
```

---

### 4. Seed the Database & Run Development Servers

```bash
# Step A: Seed initial students, staff, results, and fees
cd server
npm run seed
cd ..

# Step B: Start backend server (Terminal 1)
cd server
npm run dev

# Step C: Start Vite frontend (Terminal 2)
npm run dev
```

Open **`http://localhost:5173`** in your browser to view the application.

---

## 🚢 Production Build & Deployment

### Build the Frontend
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

---

## 📊 Ministry-Grade Report Card & Print Engine

The application includes an official terminal continuous assessment report card formatted to exact Lagos State Ministry of Education standards:
- **Academic Score Breakdown**: CA1 (20) + CA2 (20) + Exam (60) = 100 Total.
- **WAEC / NECO Standard Scale**: A1 (75+), B2 (70-74), B3 (65-69), C4 (60-64), C5 (55-59), C6 (50-54), D7 (45-49), E8 (40-44), F9 (0-39).
- **Physical Traits & Behaviour Ratings**: 5-point Likert ratings (Punctuality, Neatness, Politeness, Leadership).
- **QR Code Verification**: Direct instant verification for universities and employers.
- **Print Optimization**: Configured with `@media print` CSS rules to fit exactly onto standard A4 paper without awkward line-breaks.

---

## 🤝 Contribution Guidelines

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "feat: description of changes"`
3. Push to your branch: `git push origin feature/your-feature-name`
4. Open a Pull Request on GitHub.

---

## 📄 License & Ownership
Copyright © 2026 **New State High School, Mushin, Lagos, Nigeria**.  
*All rights reserved.*
