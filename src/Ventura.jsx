import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   VENTURA v3.0 — Travel Planning App
   Full prototype: auth, profiles, journal,
   roles, invitations, trip wizard, memories
   ═══════════════════════════════════════════ */

const C = {
  bg: "#FEFBF6", bgAlt: "#F7F3ED", white: "#FFFFFF",
  surface: "#FFFFFF", surfaceHover: "#FBF8F3",
  border: "#E8E2D9", borderLight: "#F0EBE3",
  primary: "#C4704B", primaryLight: "#F9EDE7", primaryDark: "#A85A38",
  blue: "#2563EB", blueLight: "#EFF6FF",
  sage: "#5F8B6A", sageLight: "#ECF4EE",
  coral: "#E8734A", coralLight: "#FEF0EB",
  gold: "#D4A853", goldLight: "#FDF8EC",
  purple: "#7C5CFC", purpleLight: "#F3F0FF",
  text: "#2C1810", textSec: "#6B5B4F", textDim: "#A09486",
  danger: "#DC3545",
  shadow: "0 1px 3px rgba(44,24,16,0.06), 0 4px 12px rgba(44,24,16,0.04)",
  shadowMd: "0 2px 8px rgba(44,24,16,0.08), 0 8px 24px rgba(44,24,16,0.06)",
};
const F = "'Fraunces', serif";
const fmt = n => n.toLocaleString("ro-RO");

// ── Destination photo pools (sliding carousel) ──
const DEST_PHOTOS = {
  "Bucharest, Romania": [
    "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585407925232-33158f7be498?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=800&h=400&fit=crop&q=80",
  ],
  "Tokyo, Japan": [
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=400&fit=crop&q=80",
  ],
  "Lisbon, Portugal": [
    "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1536663815808-535e2280d2c2?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=400&fit=crop&q=80",
  ],
};

const INSPIRATION = [
  { name: "Kyoto", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=240&h=320&fit=crop&q=80" },
  { name: "Barcelona", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=240&h=320&fit=crop&q=80" },
  { name: "Iceland", img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=240&h=320&fit=crop&q=80" },
  { name: "Amalfi", img: "https://images.unsplash.com/photo-1533606688076-b6683a5103a4?w=240&h=320&fit=crop&q=80" },
  { name: "Morocco", img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=240&h=320&fit=crop&q=80" },
];

// ── User & Roles System ──
const ROLES = {
  admin:     { label: "Admin",     color: C.danger, perms: ["edit_trip","manage_users","delete_trip","invite","edit_budget","journal","view_all","manage_roles"] },
  user:      { label: "Traveler",  color: C.blue,   perms: ["edit_trip","invite","edit_budget","journal","view_all"] },
  companion: { label: "Companion", color: C.sage,   perms: ["edit_trip","edit_budget","journal","view_all"] },
  observer:  { label: "Observer",  color: C.gold,   perms: ["view_all"] },
  guest:     { label: "Guest",     color: C.textDim,perms: ["view_all"] },
};

const USERS_DB = [
  { id: "u1", name: "Bartek", email: "bartek@ventura.app", avatar: "B", color: C.blue, role: "admin",
    prefs: { currency: "PLN", tempUnit: "C", dietaryNeeds: "None", travelStyle: "Cultural Explorer", languages: ["PL","EN","JP"], homeAirport: "GDN", pacePreference: "Moderate — balance sights & rest" } },
  { id: "u2", name: "Anna", email: "anna@ventura.app", avatar: "A", color: C.coral, role: "user",
    prefs: { currency: "PLN", tempUnit: "C", dietaryNeeds: "Vegetarian-friendly", travelStyle: "Foodie & Culture", languages: ["PL","EN"], homeAirport: "GDN", pacePreference: "Active — maximize experiences" } },
  { id: "u3", name: "Marek", email: "marek@gmail.com", avatar: "M", color: C.purple, role: "observer",
    prefs: { currency: "PLN", tempUnit: "C", travelStyle: "Adventurer", languages: ["PL","EN"], homeAirport: "WAW" } },
];

// ── Trip Data ──
const INIT_TRIPS = [
  { id: "bucharest", name: "Bucharest Discovery", dest: "Bucharest, Romania", dates: "Mar 7 – 9, 2026", travelers: ["u1","u2"], observers: ["u3"], days: 3, status: "upcoming",
    heroImg: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=280&fit=crop&q=80",
    budget: { total: 3500, Accommodation: 1400, Food: 800, Activities: 700, Shopping: 300, Transport: 300 },
    completeness: 92,
    journal: [
      { id: "j1", date: "Feb 28", author: "u1", type: "text", content: "Booked the Transylvania day tour! Can't wait to see Peleș Castle. Anna found an amazing restaurant for the last day — Lacrimi și Sfinți." },
      { id: "j2", date: "Mar 1", author: "u2", type: "text", content: "Packed my camera bag — bringing the 35mm and 85mm lenses. Bucharest architecture is going to be incredible to photograph." },
    ],
    memories: null,
    dayData: [
      { day: 1, date: "Sat, Mar 7", title: "Historic Center Walk", img: "https://images.unsplash.com/photo-1585407925232-33158f7be498?w=600&h=200&fit=crop&q=80", weather: { hi: 12, lo: 4, icon: "sun" },
        items: [
          { time: "09:00", name: "Ogrody Cismigiu", desc: "Oldest park in Bucharest, XIX century gardens", type: "sight", duration: "1h", cost: 0, rating: 4.5 },
          { time: "10:15", name: "Palatul Kretzulescu", desc: "French Renaissance mansion, UNESCO site", type: "sight", duration: "30min", cost: 0, rating: 4.3 },
          { time: "12:00", name: "Lunch: Caru' cu Bere", desc: "Iconic 1879 beer hall, Romanian cuisine", type: "food", duration: "1.5h", cost: 120, rating: 4.4 },
          { time: "14:00", name: "Muzeum Sztuki Rumunii", desc: "National Art Museum in Royal Palace", type: "museum", duration: "2h", cost: 30, rating: 4.5 },
          { time: "16:30", name: "Ateneul Roman", desc: "1888 neoclassical concert hall", type: "sight", duration: "45min", cost: 25, rating: 4.8 },
          { time: "18:00", name: "Carturesti Carusel", desc: "Six-level bookstore in restored bank", type: "shopping", duration: "45min", cost: 50, rating: 4.7 },
          { time: "20:15", name: "Dinner: Grand Cafe Van Gogh", desc: "Romanian-French fusion, Old Town", type: "food", duration: "1.5h", cost: 180, rating: 4.3 },
        ]},
      { day: 2, date: "Sun, Mar 8", title: "Castles of Transylvania", img: "https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=600&h=200&fit=crop&q=80", weather: { hi: 9, lo: 1, icon: "cloud" },
        items: [
          { time: "07:00", name: "Departure from Bucharest", desc: "~2h drive to Sinaia", type: "transport", duration: "2h", cost: 0 },
          { time: "09:30", name: "Castelul Peles", desc: "Neo-Renaissance royal residence, 160 rooms", type: "sight", duration: "2h", cost: 80, rating: 4.8 },
          { time: "12:00", name: "Lunch in Sinaia", desc: "Mountain restaurant, traditional food", type: "food", duration: "1h", cost: 90, rating: 4.2 },
          { time: "13:30", name: "Castelul Bran", desc: "Dracula's castle, medieval fortress", type: "sight", duration: "1.5h", cost: 60, rating: 4.3 },
          { time: "15:30", name: "Brasov Old Town", desc: "Saxon medieval town, Black Church", type: "sight", duration: "2h", cost: 15, rating: 4.6 },
          { time: "18:00", name: "Return to Bucharest", desc: "~2.5h drive back", type: "transport", duration: "2.5h", cost: 0 },
        ]},
      { day: 3, date: "Mon, Mar 9", title: "Parliament & Farewell", img: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&h=200&fit=crop&q=80", weather: { hi: 14, lo: 5, icon: "partlysunny" },
        items: [
          { time: "10:00", name: "Palatul Parlamentului", desc: "World's 2nd largest building", type: "sight", duration: "2h", cost: 50, rating: 4.6 },
          { time: "13:15", name: "Lunch: Lacrimi si Sfinti", desc: "Award-winning modern Romanian", type: "food", duration: "1.5h", cost: 150, rating: 4.6 },
          { time: "15:00", name: "Palatul Bragadiru", desc: "1900s industrialist palace", type: "sight", duration: "45min", cost: 0, rating: 4.3 },
          { time: "16:00", name: "Final stroll: Calea Victoriei", desc: "Grand boulevard, coffee stop", type: "sight", duration: "1h", cost: 25, rating: 4.5 },
          { time: "17:30", name: "Bolt to Airport", desc: "~40min to OTP", type: "transport", duration: "45min", cost: 60 },
        ]},
    ],
    expenses: [
      { id: 1, name: "Hotel Marmorosch", cat: "Accommodation", amount: 1200, payer: "u1", date: "Mar 7" },
      { id: 2, name: "Caru' cu Bere", cat: "Food", amount: 120, payer: "u2", date: "Mar 7" },
      { id: 3, name: "Museum tickets", cat: "Activities", amount: 55, payer: "u1", date: "Mar 7" },
      { id: 4, name: "Transylvania tour", cat: "Activities", amount: 600, payer: "u1", date: "Mar 8" },
      { id: 5, name: "Lunch: Lacrimi si Sfinti", cat: "Food", amount: 150, payer: "u1", date: "Mar 9" },
      { id: 6, name: "Bolt to airport", cat: "Transport", amount: 60, payer: "u1", date: "Mar 9" },
    ],
    packing: {
      "Clothing": [{ item: "Warm layers", qty: 3, packed: true, ai: false }, { item: "Winter jacket", qty: 1, packed: true, ai: true }, { item: "Walking shoes", qty: 1, packed: true, ai: false }, { item: "Scarf & gloves", qty: 1, packed: false, ai: true }],
      "Electronics": [{ item: "Phone chargers", qty: 2, packed: true, ai: false }, { item: "Power bank", qty: 1, packed: true, ai: false }, { item: "EU adapter", qty: 1, packed: false, ai: true }],
      "Documents": [{ item: "ID cards", qty: 2, packed: false, ai: false }, { item: "Booking confirmations", qty: 1, packed: false, ai: false }, { item: "Castle tickets", qty: 2, packed: false, ai: true }],
    },
    deals: [
      { name: "Marmorosch Bucharest", price: "€89/night", partner: "Booking.com", pColor: "#003580", url: "https://www.booking.com/hotel/ro/marmorosch-bucharest-autograph-collection.html" },
      { name: "Transylvania Day Tour", price: "€45/pp", partner: "GetYourGuide", pColor: "#FF5533", url: "https://www.getyourguide.com/bucharest-l347/from-bucharest-transylvania-castles-full-day-tour-t66866/" },
      { name: "Parliament Skip-the-Line", price: "€12/pp", partner: "Viator", pColor: "#5B1FA8", url: "https://www.viator.com/tours/Bucharest/Palace-of-Parliament-Skip-the-Line-Ticket-and-Guided-Tour/d22407-41714P2" },
    ],
  },
  { id: "japan", name: "Tokyo Adventure", dest: "Tokyo, Japan", dates: "May 10 – 18, 2026", travelers: ["u1","u2"], observers: [], days: 8, status: "planning",
    heroImg: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=280&fit=crop&q=80",
    budget: { total: 15000 }, completeness: 28,
    journal: [], memories: null, dayData: [], expenses: [], packing: {}, deals: [],
    planningTips: [
      { icon: "🏨", title: "Book accommodation", desc: "8 nights needed. Shinjuku or Shibuya area recommended.", done: false, priority: "high" },
      { icon: "✈️", title: "Book flights GDN → NRT", desc: "Check LOT via WAW or Finnair via HEL. Best prices 3-4 months ahead.", done: false, priority: "high" },
      { icon: "🚄", title: "Get Japan Rail Pass", desc: "7-day JR Pass (~¥50,000) if doing day trips to Kamakura/Nikko.", done: false, priority: "medium" },
      { icon: "📱", title: "Order eSIM", desc: "Ubigi or Airalo eSIM cheapest option.", done: false, priority: "medium" },
      { icon: "🗺️", title: "Plan daily itinerary", desc: "8 days to fill! Asakusa, Shibuya, Akihabara, Harajuku, teamLab.", done: false, priority: "medium" },
      { icon: "🍣", title: "Restaurant reservations", desc: "Book popular spots 1-2 months ahead. Try TableAll.", done: false, priority: "low" },
      { icon: "🎒", title: "Create packing list", desc: "May in Tokyo: 18-25°C, rainy season starts late May.", done: false, priority: "low" },
    ],
  },
  { id: "lisbon", name: "Lisbon & Sintra", dest: "Lisbon, Portugal", dates: "Sep 12 – 16, 2025", travelers: ["u1","u2"], observers: [], days: 5, status: "past",
    heroImg: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=280&fit=crop&q=80",
    budget: { total: 5000 }, completeness: 100,
    journal: [
      { id: "lj1", date: "Sep 12", author: "u1", type: "text", content: "Arrived in Lisbon! The light here is unreal — golden hour over the Tagus river from the Alfama viewpoint. Had amazing pastéis de nata at Pastéis de Belém." },
      { id: "lj2", date: "Sep 13", author: "u2", type: "text", content: "Sintra was a fairytale! Pena Palace colors are even more vivid in person. The hike through the forest to the Moorish Castle was magical." },
      { id: "lj3", date: "Sep 14", author: "u1", type: "text", content: "Best food day: breakfast at Time Out Market, lunch at Cervejaria Ramiro (the garlic prawns!!!), sunset at LX Factory with craft beer." },
      { id: "lj4", date: "Sep 15", author: "u2", type: "text", content: "Took the iconic Tram 28 through Alfama — crowded but worth it for the views. Found an amazing tile shop in Mouraria." },
    ],
    memories: {
      totalSpent: 4650,
      topMoments: ["Sunset from Miradouro da Graça", "Pastéis de Belém queue at 8am", "Pena Palace gardens", "LX Factory bookshop"],
      stats: { stepsTaken: "78,400", photosShared: 142, placesVisited: 28, mealsEaten: 15 },
      highlights: [
        { title: "Best meal", value: "Cervejaria Ramiro — garlic prawns", icon: "🍽️" },
        { title: "Most walked day", value: "Day 2: Sintra — 22,800 steps", icon: "🚶" },
        { title: "Best photo spot", value: "Miradouro da Senhora do Monte", icon: "📸" },
        { title: "Biggest surprise", value: "LX Factory — didn't expect to love it", icon: "✨" },
        { title: "Would do again", value: "Alfama at sunset, every single time", icon: "💛" },
      ],
      budgetSummary: { planned: 5000, actual: 4650, underBudget: true },
    },
    dayData: [
      { day: 1, date: "Fri, Sep 12", title: "Arrival & Alfama", img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=200&fit=crop&q=80", weather: { hi: 28, lo: 18, icon: "sun" }, items: [
        { time: "14:00", name: "Check-in: Hotel Alfama", type: "sight", duration: "30min", cost: 0, rating: 4.5 },
        { time: "15:00", name: "Miradouro da Graça", type: "sight", duration: "45min", cost: 0, rating: 4.8 },
        { time: "16:00", name: "Walk through Alfama", type: "sight", duration: "2h", cost: 0, rating: 4.7 },
        { time: "19:00", name: "Taberna da Rua das Flores", type: "food", duration: "2h", cost: 120, rating: 4.6 },
      ]},
    ],
    expenses: [
      { id: 1, name: "Hotel Alfama", cat: "Accommodation", amount: 1800, payer: "u1", date: "Sep 12" },
      { id: 2, name: "Cervejaria Ramiro", cat: "Food", amount: 180, payer: "u2", date: "Sep 14" },
    ],
    packing: {}, deals: [],
  },
];

const CAT_I = { Accommodation: "🏨", Food: "🍽️", Activities: "🎟️", Shopping: "🛍️", Transport: "🚗" };
const tE = { sight: "📍", food: "🍽️", museum: "🖼️", shopping: "🛍️", transport: "🚌" };
const WI = ({ t }) => t === "sun" ? <span>☀️</span> : t === "cloud" ? <span>⛅</span> : t === "rain" ? <span>🌧️</span> : <span>🌤️</span>;

// ── Shared Components ──
const Pill = ({ children, color = C.primary, active, onClick }) => (
  <button onClick={onClick} style={{ padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500, background: active ? color : "transparent", color: active ? "#fff" : C.textSec, border: active ? "none" : `1.5px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit", whiteSpace: "nowrap" }}>{children}</button>
);
const Card = ({ children, style: sx, onClick, hover = true }) => (
  <div onClick={onClick} style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, boxShadow: C.shadow, transition: "all 0.2s", cursor: onClick ? "pointer" : "default", ...sx }}
    onMouseEnter={e => { if (hover && onClick) { e.currentTarget.style.boxShadow = C.shadowMd; e.currentTarget.style.transform = "translateY(-1px)"; }}}
    onMouseLeave={e => { if (hover && onClick) { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = "translateY(0)"; }}}>{children}</div>
);
const Bar = ({ v, mx, color = C.primary, h = 6 }) => (
  <div style={{ width: "100%", height: h, background: C.bgAlt, borderRadius: h, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(v / mx * 100, 100)}%`, height: h, borderRadius: h, background: v > mx ? C.danger : color, transition: "width 0.6s" }} />
  </div>
);
const Av = ({ name, color, size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{name[0]}</div>
);
const Img = ({ src, alt, style: sx }) => {
  const [e, setE] = useState(false);
  if (e) return <div style={{ ...sx, background: `linear-gradient(135deg, ${C.primaryLight}, ${C.blueLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim }}>🗺️</div>;
  return <img src={src} alt={alt || ""} style={{ objectFit: "cover", display: "block", ...sx }} onError={() => setE(true)} />;
};

// ── Sliding Photo Carousel ──
const PhotoSlider = ({ dest }) => {
  const photos = DEST_PHOTOS[dest] || [];
  const [idx, setIdx] = useState(0);
  useEffect(() => { if (photos.length < 2) return; const t = setInterval(() => setIdx(p => (p + 1) % photos.length), 3500); return () => clearInterval(t); }, [photos.length]);
  if (!photos.length) return <div style={{ height: 150, background: `linear-gradient(135deg, ${C.primaryLight}, ${C.blueLight})`, borderRadius: "0 0 16px 16px" }} />;
  return (
    <div style={{ position: "relative", height: 150, overflow: "hidden", borderRadius: "0 0 16px 16px" }}>
      {photos.map((p, i) => <img key={i} src={p} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 1s ease", opacity: i === idx ? 1 : 0 }} />)}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(44,24,16,0.5) 0%, transparent 50%)" }} />
      <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
        {photos.map((_, i) => <div key={i} style={{ width: i === idx ? 16 : 6, height: 6, borderRadius: 3, background: i === idx ? "#fff" : "rgba(255,255,255,0.5)", transition: "all 0.3s" }} />)}
      </div>
    </div>
  );
};

// ── Modal ──
const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(44,24,16,0.4)", backdropFilter: "blur(4px)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: C.white, borderRadius: 20, boxShadow: C.shadowMd, width: "100%", maxWidth: wide ? 600 : 480, maxHeight: "85vh", overflow: "auto", animation: "fadeUp 0.25s ease" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: C.white, zIndex: 1, borderRadius: "20px 20px 0 0" }}>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: F }}>{title}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: C.bgAlt, border: "none", cursor: "pointer", fontSize: 14, color: C.textDim }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
};

// ═══════════════ MAIN APP ═══════════════
export default function Ventura() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [scr, setScr] = useState("home");
  const [tab, setTab] = useState("trip");
  const [activeTrip, setActiveTrip] = useState(null);
  const [trips, setTrips] = useState(INIT_TRIPS);
  const [users] = useState(USERS_DB);
  const [showWizard, setShowWizard] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);
  const [aDay, setADay] = useState(null);
  const [eDays, setEDays] = useState({});
  const [eItem, setEItem] = useState(null);
  const [eBgt, setEBgt] = useState(false);
  const [bIn, setBIn] = useState("");
  const [journalInput, setJournalInput] = useState("");
  const [wizStep, setWizStep] = useState(0);
  const [wizData, setWizData] = useState({ name: "", dest: "", startDate: "", endDate: "", travelers: 2, style: "Cultural" });
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState("companion");

  const trip = activeTrip ? trips.find(t => t.id === activeTrip) : null;
  const getUser = id => users.find(u => u.id === id) || { name: "?", avatar: "?", color: C.textDim };
  const userRole = trip ? (trip.travelers.includes(currentUser?.id) ? (currentUser?.role || "user") : trip.observers?.includes(currentUser?.id) ? "observer" : "guest") : "user";
  const canEdit = ["admin","user","companion"].includes(userRole);
  const updateTrip = (id, fn) => setTrips(p => p.map(t => t.id === id ? fn(t) : t));

  // ── Login ──
  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.primaryLight} 0%, ${C.bg} 40%, ${C.blueLight} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito Sans', sans-serif", padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap'); @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${C.primary}, ${C.coral})`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: F, marginBottom: 12 }}>V</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: F, color: C.text }}>Ventura</h1>
          <p style={{ fontSize: 14, color: C.textSec, marginTop: 4 }}>Your intelligent travel companion</p>
        </div>
        <Card style={{ padding: 24 }} hover={false}>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, marginBottom: 16 }}>Sign in as:</div>
          {USERS_DB.map(u => (
            <div key={u.id} onClick={() => { setCurrentUser(u); setLoggedIn(true); }} style={{ padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, marginBottom: 8, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}>
              <Av name={u.name} color={u.color} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: C.textDim }}>{u.email}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: ROLES[u.role].color, background: `${ROLES[u.role].color}15`, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase" }}>{ROLES[u.role].label}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 12 }}>Demo mode — pick any user. Role determines access level.</p>
        </Card>
      </div>
    </div>
  );

  // ── Tab config ──
  const getTabs = () => {
    if (!trip) return [];
    if (trip.status === "past") return [
      { id: "memories", l: "Memories", i: "✨" }, { id: "trip", l: "Itinerary", i: "🗺️" },
      { id: "journal", l: "Journal", i: "📓" }, { id: "budget", l: "Budget", i: "💰" },
    ];
    if (trip.status === "planning") return [
      { id: "plan", l: "Plan", i: "📋" }, { id: "journal", l: "Journal", i: "📓" },
      { id: "budget", l: "Budget", i: "💰" }, { id: "booking", l: "Book", i: "🔖" },
    ];
    return [
      { id: "trip", l: "Trip", i: "🗺️" }, { id: "ai", l: "AI", i: "✨" },
      { id: "packing", l: "Pack", i: "🎒" }, { id: "budget", l: "Budget", i: "💰" },
      { id: "journal", l: "Journal", i: "📓" }, { id: "booking", l: "Book", i: "🔖" },
    ];
  };

  const createTrip = () => {
    const id = "trip_" + Date.now();
    const newT = {
      id, name: wizData.name || `${wizData.dest} Trip`, dest: wizData.dest,
      dates: `${wizData.startDate} – ${wizData.endDate}`, travelers: [currentUser.id], observers: [],
      days: 0, status: "planning", heroImg: "", budget: { total: 0 }, completeness: 5,
      journal: [], memories: null, dayData: [], expenses: [], packing: {}, deals: [],
      planningTips: [
        { icon: "🏨", title: "Book accommodation", desc: `Find a place to stay in ${wizData.dest}.`, done: false, priority: "high" },
        { icon: "✈️", title: "Book flights", desc: `Search flights to ${wizData.dest}.`, done: false, priority: "high" },
        { icon: "🗺️", title: "Plan daily itinerary", desc: `${wizData.travelers} people, ${wizData.style} style.`, done: false, priority: "medium" },
        { icon: "🎒", title: "Create packing list", desc: "Check weather and pack accordingly.", done: false, priority: "low" },
      ],
    };
    setTrips(p => [newT, ...p]);
    setShowWizard(false); setWizStep(0); setWizData({ name: "", dest: "", startDate: "", endDate: "", travelers: 2, style: "Cultural" });
    setActiveTrip(id); setScr("trip"); setTab("plan");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito Sans', 'Helvetica Neue', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:5px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input:focus,select:focus,textarea:focus { outline:none; border-color:${C.primary} !important; }
      `}</style>

      {/* HEADER */}
      <header style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.borderLight}`, background: "rgba(254,251,246,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div onClick={() => { setScr("home"); setActiveTrip(null); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: F }}>V</div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: F }}>Ventura</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {scr === "trip" && <button onClick={() => { setScr("home"); setActiveTrip(null); }} style={{ padding: "6px 14px", borderRadius: 99, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>← Trips</button>}
          {scr === "trip" && trip && <button onClick={() => setShowTravelers(true)} style={{ padding: "6px 10px", borderRadius: 99, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 11, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>👥 {trip.travelers.length + (trip.observers?.length || 0)}</button>}
          <div onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}><Av name={currentUser.name} color={currentUser.color} size={28} /></div>
        </div>
      </header>

      {/* ═══ HOME SCREEN ═══ */}
      {scr === "home" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ padding: "28px 20px 20px", background: `linear-gradient(180deg, ${C.primaryLight} 0%, ${C.bg} 100%)` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Welcome back</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: F, marginBottom: 4 }}>Where to next, {currentUser.name}?</h1>
            <p style={{ fontSize: 14, color: C.textSec }}>{trips.filter(t => t.status !== "past").length} active trips</p>
          </div>
          <div style={{ padding: "0 20px 16px" }}>
            <button onClick={() => setShowWizard(true)} style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, ${C.coral})`, border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: F, boxShadow: C.shadowMd, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>+</span> Create New Trip
            </button>
          </div>
          <div style={{ padding: "0 20px 40px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Your Trips</div>
            {trips.map(tr => (
              <Card key={tr.id} onClick={() => { setActiveTrip(tr.id); setScr("trip"); setTab(tr.status === "past" ? "memories" : tr.status === "planning" ? "plan" : "trip"); }} style={{ marginBottom: 16, overflow: "hidden" }}>
                <PhotoSlider dest={tr.dest} />
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800, fontFamily: F }}>{tr.name}</div>
                      <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>📍 {tr.dest} · 📅 {tr.dates}</div>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700, textTransform: "uppercase", background: tr.status === "upcoming" ? C.sage : tr.status === "planning" ? C.blue : C.textDim, color: "#fff" }}>{tr.status}</span>
                  </div>
                  {tr.status !== "past" && tr.completeness != null && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textDim, marginBottom: 3 }}><span>Trip readiness</span><span>{tr.completeness}%</span></div>
                      <Bar v={tr.completeness} mx={100} color={tr.completeness > 75 ? C.sage : tr.completeness > 40 ? C.gold : C.coral} h={4} />
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <div style={{ display: "flex" }}>
                      {tr.travelers.map((uid, i) => { const u = getUser(uid); return <div key={uid} style={{ width: 24, height: 24, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", marginLeft: i > 0 ? -6 : 0, border: "2px solid #fff", position: "relative", zIndex: tr.travelers.length - i }}>{u.name[0]}</div>; })}
                    </div>
                    <span style={{ fontSize: 11, color: C.textDim }}>{tr.travelers.length} travelers{tr.observers?.length > 0 ? ` · ${tr.observers.length} observers` : ""}</span>
                  </div>
                </div>
              </Card>
            ))}
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, margin: "24px 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Get Inspired</div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {INSPIRATION.map(d => (
                <div key={d.name} onClick={() => { setWizData(p => ({ ...p, dest: d.name })); setShowWizard(true); }} style={{ flex: "0 0 110px", borderRadius: 14, overflow: "hidden", position: "relative", height: 150, cursor: "pointer", boxShadow: C.shadow }}>
                  <Img src={d.img} alt={d.name} style={{ width: "100%", height: "100%" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(44,24,16,0.55) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", bottom: 10, left: 10, fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: F, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{d.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TRIP SCREEN ═══ */}
      {scr === "trip" && trip && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          {/* Hero */}
          <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
            {trip.heroImg ? <Img src={trip.heroImg} alt={trip.name} style={{ width: "100%", height: "100%" }} /> : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.primaryLight}, ${C.blueLight})` }} />}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(44,24,16,0.65) 0%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 12, left: 20, right: 20 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: F, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{trip.name}</h1>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2, flexWrap: "wrap" }}>
                <span>📍 {trip.dest}</span><span>📅 {trip.dates}</span>
              </div>
            </div>
            {canEdit && <button onClick={() => setShowInvite(true)} style={{ position: "absolute", top: 10, right: 14, background: "rgba(255,255,255,0.9)", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", color: C.primary, fontFamily: "inherit" }}>+ Invite</button>}
          </div>

          {/* Tabs */}
          <div style={{ padding: "0 16px", display: "flex", gap: 2, overflowX: "auto", borderBottom: `1px solid ${C.borderLight}` }}>
            {getTabs().map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 12px", fontSize: 12, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? C.primary : C.textDim, background: "transparent", border: "none", borderBottom: tab === t.id ? `2.5px solid ${C.primary}` : "2.5px solid transparent", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13 }}>{t.i}</span> {t.l}
              </button>
            ))}
          </div>

          <div style={{ padding: "16px 20px 100px", maxWidth: 720, margin: "0 auto" }}>

            {/* ══ MEMORIES ══ */}
            {tab === "memories" && trip.memories && (
              <div style={{ animation: "fadeUp 0.3s" }}>
                <Card style={{ padding: 24, marginBottom: 16, background: `linear-gradient(135deg, ${C.goldLight}, ${C.white})`, textAlign: "center" }} hover={false}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: F }}>Trip Complete!</div>
                  <div style={{ fontSize: 14, color: C.textSec }}>{trip.name} · {trip.dates}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
                    {Object.entries(trip.memories.stats).map(([k, v]) => (
                      <div key={k} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: F, color: C.primary }}>{v}</div>
                        <div style={{ fontSize: 10, color: C.textDim, textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, marginBottom: 10 }}>Trip Highlights</div>
                {trip.memories.highlights.map((h, i) => (
                  <Card key={i} style={{ padding: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }} hover={false}>
                    <span style={{ fontSize: 24 }}>{h.icon}</span>
                    <div><div style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>{h.title}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{h.value}</div></div>
                  </Card>
                ))}
                <Card style={{ padding: 16, marginTop: 12, background: trip.memories.budgetSummary.underBudget ? C.sageLight : C.coralLight }} hover={false}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: F, marginBottom: 8 }}>Budget Summary</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span>Planned: {fmt(trip.memories.budgetSummary.planned)} RON</span>
                    <span style={{ fontWeight: 700, color: trip.memories.budgetSummary.underBudget ? C.sage : C.danger }}>
                      Actual: {fmt(trip.memories.budgetSummary.actual)} RON
                    </span>
                  </div>
                </Card>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, margin: "18px 0 10px" }}>Top Moments</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {trip.memories.topMoments.map((m, i) => <span key={i} style={{ padding: "8px 14px", borderRadius: 99, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500 }}>💛 {m}</span>)}
                </div>
              </div>
            )}
            {tab === "memories" && !trip.memories && (
              <Card style={{ padding: 32, textAlign: "center" }} hover={false}><div style={{ fontSize: 40, marginBottom: 12 }}>📸</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: F }}>Memories coming soon</div><p style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>Trip summary appears after the trip.</p></Card>
            )}

            {/* ══ PLANNING ══ */}
            {tab === "plan" && trip.planningTips && (
              <div style={{ animation: "fadeUp 0.3s" }}>
                <Card style={{ padding: 20, marginBottom: 14, background: `linear-gradient(135deg, ${C.blueLight}, ${C.white})` }} hover={false}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div><div style={{ fontSize: 16, fontWeight: 800, fontFamily: F }}>Trip Readiness</div><div style={{ fontSize: 12, color: C.textSec }}>{trip.planningTips.filter(t => t.done).length}/{trip.planningTips.length} done</div></div>
                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: F, color: C.blue }}>{trip.completeness}%</div>
                  </div>
                  <Bar v={trip.completeness} mx={100} color={C.blue} h={8} />
                </Card>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>What to do next</div>
                {trip.planningTips.map((tip, i) => (
                  <Card key={i} style={{ padding: 14, marginBottom: 8, opacity: tip.done ? 0.5 : 1 }} hover={false}
                    onClick={canEdit ? () => updateTrip(trip.id, t => {
                      const tips = t.planningTips.map((tp, j) => j === i ? { ...tp, done: !tp.done } : tp);
                      return { ...t, planningTips: tips, completeness: Math.min(100, Math.round(tips.filter(x => x.done).length / tips.length * 100)) };
                    }) : undefined}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: tip.done ? "none" : `2px solid ${tip.priority === "high" ? C.danger : tip.priority === "medium" ? C.gold : C.border}`, background: tip.done ? C.sage : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, cursor: canEdit ? "pointer" : "default" }}>
                        {tip.done && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span>{tip.icon}</span><span style={{ fontSize: 13, fontWeight: 600, textDecoration: tip.done ? "line-through" : "none" }}>{tip.title}</span>
                          {tip.priority === "high" && !tip.done && <span style={{ fontSize: 9, background: C.danger, color: "#fff", padding: "2px 6px", borderRadius: 99, fontWeight: 700 }}>HIGH</span>}
                        </div>
                        <div style={{ fontSize: 12, color: C.textSec }}>{tip.desc}</div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Card style={{ padding: 16, marginTop: 12, background: C.primaryLight, border: `1px solid ${C.primary}22` }} hover={false}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ fontSize: 16 }}>✨</span><span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>AI Tip</span></div>
                  <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>Book accommodation first — prices in {trip.dest} tend to rise 3-4 weeks before travel. Want me to search for options?</p>
                </Card>
              </div>
            )}

            {/* ══ ITINERARY ══ */}
            {tab === "trip" && trip.dayData?.length > 0 && <div>
              <div style={{ display: "flex", gap: 6, margin: "0 0 14px", overflowX: "auto", paddingBottom: 4 }}>
                <Pill active={!aDay} onClick={() => setADay(null)} color={C.text}>All</Pill>
                {trip.dayData.map(d => <Pill key={d.day} active={aDay === d.day} onClick={() => { setADay(aDay === d.day ? null : d.day); setEDays(p => ({ ...p, [d.day]: true })); }} color={[C.blue, C.coral, C.sage][d.day % 3]}>Day {d.day}</Pill>)}
              </div>
              {trip.dayData.filter(d => !aDay || d.day === aDay).map(day => {
                const open = !!eDays[day.day];
                return (
                  <Card key={day.day} style={{ marginBottom: 14, overflow: "hidden" }} hover={false}>
                    <div onClick={() => setEDays(p => ({ ...p, [day.day]: !p[day.day] }))} style={{ cursor: "pointer" }}>
                      <div style={{ position: "relative", height: 56, overflow: "hidden" }}>
                        <Img src={day.img} alt={day.title} style={{ width: "100%", height: "100%" }} />
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${[C.blue, C.coral, C.sage][day.day % 3]}CC, ${[C.blue, C.coral, C.sage][day.day % 3]}44)` }} />
                        <div style={{ position: "absolute", inset: 0, padding: "0 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, color: "#fff" }}>Day {day.day}: {day.title}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ background: "rgba(255,255,255,0.9)", padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3, fontSize: 12 }}><WI t={day.weather.icon} /> <span style={{ fontWeight: 700 }}>{day.weather.hi}/{day.weather.lo}°</span></div>
                            <span style={{ color: "#fff", transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {open && <div style={{ animation: "fadeUp 0.2s" }}>
                      {day.items.map((it, i) => (
                        <div key={i} onClick={() => setEItem(eItem === `${day.day}-${i}` ? null : `${day.day}-${i}`)} style={{ padding: "10px 14px", display: "flex", gap: 10, borderBottom: i < day.items.length - 1 ? `1px solid ${C.borderLight}` : "none", cursor: "pointer", background: eItem === `${day.day}-${i}` ? C.bgAlt : "transparent" }}>
                          <div style={{ minWidth: 40, fontSize: 11, fontWeight: 600, color: C.textDim, paddingTop: 2 }}>{it.time}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 13 }}>{tE[it.type]}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</span>
                              {it.rating > 0 && <span style={{ fontSize: 11, color: C.gold }}>★ {it.rating}</span>}
                            </div>
                            {eItem === `${day.day}-${i}` && it.desc && <p style={{ fontSize: 12, color: C.textSec, marginTop: 4, lineHeight: 1.5 }}>{it.desc}</p>}
                            {eItem !== `${day.day}-${i}` && <div style={{ fontSize: 11, color: C.textDim }}>{it.duration}{it.cost > 0 ? ` · ${it.cost} RON` : ""}</div>}
                          </div>
                        </div>
                      ))}
                    </div>}
                  </Card>
                );
              })}
            </div>}
            {tab === "trip" && (!trip.dayData || !trip.dayData.length) && (
              <Card style={{ padding: 32, textAlign: "center" }} hover={false}><div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: F }}>No itinerary yet</div><p style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>Switch to Plan tab to start building.</p></Card>
            )}

            {/* ══ AI ══ */}
            {tab === "ai" && (
              <Card style={{ padding: 24, textAlign: "center" }} hover={false}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: F }}>AI Trip Planner</div>
                <p style={{ fontSize: 13, color: C.textSec, marginTop: 8, lineHeight: 1.6 }}>Ask me to optimize routes, find restaurants, suggest hidden gems, or adjust your itinerary for {trip.dest}!</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 16 }}>
                  {["Optimize Day 1", "Best restaurants", "Hidden gems", "Weather tips"].map(s => <span key={s} style={{ padding: "8px 14px", borderRadius: 99, background: C.primaryLight, border: `1px solid ${C.primary}33`, color: C.primary, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>{s}</span>)}
                </div>
              </Card>
            )}

            {/* ══ PACKING ══ */}
            {tab === "packing" && (
              <div>
                {Object.keys(trip.packing || {}).length === 0 ? (
                  <Card style={{ padding: 32, textAlign: "center" }} hover={false}><div style={{ fontSize: 40, marginBottom: 12 }}>🎒</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: F }}>No packing list yet</div><p style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>AI can generate a weather-appropriate packing list.</p></Card>
                ) : Object.entries(trip.packing).map(([cat, items]) => (
                  <Card key={cat} style={{ marginBottom: 10, overflow: "hidden" }} hover={false}>
                    <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.borderLight}`, fontSize: 13, fontWeight: 700 }}>{cat}</div>
                    {items.map((it, i) => (
                      <div key={i} onClick={canEdit ? () => updateTrip(trip.id, t => ({ ...t, packing: { ...t.packing, [cat]: t.packing[cat].map((x, j) => j === i ? { ...x, packed: !x.packed } : x) } })) : undefined}
                        style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: i < items.length - 1 ? `1px solid ${C.borderLight}` : "none", cursor: canEdit ? "pointer" : "default" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, border: it.packed ? "none" : `2px solid ${C.border}`, background: it.packed ? C.sage : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {it.packed && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                        </div>
                        <span style={{ flex: 1, fontSize: 13, textDecoration: it.packed ? "line-through" : "none", color: it.packed ? C.textDim : C.text }}>{it.item}</span>
                        {it.ai && <span style={{ fontSize: 9, background: C.primaryLight, color: C.primary, padding: "2px 6px", borderRadius: 99, fontWeight: 600 }}>AI</span>}
                        <span style={{ fontSize: 11, color: C.textDim }}>x{it.qty}</span>
                      </div>
                    ))}
                  </Card>
                ))}
              </div>
            )}

            {/* ══ BUDGET ══ */}
            {tab === "budget" && (() => {
              const tS = (trip.expenses || []).reduce((s, e) => s + e.amount, 0);
              const bT = trip.budget?.total || 1;
              return (
                <div>
                  <Card style={{ padding: 20, marginBottom: 14, background: `linear-gradient(135deg, ${C.primaryLight}, ${C.white})` }} hover={false}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Spent</div>
                        <div style={{ fontSize: 28, fontWeight: 800, fontFamily: F }}>{fmt(tS)} <span style={{ fontSize: 14, color: C.textSec }}>RON</span></div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, marginBottom: 2 }}>BUDGET</div>
                        {eBgt && canEdit ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input value={bIn} onChange={e => setBIn(e.target.value)} autoFocus type="number" onKeyDown={e => { if (e.key === "Enter") { const v = parseInt(bIn); if (v > 0) updateTrip(trip.id, t => ({ ...t, budget: { ...t.budget, total: v } })); setEBgt(false); }}}
                              style={{ width: 80, padding: "5px 8px", borderRadius: 8, border: `1.5px solid ${C.primary}`, fontSize: 14, fontWeight: 700, fontFamily: F, textAlign: "right", background: C.white }} />
                            <button onClick={() => { const v = parseInt(bIn); if (v > 0) updateTrip(trip.id, t => ({ ...t, budget: { ...t.budget, total: v } })); setEBgt(false); }} style={{ padding: "5px 10px", borderRadius: 8, background: C.sage, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✓</button>
                          </div>
                        ) : (
                          <div onClick={canEdit ? () => { setEBgt(true); setBIn(String(trip.budget?.total || 0)); } : undefined} style={{ cursor: canEdit ? "pointer" : "default", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                            <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(bT)} RON</span>
                            {canEdit && <span style={{ fontSize: 11, color: C.primary }}>✎</span>}
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: tS <= bT ? C.sage : C.danger, fontWeight: 600, marginTop: 2 }}>{tS <= bT ? `${fmt(bT - tS)} left` : `${fmt(tS - bT)} over!`}</div>
                      </div>
                    </div>
                    <Bar v={tS} mx={bT} color={C.primary} h={8} />
                  </Card>
                  {(trip.expenses || []).length > 0 && (
                    <Card style={{ overflow: "hidden" }} hover={false}>
                      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.borderLight}`, fontSize: 13, fontWeight: 700, fontFamily: F }}>Expenses ({trip.expenses.length})</div>
                      {trip.expenses.map(e => (
                        <div key={e.id} style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.borderLight}` }}>
                          <span style={{ fontSize: 15 }}>{CAT_I[e.cat] || "💰"}</span>
                          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div><div style={{ fontSize: 11, color: C.textDim }}>{e.cat} · {e.date}</div></div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(e.amount)} RON</div>
                        </div>
                      ))}
                    </Card>
                  )}
                </div>
              );
            })()}

            {/* ══ JOURNAL ══ */}
            {tab === "journal" && (
              <div>
                {canEdit && (
                  <Card style={{ padding: 16, marginBottom: 14 }} hover={false}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <Av name={currentUser.name} color={currentUser.color} size={32} />
                      <div style={{ flex: 1 }}>
                        <textarea value={journalInput} onChange={e => setJournalInput(e.target.value)} placeholder="Write a memory, thought, or note..." rows={3}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", resize: "vertical", background: C.bg, color: C.text }} />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ padding: "6px 12px", borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 11, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>📷 Photo</button>
                            <button style={{ padding: "6px 12px", borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 11, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>🎥 Video</button>
                          </div>
                          <button onClick={() => { if (!journalInput.trim()) return; updateTrip(trip.id, t => ({ ...t, journal: [...t.journal, { id: "j" + Date.now(), date: "Now", author: currentUser.id, type: "text", content: journalInput }] })); setJournalInput(""); }}
                            style={{ padding: "8px 18px", borderRadius: 10, background: C.primary, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Post</button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                {(trip.journal || []).length === 0 ? (
                  <Card style={{ padding: 32, textAlign: "center" }} hover={false}><div style={{ fontSize: 40, marginBottom: 12 }}>📓</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: F }}>Your trip journal</div><p style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>Notes, photos, videos — your keepsake.</p></Card>
                ) : [...trip.journal].reverse().map(j => {
                  const a = getUser(j.author);
                  return (
                    <Card key={j.id} style={{ padding: 16, marginBottom: 10 }} hover={false}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <Av name={a.name} color={a.color} size={28} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</span>
                        <span style={{ fontSize: 11, color: C.textDim }}>{j.date}</span>
                      </div>
                      <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{j.content}</p>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ══ BOOKING ══ */}
            {tab === "booking" && (
              <div>
                {(trip.deals || []).length > 0 ? trip.deals.map((d, i) => (
                  <Card key={i} style={{ padding: 14, marginBottom: 10 }} onClick={() => window.open(d.url, "_blank")}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{d.name}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: d.pColor, padding: "2px 6px", borderRadius: 4, marginTop: 4, display: "inline-block" }}>{d.partner}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, fontFamily: F }}>{d.price}</div>
                        <div style={{ fontSize: 12, color: C.primary, marginTop: 2 }}>View →</div>
                      </div>
                    </div>
                  </Card>
                )) : <Card style={{ padding: 32, textAlign: "center" }} hover={false}><div style={{ fontSize: 40, marginBottom: 12 }}>🔖</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: F }}>Booking recommendations</div><p style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>AI will suggest deals based on your itinerary.</p></Card>}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ═══ MODALS ═══ */}

      {/* Trip Wizard */}
      <Modal open={showWizard} onClose={() => { setShowWizard(false); setWizStep(0); }} title={["Where are you going?", "When & who?", "Almost there!"][wizStep]}>
        {wizStep === 0 && <div>
          <input value={wizData.dest} onChange={e => setWizData(p => ({ ...p, dest: e.target.value }))} placeholder="Destination — e.g. Barcelona, Kyoto..." autoFocus
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: "inherit", background: C.bg, color: C.text, marginBottom: 12 }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {["Barcelona", "Kyoto", "Reykjavik", "Marrakech", "Vienna", "Bali"].map(d => <Pill key={d} onClick={() => setWizData(p => ({ ...p, dest: d }))} active={wizData.dest === d}>{d}</Pill>)}
          </div>
          <button disabled={!wizData.dest} onClick={() => setWizStep(1)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: wizData.dest ? C.primary : C.border, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: wizData.dest ? "pointer" : "default", fontFamily: "inherit" }}>Next →</button>
        </div>}
        {wizStep === 1 && <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: C.textDim, fontWeight: 600, display: "block", marginBottom: 4 }}>From</label><input type="date" value={wizData.startDate} onChange={e => setWizData(p => ({ ...p, startDate: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", background: C.bg, color: C.text }} /></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: C.textDim, fontWeight: 600, display: "block", marginBottom: 4 }}>To</label><input type="date" value={wizData.endDate} onChange={e => setWizData(p => ({ ...p, endDate: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", background: C.bg, color: C.text }} /></div>
          </div>
          <label style={{ fontSize: 11, color: C.textDim, fontWeight: 600, display: "block", marginBottom: 4 }}>Travelers</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>{[1, 2, 3, 4, 5, "6+"].map(n => <Pill key={n} active={wizData.travelers === n} onClick={() => setWizData(p => ({ ...p, travelers: n }))}>{n}</Pill>)}</div>
          <label style={{ fontSize: 11, color: C.textDim, fontWeight: 600, display: "block", marginBottom: 4 }}>Travel style</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {["Cultural", "Adventure", "Relaxation", "Foodie", "Road Trip", "City Break"].map(s => <Pill key={s} active={wizData.style === s} onClick={() => setWizData(p => ({ ...p, style: s }))}>{s}</Pill>)}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setWizStep(0)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>← Back</button>
            <button onClick={() => setWizStep(2)} style={{ flex: 2, padding: "12px", borderRadius: 12, background: C.primary, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
          </div>
        </div>}
        {wizStep === 2 && <div>
          <input value={wizData.name} onChange={e => setWizData(p => ({ ...p, name: e.target.value }))} placeholder={`e.g. "${wizData.dest} Adventure"`}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: "inherit", background: C.bg, color: C.text, marginBottom: 16 }} />
          <Card style={{ padding: 16, marginBottom: 16, background: C.bgAlt }} hover={false}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 8 }}>TRIP SUMMARY</div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, marginBottom: 4 }}>{wizData.name || `${wizData.dest} Trip`}</div>
            <div style={{ fontSize: 12, color: C.textSec }}>📍 {wizData.dest} · 📅 {wizData.startDate || "TBD"} – {wizData.endDate || "TBD"} · 👥 {wizData.travelers} · 🎯 {wizData.style}</div>
          </Card>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setWizStep(1)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>← Back</button>
            <button onClick={createTrip} style={{ flex: 2, padding: "14px", borderRadius: 12, background: `linear-gradient(135deg, ${C.primary}, ${C.coral})`, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🚀 Create Trip</button>
          </div>
        </div>}
      </Modal>

      {/* Invite */}
      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite to Trip">
        <label style={{ fontSize: 11, color: C.textDim, fontWeight: 600, display: "block", marginBottom: 4 }}>Email address</label>
        <input value={invEmail} onChange={e => setInvEmail(e.target.value)} placeholder="friend@email.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", background: C.bg, color: C.text, marginBottom: 12 }} />
        <label style={{ fontSize: 11, color: C.textDim, fontWeight: 600, display: "block", marginBottom: 6 }}>Role</label>
        {[
          { id: "companion", title: "Companion", desc: "Can edit itinerary, budget, journal. Full co-planner.", icon: "🤝" },
          { id: "observer", title: "Observer", desc: "View-only. Can see plans and get inspired.", icon: "👁️" },
        ].map(r => (
          <div key={r.id} onClick={() => setInvRole(r.id)} style={{ padding: 14, borderRadius: 12, border: `1.5px solid ${invRole === r.id ? C.primary : C.border}`, marginBottom: 8, cursor: "pointer", background: invRole === r.id ? C.primaryLight : "transparent" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{r.icon}</span>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 11, color: C.textSec }}>{r.desc}</div></div>
            </div>
          </div>
        ))}
        <button onClick={() => { setShowInvite(false); setInvEmail(""); }} style={{ width: "100%", marginTop: 8, padding: "14px", borderRadius: 12, background: C.primary, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Send Invitation</button>
      </Modal>

      {/* Profile */}
      <Modal open={showProfile} onClose={() => setShowProfile(false)} title="My Profile" wide>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Av name={currentUser.name} color={currentUser.color} size={56} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: F }}>{currentUser.name}</div>
            <div style={{ fontSize: 12, color: C.textSec }}>{currentUser.email}</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: ROLES[currentUser.role].color, background: `${ROLES[currentUser.role].color}15`, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", marginTop: 4, display: "inline-block" }}>{ROLES[currentUser.role].label}</span>
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, marginBottom: 10 }}>Travel Preferences</div>
        {currentUser.prefs && Object.entries(currentUser.prefs).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
            <span style={{ fontSize: 12, color: C.textDim, textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, ' $1')}</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{Array.isArray(v) ? v.join(", ") : v}</span>
          </div>
        ))}
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, margin: "20px 0 10px" }}>Trip Stats</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ label: "Total trips", value: trips.filter(t => t.travelers.includes(currentUser.id)).length }, { label: "Countries", value: 3 }, { label: "Days traveled", value: 13 }].map(s => (
            <div key={s.label} style={{ flex: 1, padding: 12, background: C.bgAlt, borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: F, color: C.primary }}>{s.value}</div>
              <div style={{ fontSize: 10, color: C.textDim }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, margin: "20px 0 10px" }}>Permissions ({ROLES[currentUser.role].label})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ROLES[currentUser.role].perms.map(p => <span key={p} style={{ padding: "5px 12px", borderRadius: 99, background: C.sageLight, fontSize: 11, fontWeight: 500, color: C.sage }}>✓ {p.replace(/_/g, ' ')}</span>)}
        </div>
        <button onClick={() => { setLoggedIn(false); setCurrentUser(null); setScr("home"); setActiveTrip(null); setShowProfile(false); }}
          style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 12, background: C.bgAlt, border: `1px solid ${C.danger}33`, color: C.danger, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Sign Out</button>
      </Modal>

      {/* Travelers Modal */}
      <Modal open={showTravelers} onClose={() => setShowTravelers(false)} title="Trip Members" wide>
        {trip && <>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Travelers ({trip.travelers.length})</div>
          {trip.travelers.map(uid => {
            const u = getUser(uid);
            const r = uid === "u1" ? "admin" : "user";
            return (
              <div key={uid} style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.borderLight}` }}>
                <Av name={u.name} color={u.color} size={36} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: C.textDim }}>{u.email}</div></div>
                <span style={{ fontSize: 10, fontWeight: 700, color: ROLES[r].color, background: `${ROLES[r].color}15`, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase" }}>{ROLES[r].label}</span>
              </div>
            );
          })}
          {(trip.observers || []).length > 0 && <>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginTop: 16, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Observers ({trip.observers.length})</div>
            {trip.observers.map(uid => {
              const u = getUser(uid);
              return (
                <div key={uid} style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.borderLight}` }}>
                  <Av name={u.name} color={u.color} size={36} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: C.textDim }}>{u.email}</div></div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: ROLES.observer.color, background: `${ROLES.observer.color}15`, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase" }}>Observer</span>
                </div>
              );
            })}
          </>}
          {canEdit && <button onClick={() => { setShowTravelers(false); setShowInvite(true); }} style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: 12, background: C.primary, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Invite Someone</button>}
        </>}
      </Modal>
    </div>
  );
}
