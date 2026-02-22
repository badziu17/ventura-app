import { useState, useEffect, useRef } from "react";
/* ═══════════════════════════════════════════════════════
   VENTURA v4.0 — Travel Planning App
   Features: swipe photos, editable packing+save/load,
   editable expenses+currency, exchange rates, fintech
   budget visuals, delete trips, profile photo+social,
   compare stays with proposer attribution
   ═══════════════════════════════════════════════════════ */

// ── Design Tokens ──
const C={bg:"#FEFBF6",bgAlt:"#F7F3ED",white:"#FFFFFF",border:"#E8E2D9",borderLight:"#F0EBE3",primary:"#C4704B",primaryLight:"#F9EDE7",primaryDark:"#A85A38",blue:"#2563EB",blueLight:"#EFF6FF",sage:"#5F8B6A",sageLight:"#ECF4EE",coral:"#E8734A",coralLight:"#FEF0EB",gold:"#D4A853",goldLight:"#FDF8EC",purple:"#7C5CFC",purpleLight:"#F3F0FF",text:"#2C1810",textSec:"#6B5B4F",textDim:"#A09486",danger:"#DC3545",shadow:"0 1px 3px rgba(44,24,16,0.06),0 4px 12px rgba(44,24,16,0.04)",shadowMd:"0 2px 8px rgba(44,24,16,0.08),0 8px 24px rgba(44,24,16,0.06)"};
const F="'Fraunces',serif";
const fmt=n=>n!=null?n.toLocaleString("en",{maximumFractionDigits:0}):"0";
const CURS=["PLN","EUR","RON","USD","GBP","CZK","JPY","CHF"];

// ── Category config ──
const CAT_I={Accommodation:"🏨",Food:"🍽️",Activities:"🎟️",Shopping:"🛍️",Transport:"🚗",Other:"💰"};
const CAT_C={Accommodation:"#2563EB",Food:"#E8734A",Activities:"#7C5CFC",Shopping:"#D4A853",Transport:"#5F8B6A",Other:"#A09486"};

// ── Exchange rates (demo — static, labeled as indicative) ──
const RATES={"PLN":{"EUR":0.234,"RON":1.17,"USD":0.253,"GBP":0.199,"CZK":5.87,"JPY":38.5,"CHF":0.218},"EUR":{"PLN":4.28,"RON":4.97,"USD":1.08,"GBP":0.855,"CZK":25.1,"JPY":164.5,"CHF":0.935},"RON":{"PLN":0.856,"EUR":0.201,"USD":0.217,"GBP":0.172,"CZK":5.05,"JPY":33.1,"CHF":0.188},"USD":{"PLN":3.95,"EUR":0.925,"RON":4.61,"GBP":0.79,"CZK":23.3,"JPY":152.5,"CHF":0.866},"GBP":{"PLN":5.02,"EUR":1.17,"RON":5.83,"USD":1.27,"CZK":29.4,"JPY":193,"CHF":1.10},"CZK":{"PLN":0.17,"EUR":0.0398,"RON":0.198,"USD":0.0429,"GBP":0.034,"JPY":6.55,"CHF":0.037},"JPY":{"PLN":0.026,"EUR":0.00608,"RON":0.0302,"USD":0.00656,"GBP":0.00518,"CZK":0.153,"CHF":0.00569},"CHF":{"PLN":4.58,"EUR":1.07,"RON":5.32,"USD":1.155,"GBP":0.912,"CZK":26.8,"JPY":176}};
const getRate=(from,to)=>{if(from===to)return 1;return RATES[from]?.[to]||1};
const DEST_CUR={"Romania":"RON","Japan":"JPY","Portugal":"EUR","Spain":"EUR","Iceland":"ISK","Italy":"EUR","Morocco":"MAD","Indonesia":"IDR","Czech":"CZK","France":"EUR","Germany":"EUR","UK":"GBP","USA":"USD","Switzerland":"CHF"};
const getDestCur=dest=>{if(!dest)return"EUR";for(const[country,cur]of Object.entries(DEST_CUR)){if(dest.includes(country))return cur}return"EUR"};

// ── Photos ──
const DEST_PHOTOS={"Bucharest, Romania":["https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1585407925232-33158f7be498?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=800&h=400&fit=crop&q=80"],"Tokyo, Japan":["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=400&fit=crop&q=80"],"Lisbon, Portugal":["https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1536663815808-535e2280d2c2?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop&q=80","https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=400&fit=crop&q=80"]};
const INSP=[{name:"Kyoto",img:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=240&h=320&fit=crop&q=80"},{name:"Barcelona",img:"https://images.unsplash.com/photo-1583422409516-2895a77efded?w=240&h=320&fit=crop&q=80"},{name:"Iceland",img:"https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=240&h=320&fit=crop&q=80"},{name:"Amalfi",img:"https://images.unsplash.com/photo-1533606688076-b6683a5103a4?w=240&h=320&fit=crop&q=80"},{name:"Morocco",img:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=240&h=320&fit=crop&q=80"}];

// ── Packing Templates (reusable) ──
const PACK_TPL=[
{id:"winter",name:"Winter City",icon:"❄️",items:{"Clothing":[{item:"Warm jacket",qty:1},{item:"Sweaters",qty:3},{item:"Thermal underwear",qty:2},{item:"Scarf & gloves",qty:1},{item:"Warm hat",qty:1},{item:"Walking boots",qty:1}],"Toiletries":[{item:"Hand cream",qty:1},{item:"Lip balm",qty:1},{item:"Toothbrush & paste",qty:1}],"Electronics":[{item:"Phone charger",qty:1},{item:"Power bank",qty:1},{item:"Travel adapter",qty:1}],"Documents":[{item:"ID / Passport",qty:1},{item:"Booking confirmations",qty:1},{item:"Travel insurance",qty:1}]}},
{id:"summer",name:"Summer Beach",icon:"☀️",items:{"Clothing":[{item:"T-shirts",qty:5},{item:"Shorts",qty:3},{item:"Swimsuit",qty:2},{item:"Sandals",qty:1},{item:"Sun hat",qty:1}],"Beach":[{item:"Sunscreen SPF50",qty:1},{item:"Sunglasses",qty:1},{item:"Beach towel",qty:1}],"Electronics":[{item:"Phone charger",qty:1},{item:"Waterproof phone case",qty:1}],"Documents":[{item:"ID / Passport",qty:1},{item:"Booking confirmations",qty:1}]}},
{id:"business",name:"Business Trip",icon:"💼",items:{"Clothing":[{item:"Suits",qty:2},{item:"Dress shirts",qty:3},{item:"Dress shoes",qty:1},{item:"Belt",qty:1}],"Work":[{item:"Laptop & charger",qty:1},{item:"Notebook & pen",qty:1},{item:"Business cards",qty:1}],"Toiletries":[{item:"Deodorant",qty:1},{item:"Toothbrush",qty:1}],"Documents":[{item:"ID / Passport",qty:1},{item:"Company cards",qty:1}]}},
{id:"backpack",name:"Backpacking",icon:"🎒",items:{"Clothing":[{item:"Quick-dry shirts",qty:4},{item:"Hiking pants",qty:2},{item:"Rain jacket",qty:1},{item:"Hiking boots",qty:1}],"Gear":[{item:"Daypack",qty:1},{item:"Water bottle",qty:1},{item:"First aid kit",qty:1},{item:"Headlamp",qty:1}],"Electronics":[{item:"Phone charger",qty:1},{item:"Power bank",qty:1},{item:"Universal adapter",qty:1}],"Documents":[{item:"Passport",qty:1},{item:"Document copies",qty:1}]}}
];
const AI_SUGG=["Universal adapter","Reusable water bottle","Portable umbrella","Travel pillow","Ziplock bags","Snacks for flight","Hand sanitizer","Offline maps downloaded","Local SIM / eSIM","Pen for customs forms","Mini first aid kit","Earplugs & eye mask"];
const DONT_FORGET=["🛂 Passport / ID — check expiry date!","🔌 Phone charger + power bank","📋 Travel insurance documents","💊 Prescription medications","📱 Offline copies of all bookings","🏦 Notify your bank about travel dates","💳 Card with no foreign transaction fees"];

// ── Roles ──
const ROLES={admin:{label:"Admin",color:C.danger,perms:["edit_trip","manage_users","delete_trip","invite","edit_budget","journal","view_all"]},user:{label:"Traveler",color:C.blue,perms:["edit_trip","invite","edit_budget","journal","view_all"]},companion:{label:"Companion",color:C.sage,perms:["edit_trip","edit_budget","journal","view_all"]},observer:{label:"Observer",color:C.gold,perms:["view_all"]},guest:{label:"Guest",color:C.textDim,perms:["view_all"]}};

// ── Users ──
const USERS_INIT=[
{id:"u1",name:"Bartek",email:"bartek@ventura.app",color:C.blue,role:"admin",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},prefs:{currency:"PLN",dietaryNeeds:"None",travelStyle:"Cultural Explorer",languages:["PL","EN","JP"],homeAirport:"GDN"}},
{id:"u2",name:"Anna",email:"anna@ventura.app",color:C.coral,role:"user",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},prefs:{currency:"PLN",dietaryNeeds:"Vegetarian",travelStyle:"Foodie & Culture",languages:["PL","EN"],homeAirport:"GDN"}},
{id:"u3",name:"Marek",email:"marek@gmail.com",color:C.purple,role:"observer",photoUrl:"",social:{instagram:"",facebook:"",tiktok:"",youtube:""},prefs:{currency:"PLN",travelStyle:"Adventurer",languages:["PL","EN"],homeAirport:"WAW"}}
];

// ── Trip Data ──
const INIT_TRIPS=[
{id:"bucharest",name:"Bucharest Discovery",dest:"Bucharest, Romania",dates:"Mar 7 – 9, 2026",travelers:["u1","u2"],observers:["u3"],days:3,status:"upcoming",currency:"RON",
heroImg:"https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&h=280&fit=crop&q=80",
budget:{total:3500},completeness:92,
journal:[{id:"j1",date:"Feb 28",author:"u1",type:"text",content:"Booked the Transylvania day tour! Can't wait to see Peleș Castle."},{id:"j2",date:"Mar 1",author:"u2",type:"text",content:"Packed my camera bag — bringing the 35mm and 85mm lenses."}],
memories:null,
comparisons:[
{id:"c1",name:"Marmorosch Bucharest",url:"https://www.booking.com/hotel/ro/marmorosch-bucharest-autograph-collection.html",price:"€89/night",rating:"9.1",source:"Booking.com",proposedBy:"u1",notes:"Autograph Collection, perfect Old Town location. Rooftop bar!",pros:["Central location","Rooftop bar","Historic building"],cons:["Pricey","No pool"]},
{id:"c2",name:"Old Town Studio Apt",url:"https://www.airbnb.com/rooms/example",price:"€52/night",rating:"4.7",source:"Airbnb",proposedBy:"u2",notes:"Kitchen + washer. Quiet street near Lipscani.",pros:["Kitchen","Cheaper","Local vibe"],cons:["No reception","5th floor no elevator"]}
],
dayData:[
{day:1,date:"Sat, Mar 7",title:"Historic Center Walk",img:"https://images.unsplash.com/photo-1585407925232-33158f7be498?w=600&h=200&fit=crop&q=80",weather:{hi:12,lo:4,icon:"sun"},items:[
{time:"09:00",name:"Ogrody Cismigiu",desc:"Oldest park in Bucharest",type:"sight",duration:"1h",cost:0,rating:4.5},
{time:"10:15",name:"Palatul Kretzulescu",type:"sight",duration:"30min",cost:0,rating:4.3},
{time:"12:00",name:"Lunch: Caru' cu Bere",desc:"Iconic 1879 beer hall",type:"food",duration:"1.5h",cost:120,rating:4.4},
{time:"14:00",name:"Muzeum Sztuki",desc:"National Art Museum",type:"museum",duration:"2h",cost:30,rating:4.5},
{time:"16:30",name:"Ateneul Roman",desc:"1888 concert hall",type:"sight",duration:"45min",cost:25,rating:4.8},
{time:"20:15",name:"Dinner: Grand Cafe Van Gogh",type:"food",duration:"1.5h",cost:180,rating:4.3}]},
{day:2,date:"Sun, Mar 8",title:"Castles of Transylvania",img:"https://images.unsplash.com/photo-1596379448498-e498b9e7ba0b?w=600&h=200&fit=crop&q=80",weather:{hi:9,lo:1,icon:"cloud"},items:[
{time:"07:00",name:"Departure to Sinaia",type:"transport",duration:"2h",cost:0},
{time:"09:30",name:"Castelul Peles",desc:"Neo-Renaissance palace",type:"sight",duration:"2h",cost:80,rating:4.8},
{time:"12:00",name:"Lunch in Sinaia",type:"food",duration:"1h",cost:90,rating:4.2},
{time:"13:30",name:"Castelul Bran",desc:"Dracula's castle",type:"sight",duration:"1.5h",cost:60,rating:4.3},
{time:"15:30",name:"Brasov Old Town",type:"sight",duration:"2h",cost:15,rating:4.6},
{time:"18:00",name:"Return to Bucharest",type:"transport",duration:"2.5h",cost:0}]},
{day:3,date:"Mon, Mar 9",title:"Parliament & Farewell",img:"https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&h=200&fit=crop&q=80",weather:{hi:14,lo:5,icon:"partlysunny"},items:[
{time:"10:00",name:"Palatul Parlamentului",desc:"World's 2nd largest building",type:"sight",duration:"2h",cost:50,rating:4.6},
{time:"13:15",name:"Lacrimi si Sfinti",desc:"Award-winning Romanian",type:"food",duration:"1.5h",cost:150,rating:4.6},
{time:"15:00",name:"Calea Victoriei",type:"sight",duration:"1h",cost:25,rating:4.5},
{time:"17:30",name:"Bolt to Airport",type:"transport",duration:"45min",cost:60}]}],
expenses:[
{id:1,name:"Hotel Marmorosch",cat:"Accommodation",amount:1200,currency:"RON",payer:"u1",date:"Mar 7"},
{id:2,name:"Caru' cu Bere",cat:"Food",amount:120,currency:"RON",payer:"u2",date:"Mar 7"},
{id:3,name:"Museum tickets",cat:"Activities",amount:55,currency:"RON",payer:"u1",date:"Mar 7"},
{id:4,name:"Transylvania tour",cat:"Activities",amount:600,currency:"RON",payer:"u1",date:"Mar 8"},
{id:5,name:"Lacrimi si Sfinti",cat:"Food",amount:150,currency:"RON",payer:"u1",date:"Mar 9"},
{id:6,name:"Bolt to airport",cat:"Transport",amount:60,currency:"RON",payer:"u1",date:"Mar 9"}],
packing:{"Clothing":[{item:"Warm layers",qty:3,packed:true},{item:"Winter jacket",qty:1,packed:true},{item:"Walking shoes",qty:1,packed:true},{item:"Scarf & gloves",qty:1,packed:false}],"Electronics":[{item:"Phone chargers",qty:2,packed:true},{item:"Power bank",qty:1,packed:true},{item:"EU adapter",qty:1,packed:false}],"Documents":[{item:"ID cards",qty:2,packed:false},{item:"Booking confirmations",qty:1,packed:false},{item:"Castle tickets",qty:2,packed:false}]},
deals:[{name:"Marmorosch Bucharest",price:"€89/night",partner:"Booking.com",pColor:"#003580",url:"https://www.booking.com/hotel/ro/marmorosch-bucharest-autograph-collection.html"},{name:"Transylvania Day Tour",price:"€45/pp",partner:"GetYourGuide",pColor:"#FF5533",url:"https://www.getyourguide.com/bucharest-l347/from-bucharest-transylvania-castles-full-day-tour-t66866/"},{name:"Parliament Skip-the-Line",price:"€12/pp",partner:"Viator",pColor:"#5B1FA8",url:"https://www.viator.com/tours/Bucharest/Palace-of-Parliament-Skip-the-Line-Ticket-and-Guided-Tour/d22407-41714P2"}]},
{id:"japan",name:"Tokyo Adventure",dest:"Tokyo, Japan",dates:"May 10 – 18, 2026",travelers:["u1","u2"],observers:[],days:8,status:"planning",currency:"JPY",
heroImg:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=280&fit=crop&q=80",
budget:{total:15000},completeness:28,journal:[],memories:null,dayData:[],expenses:[],packing:{},deals:[],comparisons:[],
planningTips:[{icon:"🏨",title:"Book accommodation",desc:"8 nights — Shinjuku or Shibuya.",done:false,priority:"high"},{icon:"✈️",title:"Book flights GDN → NRT",desc:"LOT via WAW or Finnair via HEL.",done:false,priority:"high"},{icon:"🚄",title:"Get Japan Rail Pass",desc:"7-day JR Pass for day trips.",done:false,priority:"medium"},{icon:"📱",title:"Order eSIM",desc:"Ubigi or Airalo.",done:false,priority:"medium"},{icon:"🗺️",title:"Plan daily itinerary",desc:"Asakusa, Shibuya, Akihabara, teamLab.",done:false,priority:"medium"},{icon:"🍣",title:"Restaurant reservations",desc:"Book 1-2 months ahead.",done:false,priority:"low"},{icon:"🎒",title:"Create packing list",desc:"May: 18-25°C, rainy season late May.",done:false,priority:"low"}]},
{id:"lisbon",name:"Lisbon & Sintra",dest:"Lisbon, Portugal",dates:"Sep 12 – 16, 2025",travelers:["u1","u2"],observers:[],days:5,status:"past",currency:"EUR",
heroImg:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=280&fit=crop&q=80",
budget:{total:5000},completeness:100,
journal:[{id:"lj1",date:"Sep 12",author:"u1",type:"text",content:"Golden hour over the Tagus from Alfama viewpoint."},{id:"lj2",date:"Sep 13",author:"u2",type:"text",content:"Sintra was a fairytale! Pena Palace colors vivid in person."}],
memories:{totalSpent:4650,topMoments:["Sunset from Miradouro da Graça","Pastéis de Belém at 8am","Pena Palace gardens","LX Factory bookshop"],stats:{stepsTaken:"78,400",photosShared:142,placesVisited:28,mealsEaten:15},highlights:[{title:"Best meal",value:"Cervejaria Ramiro — garlic prawns",icon:"🍽️"},{title:"Most walked day",value:"Day 2: Sintra — 22,800 steps",icon:"🚶"},{title:"Best photo spot",value:"Miradouro da Senhora do Monte",icon:"📸"},{title:"Biggest surprise",value:"LX Factory",icon:"✨"}],budgetSummary:{planned:5000,actual:4650,underBudget:true}},
comparisons:[],
dayData:[{day:1,date:"Fri, Sep 12",title:"Arrival & Alfama",img:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=200&fit=crop&q=80",weather:{hi:28,lo:18,icon:"sun"},items:[{time:"14:00",name:"Check-in",type:"sight",duration:"30min",cost:0},{time:"15:00",name:"Miradouro da Graça",type:"sight",duration:"45min",cost:0,rating:4.8},{time:"19:00",name:"Taberna da Rua das Flores",type:"food",duration:"2h",cost:120,rating:4.6}]}],
expenses:[{id:1,name:"Hotel Alfama",cat:"Accommodation",amount:1800,currency:"EUR",payer:"u1",date:"Sep 12"},{id:2,name:"Cervejaria Ramiro",cat:"Food",amount:180,currency:"EUR",payer:"u2",date:"Sep 14"}],packing:{},deals:[]}
];

// ═══════════════ COMPONENTS ═══════════════
const tE={sight:"📍",food:"🍽️",museum:"🖼️",shopping:"🛍️",transport:"🚌"};
const WI=({t})=>t==="sun"?<span>☀️</span>:t==="cloud"?<span>⛅</span>:t==="rain"?<span>🌧️</span>:<span>🌤️</span>;
const Pill=({children,color=C.primary,active,onClick})=><button onClick={onClick} style={{padding:"7px 16px",borderRadius:99,fontSize:13,fontWeight:500,background:active?color:"transparent",color:active?"#fff":C.textSec,border:active?"none":`1.5px solid ${C.border}`,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit",whiteSpace:"nowrap"}}>{children}</button>;
const Card=({children,style:sx,onClick,hover=true})=><div onClick={onClick} style={{background:C.white,borderRadius:16,border:`1px solid ${C.borderLight}`,boxShadow:C.shadow,transition:"all 0.2s",cursor:onClick?"pointer":"default",...sx}} onMouseEnter={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadowMd;e.currentTarget.style.transform="translateY(-1px)"}}} onMouseLeave={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform="translateY(0)"}}}>{children}</div>;
const Bar=({v,mx,color=C.primary,h=6})=><div style={{width:"100%",height:h,background:C.bgAlt,borderRadius:h,overflow:"hidden"}}><div style={{width:`${Math.min(v/mx*100,100)}%`,height:h,borderRadius:h,background:v>mx?C.danger:color,transition:"width 0.6s"}}/></div>;
const Av=({user,size=32})=>{if(user?.photoUrl)return<img src={user.photoUrl} alt="" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`2px solid ${user.color||C.border}`}}/>;return<div style={{width:size,height:size,borderRadius:"50%",background:user?.color||C.textDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,fontWeight:700,color:"#fff",flexShrink:0}}>{(user?.name||"?")[0]}</div>};
const Img=({src,alt,style:sx})=>{const[e,setE]=useState(false);if(e)return<div style={{...sx,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim}}>🗺️</div>;return<img src={src} alt={alt||""} style={{objectFit:"cover",display:"block",...sx}} onError={()=>setE(true)}/>};

// ── [FEATURE 5] Swipeable Photo Carousel ──
const PhotoSlider=({dest})=>{
const photos=DEST_PHOTOS[dest]||[];const[idx,setIdx]=useState(0);const touchRef=useRef(null);
useEffect(()=>{if(photos.length<2)return;const t=setInterval(()=>setIdx(p=>(p+1)%photos.length),4500);return()=>clearInterval(t)},[photos.length]);
const onTS=e=>{touchRef.current=e.touches[0].clientX};
const onTE=e=>{if(touchRef.current===null)return;const dx=e.changedTouches[0].clientX-touchRef.current;if(Math.abs(dx)>40){setIdx(p=>dx<0?(p+1)%photos.length:(p-1+photos.length)%photos.length)}touchRef.current=null};
if(!photos.length)return<div style={{height:150,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,borderRadius:"0 0 16px 16px"}}/>;
return(<div style={{position:"relative",height:150,overflow:"hidden",borderRadius:"0 0 16px 16px",touchAction:"pan-y"}} onTouchStart={onTS} onTouchEnd={onTE}>
{photos.map((p,i)=><img key={i} src={p} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.8s",opacity:i===idx?1:0}}/>)}
<div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.5) 0%,transparent 50%)"}}/>
<div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>
{photos.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{width:i===idx?16:6,height:6,borderRadius:3,background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"all 0.3s",cursor:"pointer"}}/>)}</div>
<div style={{position:"absolute",top:"50%",left:8,transform:"translateY(-50%)",cursor:"pointer",background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}} onClick={e=>{e.stopPropagation();setIdx(p=>(p-1+photos.length)%photos.length)}}>‹</div>
<div style={{position:"absolute",top:"50%",right:8,transform:"translateY(-50%)",cursor:"pointer",background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}} onClick={e=>{e.stopPropagation();setIdx(p=>(p+1)%photos.length)}}>›</div>
</div>)};

// ── [FEATURE 4] Pie Chart (fintech donut) ──
const Pie=({data,size=140,currency})=>{
let tot=data.reduce((s,d)=>s+d.value,0);if(!tot)return null;
let cum=0;const slices=data.map(d=>{const st=cum/tot*360;cum+=d.value;return{...d,st,en:cum/tot*360}});
const xy=(a,r)=>({x:50+r*Math.cos((a-90)*Math.PI/180),y:50+r*Math.sin((a-90)*Math.PI/180)});
return(<svg viewBox="0 0 100 100" width={size} height={size}>
{slices.map((s,i)=>{const lg=(s.en-s.st)>180?1:0;const p1=xy(s.st,42),p2=xy(s.en,42);
if(s.en-s.st>=359.9)return<circle key={i} cx="50" cy="50" r="42" fill={s.color}/>;
return<path key={i} d={`M50,50 L${p1.x},${p1.y} A42,42 0 ${lg},1 ${p2.x},${p2.y} Z`} fill={s.color}/>})}
<circle cx="50" cy="50" r="26" fill={C.white}/>
<text x="50" y="47" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.text}>{fmt(tot)}</text>
<text x="50" y="56" textAnchor="middle" fontSize="5" fill={C.textDim}>{currency||""}</text>
</svg>)};

const Modal=({open,onClose,title,children,wide})=>{if(!open)return null;return(
<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
<div style={{position:"absolute",inset:0,background:"rgba(44,24,16,0.4)",backdropFilter:"blur(4px)"}}/>
<div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.white,borderRadius:20,boxShadow:C.shadowMd,width:"100%",maxWidth:wide?600:480,maxHeight:"85vh",overflow:"auto",animation:"fadeUp 0.25s ease"}}>
<div style={{padding:"16px 20px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.white,zIndex:1,borderRadius:"20px 20px 0 0"}}>
<span style={{fontSize:16,fontWeight:700,fontFamily:F}}>{title}</span>
<button onClick={onClose} style={{width:28,height:28,borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:14,color:C.textDim}}>✕</button></div>
<div style={{padding:20}}>{children}</div></div></div>)};

// ═══════════════ MAIN APP ═══════════════
export default function Ventura(){
const[loggedIn,setLoggedIn]=useState(false);
const[currentUser,setCurrentUser]=useState(null);
const[users,setUsers]=useState(USERS_INIT);
const[scr,setScr]=useState("home");
const[tab,setTab]=useState("trip");
const[activeTrip,setActiveTrip]=useState(null);
const[trips,setTrips]=useState(INIT_TRIPS);
const[savedLists,setSavedLists]=useState([]);// saved packing lists
const[showWiz,setShowWiz]=useState(false);
const[showInv,setShowInv]=useState(false);
const[showProf,setShowProf]=useState(false);
const[showTrav,setShowTrav]=useState(false);
const[eDays,setEDays]=useState({});
const[eItem,setEItem]=useState(null);
const[eBgt,setEBgt]=useState(false);
const[bIn,setBIn]=useState("");
const[jIn,setJIn]=useState("");
const[wStep,setWStep]=useState(0);
const[wData,setWData]=useState({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"});
const[invEmail,setInvEmail]=useState("");
const[invRole,setInvRole]=useState("companion");
// Packing state
const[packCat,setPackCat]=useState("");
const[packItem,setPackItem]=useState("");
const[showTpl,setShowTpl]=useState(false);
const[showSavePack,setShowSavePack]=useState(false);
const[savePackName,setSavePackName]=useState("");
const[showLoadPack,setShowLoadPack]=useState(false);
// Expense editing state
const[editExp,setEditExp]=useState(null);
const[editExpD,setEditExpD]=useState({});
const[newExpOpen,setNewExpOpen]=useState(false);
const[newExp,setNewExp]=useState({name:"",cat:"Food",amount:"",currency:""});
// Currency editing
const[editCur,setEditCur]=useState(false);
// Compare stays
const[compIn,setCompIn]=useState({name:"",url:"",price:"",notes:""});

const trip=activeTrip?trips.find(t=>t.id===activeTrip):null;
const getU=id=>users.find(u=>u.id===id)||{name:"?",color:C.textDim};
const uRole=trip?(trip.travelers.includes(currentUser?.id)?(currentUser?.role||"user"):trip.observers?.includes(currentUser?.id)?"observer":"guest"):"user";
const canE=["admin","user","companion"].includes(uRole);
const upT=(id,fn)=>setTrips(p=>p.map(t=>t.id===id?fn(t):t));
const delT=id=>{setTrips(p=>p.filter(t=>t.id!==id));setActiveTrip(null);setScr("home")};

// ── Login Screen ──
if(!loggedIn)return(
<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.primaryLight} 0%,${C.bg} 40%,${C.blueLight} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito Sans',sans-serif",padding:20}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
<Card style={{width:"100%",maxWidth:400,padding:32,textAlign:"center",animation:"fadeUp 0.5s"}} hover={false}>
<div style={{fontSize:40,fontWeight:800,fontFamily:F,color:C.primary,marginBottom:4}}>V</div>
<div style={{fontSize:22,fontWeight:800,fontFamily:F,marginBottom:4}}>Ventura</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:24}}>Your intelligent travel companion</p>
<div style={{fontSize:12,fontWeight:600,color:C.textDim,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Select profile</div>
{users.map(u=>(<div key={u.id} onClick={()=>{setCurrentUser(u);setLoggedIn(true)}} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderRadius:12,border:`1.5px solid ${C.border}`,marginBottom:8,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.background=C.primaryLight}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent"}}>
<Av user={u} size={36}/><div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div></div>
<span style={{fontSize:10,fontWeight:700,color:ROLES[u.role].color,background:`${ROLES[u.role].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{ROLES[u.role].label}</span></div>))}
</Card></div>);

// ── Tabs ──
const getTabs=()=>{if(!trip)return[];
if(trip.status==="past")return[{id:"memories",l:"Memories",i:"✨"},{id:"trip",l:"Itinerary",i:"🗺️"},{id:"journal",l:"Journal",i:"📓"},{id:"budget",l:"Budget",i:"💰"},{id:"booking",l:"Book",i:"🔖"}];
if(trip.status==="planning")return[{id:"plan",l:"Plan",i:"📋"},{id:"packing",l:"Pack",i:"🎒"},{id:"journal",l:"Journal",i:"📓"},{id:"budget",l:"Budget",i:"💰"},{id:"booking",l:"Book",i:"🔖"}];
return[{id:"trip",l:"Trip",i:"🗺️"},{id:"ai",l:"AI",i:"✨"},{id:"packing",l:"Pack",i:"🎒"},{id:"journal",l:"Journal",i:"📓"},{id:"budget",l:"Budget",i:"💰"},{id:"booking",l:"Book",i:"🔖"}]};

const createTrip=()=>{const id="trip_"+Date.now();setTrips(p=>[...p,{id,name:wData.name||`${wData.dest} Trip`,dest:wData.dest,dates:`${wData.startDate} – ${wData.endDate}`,travelers:[currentUser.id],observers:[],days:0,status:"planning",currency:getDestCur(wData.dest),heroImg:"",budget:{total:0},completeness:5,journal:[],memories:null,dayData:[],expenses:[],packing:{},deals:[],comparisons:[],planningTips:[{icon:"🏨",title:"Book accommodation",desc:`Find a place in ${wData.dest}.`,done:false,priority:"high"},{icon:"✈️",title:"Book flights",desc:"Search best deals.",done:false,priority:"high"},{icon:"🗺️",title:"Plan itinerary",desc:`${wData.travelers} people, ${wData.style} style.`,done:false,priority:"medium"},{icon:"🎒",title:"Create packing list",desc:"Use a template or start fresh.",done:false,priority:"low"}]}]);setActiveTrip(id);setScr("trip");setTab("plan");setShowWiz(false);setWStep(0);setWData({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"})};

// ═══ RENDER ═══
return(<div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:C.bg,fontFamily:"'Nunito Sans',sans-serif",position:"relative"}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}input:focus,select:focus,textarea:focus{outline:none;border-color:${C.primary}!important}`}</style>

{/* Header */}
<div style={{padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.borderLight}`,background:C.white,position:"sticky",top:0,zIndex:100}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{scr==="trip"&&<button onClick={()=>{setScr("home");setActiveTrip(null)}} style={{padding:"6px 12px",borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:12,color:C.textSec,fontFamily:"inherit"}}>← Trips</button>}
<span onClick={()=>{setScr("home");setActiveTrip(null)}} style={{fontSize:20,fontWeight:800,fontFamily:F,color:C.primary,cursor:"pointer"}}>V</span>
{scr==="home"&&<span style={{fontSize:16,fontWeight:700,fontFamily:F}}>Ventura</span>}
{scr==="trip"&&trip&&<span style={{fontSize:14,fontWeight:700,fontFamily:F}}>{trip.name}</span>}
</div>
<div style={{display:"flex",alignItems:"center",gap:8}}>
{scr==="trip"&&trip&&<button onClick={()=>setShowTrav(true)} style={{padding:"6px 10px",borderRadius:99,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>👥 {trip.travelers.length+(trip.observers?.length||0)}</button>}
<div onClick={()=>setShowProf(true)} style={{cursor:"pointer"}}><Av user={currentUser} size={28}/></div>
</div></div>

{/* ═══ HOME ═══ */}
{scr==="home"&&(<div style={{padding:20,animation:"fadeUp 0.3s"}}>
<div style={{fontSize:22,fontWeight:800,fontFamily:F,marginBottom:4}}>Welcome back, {currentUser.name}</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:20}}>Plan your next adventure</p>
<button onClick={()=>setShowWiz(true)} style={{width:"100%",padding:"16px 20px",borderRadius:16,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:F,boxShadow:C.shadowMd,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:24}}><span style={{fontSize:18}}>+</span> New Trip</button>

{trips.filter(t=>t.travelers.includes(currentUser.id)||t.observers?.includes(currentUser.id)).map(tr=>(<Card key={tr.id} onClick={()=>{setActiveTrip(tr.id);setScr("trip");setTab(tr.status==="past"?"memories":tr.status==="planning"?"plan":"trip")}} style={{marginBottom:16,overflow:"hidden"}}>
<PhotoSlider dest={tr.dest}/>
<div style={{padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>{tr.name}</div><div style={{fontSize:12,color:C.textSec}}>{tr.dest} · {tr.dates}</div></div>
<span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,textTransform:"uppercase",background:tr.status==="upcoming"?C.sageLight:tr.status==="planning"?C.blueLight:C.bgAlt,color:tr.status==="upcoming"?C.sage:tr.status==="planning"?C.blue:C.textDim}}>{tr.status}</span></div>
{tr.status!=="past"&&tr.completeness!=null&&(<div style={{marginTop:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textDim,marginBottom:3}}><span>Trip readiness</span><span>{tr.completeness}%</span></div><Bar v={tr.completeness} mx={100} color={tr.completeness>75?C.sage:tr.completeness>40?C.gold:C.coral} h={4}/></div>)}
<div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
<div style={{display:"flex"}}>{tr.travelers.map((uid,i)=>{const u=getU(uid);return<div key={uid} style={{width:24,height:24,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",marginLeft:i>0?-6:0,border:"2px solid #fff",position:"relative",zIndex:tr.travelers.length-i}}>{u.name[0]}</div>})}</div>
<span style={{fontSize:11,color:C.textDim}}>{tr.travelers.length} travelers{tr.observers?.length>0?` · ${tr.observers.length} observers`:""}</span>
</div></div></Card>))}

<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:20,marginBottom:10}}>Get inspired</div>
<div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>{INSP.map(d=>(<div key={d.name} onClick={()=>{setWData(p=>({...p,dest:d.name}));setShowWiz(true)}} style={{flex:"0 0 110px",borderRadius:14,overflow:"hidden",position:"relative",height:150,cursor:"pointer",boxShadow:C.shadow}}>
<Img src={d.img} alt={d.name} style={{width:"100%",height:"100%"}}/>
<div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(0,0,0,0.6) 0%,transparent 50%)"}}/>
<span style={{position:"absolute",bottom:10,left:10,color:"#fff",fontSize:13,fontWeight:700}}>{d.name}</span></div>))}</div>
</div>)}

{/* ═══ TRIP VIEW ═══ */}
{scr==="trip"&&trip&&(<div style={{animation:"fadeUp 0.3s"}}>
{trip.heroImg&&<div style={{position:"relative",height:160}}><Img src={trip.heroImg} alt={trip.name} style={{width:"100%",height:"100%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.7) 0%,transparent 60%)"}}/><div style={{position:"absolute",bottom:14,left:20,right:20}}><div style={{fontSize:22,fontWeight:800,fontFamily:F,color:"#fff"}}>{trip.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.85)"}}>{trip.dest} · {trip.dates}</div></div></div>}

{/* [FEATURE 4+6] Currency bar + Delete trip */}
<div style={{padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
<span style={{color:C.textDim}}>Currency:</span>
{editCur?(<select value={trip.currency||"EUR"} onChange={e=>{upT(trip.id,t=>({...t,currency:e.target.value}));setEditCur(false)}} autoFocus onBlur={()=>setEditCur(false)} style={{padding:"3px 6px",borderRadius:6,border:`1px solid ${C.primary}`,fontSize:12,fontWeight:600,background:C.white,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select>
):(<span onClick={canE?()=>setEditCur(true):undefined} style={{fontWeight:700,cursor:canE?"pointer":"default",color:C.primary}}>{trip.currency||"EUR"} {canE&&"✎"}</span>)}
</div>
{canE&&trip.status!=="past"&&(<button onClick={()=>{if(confirm(`Usunąć podróż "${trip.name}"?`))delT(trip.id)}} style={{padding:"4px 12px",borderRadius:8,background:`${C.danger}10`,border:`1px solid ${C.danger}30`,color:C.danger,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑 Usuń</button>)}
</div>

{/* Tabs */}
<div style={{display:"flex",overflowX:"auto",gap:2,padding:"10px 16px 0",borderBottom:`1px solid ${C.borderLight}`,background:C.white}}>
{getTabs().map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 14px",fontSize:12,fontWeight:tab===t.id?700:500,color:tab===t.id?C.primary:C.textDim,background:"transparent",border:"none",borderBottom:`2px solid ${tab===t.id?C.primary:"transparent"}`,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{t.i} {t.l}</button>))}</div>

<div style={{padding:20}}>

{/* ══ MEMORIES ══ */}
{tab==="memories"&&trip.memories&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.goldLight},${C.white})`}} hover={false}>
<div style={{fontSize:18,fontWeight:800,fontFamily:F,marginBottom:12}}>✨ Trip Recap</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{Object.entries(trip.memories.stats).map(([k,v])=>(<div key={k} style={{padding:10,background:C.white,borderRadius:10,textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,fontFamily:F,color:C.primary}}>{v}</div><div style={{fontSize:10,color:C.textDim,textTransform:"capitalize"}}>{k.replace(/([A-Z])/g,' $1')}</div></div>))}</div></Card>
{trip.memories.highlights.map((h,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{h.icon}</span><div><div style={{fontSize:11,color:C.textDim}}>{h.title}</div><div style={{fontSize:13,fontWeight:600}}>{h.value}</div></div></div></Card>))}
<Card style={{padding:16,marginTop:12,background:trip.memories.budgetSummary.underBudget?C.sageLight:C.coralLight}} hover={false}><div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:6}}>💰 Budget</div><div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span>Planned: {fmt(trip.memories.budgetSummary.planned)} {trip.currency}</span><span style={{fontWeight:700,color:trip.memories.budgetSummary.underBudget?C.sage:C.danger}}>Actual: {fmt(trip.memories.budgetSummary.actual)} {trip.currency}</span></div></Card>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:14}}>{trip.memories.topMoments.map((m,i)=><span key={i} style={{padding:"8px 14px",borderRadius:99,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:12}}>💛 {m}</span>)}</div></div>)}
{tab==="memories"&&!trip.memories&&(<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>📸</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>Memories coming soon</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>Trip summary appears after the trip ends.</p></Card>)}

{/* ══ PLAN ══ */}
{tab==="plan"&&trip.planningTips&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.blueLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700,fontFamily:F}}>Trip readiness</div><div style={{fontSize:11,color:C.textSec}}>Complete these to prep</div></div><div style={{fontSize:28,fontWeight:800,fontFamily:F,color:C.blue}}>{trip.completeness}%</div></div>
<Bar v={trip.completeness} mx={100} color={C.blue} h={8}/></Card>
{trip.planningTips.map((tip,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false} onClick={canE?()=>{upT(trip.id,t=>{const tips=t.planningTips.map((tp,j)=>j===i?{...tp,done:!tp.done}:tp);return{...t,planningTips:tips,completeness:Math.min(100,Math.round(tips.filter(x=>x.done).length/tips.length*100))}})}:undefined}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:22,height:22,borderRadius:6,border:tip.done?"none":`2px solid ${C.border}`,background:tip.done?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{tip.done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}</div>
<span style={{fontSize:18}}>{tip.icon}</span>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,textDecoration:tip.done?"line-through":"none",color:tip.done?C.textDim:C.text}}>{tip.title}</div><div style={{fontSize:11,color:C.textDim}}>{tip.desc}</div></div>
<span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:99,textTransform:"uppercase",background:tip.priority==="high"?C.coralLight:tip.priority==="medium"?C.goldLight:C.bgAlt,color:tip.priority==="high"?C.coral:tip.priority==="medium"?C.gold:C.textDim}}>{tip.priority}</span>
</div></Card>))}</div>)}

{/* ══ ITINERARY ══ */}
{tab==="trip"&&trip.dayData?.length>0&&<div>{trip.dayData.map(day=>{const open=eDays[day.day]!==false;return(<Card key={day.day} style={{marginBottom:12,overflow:"hidden"}} hover={false}>
<div onClick={()=>setEDays(p=>({...p,[day.day]:!open}))} style={{cursor:"pointer"}}>
{day.img&&<Img src={day.img} alt={day.title} style={{width:"100%",height:100}}/>}
<div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:open?`1px solid ${C.borderLight}`:"none"}}>
<div><div style={{fontSize:14,fontWeight:700,fontFamily:F}}>Day {day.day}: {day.title}</div><div style={{fontSize:12,color:C.textSec,display:"flex",alignItems:"center",gap:6}}>{day.date}{day.weather&&<> · <WI t={day.weather.icon}/> {day.weather.hi}° / {day.weather.lo}°</>}</div></div>
<span style={{fontSize:14,color:C.textDim,transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span></div></div>
{open&&<div style={{animation:"fadeUp 0.2s"}}>{day.items.map((it,i)=>(<div key={i} onClick={()=>setEItem(eItem===`${day.day}-${i}`?null:`${day.day}-${i}`)} style={{padding:"10px 14px",display:"flex",gap:10,borderBottom:i<day.items.length-1?`1px solid ${C.borderLight}`:"none",cursor:"pointer",background:eItem===`${day.day}-${i}`?C.bgAlt:"transparent"}}>
<div style={{minWidth:40,fontSize:11,fontWeight:600,color:C.textDim,paddingTop:2}}>{it.time}</div>
<div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{tE[it.type]}</span><span style={{fontSize:13,fontWeight:600}}>{it.name}</span>{it.rating>0&&<span style={{fontSize:11,color:C.gold}}>★ {it.rating}</span>}</div>
{eItem===`${day.day}-${i}`&&it.desc&&<p style={{fontSize:12,color:C.textSec,marginTop:4,lineHeight:1.5}}>{it.desc}</p>}
{eItem!==`${day.day}-${i}`&&<div style={{fontSize:11,color:C.textDim}}>{it.duration}{it.cost>0?` · ${it.cost} ${trip.currency}`:""}</div>}</div>
</div>))}</div>}
</Card>)})}</div>}
{tab==="trip"&&(!trip.dayData||!trip.dayData.length)&&(<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🗺️</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>No itinerary yet</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>Switch to Plan tab to start building.</p></Card>)}

{/* ══ AI ══ */}
{tab==="ai"&&(<Card style={{padding:24,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>✨</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>AI Trip Planner</div><p style={{fontSize:13,color:C.textSec,marginTop:8,lineHeight:1.6}}>Ask me to optimize routes, find restaurants, suggest hidden gems!</p><div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:16}}>{["Optimize Day 1","Best restaurants","Hidden gems","Weather tips"].map(s=><span key={s} style={{padding:"8px 14px",borderRadius:99,background:C.primaryLight,border:`1px solid ${C.primary}33`,color:C.primary,fontSize:12,fontWeight:500,cursor:"pointer"}}>{s}</span>)}</div></Card>)}

{/* ══ [FEATURE 1] PACKING — editable, templates, save/load, AI suggestions, Don't Forget ══ */}
{tab==="packing"&&(()=>{const pk=trip.packing||{};const tot=Object.values(pk).flat().length;const done=Object.values(pk).flat().filter(x=>x.packed).length;
return(<div>
{tot>0&&<Card style={{padding:16,marginBottom:14,background:`linear-gradient(135deg,${C.sageLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{fontSize:14,fontWeight:700,fontFamily:F}}>🎒 Packing Progress</div><span style={{fontSize:13,fontWeight:700,color:C.sage}}>{done}/{tot}</span></div>
<Bar v={done} mx={tot||1} color={C.sage} h={6}/></Card>}

{/* Template & Save/Load buttons */}
{canE&&<div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
<button onClick={()=>setShowTpl(!showTpl)} style={{flex:1,padding:"10px 14px",borderRadius:12,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📦 Templates</button>
<button onClick={()=>{if(tot===0){alert("Lista jest pusta!");return}setShowSavePack(true)}} style={{flex:1,padding:"10px 14px",borderRadius:12,background:C.primaryLight,border:`1px solid ${C.primary}33`,color:C.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💾 Zapisz listę</button>
{savedLists.length>0&&<button onClick={()=>setShowLoadPack(true)} style={{flex:1,padding:"10px 14px",borderRadius:12,background:C.goldLight,border:`1px solid ${C.gold}33`,color:C.gold,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📂 Wczytaj ({savedLists.length})</button>}
</div>}

{/* Built-in templates */}
{showTpl&&<div style={{marginBottom:14,display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>{PACK_TPL.map(tpl=>(<Card key={tpl.id} style={{flex:"0 0 130px",padding:14,textAlign:"center",cursor:"pointer"}} onClick={()=>{const np={};Object.entries(tpl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,t=>({...t,packing:{...t.packing,...np}}));setShowTpl(false)}}>
<div style={{fontSize:24,marginBottom:6}}>{tpl.icon}</div><div style={{fontSize:12,fontWeight:600}}>{tpl.name}</div></Card>))}</div>}

{/* AI suggestions */}
{canE&&<Card style={{padding:14,marginBottom:14,background:C.primaryLight,border:`1px solid ${C.primary}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.primary,marginBottom:6}}>✨ AI Suggestions</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{AI_SUGG.slice(0,6).map(sug=>{const has=Object.values(pk).flat().some(x=>x.item===sug);return(<button key={sug} disabled={has} onClick={()=>{upT(trip.id,t=>{const p={...t.packing};p["AI Suggested"]=[...(p["AI Suggested"]||[]),{item:sug,qty:1,packed:false}];return{...t,packing:p}})}} style={{padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:500,background:has?C.bgAlt:C.white,border:`1px solid ${C.border}`,color:has?C.textDim:C.text,cursor:has?"default":"pointer",fontFamily:"inherit",textDecoration:has?"line-through":"none"}}>+ {sug}</button>)})}</div></Card>}

{/* Don't forget section */}
<Card style={{padding:14,marginBottom:14,background:C.goldLight,border:`1px solid ${C.gold}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:8}}>⚠️ Nie zapomnij o...</div>
{DONT_FORGET.map((tip,i)=><div key={i} style={{fontSize:12,color:C.text,padding:"4px 0",lineHeight:1.5}}>{tip}</div>)}</Card>

{/* Packing categories */}
{Object.keys(pk).length===0?(<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🎒</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>No packing list yet</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>Start with a template or add items manually.</p></Card>
):Object.entries(pk).map(([cat,items])=>(<Card key={cat} style={{marginBottom:10,overflow:"hidden"}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700,display:"flex",justifyContent:"space-between"}}><span>{cat}</span><span style={{fontSize:11,color:C.textDim}}>{items.filter(x=>x.packed).length}/{items.length}</span></div>
{items.map((it,i)=>(<div key={i} style={{padding:"9px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:i<items.length-1?`1px solid ${C.borderLight}`:"none"}}>
<div onClick={canE?()=>upT(trip.id,t=>({...t,packing:{...t.packing,[cat]:t.packing[cat].map((x,j)=>j===i?{...x,packed:!x.packed}:x)}})):undefined} style={{width:18,height:18,borderRadius:5,border:it.packed?"none":`2px solid ${C.border}`,background:it.packed?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:canE?"pointer":"default"}}>{it.packed&&<span style={{color:"#fff",fontSize:11}}>✓</span>}</div>
<span style={{flex:1,fontSize:13,textDecoration:it.packed?"line-through":"none",color:it.packed?C.textDim:C.text}}>{it.item}</span>
<span style={{fontSize:11,color:C.textDim}}>×{it.qty}</span>
{canE&&<button onClick={()=>upT(trip.id,t=>({...t,packing:{...t.packing,[cat]:t.packing[cat].filter((_,j)=>j!==i)}}))} style={{background:"none",border:"none",color:C.danger,fontSize:13,cursor:"pointer",padding:"0 4px"}}>×</button>}
</div>))}</Card>))}

{/* Add item form */}
{canE&&<Card style={{padding:14,marginTop:12}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>DODAJ POZYCJĘ</div>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<input value={packCat} onChange={e=>setPackCat(e.target.value)} placeholder="Kategoria" list="pcat" style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/><datalist id="pcat">{Object.keys(pk).map(c=><option key={c} value={c}/>)}</datalist>
<input value={packItem} onChange={e=>setPackItem(e.target.value)} placeholder="Nazwa rzeczy" style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!packItem.trim())return;const cat=packCat.trim()||"Other";upT(trip.id,t=>{const p={...t.packing};p[cat]=[...(p[cat]||[]),{item:packItem.trim(),qty:1,packed:false}];return{...t,packing:p}});setPackItem("");setPackCat("")}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Dodaj</button>
</Card>}
</div>)})()}

{/* ══ [FEATURE 2+3+4] BUDGET — editable expenses, currency, exchange rate, fintech visuals ══ */}
{tab==="budget"&&(()=>{const cur=trip.currency||"EUR";const exps=trip.expenses||[];const tS=exps.reduce((s,e)=>s+e.amount,0);const bT=trip.budget?.total||1;
const grp={};exps.forEach(e=>{grp[e.cat]=(grp[e.cat]||0)+e.amount});
const pie=Object.entries(grp).map(([c,v])=>({label:c,value:v,color:CAT_C[c]||C.textDim}));
const destCur=getDestCur(trip.dest);const homeCur=currentUser?.prefs?.currency||"PLN";
return(<div>
{/* Summary card */}
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.primaryLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
<div><div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>Wydano</div><div style={{fontSize:28,fontWeight:800,fontFamily:F}}>{fmt(tS)} <span style={{fontSize:14,color:C.textSec}}>{cur}</span></div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.textDim,fontWeight:600,marginBottom:2}}>BUDŻET</div>
{eBgt&&canE?(<div style={{display:"flex",gap:4}}>
<input value={bIn} onChange={e=>setBIn(e.target.value)} autoFocus type="number" onKeyDown={e=>{if(e.key==="Enter"){const v=parseInt(bIn);if(v>0)upT(trip.id,t=>({...t,budget:{...t.budget,total:v}}));setEBgt(false)}}} style={{width:80,padding:"5px 8px",borderRadius:8,border:`1.5px solid ${C.primary}`,fontSize:14,fontWeight:700,fontFamily:F,textAlign:"right",background:C.white}}/>
<button onClick={()=>{const v=parseInt(bIn);if(v>0)upT(trip.id,t=>({...t,budget:{...t.budget,total:v}}));setEBgt(false)}} style={{padding:"5px 10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>✓</button></div>
):(<div onClick={canE?()=>{setEBgt(true);setBIn(String(trip.budget?.total||0))}:undefined} style={{cursor:canE?"pointer":"default",display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
<span style={{fontSize:16,fontWeight:700}}>{fmt(bT)} {cur}</span>{canE&&<span style={{fontSize:11,color:C.primary}}>✎</span>}</div>)}
<div style={{fontSize:12,color:tS<=bT?C.sage:C.danger,fontWeight:600,marginTop:2}}>{tS<=bT?`${fmt(bT-tS)} remaining`:`${fmt(tS-bT)} over budget!`}</div>
</div></div>
<Bar v={tS} mx={bT} color={tS<=bT?C.primary:C.danger} h={8}/>
</Card>

{/* Expenses list */}
{exps.length>0&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700,fontFamily:F}}>Wydatki ({exps.length})</div>
{exps.map(e=>editExp===e.id?(
<div key={e.id} style={{padding:"10px 16px",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",gap:6,marginBottom:6}}>
<input value={editExpD.name||""} onChange={ev=>setEditExpD(p=>({...p,name:ev.target.value}))} placeholder="Nazwa" style={{flex:2,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={editExpD.amount||""} onChange={ev=>setEditExpD(p=>({...p,amount:ev.target.value}))} type="number" placeholder="Kwota" style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/>
<select value={editExpD.currency||cur} onChange={ev=>setEditExpD(p=>({...p,currency:ev.target.value}))} style={{padding:"6px 4px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:11,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{display:"flex",gap:6}}>
<select value={editExpD.cat||"Food"} onChange={ev=>setEditExpD(p=>({...p,cat:ev.target.value}))} style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<button onClick={()=>{upT(trip.id,t=>({...t,expenses:t.expenses.map(x=>x.id===e.id?{...x,...editExpD,amount:parseFloat(editExpD.amount)||x.amount}:x)}));setEditExp(null)}} style={{padding:"6px 14px",borderRadius:6,background:C.sage,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>Zapisz</button>
<button onClick={()=>setEditExp(null)} style={{padding:"6px 10px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
<button onClick={()=>{upT(trip.id,t=>({...t,expenses:t.expenses.filter(x=>x.id!==e.id)}));setEditExp(null)}} style={{padding:"6px 10px",borderRadius:6,background:`${C.danger}10`,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🗑</button>
</div></div>
):(
<div key={e.id} onClick={canE?()=>{setEditExp(e.id);setEditExpD({name:e.name,amount:e.amount,currency:e.currency||cur,cat:e.cat})}:undefined} style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"pointer":"default"}}>
<span style={{fontSize:15}}>{CAT_I[e.cat]||"💰"}</span>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:C.textDim}}>{e.cat} · {e.date}</div></div>
<div style={{fontSize:13,fontWeight:700}}>{fmt(e.amount)} {e.currency||cur}</div>
</div>))}</Card>}

{/* Add expense */}
{canE&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
{!newExpOpen?(<div onClick={()=>{setNewExpOpen(true);setNewExp(p=>({...p,currency:cur}))}} style={{padding:"12px 16px",cursor:"pointer",textAlign:"center",color:C.primary,fontSize:13,fontWeight:600}}>+ Dodaj wydatek</div>
):(<div style={{padding:14}}>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<input value={newExp.name} onChange={e=>setNewExp(p=>({...p,name:e.target.value}))} placeholder="Na co?" style={{flex:2,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={newExp.amount} onChange={e=>setNewExp(p=>({...p,amount:e.target.value}))} placeholder="0" type="number" style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/></div>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<select value={newExp.cat} onChange={e=>setNewExp(p=>({...p,cat:e.target.value}))} style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<select value={newExp.currency} onChange={e=>setNewExp(p=>({...p,currency:e.target.value}))} style={{padding:"8px 6px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{if(!newExp.name||!newExp.amount)return;upT(trip.id,t=>({...t,expenses:[...t.expenses,{id:Date.now(),name:newExp.name,cat:newExp.cat,amount:parseFloat(newExp.amount),currency:newExp.currency,payer:currentUser.id,date:"Today"}]}));setNewExp({name:"",cat:"Food",amount:"",currency:cur});setNewExpOpen(false)}} style={{flex:2,padding:"10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Zapisz wydatek</button>
<button onClick={()=>setNewExpOpen(false)} style={{flex:1,padding:"10px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Anuluj</button></div>
</div>)}</Card>}

{/* [FEATURE 4] Fintech spending breakdown */}
{exps.length>0&&<Card style={{padding:20,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:14}}>📊 Spending Breakdown</div>
<div style={{display:"flex",gap:20,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
<Pie data={pie} size={140} currency={cur}/>
<div style={{flex:1,minWidth:140}}>{pie.sort((a,b)=>b.value-a.value).map(d=>(
<div key={d.label} style={{marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/><span style={{fontSize:12}}>{CAT_I[d.label]||"💰"} {d.label}</span></div>
<span style={{fontSize:12,fontWeight:700}}>{fmt(d.value)} <span style={{fontWeight:400,color:C.textDim}}>{Math.round(d.value/tS*100)}%</span></span></div>
<Bar v={d.value} mx={tS} color={d.color} h={4}/>
</div>))}</div></div>

{/* Insights */}
<div style={{marginTop:16,padding:14,background:C.bgAlt,borderRadius:12}}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>💡 Insights</div>
{pie.length>0&&<div style={{fontSize:12,color:C.text,lineHeight:1.6}}>
<div style={{marginBottom:4}}>Największy wydatek: <strong>{CAT_I[pie[0]?.label]} {pie[0]?.label}</strong> — {fmt(pie[0]?.value)} {cur} ({Math.round((pie[0]?.value||0)/tS*100)}% budżetu)</div>
<div style={{marginBottom:4}}>Średni wydatek: <strong>{fmt(Math.round(tS/exps.length))} {cur}</strong> na transakcję</div>
{tS<=bT&&<div style={{color:C.sage}}>✅ Jesteś w budżecie! Zostało {fmt(bT-tS)} {cur}</div>}
{tS>bT&&<div style={{color:C.danger}}>⚠️ Budżet przekroczony o {fmt(tS-bT)} {cur}</div>}
</div>}</div>
</Card>}

{/* [FEATURE 3] Exchange rate info */}
<Card style={{padding:16,background:C.blueLight,border:`1px solid ${C.blue}22`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:8}}>💱 Kursy walut <span style={{fontWeight:400,fontSize:10,color:C.textDim}}>(orientacyjne)</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
{homeCur!==cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}>
<span style={{color:C.textDim}}>1 {homeCur} =</span> <strong>{getRate(homeCur,cur).toFixed(cur==="JPY"?1:3)} {cur}</strong></div>}
{homeCur!==cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}>
<span style={{color:C.textDim}}>1 {cur} =</span> <strong>{getRate(cur,homeCur).toFixed(homeCur==="JPY"?1:3)} {homeCur}</strong></div>}
{destCur!==cur&&destCur!==homeCur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}>
<span style={{color:C.textDim}}>1 {homeCur} =</span> <strong>{getRate(homeCur,destCur).toFixed(destCur==="JPY"?1:3)} {destCur}</strong></div>}
{homeCur===cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12,gridColumn:"1/3",textAlign:"center",color:C.textDim}}>Waluta budżetu = waluta domowa ({homeCur})</div>}
</div>
<div style={{fontSize:10,color:C.textDim,marginTop:6}}>Kursy orientacyjne. Sprawdź aktualny kurs przed wymianą.</div>
</Card>
</div>)})()}

{/* ══ JOURNAL ══ */}
{tab==="journal"&&(<div>
{canE&&(<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{display:"flex",gap:10,alignItems:"flex-start"}}><Av user={currentUser} size={32}/>
<div style={{flex:1}}><textarea value={jIn} onChange={e=>setJIn(e.target.value)} placeholder="Write a memory, thought, or note..." rows={3} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",resize:"vertical",background:C.bg,color:C.text}}/>
<div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
<div style={{display:"flex",gap:8}}><button style={{padding:"6px 12px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>📷 Photo</button><button style={{padding:"6px 12px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>🎥 Video</button></div>
<button onClick={()=>{if(!jIn.trim())return;upT(trip.id,t=>({...t,journal:[...t.journal,{id:"j"+Date.now(),date:"Now",author:currentUser.id,type:"text",content:jIn}]}));setJIn("")}} style={{padding:"8px 18px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Post</button>
</div></div></div></Card>)}
{(trip.journal||[]).length===0?(<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>📓</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>Your trip journal</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>Notes, photos, videos — your keepsake.</p></Card>
):[...trip.journal].reverse().map(j=>{const a=getU(j.author);return(<Card key={j.id} style={{padding:16,marginBottom:10}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Av user={a} size={28}/><span style={{fontSize:13,fontWeight:600}}>{a.name}</span><span style={{fontSize:11,color:C.textDim}}>{j.date}</span></div><p style={{fontSize:13,color:C.textSec,lineHeight:1.6}}>{j.content}</p></Card>)})}</div>)}

{/* ══ [FEATURE 8] BOOKING + COMPARE STAYS ══ */}
{tab==="booking"&&(<div>
{/* Deals */}
{(trip.deals||[]).length>0&&<><div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:10}}>🔖 Recommended Deals</div>
{trip.deals.map((d,i)=>(<Card key={i} style={{padding:14,marginBottom:10}} onClick={()=>window.open(d.url,"_blank")}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:13,fontWeight:700}}>{d.name}</div><span style={{fontSize:10,fontWeight:700,color:"#fff",background:d.pColor,padding:"2px 6px",borderRadius:4,marginTop:4,display:"inline-block"}}>{d.partner}</span></div>
<div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:800,color:C.primary,fontFamily:F}}>{d.price}</div><div style={{fontSize:12,color:C.primary,marginTop:2}}>View →</div></div></div></Card>))}</>}
{(trip.deals||[]).length===0&&<Card style={{padding:32,textAlign:"center",marginBottom:14}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🔖</div><div style={{fontSize:16,fontWeight:700,fontFamily:F}}>Booking deals</div><p style={{fontSize:13,color:C.textSec,marginTop:6}}>AI will suggest deals based on your itinerary.</p></Card>}

{/* Compare Stays */}
<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:20,marginBottom:6}}>🏨 Compare Stays</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:12,lineHeight:1.5}}>Add links from Booking.com, Airbnb etc. Compare and vote with your group — no more WhatsApp chaos!</p>

{(trip.comparisons||[]).map(c=>{const proposer=getU(c.proposedBy);return(<Card key={c.id} style={{padding:14,marginBottom:10}} hover={false}>
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
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
{(c.pros||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.sageLight,color:C.sage}}>✓ {p}</span>)}
{(c.cons||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.coralLight,color:C.coral}}>✕ {p}</span>)}
</div></Card>)})}

{/* Add comparison */}
{canE&&<Card style={{padding:14,marginTop:6}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>ZAPROPONUJ MIEJSCE</div>
<input value={compIn.name} onChange={e=>setCompIn(p=>({...p,name:e.target.value}))} placeholder="Nazwa hotelu / apartamentu" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
<input value={compIn.url} onChange={e=>setCompIn(p=>({...p,url:e.target.value}))} placeholder="Link z Booking.com lub Airbnb" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
<div style={{display:"flex",gap:6,marginBottom:6}}>
<input value={compIn.price} onChange={e=>setCompIn(p=>({...p,price:e.target.value}))} placeholder="np. €75/noc" style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/>
<input value={compIn.notes} onChange={e=>setCompIn(p=>({...p,notes:e.target.value}))} placeholder="Dlaczego to miejsce?" style={{flex:2,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!compIn.name||!compIn.url)return;upT(trip.id,t=>({...t,comparisons:[...(t.comparisons||[]),{id:"c"+Date.now(),name:compIn.name,url:compIn.url,price:compIn.price,notes:compIn.notes,rating:null,source:compIn.url.includes("airbnb")?"Airbnb":"Booking.com",proposedBy:currentUser.id,pros:[],cons:[]}]}));setCompIn({name:"",url:"",price:"",notes:""})}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Dodaj do porównania</button>
</Card>}
</div>)}

</div></div>)}

{/* ═══ MODALS ═══ */}

{/* Trip Wizard */}
<Modal open={showWiz} onClose={()=>{setShowWiz(false);setWStep(0)}} title={["Where are you going?","When & who?","Almost there!"][wStep]}>
{wStep===0&&<div><input value={wData.dest} onChange={e=>setWData(p=>({...p,dest:e.target.value}))} placeholder="Destination — e.g. Barcelona, Kyoto..." autoFocus style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,color:C.text,marginBottom:12}}/>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{["Barcelona","Kyoto","Reykjavik","Marrakech","Vienna","Bali"].map(d=><Pill key={d} onClick={()=>setWData(p=>({...p,dest:d}))} active={wData.dest===d}>{d}</Pill>)}</div>
<button disabled={!wData.dest} onClick={()=>setWStep(1)} style={{width:"100%",padding:"14px",borderRadius:12,background:wData.dest?C.primary:C.border,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:wData.dest?"pointer":"default",fontFamily:"inherit"}}>Next →</button></div>}
{wStep===1&&<div>
<div style={{display:"flex",gap:10,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>From</label><input type="date" value={wData.startDate} onChange={e=>setWData(p=>({...p,startDate:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>To</label><input type="date" value={wData.endDate} onChange={e=>setWData(p=>({...p,endDate:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div></div>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>Travelers</label>
<div style={{display:"flex",gap:6,marginBottom:12}}>{[1,2,3,4,5,"6+"].map(n=><Pill key={n} active={wData.travelers===n} onClick={()=>setWData(p=>({...p,travelers:n}))}>{n}</Pill>)}</div>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>Travel style</label>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{["Cultural","Adventure","Relaxation","Foodie","Road Trip","City Break"].map(s=><Pill key={s} active={wData.style===s} onClick={()=>setWData(p=>({...p,style:s}))}>{s}</Pill>)}</div>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWStep(0)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>← Back</button><button onClick={()=>setWStep(2)} style={{flex:2,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Next →</button></div></div>}
{wStep===2&&<div><input value={wData.name} onChange={e=>setWData(p=>({...p,name:e.target.value}))} placeholder={`e.g. "${wData.dest} Adventure"`} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,color:C.text,marginBottom:16}}/>
<Card style={{padding:16,marginBottom:16,background:C.bgAlt}} hover={false}><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>TRIP SUMMARY</div><div style={{fontSize:14,fontWeight:700,fontFamily:F,marginBottom:4}}>{wData.name||`${wData.dest} Trip`}</div><div style={{fontSize:12,color:C.textSec}}>📍 {wData.dest} · 📅 {wData.startDate||"TBD"} – {wData.endDate||"TBD"} · 👥 {wData.travelers} · 🎯 {wData.style}</div></Card>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWStep(1)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>← Back</button><button onClick={createTrip} style={{flex:2,padding:"14px",borderRadius:12,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🚀 Create Trip</button></div></div>}
</Modal>

{/* Invite */}
<Modal open={showInv} onClose={()=>setShowInv(false)} title="Invite to Trip">
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>Email address</label>
<input value={invEmail} onChange={e=>setInvEmail(e.target.value)} placeholder="friend@email.com" style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:6}}>Role</label>
{[{id:"companion",title:"Companion",desc:"Can edit itinerary, budget, journal.",icon:"🤝"},{id:"observer",title:"Observer",desc:"View-only access.",icon:"👁️"}].map(r=>(<div key={r.id} onClick={()=>setInvRole(r.id)} style={{padding:14,borderRadius:12,border:`1.5px solid ${invRole===r.id?C.primary:C.border}`,marginBottom:8,cursor:"pointer",background:invRole===r.id?C.primaryLight:"transparent"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{r.icon}</span><div><div style={{fontSize:13,fontWeight:600}}>{r.title}</div><div style={{fontSize:11,color:C.textSec}}>{r.desc}</div></div></div></div>))}
<button onClick={()=>{setShowInv(false);setInvEmail("")}} style={{width:"100%",marginTop:8,padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Send Invitation</button>
</Modal>

{/* [FEATURE 7] Profile with photo + social media */}
<Modal open={showProf} onClose={()=>setShowProf(false)} title="My Profile" wide>
<div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
<Av user={currentUser} size={56}/>
<div><div style={{fontSize:18,fontWeight:800,fontFamily:F}}>{currentUser.name}</div><div style={{fontSize:12,color:C.textSec}}>{currentUser.email}</div>
<span style={{fontSize:10,fontWeight:700,color:ROLES[currentUser.role].color,background:`${ROLES[currentUser.role].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase",marginTop:4,display:"inline-block"}}>{ROLES[currentUser.role].label}</span></div></div>

<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:6}}>PROFILE PHOTO</div>
<input value={currentUser.photoUrl||""} onChange={e=>{const v=e.target.value;setCurrentUser(p=>({...p,photoUrl:v}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,photoUrl:v}:u))}} placeholder="Paste image URL (https://...)" style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:14,background:C.bg}}/>

<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>SOCIAL MEDIA</div>
{[{key:"instagram",icon:"📸",label:"Instagram",placeholder:"@username"},{key:"facebook",icon:"📘",label:"Facebook",placeholder:"Profile link or name"},{key:"tiktok",icon:"🎵",label:"TikTok",placeholder:"@username"},{key:"youtube",icon:"▶️",label:"YouTube",placeholder:"Channel link"}].map(s=>(
<div key={s.key} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
<span style={{fontSize:14,width:24}}>{s.icon}</span>
<input value={currentUser.social?.[s.key]||""} onChange={e=>{const v=e.target.value;setCurrentUser(p=>({...p,social:{...p.social,[s.key]:v}}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,social:{...u.social,[s.key]:v}}:u))}} placeholder={s.placeholder} style={{flex:1,padding:"7px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/>
</div>))}

<div style={{fontSize:14,fontWeight:700,fontFamily:F,marginTop:16,marginBottom:10}}>Travel Preferences</div>
{currentUser.prefs&&Object.entries(currentUser.prefs).map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.borderLight}`}}><span style={{fontSize:12,color:C.textDim,textTransform:"capitalize"}}>{k.replace(/([A-Z])/g,' $1')}</span><span style={{fontSize:12,fontWeight:600}}>{Array.isArray(v)?v.join(", "):v}</span></div>))}

<div style={{fontSize:14,fontWeight:700,fontFamily:F,margin:"20px 0 10px"}}>Trip Stats</div>
<div style={{display:"flex",gap:10}}>{[{label:"Total trips",value:trips.filter(t=>t.travelers.includes(currentUser.id)).length},{label:"Countries",value:3},{label:"Days traveled",value:13}].map(s=>(<div key={s.label} style={{flex:1,padding:12,background:C.bgAlt,borderRadius:12,textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,fontFamily:F,color:C.primary}}>{s.value}</div><div style={{fontSize:10,color:C.textDim}}>{s.label}</div></div>))}</div>

<div style={{fontSize:14,fontWeight:700,fontFamily:F,margin:"20px 0 10px"}}>Permissions ({ROLES[currentUser.role].label})</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{ROLES[currentUser.role].perms.map(p=><span key={p} style={{padding:"5px 12px",borderRadius:99,background:C.sageLight,fontSize:11,fontWeight:500,color:C.sage}}>✓ {p.replace(/_/g,' ')}</span>)}</div>

<button onClick={()=>{setLoggedIn(false);setCurrentUser(null);setScr("home");setActiveTrip(null);setShowProf(false)}} style={{width:"100%",marginTop:20,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
</Modal>

{/* Travelers Modal */}
<Modal open={showTrav} onClose={()=>setShowTrav(false)} title="Trip Members" wide>
{trip&&<>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Travelers ({trip.travelers.length})</div>
{trip.travelers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}>
<Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div>
{u.social&&Object.entries(u.social).filter(([,v])=>v).length>0&&<div style={{display:"flex",gap:6,marginTop:3}}>
{u.social.instagram&&<span style={{fontSize:10,color:C.purple}}>📸 {u.social.instagram}</span>}
{u.social.facebook&&<span style={{fontSize:10,color:C.blue}}>📘 {u.social.facebook}</span>}
{u.social.tiktok&&<span style={{fontSize:10,color:C.text}}>🎵 {u.social.tiktok}</span>}
{u.social.youtube&&<span style={{fontSize:10,color:C.danger}}>▶️ {u.social.youtube}</span>}
</div>}</div>
<span style={{fontSize:10,fontWeight:700,color:ROLES[u.role||"user"].color,background:`${ROLES[u.role||"user"].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{ROLES[u.role||"user"].label}</span></div>)})}
{(trip.observers||[]).length>0&&<><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginTop:16,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Observers ({trip.observers.length})</div>
{trip.observers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}><Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div></div><span style={{fontSize:10,fontWeight:700,color:ROLES.observer.color,background:`${ROLES.observer.color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>Observer</span></div>)})}</>}
{canE&&<button onClick={()=>{setShowTrav(false);setShowInv(true)}} style={{width:"100%",marginTop:16,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Invite Someone</button>}
</>}</Modal>

{/* Save Packing List Modal */}
<Modal open={showSavePack} onClose={()=>setShowSavePack(false)} title="💾 Zapisz listę pakowania">
<p style={{fontSize:13,color:C.textSec,marginBottom:12}}>Zapisz aktualną listę jako szablon do ponownego użycia przy kolejnej podróży.</p>
<input value={savePackName} onChange={e=>setSavePackName(e.target.value)} placeholder="Nazwa listy, np. Europa zimą" autoFocus style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<button onClick={()=>{if(!savePackName.trim()||!trip)return;setSavedLists(p=>[...p,{id:"sl_"+Date.now(),name:savePackName.trim(),items:{...trip.packing}}]);setShowSavePack(false);setSavePackName("")}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.sage,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Zapisz</button>
</Modal>

{/* Load Packing List Modal */}
<Modal open={showLoadPack} onClose={()=>setShowLoadPack(false)} title="📂 Wczytaj zapisaną listę">
<p style={{fontSize:13,color:C.textSec,marginBottom:12}}>Wybierz zapisaną listę. Zostanie dodana do aktualnej listy pakowania.</p>
{savedLists.map(sl=>(<Card key={sl.id} style={{padding:14,marginBottom:8,cursor:"pointer"}} onClick={()=>{if(!trip)return;const np={};Object.entries(sl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,t=>({...t,packing:{...t.packing,...np}}));setShowLoadPack(false)}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:600}}>{sl.name}</div><div style={{fontSize:11,color:C.textDim}}>{Object.values(sl.items).flat().length} items · {Object.keys(sl.items).length} categories</div></div>
<button onClick={e=>{e.stopPropagation();setSavedLists(p=>p.filter(x=>x.id!==sl.id))}} style={{background:"none",border:"none",color:C.danger,fontSize:14,cursor:"pointer"}}>🗑</button></div></Card>))}
{savedLists.length===0&&<div style={{textAlign:"center",padding:20,color:C.textDim}}>Brak zapisanych list. Zapisz aktualną listę w zakładce Pack.</div>}
</Modal>

</div>)}
