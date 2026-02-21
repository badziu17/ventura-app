import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   VENTURA — Travel Planning App v2.1
   Real data: Bucharest trip, Mar 7-9 2026
   ═══════════════════════════════════════════ */

// ─── Design Tokens ───
const C = {
  bg: "#FEFBF6", bgAlt: "#F7F3ED", white: "#FFFFFF",
  surface: "#FFFFFF", surfaceHover: "#FBF8F3",
  border: "#E8E2D9", borderLight: "#F0EBE3",
  primary: "#C4704B", primaryLight: "#F9EDE7", primaryDark: "#A85A38",
  blue: "#2563EB", blueLight: "#EFF6FF", blueDark: "#1D4ED8",
  sage: "#5F8B6A", sageLight: "#ECF4EE",
  coral: "#E8734A", coralLight: "#FEF0EB",
  gold: "#D4A853", goldLight: "#FDF8EC",
  purple: "#7C5CFC", purpleLight: "#F3F0FF",
  text: "#2C1810", textSec: "#6B5B4F", textDim: "#A09486",
  danger: "#DC3545", dangerLight: "#FDF0F0",
  shadow: "0 1px 3px rgba(44,24,16,0.06), 0 4px 12px rgba(44,24,16,0.04)",
  shadowMd: "0 2px 8px rgba(44,24,16,0.08), 0 8px 24px rgba(44,24,16,0.06)",
};

// ─── Home Screen Trips ───
const ALL_TRIPS = [
  { id: "bucharest", name: "Bucharest Discovery", dest: "Bucharest, Romania", dates: "Mar 7 – 9, 2026", travelers: 2, days: 3, status: "upcoming",
    img: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=600&h=300&fit=crop&q=80" },
  { id: "japan", name: "Tokyo Adventure", dest: "Tokyo, Japan", dates: "May 10 – 18, 2026", travelers: 3, days: 8, status: "planning",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=300&fit=crop&q=80" },
  { id: "lisbon", name: "Lisbon & Sintra", dest: "Lisbon, Portugal", dates: "Sep 2025", travelers: 2, days: 5, status: "past",
    img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=300&fit=crop&q=80" },
];

const INSPIRATION = [
  { name: "Kyoto", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=240&h=320&fit=crop&q=80" },
  { name: "Barcelona", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=240&h=320&fit=crop&q=80" },
  { name: "Iceland", img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=240&h=320&fit=crop&q=80" },
  { name: "Amalfi", img: "https://images.unsplash.com/photo-1533606688076-b6683a5103a4?w=240&h=320&fit=crop&q=80" },
  { name: "Morocco", img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=240&h=320&fit=crop&q=80" },
];

// ─── Trip Data ───
const TRIP = {
  name: "Bucharest Discovery",
  dest: "Bucharest, Romania",
  dates: "Mar 7 – 9, 2026",
  heroImg: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=280&fit=crop&q=80",
  travelers: [
    { name: "Bartek", avatar: "B", color: C.blue },
    { name: "Anna", avatar: "A", color: C.coral },
  ],
  days: [
    {
      day: 1, date: "Sat, Mar 7", title: "Historic Center Walk",
      img: "https://images.unsplash.com/photo-1585407925232-33158f7be498?w=600&h=200&fit=crop&q=80",
      weather: { hi: 12, lo: 4, icon: "sun", desc: "Clear skies" },
      items: [
        { time: "09:00", name: "Ogrody Cismigiu", desc: "Oldest park in Bucharest, XIX century landscaped gardens with lake and bridges", type: "sight", duration: "1h", cost: 0, rating: 4.5 },
        { time: "10:15", name: "Palatul Kretzulescu", desc: "1902-04 French Renaissance mansion by Petre Antonescu, UNESCO heritage site", type: "sight", duration: "30min", cost: 0, rating: 4.3 },
        { time: "11:00", name: "Cercul Militar National", desc: "Neoclassical military circle palace, 1911-1923, with themed marble halls", type: "sight", duration: "45min", cost: 0, rating: 4.6 },
        { time: "12:00", name: "Lunch: Caru' cu Bere", desc: "Iconic 1879 beer hall with Neo-Gothic interiors and Romanian cuisine", type: "food", duration: "1.5h", cost: 120, rating: 4.4 },
        { time: "14:00", name: "Muzeum Sztuki Rumunii", desc: "National Art Museum in former Royal Palace, Romanian & European collections", type: "museum", duration: "2h", cost: 30, rating: 4.5 },
        { time: "16:30", name: "Ateneul Roman", desc: "1888 concert hall, neoclassical rotunda with 25-scene Romanian history fresco", type: "sight", duration: "45min", cost: 25, rating: 4.8 },
        { time: "17:30", name: "Palatul CEC", desc: "1897-1900 savings bank HQ, eclectic glass-domed Beaux-Arts landmark", type: "sight", duration: "20min", cost: 0, rating: 4.4 },
        { time: "18:00", name: "Carturesti Carusel", desc: "Six-level Carousel of Light bookstore in restored 1903 Chrissoveloni bank", type: "shopping", duration: "45min", cost: 50, rating: 4.7 },
        { time: "19:00", name: "Umbrellas Street", desc: "Instagram-famous alley with colorful umbrella canopy in Old Town", type: "sight", duration: "15min", cost: 0, rating: 4.2 },
        { time: "19:30", name: "Monastirea Stavropoleos", desc: "1724 Brancovenesc-style monastery with carved stone facade and peaceful courtyard", type: "sight", duration: "30min", cost: 0, rating: 4.7 },
        { time: "20:15", name: "Dinner: Grand Cafe Van Gogh", desc: "Atmospheric Old Town restaurant, Romanian-French fusion", type: "food", duration: "1.5h", cost: 180, rating: 4.3 },
      ]
    },
    {
      day: 2, date: "Sun, Mar 8", title: "Castles of Transylvania",
      img: "https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=600&h=200&fit=crop&q=80",
      weather: { hi: 9, lo: 1, icon: "cloud", desc: "Partly cloudy" },
      items: [
        { time: "07:00", name: "Departure from Bucharest", desc: "Organized day tour pickup from hotel, ~2h drive to Sinaia", type: "transport", duration: "2h", cost: 0, rating: 0 },
        { time: "09:30", name: "Castelul Peles, Sinaia", desc: "Neo-Renaissance royal residence with 160 rooms, stunning alpine setting", type: "sight", duration: "2h", cost: 80, rating: 4.8 },
        { time: "12:00", name: "Lunch in Sinaia", desc: "Mountain town restaurant, traditional Romanian dishes", type: "food", duration: "1h", cost: 90, rating: 4.2 },
        { time: "13:30", name: "Castelul Bran", desc: "Medieval fortress linked to Dracula legend, Queen Marie's residence", type: "sight", duration: "1.5h", cost: 60, rating: 4.3 },
        { time: "15:30", name: "Brasov Old Town", desc: "Saxon medieval town with colorful square and Black Church", type: "sight", duration: "2h", cost: 15, rating: 4.6 },
        { time: "18:00", name: "Return to Bucharest", desc: "~2.5h drive back, arrive around 20:30", type: "transport", duration: "2.5h", cost: 0, rating: 0 },
        { time: "21:00", name: "Light dinner near hotel", desc: "Quick bite at Energiea or local bistro", type: "food", duration: "1h", cost: 80, rating: 4.1 },
      ]
    },
    {
      day: 3, date: "Mon, Mar 9", title: "Parliament & Farewell",
      img: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&h=200&fit=crop&q=80",
      weather: { hi: 14, lo: 5, icon: "partlysunny", desc: "Mostly sunny" },
      items: [
        { time: "09:00", name: "Park Izvor", desc: "Green space opposite Parliament Palace, best frontal views", type: "sight", duration: "30min", cost: 0, rating: 4.1 },
        { time: "10:00", name: "Palatul Parlamentului", desc: "World's 2nd largest admin building, built 1980s, marble halls & terrace", type: "sight", duration: "2h", cost: 50, rating: 4.6 },
        { time: "12:30", name: "Dealul Patriarhiei", desc: "Patriarchal Hill with Romanian Orthodox cathedral, panoramic views", type: "sight", duration: "30min", cost: 0, rating: 4.4 },
        { time: "13:15", name: "Lunch: Lacrimi si Sfinti", desc: "Award-winning modern Romanian cuisine in Old Town", type: "food", duration: "1.5h", cost: 150, rating: 4.6 },
        { time: "15:00", name: "Palatul Bragadiru", desc: "1894-1900 industrialist's palace, Neo-Romanian/Gothic event venue", type: "sight", duration: "45min", cost: 0, rating: 4.3 },
        { time: "16:00", name: "Final stroll: Calea Victoriei", desc: "Last walk along Bucharest's grand boulevard, coffee stop", type: "sight", duration: "1h", cost: 25, rating: 4.5 },
        { time: "17:30", name: "Bolt to Airport (OTP)", desc: "~40min ride to Henri Coanda International", type: "transport", duration: "45min", cost: 60, rating: 0 },
      ]
    },
  ],
};

const PACKING = {
  "Clothing": [
    { item: "Warm layers (fleece/sweater)", qty: 3, packed: true, person: "All", ai: false },
    { item: "Winter jacket / coat", qty: 1, packed: true, person: "All", ai: true },
    { item: "Comfortable walking shoes", qty: 1, packed: true, person: "All", ai: false },
    { item: "Scarf & gloves", qty: 1, packed: false, person: "All", ai: true },
    { item: "Jeans / warm trousers", qty: 3, packed: false, person: "All", ai: false },
    { item: "Rain jacket (light)", qty: 1, packed: false, person: "All", ai: true },
    { item: "Underwear & socks", qty: 4, packed: true, person: "All", ai: false },
    { item: "Smart casual outfit", qty: 1, packed: false, person: "All", ai: false },
  ],
  "Toiletries": [
    { item: "Toothbrush & toothpaste", qty: 2, packed: false, person: "All", ai: false },
    { item: "Moisturizer (cold weather)", qty: 1, packed: false, person: "All", ai: true },
    { item: "Lip balm", qty: 1, packed: false, person: "All", ai: true },
    { item: "Hand sanitizer", qty: 1, packed: true, person: "All", ai: false },
  ],
  "Electronics": [
    { item: "Phone chargers", qty: 2, packed: true, person: "All", ai: false },
    { item: "Power bank", qty: 1, packed: true, person: "Bartek", ai: false },
    { item: "EU plug adapter", qty: 1, packed: false, person: "Bartek", ai: true },
    { item: "Camera + memory cards", qty: 1, packed: false, person: "Anna", ai: false },
    { item: "Earbuds / headphones", qty: 2, packed: false, person: "All", ai: false },
  ],
  "Documents": [
    { item: "ID cards / passports", qty: 2, packed: false, person: "Bartek", ai: false },
    { item: "Booking confirmations", qty: 1, packed: false, person: "Bartek", ai: false },
    { item: "Travel insurance docs", qty: 1, packed: false, person: "Bartek", ai: false },
    { item: "Castle tour tickets", qty: 2, packed: false, person: "Bartek", ai: true },
  ],
};

const EXPENSES = [
  { id: 1, name: "Hotel Marmorosch Bucharest", cat: "Accommodation", amount: 1200, payer: "Bartek", date: "Mar 7" },
  { id: 2, name: "Lunch: Caru' cu Bere", cat: "Food", amount: 120, payer: "Anna", date: "Mar 7" },
  { id: 3, name: "Museum & Athenaeum tickets", cat: "Activities", amount: 55, payer: "Bartek", date: "Mar 7" },
  { id: 4, name: "Carturesti Carusel books", cat: "Shopping", amount: 50, payer: "Anna", date: "Mar 7" },
  { id: 5, name: "Dinner: Grand Cafe Van Gogh", cat: "Food", amount: 180, payer: "Bartek", date: "Mar 7" },
  { id: 6, name: "Transylvania day tour (2 pax)", cat: "Activities", amount: 600, payer: "Bartek", date: "Mar 8" },
  { id: 7, name: "Peles + Bran tickets", cat: "Activities", amount: 140, payer: "Anna", date: "Mar 8" },
  { id: 8, name: "Lunch Sinaia", cat: "Food", amount: 90, payer: "Anna", date: "Mar 8" },
  { id: 9, name: "Brasov souvenirs", cat: "Shopping", amount: 80, payer: "Anna", date: "Mar 8" },
  { id: 10, name: "Parliament Palace tour", cat: "Activities", amount: 50, payer: "Bartek", date: "Mar 9" },
  { id: 11, name: "Lunch: Lacrimi si Sfinti", cat: "Food", amount: 150, payer: "Bartek", date: "Mar 9" },
  { id: 12, name: "Bolt to airport", cat: "Transport", amount: 60, payer: "Bartek", date: "Mar 9" },
];

const INIT_BUDGET = { total: 3500, Accommodation: 1400, Food: 800, Activities: 700, Shopping: 300, Transport: 300 };
const RON_PLN = 0.93;
const CAT_C = { Accommodation: C.purple, Food: C.coral, Activities: C.blue, Shopping: C.gold, Transport: C.sage };
const CAT_I = { Accommodation: "🏨", Food: "🍽️", Activities: "🎟️", Shopping: "🛍️", Transport: "🚗" };
const PACK_I = { Clothing: "👕", Toiletries: "🧴", Electronics: "📱", Documents: "📄" };

const CHAT = [
  { from: "Bartek", text: "Zarezerwowa\u0142em wycieczk\u0119 na Transylwani\u0119 na niedziel\u0119!", time: "Feb 28, 18:32", color: C.blue },
  { from: "Anna", text: "Super! A bilety na Pa\u0142ac Parlamentu trzeba wcze\u015Bniej?", time: "Feb 28, 18:45", color: C.coral },
  { from: "Bartek", text: "Tak, kupi\u0142em online na poniedzia\u0142ek 10:00.", time: "Feb 28, 19:01", color: C.blue },
  { from: "Anna", text: "Doda\u0142am Lacrimi \u0219i Sfin\u021Bi na lunch, pono\u0107 jest genialne!", time: "Mar 1, 10:15", color: C.coral },
  { from: "Bartek", text: "Widzia\u0142em reviews \u2014 4.6. Na sobot\u0119 wieczorem Van Gogh?", time: "Mar 1, 10:22", color: C.blue },
  { from: "Anna", text: "Tak! I koniecznie C\u0103rture\u0219ti Carusel \u2014 wygl\u0105da magicznie", time: "Mar 1, 10:30", color: C.coral },
];

const DEALS = [
  { name: "Marmorosch Bucharest, Autograph Collection", type: "Hotel", price: "\u20AC89/night", rating: 4.7, partner: "Booking.com", pColor: "#003580",
    url: "https://www.booking.com/hotel/ro/marmorosch-bucharest-autograph-collection.html",
    desc: "5-star heritage hotel in former bank HQ, Old Town. Spa & rooftop bar.",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=120&fit=crop&q=80" },
  { name: "Transylvania Day Tour (Peles + Bran + Brasov)", type: "Activity", price: "\u20AC45/person", rating: 4.6, partner: "GetYourGuide", pColor: "#FF5533",
    url: "https://www.getyourguide.com/bucharest-l347/from-bucharest-transylvania-castles-full-day-tour-t66866/",
    desc: "Full-day guided tour incl. Sinaia, Bran Castle & Brasov Old Town.",
    img: "https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=120&h=120&fit=crop&q=80" },
  { name: "Parliament Palace Skip-the-Line", type: "Activity", price: "\u20AC12/person", rating: 4.5, partner: "Viator", pColor: "#5B1FA8",
    url: "https://www.viator.com/tours/Bucharest/Palace-of-Parliament-Skip-the-Line-Ticket-and-Guided-Tour/d22407-41714P2",
    desc: "2-hour guided tour, world's 2nd largest building. English available.",
    img: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=120&h=120&fit=crop&q=80" },
  { name: "Bucharest Airport Private Transfer", type: "Transfer", price: "\u20AC18 one-way", rating: 4.8, partner: "Booking.com", pColor: "#003580",
    url: "https://www.booking.com/taxi/",
    desc: "Pre-booked sedan, meet & greet at arrivals. Fixed price.",
    img: "https://images.unsplash.com/photo-1449965408869-ecd309a4b2eb?w=120&h=120&fit=crop&q=80" },
  { name: "WizzAir GDN \u2192 OTP", type: "Flight", price: "from \u20AC29", rating: 4.2, partner: "Skyscanner", pColor: "#0770E3",
    url: "https://www.skyscanner.net/transport/flights/gdn/buh/",
    desc: "Direct flights Gdansk to Bucharest. WizzAir and Ryanair options.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=120&h=120&fit=crop&q=80" },
];

const REVIEWS = [
  { place: "Castelul Peles", rating: 5, text: "One of Europe's most beautiful castles. Book the full tour.", author: "TravelBlogger22", date: "Jan 2026" },
  { place: "Carturesti Carusel", rating: 5, text: "Breathtaking space. Get coffee on top floor for the best view.", author: "BookLover_EU", date: "Feb 2026" },
  { place: "Ateneul Roman", rating: 5, text: "World-class acoustics. The interior fresco alone is worth the visit.", author: "ClassicMusicFan", date: "Dec 2025" },
  { place: "Palatul Parlamentului", rating: 4, text: "Monumental and sobering. Terrace views are the highlight.", author: "HistoryNerd99", date: "Jan 2026" },
];

// ─── Helpers ───
const fmt = n => n.toLocaleString("ro-RO");
const fP = n => Math.round(n * RON_PLN);
const tC = { sight: C.blue, food: C.coral, museum: C.purple, shopping: C.gold, transport: C.sage };
const tE = { sight: "📍", food: "🍽️", museum: "🖼️", shopping: "🛍️", transport: "🚌" };
const WI = ({ t, s = 18 }) => {
  if (t === "sun") return <span style={{ fontSize: s }}>☀️</span>;
  if (t === "cloud") return <span style={{ fontSize: s }}>⛅</span>;
  if (t === "rain") return <span style={{ fontSize: s }}>🌧️</span>;
  return <span style={{ fontSize: s }}>🌤️</span>;
};

// ─── Components ───
const Pill = ({ children, color = C.primary, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500,
    background: active ? color : "transparent", color: active ? "#fff" : C.textSec,
    border: active ? "none" : `1.5px solid ${C.border}`, cursor: "pointer",
    transition: "all 0.2s", fontFamily: "inherit", whiteSpace: "nowrap",
  }}>{children}</button>
);

const Card = ({ children, style: sx, onClick, hover = true }) => (
  <div onClick={onClick} style={{
    background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`,
    boxShadow: C.shadow, transition: "all 0.2s", cursor: onClick ? "pointer" : "default", ...sx,
  }}
  onMouseEnter={e => { if (hover && onClick) { e.currentTarget.style.boxShadow = C.shadowMd; e.currentTarget.style.transform = "translateY(-1px)"; }}}
  onMouseLeave={e => { if (hover && onClick) { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = "translateY(0)"; }}}
  >{children}</div>
);

const Bar = ({ v, mx, color = C.primary, h = 6 }) => (
  <div style={{ width: "100%", height: h, background: C.bgAlt, borderRadius: h, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(v / mx * 100, 100)}%`, height: h, borderRadius: h, background: v > mx ? C.danger : color, transition: "width 0.6s ease" }} />
  </div>
);

const Av = ({ name, color, size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{name[0]}</div>
);

const Img = ({ src, alt, style: sx }) => {
  const [e, setE] = useState(false);
  if (e) return <div style={{ ...sx, background: `linear-gradient(135deg, ${C.primaryLight}, ${C.blueLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim }}>🗺️</div>;
  return <img src={src} alt={alt} style={{ objectFit: "cover", display: "block", ...sx }} onError={() => setE(true)} />;
};

// ─── Map ───
const TripMap = ({ day }) => {
  const pts = [
    { x: 50, y: 35, l: "Old Town", d: 1 }, { x: 40, y: 25, l: "Cismigiu", d: 1 }, { x: 55, y: 20, l: "Ateneum", d: 1 },
    { x: 30, y: 80, l: "Sinaia", d: 2 }, { x: 15, y: 60, l: "Bran", d: 2 }, { x: 20, y: 45, l: "Brasov", d: 2 },
    { x: 45, y: 50, l: "Parliament", d: 3 }, { x: 60, y: 55, l: "Bragadiru", d: 3 }, { x: 80, y: 15, l: "Airport", d: 3 },
  ];
  const dc = ["", C.blue, C.coral, C.sage];
  const f = day ? pts.filter(p => p.d === day) : pts;
  return (
    <div style={{ position: "relative", width: "100%", height: 200, background: `linear-gradient(135deg, ${C.blueLight}, ${C.bgAlt}, ${C.sageLight})`, borderRadius: 16, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <defs><pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke={C.border} strokeWidth="0.5" opacity="0.4" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#g)" />
        {f.length > 1 && f.map((p, i) => i > 0 && <line key={i} x1={`${f[i-1].x}%`} y1={`${f[i-1].y}%`} x2={`${p.x}%`} y2={`${p.y}%`} stroke={dc[p.d]} strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />)}
      </svg>
      {f.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: dc[p.d], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", boxShadow: `0 2px 6px ${dc[p.d]}55`, border: "2px solid #fff" }}>{p.d}</div>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.text, background: "rgba(255,255,255,0.85)", padding: "1px 5px", borderRadius: 4, whiteSpace: "nowrap" }}>{p.l}</span>
        </div>
      ))}
    </div>
  );
};

// ─── AI Chat ───
const AI = () => {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Hi Bartek! I'm your Ventura AI planner. I see you're heading to Bucharest for 3 days. Want me to optimize your itinerary, suggest hidden gems, or help with bookings?" }]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);
  const chips = ["Optimize Day 1 route", "Best restaurants Old Town", "March weather tips", "Hidden gems Bucharest"];
  const send = (t) => {
    const v = t || inp; if (!v.trim()) return;
    setMsgs(p => [...p, { role: "user", text: v }]); setInp(""); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const R = {
        "Optimize Day 1 route": "Your Day 1 route is already efficient along Calea Victoriei. One tweak: swap CEC (17:30) with Carturesti (18:00) — the bookstore closes at 21:00 but CEC exterior photographs best in golden hour ~18:15. Saves ~10min backtracking.\n\nApply this change?",
        "Best restaurants Old Town": "Top picks near your route:\n\n1. Lacrimi si Sfinti — Modern Romanian, 4.6 (on Day 3!)\n2. Caru' cu Bere — Historic beer hall, 4.4 (Day 1)\n3. Energiea — Veggie-friendly, 4.5\n4. Artist Restaurant — Fine dining, 4.7, reserve ahead\n\nShall I book any?",
        "March weather tips": "March in Bucharest: 4-14C, occasional rain.\n\nLayer up: warm base + fleece + windproof jacket\nScarf & gloves for morning walks\nWaterproof walking shoes (cobblestones!)\nLight rain jacket — 30% rain chance Sunday\n\nAlready added weather items to your packing list!",
        "Hidden gems Bucharest": "Spots most tourists miss:\n\nPasajul Macca-Vilacrosse — Yellow glass passage, amazing light\nStreet Art in Selari — Murals near Stavropoleos\nOrigo Coffee — Best specialty coffee in town\nBotanical Garden — Peaceful escape near Cotroceni\n\nWant me to fit any into free slots?",
      };
      setMsgs(p => [...p, { role: "ai", text: R[v] || "I can optimize routes, find restaurants, adjust timing, or recommend activities. What would you like?" }]);
    }, 1800);
  };
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [msgs, typing]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: 480 }}>
      <div ref={ref} style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.3s ease" }}>
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: 16, background: m.role === "user" ? C.primary : C.white, border: m.role === "ai" ? `1px solid ${C.borderLight}` : "none", boxShadow: m.role === "ai" ? C.shadow : "none", color: m.role === "user" ? "#fff" : C.text, fontSize: 13, lineHeight: 1.6, borderBottomRightRadius: m.role === "user" ? 4 : 16, borderBottomLeftRadius: m.role === "ai" ? 4 : 16, whiteSpace: "pre-line" }}>
              {m.role === "ai" && <div style={{ fontSize: 10, fontWeight: 700, color: C.primary, marginBottom: 4, letterSpacing: 0.5 }}>VENTURA AI</div>}
              {m.text}
            </div>
          </div>
        ))}
        {typing && <div style={{ display: "flex", gap: 5, padding: "12px 16px", background: C.white, borderRadius: 16, width: "fit-content", border: `1px solid ${C.borderLight}` }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.textDim, animation: `dot 1.2s ease infinite ${i*0.15}s` }} />)}</div>}
      </div>
      {msgs.length <= 2 && <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: 6 }}>
        {chips.map((s, i) => <button key={i} onClick={() => send(s)} style={{ padding: "7px 14px", borderRadius: 99, background: C.primaryLight, border: `1px solid ${C.primary}33`, color: C.primary, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>)}
      </div>}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.borderLight}`, display: "flex", gap: 8 }}>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about your trip..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: C.bg, color: C.text }} />
        <button onClick={() => send()} style={{ padding: "10px 18px", borderRadius: 12, background: C.primary, border: "none", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>Send</button>
      </div>
    </div>
  );
};

// ═══════════════ MAIN ═══════════════
export default function Ventura() {
  const [scr, setScr] = useState("home");
  const [tab, setTab] = useState("trip");
  const [aDay, setADay] = useState(null);
  const [pack, setPack] = useState(PACKING);
  const [exps, setExps] = useState(EXPENSES);
  const [showAdd, setShowAdd] = useState(false);
  const [nE, setNE] = useState({ name: "", amount: "", cat: "Food", payer: "Bartek" });
  const [cI, setCI] = useState("");
  const [cM, setCM] = useState(CHAT);
  const [eItem, setEItem] = useState(null);
  const [eDays, setEDays] = useState({});
  const [bSrch, setBSrch] = useState("");
  const [bgt, setBgt] = useState(INIT_BUDGET);
  const [eBgt, setEBgt] = useState(false);
  const [bIn, setBIn] = useState(String(INIT_BUDGET.total));
  const [ntd, setNtd] = useState("");

  const tD = d => setEDays(p => ({ ...p, [d]: !p[d] }));
  const sB = () => { const v = parseInt(bIn); if (v > 0) setBgt(p => ({ ...p, total: v })); setEBgt(false); };
  const tP = (c, i) => { setPack(p => { const u = { ...p }; u[c] = [...u[c]]; u[c][i] = { ...u[c][i], packed: !u[c][i].packed }; return u; }); };

  const pC = Object.values(pack).flat().filter(i => i.packed).length;
  const tI = Object.values(pack).flat().length;
  const tS = exps.reduce((s, e) => s + e.amount, 0);
  const cS = exps.reduce((a, e) => { a[e.cat] = (a[e.cat] || 0) + e.amount; return a; }, {});
  const bP = exps.filter(e => e.payer === "Bartek").reduce((s, e) => s + e.amount, 0);
  const aP = exps.filter(e => e.payer === "Anna").reduce((s, e) => s + e.amount, 0);

  const addE = () => { if (!nE.name || !nE.amount) return; setExps(p => [...p, { id: p.length+1, name: nE.name, cat: nE.cat, amount: +nE.amount, payer: nE.payer, date: "Mar 9" }]); setNE({ name: "", amount: "", cat: "Food", payer: "Bartek" }); setShowAdd(false); };
  const sChat = () => { if (!cI.trim()) return; setCM(p => [...p, { from: "Bartek", text: cI, time: "Now", color: C.blue }]); setCI(""); };

  const tabs = [
    { id: "trip", l: "Trip", i: "🗺️" }, { id: "ai", l: "AI Planner", i: "✨" },
    { id: "packing", l: "Packing", i: "🎒" }, { id: "budget", l: "Budget", i: "💰" },
    { id: "chat", l: "Group", i: "💬" }, { id: "booking", l: "Book", i: "🔖" },
  ];

  const F = "'Fraunces', serif";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito Sans', 'Helvetica Neue', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 5px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dot { 0%,100% { opacity:.25; transform:scale(.8); } 50% { opacity:1; transform:scale(1.1); } }
        input:focus, select:focus { outline:none; border-color:${C.primary} !important; }
        select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%236B5B4F' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:28px !important; }
      `}</style>

      {/* HEADER */}
      <header style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.borderLight}`, background: "rgba(254,251,246,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div onClick={() => setScr("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: F }}>V</div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: F, color: C.text }}>Ventura</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {scr === "trip" && <button onClick={() => setScr("home")} style={{ padding: "6px 14px", borderRadius: 99, background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: C.textSec }}>← Trips</button>}
          <Av name="Bartek" color={C.blue} size={28} />
        </div>
      </header>

      {/* ═══ HOME ═══ */}
      {scr === "home" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ padding: "28px 20px 20px", background: `linear-gradient(180deg, ${C.primaryLight} 0%, ${C.bg} 100%)` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Welcome back</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: F, marginBottom: 4 }}>Where to next, Bartek?</h1>
            <p style={{ fontSize: 14, color: C.textSec }}>{ALL_TRIPS.filter(t => t.status !== "past").length} upcoming trips</p>
          </div>
          <div style={{ padding: "0 20px 16px" }}>
            <Card style={{ padding: 16, display: "flex", gap: 10, alignItems: "center" }} hover={false}>
              <input value={ntd} onChange={e => setNtd(e.target.value)} placeholder="Where do you want to go? e.g. Barcelona, Kyoto..."
                style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: C.bg, color: C.text }} />
              <button style={{ padding: "12px 20px", borderRadius: 12, background: C.primary, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14, whiteSpace: "nowrap" }}>+ New Trip</button>
            </Card>
          </div>
          <div style={{ padding: "0 20px 40px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Your Trips</div>
            {ALL_TRIPS.map(tr => (
              <Card key={tr.id} onClick={tr.id === "bucharest" ? () => setScr("trip") : undefined} style={{ marginBottom: 14, overflow: "hidden", opacity: tr.id === "bucharest" ? 1 : 0.75 }}>
                <div style={{ position: "relative", height: 150, overflow: "hidden" }}>
                  <Img src={tr.img} alt={tr.name} style={{ width: "100%", height: "100%" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(44,24,16,0.6) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, background: tr.status === "upcoming" ? C.sage : tr.status === "planning" ? C.blue : C.textDim, color: "#fff" }}>{tr.status}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: F, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{tr.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>📍 {tr.dest}</div>
                  </div>
                </div>
                <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textSec }}>
                  <span>📅 {tr.dates}</span><span>👥 {tr.travelers} · {tr.days} days</span>
                </div>
              </Card>
            ))}
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, margin: "24px 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Inspiration</div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {INSPIRATION.map(d => (
                <div key={d.name} style={{ flex: "0 0 120px", borderRadius: 14, overflow: "hidden", position: "relative", height: 160, cursor: "pointer", boxShadow: C.shadow }}>
                  <Img src={d.img} alt={d.name} style={{ width: "100%", height: "100%" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(44,24,16,0.55) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", bottom: 10, left: 12 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: F, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{d.name}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TRIP ═══ */}
      {scr === "trip" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          {/* Hero */}
          <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
            <Img src={TRIP.heroImg} alt={TRIP.name} style={{ width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(44,24,16,0.65) 0%, rgba(44,24,16,0.15) 60%, transparent)" }} />
            <div style={{ position: "absolute", bottom: 14, left: 20, right: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>Upcoming Trip</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: F, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.3)", marginBottom: 4 }}>{TRIP.name}</h1>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                <span>📍 {TRIP.dest}</span><span>📅 {TRIP.dates}</span><span>👥 {TRIP.travelers.length}</span>
              </div>
            </div>
            <div style={{ position: "absolute", top: 12, right: 16, background: "rgba(255,255,255,0.92)", borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: F, color: C.primary }}>15</span>
              <span style={{ fontSize: 10, color: C.textDim }}>days</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ padding: "0 20px", display: "flex", gap: 2, overflowX: "auto", borderBottom: `1px solid ${C.borderLight}` }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 12px", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? C.primary : C.textDim, background: "transparent", border: "none", borderBottom: tab === t.id ? `2.5px solid ${C.primary}` : "2.5px solid transparent", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 14 }}>{t.i}</span> {t.l}
              </button>
            ))}
          </div>

          <div style={{ padding: "16px 20px 100px", maxWidth: 720, margin: "0 auto" }}>

            {/* TRIP TAB */}
            {tab === "trip" && <div>
              <TripMap day={aDay} />
              <div style={{ display: "flex", gap: 6, margin: "14px 0", overflowX: "auto", paddingBottom: 4 }}>
                <Pill active={!aDay} onClick={() => setADay(null)} color={C.text}>All Days</Pill>
                {TRIP.days.map(d => <Pill key={d.day} active={aDay === d.day} onClick={() => { setADay(aDay === d.day ? null : d.day); setEDays(p => ({ ...p, [d.day]: true })); }} color={[C.blue, C.coral, C.sage][d.day-1]}>Day {d.day}: {d.title}</Pill>)}
              </div>
              {TRIP.days.filter(d => !aDay || d.day === aDay).map(day => {
                const open = !!eDays[day.day]; const dc = day.items.reduce((s, it) => s + it.cost, 0);
                return (
                  <Card key={day.day} style={{ marginBottom: 14, overflow: "hidden" }} hover={false}>
                    <div onClick={() => tD(day.day)} style={{ cursor: "pointer" }}>
                      <div style={{ position: "relative", height: 60, overflow: "hidden" }}>
                        <Img src={day.img} alt={day.title} style={{ width: "100%", height: "100%" }} />
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${[C.blue, C.coral, C.sage][day.day-1]}CC, ${[C.blue, C.coral, C.sage][day.day-1]}44)` }} />
                        <div style={{ position: "absolute", inset: 0, padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)" }}>D{day.day}</div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>{day.title}</div>
                              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{day.date} · {day.items.length} stops{dc > 0 ? ` · ~${dc} RON` : ""}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ background: "rgba(255,255,255,0.9)", padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                              <WI t={day.weather.icon} s={14} />
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{day.weather.hi}/{day.weather.lo}°</span>
                            </div>
                            <span style={{ fontSize: 14, color: "#fff", transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {open && <div style={{ animation: "fadeUp 0.25s ease" }}>
                      {day.items.map((it, i) => {
                        const ex = eItem === `${day.day}-${i}`;
                        return (
                          <div key={i} onClick={() => setEItem(ex ? null : `${day.day}-${i}`)} style={{ padding: "10px 16px", display: "flex", gap: 12, borderBottom: i < day.items.length-1 ? `1px solid ${C.borderLight}` : "none", cursor: "pointer", transition: "background 0.15s", background: ex ? C.bgAlt : "transparent" }}
                            onMouseEnter={e => { if (!ex) e.currentTarget.style.background = C.surfaceHover; }} onMouseLeave={e => { if (!ex) e.currentTarget.style.background = "transparent"; }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44, paddingTop: 2 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.textDim }}>{it.time}</span>
                              {i < day.items.length-1 && <div style={{ width: 1.5, flex: 1, background: C.borderLight, marginTop: 6 }} />}
                            </div>
                            <div style={{ flex: 1, paddingBottom: 4 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                <span style={{ fontSize: 15 }}>{tE[it.type]}</span>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</span>
                                {it.rating > 0 && <span style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>★ {it.rating}</span>}
                              </div>
                              {ex ? <div style={{ animation: "fadeUp 0.2s ease", marginTop: 4 }}>
                                <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5, marginBottom: 6 }}>{it.desc}</p>
                                <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textDim, flexWrap: "wrap" }}>
                                  <span>⏱ {it.duration}</span>
                                  {it.cost > 0 && <span>💰 {it.cost} RON (~{fP(it.cost)} PLN)</span>}
                                  <span style={{ color: tC[it.type], fontWeight: 600, textTransform: "capitalize" }}>{it.type}</span>
                                </div>
                              </div> : <div style={{ fontSize: 11, color: C.textDim }}>{it.duration}{it.cost > 0 ? ` · ${it.cost} RON` : ""}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>}
                  </Card>
                );
              })}
            </div>}

            {/* AI TAB */}
            {tab === "ai" && <Card style={{ overflow: "hidden" }} hover={false}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", gap: 8, background: `linear-gradient(90deg, ${C.primaryLight}, ${C.white})` }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>AI Trip Planner</span>
                <span style={{ fontSize: 10, background: C.primary, color: "#fff", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>GPT-4o</span>
              </div>
              <AI />
            </Card>}

            {/* PACKING TAB */}
            {tab === "packing" && <div>
              <Card style={{ padding: 14, marginBottom: 14 }} hover={false}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textSec, marginBottom: 10, fontFamily: F }}>7-Day Forecast — Bucharest</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                  {[...TRIP.days.map(d => ({ date: d.date.split(", ")[1], ...d.weather })),
                    { date: "Mar 10", icon: "rain", hi: 15, lo: 6 }, { date: "Mar 11", icon: "cloud", hi: 12, lo: 5 },
                    { date: "Mar 12", icon: "sun", hi: 16, lo: 7 }, { date: "Mar 13", icon: "partlysunny", hi: 15, lo: 6 },
                  ].map((w, i) => (
                    <div key={i} style={{ flex: "0 0 auto", textAlign: "center", padding: "8px 12px", background: i < 3 ? C.bgAlt : C.white, borderRadius: 12, minWidth: 70, border: i < 3 ? `1.5px solid ${C.border}` : `1px solid ${C.borderLight}` }}>
                      <div style={{ fontSize: 10, color: C.textDim, fontWeight: 600 }}>{w.date}</div>
                      <div style={{ margin: "4px 0" }}><WI t={w.icon} s={20} /></div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{w.hi}°</div>
                      <div style={{ fontSize: 11, color: C.textDim }}>{w.lo}°</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card style={{ padding: 16, marginBottom: 14 }} hover={false}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>Packing Progress</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.sage }}>{pC}/{tI}</span>
                </div>
                <Bar v={pC} mx={tI} color={C.sage} h={8} />
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>{tI - pC} remaining · AI added 6 weather items</div>
              </Card>
              {Object.entries(pack).map(([cat, items]) => (
                <Card key={cat} style={{ marginBottom: 10, overflow: "hidden" }} hover={false}>
                  <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{PACK_I[cat]} {cat}</span>
                    <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>{items.filter(x=>x.packed).length}/{items.length}</span>
                  </div>
                  {items.map((it, i) => (
                    <div key={i} onClick={() => tP(cat, i)} style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: i < items.length-1 ? `1px solid ${C.borderLight}` : "none", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, border: it.packed ? "none" : `2px solid ${C.border}`, background: it.packed ? C.sage : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {it.packed && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ flex: 1, fontSize: 13, color: it.packed ? C.textDim : C.text, textDecoration: it.packed ? "line-through" : "none" }}>{it.item}</span>
                      {it.ai && <span style={{ fontSize: 9, background: C.primaryLight, color: C.primary, padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>AI</span>}
                      <span style={{ fontSize: 11, color: C.textDim }}>x{it.qty}</span>
                      <span style={{ fontSize: 10, color: C.textDim, minWidth: 36, textAlign: "right" }}>{it.person}</span>
                    </div>
                  ))}
                </Card>
              ))}
            </div>}

            {/* BUDGET TAB */}
            {tab === "budget" && <div>
              <Card style={{ padding: 20, marginBottom: 14, background: `linear-gradient(135deg, ${C.primaryLight}, ${C.white})` }} hover={false}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Total Spent</div>
                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: F }}>{fmt(tS)} <span style={{ fontSize: 16, fontWeight: 400, color: C.textSec }}>RON</span></div>
                    <div style={{ fontSize: 12, color: C.textSec }}>≈ {fP(tS)} PLN</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, marginBottom: 2 }}>PLANNED BUDGET</div>
                    {eBgt ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input value={bIn} onChange={e => setBIn(e.target.value)} autoFocus type="number" onKeyDown={e => e.key === "Enter" && sB()}
                          style={{ width: 90, padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${C.primary}`, fontSize: 16, fontWeight: 700, fontFamily: F, textAlign: "right", background: C.white, color: C.text }} />
                        <button onClick={sB} style={{ padding: "6px 10px", borderRadius: 8, background: C.sage, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✓</button>
                      </div>
                    ) : (
                      <div onClick={() => { setEBgt(true); setBIn(String(bgt.total)); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{fmt(bgt.total)} RON</div>
                        <span style={{ fontSize: 11, color: C.primary, fontWeight: 600 }}>✎</span>
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: tS <= bgt.total ? C.sage : C.danger, fontWeight: 600, marginTop: 2 }}>
                      {tS <= bgt.total ? `${fmt(bgt.total - tS)} remaining` : `${fmt(tS - bgt.total)} over!`}
                    </div>
                    <div style={{ fontSize: 10, color: C.textDim }}>≈ {fP(bgt.total)} PLN</div>
                  </div>
                </div>
                <Bar v={tS} mx={bgt.total} color={C.primary} h={10} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: C.textDim }}>
                  <span>{Math.round(tS / bgt.total * 100)}% used</span><span>{fmt(bgt.total - tS)} RON left</span>
                </div>
              </Card>
              <Card style={{ padding: 16, marginBottom: 14 }} hover={false}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, marginBottom: 12 }}>By Category</div>
                {Object.entries(bgt).filter(([k]) => k !== "total").map(([cat, cb]) => {
                  const sp = cS[cat] || 0;
                  return <div key={cat} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>{CAT_I[cat]}</span><span style={{ fontSize: 12, fontWeight: 600 }}>{cat}</span></div>
                      <span style={{ fontSize: 11, color: sp > cb ? C.danger : C.textDim, fontWeight: sp > cb ? 600 : 400 }}>{fmt(sp)} / {fmt(cb)}</span>
                    </div>
                    <Bar v={sp} mx={cb} color={CAT_C[cat]} />
                  </div>;
                })}
              </Card>
              <Card style={{ padding: 16, marginBottom: 14 }} hover={false}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, marginBottom: 12 }}>Expense Split</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  {[{ n: "Bartek", p: bP, c: C.blue }, { n: "Anna", p: aP, c: C.coral }].map(x => (
                    <div key={x.n} style={{ flex: 1, padding: 12, background: C.bgAlt, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Av name={x.n} color={x.c} size={36} />
                      <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>{x.n} paid</div>
                      <div style={{ fontSize: 17, fontWeight: 800, fontFamily: F }}>{fmt(x.p)} RON</div>
                      <div style={{ fontSize: 10, color: C.textDim }}>≈ {fP(x.p)} PLN</div>
                    </div>
                  ))}
                </div>
                {bP !== aP && <div style={{ padding: 12, borderRadius: 12, background: bP > aP ? C.coralLight : C.blueLight, textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: bP > aP ? C.coral : C.blue }}>
                    {bP > aP ? `Anna owes Bartek ${fmt(Math.round((bP-aP)/2))} RON (~${fP(Math.round((bP-aP)/2))} PLN)` : `Bartek owes Anna ${fmt(Math.round((aP-bP)/2))} RON`}
                  </span>
                </div>}
              </Card>
              <Card style={{ overflow: "hidden" }} hover={false}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>All Expenses ({exps.length})</span>
                  <button onClick={() => setShowAdd(!showAdd)} style={{ padding: "6px 14px", borderRadius: 99, background: C.primary, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Add</button>
                </div>
                {showAdd && <div style={{ padding: 14, borderBottom: `1px solid ${C.borderLight}`, background: C.bgAlt }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <input value={nE.name} onChange={e => setNE(p => ({...p, name: e.target.value}))} placeholder="Name" style={{ flex: "1 1 120px", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 12, fontFamily: "inherit", background: C.white, color: C.text }} />
                    <input value={nE.amount} onChange={e => setNE(p => ({...p, amount: e.target.value}))} placeholder="RON" type="number" style={{ flex: "0 1 80px", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 12, fontFamily: "inherit", background: C.white, color: C.text }} />
                    <select value={nE.cat} onChange={e => setNE(p => ({...p, cat: e.target.value}))} style={{ flex: "0 1 110px", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 12, fontFamily: "inherit", background: C.white, color: C.text }}>{Object.keys(CAT_C).map(c => <option key={c}>{c}</option>)}</select>
                    <select value={nE.payer} onChange={e => setNE(p => ({...p, payer: e.target.value}))} style={{ flex: "0 1 90px", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 12, fontFamily: "inherit", background: C.white, color: C.text }}><option>Bartek</option><option>Anna</option></select>
                    <button onClick={addE} style={{ padding: "8px 16px", borderRadius: 8, background: C.sage, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
                  </div>
                </div>}
                {exps.map(e => (
                  <div key={e.id} style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.borderLight}` }}
                    onMouseEnter={ev => ev.currentTarget.style.background = C.surfaceHover} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${CAT_C[e.cat]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{CAT_I[e.cat]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: C.textDim }}>{e.cat} · {e.date} · {e.payer}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(e.amount)} RON</div>
                      <div style={{ fontSize: 10, color: C.textDim }}>~{fP(e.amount)} PLN</div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>}

            {/* CHAT TAB */}
            {tab === "chat" && <Card style={{ overflow: "hidden" }} hover={false}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.borderLight}`, background: C.bgAlt }}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F }}>Trip Chat — {TRIP.name}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>Bartek & Anna · {cM.length} messages</div>
              </div>
              <div style={{ height: 400, overflow: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {cM.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.from === "Bartek" ? "row-reverse" : "row" }}>
                    <Av name={m.from} color={m.color} size={28} />
                    <div style={{ maxWidth: "75%" }}>
                      <div style={{ fontSize: 10, color: C.textDim, marginBottom: 2, textAlign: m.from === "Bartek" ? "right" : "left" }}>{m.from} · {m.time}</div>
                      <div style={{ padding: "9px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.5, background: m.from === "Bartek" ? C.blue : C.white, color: m.from === "Bartek" ? "#fff" : C.text, border: m.from !== "Bartek" ? `1px solid ${C.borderLight}` : "none", borderBottomRightRadius: m.from === "Bartek" ? 4 : 14, borderBottomLeftRadius: m.from !== "Bartek" ? 4 : 14 }}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.borderLight}`, display: "flex", gap: 8 }}>
                <input value={cI} onChange={e => setCI(e.target.value)} onKeyDown={e => e.key === "Enter" && sChat()} placeholder="Message..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", background: C.bg, color: C.text }} />
                <button onClick={sChat} style={{ padding: "10px 16px", borderRadius: 12, background: C.blue, border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit" }}>Send</button>
              </div>
            </Card>}

            {/* BOOKING TAB */}
            {tab === "booking" && <div>
              <Card style={{ padding: 16, marginBottom: 14 }} hover={false}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: F, marginBottom: 10 }}>Find & Book</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={bSrch} onChange={e => setBSrch(e.target.value)} placeholder="Search hotels, activities, restaurants..."
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", background: C.bg, color: C.text }} />
                  <button style={{ padding: "10px 18px", borderRadius: 10, background: C.primary, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Search</button>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {["🏨 Hotels", "✈️ Flights", "🎟️ Activities", "🍽️ Restaurants", "🚗 Transfers"].map(t => <Pill key={t} onClick={() => {}}>{t}</Pill>)}
                </div>
              </Card>

              <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Recommended for your trip</div>
              {DEALS.map((d, i) => (
                <Card key={i} style={{ marginBottom: 10, overflow: "hidden" }} onClick={() => window.open(d.url, "_blank")}>
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: "0 0 90px", position: "relative" }}>
                      <Img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", minHeight: 110 }} />
                    </div>
                    <div style={{ flex: 1, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{d.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: d.pColor, padding: "2px 6px", borderRadius: 4 }}>{d.partner}</span>
                            <span style={{ fontSize: 11, color: C.textDim }}>{d.type}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, fontFamily: F }}>{d.price}</div>
                          <div style={{ fontSize: 10, color: C.gold }}>★ {d.rating}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: C.textSec, marginTop: 6, lineHeight: 1.4 }}>{d.desc}</p>
                      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: C.primary }}>View on {d.partner} →</div>
                    </div>
                  </div>
                </Card>
              ))}

              <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, margin: "18px 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Community Reviews</div>
              {REVIEWS.map((r, i) => (
                <Card key={i} style={{ marginBottom: 10, padding: 14 }} hover={false}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{r.place}</span>
                    <span style={{ fontSize: 12, color: C.gold }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)} <span style={{ color: C.text, fontWeight: 600 }}>{r.rating}</span></span>
                  </div>
                  <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5, marginBottom: 6, fontStyle: "italic" }}>"{r.text}"</p>
                  <div style={{ fontSize: 11, color: C.textDim }}>— {r.author} · {r.date}</div>
                </Card>
              ))}
            </div>}

          </div>
        </div>
      )}
    </div>
  );
}
