# 📘 New State High School — Complete Developer Handover & Architecture Guide

> **Institution:** New State High School, 36 Palm Avenue, Mushin, Lagos State, Nigeria  
> **Motto:** *Domine Dirige Nos* (Lord Direct Us)  
> **Target Environment:** Strictly **Day Secondary School** (JSS 1 – SSS 3)  
> **Live Production URL:** [https://newstatehighschool.web.app](https://newstatehighschool.web.app)  
> **GitHub Repository:** [https://github.com/L4yi/new-state](https://github.com/L4yi/new-state) (branch: `main`)

---

## 📑 Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Frontend Architecture (`src/`)](#2-frontend-architecture-src)
3. [Backend Architecture (`server/`)](#3-backend-architecture-server)
4. [Security, Input Washing & SQL/NoSQL Injection Defense](#4-security-input-washing--sqlnosql-injection-defense)
5. [Print Engine Architecture (`printUtils.js`)](#5-print-engine-architecture-printutilsjs)
6. [Data Models & Schema Reference](#6-data-models--schema-reference)
7. [Environment Variables & Configuration](#7-environment-variables--configuration)
8. [Build, Test & Deployment Pipeline](#8-build-test--deployment-pipeline)

---

## 1. System Overview & Architecture

The application is structured into two decoupled tiers:
1. **Client Tier (Frontend):** React 19 SPA bundled with Vite and Tailwind CSS v4, hosted on Google Firebase Hosting CDN.
2. **Server Tier (Backend API):** Node.js / Express ES-Modules API with Mongoose ORM, JSON Web Tokens (JWT) role authorization, Helmet headers, and IP rate limiting.

```
                         ┌──────────────────────────────────────────────┐
                         │           Client (React + Vite)              │
                         │   - Public Marketing & Admissions Pages      │
                         │   - Multi-Role Portal (Student/Staff/Admin)  │
                         │   - Multi-Device 1-Page A4 Print Engine      │
                         └──────────────────────┬───────────────────────┘
                                                │ HTTPS / REST (JWT)
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │         Backend (Node.js + Express)          │
                         │   - Helmet Headers & Anti-Brute Rate Limits  │
                         │   - Role-Based Access Control (RBAC)         │
                         │   - Input Sanitization & Regex Escaping      │
                         └──────────────────────┬───────────────────────┘
                                                │ Parameterized Queries
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │          Database (MongoDB Cluster)          │
                         │   - Students, Staff, Results, Payments       │
                         └──────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture (`src/`)

### Key Entry & Routing Files:
- **`src/App.jsx`**: Master router and state coordinator.
  - Automatically parses initial `window.location.pathname` on mount and popstate.
  - Injects dynamic SEO `<title>` and `<meta name="description">` tags per route.
  - Embeds the sticky `MobileQuickBar` (touch targets $\ge 44\text{px}$) and `PrivacyBanner`.
  - Routes invalid URLs automatically to `NotFound.jsx` (`/404`).
- **`src/index.css`**: Tailwind CSS v4 root stylesheet with custom `@theme` brand tokens (`--color-green-primary: #0B5D3B`, `--color-green-dark: #06452C`, etc.) and `@media print` layout overrides.

### Pages Directory (`src/pages/`):
| File | Responsibility |
| :--- | :--- |
| **`Home.jsx`** | Landing page featuring the school hero, stats, leadership, and photo galleries. |
| **`About.jsx`** | School history (est. 1980), mission, core values, and administrative board. |
| **`Academics.jsx`** | Junior & Senior Secondary curriculums (Science, Commercial, Arts). |
| **`Admission.jsx`** | Online 2026/2027 application form with instant screening fee processing. |
| **`AiCoding.jsx`** | New State ICT & AI Academy curriculum (Python, Robotics, Web Dev). |
| **`ExamSuccess.jsx`** | Historical 100% WAEC, NECO, and BECE distinction pass records. |
| **`AlumniTestimonials.jsx`**| Alumni Hall of Fame featuring distinguished graduates. |
| **`TeachersApply.jsx`** | Academic careers and recruitment portal for subject educators. |
| **`Contact.jsx`** | Campus location (36 Palm Avenue, Mushin), map, and registry hotlines. |
| **`CandidateLogin.jsx`**| Prospective student screening status and admission letter verification. |
| **`BuyPlan.jsx`** | School prospectus purchase and entrance examination registration. |
| **`PrivacyPolicy.jsx`** | Nigeria Data Protection Act (NDPR) compliant student privacy policy. |
| **`TermsOfAdmission.jsx`**| Day school regulations, 7:30 AM resumption rules, and disciplinary code. |
| **`NotFound.jsx`** | Clean branded 404 recovery screen with direct jump routes and registry hotline. |
| **`Portal.jsx`** | Unified authentication gateway for Students, Teachers, Bursar, and Admin. |

### Portal Subsystems (`src/components/portal/`):
- **`StudentDashboard.jsx`**: Term schedule, lecture notes, bio-data, and terminal report card trigger.
- **`TeacherDashboard.jsx`**: Continuous Assessment entry (CA1, CA2, Exam) with automatic A1–F9 grading.
- **`BursarDashboard.jsx`**: Bank deposit verification, payment approvals, and tuition clearance ledger.
- **`AdminDashboard.jsx`**: Applications processing, student registry, teacher allocation, announcements, provisional admission letter printing, and **1-Click CSV/Excel Data Exporter**.
- **`OfficialReportCardModal.jsx`**: Nigerian Terminal Sheet (Cognitive, Affective, Psychomotor, Principal remarks, and Heraldry) formatted for **1-page A4 printing**.

---

## 3. Backend Architecture (`server/`)

The backend is built with clean separation of concerns:

```
server/
├── .env                       # Environment secrets (PORT, MONGODB_URI, JWT_SECRET)
├── package.json               # Backend dependencies (express, mongoose, helmet, cors, etc.)
├── server.js                  # Express application setup, security middleware, DB connection
├── models/                    # Mongoose database schemas
│   ├── Student.js             # Enrolled student bio-data, class arm, portal PIN, fee status
│   ├── Staff.js               # Teacher credentials, department, assigned class (Form Master)
│   ├── Result.js              # Continuous assessment scores, subjects, remarks, psychomotor
│   ├── Payment.js             # Tuition transactions, bank references, bursary approvals
│   ├── Application.js         # Prospective student online admissions applications
│   ├── Announcement.js        # School-wide broadcast notices
│   └── Assignment.js          # Class homework and term lecture notes
├── routes/
│   └── portalRoutes.js        # REST API endpoints for all portal roles
└── scripts/
    └── seedPortalData.js      # Initial database population script
```

### Complete List of Backend Files & Endpoints:

#### 1. `server/server.js` (Core Server)
- **Helmet Headers:** Secures HTTP headers against sniffing, clickjacking, and XSS.
- **Strict CORS:** Whitelists Firebase domains (`https://newstatehighschool.web.app`), localhost, and Vercel endpoints.
- **Global Rate Limiter:** Limits requests to max 300 per 15 minutes per IP.
- **Body Parser Limits:** Caps JSON payloads at 5MB to prevent Payload Denial-of-Service attacks.

#### 2. `server/routes/portalRoutes.js` (API Gateway)
| Method | Endpoint | Role / Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/portal/login` | Public (Rate-Limited) | Authenticates student, teacher, bursar, or admin via JWT. |
| `POST` | `/api/portal/candidate-login` | Public | Checks prospective applicant entrance screening status. |
| `POST` | `/api/portal/apply` | Public | Submits a new online admission application. |
| `GET` | `/api/portal/student/dashboard`| Student (JWT) | Retrieves student bio-data, term results, and timetables. |
| `POST` | `/api/portal/student/payment-receipt` | Student (JWT) | Submits bank transfer reference for bursary clearance. |
| `GET` | `/api/portal/teacher/dashboard`| Teacher (JWT) | Loads assigned class students and broadsheet scores. |
| `POST` | `/api/portal/teacher/save-grades`| Teacher (JWT) | Saves CA1, CA2, and Exam scores with grade auto-computation. |
| `GET` | `/api/portal/bursar/dashboard` | Bursar (JWT) | Fetches pending and approved payment transactions. |
| `POST` | `/api/portal/bursar/verify-payment` | Bursar (JWT) | Clears student tuition and updates student clearance status. |
| `GET` | `/api/portal/admin/dashboard` | Admin (JWT) | Master overview of enrollments, applications, and teachers. |
| `POST` | `/api/portal/admin/register-student` | Admin (JWT) | Enrolls student, generates ID (`NSHS/2026/XXX`) and PIN. |
| `POST` | `/api/portal/admin/update-application` | Admin (JWT) | Approves or declines prospective admissions applications. |
| `POST` | `/api/portal/admin/announcements` | Admin (JWT) | Broadcasts announcement to all portal users. |

---

## 4. Security, Input Washing & SQL/NoSQL Injection Defense

### Why Input Washing is Mandatory:
Unsanitized user inputs can lead to:
1. **Cross-Site Scripting (XSS):** Malicious JavaScript entered into forms executing in another user's browser.
2. **SQL / NoSQL Injection:** Attackers supplying special operators (`$gt: ""`, `' OR 1=1 --`) to bypass passwords or alter queries.
3. **Regular Expression Denial of Service (ReDoS):** Supplying complex regex payloads that freeze server CPU threads.

### How We Sanitize & Prevent Injections:

#### 1. Regex & String Escaping (NoSQL / ReDoS Defense)
In `server/routes/portalRoutes.js`, user search queries are escaped using the regex sanitizer:
```javascript
const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Safe Query Execution:
const cleanSearch = escapeRegex(req.query.search);
const students = await Student.find({
  name: { $regex: cleanSearch, $options: 'i' }
});
```

#### 2. Mongoose Schema-Level Type Casting
Mongoose models strictly cast and validate types. If an attacker attempts to send an object `{ "$gt": "" }` to a string field (like `portalPin` or `password`), Mongoose rejects it or casts it to a literal string, neutralizing operator injection.

#### 3. Strict Whitelisting & Input Boundaries
- **PIN Generation:** Generates unambiguous uppercase alphanumeric codes without vulnerable symbols.
- **Payload Limits:** Maximum JSON payload is constrained to 5MB.
- **Login Rate Limiting:** Limits login attempts to **10 tries per 15 minutes** per IP address.

---

## 5. Print Engine Architecture (`printUtils.js`)

Located at `src/utils/printUtils.js`:
- **Desktop Strategy:** Injects printable content into a sandboxed, hidden `<iframe>`, resolves relative URLs (`/school-logo.png`) into absolute URLs (`window.location.origin`), waits for fonts and images to load, and invokes `iframe.contentWindow.print()`.
- **Mobile Strategy (iOS / Android):** Ancestor modal backdrops (`fixed inset-0`) cause mobile browsers to clip layouts. The mobile print engine creates an isolated document window with a sticky top bar and native print trigger.
- **1-Page A4 Guarantee:** All tables, badges, psychomotor grids, and signature blocks are formatted with precise CSS line-heights and margins to ensure **100% single-page A4 portrait output**.

---

## 6. Data Models & Schema Reference

### `Student` Model (`server/models/Student.js`):
- `id` (String, Unique): e.g., `NSHS/2026/001`
- `name` (String): Full student name
- `class` (String): e.g., `JSS 1`, `SSS 2 (Science)`
- `arm` (String): `Arm A`, `Arm B`
- `gender` (String): `Male` / `Female`
- `portalPin` (String): 6-digit access code
- `feeStatus` (String): `Paid`, `Partially Paid`, `Unpaid`
- `guardian` (Object): Name, relationship, phone, email, address

### `Staff` Model (`server/models/Staff.js`):
- `staffId` (String, Unique): e.g., `STF/2026/001`
- `name` (String): Full teacher name
- `email` (String, Unique): Official staff email
- `department` (String): `Sciences & Technology`, `Languages & Arts`, `Commercial`
- `role` (String): `Senior Teacher`, `Teacher`, `Form Master`
- `classAssigned` (String): e.g., `SSS 3 - Arm A`
- `subjectsTaught` (Array): Subject names and class assignments

---

## 7. Environment Variables & Configuration

### Frontend (`.env` in root):
```ini
VITE_API_URL=https://your-backend-api.vercel.app/api
```
*(If omitted, frontend automatically falls back to secure mock portal data for offline resilience).*

### Backend (`server/.env`):
```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/newstate?retryWrites=true&w=majority
JWT_SECRET=newstate_high_school_jwt_secret_2026_production
NODE_ENV=production
```

---

## 8. Build, Test & Deployment Pipeline

### Local Development:
```bash
# Frontend
npm install
npm run dev          # Starts Vite dev server at http://localhost:5173

# Backend
cd server
npm install
npm run dev          # Starts Express server with nodemon at http://localhost:5000
```

### Production Build:
```bash
npm run build        # Compiles frontend to dist/ in ~1.5s
```

### Deployment to Firebase Hosting:
```bash
firebase deploy --only hosting
```

---

*Document compiled and verified for New State High School Engineering Team.*
