# 🎁 VELOOP Rewards — Full-Stack Giveaway Platform & Fraud Protection Engine

[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-emerald.svg)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple.svg)](https://vitejs.dev/)

An enterprise-grade, fintech-inspired Full-Stack Giveaway & Rewards System engineered for **VELOOP Rewards**. Built with strict cryptographic fairness, atomic balance transaction handling, anti-abuse fraud protection, and a luxury dark-mode user experience.

**Live Demo** : https://veloop-rewards-gpt-plum.vercel.app/

---

## 🌟 Architecture & Core Principles

The platform is strictly architected on the core security rule:
> **"Never trust values coming from the browser."**  
> *Anything visible or editable in the client (currency, amounts, balances, user identity, prize IDs) is treated as untrusted. The backend serves as the sole, authoritative source of truth.*

```
 ┌─────────────────────────────────────────────────────────┐
 │                   VELOOP User (Client)                  │
 └────────────────────────────┬────────────────────────────┘
                              │ API Request
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │            Security & Authentication Layer              │
 │  (Helmet, CORS, JWT Context, IP/Device Salted Fingerprint) │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │              Fraud Protection Assessment                │
 │    (Risk Scoring 0-100, Velocity Rate Limiter,          │
 │     Same-Device Multi-Account Compound Check)           │
 └────────────────────────────┬────────────────────────────┘
                              │ Verified
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │             Giveaway Service & Engine                   │
 │   - Authoritative Start/End Time Validation             │
 │   - Authoritative Database Prize Fee & Currency Lookup  │
 │   - Compound Unique Index Verification (userId+gwId)    │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │             Atomic Transaction Execution                │
 │   1. Currency Balance Deducted (VEs / SVEs / Tokens)    │
 │   2. Unique Participation Record Created                │
 │   3. Transaction Record Created (TXN-XXXX)              │
 │   4. Immutable Audit Log Appended (AUD-XXXX)            │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │           Success Response & Celebration UI             │
 └─────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. Frontend Experience (VELOOP Rewards)
- **Giveaway Hero & Banner**: Premium 3D render with glowing amber accents, dynamic state-aware CTAs, and live countdown.
- **Themed Giveaway Loader**: Custom animated gift box, rotating gold coins, particle twinkles, and status texts (*"Preparing today's rewards...", "Checking active giveaways..."*).
- **Winner Announcement Marquee**: Smooth, auto-scrolling social proof ticker displaying masked user IDs (e.g. `User VE****72 won iPhone 15 Pro`), with hover-pause.
- **Dedicated Individual Giveaway Details Page** (`/giveaway/:slug`):
  - In-depth prize overview, specifications, and approx value.
  - Live balance vs required fee calculator with deficit warnings.
  - 7-step timeline (*"How This Giveaway Works"*).
  - Detailed Terms & Conditions and single-entry policies.
- **Entry Confirmation Modal**:
  - Displays explicit breakdown: Entry Fee, Current Balance, and Balance After Joining.
  - Terms acknowledgment checkbox.
  - Button loading state (`⟳ Joining Giveaway...`) with debounce protection.
  - Success state with confetti celebration and transaction receipt.
- **Winner Spotlight & Prize Claim Modal**:
  - Automatically identifies if logged-in user matches a winner record (e.g. `VE10025` won Apple Watch Series 9).
  - Physical prizes require courier delivery fields (Full Name, Phone, Complete Address, City, State, PIN).
  - Amazon Gift Cards collect email address only (no physical address).
- **Interactive State Switcher Toolbar**:
  - Floating evaluation dock allowing live switching between:
    - **Visitor Mode** (Anonymous / Logged out)
    - **Winner User** (Rahul Sharma `VE10025` - Apple Watch winner)
    - **Regular User** (Priya Patel `VE10042` - 350 VEs)
    - **Low Balance User** (Amit Kumar `VE10099` - 50 VEs, triggers deficit warning)
    - **Flagged Account** (Suspicious User `VE99999`, triggers fraud protection block)
    - **Lifecycle Status**: Toggle ACTIVE, ENDED, and UPCOMING states on the fly.
    - **Audit Log Inspector**: Live modal displaying real-time database transactions and fraud events.

---

### 2. Backend & Fraud Protection Engine
- **Atomic Balance Deduction**: Guarantees balance deduction, entry creation, and transaction receipt either all succeed or fail together.
- **Compound Unique Index**: `userId + giveawayId` unique constraint ensures a user cannot participate twice in the same event.
- **Authoritative Database Lookups**: Ignores any client-supplied prices or balances; reads directly from database.
- **Idempotency Protection**: Accepts `x-idempotency-key` header to eliminate duplicate billing from rapid clicks.
- **Server-Side Timestamp Enforcement**: Rejects joins if `now > endAt` or `now < startAt`, regardless of client display.
- **Fraud Risk Scoring (0–100)**:
  - Account history & suspicious flags (+70)
  - Rapid click velocity under 1.5s (+40)
  - Same device fingerprint used across multiple accounts (+55)
  - Risk classifications: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **Winner Claim Security**: Enforces `authenticatedUserId === winner.userId` server-side before accepting claim submissions.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite 8 | Modern Single-Page Application |
| **Routing** | React Router DOM v7 | Dynamic routes `/`, `/giveaway/:slug`, `/winners` |
| **Icons & Visuals** | Lucide React, Canvas Confetti | Scalable SVGs, custom 3D renders |
| **Styling** | CSS Modules + Custom Tokens | Luxury dark palette, responsive design tokens |
| **Backend** | Node.js v22, Express.js | Modular RESTful architecture |
| **Database** | MongoDB / Mongoose 8 | With automatic embedded ACID store fallback |
| **Security** | Helmet, Express Rate Limit, Crypto | Salted device hashing, security headers |
| **Auth** | JSONWebToken (JWT) + Header Auth | Secure session verification |

---

## 📁 Folder Structure

```
VeLoop/
├── backend/
│   ├── src/
│   │   ├── config/              # db.js, config.js
│   │   ├── controllers/         # giveaway, participation, winner, claim, auth, admin
│   │   ├── middleware/          # auth, rateLimit, fraud, error
│   │   ├── models/              # store.js, schemas.js (compound indexes)
│   │   ├── routes/              # giveaway, participation, winner, claim, auth, admin
│   │   └── services/            # fraudService, giveawayService
│   ├── .env.example             # Environment configuration template
│   ├── package.json
│   └── server.js                # Server entry point (Port 5000)
│
├── frontend/
│   ├── public/
│   │   └── assets/              # High-res 3D giveaway visuals
│   ├── src/
│   │   ├── components/          # Hero, Stats, PrizeCard, Countdown, Modals, Loader, etc.
│   │   ├── context/             # AppContext.jsx (global reactive state)
│   │   ├── pages/               # GiveawayHome, GiveawayDetail, WinnersPage
│   │   ├── services/            # api.js (API client)
│   │   ├── styles/              # Global CSS & module sheets
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── package.json                 # Monorepo root script runner
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** v18+ (tested on v22)
- **npm** v9+

### 1. Clone & Install All Dependencies
```bash
# Clone the repository
git clone <repo-url>
cd VeLoop

# Install root, backend, and frontend dependencies in one command
npm run install:all
```

### 2. Configure Environment Variables
```bash
# In backend/
cp backend/.env.example backend/.env
```
Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/veloop_giveaway
JWT_SECRET=veloop_super_secure_jwt_secret_key_2026_giveaway_auth
DEVICE_SALT=veloop_fraud_protection_salt_998877
```

### 3. Run Development Environment
You can run both Backend and Frontend concurrently from the root directory:
```bash
npm run dev
```
Or start them individually:
```bash
# Terminal 1 - Backend (Port 5000)
npm run dev:backend

# Terminal 2 - Frontend (Port 5173)
npm run dev:frontend
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 API Reference Documentation

### 🎁 Giveaways
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/giveaways/current` | Optional | Returns active giveaway, prize list, and user state |
| `GET` | `/api/giveaways/:idOrSlug` | Optional | Returns single giveaway details by ID or slug |
| `GET` | `/api/giveaways/previous` | Public | Returns completed giveaways archive |
| `GET` | `/api/giveaways/all` | Public | Returns all giveaways on platform |

### 🎟️ Participation
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/giveaways/:id/my-status` | Required | Returns user participation and winner status |
| `POST` | `/api/giveaways/:id/join` | Required | Authoritatively joins giveaway and deducts entry fee |

**Join Request Payload:**
```json
{
  "giveawayId": "GW-2026-08",
  "prizeId": "PRIZE-001"
}
```

### 🏆 Winners & Claims
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/giveaways/:id/winners` | Public | Returns winner roll (disclaims while active) |
| `GET` | `/api/giveaways/previous/winners` | Public | Returns past winners with masked user IDs |
| `GET` | `/api/giveaways/:id/my-claim` | Required | Returns winner verification and claim state |
| `POST` | `/api/giveaways/:id/claim` | Required | Submits shipping address or gift card email |

### 🛡️ Admin & Evaluation Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/giveaway-status` | Toggle status (`ACTIVE`, `ENDED`, `UPCOMING`) |
| `POST` | `/api/admin/select-winners` | Trigger backend winner selection algorithm |
| `GET` | `/api/admin/audit-logs` | Retrieve live security and financial audit trail |
| `GET` | `/api/admin/fraud-events` | Retrieve flagged fraud events |
| `POST` | `/api/admin/reset` | Reset demo state back to default seeds |

---

## 🔒 Verification & Compliance Checklist

- [x] **Hero & Banner**: Visual illustration, live countdown, dynamic user state CTA.
- [x] **Real Countdown Timer**: Ticks continuously; auto-transitions state on zero.
- [x] **Prize Cards**: Position badges, fee requirements (`250 VEs`, `500 SVEs`, `2,000 Tokens`).
- [x] **Individual Giveaway Detail Page**: Routed at `/giveaway/:slug` with back button and specs.
- [x] **Balance Verification**: Authoritative server check, deficit warnings, and balance-after preview.
- [x] **Entry Confirmation Modal**: Prevents accidental clicks; shows deduction summary and loading state.
- [x] **Duplicate Participation Protection**: Compound database index `userId + giveawayId` prevents re-entry.
- [x] **Winner Claim Experience**: Restricts claims to verified winner user IDs; custom forms for physical vs gift card.
- [x] **Fraud Prevention Layer**: Salted device hash tracking, velocity limits, and multi-account detection.
- [x] **Themed Loader**: Custom animated gift box, coin spin, and rotating messages.
- [x] **Responsive Layout**: Validated across Mobile (320px+), Tablet (768px+), and Desktop (1280px+).

---

## 👥 Seed Test Accounts

| User ID | Name | Balances | Persona / Role |
|---|---|---|---|
| `VE10025` | Rahul Sharma | 850 VEs, 1,200 SVEs, 5,000 Tokens | **Winner** (Won Apple Watch Series 9 in completed draw) |
| `VE10042` | Priya Patel | 350 VEs, 800 SVEs, 3,500 Tokens | **Regular Participant** (Sufficient balance) |
| `VE10099` | Amit Kumar | 50 VEs, 40 SVEs, 200 Tokens | **Low Balance** (Simulates balance deficit warnings) |
| `VE99999` | Test User | 1,000 VEs, 2,000 SVEs | **Flagged Account** (Simulates fraud prevention block) |
| `VISITOR` | Anonymous | None | **Logged-Out State** (Simulates login required prompt) |

---
© 2026 VELOOP Rewards Inc. Designed and developed to the highest enterprise and fintech standards.
