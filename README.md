# XEVOPROP — Next-Gen PropTech Ecosystem

<div align="center">

![Xevoprop Platform](frontend/public/logo.jpeg)

**A Product of [Xevotech](https://www.linkedin.com/company/xevotech/)**  
*Next-generation real estate discovery, verified developer listings, intelligent property matching, and anti-spam authenticated transactions.*

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)]()

</div>

---

## 🌟 Executive Overview

**XEVOPROP** is an enterprise-grade PropTech portal engineered to replace disjointed real estate directories with a unified, high-trust digital ecosystem. Designed with an obsidian luxury glassmorphic design language, intelligent natural-language discovery, and strict anti-spam authentication protocols, XEVOPROP connects premium property buyers directly with verified builders and developers across India's top metropolitan hubs (Hyderabad, Bengaluru, and beyond).

---

## 🚀 Key Features & Architectural Highlights

### 1. 🛡️ Enterprise Anti-Spam & Mobile OTP Authentication
- **Spam Domain Protection**: Instant client and server-side rejection of disposable email providers (`tempmail`, `10minutemail`, `mailinator`, `guerrillamail`, etc.).
- **Mobile OTP Task Modal**: Mandatory 6-digit phone verification barrier prior to profile activation to eliminate bot registrations and fraudulent enquiries.
- **Rate-Limited OTP Dispatch**: Prevents SMS flooding with client cooldown timers and server-side verification checkpoints.

### 2. 💎 Obsidian Glassmorphism Luxury UI/UX
- **Custom Design Tokens**: Engineered with deep obsidian blacks (`#06080D`), frosted glass backdrops (`backdrop-filter: blur(20px)`), and electric cyan accents (`#00D2FF`).
- **Zero PPT-Style Block Clutter**: Clean editorial typography, contextual hover reactions, and fluid micro-interactions.
- **Official Xevotech Corporate Identity**: Integrated official Xevotech brand geometry and iconography across navbar, hero, and footer.

### 3. 🔍 Intelligent Property Discovery
- **Natural Language Intent Matching**: Interactive discovery console parsing real-world buyer intents ("Ready 3BHK in Financial District under ₹2.5 Cr").
- **Real-Time Synchronized Filters**: Seamless two-way parameter binding across Hero, Search, Categories, and Catalog views.
- **RERA-Verified Luxury Catalog**: Curated listings with verified RERA IDs, builder portfolios, possession timelines, and ₹/sq.ft transparency.

### 4. 🏢 Developer & Project Hub
- Dedicated portal for builders to showcase townships, sky-mansions, and commercial parks.
- Direct buyer lead management, scheduled property visit bookings, and live enquiry tracking.

### 5. 📬 Live Corporate Communications
- Verified social linkages: [LinkedIn (Xevotech)](https://www.linkedin.com/company/xevotech/), Instagram, and Facebook.
- Genuinely functional newsletter subscription with real-time format validation, loading feedback, and deduplicated persistence.

---

## 🏗️ Architecture & Tech Stack

```
xevoprop/
├── frontend/                     # React 18 + Vite SPA
│   ├── public/                   # Static assets & official logo
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Logo, SocialIcons, Modals
│   │   ├── context/              # AuthContext & state management
│   │   ├── data/                 # Curated luxury properties & project seeds
│   │   ├── pages/                # Home, Search, Properties, Projects, About, Auth...
│   │   ├── sections/             # Hero, IntelligentDiscovery, Featured, WhyXevo...
│   │   └── index.css             # Obsidian Glassmorphic design tokens
│   └── vite.config.js
│
├── backend/                      # Node.js + Express REST API
│   ├── config/                   # PostgreSQL pool & Cloudinary integration
│   ├── routes/                   # Auth (OTP, anti-spam), properties, projects, leads
│   ├── middleware/               # JWT token authentication & role validation
│   └── server.js                 # API server entrypoint
│
└── README.md
```

---

## ⚡ Quick Start & Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL instance (local or hosted on Render/Supabase)

### 1. Clone the Repository
```bash
git clone https://github.com/puneethkalinga/xevoprop.git
cd xevoprop
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

The application will run locally at `http://localhost:5173`.

---

## 📦 Production Deployment

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Set Build Command: `npm run build`.
4. Set Output Directory: `dist`.
5. Add Environment Variable: `VITE_API_URL=https://<your-backend-domain>/api`.

### Backend (Render)
1. Create a Web Service on [Render](https://render.com).
2. Set Root Directory to `backend`.
3. Set Build Command: `npm install`.
4. Set Start Command: `npm start` or `node server.js`.
5. Add Environment Variables from `.env.example`.

---

## 🛡️ Security & Anti-Abuse Controls
- Parameterized SQL queries to prevent SQL injection.
- JWT tokens with HTTP-only cookie or secure bearer headers.
- Real-time regex sanitization for email addresses and phone formats.
- Pre-registration OTP gatekeeping against bot-driven database spam.

---

## 📄 License & Ownership
Copyright © 2026 **Xevotech**. All rights reserved.  
Unauthorized copying, duplication, or distribution of this software without explicit permission from Xevotech is strictly prohibited.
