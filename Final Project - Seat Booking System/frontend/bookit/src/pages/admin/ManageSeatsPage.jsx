import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/common/AdminSidebar';
import { screeningsAPI, seatsAPI, screeningSeatsAPI, eventsAPI, venuesAPI } from '../../services/api';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .sp {
    --pink:        #ec4899;
    --pink2:       #db2777;
    --pink3:       #f9a8d4;
    --pink4:       #fdf2f8;
    --pink5:       #fff0f9;
    --pink-border: rgba(236,72,153,0.22);
    --pink-glow:   rgba(236,72,153,0.20);
    --mauve:       #c084fc;
    --green:       #16a34a;
    --amber:       #d97706;
    --red:         #dc2626;
    --sky:         #0ea5e9;
    --teal:        #0d9488;
    --bg:          #fff5fb;
    --card:        #ffffff;
    --card2:       #faf7f4;
    --border:      #fce7f3;
    --ink:         #1e0a17;
    --ink2:        #6b3a54;
    --ink3:        #a87090;
    --ink4:        #d4a8be;
    --sh:    0 1px 4px rgba(30,10,23,0.06), 0 0 0 1px rgba(244,114,182,0.07);
    --sh-up: 0 12px 36px rgba(236,72,153,0.14), 0 4px 12px rgba(30,10,23,0.06);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }
  .sp * { box-sizing:border-box; margin:0; padding:0; }

  .sp-main {
    flex:1; margin-left:var(--sidebar-width,240px);
    min-height:100vh; background:var(--bg);
    padding:38px 36px 64px; overflow-y:auto; position:relative;
  }
  .sp-main::before {
    content:''; position:fixed; top:-100px; right:-80px;
    width:420px; height:420px; border-radius:50%;
    background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%);
    pointer-events:none; z-index:0;
  }
  .sp-content { position:relative; z-index:1; }

  /* HEADER */
  .sp-header { margin-bottom:28px; animation:spUp 0.4s ease both; }
  .sp-title {
    font-family:'Playfair Display',serif;
    font-size:28px; font-weight:800;
    color:var(--ink); letter-spacing:-0.02em;
    display:flex; align-items:center; gap:10px;
  }
  .sp-title-bar {
    width:5px; height:28px; border-radius:3px;
    background:linear-gradient(180deg,var(--pink),var(--mauve));
    box-shadow:0 0 10px var(--pink-glow);
  }
  .sp-sub { font-size:13.5px; color:var(--ink3); margin-top:6px; }

  /* LAYOUT */
  .sp-layout { display:flex; gap:22px; align-items:flex-start; flex-wrap:wrap; }

  /* LEFT PANEL */
  .sp-left {
    width:300px; flex-shrink:0;
    background:var(--card); border:1.5px solid var(--border);
    border-radius:20px; box-shadow:var(--sh); overflow:hidden;
    animation:spUp 0.45s 0.05s ease both;
  }
  .sp-left-head {
    padding:18px 18px 14px;
    border-bottom:1.5px solid var(--border);
    background:var(--pink4);
    position:relative;
  }
  .sp-left-head::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,var(--pink) 0%,transparent 55%);
  }
  .sp-left-title {
    font-family:'Playfair Display',serif;
    font-size:16px; font-weight:800; color:var(--ink);
    display:flex; align-items:center; gap:7px; margin-bottom:12px;
  }
  .sp-left-dot {
    width:8px; height:8px; border-radius:50%;
    background:var(--pink); box-shadow:0 0 0 3px rgba(236,72,153,0.15);
  }
  .sp-search {
    display:flex; align-items:center; gap:8px;
    background:var(--card); border:1.5px solid var(--border);
    border-radius:99px; padding:8px 14px;
    transition:border-color 0.2s;
  }
  .sp-search:focus-within { border-color:var(--pink-border); }
  .sp-search input {
    border:none; outline:none; background:transparent;
    font-size:13px; font-family:'DM Sans',sans-serif;
    color:var(--ink); width:100%;
  }
  .sp-search input::placeholder { color:var(--ink3); }

  .sp-screening-list {
    padding:10px; max-height:540px; overflow-y:auto;
    display:flex; flex-direction:column; gap:7px;
  }

  .sp-screening-item {
    padding:12px 14px; border-radius:13px; cursor:pointer;
    border:1.5px solid var(--border);
    background:var(--card2);
    transition:all 0.18s;
  }
  .sp-screening-item:hover { background:var(--pink5); border-color:var(--pink-border); }
  .sp-screening-item.active {
    background:var(--pink5);
    border-color:var(--pink);
    box-shadow:0 0 0 3px rgba(236,72,153,0.10);
  }
  .sp-si-name { font-weight:700; font-size:13px; color:var(--ink); margin-bottom:4px; }
  .sp-si-meta { font-size:11.5px; color:var(--ink3); display:flex; flex-direction:column; gap:2px; }
  .sp-si-badge {
    margin-top:6px; display:inline-flex; align-items:center; gap:4px;
    background:var(--pink5); color:var(--pink2);
    border:1px solid var(--pink-border);
    border-radius:99px; padding:2px 8px;
    font-size:10.5px; font-weight:700;
  }

  /* RIGHT PANEL */
  .sp-right { flex:1; min-width:400px; animation:spUp 0.45s 0.08s ease both; }

  /* INFO BAR */
  .sp-info-bar {
    background:var(--card); border:1.5px solid var(--border);
    border-radius:18px; padding:16px 20px; margin-bottom:18px;
    box-shadow:var(--sh);
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:12px;
    position:relative; overflow:hidden;
  }
  .sp-info-bar::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,var(--pink),var(--mauve));
  }
  .sp-info-event {
    font-family:'Playfair Display',serif;
    font-size:17px; font-weight:800; color:var(--ink);
  }
  .sp-info-meta { font-size:12.5px; color:var(--ink3); margin-top:3px; }
  .sp-info-count {
    font-family:'JetBrains Mono',monospace;
    font-size:12px; font-weight:600; color:var(--pink2);
    background:var(--pink5); border:1px solid var(--pink-border);
    padding:4px 12px; border-radius:99px;
  }
  .sp-btn-row { display:flex; gap:8px; flex-wrap:wrap; }

  .sp-btn {
    display:flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:10px;
    font-size:12.5px; font-weight:700;
    font-family:'DM Sans',sans-serif;
    border:none; cursor:pointer;
    transition:all 0.2s cubic-bezier(.34,1.56,.64,1);
  }
  .sp-btn:hover { transform:translateY(-2px) scale(1.04); }
  .sp-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none!important; }

  .sp-btn-generate {
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    color:#fff; box-shadow:0 4px 14px var(--pink-glow);
  }
  .sp-btn-generate:hover { box-shadow:0 8px 22px var(--pink-glow); }

  .sp-btn-clear {
    background:rgba(220,38,38,0.09); color:var(--red);
    border:1.5px solid rgba(220,38,38,0.22)!important; border:none;
  }
  .sp-btn-clear:hover { background:rgba(220,38,38,0.16); }

  /* MESSAGE */
  .sp-msg {
    border-radius:12px; padding:11px 16px;
    font-size:13.5px; font-weight:600; margin-bottom:16px;
  }
  .sp-msg.ok  { background:rgba(22,163,74,0.09); color:var(--green); border:1px solid rgba(22,163,74,0.22); }
  .sp-msg.err { background:rgba(220,38,38,0.09); color:var(--red);   border:1px solid rgba(220,38,38,0.22); }

  /* DEFAULT PRICES */
  .sp-default-prices {
    background:var(--card); border:1.5px solid var(--border);
    border-radius:18px; padding:20px 22px; margin-bottom:18px;
    box-shadow:var(--sh);
  }
  .sp-dp-title {
    font-family:'Playfair Display',serif;
    font-size:15px; font-weight:800; color:var(--ink); margin-bottom:14px;
    display:flex; align-items:center; gap:8px;
  }
  .sp-dp-row { display:flex; gap:14px; flex-wrap:wrap; }
  .sp-dp-item { display:flex; align-items:center; gap:8px; }
  .sp-dp-dot { width:10px; height:10px; border-radius:50%; }
  .sp-dp-label { font-size:13px; color:var(--ink2); font-weight:600; }
  .sp-dp-input {
    width:80px; padding:6px 10px; border-radius:9px;
    border:1.5px solid var(--border);
    background:var(--card2); font-size:13px;
    font-family:'JetBrains Mono',monospace; color:var(--ink);
    outline:none; transition:border-color 0.2s;
  }
  .sp-dp-input:focus { border-color:var(--pink-border); }

  /* ── SEAT GRID CARD ── */
  .sp-seat-card {
    background:var(--card); border:1.5px solid var(--border);
    border-radius:20px; padding:28px 24px;
    box-shadow:var(--sh); overflow:hidden; position:relative;
  }

  /* ── CURVED STAGE ── */
  .sp-stage-wrap {
    display:flex; flex-direction:column; align-items:center;
    margin-bottom:28px;
  }

  .sp-stage {
    position:relative; width:70%; max-width:440px;
    height:52px; margin-bottom:6px;
  }

  .sp-stage-shape {
    width:100%; height:100%;
    background:linear-gradient(180deg, rgba(236,72,153,0.13) 0%, rgba(192,132,252,0.08) 100%);
    border:1.5px solid var(--pink-border);
    border-radius:50% 50% 0 0 / 100% 100% 0 0;
    display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden;
  }

  .sp-stage-shape::before {
    content:'';
    position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg, transparent, var(--pink), var(--mauve), var(--pink), transparent);
    border-radius:50%;
  }

  .sp-stage-text {
    font-size:11px; font-weight:800;
    text-transform:uppercase; letter-spacing:0.18em;
    color:var(--pink2); opacity:0.7;
    font-family:'DM Sans',sans-serif;
    padding-top:14px;
  }

  .sp-stage-beam {
    position:absolute; bottom:-2px; left:50%;
    transform:translateX(-50%);
    width:120%; height:30px;
    background:linear-gradient(180deg, rgba(236,72,153,0.12), transparent);
    border-radius:50%;
    pointer-events:none;
  }

  /* ── LEGEND ── */
  .sp-legend {
    display:flex; gap:14px; justify-content:center;
    flex-wrap:wrap; margin-bottom:22px;
  }
  .sp-leg-item {
    display:flex; align-items:center; gap:6px;
    font-size:11.5px; color:var(--ink3); font-weight:600;
  }
  .sp-leg-dot {
    width:14px; height:14px; border-radius:4px;
    border:1.5px solid rgba(0,0,0,0.08);
  }

  /* ── SEAT ROWS ── */
  .sp-rows { overflow-x:auto; padding-bottom:8px; }

  .sp-row {
    display:flex; align-items:center; gap:5px;
    margin-bottom:8px; justify-content:center;
  }

  .sp-row-label {
    width:22px; text-align:right; flex-shrink:0;
    font-size:11px; font-weight:700; color:var(--ink3);
    font-family:'JetBrains Mono',monospace;
    margin-right:4px;
  }

  .sp-seat {
    width:34px; height:34px; border-radius:8px 8px 5px 5px;
    display:flex; align-items:center; justify-content:center;
    font-size:10px; font-weight:700;
    cursor:default; position:relative;
    transition:transform 0.15s, box-shadow 0.15s;
    font-family:'JetBrains Mono',monospace;
  }

  .sp-seat:hover { transform:translateY(-3px) scale(1.1); z-index:2; }

  .sp-seat::before {
    content:'';
    position:absolute; top:-4px; left:20%; right:20%;
    height:5px; border-radius:3px 3px 0 0;
    background:inherit; filter:brightness(0.85);
  }

  .sp-seat.assigned {}
  .sp-seat.unassigned { opacity:0.35; }
  .sp-seat.booked { opacity:0.6; }

  /* ── PRICE EDITOR ── */
  .sp-divider {
    height:1px; background:var(--border);
    margin:24px 0;
  }
  .sp-price-title {
    font-family:'Playfair Display',serif;
    font-size:15px; font-weight:800; color:var(--ink);
    margin-bottom:14px; display:flex; align-items:center; gap:8px;
  }
  .sp-price-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(155px,1fr));
    gap:10px;
  }
  .sp-price-item {
    background:var(--pink4); border:1.5px solid var(--border);
    border-radius:13px; padding:12px 14px;
    transition:border-color 0.15s;
  }
  .sp-price-item:hover { border-color:var(--pink-border); }
  .sp-pi-top {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:8px;
  }
  .sp-pi-name { font-size:13px; font-weight:700; color:var(--ink); }
  .sp-pi-cat  { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; }
  .sp-pi-input-wrap { display:flex; align-items:center; gap:6px; }
  .sp-pi-rupee { font-size:14px; color:var(--ink3); font-weight:600; }
  .sp-pi-input {
    flex:1; padding:6px 8px; border-radius:8px;
    border:1.5px solid var(--border);
    background:var(--card); font-size:13px;
    font-family:'JetBrains Mono',monospace; color:var(--ink);
    outline:none; transition:border-color 0.2s;
  }
  .sp-pi-input:focus { border-color:var(--pink-border); }
  .sp-pi-status {
    margin-top:6px; font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.08em;
  }

  /* EMPTY / SPINNER */
  .sp-empty {
    display:flex; flex-direction:column; align-items:center;
    padding:60px 0; gap:12px;
  }
  .sp-empty-icon { font-size:48px; opacity:0.25; }
  .sp-empty-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--ink); }
  .sp-empty-sub { font-size:13px; color:var(--ink3); }

  /* ✅ NEW — no seats banner */
  .sp-no-seats-banner {
    background: rgba(220,38,38,0.07);
    border: 1.5px solid rgba(220,38,38,0.22);
    border-radius: 16px;
    padding: 28px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    text-align: center;
  }
  .sp-no-seats-icon { font-size: 44px; opacity: 0.5; }
  .sp-no-seats-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 800; color: var(--ink);
  }
  .sp-no-seats-sub { font-size: 13px; color: var(--ink3); }
  .sp-no-seats-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 22px; border-radius: 12px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border: none; cursor: pointer;
    font-size: 13.5px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px var(--pink-glow);
    transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
    margin-top: 4px;
    text-decoration: none;
  }
  .sp-no-seats-btn:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 22px var(--pink-glow); }

  .sp-spin-wrap { display:flex; align-items:center; justify-content:center; padding:80px 0; }
  .sp-spinner {
    width:42px; height:42px; border:3px solid var(--pink4); border-top-color:var(--pink);
    border-radius:50%; animation:spSpin 0.75s linear infinite;
    box-shadow:0 0 18px var(--pink-glow);
  }

  @keyframes spSpin { to{transform:rotate(360deg);} }
  @keyframes spUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

  @media (max-width:900px) {
    .sp-layout { flex-direction:column; }
    .sp-left { width:100%; }
    .sp-right { min-width:0; width:100%; }
  }
  @media (max-width:768px) { .sp-main { padding:22px 14px 48px; } }
`;

// Category color map
const CAT_COLORS = {
  vip:      { bg:'rgba(236,72,153,0.18)', border:'#ec4899', text:'#db2777',   dot:'#ec4899'  },
  premium:  { bg:'rgba(245,158,11,0.18)', border:'#f59e0b', text:'#b45309',   dot:'#f59e0b'  },
  front:    { bg:'rgba(236,72,153,0.18)', border:'#ec4899', text:'#db2777',   dot:'#ec4899'  },
  middle:   { bg:'rgba(14,165,233,0.15)', border:'#0ea5e9', text:'#0284c7',   dot:'#0ea5e9'  },
  back:     { bg:'rgba(100,116,139,0.15)',border:'#64748b', text:'#475569',   dot:'#64748b'  },
  balcony:  { bg:'rgba(45,212,191,0.15)', border:'#2dd4bf', text:'#0d9488',   dot:'#2dd4bf'  },
  regular:  { bg:'rgba(139,92,246,0.13)', border:'#8b5cf6', text:'#6d28d9',   dot:'#8b5cf6'  },
  default:  { bg:'rgba(168,112,144,0.12)',border:'#a87090', text:'#6b3a54',   dot:'#a87090'  },
};

const getCatStyle = (cat) => {
  if (!cat) return CAT_COLORS.default;
  const k = cat.toLowerCase();
  for (const key of Object.keys(CAT_COLORS)) {
    if (k.includes(key)) return CAT_COLORS[key];
  }
  return CAT_COLORS.default;
};

export default function ManageSeatsPage() {
  const [screenings, setScreenings]               = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [venueSeats, setVenueSeats]               = useState([]);
  const [screeningSeats, setScreeningSeats]       = useState([]);
  const [loading, setLoading]                     = useState(false);
  const [generating, setGenerating]               = useState(false);
  const [search, setSearch]                       = useState('');
  const [priceMap, setPriceMap]                   = useState({});
  const [defaultPrices, setDefaultPrices]         = useState({ Regular:150, Premium:250, VIP:400, Balcony:200, Front:300, Middle:200, Back:150 });
  const [saving, setSaving]                       = useState(false);
  const [message, setMessage]                     = useState('');
  const [msgType, setMsgType]                     = useState('ok');
  const [events, setEvents]                       = useState({});
  const [venues, setVenues]                       = useState({});

  useEffect(() => {
    screeningsAPI.getAll().then(async (list) => {
      setScreenings(list);
      const eMap = {}, vMap = {};
      await Promise.all(list.map(async (s) => {
        if (s.event?.eventId && !eMap[s.event.eventId]) {
          try { eMap[s.event.eventId] = (await eventsAPI.getById(s.event.eventId)).title; } catch (_) {}
        }
        if (s.venue?.venueId && !vMap[s.venue.venueId]) {
          try { vMap[s.venue.venueId] = (await venuesAPI.getById(s.venue.venueId)).venueName; } catch (_) {}
        }
      }));
      setEvents(eMap); setVenues(vMap);
    });
  }, []);

  const loadScreeningData = async (screening) => {
    setSelectedScreening(screening); setLoading(true); setMessage('');
    try {
      const [vSeats, sSeats] = await Promise.all([
        seatsAPI.getByVenue(screening.venue?.venueId),
        screeningSeatsAPI.getByScreening(screening.screeningId),
      ]);
      setVenueSeats(vSeats); setScreeningSeats(sSeats);
      const pm = {};
      sSeats.forEach(ss => { pm[ss.seat?.seatId] = ss.price; });
      setPriceMap(pm);
    } catch (err) { setMessage('Error loading seats: '+err.message); setMsgType('err'); }
    finally { setLoading(false); }
  };

  const categories = [...new Set(venueSeats.map(s => s.seatCategory).filter(Boolean))];
  const getScreeningSeat = (seatId) => screeningSeats.find(ss => ss.seat?.seatId === seatId);

  const handleGenerateAll = async () => {
    if (!selectedScreening) return;
    setGenerating(true); setMessage('');
    try {
      const existing = new Set(screeningSeats.map(ss => ss.seat?.seatId));
      const toCreate = venueSeats.filter(s => !existing.has(s.seatId));
      if (toCreate.length === 0) { setMessage('All seats already exist!'); setMsgType('ok'); setGenerating(false); return; }
      await Promise.all(toCreate.map(seat => {
        const cat = seat.seatCategory || 'Regular';
        const price = defaultPrices[cat] || 150;
        return screeningSeatsAPI.create({
          screening:{ screeningId: selectedScreening.screeningId },
          seat:{ seatId: seat.seatId },
          price, availability:'AVAILABLE',
        });
      }));
      const updated = await screeningSeatsAPI.getByScreening(selectedScreening.screeningId);
      setScreeningSeats(updated);
      const pm = {};
      updated.forEach(ss => { pm[ss.seat?.seatId] = ss.price; });
      setPriceMap(pm);
      setMessage(`✅ Successfully generated ${toCreate.length} seats!`); setMsgType('ok');
    } catch (err) { setMessage('Error: '+err.message); setMsgType('err'); }
    finally { setGenerating(false); }
  };

  const handlePriceUpdate = async (screeningSeatId, newPrice) => {
    try {
      await screeningSeatsAPI.update(screeningSeatId, {
        screening:{ screeningId: selectedScreening.screeningId },
        price: parseFloat(newPrice),
      });
    } catch (err) { setMessage('Price update failed: '+err.message); setMsgType('err'); }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete ALL seats for this screening?')) return;
    setSaving(true);
    try {
      await Promise.all(screeningSeats.map(ss => screeningSeatsAPI.delete(ss.screeningSeatsId)));
      setScreeningSeats([]); setPriceMap({});
      setMessage('All seats deleted.'); setMsgType('ok');
    } catch (err) { setMessage('Error: '+err.message); setMsgType('err'); }
    finally { setSaving(false); }
  };

  // Group by row
  const rows = {};
  venueSeats.forEach(seat => {
    const row = seat.seatRow || '?';
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });
  const sortedRows = Object.keys(rows).sort();

  const filteredScreenings = screenings.filter(s =>
    (events[s.event?.eventId]||'').toLowerCase().includes(search.toLowerCase()) ||
    (venues[s.venue?.venueId]||'').toLowerCase().includes(search.toLowerCase()) ||
    String(s.screeningId).includes(search)
  );

  return (
    <div className="sp" style={{display:'flex',minHeight:'100vh',background:'#fff5fb'}}>
      <style>{S}</style>
      <AdminSidebar/>

      <main className="sp-main">
        <div className="sp-content">

          {/* HEADER */}
          <div className="sp-header">
            <div className="sp-title"><div className="sp-title-bar"/>Seat Layout Manager</div>
            <div className="sp-sub">Select a screening to assign and manage its seats</div>
          </div>

          <div className="sp-layout">

            {/* ── LEFT PANEL ── */}
            <div className="sp-left">
              <div className="sp-left-head">
                <div className="sp-left-title"><div className="sp-left-dot"/>Screenings</div>
                <div className="sp-search">
                  <span style={{fontSize:15,color:'var(--ink3)'}}>🔍</span>
                  <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
              </div>
              <div className="sp-screening-list">
                {filteredScreenings.length === 0 ? (
                  <div style={{textAlign:'center',padding:'24px 0',color:'var(--ink3)',fontSize:13}}>
                    🌸 No screenings found
                  </div>
                ) : filteredScreenings.map(s => {
                  const isActive = selectedScreening?.screeningId === s.screeningId;
                  return (
                    <div key={s.screeningId}
                      className={`sp-screening-item${isActive?' active':''}`}
                      onClick={()=>loadScreeningData(s)}>
                      <div className="sp-si-name">{events[s.event?.eventId]||`Event #${s.event?.eventId}`}</div>
                      <div className="sp-si-meta">
                        <span>📍 {venues[s.venue?.venueId]||`Venue #${s.venue?.venueId}`}</span>
                        <span>📅 {s.screenDate} · ⏰ {s.startTime}</span>
                      </div>
                      {isActive && screeningSeats.length > 0 && (
                        <div className="sp-si-badge">🪑 {screeningSeats.length} seats configured</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="sp-right">
              {!selectedScreening ? (
                <div className="sp-empty">
                  <div className="sp-empty-icon">🪑</div>
                  <div className="sp-empty-title">Select a screening</div>
                  <div className="sp-empty-sub">Choose a screening from the left to manage its seats</div>
                </div>
              ) : loading ? (
                <div className="sp-spin-wrap"><div className="sp-spinner"/></div>
              ) : (
                <>
                  {/* INFO BAR */}
                  <div className="sp-info-bar">
                    <div>
                      <div className="sp-info-event">{events[selectedScreening.event?.eventId]}</div>
                      <div className="sp-info-meta">
                        📍 {venues[selectedScreening.venue?.venueId]} · 📅 {selectedScreening.screenDate} · ⏰ {selectedScreening.startTime}
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                      <span className="sp-info-count">{screeningSeats.length}/{venueSeats.length} seats</span>
                      <div className="sp-btn-row">
                        {screeningSeats.length < venueSeats.length && venueSeats.length > 0 && (
                          <button className="sp-btn sp-btn-generate" onClick={handleGenerateAll} disabled={generating}>
                            {generating ? '⏳ Generating…' : '⚡ Generate All'}
                          </button>
                        )}
                        {screeningSeats.length > 0 && (
                          <button className="sp-btn sp-btn-clear" onClick={handleDeleteAll} disabled={saving}>
                            🗑️ Clear All
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MESSAGE */}
                  {message && (
                    <div className={`sp-msg ${msgType}`}>{message}</div>
                  )}

                  {/* DEFAULT PRICES */}
                  {screeningSeats.length === 0 && venueSeats.length > 0 && (
                    <div className="sp-default-prices">
                      <div className="sp-dp-title">
                        <div className="sp-left-dot"/> Set Default Prices Before Generating
                      </div>
                      <div className="sp-dp-row">
                        {categories.map(cat => {
                          const cs = getCatStyle(cat);
                          return (
                            <div key={cat} className="sp-dp-item">
                              <div className="sp-dp-dot" style={{background:cs.dot}}/>
                              <span className="sp-dp-label">{cat}</span>
                              <input type="number" className="sp-dp-input"
                                value={defaultPrices[cat]||''}
                                onChange={e=>setDefaultPrices(p=>({...p,[cat]:parseFloat(e.target.value)||0}))}
                                placeholder="₹"/>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ✅ UPDATED — No seats in venue with a direct action button */}
                  {venueSeats.length === 0 ? (
                    <div className="sp-no-seats-banner">
                      <div className="sp-no-seats-icon">⚠️</div>
                      <div className="sp-no-seats-title">No seats in venue</div>
                      <div className="sp-no-seats-sub">
                        <strong>{venues[selectedScreening.venue?.venueId]}</strong> has no seats configured yet.
                        <br/>Go to Manage Venues and generate seats for this venue first.
                      </div>
                      {/* ✅ Direct link to venues page */}
                      <a href="/admin/venues" className="sp-no-seats-btn">
                        🏛️ Go to Manage Venues
                      </a>
                    </div>
                  ) : (
                    <div className="sp-seat-card">

                      {/* ── CURVED STAGE ── */}
                      <div className="sp-stage-wrap">
                        <div className="sp-stage">
                          <div className="sp-stage-shape">
                            <span className="sp-stage-text">🎭 Screen / Stage</span>
                            <div className="sp-stage-beam"/>
                          </div>
                        </div>
                      </div>

                      {/* ── LEGEND ── */}
                      <div className="sp-legend">
                        {categories.map(cat => {
                          const cs = getCatStyle(cat);
                          return (
                            <div key={cat} className="sp-leg-item">
                              <div className="sp-leg-dot" style={{background:cs.bg,border:`1.5px solid ${cs.border}`}}/>
                              <span>{cat}</span>
                              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10.5,color:'var(--pink2)',marginLeft:2}}>
                                ₹{defaultPrices[cat]||'—'}
                              </span>
                            </div>
                          );
                        })}
                        <div className="sp-leg-item">
                          <div className="sp-leg-dot" style={{background:'rgba(168,112,144,0.08)',border:'1.5px dashed var(--ink4)'}}/>
                          <span>Not assigned</span>
                        </div>
                        <div className="sp-leg-item">
                          <div className="sp-leg-dot" style={{background:'rgba(220,38,38,0.12)',border:'1.5px solid #fca5a5'}}/>
                          <span>Booked</span>
                        </div>
                      </div>

                      {/* ── SEAT ROWS ── */}
                      <div className="sp-rows">
                        {sortedRows.map((row) => (
                          <div key={row} className="sp-row">
                            <span className="sp-row-label">{row}</span>
                            {rows[row]
                              .sort((a,b)=>(a.seatNo||'').localeCompare(b.seatNo||'',undefined,{numeric:true}))
                              .map(seat => {
                                const ss = getScreeningSeat(seat.seatId);
                                const assigned  = !!ss;
                                const isBooked  = ss?.availability === 'BOOKED';
                                const cs        = getCatStyle(seat.seatCategory);

                                let bg, border, color;
                                if (!assigned) {
                                  bg='rgba(168,112,144,0.06)'; border='1.5px dashed var(--ink4)'; color='var(--ink4)';
                                } else if (isBooked) {
                                  bg='rgba(220,38,38,0.10)'; border='1.5px solid #fca5a5'; color='#dc2626';
                                } else {
                                  bg=cs.bg; border=`1.5px solid ${cs.border}`; color=cs.text;
                                }

                                return (
                                  <div
                                    key={seat.seatId}
                                    className={`sp-seat ${assigned?'assigned':'unassigned'} ${isBooked?'booked':''}`}
                                    title={`${seat.seatNo} · ${seat.seatCategory} · ${assigned?'₹'+ss.price+' · '+ss.availability:'Not assigned'}`}
                                    style={{ background:bg, border, color }}
                                  >
                                    {seat.seatNo?.replace(/[A-Za-z]/g,'')||'?'}
                                  </div>
                                );
                              })}
                          </div>
                        ))}
                      </div>

                      {/* ── PRICE EDITOR ── */}
                      {screeningSeats.length > 0 && (
                        <>
                          <div className="sp-divider"/>
                          <div className="sp-price-title">
                            <div className="sp-left-dot"/> Edit Individual Seat Prices
                          </div>
                          <div className="sp-price-grid">
                            {screeningSeats.map(ss => {
                              const cs = getCatStyle(ss.seat?.seatCategory);
                              const isBooked = ss.availability === 'BOOKED';
                              return (
                                <div key={ss.screeningSeatsId} className="sp-price-item">
                                  <div className="sp-pi-top">
                                    <span className="sp-pi-name">Seat {ss.seat?.seatNo}</span>
                                    <span className="sp-pi-cat" style={{color:cs.text}}>{ss.seat?.seatCategory}</span>
                                  </div>
                                  <div className="sp-pi-input-wrap">
                                    <span className="sp-pi-rupee">₹</span>
                                    <input type="number" className="sp-pi-input"
                                      defaultValue={ss.price}
                                      onBlur={e=>handlePriceUpdate(ss.screeningSeatsId,e.target.value)}
                                      disabled={isBooked}
                                    />
                                  </div>
                                  <div className="sp-pi-status" style={{
                                    color: isBooked ? 'var(--red)' : 'var(--green)'
                                  }}>
                                    {isBooked ? '🔴 Booked' : '🟢 Available'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}