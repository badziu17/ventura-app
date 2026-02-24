import { useState, useEffect, useRef, useCallback } from "react";
/* ═══════════════════════════════════════════════════════════
   VENTURA v5.0 — Travel Planning App
   New: i18n PL/EN, guest mode, drag-drop itinerary,
   voting, favorites, transport, AI customs/docs/airport,
   car rental, insurance, travel friends, leave tracking,
   planning itinerary builder, overload warnings
   ═══════════════════════════════════════════════════════════ */

// ── i18n ──
const T={
en:{welcome:"Welcome back",planNext:"Plan your next adventure",newTrip:"New Trip",yourTrips:"Your Trips",getInspired:"Get inspired",tripReady:"Trip readiness",complete:"Complete these to prep",currency:"Currency",delete:"Delete",deleteConfirm:"Delete trip",trips:"Trips",selectProfile:"Select profile",demoMode:"Demo mode — pick any user",guestMode:"Continue as Guest",guestNote:"View demo trips & explore. Sign in to save.",signOut:"Sign Out",
packProgress:"Packing Progress",templates:"Templates",saveList:"Save list",loadList:"Load",addItem:"ADD ITEM",category:"Category",itemName:"Item name",add:"Add",dontForget:"Don't forget...",aiSugg:"AI Suggestions",
spent:"Spent",budget:"BUDGET",remaining:"remaining",overBudget:"over budget!",expenses:"Expenses",addExpense:"Add expense",saveExpense:"Save expense",cancel:"Cancel",save:"Save",name:"Name",amount:"Amount",spendOn:"What did you spend on?",spendBreak:"Spending Breakdown",insights:"Insights",biggestExp:"Biggest expense",avgExp:"Avg. per transaction",inBudget:"You're on budget!",overBudgetW:"Over budget by",exchRates:"Exchange rates",exchNote:"Indicative rates. Check before exchanging.",homeCurNote:"Budget currency = home currency",
journal:"Your trip journal",journalPlc:"Write a memory, thought, or note...",post:"Post",
deals:"Recommended Deals",bookDeals:"Booking deals",bookDealsDesc:"AI will suggest deals based on your itinerary.",compareStays:"Compare Stays",compareDesc:"Add Booking.com, Airbnb links. Compare & vote — no more WhatsApp chaos!",proposeName:"Hotel / apartment name",proposeLink:"Booking.com or Airbnb link",proposePrice:"e.g. €75/night",proposeWhy:"Why this place?",addCompare:"Add to comparison",propose:"PROPOSE A STAY",
carRental:"Car Rental",carRentalDesc:"Need a car? Compare prices from top providers.",insurance:"Travel Insurance",insuranceDesc:"Don't travel without coverage. Compare plans.",
noItinerary:"No itinerary yet",switchPlan:"Switch to Plan tab to start building.",memComing:"Memories coming soon",memAfter:"Trip summary appears after the trip ends.",aiTitle:"AI Trip Planner",aiDesc:"Ask me to optimize routes, find restaurants, suggest hidden gems!",
inviteTitle:"Invite to Trip",email:"Email address",role:"Role",companionDesc:"Can edit itinerary, budget, journal.",observerDesc:"View-only access.",sendInvite:"Send Invitation",
profile:"My Profile",profilePhoto:"PROFILE PHOTO",socialMedia:"SOCIAL MEDIA",travelPrefs:"Travel Preferences",tripStats:"Trip Stats",permissions:"Permissions",totalTrips:"Total trips",countries:"Countries",daysTraveled:"Days traveled",
travelFriends:"My Travel Friends",noFriends:"No travel friends yet. Friends are added when you share trips.",
invite:"Invite Someone",travelers:"Travelers",observers:"Observers",
tripMembers:"Trip Members",tripRecap:"Trip Recap",
leaveReq:"Leave Request",leaveNotReq:"Not requested yet",leaveReqSent:"Requested — waiting for approval",leaveApproved:"Approved ✓",
transport:"Getting Around",transportDesc:"Best ways to move around the city",suggested:"Suggested",
customs:"Local Customs",customsDesc:"Tips from AI about local etiquette",
travelDocs:"Travel Documents",docsDesc:"What you need before you go",mszAdvisory:"Travel Advisory",
airportTransfer:"Airport Transfer",airportDesc:"Best ways from airport to your hotel",
vote:"Vote",voted:"Voted",votes:"votes",approve:"Approve",
fav:"Favorite",unfav:"Unfavorite",
overloaded:"Day overloaded!",overloadMsg:"This day has more than 10 hours planned. Consider moving some activities.",
addDay:"Add Day",addActivity:"Add activity",estDuration:"Est. duration (min)",dragHint:"Drag items to reorder",
buildItinerary:"Build Itinerary",buildDesc:"Create a day-by-day plan for your trip.",
guestSaveBlocked:"Sign in to save your plans!",
lang:"Language",langEn:"English",langPl:"Polski"},
pl:{welcome:"Witaj ponownie",planNext:"Zaplanuj kolejną przygodę",newTrip:"Nowa podróż",yourTrips:"Twoje podróże",getInspired:"Inspiracje",tripReady:"Gotowość podróży",complete:"Uzupełnij to przed wyjazdem",currency:"Waluta",delete:"Usuń",deleteConfirm:"Usunąć podróż",trips:"Podróże",selectProfile:"Wybierz profil",demoMode:"Tryb demo — wybierz dowolnego użytkownika",guestMode:"Kontynuuj jako gość",guestNote:"Przeglądaj podróże demo. Zaloguj się, by zapisać.",signOut:"Wyloguj",
packProgress:"Postęp pakowania",templates:"Szablony",saveList:"Zapisz listę",loadList:"Wczytaj",addItem:"DODAJ POZYCJĘ",category:"Kategoria",itemName:"Nazwa rzeczy",add:"Dodaj",dontForget:"Nie zapomnij o...",aiSugg:"Sugestie AI",
spent:"Wydano",budget:"BUDŻET",remaining:"pozostało",overBudget:"ponad budżet!",expenses:"Wydatki",addExpense:"Dodaj wydatek",saveExpense:"Zapisz wydatek",cancel:"Anuluj",save:"Zapisz",name:"Nazwa",amount:"Kwota",spendOn:"Na co wydałeś?",spendBreak:"Podział wydatków",insights:"Wnioski",biggestExp:"Największy wydatek",avgExp:"Średnia na transakcję",inBudget:"Mieścisz się w budżecie!",overBudgetW:"Budżet przekroczony o",exchRates:"Kursy walut",exchNote:"Kursy orientacyjne. Sprawdź przed wymianą.",homeCurNote:"Waluta budżetu = waluta domowa",
journal:"Dziennik podróży",journalPlc:"Zapisz wspomnienie, myśl lub notatkę...",post:"Opublikuj",
deals:"Polecane oferty",bookDeals:"Oferty rezerwacji",bookDealsDesc:"AI zasugeruje oferty na podstawie planu.",compareStays:"Porównaj noclegi",compareDesc:"Dodaj linki z Booking.com, Airbnb. Porównujcie i głosujcie — koniec z chaosem na WhatsAppie!",proposeName:"Nazwa hotelu / apartamentu",proposeLink:"Link z Booking.com lub Airbnb",proposePrice:"np. €75/noc",proposeWhy:"Dlaczego to miejsce?",addCompare:"Dodaj do porównania",propose:"ZAPROPONUJ NOCLEG",
carRental:"Wynajem auta",carRentalDesc:"Potrzebujesz samochodu? Porównaj ceny.",insurance:"Ubezpieczenie podróżne",insuranceDesc:"Nie podróżuj bez ubezpieczenia. Porównaj oferty.",
noItinerary:"Brak planu",switchPlan:"Przejdź do zakładki Plan, aby zacząć.",memComing:"Wspomnienia wkrótce",memAfter:"Podsumowanie pojawi się po zakończeniu podróży.",aiTitle:"AI Planner",aiDesc:"Zoptymalizuj trasy, znajdź restauracje, odkryj ukryte perełki!",
inviteTitle:"Zaproś do podróży",email:"Adres e-mail",role:"Rola",companionDesc:"Może edytować plan, budżet, dziennik.",observerDesc:"Tylko podgląd.",sendInvite:"Wyślij zaproszenie",
profile:"Mój profil",profilePhoto:"ZDJĘCIE PROFILOWE",socialMedia:"SOCIAL MEDIA",travelPrefs:"Preferencje podróżne",tripStats:"Statystyki",permissions:"Uprawnienia",totalTrips:"Podróże łącznie",countries:"Kraje",daysTraveled:"Dni podróży",
travelFriends:"Moi towarzysze podróży",noFriends:"Brak jeszcze towarzyszy. Dodaj ich udostępniając podróż.",
invite:"Zaproś kogoś",travelers:"Podróżnicy",observers:"Obserwatorzy",
tripMembers:"Uczestnicy podróży",tripRecap:"Podsumowanie podróży",
leaveReq:"Wniosek urlopowy",leaveNotReq:"Jeszcze nie złożony",leaveReqSent:"Złożony — czeka na akceptację",leaveApproved:"Zaakceptowany ✓",
transport:"Jak się poruszać",transportDesc:"Najlepsze sposoby poruszania się po mieście",suggested:"Polecane",
customs:"Lokalne zwyczaje",customsDesc:"Wskazówki AI o etykiecie i kulturze",
travelDocs:"Dokumenty podróżne",docsDesc:"Co musisz przygotować przed wyjazdem",mszAdvisory:"Zalecenia MSZ",
airportTransfer:"Transfer z lotniska",airportDesc:"Najlepsze sposoby dotarcia z lotniska do hotelu",
vote:"Głosuj",voted:"Zagłosowano",votes:"głosów",approve:"Zatwierdź",
fav:"Ulubione",unfav:"Usuń z ulubionych",
overloaded:"Dzień przeładowany!",overloadMsg:"Ten dzień ma ponad 10h zaplanowanych. Rozważ przeniesienie aktywności.",
addDay:"Dodaj dzień",addActivity:"Dodaj aktywność",estDuration:"Szac. czas trwania (min)",dragHint:"Przeciągnij elementy, aby zmienić kolejność",
buildItinerary:"Stwórz plan",buildDesc:"Zaplanuj każdy dzień podróży.",
guestSaveBlocked:"Zaloguj się, aby zapisać plany!",
lang:"Język",langEn:"English",langPl:"Polski"}};

// ── Design Tokens ──
const C={bg:"#FEFBF6",bgAlt:"#F7F3ED",white:"#FFFFFF",border:"#E8E2D9",borderLight:"#F0EBE3",primary:"#C4704B",primaryLight:"#F9EDE7",primaryDark:"#A85A38",blue:"#2563EB",blueLight:"#EFF6FF",sage:"#5F8B6A",sageLight:"#ECF4EE",coral:"#E8734A",coralLight:"#FEF0EB",gold:"#D4A853",goldLight:"#FDF8EC",purple:"#7C5CFC",purpleLight:"#F3F0FF",text:"#2C1810",textSec:"#6B5B4F",textDim:"#A09486",danger:"#DC3545",shadow:"0 1px 3px rgba(44,24,16,0.06),0 4px 12px rgba(44,24,16,0.04)",shadowMd:"0 2px 8px rgba(44,24,16,0.08),0 8px 24px rgba(44,24,16,0.06)"};
const F="'Fraunces',serif";const fmt=n=>n!=null?n.toLocaleString("en",{maximumFractionDigits:0}):"0";
const CURS=["PLN","EUR","RON","USD","GBP","CZK","JPY","CHF"];
const CAT_I={Accommodation:"🏨",Food:"🍽️",Activities:"🎟️",Shopping:"🛍️",Transport:"🚗",Other:"💰"};
const CAT_C={Accommodation:"#2563EB",Food:"#E8734A",Activities:"#7C5CFC",Shopping:"#D4A853",Transport:"#5F8B6A",Other:"#A09486"};
const RATES={"PLN":{"EUR":0.234,"RON":1.17,"USD":0.253,"GBP":0.199,"CZK":5.87,"JPY":38.5,"CHF":0.218},"EUR":{"PLN":4.28,"RON":4.97,"USD":1.08,"GBP":0.855,"CZK":25.1,"JPY":164.5,"CHF":0.935},"RON":{"PLN":0.856,"EUR":0.201,"USD":0.217,"GBP":0.172,"CZK":5.05,"JPY":33.1,"CHF":0.188},"USD":{"PLN":3.95,"EUR":0.925,"RON":4.61,"GBP":0.79,"CZK":23.3,"JPY":152.5,"CHF":0.866},"GBP":{"PLN":5.02,"EUR":1.17,"RON":5.83,"USD":1.27,"CZK":29.4,"JPY":193,"CHF":1.10},"JPY":{"PLN":0.026,"EUR":0.00608,"RON":0.0302,"USD":0.00656,"GBP":0.00518,"CZK":0.153,"CHF":0.00569},"CHF":{"PLN":4.58,"EUR":1.07,"RON":5.32,"USD":1.155,"GBP":0.912,"CZK":26.8,"JPY":176}};
const getRate=(f,t)=>{if(f===t)return 1;return RATES[f]?.[t]||1};
const DEST_CUR={"Romania":"RON","Japan":"JPY","Portugal":"EUR","Spain":"EUR","Italy":"EUR","Morocco":"MAD","Czech":"CZK","France":"EUR","Germany":"EUR","UK":"GBP","USA":"USD","Switzerland":"CHF"};
const getDestCur=d=>{if(!d)return"EUR";for(const[c,cur]of Object.entries(DEST_CUR)){if(d.includes(c))return cur}return"EUR"};

// ── Transport info per city ──
const CITY_TRANSPORT={"Bucharest, Romania":{best:["Metro","Bus","Walk"],tips:"Metro is fastest and cheapest. Bolt/Uber are very affordable (~€3-5 rides). Old Town is very walkable. Avoid driving — traffic is heavy.",airport:"Henri Coandă (OTP) → City: Express Bus 783 (€1, 40min), Taxi (~€15, 30min), Bolt (~€10)."},"Tokyo, Japan":{best:["Metro","Walk","Train"],tips:"Get a Suica/Pasmo IC card for all transit. Metro+JR trains cover everything. Taxis are expensive. Walking is great in each district. Cycling available with rental apps.",airport:"Narita (NRT): Narita Express (¥3,250, 60min), Limousine Bus (¥3,200). Haneda (HND): Monorail (¥500, 18min), Keikyu Line (¥300, 20min)."},"Lisbon, Portugal":{best:["Metro","Tram","Walk"],tips:"Get a Viva Viagem card for metro+bus+tram. Tram 28 is iconic but crowded — take it early. Hills make walking tiring but rewarding. Bolt is cheap.",airport:"Lisbon (LIS): Metro Red Line (€1.50, 25min) directly to center. Aerobus (€4, 30min). Bolt/Uber (~€10, 20min)."}};

// ── Local customs ──
const LOCAL_CUSTOMS={"Bucharest, Romania":["Tipping 10% is customary in restaurants","Romanian is the local language — \"Mulțumesc\" means thank you","Tap water is safe to drink","Shops close early on Sundays","Romanians are very hospitable and may insist on treating you"],"Tokyo, Japan":["No eating while walking — it's considered rude","There are very few public trash cans — carry your trash","Bow when greeting people","Remove shoes when entering homes, temples, some restaurants","Tipping is NOT customary and can be offensive","Trains are very quiet — no phone calls allowed","Cash is still king in many places"],"Lisbon, Portugal":["Lunch is the main meal (12:30-14:00)","Tipping 5-10% is appreciated but not mandatory","\"Obrigado/a\" means thank you (masculine/feminine)","Shops close for lunch in smaller areas","Fado music is a UNESCO tradition — attend a Fado house"]};

// ── Travel documents / MSZ info ──
const TRAVEL_DOCS={"Romania":{visa:"EU/EEA citizens: No visa needed (ID card sufficient). Non-EU: Check embassy.",docs:["ID card or passport","EHIC / EKUZ health card","Travel insurance (recommended)","Hotel booking confirmation"],advisory:"🟢 No special MSZ warnings. Standard travel precautions apply."},"Japan":{visa:"EU citizens: Visa-free for 90 days with passport. Passport must be valid 6+ months.",docs:["Valid passport (6+ months)","Return ticket","Proof of accommodation","Travel insurance (strongly recommended)","Visit Japan Web registration (customs)"],advisory:"🟢 Safe destination. Be aware of earthquake procedures. Follow local authorities during natural events."},"Portugal":{visa:"EU/EEA citizens: No visa needed (ID card sufficient). Non-EU: Schengen rules apply.",docs:["ID card or passport","EHIC / EKUZ health card","Travel insurance (recommended)"],advisory:"🟢 No special warnings. Watch for pickpockets in tourist areas in Lisbon."}};
const getCountry=d=>{if(!d)return"";const parts=d.split(",");return(parts[parts.length-1]||"").trim()};

// ── Photos ──
const DEST_PHOTOS={"Bucharest, Romania":["https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1585407925232-33158f7be498?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=800&h=400&fit=crop&q=80"],"Tokyo, Japan":["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=400&fit=crop&q=80"],"Lisbon, Portugal":["https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1536663815808-535e2280d2c2?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=400&fit=crop&q=80"]};
const INSP=[{name:"Kyoto",img:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=240&h=320&fit=crop&q=80"},{name:"Barcelona",img:"https://images.unsplash.com/photo-1583422409516-2895a77efded?w=240&h=320&fit=crop&q=80"},{name:"Iceland",img:"https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=240&h=320&fit=crop&q=80"},{name:"Amalfi",img:"https://images.unsplash.com/photo-1533606688076-b6683a5103a4?w=240&h=320&fit=crop&q=80"},{name:"Morocco",img:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=240&h=320&fit=crop&q=80"}];

// ── Packing ──
const PACK_TPL=[{id:"winter",name:"Winter City",icon:"❄️",items:{"Clothing":[{item:"Warm jacket",qty:1},{item:"Sweaters",qty:3},{item:"Thermal underwear",qty:2},{item:"Scarf & gloves",qty:1},{item:"Walking boots",qty:1}],"Toiletries":[{item:"Hand cream",qty:1},{item:"Lip balm",qty:1},{item:"Toothbrush",qty:1}],"Electronics":[{item:"Phone charger",qty:1},{item:"Power bank",qty:1},{item:"Adapter",qty:1}],"Documents":[{item:"ID/Passport",qty:1},{item:"Booking confirmations",qty:1},{item:"Travel insurance",qty:1}]}},{id:"summer",name:"Summer Beach",icon:"☀️",items:{"Clothing":[{item:"T-shirts",qty:5},{item:"Shorts",qty:3},{item:"Swimsuit",qty:2},{item:"Sandals",qty:1}],"Beach":[{item:"Sunscreen SPF50",qty:1},{item:"Sunglasses",qty:1},{item:"Beach towel",qty:1}],"Electronics":[{item:"Phone charger",qty:1},{item:"Waterproof case",qty:1}],"Documents":[{item:"ID/Passport",qty:1},{item:"Confirmations",qty:1}]}},{id:"backpack",name:"Backpacking",icon:"🎒",items:{"Clothing":[{item:"Quick-dry shirts",qty:4},{item:"Hiking pants",qty:2},{item:"Rain jacket",qty:1},{item:"Hiking boots",qty:1}],"Gear":[{item:"Daypack",qty:1},{item:"Water bottle",qty:1},{item:"First aid kit",qty:1},{item:"Headlamp",qty:1}],"Electronics":[{item:"Charger",qty:1},{item:"Power bank",qty:1},{item:"Universal adapter",qty:1}]}}];
const AI_SUGG=["Universal adapter","Reusable water bottle","Portable umbrella","Travel pillow","Ziplock bags","Snacks for flight","Hand sanitizer","Offline maps","Local eSIM","Pen for customs","Mini first aid kit","Earplugs & eye mask"];
const DONT_FORGET={"en":["🛂 Passport/ID — check expiry!","🔌 Phone charger + power bank","📋 Travel insurance docs","💊 Prescription medications","📱 Offline copies of bookings","🏦 Notify bank about travel","💳 Card with no foreign fees"],"pl":["🛂 Paszport/dowód — sprawdź ważność!","🔌 Ładowarka + power bank","📋 Dokumenty ubezpieczenia","💊 Leki na receptę","📱 Offline kopie rezerwacji","🏦 Powiadom bank o podróży","💳 Karta bez opłat zagranicznych"]};

// ── Car rental & insurance providers ──
const CAR_RENTALS=[{name:"Discover Cars",url:"https://www.discovercars.com",desc:"Compare 500+ providers"},{name:"Rentalcars.com",url:"https://www.rentalcars.com",desc:"Booking.com subsidiary"},{name:"AutoEurope",url:"https://www.autoeurope.com",desc:"Best for Europe"}];
const INSURANCE=[{name:"World Nomads",url:"https://www.worldnomads.com",desc:"Backpackers & adventurers"},{name:"SafetyWing",url:"https://www.safetywing.com",desc:"Nomad insurance from €42/mo"},{name:"Allianz Travel",url:"https://www.allianztravelinsurance.com",desc:"Comprehensive plans"},{name:"Signal Iduna",url:"https://www.signal-iduna.pl",desc:"Popular in Poland"}];

// ── Roles ──
const ROLES={admin:{label:"Admin",color:C.danger,perms:["edit_trip","manage_users","delete_trip","invite","edit_budget","journal","view_all"]},user:{label:"Traveler",color:C.blue,perms:["edit_trip","invite","edit_budget","journal","view_all"]},companion:{label:"Companion",color:C.sage,perms:["edit_trip","edit_budget","journal","view_all"]},observer:{label:"Observer",color:C.gold,perms:["view_all"]},guest:{label:"Guest",color:C.textDim,perms:["view_all"]}};
// ── Users ──
const USERS_INIT=[
{id:"u1",name:"Bartek",email:"bartek@ventura.app",color:C.blue,role:"admin",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},prefs:{currency:"PLN",dietaryNeeds:"None",travelStyle:"Cultural Explorer",languages:["PL","EN","JP"],homeAirport:"GDN"}},
{id:"u2",name:"Anna",email:"anna@ventura.app",color:C.coral,role:"user",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},prefs:{currency:"PLN",dietaryNeeds:"Vegetarian",travelStyle:"Foodie & Culture",languages:["PL","EN"],homeAirport:"GDN"}},
{id:"u3",name:"Marek",email:"marek@gmail.com",color:C.purple,role:"user",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},prefs:{currency:"PLN",travelStyle:"Adventurer",languages:["PL","EN"],homeAirport:"WAW"}}];

// ── Trips ──
const INIT_TRIPS=[
{id:"bucharest",name:"Bucharest Discovery",dest:"Bucharest, Romania",dates:"Mar 7 – 9, 2026",travelers:["u1","u2"],observers:["u3"],days:3,status:"upcoming",currency:"RON",
heroImg:"https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=280&fit=crop&q=80",
budget:{total:3500},completeness:92,leaveStatus:"approved",
journal:[{id:"j1",date:"Feb 28",author:"u1",type:"text",content:"Booked the Transylvania day tour! Can't wait to see Peleș Castle."},{id:"j2",date:"Mar 1",author:"u2",type:"text",content:"Packed my camera — bringing 35mm and 85mm lenses."}],
memories:null,
comparisons:[{id:"c1",name:"Marmorosch Bucharest",url:"https://www.booking.com/hotel/ro/marmorosch-bucharest-autograph-collection.html",price:"€89/night",rating:"9.1",source:"Booking.com",proposedBy:"u1",notes:"Autograph Collection, Old Town location. Rooftop bar!",pros:["Central","Rooftop bar","Historic"],cons:["Pricey","No pool"],votes:["u1","u2"]},{id:"c2",name:"Old Town Studio Apt",url:"https://www.airbnb.com/rooms/example",price:"€52/night",rating:"4.7",source:"Airbnb",proposedBy:"u2",notes:"Kitchen + washer, quiet street near Lipscani.",pros:["Kitchen","Cheaper","Local vibe"],cons:["No reception","5th floor walk-up"],votes:["u2"]}],
dayData:[
{day:1,date:"Sat, Mar 7",title:"Historic Center Walk",img:"https://images.unsplash.com/photo-1585407925232-33158f7be498?w=600&h=200&fit=crop&q=80",weather:{hi:12,lo:4,icon:"sun"},items:[
{time:"09:00",name:"Ogrody Cismigiu",desc:"Oldest park in Bucharest",type:"sight",duration:"60min",durationMin:60,cost:0,rating:4.5,votes:[],fav:[]},
{time:"10:15",name:"Palatul Kretzulescu",type:"sight",duration:"30min",durationMin:30,cost:0,rating:4.3,votes:["u1"],fav:[]},
{time:"12:00",name:"Lunch: Caru' cu Bere",desc:"Iconic 1879 beer hall",type:"food",duration:"90min",durationMin:90,cost:120,rating:4.4,votes:["u1","u2"],fav:["u1"]},
{time:"14:00",name:"Muzeum Sztuki",desc:"National Art Museum",type:"museum",duration:"120min",durationMin:120,cost:30,rating:4.5,votes:["u1"],fav:[]},
{time:"16:30",name:"Ateneul Roman",desc:"1888 concert hall",type:"sight",duration:"45min",durationMin:45,cost:25,rating:4.8,votes:["u1","u2"],fav:["u1","u2"]},
{time:"20:15",name:"Dinner: Grand Cafe Van Gogh",type:"food",duration:"90min",durationMin:90,cost:180,rating:4.3,votes:["u1"],fav:[]}]},
{day:2,date:"Sun, Mar 8",title:"Castles of Transylvania",img:"https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=600&h=200&fit=crop&q=80",weather:{hi:9,lo:1,icon:"cloud"},items:[
{time:"07:00",name:"Departure to Sinaia",type:"transport",duration:"120min",durationMin:120,cost:0,votes:[],fav:[]},
{time:"09:30",name:"Castelul Peles",desc:"Neo-Renaissance palace",type:"sight",duration:"120min",durationMin:120,cost:80,rating:4.8,votes:["u1","u2"],fav:["u1"]},
{time:"12:00",name:"Lunch in Sinaia",type:"food",duration:"60min",durationMin:60,cost:90,rating:4.2,votes:[],fav:[]},
{time:"13:30",name:"Castelul Bran",desc:"Dracula's castle",type:"sight",duration:"90min",durationMin:90,cost:60,rating:4.3,votes:["u1"],fav:[]},
{time:"15:30",name:"Brasov Old Town",type:"sight",duration:"120min",durationMin:120,cost:15,rating:4.6,votes:["u1","u2"],fav:["u2"]},
{time:"18:00",name:"Return to Bucharest",type:"transport",duration:"150min",durationMin:150,cost:0,votes:[],fav:[]}]},
{day:3,date:"Mon, Mar 9",title:"Parliament & Farewell",img:"https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&h=200&fit=crop&q=80",weather:{hi:14,lo:5,icon:"partlysunny"},items:[
{time:"10:00",name:"Palatul Parlamentului",desc:"World's 2nd largest building",type:"sight",duration:"120min",durationMin:120,cost:50,rating:4.6,votes:["u1","u2"],fav:["u1"]},
{time:"13:15",name:"Lacrimi si Sfinti",desc:"Award-winning Romanian",type:"food",duration:"90min",durationMin:90,cost:150,rating:4.6,votes:["u1","u2"],fav:["u1","u2"]},
{time:"15:00",name:"Calea Victoriei",type:"sight",duration:"60min",durationMin:60,cost:25,rating:4.5,votes:[],fav:[]},
{time:"17:30",name:"Bolt to Airport",type:"transport",duration:"45min",durationMin:45,cost:60,votes:[],fav:[]}]}],
expenses:[{id:1,name:"Hotel Marmorosch",cat:"Accommodation",amount:1200,currency:"RON",payer:"u1",date:"Mar 7"},{id:2,name:"Caru' cu Bere",cat:"Food",amount:120,currency:"RON",payer:"u2",date:"Mar 7"},{id:3,name:"Museum tickets",cat:"Activities",amount:55,currency:"RON",payer:"u1",date:"Mar 7"},{id:4,name:"Transylvania tour",cat:"Activities",amount:600,currency:"RON",payer:"u1",date:"Mar 8"},{id:5,name:"Lacrimi si Sfinti",cat:"Food",amount:150,currency:"RON",payer:"u1",date:"Mar 9"},{id:6,name:"Bolt to airport",cat:"Transport",amount:60,currency:"RON",payer:"u1",date:"Mar 9"}],
packing:{"Clothing":[{item:"Warm layers",qty:3,packed:true},{item:"Winter jacket",qty:1,packed:true},{item:"Walking shoes",qty:1,packed:true},{item:"Scarf & gloves",qty:1,packed:false}],"Electronics":[{item:"Phone chargers",qty:2,packed:true},{item:"Power bank",qty:1,packed:true},{item:"EU adapter",qty:1,packed:false}],"Documents":[{item:"ID cards",qty:2,packed:false},{item:"Booking confirmations",qty:1,packed:false},{item:"Castle tickets",qty:2,packed:false}]},
deals:[{name:"Marmorosch Bucharest",price:"€89/night",partner:"Booking.com",pColor:"#003580",url:"https://www.booking.com/hotel/ro/marmorosch-bucharest-autograph-collection.html"},{name:"Transylvania Day Tour",price:"€45/pp",partner:"GetYourGuide",pColor:"#FF5533",url:"https://www.getyourguide.com/bucharest-l347/"},{name:"Parliament Skip-the-Line",price:"€12/pp",partner:"Viator",pColor:"#5B1FA8",url:"https://www.viator.com/tours/Bucharest/"}]},
{id:"japan",name:"Tokyo Adventure",dest:"Tokyo, Japan",dates:"May 10 – 18, 2026",travelers:["u1","u2"],observers:[],days:8,status:"planning",currency:"JPY",
heroImg:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=280&fit=crop&q=80",
budget:{total:15000},completeness:28,leaveStatus:"requested",journal:[],memories:null,dayData:[],expenses:[],packing:{},deals:[],comparisons:[],
planningTips:[{icon:"🏨",title:"Book accommodation",desc:"8 nights — Shinjuku or Shibuya.",done:false,priority:"high"},{icon:"✈️",title:"Book flights GDN → NRT",desc:"LOT via WAW or Finnair via HEL.",done:false,priority:"high"},{icon:"🚄",title:"Get Japan Rail Pass",done:false,priority:"medium"},{icon:"📱",title:"Order eSIM",done:false,priority:"medium"},{icon:"🗺️",title:"Plan daily itinerary",done:false,priority:"medium"},{icon:"🍣",title:"Restaurant reservations",done:false,priority:"low"},{icon:"🎒",title:"Create packing list",done:false,priority:"low"}]},
{id:"lisbon",name:"Lisbon & Sintra",dest:"Lisbon, Portugal",dates:"Sep 12 – 16, 2025",travelers:["u1","u2"],observers:[],days:5,status:"past",currency:"EUR",
heroImg:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=280&fit=crop&q=80",
budget:{total:5000},completeness:100,leaveStatus:"approved",
journal:[{id:"lj1",date:"Sep 12",author:"u1",type:"text",content:"Golden hour over the Tagus from Alfama."},{id:"lj2",date:"Sep 13",author:"u2",type:"text",content:"Sintra was a fairytale!"}],
memories:{totalSpent:4650,topMoments:["Sunset from Miradouro da Graça","Pastéis de Belém at 8am","Pena Palace gardens","LX Factory bookshop"],stats:{stepsTaken:"78,400",photosShared:142,placesVisited:28,mealsEaten:15},highlights:[{title:"Best meal",value:"Cervejaria Ramiro — garlic prawns",icon:"🍽️"},{title:"Most walked day",value:"Day 2: Sintra — 22,800 steps",icon:"🚶"},{title:"Best photo spot",value:"Miradouro da Senhora do Monte",icon:"📸"},{title:"Biggest surprise",value:"LX Factory",icon:"✨"}],budgetSummary:{planned:5000,actual:4650,underBudget:true}},
comparisons:[],
dayData:[{day:1,date:"Fri, Sep 12",title:"Arrival & Alfama",img:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=200&fit=crop&q=80",weather:{hi:28,lo:18,icon:"sun"},items:[{time:"15:00",name:"Miradouro da Graça",type:"sight",duration:"45min",durationMin:45,cost:0,rating:4.8,votes:["u1","u2"],fav:["u1"]},{time:"19:00",name:"Taberna da Rua das Flores",type:"food",duration:"120min",durationMin:120,cost:120,rating:4.6,votes:["u1","u2"],fav:["u1","u2"]}]}],
expenses:[{id:1,name:"Hotel Alfama",cat:"Accommodation",amount:1800,currency:"EUR",payer:"u1",date:"Sep 12"},{id:2,name:"Cervejaria Ramiro",cat:"Food",amount:180,currency:"EUR",payer:"u2",date:"Sep 14"}],packing:{},deals:[]}];
// ═══ COMPONENTS ═══
const tE={sight:"📍",food:"🍽️",museum:"🖼️",shopping:"🛍️",transport:"🚌"};
const WI=({t})=>t==="sun"?<span>☀️</span>:t==="cloud"?<span>⛅</span>:t==="rain"?<span>🌧️</span>:<span>🌤️</span>;
const Pill=({children,color=C.primary,active,onClick})=><button onClick={onClick} style={{padding:"7px 16px",borderRadius:99,fontSize:13,fontWeight:500,background:active?color:"transparent",color:active?"#fff":C.textSec,border:active?"none":`1.5px solid ${C.border}`,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit",whiteSpace:"nowrap"}}>{children}</button>;
const Card=({children,style:sx,onClick,hover=true})=><div onClick={onClick} style={{background:C.white,borderRadius:16,border:`1px solid ${C.borderLight}`,boxShadow:C.shadow,transition:"all 0.2s",cursor:onClick?"pointer":"default",...sx}} onMouseEnter={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadowMd;e.currentTarget.style.transform="translateY(-1px)"}}} onMouseLeave={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform="translateY(0)"}}}>{children}</div>;
const Bar=({v,mx,color=C.primary,h=6})=><div style={{width:"100%",height:h,background:C.bgAlt,borderRadius:h,overflow:"hidden"}}><div style={{width:`${Math.min(v/mx*100,100)}%`,height:h,borderRadius:h,background:v>mx?C.danger:color,transition:"width 0.6s"}}/></div>;
const Av=({user,size=32})=>{if(user?.photoUrl)return<img src={user.photoUrl} alt="" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`2px solid ${user.color||C.border}`}}/>;return<div style={{width:size,height:size,borderRadius:"50%",background:user?.color||C.textDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,fontWeight:700,color:"#fff",flexShrink:0}}>{(user?.name||"?")[0]}</div>};
const Img=({src,alt,style:sx})=>{const[e,setE]=useState(false);if(e)return<div style={{...sx,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim}}>🗺️</div>;return<img src={src} alt={alt||""} style={{objectFit:"cover",display:"block",...sx}} onError={()=>setE(true)}/>};
// Swipeable Photo Carousel
const PhotoSlider=({dest})=>{const photos=DEST_PHOTOS[dest]||[];const[idx,setIdx]=useState(0);const tRef=useRef(null);useEffect(()=>{if(photos.length<2)return;const t=setInterval(()=>setIdx(p=>(p+1)%photos.length),4500);return()=>clearInterval(t)},[photos.length]);const onTS=e=>{tRef.current=e.touches[0].clientX};const onTE=e=>{if(tRef.current===null)return;const dx=e.changedTouches[0].clientX-tRef.current;if(Math.abs(dx)>40)setIdx(p=>dx<0?(p+1)%photos.length:(p-1+photos.length)%photos.length);tRef.current=null};if(!photos.length)return<div style={{height:150,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,borderRadius:"0 0 16px 16px"}}/>;return(<div style={{position:"relative",height:150,overflow:"hidden",borderRadius:"0 0 16px 16px",touchAction:"pan-y"}} onTouchStart={onTS} onTouchEnd={onTE}>{photos.map((p,i)=><img key={i} src={p} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.8s",opacity:i===idx?1:0}}/>)}<div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.5) 0%,transparent 50%)"}}/><div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>{photos.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{width:i===idx?16:6,height:6,borderRadius:3,background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"all 0.3s",cursor:"pointer"}}/>)}</div><div style={{position:"absolute",top:"50%",left:8,transform:"translateY(-50%)",cursor:"pointer",background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}} onClick={e=>{e.stopPropagation();setIdx(p=>(p-1+photos.length)%photos.length)}}>‹</div><div style={{position:"absolute",top:"50%",right:8,transform:"translateY(-50%)",cursor:"pointer",background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}} onClick={e=>{e.stopPropagation();setIdx(p=>(p+1)%photos.length)}}>›</div></div>)};
// Donut Pie Chart
const Pie=({data,size=140,currency})=>{let tot=data.reduce((s,d)=>s+d.value,0);if(!tot)return null;let cum=0;const sl=data.map(d=>{const st=cum/tot*360;cum+=d.value;return{...d,st,en:cum/tot*360}});const xy=(a,r)=>({x:50+r*Math.cos((a-90)*Math.PI/180),y:50+r*Math.sin((a-90)*Math.PI/180)});return(<svg viewBox="0 0 100 100" width={size} height={size}>{sl.map((s,i)=>{const lg=(s.en-s.st)>180?1:0;const p1=xy(s.st,42),p2=xy(s.en,42);if(s.en-s.st>=359.9)return<circle key={i} cx="50" cy="50" r="42" fill={s.color}/>;return<path key={i} d={`M50,50 L${p1.x},${p1.y} A42,42 0 ${lg},1 ${p2.x},${p2.y} Z`} fill={s.color}/>})}<circle cx="50" cy="50" r="26" fill={C.white}/><text x="50" y="47" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.text}>{fmt(tot)}</text><text x="50" y="56" textAnchor="middle" fontSize="5" fill={C.textDim}>{currency||""}</text></svg>)};
const Modal=({open,onClose,title,children,wide})=>{if(!open)return null;return(<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}><div style={{position:"absolute",inset:0,background:"rgba(44,24,16,0.4)",backdropFilter:"blur(4px)"}}/><div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.white,borderRadius:20,boxShadow:C.shadowMd,width:"100%",maxWidth:wide?600:480,maxHeight:"85vh",overflow:"auto",animation:"fadeUp 0.25s ease"}}><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.white,zIndex:1,borderRadius:"20px 20px 0 0"}}><span style={{fontSize:16,fontWeight:700,fontFamily:F}}>{title}</span><button onClick={onClose} style={{width:28,height:28,borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:14,color:C.textDim}}>✕</button></div><div style={{padding:20}}>{children}</div></div></div>)};
// ═══ MAIN APP ═══
export default function Ventura(){
const[lang,setLang]=useState("pl");const t=T[lang];
const[loggedIn,setLoggedIn]=useState(false);const[isGuest,setIsGuest]=useState(false);
const[currentUser,setCurrentUser]=useState(null);const[users,setUsers]=useState(USERS_INIT);
const[scr,setScr]=useState("home");const[tab,setTab]=useState("trip");const[activeTrip,setActiveTrip]=useState(null);
const[trips,setTrips]=useState(INIT_TRIPS);const[savedLists,setSavedLists]=useState([]);
const[showWiz,setShowWiz]=useState(false);const[showInv,setShowInv]=useState(false);const[showProf,setShowProf]=useState(false);const[showTrav,setShowTrav]=useState(false);
const[eDays,setEDays]=useState({});const[eItem,setEItem]=useState(null);const[eBgt,setEBgt]=useState(false);const[bIn,setBIn]=useState("");const[jIn,setJIn]=useState("");
const[wStep,setWStep]=useState(0);const[wData,setWData]=useState({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"});
const[invEmail,setInvEmail]=useState("");const[invRole,setInvRole]=useState("companion");
const[packCat,setPackCat]=useState("");const[packItem,setPackItem]=useState("");const[showTpl,setShowTpl]=useState(false);
const[showSavePack,setShowSavePack]=useState(false);const[savePackName,setSavePackName]=useState("");const[showLoadPack,setShowLoadPack]=useState(false);
const[editExp,setEditExp]=useState(null);const[editExpD,setEditExpD]=useState({});const[newExpOpen,setNewExpOpen]=useState(false);const[newExp,setNewExp]=useState({name:"",cat:"Food",amount:"",currency:""});
const[editCur,setEditCur]=useState(false);const[compIn,setCompIn]=useState({name:"",url:"",price:"",notes:""});
const[dragItem,setDragItem]=useState(null);// drag state: {dayIdx, itemIdx}
const[addActDay,setAddActDay]=useState(null);const[newAct,setNewAct]=useState({name:"",type:"sight",time:"10:00",durationMin:60,cost:0,desc:""});

const trip=activeTrip?trips.find(t=>t.id===activeTrip):null;
const getU=id=>users.find(u=>u.id===id)||{name:"?",color:C.textDim};
const uRole=trip?(trip.travelers.includes(currentUser?.id)?(currentUser?.role||"user"):trip.observers?.includes(currentUser?.id)?"observer":"guest"):"user";
const canE=!isGuest&&["admin","user","companion"].includes(uRole);
const upT=(id,fn)=>setTrips(p=>p.map(t=>t.id===id?fn(t):t));
const delT=id=>{setTrips(p=>p.filter(t=>t.id!==id));setActiveTrip(null);setScr("home")};
const getDayMin=items=>(items||[]).reduce((s,it)=>s+(it.durationMin||60),0);

// ── Login Screen ──
if(!loggedIn)return(
<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.primaryLight} 0%,${C.bg} 40%,${C.blueLight} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito Sans',sans-serif",padding:20}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
<Card style={{width:"100%",maxWidth:400,padding:32,textAlign:"center",animation:"fadeUp 0.5s"}} hover={false}>
<div style={{fontSize:40,fontWeight:800,fontFamily:F,color:C.primary,marginBottom:4}}>V</div>
<div style={{fontSize:22,fontWeight:800,fontFamily:F,marginBottom:4}}>Ventura</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:20}}>Your intelligent travel companion</p>
{/* Language switch */}
<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20}}><Pill active={lang==="pl"} onClick={()=>setLang("pl")}>🇵🇱 Polski</Pill><Pill active={lang==="en"} onClick={()=>setLang("en")}>🇬🇧 English</Pill></div>
<div style={{fontSize:12,fontWeight:600,color:C.textDim,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t.selectProfile}</div>
{users.map(u=>(<div key={u.id} onClick={()=>{setCurrentUser(u);setLoggedIn(true);setIsGuest(false)}} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderRadius:12,border:`1.5px solid ${C.border}`,marginBottom:8,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.background=C.primaryLight}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent"}}>
<Av user={u} size={36}/><div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div></div>
<span style={{fontSize:10,fontWeight:700,color:ROLES[u.role].color,background:`${ROLES[u.role].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{ROLES[u.role].label}</span></div>))}
{/* Guest login */}
<div style={{borderTop:`1px solid ${C.borderLight}`,marginTop:12,paddingTop:12}}>
<button onClick={()=>{setCurrentUser({id:"guest",name:"Guest",email:"",color:C.textDim,role:"guest",prefs:{currency:"EUR"},social:{}});setLoggedIn(true);setIsGuest(true)}} style={{width:"100%",padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>{t.guestMode}</button>
<p style={{fontSize:11,color:C.textDim,marginTop:6}}>{t.guestNote}</p></div>
</Card></div>);

// ── Tabs ──
const getTabs=()=>{if(!trip)return[];
if(trip.status==="past")return[{id:"memories",l:"✨",n:lang==="pl"?"Wspomnienia":"Memories"},{id:"trip",l:"🗺️",n:lang==="pl"?"Plan":"Itinerary"},{id:"journal",l:"📓",n:lang==="pl"?"Dziennik":"Journal"},{id:"budget",l:"💰",n:lang==="pl"?"Budżet":"Budget"}];
if(trip.status==="planning")return[{id:"plan",l:"📋",n:"Plan"},{id:"trip",l:"🗺️",n:lang==="pl"?"Zaplanuj":"Build"},{id:"packing",l:"🎒",n:"Pack"},{id:"journal",l:"📓",n:lang==="pl"?"Dziennik":"Journal"},{id:"budget",l:"💰",n:lang==="pl"?"Budżet":"Budget"},{id:"booking",l:"🔖",n:"Book"}];
return[{id:"trip",l:"🗺️",n:"Trip"},{id:"ai",l:"✨",n:"AI"},{id:"packing",l:"🎒",n:"Pack"},{id:"journal",l:"📓",n:lang==="pl"?"Dziennik":"Journal"},{id:"budget",l:"💰",n:lang==="pl"?"Budżet":"Budget"},{id:"booking",l:"🔖",n:"Book"}]};

const createTrip=()=>{if(isGuest){alert(t.guestSaveBlocked);return}const id="trip_"+Date.now();setTrips(p=>[...p,{id,name:wData.name||`${wData.dest} Trip`,dest:wData.dest,dates:`${wData.startDate} – ${wData.endDate}`,travelers:[currentUser.id],observers:[],days:0,status:"planning",currency:getDestCur(wData.dest),heroImg:"",budget:{total:0},completeness:5,leaveStatus:"none",journal:[],memories:null,dayData:[],expenses:[],packing:{},deals:[],comparisons:[],planningTips:[{icon:"🏨",title:lang==="pl"?"Zarezerwuj nocleg":"Book accommodation",done:false,priority:"high"},{icon:"✈️",title:lang==="pl"?"Zarezerwuj loty":"Book flights",done:false,priority:"high"},{icon:"🗺️",title:lang==="pl"?"Zaplanuj trasę":"Plan itinerary",done:false,priority:"medium"},{icon:"🎒",title:lang==="pl"?"Spakuj się":"Create packing list",done:false,priority:"low"}]}]);setActiveTrip(id);setScr("trip");setTab("plan");setShowWiz(false);setWStep(0);setWData({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"})};

// helper: move item within day
const moveItem=(dayIdx,fromIdx,toIdx)=>{upT(trip.id,t=>{const dd=[...t.dayData];const d={...dd[dayIdx],items:[...dd[dayIdx].items]};const[item]=d.items.splice(fromIdx,1);d.items.splice(toIdx,0,item);dd[dayIdx]=d;return{...t,dayData:dd}})};

// ═══ RENDER ═══
return(<div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:C.bg,fontFamily:"'Nunito Sans',sans-serif",position:"relative"}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}input:focus,select:focus,textarea:focus{outline:none;border-color:${C.primary}!important}`}</style>

{/* Header */}
<div style={{padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.borderLight}`,background:C.white,position:"sticky",top:0,zIndex:100}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{scr==="trip"&&<button onClick={()=>{setScr("home");setActiveTrip(null)}} style={{padding:"6px 12px",borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:12,color:C.textSec,fontFamily:"inherit"}}>← {t.trips}</button>}
<span onClick={()=>{setScr("home");setActiveTrip(null)}} style={{fontSize:20,fontWeight:800,fontFamily:F,color:C.primary,cursor:"pointer"}}>V</span>
{scr==="home"&&<span style={{fontSize:16,fontWeight:700,fontFamily:F}}>Ventura</span>}
{scr==="trip"&&trip&&<span style={{fontSize:14,fontWeight:700,fontFamily:F}}>{trip.name}</span>}
</div>
<div style={{display:"flex",alignItems:"center",gap:6}}>
{/* Lang switch */}
<button onClick={()=>setLang(l=>l==="pl"?"en":"pl")} style={{padding:"4px 8px",borderRadius:6,background:C.bgAlt,border:"none",fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>{lang==="pl"?"EN":"PL"}</button>
{scr==="trip"&&trip&&<button onClick={()=>setShowTrav(true)} style={{padding:"6px 10px",borderRadius:99,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>👥 {trip.travelers.length+(trip.observers?.length||0)}</button>}
{isGuest?<span style={{fontSize:10,fontWeight:700,color:C.textDim,padding:"4px 10px",borderRadius:99,background:C.bgAlt}}>Guest</span>:<div onClick={()=>setShowProf(true)} style={{cursor:"pointer"}}><Av user={currentUser} size={28}/></div>}
</div></div>

{/* ═══ HOME ═══ */}
{scr==="home"&&(<div style={{padding:20,animation:"fadeUp 0.3s"}}>
<div style={{fontSize:22,fontWeight:800,fontFamily:F,marginBottom:4}}>{t.welcome}, {currentUser.name}</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:20}}>{t.planNext}</p>
{isGuest&&<Card style={{padding:14,marginBottom:16,background:C.goldLight,border:`1px solid ${C.gold}33`}} hover={false}><div style={{fontSize:12,fontWeight:600,color:C.gold}}>👁️ {t.guestNote}</div></Card>}
<button onClick={()=>setShowWiz(true)} style={{width:"100%",padding:"16px 20px",borderRadius:16,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:F,boxShadow:C.shadowMd,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:24}}><span style={{fontSize:18}}>+</span> {t.newTrip}</button>

<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t.yourTrips}</div>
{trips.filter(tr=>isGuest||tr.travelers.includes(currentUser.id)||tr.observers?.includes(currentUser.id)).map(tr=>(<Card key={tr.id} onClick={()=>{setActiveTrip(tr.id);setScr("trip");setTab(tr.status==="past"?"memories":tr.status==="planning"?"plan":"trip")}} style={{marginBottom:16,overflow:"hidden"}}>
<PhotoSlider dest={tr.dest}/>
<div style={{padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{tr.name}</div><div style={{fontSize:12,color:C.textSec}}>{tr.dest} · {tr.dates}</div></div>
<span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,textTransform:"uppercase",background:tr.status==="upcoming"?C.sageLight:tr.status==="planning"?C.blueLight:C.bgAlt,color:tr.status==="upcoming"?C.sage:tr.status==="planning"?C.blue:C.textDim}}>{tr.status}</span></div>
{tr.status!=="past"&&tr.completeness!=null&&(<div style={{marginTop:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textDim,marginBottom:3}}><span>{t.tripReady}</span><span>{tr.completeness}%</span></div><Bar v={tr.completeness} mx={100} color={tr.completeness>75?C.sage:tr.completeness>40?C.gold:C.coral} h={4}/></div>)}
<div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}><div style={{display:"flex"}}>{tr.travelers.slice(0,4).map((uid,i)=>{const u=getU(uid);return<div key={uid} style={{width:24,height:24,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",marginLeft:i>0?-6:0,border:"2px solid #fff",position:"relative",zIndex:4-i}}>{u.name[0]}</div>})}</div><span style={{fontSize:11,color:C.textDim}}>{tr.travelers.length} {lang==="pl"?"osób":"travelers"}</span></div>
</div></Card>))}

<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:20,marginBottom:10}}>{t.getInspired}</div>
<div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>{INSP.map(d=>(<div key={d.name} onClick={()=>{setWData(p=>({...p,dest:d.name}));setShowWiz(true)}} style={{flex:"0 0 110px",borderRadius:14,overflow:"hidden",position:"relative",height:150,cursor:"pointer",boxShadow:C.shadow}}><Img src={d.img} alt={d.name} style={{width:"100%",height:"100%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(0,0,0,0.6) 0%,transparent 50%)"}}/><span style={{position:"absolute",bottom:10,left:10,color:"#fff",fontSize:13,fontWeight:700}}>{d.name}</span></div>))}</div>
</div>)}

{/* ═══ TRIP VIEW ═══ */}
{scr==="trip"&&trip&&(<div style={{animation:"fadeUp 0.3s"}}>
{trip.heroImg&&<div style={{position:"relative",height:160}}><Img src={trip.heroImg} alt={trip.name} style={{width:"100%",height:"100%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.7) 0%,transparent 60%)"}}/><div style={{position:"absolute",bottom:14,left:20,right:20}}><div style={{fontSize:22,fontWeight:800,fontFamily:F,color:"#fff"}}>{trip.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.85)"}}>{trip.dest} · {trip.dates}</div></div></div>}

{/* Currency + Delete */}
<div style={{padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
<span style={{color:C.textDim}}>{t.currency}:</span>
{editCur?<select value={trip.currency||"EUR"} onChange={e=>{upT(trip.id,t=>({...t,currency:e.target.value}));setEditCur(false)}} autoFocus onBlur={()=>setEditCur(false)} style={{padding:"3px 6px",borderRadius:6,border:`1px solid ${C.primary}`,fontSize:12,fontWeight:600,background:C.white,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select>
:<span onClick={canE?()=>setEditCur(true):undefined} style={{fontWeight:700,cursor:canE?"pointer":"default",color:C.primary}}>{trip.currency||"EUR"} {canE&&"✎"}</span>}
</div>
{canE&&trip.status!=="past"&&<button onClick={()=>{if(confirm(`${t.deleteConfirm} "${trip.name}"?`))delT(trip.id)}} style={{padding:"4px 12px",borderRadius:8,background:`${C.danger}10`,border:`1px solid ${C.danger}30`,color:C.danger,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑 {t.delete}</button>}
</div>

{/* Tabs */}
<div style={{display:"flex",overflowX:"auto",gap:2,padding:"10px 16px 0",borderBottom:`1px solid ${C.borderLight}`,background:C.white}}>
{getTabs().map(tb=>(<button key={tb.id} onClick={()=>setTab(tb.id)} style={{padding:"8px 12px",fontSize:12,fontWeight:tab===tb.id?700:500,color:tab===tb.id?C.primary:C.textDim,background:"transparent",border:"none",borderBottom:`2px solid ${tab===tb.id?C.primary:"transparent"}`,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{tb.l} {tb.n}</button>))}</div>

<div style={{padding:20}}>

{/* ═══ MEMORIES ═══ */}
{tab==="memories"&&trip.memories&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.goldLight},${C.white})`}} hover={false}>
<div style={{fontSize:18,fontWeight:800,fontFamily:F,marginBottom:12}}>✨ {t.tripRecap}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{Object.entries(trip.memories.stats).map(([k,v])=>(<div key={k} style={{padding:10,background:C.white,borderRadius:10,textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,fontFamily:F,color:C.primary}}>{v}</div><div style={{fontSize:10,color:C.textDim,textTransform:"capitalize"}}>{k.replace(/([A-Z])/g,' $1')}</div></div>))}</div></Card>
{trip.memories.highlights.map((h,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{h.icon}</span><div><div style={{fontSize:11,color:C.textDim}}>{h.title}</div><div style={{fontSize:13,fontWeight:600}}>{h.value}</div></div></div></Card>))}
<Card style={{padding:16,marginTop:12,background:trip.memories.budgetSummary.underBudget?C.sageLight:C.coralLight}} hover={false}><div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span>Budget: {fmt(trip.memories.budgetSummary.planned)} {trip.currency}</span><span style={{fontWeight:700,color:trip.memories.budgetSummary.underBudget?C.sage:C.danger}}>Actual: {fmt(trip.memories.budgetSummary.actual)} {trip.currency}</span></div></Card></div>)}
{tab==="memories"&&!trip.memories&&(<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>📸</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{t.memComing}</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>{t.memAfter}</p></Card>)}

{/* ═══ PLAN ═══ */}
{tab==="plan"&&trip.planningTips&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.blueLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700,fontFamily:F}}>{t.tripReady}</div><div style={{fontSize:11,color:C.textSec}}>{t.complete}</div></div><div style={{fontSize:28,fontWeight:800,fontFamily:F,color:C.blue}}>{trip.completeness}%</div></div><Bar v={trip.completeness} mx={100} color={C.blue} h={8}/></Card>
{trip.planningTips.map((tip,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false} onClick={canE?()=>{upT(trip.id,t=>{const tips=t.planningTips.map((tp,j)=>j===i?{...tp,done:!tp.done}:tp);return{...t,planningTips:tips,completeness:Math.min(100,Math.round(tips.filter(x=>x.done).length/tips.length*100))}})}:undefined}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:22,height:22,borderRadius:6,border:tip.done?"none":`2px solid ${C.border}`,background:tip.done?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{tip.done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}</div>
<span style={{fontSize:18}}>{tip.icon}</span>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,textDecoration:tip.done?"line-through":"none",color:tip.done?C.textDim:C.text}}>{tip.title}</div>{tip.desc&&<div style={{fontSize:11,color:C.textDim}}>{tip.desc}</div>}</div>
<span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:99,textTransform:"uppercase",background:tip.priority==="high"?C.coralLight:tip.priority==="medium"?C.goldLight:C.bgAlt,color:tip.priority==="high"?C.coral:tip.priority==="medium"?C.gold:C.textDim}}>{tip.priority}</span></div></Card>))}

{/* Leave request tracking */}
{canE&&<Card style={{padding:14,marginTop:14,background:C.purpleLight,border:`1px solid ${C.purple}22`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.purple,marginBottom:8}}>📅 {t.leaveReq}</div>
<div style={{display:"flex",gap:6}}>{[{v:"none",l:t.leaveNotReq,c:C.textDim},{v:"requested",l:t.leaveReqSent,c:C.gold},{v:"approved",l:t.leaveApproved,c:C.sage}].map(s=>(
<button key={s.v} onClick={()=>upT(trip.id,t=>({...t,leaveStatus:s.v}))} style={{flex:1,padding:"8px 6px",borderRadius:8,fontSize:11,fontWeight:600,border:trip.leaveStatus===s.v?`2px solid ${s.c}`:`1px solid ${C.border}`,background:trip.leaveStatus===s.v?`${s.c}15`:C.white,color:trip.leaveStatus===s.v?s.c:C.textDim,cursor:"pointer",fontFamily:"inherit"}}>{s.l}</button>))}</div>
</Card>}
</div>)}

{/* ═══ ITINERARY (Trip tab) — with drag-drop, voting, favorites, overload warning, add activity ═══ */}
{tab==="trip"&&(<div>
{trip.dayData?.length>0&&trip.dayData.map((day,dayIdx)=>{const open=eDays[day.day]!==false;const dayMin=getDayMin(day.items);const overloaded=dayMin>600;
return(<Card key={day.day} style={{marginBottom:12,overflow:"hidden",border:overloaded?`2px solid ${C.danger}`:`1px solid ${C.borderLight}`}} hover={false}>
<div onClick={()=>setEDays(p=>({...p,[day.day]:!open}))} style={{cursor:"pointer"}}>
{day.img&&<Img src={day.img} alt={day.title} style={{width:"100%",height:100}}/>}
<div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:open?`1px solid ${C.borderLight}`:"none"}}>
<div><div style={{fontSize:14,fontWeight:700,fontFamily:F}}>Day {day.day}: {day.title}</div>
<div style={{fontSize:12,color:C.textSec,display:"flex",alignItems:"center",gap:6}}>{day.date}{day.weather&&<> · <WI t={day.weather.icon}/> {day.weather.hi}°/{day.weather.lo}°</>}
<span style={{color:overloaded?C.danger:C.textDim}}> · {Math.round(dayMin/60)}h</span></div></div>
<span style={{fontSize:14,color:C.textDim,transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span></div></div>

{overloaded&&open&&<div style={{padding:"8px 16px",background:C.coralLight,fontSize:11,fontWeight:600,color:C.coral,display:"flex",alignItems:"center",gap:6}}>⚠️ {t.overloaded} {t.overloadMsg}</div>}

{open&&<div style={{animation:"fadeUp 0.2s"}}>
{day.items.map((it,i)=>(<div key={i}
draggable={canE} onDragStart={()=>setDragItem({dayIdx,itemIdx:i})} onDragOver={e=>e.preventDefault()}
onDrop={e=>{e.preventDefault();if(dragItem&&dragItem.dayIdx===dayIdx&&dragItem.itemIdx!==i){moveItem(dayIdx,dragItem.itemIdx,i)}setDragItem(null)}}
style={{padding:"10px 14px",display:"flex",gap:10,borderBottom:i<day.items.length-1?`1px solid ${C.borderLight}`:"none",cursor:canE?"grab":"default",background:eItem===`${day.day}-${i}`?C.bgAlt:"transparent"}}
onClick={()=>setEItem(eItem===`${day.day}-${i}`?null:`${day.day}-${i}`)}>
{canE&&<div style={{display:"flex",flexDirection:"column",justifyContent:"center",color:C.textDim,fontSize:10,cursor:"grab"}}>⠿</div>}
<div style={{minWidth:40,fontSize:11,fontWeight:600,color:C.textDim,paddingTop:2}}>{it.time}</div>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{tE[it.type]}</span><span style={{fontSize:13,fontWeight:600}}>{it.name}</span>{it.rating>0&&<span style={{fontSize:11,color:C.gold}}>★ {it.rating}</span>}</div>
{eItem===`${day.day}-${i}`&&it.desc&&<p style={{fontSize:12,color:C.textSec,marginTop:4,lineHeight:1.5}}>{it.desc}</p>}
<div style={{fontSize:11,color:C.textDim,display:"flex",gap:8,marginTop:2}}>
<span>{it.duration||`${it.durationMin}min`}</span>{it.cost>0&&<span>{it.cost} {trip.currency}</span>}
</div>
{/* Vote + Favorite buttons */}
<div style={{display:"flex",gap:6,marginTop:4}}>
{canE&&<button onClick={e=>{e.stopPropagation();upT(trip.id,tr=>{const dd=[...tr.dayData];const d={...dd[dayIdx],items:dd[dayIdx].items.map((x,j)=>j===i?{...x,votes:x.votes?.includes(currentUser.id)?x.votes.filter(v=>v!==currentUser.id):[...(x.votes||[]),currentUser.id]}:x)};dd[dayIdx]=d;return{...tr,dayData:dd}})}} style={{padding:"3px 8px",borderRadius:99,fontSize:10,fontWeight:600,border:`1px solid ${C.border}`,background:it.votes?.includes(currentUser.id)?C.sageLight:C.white,color:it.votes?.includes(currentUser.id)?C.sage:C.textDim,cursor:"pointer",fontFamily:"inherit"}}>👍 {it.votes?.length||0}</button>}
<button onClick={e=>{e.stopPropagation();upT(trip.id,tr=>{const dd=[...tr.dayData];const d={...dd[dayIdx],items:dd[dayIdx].items.map((x,j)=>j===i?{...x,fav:x.fav?.includes(currentUser.id)?x.fav.filter(v=>v!==currentUser.id):[...(x.fav||[]),currentUser.id]}:x)};dd[dayIdx]=d;return{...tr,dayData:dd}})}} style={{padding:"3px 8px",borderRadius:99,fontSize:10,fontWeight:600,border:`1px solid ${C.border}`,background:it.fav?.includes(currentUser.id)?C.coralLight:C.white,color:it.fav?.includes(currentUser.id)?C.coral:C.textDim,cursor:"pointer",fontFamily:"inherit"}}>{it.fav?.includes(currentUser.id)?"❤️":"🤍"}</button>
{canE&&<button onClick={e=>{e.stopPropagation();upT(trip.id,tr=>{const dd=[...tr.dayData];dd[dayIdx]={...dd[dayIdx],items:dd[dayIdx].items.filter((_,j)=>j!==i)};return{...tr,dayData:dd}})}} style={{padding:"3px 8px",borderRadius:99,fontSize:10,border:`1px solid ${C.border}`,background:C.white,color:C.danger,cursor:"pointer",fontFamily:"inherit"}}>×</button>}
</div></div></div>))}

{/* Add activity to this day */}
{canE&&(addActDay===dayIdx?
<div style={{padding:14,background:C.bgAlt,borderTop:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",gap:6,marginBottom:6}}>
<input value={newAct.name} onChange={e=>setNewAct(p=>({...p,name:e.target.value}))} placeholder={lang==="pl"?"Nazwa aktywności":"Activity name"} style={{flex:2,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={newAct.time} onChange={e=>setNewAct(p=>({...p,time:e.target.value}))} type="time" style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/></div>
<div style={{display:"flex",gap:6,marginBottom:6}}>
<select value={newAct.type} onChange={e=>setNewAct(p=>({...p,type:e.target.value}))} style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.entries(tE).map(([k,v])=><option key={k} value={k}>{v} {k}</option>)}</select>
<input value={newAct.durationMin} onChange={e=>setNewAct(p=>({...p,durationMin:parseInt(e.target.value)||0}))} type="number" placeholder="min" style={{width:60,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/>
<input value={newAct.cost} onChange={e=>setNewAct(p=>({...p,cost:parseInt(e.target.value)||0}))} type="number" placeholder={trip.currency} style={{width:60,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/></div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{if(!newAct.name)return;upT(trip.id,tr=>{const dd=[...tr.dayData];dd[dayIdx]={...dd[dayIdx],items:[...dd[dayIdx].items,{time:newAct.time,name:newAct.name,type:newAct.type,duration:`${newAct.durationMin}min`,durationMin:newAct.durationMin,cost:newAct.cost,desc:newAct.desc,votes:[],fav:[]}]};return{...tr,dayData:dd}});setNewAct({name:"",type:"sight",time:"10:00",durationMin:60,cost:0,desc:""});setAddActDay(null)}} style={{flex:2,padding:"8px",borderRadius:6,background:C.sage,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.add}</button>
<button onClick={()=>setAddActDay(null)} style={{flex:1,padding:"8px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{t.cancel}</button></div></div>
:<div onClick={()=>setAddActDay(dayIdx)} style={{padding:"10px 16px",textAlign:"center",color:C.primary,fontSize:12,fontWeight:600,cursor:"pointer",borderTop:`1px solid ${C.borderLight}`}}>+ {t.addActivity}</div>)}
</div>}</Card>)})}

{/* Add new day (for planning mode) */}
{(trip.status==="planning"||trip.dayData?.length>0)&&canE&&<button onClick={()=>{upT(trip.id,tr=>{const n=tr.dayData.length+1;return{...tr,dayData:[...tr.dayData,{day:n,date:`Day ${n}`,title:lang==="pl"?"Nowy dzień":"New Day",items:[]}]}})}} style={{width:"100%",padding:"12px",borderRadius:12,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>+ {t.addDay}</button>}

{(!trip.dayData||!trip.dayData.length)&&trip.status!=="planning"&&<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🗺️</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{t.noItinerary}</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>{t.switchPlan}</p></Card>}
{(!trip.dayData||!trip.dayData.length)&&trip.status==="planning"&&<Card style={{padding:24,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🗺️</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{t.buildItinerary}</div><p style={{fontSize:13,color:C.textSec,marginTop:6,marginBottom:12}}>{t.buildDesc}</p>
{canE&&<button onClick={()=>{upT(trip.id,tr=>({...tr,dayData:[{day:1,date:"Day 1",title:lang==="pl"?"Dzień 1":"Day 1",items:[]}]}))}} style={{padding:"12px 24px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ {t.addDay}</button>}</Card>}
</div>)}

{/* ═══ AI — customs, docs, transport, airport ═══ */}
{tab==="ai"&&(()=>{const dest=trip.dest;const country=getCountry(dest);const customs=LOCAL_CUSTOMS[dest]||[];const docs=TRAVEL_DOCS[country];const transport=CITY_TRANSPORT[dest];
return(<div>
<Card style={{padding:24,textAlign:"center",marginBottom:14}} hover={false}><div style={{fontSize:40,marginBottom:8}}>✨</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{t.aiTitle}</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>{t.aiDesc}</p>
<div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:12}}>{(lang==="pl"?["Optymalizuj Dzień 1","Najlepsze restauracje","Ukryte perełki","Pogoda"]:["Optimize Day 1","Best restaurants","Hidden gems","Weather tips"]).map(s=><span key={s} style={{padding:"8px 14px",borderRadius:99,background:C.primaryLight,border:`1px solid ${C.primary}33`,color:C.primary,fontSize:12,fontWeight:500,cursor:"pointer"}}>{s}</span>)}</div></Card>

{/* Transport */}
{transport&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:8}}>🚌 {t.transport}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:10,lineHeight:1.5}}>{transport.tips}</p>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{transport.best.map(m=><span key={m} style={{padding:"6px 12px",borderRadius:99,background:C.sageLight,color:C.sage,fontSize:11,fontWeight:600}}>✓ {m}</span>)}</div></Card>}

{/* Airport transfer */}
{transport?.airport&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:8}}>✈️ {t.airportTransfer}</div>
<p style={{fontSize:12,color:C.text,lineHeight:1.6}}>{transport.airport}</p></Card>}

{/* Local customs */}
{customs.length>0&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:8}}>🎌 {t.customs}</div>
{customs.map((c,i)=><div key={i} style={{fontSize:12,color:C.text,padding:"6px 0",borderBottom:i<customs.length-1?`1px solid ${C.borderLight}`:"none",lineHeight:1.5}}>• {c}</div>)}</Card>}

{/* Travel docs & MSZ */}
{docs&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:8}}>📄 {t.travelDocs}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:8,lineHeight:1.5}}>{docs.visa}</p>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:6}}>{lang==="pl"?"Wymagane dokumenty:":"Required documents:"}</div>
{docs.docs.map((d,i)=><div key={i} style={{fontSize:12,padding:"4px 0",display:"flex",alignItems:"center",gap:6}}>✓ {d}</div>)}
<div style={{marginTop:10,padding:10,borderRadius:8,background:C.sageLight,fontSize:12,fontWeight:600,color:C.sage}}>{t.mszAdvisory}: {docs.advisory}</div></Card>}
</div>)})()}
{/* ═══ PACKING — with leave tracking ═══ */}
{tab==="packing"&&(()=>{const pk=trip.packing||{};const tot=Object.values(pk).flat().length;const done=Object.values(pk).flat().filter(x=>x.packed).length;
return(<div>
{/* Leave request */}
{canE&&<Card style={{padding:14,marginBottom:14,background:C.purpleLight,border:`1px solid ${C.purple}22`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.purple,marginBottom:8}}>📅 {t.leaveReq}</div>
<div style={{display:"flex",gap:6}}>{[{v:"none",l:t.leaveNotReq,c:C.textDim},{v:"requested",l:t.leaveReqSent,c:C.gold},{v:"approved",l:t.leaveApproved,c:C.sage}].map(s=>(
<button key={s.v} onClick={()=>upT(trip.id,x=>({...x,leaveStatus:s.v}))} style={{flex:1,padding:"8px 6px",borderRadius:8,fontSize:10,fontWeight:600,border:trip.leaveStatus===s.v?`2px solid ${s.c}`:`1px solid ${C.border}`,background:trip.leaveStatus===s.v?`${s.c}15`:C.white,color:trip.leaveStatus===s.v?s.c:C.textDim,cursor:"pointer",fontFamily:"inherit"}}>{s.l}</button>))}</div></Card>}

{tot>0&&<Card style={{padding:16,marginBottom:14,background:`linear-gradient(135deg,${C.sageLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{fontSize:14,fontWeight:700,fontFamily:F}}>🎒 {t.packProgress}</div><span style={{fontSize:13,fontWeight:700,color:C.sage}}>{done}/{tot}</span></div>
<Bar v={done} mx={tot||1} color={C.sage} h={6}/></Card>}

{canE&&<div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
<button onClick={()=>setShowTpl(!showTpl)} style={{flex:1,padding:"10px 14px",borderRadius:12,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📦 {t.templates}</button>
<button onClick={()=>{if(!tot){alert(lang==="pl"?"Lista jest pusta!":"List is empty!");return}setShowSavePack(true)}} style={{flex:1,padding:"10px 14px",borderRadius:12,background:C.primaryLight,border:`1px solid ${C.primary}33`,color:C.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💾 {t.saveList}</button>
{savedLists.length>0&&<button onClick={()=>setShowLoadPack(true)} style={{flex:1,padding:"10px 14px",borderRadius:12,background:C.goldLight,border:`1px solid ${C.gold}33`,color:C.gold,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📂 {t.loadList} ({savedLists.length})</button>}
</div>}

{showTpl&&<div style={{marginBottom:14,display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>{PACK_TPL.map(tpl=>(<Card key={tpl.id} style={{flex:"0 0 130px",padding:14,textAlign:"center",cursor:"pointer"}} onClick={()=>{const np={};Object.entries(tpl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,x=>({...x,packing:{...x.packing,...np}}));setShowTpl(false)}}>
<div style={{fontSize:24,marginBottom:6}}>{tpl.icon}</div><div style={{fontSize:12,fontWeight:600}}>{tpl.name}</div></Card>))}</div>}

{canE&&<Card style={{padding:14,marginBottom:14,background:C.primaryLight,border:`1px solid ${C.primary}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.primary,marginBottom:6}}>✨ {t.aiSugg}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{AI_SUGG.slice(0,6).map(sug=>{const has=Object.values(pk).flat().some(x=>x.item===sug);return(<button key={sug} disabled={has} onClick={()=>{upT(trip.id,x=>{const p={...x.packing};p["AI"]=[...(p["AI"]||[]),{item:sug,qty:1,packed:false}];return{...x,packing:p}})}} style={{padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:500,background:has?C.bgAlt:C.white,border:`1px solid ${C.border}`,color:has?C.textDim:C.text,cursor:has?"default":"pointer",fontFamily:"inherit",textDecoration:has?"line-through":"none"}}>+ {sug}</button>)})}</div></Card>}

<Card style={{padding:14,marginBottom:14,background:C.goldLight,border:`1px solid ${C.gold}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:8}}>⚠️ {t.dontForget}</div>
{(DONT_FORGET[lang]||DONT_FORGET.en).map((tip,i)=><div key={i} style={{fontSize:12,color:C.text,padding:"4px 0",lineHeight:1.5}}>{tip}</div>)}</Card>

{Object.keys(pk).length===0?<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🎒</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{lang==="pl"?"Brak listy pakowania":"No packing list yet"}</div></Card>
:Object.entries(pk).map(([cat,items])=>(<Card key={cat} style={{marginBottom:10,overflow:"hidden"}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700,display:"flex",justifyContent:"space-between"}}><span>{cat}</span><span style={{fontSize:11,color:C.textDim}}>{items.filter(x=>x.packed).length}/{items.length}</span></div>
{items.map((it,i)=>(<div key={i} style={{padding:"9px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:i<items.length-1?`1px solid ${C.borderLight}`:"none"}}>
<div onClick={canE?()=>upT(trip.id,x=>({...x,packing:{...x.packing,[cat]:x.packing[cat].map((z,j)=>j===i?{...z,packed:!z.packed}:z)}})):undefined} style={{width:18,height:18,borderRadius:5,border:it.packed?"none":`2px solid ${C.border}`,background:it.packed?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:canE?"pointer":"default"}}>{it.packed&&<span style={{color:"#fff",fontSize:11}}>✓</span>}</div>
<span style={{flex:1,fontSize:13,textDecoration:it.packed?"line-through":"none",color:it.packed?C.textDim:C.text}}>{it.item}</span>
<span style={{fontSize:11,color:C.textDim}}>×{it.qty}</span>
{canE&&<button onClick={()=>upT(trip.id,x=>({...x,packing:{...x.packing,[cat]:x.packing[cat].filter((_,j)=>j!==i)}}))} style={{background:"none",border:"none",color:C.danger,fontSize:13,cursor:"pointer",padding:"0 4px"}}>×</button>}
</div>))}</Card>))}

{canE&&<Card style={{padding:14,marginTop:12}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{t.addItem}</div>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<input value={packCat} onChange={e=>setPackCat(e.target.value)} placeholder={t.category} list="pcat" style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/><datalist id="pcat">{Object.keys(pk).map(c=><option key={c} value={c}/>)}</datalist>
<input value={packItem} onChange={e=>setPackItem(e.target.value)} placeholder={t.itemName} style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!packItem.trim())return;const cat=packCat.trim()||"Other";upT(trip.id,x=>{const p={...x.packing};p[cat]=[...(p[cat]||[]),{item:packItem.trim(),qty:1,packed:false}];return{...x,packing:p}});setPackItem("");setPackCat("")}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t.add}</button></Card>}
</div>)})()}

{/* ═══ BUDGET ═══ */}
{tab==="budget"&&(()=>{const cur=trip.currency||"EUR";const exps=trip.expenses||[];const tS=exps.reduce((s,e)=>s+e.amount,0);const bT=trip.budget?.total||1;
const grp={};exps.forEach(e=>{grp[e.cat]=(grp[e.cat]||0)+e.amount});
const pie=Object.entries(grp).map(([c,v])=>({label:c,value:v,color:CAT_C[c]||C.textDim}));
const destCur=getDestCur(trip.dest);const homeCur=currentUser?.prefs?.currency||"PLN";
return(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.primaryLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
<div><div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>{t.spent}</div><div style={{fontSize:28,fontWeight:800,fontFamily:F}}>{fmt(tS)} <span style={{fontSize:14,color:C.textSec}}>{cur}</span></div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.textDim,fontWeight:600,marginBottom:2}}>{t.budget}</div>
{eBgt&&canE?(<div style={{display:"flex",gap:4}}>
<input value={bIn} onChange={e=>setBIn(e.target.value)} autoFocus type="number" onKeyDown={e=>{if(e.key==="Enter"){const v=parseInt(bIn);if(v>0)upT(trip.id,x=>({...x,budget:{...x.budget,total:v}}));setEBgt(false)}}} style={{width:80,padding:"5px 8px",borderRadius:8,border:`1.5px solid ${C.primary}`,fontSize:14,fontWeight:700,fontFamily:F,textAlign:"right",background:C.white}}/>
<button onClick={()=>{const v=parseInt(bIn);if(v>0)upT(trip.id,x=>({...x,budget:{...x.budget,total:v}}));setEBgt(false)}} style={{padding:"5px 10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>✓</button></div>
):(<div onClick={canE?()=>{setEBgt(true);setBIn(String(trip.budget?.total||0))}:undefined} style={{cursor:canE?"pointer":"default",display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
<span style={{fontSize:16,fontWeight:700}}>{fmt(bT)} {cur}</span>{canE&&<span style={{fontSize:11,color:C.primary}}>✎</span>}</div>)}
<div style={{fontSize:12,color:tS<=bT?C.sage:C.danger,fontWeight:600,marginTop:2}}>{tS<=bT?`${fmt(bT-tS)} ${t.remaining}`:`${fmt(tS-bT)} ${t.overBudget}`}</div></div></div>
<Bar v={tS} mx={bT} color={tS<=bT?C.primary:C.danger} h={8}/></Card>

{exps.length>0&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700,fontFamily:F}}>{t.expenses} ({exps.length})</div>
{exps.map(e=>editExp===e.id?(
<div key={e.id} style={{padding:"10px 16px",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",gap:6,marginBottom:6}}>
<input value={editExpD.name||""} onChange={ev=>setEditExpD(p=>({...p,name:ev.target.value}))} placeholder={t.name} style={{flex:2,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={editExpD.amount||""} onChange={ev=>setEditExpD(p=>({...p,amount:ev.target.value}))} type="number" placeholder={t.amount} style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/>
<select value={editExpD.currency||cur} onChange={ev=>setEditExpD(p=>({...p,currency:ev.target.value}))} style={{padding:"6px 4px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:11,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{display:"flex",gap:6}}>
<select value={editExpD.cat||"Food"} onChange={ev=>setEditExpD(p=>({...p,cat:ev.target.value}))} style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<button onClick={()=>{upT(trip.id,x=>({...x,expenses:x.expenses.map(z=>z.id===e.id?{...z,...editExpD,amount:parseFloat(editExpD.amount)||z.amount}:z)}));setEditExp(null)}} style={{padding:"6px 14px",borderRadius:6,background:C.sage,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t.save}</button>
<button onClick={()=>setEditExp(null)} style={{padding:"6px 10px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
<button onClick={()=>{upT(trip.id,x=>({...x,expenses:x.expenses.filter(z=>z.id!==e.id)}));setEditExp(null)}} style={{padding:"6px 10px",borderRadius:6,background:`${C.danger}10`,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🗑</button></div></div>
):(
<div key={e.id} onClick={canE?()=>{setEditExp(e.id);setEditExpD({name:e.name,amount:e.amount,currency:e.currency||cur,cat:e.cat})}:undefined} style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"pointer":"default"}}>
<span style={{fontSize:15}}>{CAT_I[e.cat]||"💰"}</span>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:C.textDim}}>{e.cat} · {e.date}</div></div>
<div style={{fontSize:13,fontWeight:700}}>{fmt(e.amount)} {e.currency||cur}</div></div>))}</Card>}

{canE&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
{!newExpOpen?<div onClick={()=>{setNewExpOpen(true);setNewExp(p=>({...p,currency:cur}))}} style={{padding:"12px 16px",cursor:"pointer",textAlign:"center",color:C.primary,fontSize:13,fontWeight:600}}>+ {t.addExpense}</div>
:<div style={{padding:14}}>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<input value={newExp.name} onChange={e=>setNewExp(p=>({...p,name:e.target.value}))} placeholder={t.spendOn} style={{flex:2,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={newExp.amount} onChange={e=>setNewExp(p=>({...p,amount:e.target.value}))} placeholder="0" type="number" style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/></div>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<select value={newExp.cat} onChange={e=>setNewExp(p=>({...p,cat:e.target.value}))} style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<select value={newExp.currency} onChange={e=>setNewExp(p=>({...p,currency:e.target.value}))} style={{padding:"8px 6px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{if(!newExp.name||!newExp.amount)return;upT(trip.id,x=>({...x,expenses:[...x.expenses,{id:Date.now(),name:newExp.name,cat:newExp.cat,amount:parseFloat(newExp.amount),currency:newExp.currency,payer:currentUser.id,date:"Today"}]}));setNewExp({name:"",cat:"Food",amount:"",currency:cur});setNewExpOpen(false)}} style={{flex:2,padding:"10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.saveExpense}</button>
<button onClick={()=>setNewExpOpen(false)} style={{flex:1,padding:"10px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{t.cancel}</button></div></div>}</Card>}

{exps.length>0&&<Card style={{padding:20,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:14}}>📊 {t.spendBreak}</div>
<div style={{display:"flex",gap:20,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
<Pie data={pie} size={140} currency={cur}/>
<div style={{flex:1,minWidth:140}}>{pie.sort((a,b)=>b.value-a.value).map(d=>(
<div key={d.label} style={{marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/><span style={{fontSize:12}}>{CAT_I[d.label]||"💰"} {d.label}</span></div>
<span style={{fontSize:12,fontWeight:700}}>{fmt(d.value)} <span style={{fontWeight:400,color:C.textDim}}>{Math.round(d.value/tS*100)}%</span></span></div>
<Bar v={d.value} mx={tS} color={d.color} h={4}/></div>))}</div></div>
<div style={{marginTop:16,padding:14,background:C.bgAlt,borderRadius:12}}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>💡 {t.insights}</div>
{pie.length>0&&<div style={{fontSize:12,color:C.text,lineHeight:1.6}}>
<div style={{marginBottom:4}}>{t.biggestExp}: <strong>{CAT_I[pie[0]?.label]} {pie[0]?.label}</strong> — {fmt(pie[0]?.value)} {cur} ({Math.round((pie[0]?.value||0)/tS*100)}%)</div>
<div style={{marginBottom:4}}>{t.avgExp}: <strong>{fmt(Math.round(tS/exps.length))} {cur}</strong></div>
{tS<=bT&&<div style={{color:C.sage}}>✅ {t.inBudget} {fmt(bT-tS)} {cur} {t.remaining}</div>}
{tS>bT&&<div style={{color:C.danger}}>⚠️ {t.overBudgetW} {fmt(tS-bT)} {cur}</div>}</div>}</div></Card>}

<Card style={{padding:16,background:C.blueLight,border:`1px solid ${C.blue}22`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:8}}>💱 {t.exchRates}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
{homeCur!==cur&&<><div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}><span style={{color:C.textDim}}>1 {homeCur} =</span> <strong>{getRate(homeCur,cur).toFixed(cur==="JPY"?1:3)} {cur}</strong></div>
<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}><span style={{color:C.textDim}}>1 {cur} =</span> <strong>{getRate(cur,homeCur).toFixed(homeCur==="JPY"?1:3)} {homeCur}</strong></div></>}
{destCur!==cur&&destCur!==homeCur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}><span style={{color:C.textDim}}>1 {homeCur} =</span> <strong>{getRate(homeCur,destCur).toFixed(destCur==="JPY"?1:3)} {destCur}</strong></div>}
{homeCur===cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12,gridColumn:"1/3",textAlign:"center",color:C.textDim}}>{t.homeCurNote} ({homeCur})</div>}</div>
<div style={{fontSize:10,color:C.textDim,marginTop:6}}>{t.exchNote}</div></Card>
</div>)})()}

{/* ═══ JOURNAL ═══ */}
{tab==="journal"&&(<div>
{canE&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{display:"flex",gap:10,alignItems:"flex-start"}}><Av user={currentUser} size={32}/>
<div style={{flex:1}}><textarea value={jIn} onChange={e=>setJIn(e.target.value)} placeholder={t.journalPlc} rows={3} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",resize:"vertical",background:C.bg,color:C.text}}/>
<div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
<button onClick={()=>{if(!jIn.trim())return;upT(trip.id,x=>({...x,journal:[...x.journal,{id:"j"+Date.now(),date:"Now",author:currentUser.id,type:"text",content:jIn}]}));setJIn("")}} style={{padding:"8px 18px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.post}</button></div></div></div></Card>}
{(trip.journal||[]).length===0?<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>📓</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{t.journal}</div></Card>
:[...trip.journal].reverse().map(j=>{const a=getU(j.author);return(<Card key={j.id} style={{padding:16,marginBottom:10}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Av user={a} size={28}/><span style={{fontSize:13,fontWeight:600}}>{a.name}</span><span style={{fontSize:11,color:C.textDim}}>{j.date}</span></div><p style={{fontSize:13,color:C.textSec,lineHeight:1.6}}>{j.content}</p></Card>)})}</div>)}

{/* ═══ BOOKING — deals, compare stays (with voting), car rental, insurance ═══ */}
{tab==="booking"&&(<div>
{(trip.deals||[]).length>0&&<><div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:10}}>🔖 {t.deals}</div>
{trip.deals.map((d,i)=>(<Card key={i} style={{padding:14,marginBottom:10}} onClick={()=>window.open(d.url,"_blank")}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:13,fontWeight:700}}>{d.name}</div><span style={{fontSize:10,fontWeight:700,color:"#fff",background:d.pColor,padding:"2px 6px",borderRadius:4,marginTop:4,display:"inline-block"}}>{d.partner}</span></div>
<div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:800,color:C.primary,fontFamily:F}}>{d.price}</div><div style={{fontSize:12,color:C.primary,marginTop:2}}>View →</div></div></div></Card>))}</>}

{/* Compare Stays */}
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:20,marginBottom:6}}>🏨 {t.compareStays}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:12,lineHeight:1.5}}>{t.compareDesc}</p>
{(trip.comparisons||[]).map(c=>{const proposer=getU(c.proposedBy);const voted=(c.votes||[]).includes(currentUser?.id);return(<Card key={c.id} style={{padding:14,marginBottom:10}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
<div style={{flex:1}}>
<div style={{fontSize:14,fontWeight:700,cursor:"pointer",color:C.blue}} onClick={()=>window.open(c.url,"_blank")}>{c.name} ↗</div>
<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
<span style={{fontSize:10,fontWeight:700,color:"#fff",background:c.source==="Airbnb"?"#FF5A5F":"#003580",padding:"2px 6px",borderRadius:4}}>{c.source}</span>
<span style={{fontSize:12,fontWeight:700,color:C.primary}}>{c.price}</span>
{c.rating&&<span style={{fontSize:11,color:C.gold}}>★ {c.rating}</span>}</div></div>
<div style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,background:C.bgAlt}}>
<Av user={proposer} size={18}/><span style={{fontSize:10,fontWeight:600,color:C.textSec}}>{proposer.name}</span></div></div>
{c.notes&&<p style={{fontSize:12,color:C.textSec,lineHeight:1.5,marginBottom:6}}>{c.notes}</p>}
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
{(c.pros||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.sageLight,color:C.sage}}>✓ {p}</span>)}
{(c.cons||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.coralLight,color:C.coral}}>✕ {p}</span>)}</div>
{/* Voting */}
{!isGuest&&<div style={{display:"flex",alignItems:"center",gap:8}}>
<button onClick={()=>upT(trip.id,x=>({...x,comparisons:x.comparisons.map(z=>z.id===c.id?{...z,votes:voted?z.votes.filter(v=>v!==currentUser.id):[...(z.votes||[]),currentUser.id]}:z)}))} style={{padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:600,border:voted?`2px solid ${C.sage}`:`1px solid ${C.border}`,background:voted?C.sageLight:C.white,color:voted?C.sage:C.textDim,cursor:"pointer",fontFamily:"inherit"}}>{voted?"✓ "+t.voted:t.vote} 👍</button>
<span style={{fontSize:11,color:C.textDim}}>{(c.votes||[]).length} {t.votes}</span>
<div style={{display:"flex",marginLeft:"auto"}}>{(c.votes||[]).map((uid,i)=>{const u=getU(uid);return<div key={uid} style={{width:20,height:20,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",marginLeft:i>0?-4:0,border:"2px solid #fff"}}>{u.name[0]}</div>})}</div>
</div>}</Card>)})}

{canE&&<Card style={{padding:14,marginTop:6,marginBottom:14}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{t.propose}</div>
<input value={compIn.name} onChange={e=>setCompIn(p=>({...p,name:e.target.value}))} placeholder={t.proposeName} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
<input value={compIn.url} onChange={e=>setCompIn(p=>({...p,url:e.target.value}))} placeholder={t.proposeLink} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
<div style={{display:"flex",gap:6,marginBottom:6}}>
<input value={compIn.price} onChange={e=>setCompIn(p=>({...p,price:e.target.value}))} placeholder={t.proposePrice} style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/>
<input value={compIn.notes} onChange={e=>setCompIn(p=>({...p,notes:e.target.value}))} placeholder={t.proposeWhy} style={{flex:2,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!compIn.name||!compIn.url)return;upT(trip.id,x=>({...x,comparisons:[...(x.comparisons||[]),{id:"c"+Date.now(),name:compIn.name,url:compIn.url,price:compIn.price,notes:compIn.notes,rating:null,source:compIn.url.includes("airbnb")?"Airbnb":"Booking.com",proposedBy:currentUser.id,pros:[],cons:[],votes:[currentUser.id]}]}));setCompIn({name:"",url:"",price:"",notes:""})}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t.addCompare}</button></Card>}

{/* Car Rental */}
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:20,marginBottom:10}}>🚗 {t.carRental}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:10}}>{t.carRentalDesc}</p>
<div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:14}}>{CAR_RENTALS.map(r=>(<Card key={r.name} style={{flex:"0 0 170px",padding:14,cursor:"pointer"}} onClick={()=>window.open(r.url,"_blank")}><div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{r.name}</div><div style={{fontSize:11,color:C.textSec}}>{r.desc}</div><div style={{fontSize:12,color:C.primary,marginTop:6,fontWeight:600}}>→ {lang==="pl"?"Porównaj":"Compare"}</div></Card>))}</div>

{/* Insurance */}
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:8,marginBottom:10}}>🛡️ {t.insurance}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:10}}>{t.insuranceDesc}</p>
<div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:14}}>{INSURANCE.map(r=>(<Card key={r.name} style={{flex:"0 0 170px",padding:14,cursor:"pointer"}} onClick={()=>window.open(r.url,"_blank")}><div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{r.name}</div><div style={{fontSize:11,color:C.textSec}}>{r.desc}</div><div style={{fontSize:12,color:C.primary,marginTop:6,fontWeight:600}}>→ {lang==="pl"?"Sprawdź":"Check"}</div></Card>))}</div>
</div>)}

</div></div>)}
{/* ═══ MODALS ═══ */}

{/* Trip Wizard */}
<Modal open={showWiz} onClose={()=>{setShowWiz(false);setWStep(0)}} title={[lang==="pl"?"Dokąd jedziesz?":"Where to?",lang==="pl"?"Kiedy i kto?":"When & who?",lang==="pl"?"Prawie gotowe!":"Almost there!"][wStep]}>
{wStep===0&&<div><input value={wData.dest} onChange={e=>setWData(p=>({...p,dest:e.target.value}))} placeholder={lang==="pl"?"Cel podróży — np. Barcelona, Kyoto...":"Destination — e.g. Barcelona, Kyoto..."} autoFocus style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,color:C.text,marginBottom:12}}/>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{["Barcelona","Kyoto","Reykjavik","Marrakech","Vienna","Bali"].map(d=><Pill key={d} onClick={()=>setWData(p=>({...p,dest:d}))} active={wData.dest===d}>{d}</Pill>)}</div>
<button disabled={!wData.dest} onClick={()=>setWStep(1)} style={{width:"100%",padding:"14px",borderRadius:12,background:wData.dest?C.primary:C.border,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:wData.dest?"pointer":"default",fontFamily:"inherit"}}>{lang==="pl"?"Dalej →":"Next →"}</button></div>}
{wStep===1&&<div>
<div style={{display:"flex",gap:10,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Od":"From"}</label><input type="date" value={wData.startDate} onChange={e=>setWData(p=>({...p,startDate:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Do":"To"}</label><input type="date" value={wData.endDate} onChange={e=>setWData(p=>({...p,endDate:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div></div>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Podróżnicy":"Travelers"}</label>
<div style={{display:"flex",gap:6,marginBottom:12}}>{[1,2,3,4,5,"6+"].map(n=><Pill key={n} active={wData.travelers===n} onClick={()=>setWData(p=>({...p,travelers:n}))}>{n}</Pill>)}</div>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Styl":"Style"}</label>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{["Cultural","Adventure","Relaxation","Foodie","Road Trip","City Break"].map(s=><Pill key={s} active={wData.style===s} onClick={()=>setWData(p=>({...p,style:s}))}>{s}</Pill>)}</div>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWStep(0)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>←</button><button onClick={()=>setWStep(2)} style={{flex:2,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Dalej →":"Next →"}</button></div></div>}
{wStep===2&&<div><input value={wData.name} onChange={e=>setWData(p=>({...p,name:e.target.value}))} placeholder={`e.g. "${wData.dest} Adventure"`} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,color:C.text,marginBottom:16}}/>
<Card style={{padding:16,marginBottom:16,background:C.bgAlt}} hover={false}><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{lang==="pl"?"PODSUMOWANIE":"TRIP SUMMARY"}</div><div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:4}}>{wData.name||`${wData.dest} Trip`}</div><div style={{fontSize:12,color:C.textSec}}>📍 {wData.dest} · 📅 {wData.startDate||"TBD"} – {wData.endDate||"TBD"} · 👥 {wData.travelers} · 🎯 {wData.style}</div></Card>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWStep(1)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>←</button><button onClick={createTrip} style={{flex:2,padding:"14px",borderRadius:12,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{isGuest?(t.guestSaveBlocked):("🚀 "+(lang==="pl"?"Stwórz podróż":"Create Trip"))}</button></div></div>}
</Modal>

{/* Invite */}
<Modal open={showInv} onClose={()=>setShowInv(false)} title={t.inviteTitle}>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{t.email}</label>
<input value={invEmail} onChange={e=>setInvEmail(e.target.value)} placeholder="friend@email.com" style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:6}}>{t.role}</label>
{[{id:"companion",title:"Companion",desc:t.companionDesc,icon:"🤝"},{id:"observer",title:"Observer",desc:t.observerDesc,icon:"👁️"}].map(r=>(<div key={r.id} onClick={()=>setInvRole(r.id)} style={{padding:14,borderRadius:12,border:`1.5px solid ${invRole===r.id?C.primary:C.border}`,marginBottom:8,cursor:"pointer",background:invRole===r.id?C.primaryLight:"transparent"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{r.icon}</span><div><div style={{fontSize:13,fontWeight:600}}>{r.title}</div><div style={{fontSize:11,color:C.textSec}}>{r.desc}</div></div></div></div>))}
<button onClick={()=>{setShowInv(false);setInvEmail("")}} style={{width:"100%",marginTop:8,padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.sendInvite}</button>
</Modal>

{/* Profile with Travel Friends */}
<Modal open={showProf} onClose={()=>setShowProf(false)} title={t.profile} wide>
<div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
<Av user={currentUser} size={56}/>
<div><div style={{fontSize:18,fontWeight:800,fontFamily:F}}>{currentUser.name}</div><div style={{fontSize:12,color:C.textSec}}>{currentUser.email}</div>
<span style={{fontSize:10,fontWeight:700,color:ROLES[currentUser.role]?.color||C.textDim,background:`${ROLES[currentUser.role]?.color||C.textDim}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase",marginTop:4,display:"inline-block"}}>{ROLES[currentUser.role]?.label||"Guest"}</span></div></div>

{!isGuest&&<><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:6}}>{t.profilePhoto}</div>
<input value={currentUser.photoUrl||""} onChange={e=>{const v=e.target.value;setCurrentUser(p=>({...p,photoUrl:v}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,photoUrl:v}:u))}} placeholder="Paste image URL (https://...)" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:14,background:C.bg}}/>

<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{t.socialMedia}</div>
{[{key:"instagram",icon:"📸",label:"Instagram",placeholder:"@username"},{key:"facebook",icon:"📘",label:"Facebook",placeholder:"Profile link"},{key:"tiktok",icon:"🎵",label:"TikTok",placeholder:"@username"},{key:"youtube",icon:"▶️",label:"YouTube",placeholder:"Channel link"}].map(s=>(
<div key={s.key} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
<span style={{fontSize:14,width:24}}>{s.icon}</span>
<input value={currentUser.social?.[s.key]||""} onChange={e=>{const v=e.target.value;setCurrentUser(p=>({...p,social:{...p.social,[s.key]:v}}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,social:{...u.social,[s.key]:v}}:u))}} placeholder={s.placeholder} style={{flex:1,padding:"7px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/>
</div>))}

{/* Travel Friends */}
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:20,marginBottom:10}}>👥 {t.travelFriends}</div>
{(()=>{const friendIds=new Set();trips.forEach(tr=>{if(tr.travelers.includes(currentUser.id)){tr.travelers.forEach(uid=>{if(uid!==currentUser.id)friendIds.add(uid)})}});const friends=Array.from(friendIds).map(id=>getU(id)).filter(u=>u.name!=="?");
return friends.length===0?<p style={{fontSize:12,color:C.textDim,marginBottom:14}}>{t.noFriends}</p>:<div style={{marginBottom:14}}>{friends.map(f=>(<div key={f.id||f.name} style={{padding:"10px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}>
<Av user={f} size={32}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{f.name}</div><div style={{fontSize:11,color:C.textDim}}>{f.email||""}</div>
{f.social&&Object.entries(f.social).filter(([,v])=>v).length>0&&<div style={{display:"flex",gap:6,marginTop:2}}>
{f.social.instagram&&<span style={{fontSize:10,color:C.purple}}>📸 {f.social.instagram}</span>}
{f.social.facebook&&<span style={{fontSize:10,color:C.blue}}>📘 {f.social.facebook}</span>}
</div>}</div>
<span style={{fontSize:10,fontWeight:600,color:C.textDim}}>{trips.filter(tr=>tr.travelers.includes(currentUser.id)&&tr.travelers.includes(f.id)).length} {lang==="pl"?"wspólnych":"shared"}</span></div>))}</div>})()}

<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:16,marginBottom:10}}>{t.tripStats}</div>
<div style={{display:"flex",gap:10}}>{[{label:t.totalTrips,value:trips.filter(tr=>tr.travelers.includes(currentUser.id)).length},{label:t.countries,value:new Set(trips.filter(tr=>tr.travelers.includes(currentUser.id)).map(tr=>getCountry(tr.dest))).size},{label:t.daysTraveled,value:trips.filter(tr=>tr.travelers.includes(currentUser.id)&&tr.status==="past").reduce((s,tr)=>s+tr.days,0)}].map(s=>(<div key={s.label} style={{flex:1,padding:12,background:C.bgAlt,borderRadius:12,textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,fontFamily:F,color:C.primary}}>{s.value}</div><div style={{fontSize:10,color:C.textDim}}>{s.label}</div></div>))}</div>

<div style={{fontSize:14,fontWeight:700,fontFamily:F,margin:"20px 0 10px"}}>{t.permissions} ({ROLES[currentUser.role]?.label})</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(ROLES[currentUser.role]?.perms||[]).map(p=><span key={p} style={{padding:"5px 12px",borderRadius:99,background:C.sageLight,fontSize:11,fontWeight:500,color:C.sage}}>✓ {p.replace(/_/g,' ')}</span>)}</div>
</>}

<button onClick={()=>{setLoggedIn(false);setCurrentUser(null);setIsGuest(false);setScr("home");setActiveTrip(null);setShowProf(false)}} style={{width:"100%",marginTop:20,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.signOut}</button>
</Modal>

{/* Travelers Modal */}
<Modal open={showTrav} onClose={()=>setShowTrav(false)} title={t.tripMembers} wide>
{trip&&<>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t.travelers} ({trip.travelers.length})</div>
{trip.travelers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}>
<Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div>
{u.social&&Object.entries(u.social).filter(([,v])=>v).length>0&&<div style={{display:"flex",gap:6,marginTop:3}}>
{u.social.instagram&&<span style={{fontSize:10,color:C.purple}}>📸 {u.social.instagram}</span>}
{u.social.facebook&&<span style={{fontSize:10,color:C.blue}}>📘 FB</span>}
{u.social.tiktok&&<span style={{fontSize:10}}>🎵 TT</span>}
{u.social.youtube&&<span style={{fontSize:10,color:C.danger}}>▶️ YT</span>}
</div>}</div>
<span style={{fontSize:10,fontWeight:700,color:ROLES[u.role||"user"].color,background:`${ROLES[u.role||"user"].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{ROLES[u.role||"user"].label}</span></div>)})}
{(trip.observers||[]).length>0&&<><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginTop:16,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t.observers} ({trip.observers.length})</div>
{trip.observers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}><Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div></div><span style={{fontSize:10,fontWeight:700,color:ROLES.observer.color,background:`${ROLES.observer.color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>Observer</span></div>)})}</>}
{canE&&<button onClick={()=>{setShowTrav(false);setShowInv(true)}} style={{width:"100%",marginTop:16,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t.invite}</button>}
</>}</Modal>

{/* Save Packing */}
<Modal open={showSavePack} onClose={()=>setShowSavePack(false)} title={lang==="pl"?"💾 Zapisz listę pakowania":"💾 Save Packing List"}>
<p style={{fontSize:13,color:C.textSec,marginBottom:12}}>{lang==="pl"?"Zapisz listę jako szablon do ponownego użycia.":"Save list as a reusable template."}</p>
<input value={savePackName} onChange={e=>setSavePackName(e.target.value)} placeholder={lang==="pl"?"Nazwa listy, np. Europa zimą":"List name, e.g. Winter Europe"} autoFocus style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<button onClick={()=>{if(!savePackName.trim()||!trip)return;setSavedLists(p=>[...p,{id:"sl_"+Date.now(),name:savePackName.trim(),items:{...trip.packing}}]);setShowSavePack(false);setSavePackName("")}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.sage,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.save}</button>
</Modal>

{/* Load Packing */}
<Modal open={showLoadPack} onClose={()=>setShowLoadPack(false)} title={lang==="pl"?"📂 Wczytaj listę":"📂 Load Saved List"}>
{savedLists.map(sl=>(<Card key={sl.id} style={{padding:14,marginBottom:8,cursor:"pointer"}} onClick={()=>{if(!trip)return;const np={};Object.entries(sl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,x=>({...x,packing:{...x.packing,...np}}));setShowLoadPack(false)}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:600}}>{sl.name}</div><div style={{fontSize:11,color:C.textDim}}>{Object.values(sl.items).flat().length} items</div></div>
<button onClick={e=>{e.stopPropagation();setSavedLists(p=>p.filter(x=>x.id!==sl.id))}} style={{background:"none",border:"none",color:C.danger,fontSize:14,cursor:"pointer"}}>🗑</button></div></Card>))}
{savedLists.length===0&&<div style={{textAlign:"center",padding:20,color:C.textDim}}>{lang==="pl"?"Brak zapisanych list.":"No saved lists."}</div>}
</Modal>

</div>)}
