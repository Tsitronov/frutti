# CareTrack — Care Management CRM

A production-ready, GDPR/CCPA-compliant web CRM for nursing homes, rehabilitation centres, social-service organisations, and private caregivers. Built with React 18, Redux Toolkit, Express, and PostgreSQL.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Security](#security)
- [Compliance](#compliance)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Resident management** — ward-based organisation, per-resident care plans (nutrition, mobility, hygiene, clothing, accessories)
- **Notes & Articles** — categorised notes and long-form articles with pagination and modal viewer
- **AI-assisted search** — natural-language resident search via built-in chatbot (dept 3 / surname / room)
- **Role-based access** — three permission levels (viewer / staff / admin)
- **Dark mode** — persisted theme toggle with CSS variables
- **Export** — PDF and Excel export of resident data
- **Photo gallery** — team photo management with upload
- **GDPR cookie banner** — consent stored in localStorage, no re-prompt after acceptance
- **Privacy Policy** — GDPR Art. 6 + CCPA + COPPA + CalOPPA compliant
- **Terms & Conditions** — covering EU and US law
- **Error Boundary** — graceful crash recovery
- **TypeScript-ready** — `tsconfig.json` with `allowJs: true` for gradual migration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, React Router v7, react-hook-form |
| Styling | CSS Variables (light/dark), mobile-first responsive |
| State | Redux Toolkit with `createAsyncThunk` |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (access token in memory, refresh token in HttpOnly cookie) |
| Export | jsPDF, jspdf-autotable, xlsx, file-saver |
| Deployment | Render.com |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL ≥ 14

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd frutti

# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install
```

### Running locally

```bash
# Terminal 1 — backend
cd server
cp .env.example .env   # fill in your values
npm start

# Terminal 2 — frontend
cd client
cp .env.example .env   # set REACT_APP_API_URL
npm start
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Frontend (`client/.env`)

```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (`server/.env`)

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/caretrack
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## Available Scripts

### Frontend

```bash
npm start        # Development server (port 3000)
npm run build    # Production build → client/build/
```

### Backend

```bash
npm start        # Start Express server
npm run dev      # Development with nodemon
```

---

## Security

- JWT **access tokens stored in memory only** — never in localStorage or sessionStorage
- Refresh token in **HttpOnly, Secure** cookie (not accessible via JavaScript)
- **bcrypt** password hashing
- Rate limiting on `/api/login` (max 5 attempts per 15 min)
- Security HTTP headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- CORS restricted to configured origin
- Role-based access: read-only (1), staff (2), admin (3)

---

## Compliance

### GDPR (EU)
- Data minimisation — only necessary fields collected
- Legal basis documented (Art. 6(1)(b), (c), (f); Art. 9(2)(h) for health data)
- Data subject rights supported: access, rectification, erasure, portability, objection
- 72-hour breach notification procedure in place
- International transfers via Render.com SCCs (Decision 2021/914)
- Privacy Policy and cookie consent banner included

### CCPA / CalOPPA (California)
- No sale or sharing of personal information
- Data subject rights: know, delete, correct, opt-out, non-discrimination
- Do Not Track honoured
- Privacy Policy accessible from home page

### COPPA
- Service not directed to children under 13
- No knowing collection of data from children under 13

### HIPAA (USA)
- The default deployment does not include a Business Associate Agreement (BAA).
- If you are a Covered Entity or Business Associate under HIPAA, contact [tsitronov2017@gmail.com](mailto:tsitronov2017@gmail.com) before storing PHI.

---

## Deployment

The application is deployed on [Render.com](https://render.com).

### Frontend (Static Site)

- Build command: `cd client && npm run build`
- Publish directory: `client/build`
- Set `REACT_APP_API_URL` to your backend URL

### Backend (Web Service)

- Build command: `cd server && npm install`
- Start command: `node index.js` (or your entry point)
- Set all backend environment variables in the Render dashboard

### Database

- Provision a PostgreSQL instance on Render or another provider
- Set `DATABASE_URL` in backend environment variables

---

## Project Structure

```
frutti/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── UI/
│   │   │   │   ├── CookieBanner.jsx
│   │   │   │   ├── forms/
│   │   │   │   ├── modal/
│   │   │   │   ├── navbar/
│   │   │   │   ├── pagination/
│   │   │   │   └── sidebar/
│   │   │   └── pages/
│   │   │       ├── Login.jsx
│   │   │       ├── SulSito.jsx      # Landing page
│   │   │       ├── Generale.jsx
│   │   │       ├── Appunti.jsx
│   │   │       ├── Articoli.jsx
│   │   │       ├── Utenti.jsx       # Resident management
│   │   │       ├── PrivacyPolicy.jsx
│   │   │       └── TermsConditions.jsx
│   │   ├── redux/                   # Redux Toolkit slices
│   │   ├── context.js               # AuthContext
│   │   ├── api.js                   # Axios instance + token management
│   │   ├── App.js
│   │   └── App.css
│   ├── tsconfig.json
│   └── package.json
└── server/                  # Express backend
    └── ...
```

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

Copyright © 2026 Evgenii Tsitronov

---

## Contact

Email: [tsitronov2017@gmail.com](mailto:tsitronov2017@gmail.com)
