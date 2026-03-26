import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/common/AdminSidebar';
import { venuesAPI, seatsAPI } from '../../services/api';

const EMPTY = { venueName:'', address:'', district:'', region:'', capacity:'' };

const DEFAULT_LAYOUT = [
  { category:'VIP',     rows:'AB',     seatsPerRow:10, ticketPrice:400 },
  { category:'Premium', rows:'CDEF',   seatsPerRow:10, ticketPrice:250 },
  { category:'Regular', rows:'GHIJKL', seatsPerRow:10, ticketPrice:150 },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .vp {
    --pink:#ec4899; --pink2:#db2777; --pink3:#f9a8d4;
    --pink4:#fdf2f8; --pink5:#fff0f9;
    --pink-border:rgba(236,72,153,0.22);
    --pink-glow:rgba(236,72,153,0.18);
    --mauve:#c084fc;
    --green:#16a34a; --green-bg:rgba(22,163,74,0.09); --green-bd:rgba(22,163,74,0.22);
    --red:#dc2626; --red-bg:rgba(220,38,38,0.09); --red-bd:rgba(220,38,38,0.22);
    --teal:#0d9488;
    --bg:#fff5fb; --card:#ffffff; --card2:#faf7f4; --border:#fce7f3;
    --ink:#1e0a17; --ink2:#6b3a54; --ink3:#a87090; --ink4:#d4a8be;
    --sh:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07);
    --sh-up:0 12px 36px rgba(236,72,153,0.14),0 4px 12px rgba(30,10,23,0.06);
    font-family:'DM Sans',sans-serif; color:var(--ink);
  }
  .vp * { box-sizing:border-box; margin:0; padding:0; }

  .vp-main {
    flex:1; margin-left:var(--sidebar-width,240px);
    min-height:100vh; background:var(--bg);
    padding:38px 36px 64px; overflow-y:auto; position:relative;
  }
  .vp-main::before {
    content:''; position:fixed; top:-100px; right:-80px;
    width:420px; height:420px; border-radius:50%;
    background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%);
    pointer-events:none; z-index:0;
  }
  .vp-content { position:relative; z-index:1; }

  /* HEADER */
  .vp-header {
    display:flex; align-items:flex-start; justify-content:space-between;
    flex-wrap:wrap; gap:14px; margin-bottom:28px;
    animation:vpUp 0.4s ease both;
  }
  .vp-title {
    font-family:'Playfair Display',serif;
    font-size:28px; font-weight:800; color:var(--ink); letter-spacing:-0.02em;
    display:flex; align-items:center; gap:10px;
  }
  .vp-title-bar {
    width:5px; height:28px; border-radius:3px;
    background:linear-gradient(180deg,var(--pink),var(--mauve));
    box-shadow:0 0 10px var(--pink-glow);
  }
  .vp-sub { font-size:13.5px; color:var(--ink3); margin-top:6px; }

  .vp-add-btn {
    display:flex; align-items:center; gap:7px;
    padding:11px 20px; border-radius:12px;
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    color:#fff; border:none; cursor:pointer;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 16px var(--pink-glow);
    transition:all 0.2s cubic-bezier(.34,1.56,.64,1);
  }
  .vp-add-btn:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 24px rgba(236,72,153,0.30); }

  /* SEARCH */
  .vp-search {
    display:flex; align-items:center; gap:8px;
    background:var(--card); border:1.5px solid var(--border);
    border-radius:99px; padding:9px 16px;
    box-shadow:var(--sh); max-width:380px;
    margin-bottom:24px; transition:border-color 0.2s;
    animation:vpUp 0.45s 0.05s ease both;
  }
  .vp-search:focus-within { border-color:var(--pink-border); }
  .vp-search input {
    border:none; outline:none; background:transparent;
    font-size:13px; font-family:'DM Sans',sans-serif;
    color:var(--ink); width:100%;
  }
  .vp-search input::placeholder { color:var(--ink3); }

  /* VENUE GRID */
  .vp-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
    gap:18px; animation:vpUp 0.45s 0.08s ease both;
  }

  /* VENUE CARD */
  .vp-card {
    background:var(--card); border:1.5px solid var(--border);
    border-radius:20px; padding:22px 20px 18px;
    box-shadow:var(--sh); position:relative; overflow:hidden;
    transition:transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s, border-color 0.2s;
  }
  .vp-card:hover { transform:translateY(-4px); box-shadow:var(--sh-up); border-color:var(--pink-border); }
  .vp-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,var(--pink),var(--mauve));
    opacity:0; transition:opacity 0.2s;
  }
  .vp-card:hover::before { opacity:1; }

  .vp-card-top {
    display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px;
  }
  .vp-card-icon {
    width:48px; height:48px; border-radius:14px;
    background:linear-gradient(135deg,var(--pink4),#f5f3ff);
    border:1.5px solid var(--border);
    display:flex; align-items:center; justify-content:center; font-size:24px;
    box-shadow:0 2px 8px var(--pink-glow);
  }
  .vp-card-actions { display:flex; gap:6px; }

  .vp-act-btn {
    width:32px; height:32px; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    font-size:14px; cursor:pointer; border:none;
    transition:all 0.18s cubic-bezier(.34,1.56,.64,1);
  }
  .vp-act-btn:hover { transform:scale(1.1); }
  .vp-act-view { background:var(--pink5); color:var(--pink2); border:1.5px solid var(--pink-border)!important; }
  .vp-act-edit { background:rgba(139,92,246,0.09); color:#7c3aed; }
  .vp-act-del  { background:var(--red-bg); color:var(--red); }

  .vp-card-name {
    font-family:'Playfair Display',serif;
    font-size:17px; font-weight:800; color:var(--ink); margin-bottom:10px; line-height:1.2;
  }

  .vp-card-info { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
  .vp-card-row  { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--ink2); }

  .vp-capacity-badge {
    display:inline-flex; align-items:center; gap:5px;
    background:rgba(13,148,136,0.09); color:var(--teal);
    border:1px solid rgba(13,148,136,0.2);
    border-radius:99px; padding:3px 10px;
    font-size:12px; font-weight:700;
    font-family:'JetBrains Mono',monospace;
  }

  /* ✅ NEW — seat count badge */
  .vp-seat-count-badge {
    display:inline-flex; align-items:center; gap:5px;
    border-radius:99px; padding:3px 10px;
    font-size:12px; font-weight:700;
    font-family:'JetBrains Mono',monospace;
    transition: all 0.2s;
  }
  .vp-seat-count-badge.has-seats {
    background: rgba(22,163,74,0.09);
    color: var(--green);
    border: 1px solid rgba(22,163,74,0.22);
  }
  .vp-seat-count-badge.no-seats {
    background: rgba(220,38,38,0.09);
    color: var(--red);
    border: 1px solid rgba(220,38,38,0.22);
  }

  .vp-maps-btn {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 12px; border-radius:99px;
    background:rgba(59,130,246,0.09); color:#2563eb;
    border:1px solid rgba(59,130,246,0.2);
    font-size:11.5px; font-weight:700; cursor:pointer;
    text-decoration:none; transition:all 0.15s;
    font-family:'DM Sans',sans-serif;
  }
  .vp-maps-btn:hover { background:rgba(59,130,246,0.16); transform:translateY(-1px); }

  .vp-card-footer {
    display:flex; gap:8px; padding-top:14px;
    border-top:1px solid var(--border); flex-wrap:wrap;
  }

  .vp-seat-btn {
    flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
    padding:9px 14px; border-radius:11px;
    background:var(--pink5); color:var(--pink2);
    border:1.5px solid var(--pink-border); cursor:pointer;
    font-size:12.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    transition:all 0.18s cubic-bezier(.34,1.56,.64,1);
  }
  .vp-seat-btn:hover { background:#fce7f3; transform:translateY(-2px); box-shadow:0 4px 14px var(--pink-glow); }

  /* EMPTY */
  .vp-empty { display:flex; flex-direction:column; align-items:center; padding:64px 0; gap:14px; }
  .vp-empty-icon { font-size:48px; opacity:0.25; }
  .vp-empty-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--ink); }
  .vp-empty-sub { font-size:13.5px; color:var(--ink3); }

  /* SPINNER */
  .vp-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .vp-spinner {
    width:42px; height:42px; border:3px solid var(--pink4); border-top-color:var(--pink);
    border-radius:50%; animation:vpSpin 0.75s linear infinite; box-shadow:0 0 18px var(--pink-glow);
  }

  /* ── MODALS ── */
  .vp-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(30,10,23,0.45); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    padding:20px; animation:vpFadeIn 0.2s ease both;
  }
  @keyframes vpFadeIn { from{opacity:0;} to{opacity:1;} }

  .vp-modal {
    background:var(--card); border-radius:22px;
    border:1.5px solid var(--border);
    box-shadow:0 24px 80px rgba(236,72,153,0.18),0 8px 24px rgba(30,10,23,0.12);
    width:100%; animation:vpSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both;
    overflow:hidden; max-height:90vh; display:flex; flex-direction:column;
  }
  @keyframes vpSlideUp {
    from{opacity:0;transform:translateY(28px) scale(0.97);}
    to{opacity:1;transform:translateY(0) scale(1);}
  }

  .vp-modal-head {
    padding:20px 24px 16px; border-bottom:1.5px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(135deg,var(--pink4),#fff); flex-shrink:0;
  }
  .vp-modal-title {
    font-family:'Playfair Display',serif;
    font-size:20px; font-weight:800; color:var(--ink);
    display:flex; align-items:center; gap:8px;
  }
  .vp-modal-close {
    width:34px; height:34px; border-radius:50%;
    background:var(--pink5); border:1.5px solid var(--pink-border);
    color:var(--pink2); font-size:16px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.18s;
  }
  .vp-modal-close:hover { background:var(--pink3); transform:scale(1.08); }

  .vp-modal-body { padding:22px 24px; overflow-y:auto; flex:1; }
  .vp-modal-foot {
    padding:16px 24px; border-top:1.5px solid var(--border);
    display:flex; gap:10px; justify-content:flex-end;
    background:var(--pink4); flex-shrink:0;
  }

  /* form modal */
  .vp-form-group { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
  .vp-form-label { font-size:12px; font-weight:700; color:var(--ink2); text-transform:uppercase; letter-spacing:0.07em; }
  .vp-form-input {
    padding:10px 14px; border-radius:11px; border:1.5px solid var(--border);
    background:var(--card2); font-size:13.5px;
    font-family:'DM Sans',sans-serif; color:var(--ink);
    outline:none; transition:border-color 0.2s;
  }
  .vp-form-input:focus { border-color:var(--pink-border); box-shadow:0 0 0 3px rgba(236,72,153,0.08); }
  .vp-form-input::placeholder { color:var(--ink4); }

  .vp-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  .vp-error {
    background:var(--red-bg); border:1px solid var(--red-bd);
    border-radius:10px; padding:10px 14px;
    color:var(--red); font-size:13.5px; font-weight:600; margin-bottom:14px;
  }

  .vp-btn-cancel {
    padding:10px 22px; border-radius:11px;
    background:var(--card2); color:var(--ink2);
    border:1.5px solid var(--border); cursor:pointer;
    font-size:13.5px; font-weight:600; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .vp-btn-cancel:hover { border-color:var(--pink-border); color:var(--pink2); }

  .vp-btn-save {
    padding:10px 24px; border-radius:11px;
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    color:#fff; border:none; cursor:pointer;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 14px var(--pink-glow); transition:all 0.18s;
  }
  .vp-btn-save:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 22px var(--pink-glow); }
  .vp-btn-save:disabled { opacity:0.6; cursor:not-allowed; }

  .vp-btn-delete {
    padding:10px 22px; border-radius:11px;
    background:var(--red-bg); color:var(--red);
    border:1.5px solid var(--red-bd); cursor:pointer;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .vp-btn-delete:hover { background:rgba(220,38,38,0.16); }

  /* VIEW DETAILS MODAL */
  .vp-detail-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
  .vp-detail-field {
    background:var(--pink4); border:1px solid var(--border);
    border-radius:12px; padding:12px 14px;
  }
  .vp-detail-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink3); margin-bottom:5px; }
  .vp-detail-val { font-size:14px; font-weight:600; color:var(--ink); }

  .vp-seat-summary {
    background:var(--pink4); border:1.5px solid var(--border);
    border-radius:14px; padding:16px; margin-bottom:12px;
  }
  .vp-seat-cats { display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }
  .vp-seat-cat-pill {
    display:inline-flex; align-items:center; gap:4px;
    padding:4px 10px; border-radius:99px;
    font-size:11px; font-weight:700;
    background:var(--pink5); color:var(--pink2);
    border:1px solid var(--pink-border);
  }

  .vp-maps-big {
    display:flex; align-items:center; justify-content:center; gap:8px;
    padding:11px; border-radius:12px;
    background:rgba(59,130,246,0.09); color:#2563eb;
    border:1.5px solid rgba(59,130,246,0.22);
    font-size:13.5px; font-weight:700; cursor:pointer;
    text-decoration:none; transition:all 0.18s;
    font-family:'DM Sans',sans-serif; margin-bottom:0;
  }
  .vp-maps-big:hover { background:rgba(59,130,246,0.16); transform:translateY(-1px); box-shadow:0 4px 16px rgba(59,130,246,0.2); }

  /* SEAT LAYOUT MODAL */
  .vp-seat-exists {
    background:var(--green-bg); border:1px solid var(--green-bd);
    border-radius:12px; padding:14px 16px; margin-bottom:16px;
  }
  .vp-seat-warn {
    background:var(--red-bg); border:1px solid var(--red-bd);
    border-radius:12px; padding:12px 14px; margin-bottom:16px;
    font-size:13px; color:var(--red); font-weight:600;
  }
  .vp-seat-msg-ok  { background:var(--green-bg); border:1px solid var(--green-bd); border-radius:10px; padding:10px 14px; color:var(--green); font-size:13.5px; font-weight:600; margin-bottom:14px; }
  .vp-seat-msg-err { background:var(--red-bg);   border:1px solid var(--red-bd);   border-radius:10px; padding:10px 14px; color:var(--red);   font-size:13.5px; font-weight:600; margin-bottom:14px; }

  .vp-layout-header {
    display:grid; grid-template-columns:1fr 2fr 1fr 1fr 32px;
    gap:10px; font-size:10.5px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.08em;
    color:var(--ink3); padding:0 4px; margin-bottom:8px;
  }
  .vp-layout-row {
    display:grid; grid-template-columns:1fr 2fr 1fr 1fr 32px;
    gap:10px; align-items:center; margin-bottom:8px;
  }
  .vp-layout-input {
    padding:7px 10px; border-radius:9px; border:1.5px solid var(--border);
    background:var(--card2); font-size:13px;
    font-family:'DM Sans',sans-serif; color:var(--ink);
    outline:none; transition:border-color 0.2s; width:100%;
  }
  .vp-layout-input:focus { border-color:var(--pink-border); }
  .vp-remove-btn { background:none; border:none; color:var(--red); cursor:pointer; font-size:18px; padding:0; transition:transform .15s; }
  .vp-remove-btn:hover { transform:scale(1.2); }
  .vp-add-section {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 14px; border-radius:9px;
    background:var(--pink5); color:var(--pink2);
    border:1.5px solid var(--pink-border); cursor:pointer;
    font-size:12.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    margin-bottom:14px; transition:all 0.15s;
  }
  .vp-add-section:hover { background:#fce7f3; }
  .vp-seat-count { font-size:12.5px; color:var(--ink3); margin-bottom:16px; font-weight:500; }
  .vp-seat-count strong { color:var(--pink2); font-family:'JetBrains Mono',monospace; }

  .vp-generate-btn {
    padding:10px 22px; border-radius:11px;
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    color:#fff; border:none; cursor:pointer;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 14px var(--pink-glow); transition:all 0.18s;
  }
  .vp-generate-btn:hover:not(:disabled) { transform:translateY(-1px); }
  .vp-generate-btn:disabled { opacity:0.6; cursor:not-allowed; }

  .vp-del-seats-btn {
    display:inline-flex; align-items:center; gap:5px;
    margin-top:10px; padding:6px 12px; border-radius:9px;
    background:var(--red-bg); color:var(--red);
    border:1px solid var(--red-bd); cursor:pointer;
    font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .vp-del-seats-btn:hover { background:rgba(220,38,38,0.16); }
  .vp-del-seats-btn:disabled { opacity:0.5; cursor:not-allowed; }

  @keyframes vpSpin  { to{transform:rotate(360deg);} }
  @keyframes vpUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

  @media(max-width:768px) {
    .vp-main { padding:22px 14px 48px; }
    .vp-detail-row { grid-template-columns:1fr; }
    .vp-layout-header,.vp-layout-row { grid-template-columns:1fr 1.5fr 0.8fr 0.8fr 28px; }
  }
`;

export default function ManageVenuesPage() {
  const [venues, setVenues]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [modal, setModal]                 = useState(null);
  const [form, setForm]                   = useState(EMPTY);
  const [editId, setEditId]               = useState(null);
  const [saving, setSaving]               = useState(false);
  const [search, setSearch]               = useState('');
  const [activeVenue, setActiveVenue]     = useState(null);
  const [error, setError]                 = useState('');

  /* seat state */
  const [existingSeats, setExistingSeats] = useState([]);
  const [seatLayout, setSeatLayout]       = useState(DEFAULT_LAYOUT);
  const [generating, setGenerating]       = useState(false);
  const [seatMsg, setSeatMsg]             = useState('');
  const [loadingSeats, setLoadingSeats]   = useState(false);

  // ✅ UPDATED fetchVenues — now also fetches seat count per venue
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const list = await venuesAPI.getAll();
      const withCounts = await Promise.all(
        list.map(async v => {
          try {
            const seats = await seatsAPI.getByVenue(v.venueId);
            return { ...v, seatCount: seats.length };
          } catch {
            return { ...v, seatCount: 0 };
          }
        })
      );
      setVenues(withCounts);
    } catch (err) {
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVenues(); }, []);

  /* ── open helpers ── */
  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal('form'); };
  const openEdit   = v => { setForm({ venueName:v.venueName, address:v.address, district:v.district, region:v.region, capacity:v.capacity }); setEditId(v.venueId); setError(''); setActiveVenue(v); setModal('form'); };
  const openView   = v => { setActiveVenue(v); loadSeats(v); setModal('view'); };
  const openDelete = v => { setActiveVenue(v); setModal('delete'); };

  const openSeat = async v => {
    setActiveVenue(v); setSeatMsg(''); setModal('seat'); setSeatLayout(DEFAULT_LAYOUT);
    await loadSeats(v);
  };

  const loadSeats = async v => {
    setLoadingSeats(true);
    try { const s = await seatsAPI.getByVenue(v.venueId); setExistingSeats(s); }
    catch(_) { setExistingSeats([]); }
    finally { setLoadingSeats(false); }
  };

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSave = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = {...form, capacity:parseInt(form.capacity)};
      if (editId) await venuesAPI.update(editId, payload);
      else        await venuesAPI.create(payload);
      setModal(null); fetchVenues();
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await venuesAPI.delete(activeVenue.venueId); fetchVenues(); setModal(null); }
    catch(err) { alert(err.message); }
  };

  /* seat layout */
  const updateLayout = (i,k,v) => setSeatLayout(prev=>prev.map((r,idx)=>idx===i?{...r,[k]:v}:r));
  const addRow    = () => setSeatLayout(p=>[...p,{category:'Regular',rows:'',seatsPerRow:10,ticketPrice:150}]);
  const removeRow = i  => setSeatLayout(p=>p.filter((_,idx)=>idx!==i));

  const handleGenerate = async () => {
    if (!activeVenue) return;
    setGenerating(true); setSeatMsg('');
    try {
      const toCreate = [];
      for (const sec of seatLayout) {
        for (const letter of sec.rows.toUpperCase().split('')) {
          for (let n=1; n<=parseInt(sec.seatsPerRow); n++) {
            toCreate.push({
              venue:{ venueId: activeVenue.venueId },
              seatRow: letter,
              seatNo: `${letter}${n}`,
              seatCategory: sec.category,
              ticketPrice: parseFloat(sec.ticketPrice) || 0
            });
          }
        }
      }

      if (!toCreate.length) { setSeatMsg('No seats to generate.'); setGenerating(false); return; }

      const existing = await seatsAPI.getByVenue(activeVenue.venueId);
      const existingNos = new Set(existing.map(s => s.seatNo));
      const newSeats = toCreate.filter(s => !existingNos.has(s.seatNo));

      if (!newSeats.length) {
        setSeatMsg('✅ All seats already exist!');
        setGenerating(false); return;
      }

      const BATCH = 5;
      let created = 0;

      for (let i = 0; i < newSeats.length; i += BATCH) {
        const batch = newSeats.slice(i, i + BATCH);
        for (const seat of batch) {
          try {
            await seatsAPI.create(seat);
            created++;
          } catch(e) {
            if (!e.message?.includes('already exists')) throw e;
          }
        }
        setSeatMsg(`⏳ Creating seats... ${created}/${newSeats.length}`);
      }

      const updated = await seatsAPI.getByVenue(activeVenue.venueId);
      setExistingSeats(updated);
      setSeatMsg(`✅ Generated ${created} seats successfully!`);
      fetchVenues(); // ✅ refresh seat counts on cards
    } catch(err) { setSeatMsg('Error: '+err.message); }
    finally { setGenerating(false); }
  };

  const handleDeleteSeats = async () => {
    if (!window.confirm(`Delete ALL ${existingSeats.length} seats?`)) return;
    setGenerating(true);
    try {
      const BATCH=20;
      for (let i=0; i<existingSeats.length; i+=BATCH)
        await Promise.all(existingSeats.slice(i,i+BATCH).map(s=>seatsAPI.delete(s.seatId)));
      setExistingSeats([]);
      setSeatMsg('All seats deleted.');
      fetchVenues(); // ✅ refresh seat counts on cards
    } catch(err) { setSeatMsg('Error: '+err.message); }
    finally { setGenerating(false); }
  };

  const seatsByCategory = existingSeats.reduce((acc,s)=>{
    const c=s.seatCategory||'Unknown'; acc[c]=(acc[c]||0)+1; return acc;
  },{});

  const totalSeats = seatLayout.reduce((s,r)=>s+(r.rows.length*parseInt(r.seatsPerRow||0)),0);

  const mapsUrl = v => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.venueName} ${v.address} ${v.district}`)}`;

  const filtered = venues.filter(v =>
    v.venueName?.toLowerCase().includes(search.toLowerCase()) ||
    v.district?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vp" style={{display:'flex',minHeight:'100vh',background:'#fff5fb'}}>
      <style>{S}</style>
      <AdminSidebar/>

      <main className="vp-main">
        <div className="vp-content">

          {/* HEADER */}
          <div className="vp-header">
            <div>
              <div className="vp-title"><div className="vp-title-bar"/>Manage Venues</div>
              <div className="vp-sub">{venues.length} venue{venues.length!==1?'s':''} registered</div>
            </div>
            <button className="vp-add-btn" onClick={openCreate}>＋ Add Venue</button>
          </div>

          {/* SEARCH */}
          <div className="vp-search">
            <span style={{fontSize:15,color:'var(--ink3)'}}>🔍</span>
            <input placeholder="Search venues..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>

          {loading ? (
            <div className="vp-spin-wrap"><div className="vp-spinner"/></div>
          ) : filtered.length===0 ? (
            <div className="vp-empty">
              <div className="vp-empty-icon">🏛️</div>
              <div className="vp-empty-title">No venues found</div>
              <div className="vp-empty-sub">Add your first venue!</div>
              <button className="vp-add-btn" onClick={openCreate}>＋ Add Venue</button>
            </div>
          ) : (
            <div className="vp-grid">
              {filtered.map(v=>(
                <div key={v.venueId} className="vp-card">
                  <div className="vp-card-top">
                    <div className="vp-card-icon">🏛️</div>
                    <div className="vp-card-actions">
                      <button className="vp-act-btn vp-act-view" title="View Details" onClick={()=>openView(v)}>👁️</button>
                      <button className="vp-act-btn vp-act-edit" title="Edit" onClick={()=>openEdit(v)}>✏️</button>
                      <button className="vp-act-btn vp-act-del"  title="Delete" onClick={()=>openDelete(v)}>🗑️</button>
                    </div>
                  </div>

                  <div className="vp-card-name">{v.venueName}</div>

                  <div className="vp-card-info">
                    <div className="vp-card-row">📍 {v.address}</div>
                    <div className="vp-card-row">🗺️ {v.district}, {v.region}</div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:2,flexWrap:'wrap'}}>
                      <span className="vp-capacity-badge">👥 {Number(v.capacity||0).toLocaleString()} capacity</span>
                      {/* ✅ NEW — seat count badge, green if seats exist, red if not */}
                      <span className={`vp-seat-count-badge ${(v.seatCount||0) > 0 ? 'has-seats' : 'no-seats'}`}>
                        🪑 {(v.seatCount||0) > 0 ? `${v.seatCount} seats` : 'No seats!'}
                      </span>
                      <a href={mapsUrl(v)} target="_blank" rel="noreferrer" className="vp-maps-btn">
                        📌 Maps
                      </a>
                    </div>
                  </div>

                  <div className="vp-card-footer">
                    <button className="vp-seat-btn" onClick={()=>openSeat(v)}>
                      🪑 Manage Seat Layout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── VIEW DETAILS MODAL ── */}
      {modal==='view' && activeVenue && (
        <div className="vp-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="vp-modal" style={{maxWidth:520}}>
            <div className="vp-modal-head">
              <div className="vp-modal-title">🏛️ {activeVenue.venueName}</div>
              <button className="vp-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="vp-modal-body">
              <div className="vp-detail-row">
                <div className="vp-detail-field">
                  <div className="vp-detail-lbl">📍 Address</div>
                  <div className="vp-detail-val">{activeVenue.address}</div>
                </div>
                <div className="vp-detail-field">
                  <div className="vp-detail-lbl">🗺️ District</div>
                  <div className="vp-detail-val">{activeVenue.district}</div>
                </div>
              </div>
              <div className="vp-detail-row">
                <div className="vp-detail-field">
                  <div className="vp-detail-lbl">🌐 Region</div>
                  <div className="vp-detail-val">{activeVenue.region}</div>
                </div>
                <div className="vp-detail-field">
                  <div className="vp-detail-lbl">👥 Capacity</div>
                  <div className="vp-detail-val" style={{fontFamily:'JetBrains Mono,monospace',color:'var(--teal)',fontSize:18,fontWeight:800}}>
                    {Number(activeVenue.capacity||0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Seats breakdown */}
              <div className="vp-seat-summary">
                <div style={{fontSize:13,fontWeight:700,color:'var(--ink)',marginBottom:2}}>🪑 Seat Configuration</div>
                {loadingSeats ? (
                  <div style={{fontSize:12.5,color:'var(--ink3)',marginTop:8}}>Loading seats…</div>
                ) : existingSeats.length===0 ? (
                  <div style={{fontSize:12.5,color:'var(--red)',marginTop:8,fontWeight:600}}>
                    ⚠️ No seats configured yet — go to Manage Seat Layout to add seats
                  </div>
                ) : (
                  <>
                    <div style={{fontSize:13,color:'var(--green)',fontWeight:700,marginTop:6}}>
                      ✅ {existingSeats.length} seats configured
                    </div>
                    <div className="vp-seat-cats">
                      {Object.entries(seatsByCategory).map(([cat,count])=>(
                        <span key={cat} className="vp-seat-cat-pill">{cat}: {count}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Google Maps */}
              <a href={mapsUrl(activeVenue)} target="_blank" rel="noreferrer" className="vp-maps-big">
                📌 Open in Google Maps
              </a>
            </div>
            <div className="vp-modal-foot">
              <button className="vp-btn-cancel" onClick={()=>setModal(null)}>Close</button>
              <button className="vp-btn-save" style={{background:'linear-gradient(135deg,#7c3aed,#a78bfa)'}}
                onClick={()=>{ setModal(null); openEdit(activeVenue); }}>
                ✏️ Edit Venue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM MODAL ── */}
      {modal==='form' && (
        <div className="vp-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="vp-modal" style={{maxWidth:520}}>
            <div className="vp-modal-head">
              <div className="vp-modal-title">{editId?'✏️ Edit Venue':'🏛️ Add Venue'}</div>
              <button className="vp-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="vp-modal-body">
              {error && <div className="vp-error">{error}</div>}
              <form id="vp-form" onSubmit={handleSave}>
                <div className="vp-form-group">
                  <label className="vp-form-label">Venue Name *</label>
                  <input className="vp-form-input" value={form.venueName} onChange={e=>set('venueName',e.target.value)} placeholder="e.g. PVR Cinemas" required/>
                </div>
                <div className="vp-form-group">
                  <label className="vp-form-label">Address *</label>
                  <input className="vp-form-input" value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Full address" required/>
                </div>
                <div className="vp-form-grid">
                  <div className="vp-form-group">
                    <label className="vp-form-label">District *</label>
                    <input className="vp-form-input" value={form.district} onChange={e=>set('district',e.target.value)} placeholder="Chennai" required/>
                  </div>
                  <div className="vp-form-group">
                    <label className="vp-form-label">Region *</label>
                    <input className="vp-form-input" value={form.region} onChange={e=>set('region',e.target.value)} placeholder="Tamil Nadu" required/>
                  </div>
                </div>
                <div className="vp-form-group">
                  <label className="vp-form-label">Capacity *</label>
                  <input className="vp-form-input" type="number" value={form.capacity} onChange={e=>set('capacity',e.target.value)} placeholder="500" required min={1}/>
                </div>
              </form>
            </div>
            <div className="vp-modal-foot">
              <button className="vp-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button className="vp-btn-save" form="vp-form" type="submit" disabled={saving}>
                {saving?'Saving…':editId?'Update Venue':'Add Venue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEAT LAYOUT MODAL ── */}
      {modal==='seat' && activeVenue && (
        <div className="vp-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="vp-modal" style={{maxWidth:660}}>
            <div className="vp-modal-head">
              <div className="vp-modal-title">🪑 Seat Layout — {activeVenue.venueName}</div>
              <button className="vp-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="vp-modal-body">
              <div style={{fontSize:12.5,color:'var(--ink3)',marginBottom:16}}>📍 {activeVenue.address}</div>

              {seatMsg && (
                <div className={seatMsg.startsWith('✅')?'vp-seat-msg-ok':'vp-seat-msg-err'}>{seatMsg}</div>
              )}

              {loadingSeats ? (
                <div style={{textAlign:'center',padding:'20px 0',color:'var(--ink3)'}}>Loading seats…</div>
              ) : existingSeats.length>0 ? (
                <div className="vp-seat-exists">
                  <div style={{fontSize:13,fontWeight:700,color:'var(--green)',marginBottom:8}}>
                    ✅ {existingSeats.length} seats configured
                  </div>
                  <div className="vp-seat-cats">
                    {Object.entries(seatsByCategory).map(([cat,count])=>(
                      <span key={cat} className="vp-seat-cat-pill">{cat}: {count}</span>
                    ))}
                  </div>
                  <button className="vp-del-seats-btn" onClick={handleDeleteSeats} disabled={generating}>
                    🗑️ Delete All & Regenerate
                  </button>
                </div>
              ) : (
                <div className="vp-seat-warn">⚠️ No seats configured yet. Generate below.</div>
              )}

              {existingSeats.length===0 && (
                <>
                  <div style={{fontSize:14,fontWeight:700,color:'var(--ink)',marginBottom:12,display:'flex',alignItems:'center',gap:7}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:'var(--pink)',boxShadow:'0 0 0 3px rgba(236,72,153,0.15)'}}/>
                    Configure Seat Layout
                  </div>
                  <div className="vp-layout-header">
                    <span>Category</span><span>Rows (e.g. ABC)</span><span>Seats/Row</span><span>Price ₹</span><span/>
                  </div>
                  {seatLayout.map((sec,i)=>(
                    <div key={i} className="vp-layout-row">
                      <input className="vp-layout-input" value={sec.category} onChange={e=>updateLayout(i,'category',e.target.value)} placeholder="VIP"/>
                      <input className="vp-layout-input" value={sec.rows} onChange={e=>updateLayout(i,'rows',e.target.value.toUpperCase())} placeholder="AB" style={{letterSpacing:2}}/>
                      <input className="vp-layout-input" type="number" value={sec.seatsPerRow} onChange={e=>updateLayout(i,'seatsPerRow',e.target.value)} min={1} max={50}/>
                      <input className="vp-layout-input" type="number" value={sec.ticketPrice||''} onChange={e=>updateLayout(i,'ticketPrice',e.target.value)} placeholder="₹" min={0}/>
                      <button className="vp-remove-btn" onClick={()=>removeRow(i)}>×</button>
                    </div>
                  ))}
                  <button className="vp-add-section" onClick={addRow}>＋ Add Section</button>
                  <div className="vp-seat-count">
                    Total seats to generate: <strong>{totalSeats}</strong>
                  </div>
                </>
              )}
            </div>
            <div className="vp-modal-foot">
              <button className="vp-btn-cancel" onClick={()=>setModal(null)}>
                {existingSeats.length>0?'Close':'Cancel'}
              </button>
              {existingSeats.length===0 && (
                <button className="vp-generate-btn" onClick={handleGenerate} disabled={generating}>
                  {generating?'⏳ Generating…':'⚡ Generate Seats'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE VENUE MODAL ── */}
      {modal==='delete' && activeVenue && (
        <div className="vp-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="vp-modal" style={{maxWidth:400}}>
            <div className="vp-modal-head">
              <div className="vp-modal-title">🗑️ Delete Venue?</div>
              <button className="vp-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="vp-modal-body">
              <p style={{fontSize:14,color:'var(--ink2)',lineHeight:1.6}}>
                Delete <strong style={{color:'var(--ink)'}}>{activeVenue.venueName}</strong>?<br/>
                <span style={{color:'var(--red)',fontWeight:600}}>This cannot be undone.</span>
              </p>
            </div>
            <div className="vp-modal-foot">
              <button className="vp-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button className="vp-btn-delete" onClick={handleDelete}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}