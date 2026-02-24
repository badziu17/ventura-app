# Ventura v5 — Travel Planning App

## Quick Start
```
npm install
npm run dev
```

## Deploy to Vercel
Push to GitHub → Import at vercel.com/new → Auto-detects Vite → Deploy

## What's New in v5

### Roles & Guest Mode
- **Admin** — full control (edit, delete, manage users)
- **Logged-in User** — create & browse own + shared trips
- **Guest** — browse demo trips, explore features, can't save

### i18n — Polish & English
- Full PL/EN translation system (120+ keys)
- Language toggle in header and login screen

### Itinerary Builder (Trip tab)
- **Drag & drop** — reorder activities within a day
- **Add activity** — time, type, duration, cost per day
- **Add day** — build itinerary from scratch (planning mode)
- **Overload warning** — red border + alert when day >10h planned
- **Voting** 👍 — approve/reject activities (results visible to all)
- **Favorites** ❤️ — mark places & restaurants with hearts

### AI Planner Tab
- **Transport info** — Bus, Metro, Taxi, Bike, Walk recommendations
- **Airport transfer** — best options with prices/times
- **Local customs** — etiquette tips (e.g. Japan trash cans, bowing)
- **Travel documents** — visa requirements, needed docs per country
- **MSZ advisory** — safety level warnings per destination

### Pack Tab
- Editable packing with templates (Winter/Summer/Backpacking)
- Save & load reusable lists across trips
- AI suggestions + "Don't forget" checklist
- **Leave request tracker** — Not requested / Requested / Approved

### Budget Tab (Fintech style)
- Editable expenses (name, amount, currency, category)
- Donut pie chart + spending breakdown by category
- Insights: biggest expense, average, budget status
- Exchange rates: home currency ↔ destination

### Book Tab
- Compare stays with **voting** (Booking.com/Airbnb)
- Proposer attribution (who suggested each place)
- 🚗 **Car rental** — Discover Cars, Rentalcars, AutoEurope
- 🛡️ **Travel insurance** — World Nomads, SafetyWing, Allianz, Signal Iduna

### Profile
- Photo URL + social media (Instagram, FB, TikTok, YouTube)
- **My Travel Friends** — people you've shared trips with
- Trip stats, permissions, travel preferences

### Other
- Delete planning/upcoming trips
- Swipeable photo carousels (touch + arrows)
- Journal with per-user entries
- Memories tab for past trips
