import { useState, useEffect, useRef } from "react";
/* VENTURA v5.0 — Collaborative Travel Planning
   PL/EN i18n · Guest mode · Drag-drop itinerary · Voting ·
   Transport · Local customs · Car rental & insurance ·
   Travel friends · Favorites · Airport transfers ·
   MSZ advisories · Vacation tracking · Itinerary builder */

// ══ i18n ══
const T={welcome:{pl:"Witaj ponownie",en:"Welcome back"},planNext:{pl:"Zaplanuj następną przygodę",en:"Plan your next adventure"},newTrip:{pl:"Nowa podróż",en:"New Trip"},back:{pl:"← Powrót",en:"← Back"},save:{pl:"Zapisz",en:"Save"},cancel:{pl:"Anuluj",en:"Cancel"},delete:{pl:"Usuń",en:"Delete"},add:{pl:"Dodaj",en:"Add"},close:{pl:"Zamknij",en:"Close"},selectProfile:{pl:"Wybierz profil",en:"Select profile"},continueAsGuest:{pl:"Kontynuuj jako gość",en:"Continue as guest"},guestMode:{pl:"Tryb gościa",en:"Guest mode"},guestNotice:{pl:"Oglądaj podróże demo. Możesz planować, ale bez zapisu.",en:"Browse demo trips. You can plan, but changes won't be saved."},signOut:{pl:"Wyloguj",en:"Sign Out"},loginToSave:{pl:"Zaloguj się, aby zapisać",en:"Log in to save"},tabTrip:{pl:"Podróż",en:"Trip"},tabPlan:{pl:"Plan",en:"Plan"},tabAI:{pl:"AI",en:"AI"},tabPack:{pl:"Pakuj",en:"Pack"},tabJournal:{pl:"Dziennik",en:"Journal"},tabBudget:{pl:"Budżet",en:"Budget"},tabBook:{pl:"Rezerwuj",en:"Book"},tabMemories:{pl:"Wspomnienia",en:"Memories"},tripReadiness:{pl:"Gotowość podróży",en:"Trip readiness"},completeToPrep:{pl:"Wykonaj te kroki",en:"Complete these steps"},travelers:{pl:"podróżni",en:"travelers"},observers:{pl:"obserwatorzy",en:"observers"},upcoming:{pl:"nadchodzący",en:"upcoming"},planning:{pl:"planowanie",en:"planning"},past:{pl:"przeszły",en:"past"},currency:{pl:"Waluta",en:"Currency"},deleteTrip:{pl:"Usuń podróż",en:"Delete trip"},getInspired:{pl:"Zainspiruj się",en:"Get inspired"},dayOverloaded:{pl:"⚠️ Dzień przeładowany! Przenieś część aktywności.",en:"⚠️ Day overloaded! Move some activities."},proposeActivity:{pl:"Zaproponuj atrakcję",en:"Propose activity"},approved:{pl:"Zatwierdzone",en:"Approved"},pending:{pl:"Oczekuje",en:"Pending"},votes:{pl:"głosy",en:"votes"},packingProgress:{pl:"Postęp pakowania",en:"Packing Progress"},templates:{pl:"Szablony",en:"Templates"},saveList:{pl:"Zapisz listę",en:"Save list"},loadList:{pl:"Wczytaj",en:"Load"},addItem:{pl:"Dodaj pozycję",en:"Add item"},category:{pl:"Kategoria",en:"Category"},itemName:{pl:"Nazwa",en:"Name"},aiSuggestions:{pl:"Sugestie AI",en:"AI Suggestions"},dontForget:{pl:"Nie zapomnij o...",en:"Don't forget..."},vacationRequest:{pl:"Wniosek urlopowy",en:"Vacation request"},vacNotApplied:{pl:"Nie złożono",en:"Not applied"},vacApplied:{pl:"Złożono",en:"Applied"},vacApproved:{pl:"Zatwierdzony ✓",en:"Approved ✓"},vacDenied:{pl:"Odrzucony ✕",en:"Denied ✕"},spent:{pl:"Wydano",en:"Spent"},budget:{pl:"Budżet",en:"Budget"},remaining:{pl:"pozostało",en:"remaining"},overBudget:{pl:"przekroczono!",en:"over budget!"},expenses:{pl:"Wydatki",en:"Expenses"},addExpense:{pl:"Dodaj wydatek",en:"Add expense"},spendingBreakdown:{pl:"Podział wydatków",en:"Spending Breakdown"},insights:{pl:"Wnioski",en:"Insights"},exchangeRates:{pl:"Kursy walut",en:"Exchange rates"},indicative:{pl:"orientacyjne",en:"indicative"},writeMemory:{pl:"Napisz wspomnienie...",en:"Write a memory..."},yourJournal:{pl:"Twój dziennik",en:"Your journal"},recommendedDeals:{pl:"Polecane oferty",en:"Recommended Deals"},compareStays:{pl:"Porównaj noclegi",en:"Compare Stays"},compareStaysDesc:{pl:"Dodaj linki z Booking.com, Airbnb. Głosuj z grupą!",en:"Add Booking.com, Airbnb links. Vote with your group!"},proposePlac:{pl:"Zaproponuj miejsce",en:"Propose a place"},carRental:{pl:"Wynajem samochodu",en:"Car Rental"},carRentalDesc:{pl:"Porównaj oferty wynajmu aut.",en:"Compare car rental offers."},travelInsurance:{pl:"Ubezpieczenie podróżne",en:"Travel Insurance"},insuranceDesc:{pl:"Wykup ubezpieczenie przed wyjazdem.",en:"Get insurance before your trip."},gettingAround:{pl:"Jak się poruszać",en:"Getting Around"},airportTransfer:{pl:"Transfer z lotniska",en:"Airport Transfer"},localCustoms:{pl:"Lokalne zwyczaje",en:"Local Customs"},travelAdvisory:{pl:"Zalecenia MSZ",en:"Travel Advisory"},requiredDocs:{pl:"Wymagane dokumenty",en:"Required Documents"},myProfile:{pl:"Mój profil",en:"My Profile"},profilePhoto:{pl:"Zdjęcie profilowe",en:"Profile photo"},socialMedia:{pl:"Media społecznościowe",en:"Social media"},travelFriends:{pl:"Znajomi podróżni",en:"Travel Friends"},travelFriendsDesc:{pl:"Osoby, z którymi podróżujesz",en:"People you travel with"},addFriend:{pl:"Dodaj znajomego",en:"Add friend"},noFriendsYet:{pl:"Brak znajomych.",en:"No friends yet."},tripStats:{pl:"Statystyki",en:"Trip Stats"},approveThis:{pl:"Zatwierdzam",en:"Approve"},tripMembers:{pl:"Uczestnicy",en:"Members"},inviteSomeone:{pl:"+ Zaproś",en:"+ Invite"},whereGoing:{pl:"Dokąd jedziesz?",en:"Where to?"},whenWho:{pl:"Kiedy i z kim?",en:"When & who?"},almostThere:{pl:"Prawie gotowe!",en:"Almost there!"},createTrip:{pl:"🚀 Stwórz podróż",en:"🚀 Create Trip"},tripSummary:{pl:"Podsumowanie",en:"Summary"},addDay:{pl:"+ Dodaj dzień",en:"+ Add day"},addActivity:{pl:"+ Dodaj aktywność",en:"+ Add activity"},dayTitle:{pl:"Tytuł dnia",en:"Day title"},activityName:{pl:"Nazwa atrakcji",en:"Activity name"},time:{pl:"Godzina",en:"Time"},duration:{pl:"Czas",en:"Duration"},type:{pl:"Typ",en:"Type"},cost:{pl:"Koszt",en:"Cost"},dragHint:{pl:"Przeciągnij aby zmienić kolejność",en:"Drag to reorder"},aiPlanner:{pl:"Planer AI",en:"AI Planner"}};

// ══ Design ══
const C={bg:"#FEFBF6",bgAlt:"#F7F3ED",white:"#FFFFFF",border:"#E8E2D9",borderLight:"#F0EBE3",primary:"#C4704B",primaryLight:"#F9EDE7",primaryDark:"#A85A38",blue:"#2563EB",blueLight:"#EFF6FF",sage:"#5F8B6A",sageLight:"#ECF4EE",coral:"#E8734A",coralLight:"#FEF0EB",gold:"#D4A853",goldLight:"#FDF8EC",purple:"#7C5CFC",purpleLight:"#F3F0FF",text:"#2C1810",textSec:"#6B5B4F",textDim:"#A09486",danger:"#DC3545",shadow:"0 1px 3px rgba(44,24,16,0.06),0 4px 12px rgba(44,24,16,0.04)",shadowMd:"0 2px 8px rgba(44,24,16,0.08),0 8px 24px rgba(44,24,16,0.06)"};
const Fn="'Fraunces',serif";const fmt=n=>n!=null?n.toLocaleString("en",{maximumFractionDigits:0}):"0";
const CURS=["PLN","EUR","RON","USD","GBP","CZK","JPY","CHF"];
const CAT_I={Accommodation:"🏨",Food:"🍽️",Activities:"🎟️",Shopping:"🛍️",Transport:"🚗",Other:"💰"};
const CAT_C={Accommodation:"#2563EB",Food:"#E8734A",Activities:"#7C5CFC",Shopping:"#D4A853",Transport:"#5F8B6A",Other:"#A09486"};
const tE={sight:"📍",food:"🍽️",museum:"🖼️",shopping:"🛍️",transport:"🚌",activity:"🎯"};
const RATES={"PLN":{"EUR":0.234,"RON":1.17,"USD":0.253,"GBP":0.199,"CZK":5.87,"JPY":38.5,"CHF":0.218},"EUR":{"PLN":4.28,"RON":4.97,"USD":1.08,"GBP":0.855,"CZK":25.1,"JPY":164.5,"CHF":0.935},"USD":{"PLN":3.95,"EUR":0.925,"RON":4.61,"GBP":0.79,"CZK":23.3,"JPY":152.5,"CHF":0.866},"GBP":{"PLN":5.02,"EUR":1.17,"RON":5.83,"USD":1.27,"CZK":29.4,"JPY":193,"CHF":1.10},"JPY":{"PLN":0.026,"EUR":0.00608,"USD":0.00656,"GBP":0.00518,"CHF":0.00569},"CHF":{"PLN":4.58,"EUR":1.07,"USD":1.155,"GBP":0.912,"JPY":176},"RON":{"PLN":0.856,"EUR":0.201,"USD":0.217},"CZK":{"PLN":0.17,"EUR":0.0398,"USD":0.0429}};
const getRate=(f,t)=>{if(f===t)return 1;return RATES[f]?.[t]||1};
const DEST_CUR={"Romania":"RON","Japan":"JPY","Portugal":"EUR","Spain":"EUR","Italy":"EUR","France":"EUR","UK":"GBP","USA":"USD","Switzerland":"CHF","Czech":"CZK"};
const getDestCur=d=>{if(!d)return"EUR";for(const[c,cur]of Object.entries(DEST_CUR)){if(d.includes(c))return cur}return"EUR"};
const parseDur=s=>{if(!s)return 60;const h=s.match(/(\d+\.?\d*)h/);const m=s.match(/(\d+)min/);return(h?parseFloat(h[1])*60:0)+(m?parseInt(m[1]):0)||60};

// ══ Transport ══
const TRANSPORT={
"Bucharest":{rec:["metro","bus","taxi"],info:{pl:"Metro szybkie i tanie (M1-M5). Bolt/Uber najtańsze. Autobusy STB pokrywają miasto.",en:"Metro fast & cheap (M1-M5). Bolt/Uber cheapest. STB buses cover the city."},modes:{bus:{r:3,n:{pl:"Sieć STB, bilety w kiosku/app",en:"STB network, tickets at kiosks/app"}},metro:{r:4,n:{pl:"Szybkie, czyste, 5 linii, ~3 RON",en:"Fast, clean, 5 lines, ~3 RON"}},taxi:{r:4,n:{pl:"Bolt/Uber taniej niż trad. taksówki",en:"Bolt/Uber cheaper than traditional"}},bike:{r:2,n:{pl:"Mało infrastruktury rowerowej",en:"Limited cycling infrastructure"}},walk:{r:3,n:{pl:"Centrum OK, dalej trudniej",en:"Center OK, further areas harder"}}},airport:{pl:"Henri Coandă → centrum: Bus 783 (~4 RON, 40 min), Bolt (~60 RON, 25 min).",en:"Henri Coandă → center: Bus 783 (~4 RON, 40 min), Bolt (~60 RON, 25 min)."}},
"Tokyo":{rec:["metro","walk"],info:{pl:"Metro i JR jedne z najlepszych. Kup Suica/Pasmo. Taksówki drogie.",en:"Metro & JR world-class. Get Suica/Pasmo. Taxis expensive."},modes:{bus:{r:2,n:{pl:"Skomplikowane, lepiej metro",en:"Complex, metro better"}},metro:{r:5,n:{pl:"Najlepsze na świecie! Suica/Pasmo",en:"World-class! Suica/Pasmo card"}},taxi:{r:3,n:{pl:"Drogie (~730 JPY start), bezpieczne",en:"Expensive (~730 JPY start), safe"}},bike:{r:3,n:{pl:"Docomo rentals, płaski teren",en:"Docomo rentals, flat terrain"}},walk:{r:4,n:{pl:"Świetne w dzielnicach",en:"Great within districts"}}},airport:{pl:"Narita: N'EX (3200 JPY, 60 min), Skyliner (2520 JPY, 41 min). Haneda: monorail (500 JPY, 15 min).",en:"Narita: N'EX (3200 JPY, 60 min), Skyliner (2520 JPY, 41 min). Haneda: monorail (500 JPY, 15 min)."}},
"Lisbon":{rec:["metro","walk","taxi"],info:{pl:"Metro czyste (4 linie). Tramwaj 28 ikoniczny ale zatłoczony. Bolt bardzo tani. Wzgórza!",en:"Metro clean (4 lines). Tram 28 iconic but crowded. Bolt cheap. Hills!"},modes:{bus:{r:3,n:{pl:"Carris, karta Viva Viagem",en:"Carris network, Viva Viagem card"}},metro:{r:4,n:{pl:"4 linie, szybkie, ~1.65€",en:"4 lines, fast, ~€1.65"}},taxi:{r:4,n:{pl:"Bolt/FreeNow 5-8€ w centrum",en:"Bolt/FreeNow €5-8 in center"}},bike:{r:2,n:{pl:"Trudne — wzgórza! E-bikes OK",en:"Tough — hills! E-bikes better"}},walk:{r:4,n:{pl:"Alfama i Baixa świetne (uwaga: wzgórza)",en:"Alfama & Baixa great (watch: hills)"}}},airport:{pl:"Metro czerwona (1.65€, 25 min), Aerobus (4€, 30 min), Bolt (10-15€, 15 min).",en:"Metro red line (€1.65, 25 min), Aerobus (€4, 30 min), Bolt (€10-15, 15 min)."}}};
const CUSTOMS={
"Romania":[{icon:"🥂",t:{pl:"Odmawianie jedzenia/picia może być niegrzeczne.",en:"Refusing food/drink may seem rude."}},{icon:"💵",t:{pl:"Napiwki: 10%. Karty szeroko akceptowane.",en:"Tips: 10%. Cards widely accepted."}},{icon:"🚕",t:{pl:"Unikaj taksówek z lotniska bez app. Używaj Bolt.",en:"Avoid airport taxis without app. Use Bolt."}}],
"Japan":[{icon:"🗑️",t:{pl:"Prawie nie ma publicznych śmietników. Noś woreczek!",en:"Almost no public trash cans. Carry a bag!"}},{icon:"🍜",t:{pl:"Jedzenie podczas spaceru jest niegrzeczne. Jedz na miejscu.",en:"Eating while walking is rude. Eat at designated spots."}},{icon:"🚇",t:{pl:"Cisza w metrze — nie rozmawiaj przez telefon.",en:"Silence in metro — no phone calls."}},{icon:"💴",t:{pl:"Japonia = gotówka. Zawsze miej jeny!",en:"Japan = cash society. Always carry yen!"}},{icon:"🎎",t:{pl:"Zdejmuj buty w świątyniach i restauracjach.",en:"Remove shoes at temples and restaurants."}},{icon:"🙇",t:{pl:"Ukłon = powitanie. Lekki ukłon wystarcza.",en:"Bow = greeting. Slight bow is fine."}}],
"Portugal":[{icon:"🕐",t:{pl:"Kolacja o 20-21. Nie spiesz się!",en:"Dinner at 8-9 PM. Don't rush!"}},{icon:"🐟",t:{pl:"Bacalhau — ponad 1000 przepisów!",en:"Bacalhau — over 1000 recipes!"}},{icon:"🏖️",t:{pl:"Silne prądy atlantyckie. Kąp się na strzeżonych plażach.",en:"Strong Atlantic currents. Swim at guarded beaches."}}]};
const ADVISORY={
"Romania":{level:{pl:"Normalny",en:"Normal"},color:C.sage,info:{pl:"Brak zagrożeń. Uważaj na kieszonkowców.",en:"No threats. Watch for pickpockets."},docs:[{t:{pl:"Dowód / paszport (UE)",en:"ID / passport (EU)"},req:true},{t:{pl:"Karta EKUZ",en:"EHIC card"},req:true},{t:{pl:"Ubezpieczenie (zalecane)",en:"Insurance (recommended)"},req:false}]},
"Japan":{level:{pl:"Normalny",en:"Normal"},color:C.sage,info:{pl:"Jeden z najbezpieczniejszych krajów. Uwaga na trzęsienia.",en:"One of safest countries. Watch for earthquakes."},docs:[{t:{pl:"Paszport (ważny min. 6 mies.)",en:"Passport (valid 6+ months)"},req:true},{t:{pl:"Ubezpieczenie (wymagane)",en:"Insurance (required)"},req:true},{t:{pl:"Visit Japan Web — wypełnij przed lotem",en:"Visit Japan Web — fill before flight"},req:true},{t:{pl:"Wiza nie potrzebna do 90 dni (UE)",en:"No visa needed up to 90 days (EU)"},req:false}]},
"Portugal":{level:{pl:"Normalny",en:"Normal"},color:C.sage,info:{pl:"Bezpiecznie. Uważaj na kieszonkowców w tramwajach.",en:"Safe. Watch for pickpockets on trams."},docs:[{t:{pl:"Dowód / paszport (UE)",en:"ID / passport (EU)"},req:true},{t:{pl:"Karta EKUZ",en:"EHIC card"},req:true}]}};
const CAR_RENTALS=[{name:"Rentalcars.com",icon:"🚗",url:"https://www.rentalcars.com",d:{pl:"Porównywarka wypożyczalni",en:"Multi-provider comparison"}},{name:"Discovercars",icon:"🚙",url:"https://www.discovercars.com",d:{pl:"Dobre ceny, pełne OC",en:"Good prices, full insurance"}},{name:"Sixt",icon:"🏎️",url:"https://www.sixt.com",d:{pl:"Premium, szeroka oferta",en:"Premium, wide selection"}}];
const INSURANCES=[{name:"World Nomads",icon:"🌍",url:"https://www.worldnomads.com",d:{pl:"Popularne wśród podróżników",en:"Popular among travelers"}},{name:"Allianz Travel",icon:"🛡️",url:"https://www.allianz-travel.com",d:{pl:"Globalny ubezpieczyciel",en:"Global insurer"}},{name:"SafetyWing",icon:"✈️",url:"https://safetywing.com",d:{pl:"Dla digital nomadów",en:"For digital nomads"}}];
const PACK_TPL=[
{id:"winter",name:{pl:"Zima",en:"Winter"},icon:"❄️",items:{"Clothing":[{item:"Warm jacket",qty:1},{item:"Sweaters",qty:3},{item:"Scarf & gloves",qty:1},{item:"Walking boots",qty:1}],"Electronics":[{item:"Phone charger",qty:1},{item:"Power bank",qty:1},{item:"Adapter",qty:1}],"Documents":[{item:"ID/Passport",qty:1},{item:"Insurance",qty:1}]}},
{id:"summer",name:{pl:"Lato",en:"Summer"},icon:"☀️",items:{"Clothing":[{item:"T-shirts",qty:5},{item:"Shorts",qty:3},{item:"Swimsuit",qty:2},{item:"Sandals",qty:1}],"Beach":[{item:"Sunscreen SPF50",qty:1},{item:"Sunglasses",qty:1}],"Documents":[{item:"ID/Passport",qty:1}]}},
{id:"business",name:{pl:"Służbowa",en:"Business"},icon:"💼",items:{"Clothing":[{item:"Suits",qty:2},{item:"Dress shirts",qty:3},{item:"Dress shoes",qty:1}],"Work":[{item:"Laptop",qty:1},{item:"Business cards",qty:1}]}},
{id:"backpack",name:{pl:"Plecakiem",en:"Backpacking"},icon:"🎒",items:{"Clothing":[{item:"Quick-dry shirts",qty:4},{item:"Hiking pants",qty:2},{item:"Rain jacket",qty:1}],"Gear":[{item:"Daypack",qty:1},{item:"Water bottle",qty:1},{item:"First aid kit",qty:1}]}}];
const AI_SUGG=["Universal adapter","Reusable water bottle","Portable umbrella","Travel pillow","Ziplock bags","Hand sanitizer","Offline maps","Local SIM/eSIM","Pen for customs","Earplugs & eye mask"];
const DONT_FORGET={pl:["🛂 Paszport — sprawdź ważność!","🔌 Ładowarka + power bank","📋 Ubezpieczenie podróżne","💊 Leki na receptę","📱 Offline kopie rezerwacji","🏦 Powiadom bank o podróży","💳 Karta bez opłat zagranicznych"],en:["🛂 Passport — check expiry!","🔌 Charger + power bank","📋 Travel insurance docs","💊 Prescription meds","📱 Offline booking copies","🏦 Notify bank of travel","💳 No foreign fee card"]};
const DEST_PHOTOS={"Bucharest, Romania":["https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1585407925232-33158f7be498?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&h=400&fit=crop&q=80"],"Tokyo, Japan":["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=400&fit=crop&q=80"],"Lisbon, Portugal":["https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1536663815808-535e2280d2c2?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop&q=80"]};
const INSP=[{name:"Kyoto",img:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=240&h=320&fit=crop&q=80"},{name:"Barcelona",img:"https://images.unsplash.com/photo-1583422409516-2895a77efded?w=240&h=320&fit=crop&q=80"},{name:"Iceland",img:"https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=240&h=320&fit=crop&q=80"},{name:"Amalfi",img:"https://images.unsplash.com/photo-1533606688076-b6683a5103a4?w=240&h=320&fit=crop&q=80"},{name:"Morocco",img:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=240&h=320&fit=crop&q=80"}];
const ROLES={admin:{l:{pl:"Admin",en:"Admin"},color:C.danger,perms:["edit_trip","manage_users","delete_trip","invite","edit_budget","journal","view_all"]},user:{l:{pl:"Podróżnik",en:"Traveler"},color:C.blue,perms:["edit_trip","invite","edit_budget","journal","view_all"]},companion:{l:{pl:"Towarzysz",en:"Companion"},color:C.sage,perms:["edit_trip","edit_budget","journal","view_all"]},observer:{l:{pl:"Obserwator",en:"Observer"},color:C.gold,perms:["view_all"]},guest:{l:{pl:"Gość",en:"Guest"},color:C.textDim,perms:["view_all"]}};
const USERS_INIT=[
{id:"u1",name:"Bartek",email:"bartek@ventura.app",color:C.blue,role:"admin",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},friends:["u2"],prefs:{currency:"PLN",travelStyle:"Cultural Explorer",homeAirport:"GDN"}},
{id:"u2",name:"Anna",email:"anna@ventura.app",color:C.coral,role:"user",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},friends:["u1"],prefs:{currency:"PLN",travelStyle:"Foodie",homeAirport:"GDN"}},
{id:"u3",name:"Marek",email:"marek@gmail.com",color:C.purple,role:"user",photoUrl:"",social:{},friends:[],prefs:{currency:"PLN",homeAirport:"WAW"}}];

const mkItems=(arr)=>arr.map((a,i)=>({...a,id:a.id||"i"+i,votes:{u1:1,u2:1},fav:{},status:"approved"}));
const INIT_TRIPS=[
{id:"bucharest",name:"Bucharest Discovery",dest:"Bucharest, Romania",dates:"Mar 7 – 9, 2026",travelers:["u1","u2"],observers:["u3"],days:3,status:"upcoming",currency:"RON",vacStatus:{u1:"applied",u2:"not_applied"},heroImg:"https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=280&fit=crop&q=80",budget:{total:3500},completeness:92,
journal:[{id:"j1",date:"Feb 28",author:"u1",type:"text",content:"Booked the Transylvania day tour!"},{id:"j2",date:"Mar 1",author:"u2",type:"text",content:"Packed camera — bringing 35mm and 85mm."}],memories:null,
comparisons:[{id:"c1",name:"Marmorosch Bucharest",url:"https://www.booking.com/hotel/ro/marmorosch",price:"€89/night",rating:"9.1",source:"Booking.com",proposedBy:"u1",notes:"Autograph Collection, Old Town. Rooftop bar!",pros:["Central","Rooftop bar","Historic"],cons:["Pricey","No pool"],votes:{u1:1,u2:1}},{id:"c2",name:"Old Town Studio",url:"https://www.airbnb.com/rooms/example",price:"€52/night",rating:"4.7",source:"Airbnb",proposedBy:"u2",notes:"Kitchen + washer. Quiet near Lipscani.",pros:["Kitchen","Cheaper","Local vibe"],cons:["No reception","5th floor"],votes:{u1:0,u2:1}}],
dayData:[
{day:1,date:"Sat, Mar 7",title:"Historic Center Walk",img:"https://images.unsplash.com/photo-1585407925232-33158f7be498?w=600&h=200&fit=crop&q=80",weather:{hi:12,lo:4,icon:"sun"},items:mkItems([{time:"09:00",name:"Ogrody Cismigiu",desc:"Oldest park",type:"sight",duration:"1h",cost:0,rating:4.5},{time:"10:15",name:"Palatul Kretzulescu",type:"sight",duration:"30min",cost:0,rating:4.3},{time:"12:00",name:"Caru' cu Bere",desc:"1879 beer hall",type:"food",duration:"1.5h",cost:120,rating:4.4},{time:"14:00",name:"National Art Museum",type:"museum",duration:"2h",cost:30,rating:4.5},{time:"16:30",name:"Ateneul Roman",desc:"1888 concert hall",type:"sight",duration:"45min",cost:25,rating:4.8},{time:"20:15",name:"Grand Cafe Van Gogh",type:"food",duration:"1.5h",cost:180,rating:4.3}])},
{day:2,date:"Sun, Mar 8",title:"Transylvania Castles",img:"https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=600&h=200&fit=crop&q=80",weather:{hi:9,lo:1,icon:"cloud"},items:mkItems([{time:"07:00",name:"Depart to Sinaia",type:"transport",duration:"2h",cost:0},{time:"09:30",name:"Castelul Peles",desc:"Neo-Renaissance palace",type:"sight",duration:"2h",cost:80,rating:4.8},{time:"12:00",name:"Lunch in Sinaia",type:"food",duration:"1h",cost:90,rating:4.2},{time:"13:30",name:"Castelul Bran",desc:"Dracula's castle",type:"sight",duration:"1.5h",cost:60,rating:4.3},{time:"15:30",name:"Brasov Old Town",type:"sight",duration:"2h",cost:15,rating:4.6},{time:"18:00",name:"Return to Bucharest",type:"transport",duration:"2.5h",cost:0}])},
{day:3,date:"Mon, Mar 9",title:"Parliament & Farewell",img:"https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&h=200&fit=crop&q=80",weather:{hi:14,lo:5,icon:"partlysunny"},items:mkItems([{time:"10:00",name:"Palatul Parlamentului",desc:"2nd largest building",type:"sight",duration:"2h",cost:50,rating:4.6},{time:"13:15",name:"Lacrimi si Sfinti",type:"food",duration:"1.5h",cost:150,rating:4.6},{time:"15:00",name:"Calea Victoriei",type:"sight",duration:"1h",cost:25,rating:4.5},{time:"17:30",name:"Bolt to Airport",type:"transport",duration:"45min",cost:60}])}],
expenses:[{id:1,name:"Hotel Marmorosch",cat:"Accommodation",amount:1200,currency:"RON",payer:"u1",date:"Mar 7"},{id:2,name:"Caru' cu Bere",cat:"Food",amount:120,currency:"RON",payer:"u2",date:"Mar 7"},{id:3,name:"Museum tickets",cat:"Activities",amount:55,currency:"RON",payer:"u1",date:"Mar 7"},{id:4,name:"Transylvania tour",cat:"Activities",amount:600,currency:"RON",payer:"u1",date:"Mar 8"},{id:5,name:"Lacrimi si Sfinti",cat:"Food",amount:150,currency:"RON",payer:"u1",date:"Mar 9"},{id:6,name:"Bolt",cat:"Transport",amount:60,currency:"RON",payer:"u1",date:"Mar 9"}],
packing:{"Clothing":[{item:"Warm layers",qty:3,packed:true},{item:"Winter jacket",qty:1,packed:true},{item:"Walking shoes",qty:1,packed:true},{item:"Scarf & gloves",qty:1,packed:false}],"Electronics":[{item:"Phone chargers",qty:2,packed:true},{item:"Power bank",qty:1,packed:true},{item:"EU adapter",qty:1,packed:false}],"Documents":[{item:"ID cards",qty:2,packed:false},{item:"Booking confirmations",qty:1,packed:false}]},
deals:[{name:"Marmorosch Bucharest",price:"€89/night",partner:"Booking.com",pColor:"#003580",url:"https://www.booking.com"},{name:"Transylvania Tour",price:"€45/pp",partner:"GetYourGuide",pColor:"#FF5533",url:"https://www.getyourguide.com"},{name:"Parliament Skip-Line",price:"€12/pp",partner:"Viator",pColor:"#5B1FA8",url:"https://www.viator.com"}]},
{id:"japan",name:"Tokyo Adventure",dest:"Tokyo, Japan",dates:"May 10 – 18, 2026",travelers:["u1","u2"],observers:[],days:8,status:"planning",currency:"JPY",vacStatus:{u1:"not_applied",u2:"not_applied"},heroImg:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=280&fit=crop&q=80",budget:{total:15000},completeness:28,journal:[],memories:null,dayData:[],expenses:[],packing:{},deals:[],comparisons:[],planningTips:[{icon:"🏨",title:{pl:"Zarezerwuj nocleg",en:"Book accommodation"},desc:{pl:"8 nocy — Shinjuku/Shibuya.",en:"8 nights — Shinjuku/Shibuya."},done:false,priority:"high"},{icon:"✈️",title:{pl:"Zarezerwuj loty",en:"Book flights"},desc:{pl:"LOT via WAW / Finnair via HEL.",en:"LOT via WAW / Finnair via HEL."},done:false,priority:"high"},{icon:"🚄",title:{pl:"Kup JR Pass",en:"Get JR Pass"},desc:{pl:"7-dniowy na wycieczki.",en:"7-day for trips."},done:false,priority:"medium"},{icon:"📱",title:{pl:"eSIM",en:"eSIM"},desc:{pl:"Ubigi/Airalo.",en:"Ubigi/Airalo."},done:false,priority:"medium"},{icon:"🗺️",title:{pl:"Zaplanuj dni",en:"Plan days"},desc:{pl:"Asakusa, Shibuya, teamLab.",en:"Asakusa, Shibuya, teamLab."},done:false,priority:"medium"},{icon:"🍣",title:{pl:"Rezerwacje restauracji",en:"Restaurant bookings"},desc:{pl:"1-2 mies. wcześniej.",en:"1-2 months ahead."},done:false,priority:"low"}]},
{id:"lisbon",name:"Lisbon & Sintra",dest:"Lisbon, Portugal",dates:"Sep 12 – 16, 2025",travelers:["u1","u2"],observers:[],days:5,status:"past",currency:"EUR",vacStatus:{},heroImg:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=280&fit=crop&q=80",budget:{total:5000},completeness:100,
journal:[{id:"lj1",date:"Sep 12",author:"u1",type:"text",content:"Golden hour over the Tagus from Alfama."},{id:"lj2",date:"Sep 13",author:"u2",type:"text",content:"Sintra was a fairytale! Pena Palace colors vivid."}],
memories:{totalSpent:4650,topMoments:["Sunset from Miradouro da Graça","Pastéis de Belém","Pena Palace","LX Factory"],stats:{steps:"78,400",photos:142,places:28,meals:15},highlights:[{title:"Best meal",value:"Cervejaria Ramiro",icon:"🍽️"},{title:"Most walked",value:"Day 2: 22,800 steps",icon:"🚶"},{title:"Best photo",value:"Miradouro da Senhora do Monte",icon:"📸"},{title:"Surprise",value:"LX Factory",icon:"✨"}],budgetSummary:{planned:5000,actual:4650,underBudget:true}},comparisons:[],
dayData:[{day:1,date:"Fri, Sep 12",title:"Arrival & Alfama",img:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=200&fit=crop&q=80",weather:{hi:28,lo:18,icon:"sun"},items:mkItems([{time:"14:00",name:"Check-in",type:"sight",duration:"30min",cost:0},{time:"15:00",name:"Miradouro da Graça",type:"sight",duration:"45min",cost:0,rating:4.8,fav:{u1:true,u2:true}},{time:"19:00",name:"Taberna da Rua das Flores",type:"food",duration:"2h",cost:120,rating:4.6,fav:{u2:true}}])}],
expenses:[{id:1,name:"Hotel Alfama",cat:"Accommodation",amount:1800,currency:"EUR",payer:"u1",date:"Sep 12"},{id:2,name:"Cervejaria Ramiro",cat:"Food",amount:180,currency:"EUR",payer:"u2",date:"Sep 14"}],packing:{},deals:[]}];

// ══ Components ══
const WI=({t})=>t==="sun"?<span>☀️</span>:t==="cloud"?<span>⛅</span>:t==="rain"?<span>🌧️</span>:<span>🌤️</span>;
const Pill=({children,color=C.primary,active,onClick,small})=><button onClick={onClick} style={{padding:small?"5px 12px":"7px 16px",borderRadius:99,fontSize:small?11:13,fontWeight:500,background:active?color:"transparent",color:active?"#fff":C.textSec,border:active?"none":`1.5px solid ${C.border}`,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit",whiteSpace:"nowrap"}}>{children}</button>;
const Card=({children,style:sx,onClick,hover=true,...rest})=><div onClick={onClick} {...rest} style={{background:C.white,borderRadius:16,border:`1px solid ${C.borderLight}`,boxShadow:C.shadow,transition:"all 0.2s",cursor:onClick?"pointer":"default",...sx}} onMouseEnter={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadowMd;e.currentTarget.style.transform="translateY(-1px)"}}} onMouseLeave={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform="translateY(0)"}}}>{children}</div>;
const Bar=({v,mx,color=C.primary,h=6})=><div style={{width:"100%",height:h,background:C.bgAlt,borderRadius:h,overflow:"hidden"}}><div style={{width:`${Math.min(v/mx*100,100)}%`,height:h,borderRadius:h,background:v>mx?C.danger:color,transition:"width 0.6s"}}/></div>;
const Av=({user,size=32})=>{if(user?.photoUrl)return<img src={user.photoUrl} alt="" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`2px solid ${user.color||C.border}`}}/>;return<div style={{width:size,height:size,borderRadius:"50%",background:user?.color||C.textDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,fontWeight:700,color:"#fff",flexShrink:0}}>{(user?.name||"?")[0]}</div>};
const Img=({src,alt,style:sx})=>{const[e,sE]=useState(false);if(e)return<div style={{...sx,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim}}>🗺️</div>;return<img src={src} alt={alt||""} style={{objectFit:"cover",display:"block",...sx}} onError={()=>sE(true)}/>};
const PhotoSlider=({dest})=>{const photos=DEST_PHOTOS[dest]||[];const[idx,setIdx]=useState(0);const tRef=useRef(null);useEffect(()=>{if(photos.length<2)return;const i=setInterval(()=>setIdx(p=>(p+1)%photos.length),4500);return()=>clearInterval(i)},[photos.length]);if(!photos.length)return<div style={{height:150,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,borderRadius:"0 0 16px 16px"}}/>;return(<div style={{position:"relative",height:150,overflow:"hidden",borderRadius:"0 0 16px 16px",touchAction:"pan-y"}} onTouchStart={e=>{tRef.current=e.touches[0].clientX}} onTouchEnd={e=>{if(tRef.current===null)return;const dx=e.changedTouches[0].clientX-tRef.current;if(Math.abs(dx)>40)setIdx(p=>dx<0?(p+1)%photos.length:(p-1+photos.length)%photos.length);tRef.current=null}}>{photos.map((p,i)=><img key={i} src={p} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.8s",opacity:i===idx?1:0}}/>)}<div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.5) 0%,transparent 50%)"}}/><div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>{photos.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{width:i===idx?16:6,height:6,borderRadius:3,background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"all 0.3s",cursor:"pointer"}}/>)}</div><div style={{position:"absolute",top:"50%",left:8,transform:"translateY(-50%)",cursor:"pointer",background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}} onClick={e=>{e.stopPropagation();setIdx(p=>(p-1+photos.length)%photos.length)}}>‹</div><div style={{position:"absolute",top:"50%",right:8,transform:"translateY(-50%)",cursor:"pointer",background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}} onClick={e=>{e.stopPropagation();setIdx(p=>(p+1)%photos.length)}}>›</div></div>)};
const Pie=({data,size=140,currency})=>{let tot=data.reduce((s,d)=>s+d.value,0);if(!tot)return null;let cum=0;const sl=data.map(d=>{const st=cum/tot*360;cum+=d.value;return{...d,st,en:cum/tot*360}});const xy=(a,r)=>({x:50+r*Math.cos((a-90)*Math.PI/180),y:50+r*Math.sin((a-90)*Math.PI/180)});return(<svg viewBox="0 0 100 100" width={size} height={size}>{sl.map((s,i)=>{const lg=(s.en-s.st)>180?1:0;const p1=xy(s.st,42),p2=xy(s.en,42);if(s.en-s.st>=359.9)return<circle key={i} cx="50" cy="50" r="42" fill={s.color}/>;return<path key={i} d={`M50,50 L${p1.x},${p1.y} A42,42 0 ${lg},1 ${p2.x},${p2.y} Z`} fill={s.color}/>})}<circle cx="50" cy="50" r="26" fill={C.white}/><text x="50" y="47" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.text}>{fmt(tot)}</text><text x="50" y="56" textAnchor="middle" fontSize="5" fill={C.textDim}>{currency}</text></svg>)};
const Modal=({open,onClose,title,children,wide})=>{if(!open)return null;return(<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}><div style={{position:"absolute",inset:0,background:"rgba(44,24,16,0.4)",backdropFilter:"blur(4px)"}}/><div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.white,borderRadius:20,boxShadow:C.shadowMd,width:"100%",maxWidth:wide?600:480,maxHeight:"85vh",overflow:"auto",animation:"fadeUp 0.25s ease"}}><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.white,zIndex:1,borderRadius:"20px 20px 0 0"}}><span style={{fontSize:16,fontWeight:700,fontFamily:Fn}}>{title}</span><button onClick={onClose} style={{width:28,height:28,borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:14,color:C.textDim}}>✕</button></div><div style={{padding:20}}>{children}</div></div></div>)};


// ═══════════════ MAIN APP ═══════════════
export default function Ventura(){
const[lang,setLang]=useState("pl");
const t=k=>T[k]?.[lang]||k;
const tO=o=>(typeof o==="object"&&o!==null&&!Array.isArray(o)&&(o.pl||o.en))?o[lang]||o.en||"":o;
const[loggedIn,setLoggedIn]=useState(false);
const[isGuest,setIsGuest]=useState(false);
const[currentUser,setCU]=useState(null);
const[users,setUsers]=useState(USERS_INIT);
const[scr,setScr]=useState("home");
const[tab,setTab]=useState("trip");
const[activeTrip,setAT]=useState(null);
const[trips,setTrips]=useState(INIT_TRIPS);
const[savedLists,setSL]=useState([]);
const[showWiz,setSW]=useState(false);
const[showInv,setSI]=useState(false);
const[showProf,setSP]=useState(false);
const[showTrav,setST]=useState(false);
const[eDays,setED]=useState({});
const[eItem,setEI]=useState(null);
const[eBgt,setEB]=useState(false);
const[bIn,setBI]=useState("");
const[jIn,setJI]=useState("");
const[wStep,setWS]=useState(0);
const[wData,setWD]=useState({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"});
const[invEmail,setIE]=useState("");
const[invRole,setIR]=useState("companion");
const[packCat,setPC]=useState("");
const[packItem,setPI]=useState("");
const[showTpl,setSTpl]=useState(false);
const[showSP2,setSP2]=useState(false);
const[spName,setSPN]=useState("");
const[showLP,setSLP]=useState(false);
const[editExp,setEE]=useState(null);
const[editExpD,setEED]=useState({});
const[newExpO,setNEO]=useState(false);
const[newExp,setNE]=useState({name:"",cat:"Food",amount:"",currency:""});
const[editCur,setEC]=useState(false);
const[compIn,setCI]=useState({name:"",url:"",price:"",notes:""});
const[showAddDay,setSAD]=useState(false);
const[newDay,setND]=useState({title:"",date:""});
const[showAddAct,setSAA]=useState(null);
const[newAct,setNA]=useState({name:"",time:"10:00",duration:"1h",type:"sight",cost:0,desc:""});
const[dragItem,setDI]=useState(null);
const[dragOverDay,setDOD]=useState(null);
const[showAF,setSAF]=useState(false);
const[fSearch,setFS]=useState("");

const trip=activeTrip?trips.find(x=>x.id===activeTrip):null;
const getU=id=>users.find(u=>u.id===id)||{name:"?",color:C.textDim};
const uRole=trip?(trip.travelers.includes(currentUser?.id)?(currentUser?.role||"user"):trip.observers?.includes(currentUser?.id)?"observer":"guest"):(isGuest?"guest":"user");
const canE=!isGuest&&["admin","user","companion"].includes(uRole);
const upT=(id,fn)=>{if(isGuest)return;setTrips(p=>p.map(x=>x.id===id?fn(x):x))};
const delT=id=>{setTrips(p=>p.filter(x=>x.id!==id));setAT(null);setScr("home")};
const getK=(dest,obj)=>{if(!dest)return null;for(const k of Object.keys(obj)){if(dest.includes(k))return k}return null};
const dayMins=items=>items.reduce((s,it)=>s+parseDur(it.duration),0);

const onDS=(dI,iI)=>e=>{setDI({dI,iI});e.dataTransfer.effectAllowed="move"};
const onDO=dI=>e=>{e.preventDefault();setDOD(dI)};
const onDrop=tD=>e=>{e.preventDefault();setDOD(null);if(!dragItem||!trip||!canE)return;const{dI:sD,iI:sI}=dragItem;upT(trip.id,tr=>{const dd=[...tr.dayData.map(d=>({...d,items:[...d.items]}))];const[mv]=dd[sD].items.splice(sI,1);dd[tD].items.push(mv);return{...tr,dayData:dd}});setDI(null)};

const getTabs=()=>{if(!trip)return[];if(trip.status==="past")return[{id:"memories",l:t("tabMemories"),i:"✨"},{id:"trip",l:t("tabTrip"),i:"🗺️"},{id:"journal",l:t("tabJournal"),i:"📓"},{id:"budget",l:t("tabBudget"),i:"💰"},{id:"booking",l:t("tabBook"),i:"🔖"}];if(trip.status==="planning")return[{id:"plan",l:t("tabPlan"),i:"📋"},{id:"trip",l:t("tabTrip"),i:"🗺️"},{id:"ai",l:t("tabAI"),i:"🤖"},{id:"packing",l:t("tabPack"),i:"🎒"},{id:"journal",l:t("tabJournal"),i:"📓"},{id:"budget",l:t("tabBudget"),i:"💰"},{id:"booking",l:t("tabBook"),i:"🔖"}];return[{id:"trip",l:t("tabTrip"),i:"🗺️"},{id:"ai",l:t("tabAI"),i:"🤖"},{id:"packing",l:t("tabPack"),i:"🎒"},{id:"journal",l:t("tabJournal"),i:"📓"},{id:"budget",l:t("tabBudget"),i:"💰"},{id:"booking",l:t("tabBook"),i:"🔖"}]};

const createTrip=()=>{if(isGuest){alert(t("loginToSave"));return}const id="trip_"+Date.now();setTrips(p=>[...p,{id,name:wData.name||`${wData.dest} Trip`,dest:wData.dest,dates:`${wData.startDate} – ${wData.endDate}`,travelers:[currentUser.id],observers:[],days:0,status:"planning",currency:getDestCur(wData.dest),vacStatus:{[currentUser.id]:"not_applied"},heroImg:"",budget:{total:0},completeness:5,journal:[],memories:null,dayData:[],expenses:[],packing:{},deals:[],comparisons:[],planningTips:[{icon:"🏨",title:{pl:"Nocleg",en:"Accommodation"},desc:{pl:`Znajdź w ${wData.dest}.`,en:`Find in ${wData.dest}.`},done:false,priority:"high"},{icon:"✈️",title:{pl:"Loty",en:"Flights"},desc:{pl:"Szukaj ofert.",en:"Search deals."},done:false,priority:"high"},{icon:"🗺️",title:{pl:"Plan dnia",en:"Itinerary"},desc:{pl:`${wData.travelers} osób.`,en:`${wData.travelers} people.`},done:false,priority:"medium"},{icon:"🎒",title:{pl:"Lista pakowania",en:"Packing list"},desc:{pl:"Szablon lub od zera.",en:"Template or scratch."},done:false,priority:"low"}]}]);setAT(id);setScr("trip");setTab("plan");setSW(false);setWS(0);setWD({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"})};

const css=`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}input:focus,select:focus,textarea:focus{outline:none;border-color:${C.primary}!important}`;

// ═══ LOGIN ═══
if(!loggedIn&&!isGuest)return(
<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.primaryLight} 0%,${C.bg} 40%,${C.blueLight} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito Sans',sans-serif",padding:20}}>
<style>{css}</style>
<Card style={{width:"100%",maxWidth:400,padding:32,textAlign:"center",animation:"fadeUp 0.5s"}} hover={false}>
<div style={{fontSize:40,fontWeight:800,fontFamily:Fn,color:C.primary,marginBottom:4}}>V</div>
<div style={{fontSize:22,fontWeight:800,fontFamily:Fn,marginBottom:4}}>Ventura</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:20}}>{lang==="pl"?"Twój inteligentny towarzysz podróży":"Your intelligent travel companion"}</p>
<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}><Pill small active={lang==="pl"} onClick={()=>setLang("pl")}>🇵🇱 PL</Pill><Pill small active={lang==="en"} onClick={()=>setLang("en")}>🇬🇧 EN</Pill></div>
<div style={{fontSize:12,fontWeight:600,color:C.textDim,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t("selectProfile")}</div>
{users.map(u=>(<div key={u.id} onClick={()=>{setCU(u);setLoggedIn(true)}} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderRadius:12,border:`1.5px solid ${C.border}`,marginBottom:8,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.background=C.primaryLight}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent"}}><Av user={u} size={36}/><div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div></div><span style={{fontSize:10,fontWeight:700,color:ROLES[u.role].color,background:`${ROLES[u.role].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{tO(ROLES[u.role].l)}</span></div>))}
<div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:12}}/>
<button onClick={()=>setIsGuest(true)} style={{width:"100%",padding:"14px",borderRadius:12,background:C.bgAlt,border:`1.5px solid ${C.border}`,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>👁️ {t("continueAsGuest")}</button>
<p style={{fontSize:11,color:C.textDim,marginTop:8}}>{t("guestNotice")}</p>
</Card></div>);

// ═══ RENDER ═══
return(<div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:C.bg,fontFamily:"'Nunito Sans',sans-serif",position:"relative"}}>
<style>{css}</style>

{/* ── Header ── */}
<div style={{padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.borderLight}`,background:C.white,position:"sticky",top:0,zIndex:100}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{scr==="trip"&&<button onClick={()=>{setScr("home");setAT(null)}} style={{padding:"6px 12px",borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:12,color:C.textSec,fontFamily:"inherit"}}>{t("back")}</button>}
<span onClick={()=>{setScr("home");setAT(null)}} style={{fontSize:20,fontWeight:800,fontFamily:Fn,color:C.primary,cursor:"pointer"}}>V</span>
{scr==="home"&&<span style={{fontSize:16,fontWeight:700,fontFamily:Fn}}>Ventura</span>}
{scr==="trip"&&trip&&<span style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>{trip.name}</span>}
</div>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<button onClick={()=>setLang(l=>l==="pl"?"en":"pl")} style={{padding:"4px 8px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>{lang==="pl"?"EN":"PL"}</button>
{isGuest&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99,background:C.goldLight,color:C.gold}}>{t("guestMode")}</span>}
{scr==="trip"&&trip&&<button onClick={()=>setST(true)} style={{padding:"6px 10px",borderRadius:99,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>👥 {trip.travelers.length+(trip.observers?.length||0)}</button>}
{isGuest?<button onClick={()=>{setIsGuest(false);setScr("home")}} style={{padding:"6px 12px",borderRadius:8,background:C.primary,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Zaloguj":"Login"}</button>
:<div onClick={()=>setSP(true)} style={{cursor:"pointer"}}><Av user={currentUser} size={28}/></div>}
</div></div>

{/* ═══ HOME ═══ */}
{scr==="home"&&(<div style={{padding:20,animation:"fadeUp 0.3s"}}>
<div style={{fontSize:22,fontWeight:800,fontFamily:Fn,marginBottom:4}}>{t("welcome")}{currentUser?`, ${currentUser.name}`:""}</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:20}}>{t("planNext")}</p>
{!isGuest&&<button onClick={()=>setSW(true)} style={{width:"100%",padding:"16px 20px",borderRadius:16,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:Fn,boxShadow:C.shadowMd,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:24}}><span style={{fontSize:18}}>+</span> {t("newTrip")}</button>}
{isGuest&&<Card style={{padding:16,marginBottom:16,background:C.goldLight,border:`1px solid ${C.gold}33`}} hover={false}><div style={{fontSize:13,color:C.gold,fontWeight:600}}>👁️ {t("guestNotice")}</div></Card>}

{trips.filter(tr=>isGuest||tr.travelers.includes(currentUser?.id)||tr.observers?.includes(currentUser?.id)).map(tr=>(<Card key={tr.id} onClick={()=>{setAT(tr.id);setScr("trip");setTab(tr.status==="past"?"memories":tr.status==="planning"?"plan":"trip")}} style={{marginBottom:16,overflow:"hidden"}}>
<PhotoSlider dest={tr.dest}/>
<div style={{padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:16,fontWeight:700,fontFamily:Fn}}>{tr.name}</div><div style={{fontSize:12,color:C.textSec}}>{tr.dest} · {tr.dates}</div></div>
<span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,textTransform:"uppercase",background:tr.status==="upcoming"?C.sageLight:tr.status==="planning"?C.blueLight:C.bgAlt,color:tr.status==="upcoming"?C.sage:tr.status==="planning"?C.blue:C.textDim}}>{t(tr.status)}</span></div>
{tr.status!=="past"&&<div style={{marginTop:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textDim,marginBottom:3}}><span>{t("tripReadiness")}</span><span>{tr.completeness}%</span></div><Bar v={tr.completeness} mx={100} color={tr.completeness>75?C.sage:tr.completeness>40?C.gold:C.coral} h={4}/></div>}
<div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}><div style={{display:"flex"}}>{tr.travelers.map((uid,i)=>{const u=getU(uid);return<div key={uid} style={{width:24,height:24,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",marginLeft:i>0?-6:0,border:"2px solid #fff",position:"relative",zIndex:tr.travelers.length-i}}>{u.name[0]}</div>})}</div><span style={{fontSize:11,color:C.textDim}}>{tr.travelers.length} {t("travelers")}</span></div></div></Card>))}

<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:20,marginBottom:10}}>{t("getInspired")}</div>
<div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>{INSP.map(d=>(<div key={d.name} onClick={isGuest?undefined:()=>{setWD(p=>({...p,dest:d.name}));setSW(true)}} style={{flex:"0 0 110px",borderRadius:14,overflow:"hidden",position:"relative",height:150,cursor:isGuest?"default":"pointer",boxShadow:C.shadow}}><Img src={d.img} alt={d.name} style={{width:"100%",height:"100%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(0,0,0,0.6) 0%,transparent 50%)"}}/><span style={{position:"absolute",bottom:10,left:10,color:"#fff",fontSize:13,fontWeight:700}}>{d.name}</span></div>))}</div>
</div>)}

{/* ═══ TRIP VIEW ═══ */}
{scr==="trip"&&trip&&(<div style={{animation:"fadeUp 0.3s"}}>
{trip.heroImg&&<div style={{position:"relative",height:160}}><Img src={trip.heroImg} alt={trip.name} style={{width:"100%",height:"100%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.7) 0%,transparent 60%)"}}/><div style={{position:"absolute",bottom:14,left:20,right:20}}><div style={{fontSize:22,fontWeight:800,fontFamily:Fn,color:"#fff"}}>{trip.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.85)"}}>{trip.dest} · {trip.dates}</div></div></div>}

{/* Currency + Delete */}
<div style={{padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
<span style={{color:C.textDim}}>{t("currency")}:</span>
{editCur?<select value={trip.currency||"EUR"} onChange={e=>{upT(trip.id,tr=>({...tr,currency:e.target.value}));setEC(false)}} autoFocus onBlur={()=>setEC(false)} style={{padding:"3px 6px",borderRadius:6,border:`1px solid ${C.primary}`,fontSize:12,fontWeight:600,background:C.white,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select>
:<span onClick={canE?()=>setEC(true):undefined} style={{fontWeight:700,cursor:canE?"pointer":"default",color:C.primary}}>{trip.currency||"EUR"} {canE&&"✎"}</span>}
</div>
{canE&&trip.status!=="past"&&<button onClick={()=>{if(confirm(`${t("deleteTrip")} "${trip.name}"?`))delT(trip.id)}} style={{padding:"4px 12px",borderRadius:8,background:`${C.danger}10`,border:`1px solid ${C.danger}30`,color:C.danger,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑 {t("delete")}</button>}
</div>

{/* Tabs */}
<div style={{display:"flex",overflowX:"auto",gap:2,padding:"10px 16px 0",borderBottom:`1px solid ${C.borderLight}`,background:C.white}}>
{getTabs().map(tb=>(<button key={tb.id} onClick={()=>setTab(tb.id)} style={{padding:"8px 12px",fontSize:11,fontWeight:tab===tb.id?700:500,color:tab===tb.id?C.primary:C.textDim,background:"transparent",border:"none",borderBottom:`2px solid ${tab===tb.id?C.primary:"transparent"}`,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{tb.i} {tb.l}</button>))}</div>

<div style={{padding:20}}>

{/* ══ MEMORIES ══ */}
{tab==="memories"&&trip.memories&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.goldLight},${C.white})`}} hover={false}>
<div style={{fontSize:18,fontWeight:800,fontFamily:Fn,marginBottom:12}}>✨ {t("tabMemories")}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{Object.entries(trip.memories.stats).map(([k,v])=>(<div key={k} style={{padding:10,background:C.white,borderRadius:10,textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,fontFamily:Fn,color:C.primary}}>{v}</div><div style={{fontSize:10,color:C.textDim,textTransform:"capitalize"}}>{k}</div></div>))}</div></Card>
{trip.memories.highlights.map((h,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{h.icon}</span><div><div style={{fontSize:11,color:C.textDim}}>{h.title}</div><div style={{fontSize:13,fontWeight:600}}>{h.value}</div></div></div></Card>))}
<Card style={{padding:16,marginTop:12,background:trip.memories.budgetSummary.underBudget?C.sageLight:C.coralLight}} hover={false}><div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span>{lang==="pl"?"Planowany":"Planned"}: {fmt(trip.memories.budgetSummary.planned)} {trip.currency}</span><span style={{fontWeight:700,color:trip.memories.budgetSummary.underBudget?C.sage:C.danger}}>{lang==="pl"?"Faktyczny":"Actual"}: {fmt(trip.memories.budgetSummary.actual)} {trip.currency}</span></div></Card></div>)}
{tab==="memories"&&!trip.memories&&<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>📸</div><div style={{fontFamily:Fn,fontWeight:700}}>{lang==="pl"?"Wspomnienia pojawią się po podróży":"Memories appear after the trip"}</div></Card>}

{/* ══ PLAN ══ */}
{tab==="plan"&&trip.planningTips&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.blueLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>{t("tripReadiness")}</div><div style={{fontSize:11,color:C.textSec}}>{t("completeToPrep")}</div></div><div style={{fontSize:28,fontWeight:800,fontFamily:Fn,color:C.blue}}>{trip.completeness}%</div></div>
<Bar v={trip.completeness} mx={100} color={C.blue} h={8}/></Card>
{trip.planningTips.map((tip,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false} onClick={canE?()=>{upT(trip.id,tr=>{const tips=tr.planningTips.map((tp,j)=>j===i?{...tp,done:!tp.done}:tp);return{...tr,planningTips:tips,completeness:Math.min(100,Math.round(tips.filter(x=>x.done).length/tips.length*100))}})}:undefined}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:22,height:22,borderRadius:6,border:tip.done?"none":`2px solid ${C.border}`,background:tip.done?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{tip.done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}</div>
<span style={{fontSize:18}}>{tip.icon}</span>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,textDecoration:tip.done?"line-through":"none",color:tip.done?C.textDim:C.text}}>{tO(tip.title)}</div><div style={{fontSize:11,color:C.textDim}}>{tO(tip.desc)}</div></div>
<span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:99,textTransform:"uppercase",background:tip.priority==="high"?C.coralLight:tip.priority==="medium"?C.goldLight:C.bgAlt,color:tip.priority==="high"?C.coral:tip.priority==="medium"?C.gold:C.textDim}}>{tip.priority}</span></div></Card>))}

{/* Itinerary builder */}
<div style={{marginTop:16,fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:10}}>🗺️ {lang==="pl"?"Buduj plan dnia":"Build daily plan"}</div>
{(trip.dayData||[]).map((day,dI)=>{const tm=dayMins(day.items);const over=tm>720;return(
<Card key={dI} style={{marginBottom:10,overflow:"hidden",border:dragOverDay===dI?`2px dashed ${C.primary}`:`1px solid ${C.borderLight}`}} hover={false} onDragOver={onDO(dI)} onDrop={onDrop(dI)}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:13,fontWeight:700}}>Day {day.day}: {day.title}</div><div style={{fontSize:11,color:C.textDim}}>{day.date} · {Math.round(tm/60*10)/10}h</div></div>
{canE&&<button onClick={()=>upT(trip.id,tr=>({...tr,dayData:tr.dayData.filter((_,j)=>j!==dI)}))} style={{background:"none",border:"none",color:C.danger,fontSize:14,cursor:"pointer"}}>🗑</button>}</div>
{over&&<div style={{padding:"8px 16px",background:C.coralLight,fontSize:12,fontWeight:600,color:C.coral}}>{t("dayOverloaded")}</div>}
{day.items.map((it,iI)=>(<div key={it.id||iI} draggable={canE} onDragStart={canE?onDS(dI,iI):undefined} style={{padding:"8px 14px",display:"flex",gap:8,alignItems:"center",borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"grab":"default",background:it.status==="pending"?C.goldLight:"transparent"}}>
{canE&&<span style={{fontSize:10,color:C.textDim,cursor:"grab"}}>⠿</span>}
<span style={{fontSize:13}}>{tE[it.type]||"📍"}</span>
<div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{it.name}{it.status==="pending"&&<span style={{fontSize:10,color:C.gold,marginLeft:6}}>({t("pending")})</span>}</div>
<div style={{fontSize:10,color:C.textDim}}>{it.time} · {it.duration}{it.cost>0?` · ${it.cost} ${trip.currency}`:""}</div></div>
{it.status==="pending"&&canE&&<button onClick={e=>{e.stopPropagation();upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,votes:{...x.votes,[currentUser.id]:1},status:Object.keys({...x.votes,[currentUser.id]:1}).length>=Math.ceil(trip.travelers.length/2)?"approved":"pending"}:x)}:d)}))}} style={{padding:"3px 8px",borderRadius:6,background:C.sageLight,border:"none",color:C.sage,fontSize:10,fontWeight:600,cursor:"pointer"}}>👍</button>}
<button onClick={e=>{e.stopPropagation();if(!currentUser||isGuest)return;upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,fav:{...x.fav,[currentUser.id]:!x.fav?.[currentUser.id]}}:x)}:d)}))}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:2}}>{it.fav?.[currentUser?.id]?"❤️":"🤍"}</button>
</div>))}
{canE&&<div style={{padding:8,textAlign:"center"}}><button onClick={()=>{setSAA(dI);setNA({name:"",time:"10:00",duration:"1h",type:"sight",cost:0,desc:""})}} style={{padding:"6px 14px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>{t("addActivity")}</button></div>}
</Card>)})}
{canE&&<button onClick={()=>setSAD(true)} style={{width:"100%",padding:"12px",borderRadius:12,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>{t("addDay")}</button>}
{canE&&<p style={{fontSize:11,color:C.textDim,marginTop:8,textAlign:"center"}}>{t("dragHint")}</p>}
</div>)}

{/* ══ TRIP (upcoming/past) ══ */}
{tab==="trip"&&trip.status!=="planning"&&(trip.dayData?.length>0?<div>{trip.dayData.map((day,dI)=>{const open=eDays[day.day]!==false;const tm=dayMins(day.items);const over=tm>720;return(<Card key={day.day} style={{marginBottom:12,overflow:"hidden",border:dragOverDay===dI?`2px dashed ${C.primary}`:`1px solid ${C.borderLight}`}} hover={false} onDragOver={canE?onDO(dI):undefined} onDrop={canE?onDrop(dI):undefined}>
<div onClick={()=>setED(p=>({...p,[day.day]:!open}))} style={{cursor:"pointer"}}>
{day.img&&<Img src={day.img} alt={day.title} style={{width:"100%",height:100}}/>}
<div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:open?`1px solid ${C.borderLight}`:"none"}}>
<div><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>Day {day.day}: {day.title}</div><div style={{fontSize:12,color:C.textSec,display:"flex",alignItems:"center",gap:6}}>{day.date}{day.weather&&<> · <WI t={day.weather.icon}/> {day.weather.hi}°/{day.weather.lo}°</>} · {Math.round(tm/60*10)/10}h</div></div>
<span style={{fontSize:14,color:C.textDim,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span></div></div>
{over&&open&&<div style={{padding:"8px 16px",background:C.coralLight,fontSize:12,fontWeight:600,color:C.coral}}>{t("dayOverloaded")}</div>}
{open&&<div>{day.items.map((it,iI)=>(<div key={it.id||iI} draggable={canE} onDragStart={canE?onDS(dI,iI):undefined} onClick={()=>setEI(eItem===`${day.day}-${iI}`?null:`${day.day}-${iI}`)} style={{padding:"10px 14px",display:"flex",gap:8,borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"grab":"pointer",background:eItem===`${day.day}-${iI}`?C.bgAlt:it.status==="pending"?C.goldLight:"transparent",alignItems:"center"}}>
{canE&&<span style={{fontSize:10,color:C.textDim}}>⠿</span>}
<div style={{minWidth:36,fontSize:11,fontWeight:600,color:C.textDim}}>{it.time}</div>
<div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{tE[it.type]}</span><span style={{fontSize:13,fontWeight:600}}>{it.name}</span>{it.rating>0&&<span style={{fontSize:11,color:C.gold}}>★ {it.rating}</span>}{it.status==="pending"&&<span style={{fontSize:10,color:C.gold}}>({t("pending")})</span>}</div>
{eItem===`${day.day}-${iI}`&&<div style={{marginTop:4}}>{it.desc&&<p style={{fontSize:12,color:C.textSec}}>{it.desc}</p>}<div style={{fontSize:11,color:C.textDim}}>{it.duration}{it.cost>0?` · ${it.cost} ${trip.currency}`:""}</div></div>}</div>
{it.status==="pending"&&canE&&<button onClick={e=>{e.stopPropagation();upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,votes:{...x.votes,[currentUser.id]:1},status:Object.keys({...x.votes,[currentUser.id]:1}).length>=Math.ceil(trip.travelers.length/2)?"approved":"pending"}:x)}:d)}))}} style={{padding:"3px 8px",borderRadius:6,background:C.sageLight,border:"none",color:C.sage,fontSize:10,fontWeight:600,cursor:"pointer",flexShrink:0}}>👍</button>}
<button onClick={e=>{e.stopPropagation();if(!currentUser||isGuest)return;upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,fav:{...x.fav,[currentUser.id]:!x.fav?.[currentUser.id]}}:x)}:d)}))}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:2,flexShrink:0}}>{it.fav?.[currentUser?.id]?"❤️":"🤍"}</button>
</div>))}
{canE&&<div style={{padding:8,textAlign:"center"}}><button onClick={()=>{setSAA(dI);setNA({name:"",time:"10:00",duration:"1h",type:"sight",cost:0,desc:""})}} style={{padding:"6px 14px",borderRadius:8,background:C.primaryLight,border:`1px solid ${C.primary}33`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.primary}}>+ {t("proposeActivity")}</button></div>}
</div>}</Card>)})}</div>
:<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🗺️</div><div style={{fontFamily:Fn,fontWeight:700}}>{lang==="pl"?"Brak planu":"No itinerary"}</div></Card>)}

{/* ══ AI ══ */}
{tab==="ai"&&(()=>{const dk=getK(trip.dest,TRANSPORT);const ck=getK(trip.dest,CUSTOMS);const ak=getK(trip.dest,ADVISORY);const trn=dk?TRANSPORT[dk]:null;const cust=ck?CUSTOMS[ck]:null;const adv=ak?ADVISORY[ak]:null;
return(<div>
<Card style={{padding:20,marginBottom:14,textAlign:"center",background:`linear-gradient(135deg,${C.purpleLight},${C.white})`}} hover={false}>
<div style={{fontSize:40,marginBottom:8}}>🤖</div><div style={{fontSize:16,fontWeight:700,fontFamily:Fn}}>{t("aiPlanner")}</div>
<p style={{fontSize:12,color:C.textSec,marginTop:6}}>{lang==="pl"?"Optymalizuj trasy, szukaj restauracji, odkrywaj ukryte perełki!":"Optimize routes, find restaurants, discover hidden gems!"}</p></Card>

{trn&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:4}}>🚌 {t("gettingAround")}</div>
<p style={{fontSize:12,color:C.textSec,lineHeight:1.5,marginBottom:10}}>{trn.info[lang]}</p>
<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>{trn.rec.map(m=><span key={m} style={{padding:"4px 10px",borderRadius:99,background:C.sageLight,color:C.sage,fontSize:11,fontWeight:600}}>✓ {m==="bus"?"🚌":m==="metro"?"🚇":m==="taxi"?"🚕":m==="bike"?"🚲":"🚶"} {m}</span>)}</div>
{Object.entries(trn.modes).map(([mode,d])=>(<div key={mode} style={{padding:"8px 0",borderBottom:`1px solid ${C.borderLight}`,display:"flex",alignItems:"center",gap:10}}>
<span style={{fontSize:14,width:24,textAlign:"center"}}>{mode==="bus"?"🚌":mode==="metro"?"🚇":mode==="taxi"?"🚕":mode==="bike"?"🚲":"🚶"}</span>
<div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{mode} <span style={{color:C.gold}}>{"★".repeat(d.r)}{"☆".repeat(5-d.r)}</span></div>
<div style={{fontSize:11,color:C.textSec}}>{d.n[lang]}</div></div></div>))}</Card>}

{trn?.airport&&<Card style={{padding:16,marginBottom:14,background:C.blueLight,border:`1px solid ${C.blue}22`}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,color:C.blue,marginBottom:6}}>✈️ {t("airportTransfer")}</div>
<p style={{fontSize:12,lineHeight:1.6}}>{trn.airport[lang]}</p></Card>}

{cust&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:10}}>🎎 {t("localCustoms")}</div>
{cust.map((c,i)=>(<div key={i} style={{padding:"8px 0",borderBottom:i<cust.length-1?`1px solid ${C.borderLight}`:"none",display:"flex",gap:10}}>
<span style={{fontSize:18}}>{c.icon}</span><p style={{fontSize:12,color:C.textSec,lineHeight:1.5,flex:1}}>{c.t[lang]}</p></div>))}</Card>}

{adv&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>🛡️ {t("travelAdvisory")}</div><span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:99,background:`${adv.color}20`,color:adv.color}}>{adv.level[lang]}</span></div>
<p style={{fontSize:12,color:C.textSec,lineHeight:1.5,marginBottom:12}}>{adv.info[lang]}</p>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:6}}>{t("requiredDocs")}</div>
{adv.docs.map((d,i)=>(<div key={i} style={{padding:"6px 0",display:"flex",alignItems:"center",gap:8,borderBottom:i<adv.docs.length-1?`1px solid ${C.borderLight}`:"none"}}>
<span style={{fontSize:12}}>{d.req?"🔴":"🟡"}</span><span style={{fontSize:12,flex:1}}>{d.t[lang]}</span><span style={{fontSize:10,fontWeight:600,color:d.req?C.danger:C.gold}}>{d.req?(lang==="pl"?"Wymagane":"Required"):(lang==="pl"?"Zalecane":"Recommended")}</span></div>))}</Card>}

{!trn&&!cust&&!adv&&<Card style={{padding:20,textAlign:"center"}} hover={false}><div style={{fontSize:13,color:C.textDim}}>{lang==="pl"?"Dane AI dostępne dla popularnych destynacji.":"AI data available for popular destinations."}</div></Card>}
</div>)})()}

{/* ══ PACKING ══ */}
{tab==="packing"&&(()=>{const pk=trip.packing||{};const tot=Object.values(pk).flat().length;const done=Object.values(pk).flat().filter(x=>x.packed).length;return(<div>
{canE&&trip.status!=="past"&&<Card style={{padding:14,marginBottom:14,background:C.purpleLight,border:`1px solid ${C.purple}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.purple,marginBottom:8}}>🏖️ {t("vacationRequest")}</div>
{trip.travelers.map(uid=>{const u=getU(uid);const vs=trip.vacStatus?.[uid]||"not_applied";const sts=["not_applied","applied","approved","denied"];const sL={not_applied:t("vacNotApplied"),applied:t("vacApplied"),approved:t("vacApproved"),denied:t("vacDenied")};const sC={not_applied:C.textDim,applied:C.gold,approved:C.sage,denied:C.danger};
return(<div key={uid} style={{padding:"6px 0",display:"flex",alignItems:"center",gap:10}}><Av user={u} size={24}/><span style={{fontSize:12,fontWeight:600,flex:1}}>{u.name}</span>
{uid===currentUser?.id?<select value={vs} onChange={e=>upT(trip.id,tr=>({...tr,vacStatus:{...tr.vacStatus,[uid]:e.target.value}}))} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:11,fontWeight:600,color:sC[vs],background:C.white,fontFamily:"inherit"}}>{sts.map(s=><option key={s} value={s}>{sL[s]}</option>)}</select>
:<span style={{fontSize:11,fontWeight:600,color:sC[vs],padding:"3px 8px",borderRadius:6,background:`${sC[vs]}15`}}>{sL[vs]}</span>}</div>)})}</Card>}

{tot>0&&<Card style={{padding:16,marginBottom:14,background:`linear-gradient(135deg,${C.sageLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>🎒 {t("packingProgress")}</div><span style={{fontSize:13,fontWeight:700,color:C.sage}}>{done}/{tot}</span></div><Bar v={done} mx={tot||1} color={C.sage} h={6}/></Card>}

{canE&&<div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
<button onClick={()=>setSTpl(!showTpl)} style={{flex:1,padding:"10px",borderRadius:12,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📦 {t("templates")}</button>
<button onClick={()=>{if(tot===0)return;setSP2(true)}} style={{flex:1,padding:"10px",borderRadius:12,background:C.primaryLight,border:`1px solid ${C.primary}33`,color:C.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💾 {t("saveList")}</button>
{savedLists.length>0&&<button onClick={()=>setSLP(true)} style={{flex:1,padding:"10px",borderRadius:12,background:C.goldLight,border:`1px solid ${C.gold}33`,color:C.gold,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📂 {t("loadList")} ({savedLists.length})</button>}</div>}

{showTpl&&<div style={{marginBottom:14,display:"flex",gap:8,overflowX:"auto"}}>{PACK_TPL.map(tpl=>(<Card key={tpl.id} style={{flex:"0 0 120px",padding:14,textAlign:"center",cursor:"pointer"}} onClick={()=>{const np={};Object.entries(tpl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,tr=>({...tr,packing:{...tr.packing,...np}}));setSTpl(false)}}><div style={{fontSize:24,marginBottom:6}}>{tpl.icon}</div><div style={{fontSize:12,fontWeight:600}}>{tO(tpl.name)}</div></Card>))}</div>}

{canE&&<Card style={{padding:14,marginBottom:14,background:C.primaryLight,border:`1px solid ${C.primary}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.primary,marginBottom:6}}>✨ {t("aiSuggestions")}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{AI_SUGG.slice(0,6).map(sug=>{const has=Object.values(pk).flat().some(x=>x.item===sug);return(<button key={sug} disabled={has} onClick={()=>{upT(trip.id,tr=>{const p={...tr.packing};p["AI"]=[...(p["AI"]||[]),{item:sug,qty:1,packed:false}];return{...tr,packing:p}})}} style={{padding:"5px 10px",borderRadius:99,fontSize:11,background:has?C.bgAlt:C.white,border:`1px solid ${C.border}`,color:has?C.textDim:C.text,cursor:has?"default":"pointer",fontFamily:"inherit",textDecoration:has?"line-through":"none"}}>+ {sug}</button>)})}</div></Card>}

<Card style={{padding:14,marginBottom:14,background:C.goldLight,border:`1px solid ${C.gold}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:8}}>⚠️ {t("dontForget")}</div>
{DONT_FORGET[lang].map((tip,i)=><div key={i} style={{fontSize:12,padding:"4px 0",lineHeight:1.5}}>{tip}</div>)}</Card>

{Object.keys(pk).length===0?<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🎒</div><div style={{fontFamily:Fn,fontWeight:700}}>{lang==="pl"?"Brak listy":"No list yet"}</div></Card>
:Object.entries(pk).map(([cat,items])=>(<Card key={cat} style={{marginBottom:10,overflow:"hidden"}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700,display:"flex",justifyContent:"space-between"}}><span>{cat}</span><span style={{fontSize:11,color:C.textDim}}>{items.filter(x=>x.packed).length}/{items.length}</span></div>
{items.map((it,i)=>(<div key={i} style={{padding:"9px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:i<items.length-1?`1px solid ${C.borderLight}`:"none"}}>
<div onClick={canE?()=>upT(trip.id,tr=>({...tr,packing:{...tr.packing,[cat]:tr.packing[cat].map((x,j)=>j===i?{...x,packed:!x.packed}:x)}})):undefined} style={{width:18,height:18,borderRadius:5,border:it.packed?"none":`2px solid ${C.border}`,background:it.packed?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:canE?"pointer":"default"}}>{it.packed&&<span style={{color:"#fff",fontSize:11}}>✓</span>}</div>
<span style={{flex:1,fontSize:13,textDecoration:it.packed?"line-through":"none",color:it.packed?C.textDim:C.text}}>{it.item}</span><span style={{fontSize:11,color:C.textDim}}>×{it.qty}</span>
{canE&&<button onClick={()=>upT(trip.id,tr=>({...tr,packing:{...tr.packing,[cat]:tr.packing[cat].filter((_,j)=>j!==i)}}))} style={{background:"none",border:"none",color:C.danger,fontSize:13,cursor:"pointer"}}>×</button>}</div>))}</Card>))}

{canE&&<Card style={{padding:14,marginTop:12}} hover={false}>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<input value={packCat} onChange={e=>setPC(e.target.value)} placeholder={t("category")} list="pcat" style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/><datalist id="pcat">{Object.keys(pk).map(c=><option key={c} value={c}/>)}</datalist>
<input value={packItem} onChange={e=>setPI(e.target.value)} placeholder={t("itemName")} style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!packItem.trim())return;const cat=packCat.trim()||"Other";upT(trip.id,tr=>{const p={...tr.packing};p[cat]=[...(p[cat]||[]),{item:packItem.trim(),qty:1,packed:false}];return{...tr,packing:p}});setPI("");setPC("")}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t("add")}</button></Card>}
</div>)})()}

{/* ══ BUDGET ══ */}
{tab==="budget"&&(()=>{const cur=trip.currency||"EUR";const exps=trip.expenses||[];const tS=exps.reduce((s,e)=>s+e.amount,0);const bT=trip.budget?.total||1;const grp={};exps.forEach(e=>{grp[e.cat]=(grp[e.cat]||0)+e.amount});const pie=Object.entries(grp).map(([c,v])=>({label:c,value:v,color:CAT_C[c]||C.textDim}));const hCur=currentUser?.prefs?.currency||"PLN";
return(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.primaryLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
<div><div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",fontWeight:600}}>{t("spent")}</div><div style={{fontSize:28,fontWeight:800,fontFamily:Fn}}>{fmt(tS)} <span style={{fontSize:14,color:C.textSec}}>{cur}</span></div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("budget").toUpperCase()}</div>
{eBgt&&canE?<div style={{display:"flex",gap:4}}><input value={bIn} onChange={e=>setBI(e.target.value)} autoFocus type="number" onKeyDown={e=>{if(e.key==="Enter"){const v=parseInt(bIn);if(v>0)upT(trip.id,tr=>({...tr,budget:{...tr.budget,total:v}}));setEB(false)}}} style={{width:80,padding:"5px 8px",borderRadius:8,border:`1.5px solid ${C.primary}`,fontSize:14,fontWeight:700,fontFamily:Fn,textAlign:"right"}}/>
<button onClick={()=>{const v=parseInt(bIn);if(v>0)upT(trip.id,tr=>({...tr,budget:{...tr.budget,total:v}}));setEB(false)}} style={{padding:"5px 10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>✓</button></div>
:<div onClick={canE?()=>{setEB(true);setBI(String(bT))}:undefined} style={{cursor:canE?"pointer":"default"}}><span style={{fontSize:16,fontWeight:700}}>{fmt(bT)} {cur}</span>{canE&&<span style={{fontSize:11,color:C.primary}}> ✎</span>}</div>}
<div style={{fontSize:12,color:tS<=bT?C.sage:C.danger,fontWeight:600,marginTop:2}}>{tS<=bT?`${fmt(bT-tS)} ${t("remaining")}`:`${fmt(tS-bT)} ${t("overBudget")}`}</div></div></div>
<Bar v={tS} mx={bT} color={tS<=bT?C.primary:C.danger} h={8}/></Card>

{exps.length>0&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700}}>{t("expenses")} ({exps.length})</div>
{exps.map(e=>editExp===e.id?(<div key={e.id} style={{padding:"10px 16px",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",gap:6,marginBottom:6}}><input value={editExpD.name||""} onChange={ev=>setEED(p=>({...p,name:ev.target.value}))} style={{flex:2,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={editExpD.amount||""} onChange={ev=>setEED(p=>({...p,amount:ev.target.value}))} type="number" style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/>
<select value={editExpD.currency||cur} onChange={ev=>setEED(p=>({...p,currency:ev.target.value}))} style={{padding:"6px 4px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:11,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{display:"flex",gap:6}}><select value={editExpD.cat||"Food"} onChange={ev=>setEED(p=>({...p,cat:ev.target.value}))} style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<button onClick={()=>{upT(trip.id,tr=>({...tr,expenses:tr.expenses.map(x=>x.id===e.id?{...x,...editExpD,amount:parseFloat(editExpD.amount)||x.amount}:x)}));setEE(null)}} style={{padding:"6px 14px",borderRadius:6,background:C.sage,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t("save")}</button>
<button onClick={()=>setEE(null)} style={{padding:"6px 10px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer"}}>✕</button>
<button onClick={()=>{upT(trip.id,tr=>({...tr,expenses:tr.expenses.filter(x=>x.id!==e.id)}));setEE(null)}} style={{padding:"6px 10px",borderRadius:6,background:`${C.danger}10`,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:11,cursor:"pointer"}}>🗑</button></div></div>
):(<div key={e.id} onClick={canE?()=>{setEE(e.id);setEED({name:e.name,amount:e.amount,currency:e.currency||cur,cat:e.cat})}:undefined} style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"pointer":"default"}}>
<span style={{fontSize:15}}>{CAT_I[e.cat]||"💰"}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:C.textDim}}>{e.cat} · {e.date}</div></div><div style={{fontSize:13,fontWeight:700}}>{fmt(e.amount)} {e.currency||cur}</div></div>))}</Card>}

{canE&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
{!newExpO?<div onClick={()=>{setNEO(true);setNE(p=>({...p,currency:cur}))}} style={{padding:"12px 16px",cursor:"pointer",textAlign:"center",color:C.primary,fontSize:13,fontWeight:600}}>+ {t("addExpense")}</div>
:<div style={{padding:14}}>
<div style={{display:"flex",gap:6,marginBottom:8}}><input value={newExp.name} onChange={e=>setNE(p=>({...p,name:e.target.value}))} placeholder={lang==="pl"?"Na co?":"What for?"} style={{flex:2,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={newExp.amount} onChange={e=>setNE(p=>({...p,amount:e.target.value}))} placeholder="0" type="number" style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/></div>
<div style={{display:"flex",gap:6,marginBottom:8}}><select value={newExp.cat} onChange={e=>setNE(p=>({...p,cat:e.target.value}))} style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<select value={newExp.currency} onChange={e=>setNE(p=>({...p,currency:e.target.value}))} style={{padding:"8px 6px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{display:"flex",gap:6}}><button onClick={()=>{if(!newExp.name||!newExp.amount)return;upT(trip.id,tr=>({...tr,expenses:[...tr.expenses,{id:Date.now(),name:newExp.name,cat:newExp.cat,amount:parseFloat(newExp.amount),currency:newExp.currency,payer:currentUser.id,date:"Today"}]}));setNE({name:"",cat:"Food",amount:"",currency:cur});setNEO(false)}} style={{flex:2,padding:"10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("save")}</button>
<button onClick={()=>setNEO(false)} style={{flex:1,padding:"10px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{t("cancel")}</button></div></div>}</Card>}

{exps.length>0&&<Card style={{padding:20,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:14}}>📊 {t("spendingBreakdown")}</div>
<div style={{display:"flex",gap:20,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}><Pie data={pie} size={140} currency={cur}/>
<div style={{flex:1,minWidth:140}}>{pie.sort((a,b)=>b.value-a.value).map(d=>(<div key={d.label} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:d.color}}/><span style={{fontSize:12}}>{CAT_I[d.label]} {d.label}</span></div><span style={{fontSize:12,fontWeight:700}}>{fmt(d.value)} <span style={{fontWeight:400,color:C.textDim}}>{Math.round(d.value/tS*100)}%</span></span></div><Bar v={d.value} mx={tS} color={d.color} h={4}/></div>))}</div></div></Card>}

<Card style={{padding:16,background:C.blueLight,border:`1px solid ${C.blue}22`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:8}}>💱 {t("exchangeRates")} <span style={{fontWeight:400,fontSize:10,color:C.textDim}}>({t("indicative")})</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
{hCur!==cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}>1 {hCur} = <strong>{getRate(hCur,cur).toFixed(cur==="JPY"?1:3)} {cur}</strong></div>}
{hCur!==cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}>1 {cur} = <strong>{getRate(cur,hCur).toFixed(3)} {hCur}</strong></div>}
{hCur===cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12,gridColumn:"1/3",textAlign:"center",color:C.textDim}}>{lang==="pl"?"Waluta budżetu = domowa":"Budget = home currency"} ({hCur})</div>}
</div></Card>
</div>)})()}

{/* ══ JOURNAL ══ */}
{tab==="journal"&&(<div>
{canE&&<Card style={{padding:16,marginBottom:14}} hover={false}><div style={{display:"flex",gap:10}}><Av user={currentUser} size={32}/>
<div style={{flex:1}}><textarea value={jIn} onChange={e=>setJI(e.target.value)} placeholder={t("writeMemory")} rows={3} style={{width:"100%",padding:"10px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",resize:"vertical",background:C.bg}}/>
<div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><button onClick={()=>{if(!jIn.trim())return;upT(trip.id,tr=>({...tr,journal:[...tr.journal,{id:"j"+Date.now(),date:"Now",author:currentUser.id,type:"text",content:jIn}]}));setJI("")}} style={{padding:"8px 18px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Post</button></div></div></div></Card>}
{(trip.journal||[]).length===0?<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>📓</div><div style={{fontFamily:Fn,fontWeight:700}}>{t("yourJournal")}</div></Card>
:[...trip.journal].reverse().map(j=>{const a=getU(j.author);return(<Card key={j.id} style={{padding:16,marginBottom:10}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Av user={a} size={28}/><span style={{fontSize:13,fontWeight:600}}>{a.name}</span><span style={{fontSize:11,color:C.textDim}}>{j.date}</span></div><p style={{fontSize:13,color:C.textSec,lineHeight:1.6}}>{j.content}</p></Card>)})}</div>)}

{/* ══ BOOKING ══ */}
{tab==="booking"&&(<div>
{(trip.deals||[]).length>0&&<>{trip.deals.map((d,i)=>(<Card key={i} style={{padding:14,marginBottom:10}} onClick={()=>window.open(d.url,"_blank")}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700}}>{d.name}</div><span style={{fontSize:10,fontWeight:700,color:"#fff",background:d.pColor,padding:"2px 6px",borderRadius:4,display:"inline-block",marginTop:4}}>{d.partner}</span></div><div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:800,color:C.primary,fontFamily:Fn}}>{d.price}</div><div style={{fontSize:12,color:C.primary}}>→</div></div></div></Card>))}</>}

{/* Compare Stays + Voting */}
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:6}}>🏨 {t("compareStays")}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:12}}>{t("compareStaysDesc")}</p>
{(trip.comparisons||[]).map(c=>{const pr=getU(c.proposedBy);const mv=c.votes?.[currentUser?.id];const tv=c.votes?Object.values(c.votes).filter(v=>v===1).length:0;
return(<Card key={c.id} style={{padding:14,marginBottom:10}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
<div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,cursor:"pointer",color:C.blue}} onClick={()=>window.open(c.url,"_blank")}>{c.name} ↗</div>
<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><span style={{fontSize:10,fontWeight:700,color:"#fff",background:c.source==="Airbnb"?"#FF5A5F":"#003580",padding:"2px 6px",borderRadius:4}}>{c.source}</span><span style={{fontSize:12,fontWeight:700,color:C.primary}}>{c.price}</span>{c.rating&&<span style={{fontSize:11,color:C.gold}}>★ {c.rating}</span>}</div></div>
<div style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,background:C.bgAlt}}><Av user={pr} size={18}/><span style={{fontSize:10,fontWeight:600,color:C.textSec}}>{pr.name}</span></div></div>
{c.notes&&<p style={{fontSize:12,color:C.textSec,marginBottom:6}}>{c.notes}</p>}
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
{(c.pros||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.sageLight,color:C.sage}}>✓ {p}</span>)}
{(c.cons||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.coralLight,color:C.coral}}>✕ {p}</span>)}</div>
<div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderTop:`1px solid ${C.borderLight}`}}>
{canE&&<button onClick={()=>upT(trip.id,tr=>({...tr,comparisons:tr.comparisons.map(x=>x.id===c.id?{...x,votes:{...x.votes,[currentUser.id]:mv===1?0:1}}:x)}))} style={{padding:"5px 12px",borderRadius:8,background:mv===1?C.sage:C.bgAlt,border:`1px solid ${mv===1?C.sage:C.border}`,color:mv===1?"#fff":C.textSec,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>👍 {t("approveThis")}</button>}
<span style={{fontSize:11,color:C.textDim}}>{tv} {t("votes")}</span>
{trip.travelers.map(uid=>{const u=getU(uid);return c.votes?.[uid]===1?<div key={uid} title={u.name} style={{width:20,height:20,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff"}}>{u.name[0]}</div>:null})}
</div></Card>)})}

{canE&&<Card style={{padding:14,marginBottom:16}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{t("proposePlac").toUpperCase()}</div>
<input value={compIn.name} onChange={e=>setCI(p=>({...p,name:e.target.value}))} placeholder={lang==="pl"?"Nazwa hotelu":"Hotel name"} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
<input value={compIn.url} onChange={e=>setCI(p=>({...p,url:e.target.value}))} placeholder="Link (Booking/Airbnb)" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
<div style={{display:"flex",gap:6,marginBottom:6}}><input value={compIn.price} onChange={e=>setCI(p=>({...p,price:e.target.value}))} placeholder={lang==="pl"?"np. €75/noc":"e.g. €75/night"} style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/>
<input value={compIn.notes} onChange={e=>setCI(p=>({...p,notes:e.target.value}))} placeholder={lang==="pl"?"Dlaczego?":"Why?"} style={{flex:2,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!compIn.name||!compIn.url)return;upT(trip.id,tr=>({...tr,comparisons:[...(tr.comparisons||[]),{id:"c"+Date.now(),name:compIn.name,url:compIn.url,price:compIn.price,notes:compIn.notes,rating:null,source:compIn.url.includes("airbnb")?"Airbnb":"Booking.com",proposedBy:currentUser.id,pros:[],cons:[],votes:{[currentUser.id]:1}}]}));setCI({name:"",url:"",price:"",notes:""})}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t("add")}</button></Card>}

{/* Car Rental */}
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:6}}>🚗 {t("carRental")}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:10}}>{t("carRentalDesc")}</p>
{CAR_RENTALS.map(cr=>(<Card key={cr.name} style={{padding:14,marginBottom:8}} onClick={()=>window.open(cr.url,"_blank")}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{cr.icon}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{cr.name}</div><div style={{fontSize:11,color:C.textSec}}>{cr.d[lang]}</div></div><span style={{fontSize:12,color:C.primary}}>→</span></div></Card>))}

{/* Insurance */}
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:6}}>🛡️ {t("travelInsurance")}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:10}}>{t("insuranceDesc")}</p>
{INSURANCES.map(ins=>(<Card key={ins.name} style={{padding:14,marginBottom:8}} onClick={()=>window.open(ins.url,"_blank")}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{ins.icon}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{ins.name}</div><div style={{fontSize:11,color:C.textSec}}>{ins.d[lang]}</div></div><span style={{fontSize:12,color:C.primary}}>→</span></div></Card>))}
</div>)}

</div></div>)}

{/* ═══ MODALS ═══ */}
{/* Wizard */}
<Modal open={showWiz} onClose={()=>{setSW(false);setWS(0)}} title={[t("whereGoing"),t("whenWho"),t("almostThere")][wStep]}>
{wStep===0&&<div><input value={wData.dest} onChange={e=>setWD(p=>({...p,dest:e.target.value}))} placeholder={lang==="pl"?"Cel — np. Barcelona, Kyoto...":"Destination..."} autoFocus style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{["Barcelona","Kyoto","Reykjavik","Marrakech","Vienna","Bali"].map(d=><Pill key={d} onClick={()=>setWD(p=>({...p,dest:d}))} active={wData.dest===d}>{d}</Pill>)}</div>
<button disabled={!wData.dest} onClick={()=>setWS(1)} style={{width:"100%",padding:"14px",borderRadius:12,background:wData.dest?C.primary:C.border,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:wData.dest?"pointer":"default",fontFamily:"inherit"}}>{lang==="pl"?"Dalej →":"Next →"}</button></div>}
{wStep===1&&<div><div style={{display:"flex",gap:10,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Od":"From"}</label><input type="date" value={wData.startDate} onChange={e=>setWD(p=>({...p,startDate:e.target.value}))} style={{width:"100%",padding:"10px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Do":"To"}</label><input type="date" value={wData.endDate} onChange={e=>setWD(p=>({...p,endDate:e.target.value}))} style={{width:"100%",padding:"10px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div></div>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{t("travelers")}</label>
<div style={{display:"flex",gap:6,marginBottom:12}}>{[1,2,3,4,5,"6+"].map(n=><Pill key={n} active={wData.travelers===n} onClick={()=>setWD(p=>({...p,travelers:n}))}>{n}</Pill>)}</div>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWS(0)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>←</button><button onClick={()=>setWS(2)} style={{flex:2,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Dalej →":"Next →"}</button></div></div>}
{wStep===2&&<div><input value={wData.name} onChange={e=>setWD(p=>({...p,name:e.target.value}))} placeholder={`"${wData.dest} Adventure"`} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,marginBottom:16}}/>
<Card style={{padding:16,marginBottom:16,background:C.bgAlt}} hover={false}><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:4}}>{t("tripSummary")}</div><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>{wData.name||`${wData.dest} Trip`}</div><div style={{fontSize:12,color:C.textSec}}>📍 {wData.dest} · 📅 {wData.startDate||"?"} – {wData.endDate||"?"} · 👥 {wData.travelers}</div></Card>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWS(1)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>←</button><button onClick={createTrip} style={{flex:2,padding:"14px",borderRadius:12,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t("createTrip")}</button></div></div>}
</Modal>

{/* Add Day */}
<Modal open={showAddDay} onClose={()=>setSAD(false)} title={t("addDay")}>
<input value={newDay.title} onChange={e=>setND(p=>({...p,title:e.target.value}))} placeholder={t("dayTitle")} autoFocus style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:8}}/>
<input type="date" value={newDay.date} onChange={e=>setND(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<button onClick={()=>{if(!newDay.title)return;upT(trip.id,tr=>({...tr,dayData:[...tr.dayData,{day:tr.dayData.length+1,date:newDay.date||`Day ${tr.dayData.length+1}`,title:newDay.title,items:[],weather:null,img:null}]}));setND({title:"",date:""});setSAD(false)}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t("add")}</button></Modal>

{/* Add Activity */}
<Modal open={showAddAct!==null} onClose={()=>setSAA(null)} title={t("addActivity")}>
<input value={newAct.name} onChange={e=>setNA(p=>({...p,name:e.target.value}))} placeholder={t("activityName")} autoFocus style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:8}}/>
<div style={{display:"flex",gap:8,marginBottom:8}}>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("time")}</label><input type="time" value={newAct.time} onChange={e=>setNA(p=>({...p,time:e.target.value}))} style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("duration")}</label><select value={newAct.duration} onChange={e=>setNA(p=>({...p,duration:e.target.value}))} style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}>{["30min","45min","1h","1.5h","2h","2.5h","3h","4h"].map(d=><option key={d}>{d}</option>)}</select></div>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("type")}</label><select value={newAct.type} onChange={e=>setNA(p=>({...p,type:e.target.value}))} style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}>{Object.keys(tE).map(tp=><option key={tp}>{tp}</option>)}</select></div></div>
<div style={{display:"flex",gap:8,marginBottom:12}}><input value={newAct.desc} onChange={e=>setNA(p=>({...p,desc:e.target.value}))} placeholder={lang==="pl"?"Opis":"Description"} style={{flex:2,padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/>
<input value={newAct.cost} onChange={e=>setNA(p=>({...p,cost:parseInt(e.target.value)||0}))} placeholder={t("cost")} type="number" style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg,textAlign:"right"}}/></div>
<p style={{fontSize:11,color:C.textDim,marginBottom:10}}>{lang==="pl"?"Propozycja wymaga głosowania (>50%).":"Requires voting (>50%)."}</p>
<button onClick={()=>{if(!newAct.name||showAddAct===null)return;upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,i)=>i===showAddAct?{...d,items:[...d.items,{id:"a"+Date.now(),time:newAct.time,name:newAct.name,desc:newAct.desc,type:newAct.type,duration:newAct.duration,cost:newAct.cost,rating:0,votes:{[currentUser.id]:1},fav:{},status:trip.travelers.length<=1?"approved":"pending"}]}:d)}));setSAA(null)}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ {t("proposeActivity")}</button></Modal>

{/* Invite */}
<Modal open={showInv} onClose={()=>setSI(false)} title={t("inviteSomeone")}>
<input value={invEmail} onChange={e=>setIE(e.target.value)} placeholder="friend@email.com" style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
{[{id:"companion",t:tO(ROLES.companion.l),d:lang==="pl"?"Edycja planu, budżet, dziennik.":"Edit plan, budget, journal.",i:"🤝"},{id:"observer",t:tO(ROLES.observer.l),d:lang==="pl"?"Tylko podgląd.":"View only.",i:"👁️"}].map(r=>(<div key={r.id} onClick={()=>setIR(r.id)} style={{padding:14,borderRadius:12,border:`1.5px solid ${invRole===r.id?C.primary:C.border}`,marginBottom:8,cursor:"pointer",background:invRole===r.id?C.primaryLight:"transparent"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{r.i}</span><div><div style={{fontSize:13,fontWeight:600}}>{r.t}</div><div style={{fontSize:11,color:C.textSec}}>{r.d}</div></div></div></div>))}
<button onClick={()=>{setSI(false);setIE("")}} style={{width:"100%",marginTop:8,padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Wyślij zaproszenie":"Send Invitation"}</button></Modal>

{/* Profile */}
<Modal open={showProf} onClose={()=>setSP(false)} title={t("myProfile")} wide>
{currentUser&&<>
<div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}><Av user={currentUser} size={56}/><div><div style={{fontSize:18,fontWeight:800,fontFamily:Fn}}>{currentUser.name}</div><div style={{fontSize:12,color:C.textSec}}>{currentUser.email}</div><span style={{fontSize:10,fontWeight:700,color:ROLES[currentUser.role].color,background:`${ROLES[currentUser.role].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase",marginTop:4,display:"inline-block"}}>{tO(ROLES[currentUser.role].l)}</span></div></div>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:6}}>{t("profilePhoto").toUpperCase()}</div>
<input value={currentUser.photoUrl||""} onChange={e=>{const v=e.target.value;setCU(p=>({...p,photoUrl:v}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,photoUrl:v}:u))}} placeholder="https://..." style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:14,background:C.bg}}/>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{t("socialMedia").toUpperCase()}</div>
{[{k:"instagram",i:"📸",p:"@username"},{k:"facebook",i:"📘",p:"Link"},{k:"tiktok",i:"🎵",p:"@username"},{k:"youtube",i:"▶️",p:"Channel"}].map(s=>(<div key={s.k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:14,width:24}}>{s.i}</span><input value={currentUser.social?.[s.k]||""} onChange={e=>{const v=e.target.value;setCU(p=>({...p,social:{...p.social,[s.k]:v}}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,social:{...u.social,[s.k]:v}}:u))}} placeholder={s.p} style={{flex:1,padding:"7px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>))}

{/* Travel Friends */}
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:6}}>🫂 {t("travelFriends")}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:10}}>{t("travelFriendsDesc")}</p>
{(currentUser.friends||[]).length===0&&<p style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>{t("noFriendsYet")}</p>}
{(currentUser.friends||[]).map(fid=>{const f=getU(fid);return(<div key={fid} style={{padding:"8px 0",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.borderLight}`}}><Av user={f} size={28}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{f.name}</div><div style={{fontSize:11,color:C.textDim}}>{f.email}</div></div><button onClick={()=>{setCU(p=>({...p,friends:p.friends.filter(x=>x!==fid)}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,friends:u.friends.filter(x=>x!==fid)}:u))}} style={{background:"none",border:"none",color:C.danger,fontSize:12,cursor:"pointer"}}>✕</button></div>)})}
{!showAF?<button onClick={()=>setSAF(true)} style={{marginTop:8,padding:"8px 16px",borderRadius:8,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t("addFriend")}</button>
:<div style={{marginTop:8}}><input value={fSearch} onChange={e=>setFS(e.target.value)} placeholder={lang==="pl"?"Szukaj...":"Search..."} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
{users.filter(u=>u.id!==currentUser.id&&!(currentUser.friends||[]).includes(u.id)&&(u.name.toLowerCase().includes(fSearch.toLowerCase())||u.email.toLowerCase().includes(fSearch.toLowerCase()))).map(u=>(<div key={u.id} onClick={()=>{setCU(p=>({...p,friends:[...(p.friends||[]),u.id]}));setUsers(us=>us.map(x=>x.id===currentUser.id?{...x,friends:[...(x.friends||[]),u.id]}:x));setSAF(false);setFS("")}} style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:8,borderRadius:8,cursor:"pointer",border:`1px solid ${C.border}`,marginBottom:4}}><Av user={u} size={24}/><span style={{fontSize:12,fontWeight:600}}>{u.name}</span><span style={{fontSize:11,color:C.textDim}}>{u.email}</span></div>))}</div>}

<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:10}}>{t("tripStats")}</div>
<div style={{display:"flex",gap:10}}>{[{l:lang==="pl"?"Podróże":"Trips",v:trips.filter(tr=>tr.travelers.includes(currentUser.id)).length},{l:lang==="pl"?"Kraje":"Countries",v:3},{l:lang==="pl"?"Dni":"Days",v:13}].map(s=>(<div key={s.l} style={{flex:1,padding:12,background:C.bgAlt,borderRadius:12,textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,fontFamily:Fn,color:C.primary}}>{s.v}</div><div style={{fontSize:10,color:C.textDim}}>{s.l}</div></div>))}</div>

<button onClick={()=>{setLoggedIn(false);setCU(null);setScr("home");setAT(null);setSP(false)}} style={{width:"100%",marginTop:20,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("signOut")}</button>
</>}</Modal>

{/* Travelers */}
<Modal open={showTrav} onClose={()=>setST(false)} title={t("tripMembers")} wide>
{trip&&<>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8,textTransform:"uppercase"}}>{t("travelers")} ({trip.travelers.length})</div>
{trip.travelers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}><Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div>{u.social?.instagram&&<span style={{fontSize:10,color:C.purple}}>📸 {u.social.instagram}</span>}</div><span style={{fontSize:10,fontWeight:700,color:ROLES[u.role||"user"].color,background:`${ROLES[u.role||"user"].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{tO(ROLES[u.role||"user"].l)}</span></div>)})}
{(trip.observers||[]).length>0&&<><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginTop:16,marginBottom:8,textTransform:"uppercase"}}>{t("observers")} ({trip.observers.length})</div>{trip.observers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}><Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div></div><span style={{fontSize:10,fontWeight:700,color:ROLES.observer.color,background:`${ROLES.observer.color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{tO(ROLES.observer.l)}</span></div>)})}</>}
{canE&&<button onClick={()=>{setST(false);setSI(true)}} style={{width:"100%",marginTop:16,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("inviteSomeone")}</button>}
</>}</Modal>

{/* Save/Load Packing */}
<Modal open={showSP2} onClose={()=>setSP2(false)} title={`💾 ${t("saveList")}`}>
<input value={spName} onChange={e=>setSPN(e.target.value)} placeholder={lang==="pl"?"Nazwa listy":"List name"} autoFocus style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<button onClick={()=>{if(!spName.trim()||!trip)return;setSL(p=>[...p,{id:"sl_"+Date.now(),name:spName.trim(),items:{...trip.packing}}]);setSP2(false);setSPN("")}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.sage,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t("save")}</button></Modal>

<Modal open={showLP} onClose={()=>setSLP(false)} title={`📂 ${t("loadList")}`}>
{savedLists.map(sl=>(<Card key={sl.id} style={{padding:14,marginBottom:8,cursor:"pointer"}} onClick={()=>{if(!trip)return;const np={};Object.entries(sl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,tr=>({...tr,packing:{...tr.packing,...np}}));setSLP(false)}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:14,fontWeight:600}}>{sl.name}</div><div style={{fontSize:11,color:C.textDim}}>{Object.values(sl.items).flat().length} items</div></div><button onClick={e=>{e.stopPropagation();setSL(p=>p.filter(x=>x.id!==sl.id))}} style={{background:"none",border:"none",color:C.danger,fontSize:14,cursor:"pointer"}}>🗑</button></div></Card>))}
{savedLists.length===0&&<div style={{textAlign:"center",padding:20,color:C.textDim}}>{lang==="pl"?"Brak zapisanych list.":"No saved lists."}</div>}</Modal>

</div>)}
