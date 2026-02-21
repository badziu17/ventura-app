# Ventura — Travel Planning App

Interactive MVP prototype of **Ventura**, an intelligent travel companion that replaces 5-10 apps with one. Plan, pack, budget, book, and coordinate group trips — all powered by AI.

**Live demo data:** 3-day Bucharest trip, Mar 7-9, 2026.

## Features

- **Home Screen** — trip library with cover images, status badges, new trip creation, inspiration carousel
- **Trip Planner** — interactive SVG map, collapsible day-by-day itinerary with timeline, weather, costs
- **AI Planner** — conversational AI chat (GPT-4o) with route optimization, restaurant recs, weather tips
- **Smart Packing** — weather-adaptive lists, AI-suggested items, progress tracking, per-person assignment
- **Budget Tracker** — editable total budget, category breakdown, expense splitting (Splitwise-style), RON↔PLN conversion
- **Group Chat** — real-time trip messaging between travelers
- **Booking Hub** — partner deals with real affiliate links (Booking.com, GetYourGuide, Viator, Skyscanner)

## Tech Stack

- **React 18** + **Vite 6** — fast dev & optimized production builds
- **Single-file component** — zero external UI dependencies, inline styling
- **Google Fonts** — Fraunces (serif display) + Nunito Sans (body)
- **Unsplash images** — real destination photography

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## Deploy to GitHub + Vercel

### Step 1: Create GitHub Repository

```bash
# Initialize git in the project folder
cd ventura-app
git init
git add .
git commit -m "feat: Ventura v2.1 — travel planning MVP prototype"

# Create repo on GitHub (pick one method):

# Option A: GitHub CLI (if installed)
gh repo create ventura-app --public --push

# Option B: Manual
# 1. Go to https://github.com/new
# 2. Name: ventura-app (public or private)
# 3. DON'T add README/gitignore (we already have them)
# 4. Copy the remote URL, then:
git remote add origin https://github.com/YOUR_USERNAME/ventura-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Vercel Dashboard (easiest)**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `ventura-app` repo
4. Vercel auto-detects Vite — settings are pre-configured:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**
6. Done! Your app is live at `ventura-app-xxx.vercel.app`

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Step 3: Custom Domain (optional)

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `ventura.app` or `ventura.yourdomain.com`)
3. Update DNS as instructed (CNAME or A record)

---

## Project Structure

```
ventura-app/
├── public/
│   └── favicon.svg          # Ventura V logo
├── src/
│   ├── main.jsx             # React entry point
│   └── Ventura.jsx          # Main app component (all-in-one)
├── index.html               # HTML shell
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deploy config
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |

---

## Future Roadmap

See full PRD for details. Key next phases:

1. **MVP Backend** — Supabase auth, trip CRUD, real-time sync
2. **AI Integration** — GPT-4o Mini for planning (~$0.003/plan)
3. **Email Parsing** — Gmail/Outlook OAuth for auto-importing bookings
4. **Offline Maps** — Mapbox vector tiles for offline navigation
5. **Affiliate Revenue** — Booking.com, GetYourGuide, Viator partner APIs

---

## License

Prototype for demonstration purposes. All rights reserved.
Built with Claude by Anthropic.
