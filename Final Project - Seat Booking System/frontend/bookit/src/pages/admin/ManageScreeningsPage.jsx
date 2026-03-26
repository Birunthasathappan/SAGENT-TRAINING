import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/common/AdminSidebar';
import { screeningsAPI, eventsAPI, venuesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EMPTY = { eventId:'', venueId:'', screenDate:'', startTime:'', endTime:'', remainingSeats:'', status:'ACTIVE' };

const CATEGORY_VENUE_MAP = {
  'Movie':    ['cinema','pvr','inox','screen','theatre','rohini','spi'],
  'Concert':  ['ymca','music','academy','stadium','ground','nehru','auditorium'],
  'Sports':   ['stadium','ground','sports','arena','chidambaram'],
  'Comedy':   ['folly','amethyst','arts','kala','studio','theatre'],
  'Theatre':  ['folly','amethyst','arts','kala','narada','bhavan'],
  'Dance':    ['narada','bhavan','vidya','kalakshetra','academy'],
  'Festival': ['ground','stadium','beach','park','maidan'],
  'Other':    [],
};

const getFilteredVenues = (venues, selectedEvent) => {
  if (!selectedEvent?.category) return venues;
  const kws = CATEGORY_VENUE_MAP[selectedEvent.category] || [];
  if (!kws.length) return venues;
  const f = venues.filter(v => kws.some(k => v.venueName?.toLowerCase().includes(k)));
  return f.length > 0 ? f : venues;
};

const STATUS_META = {
  ACTIVE:    { bg:'rgba(22,163,74,0.09)',   color:'#15803d', bd:'rgba(22,163,74,0.22)'   },
  CANCELLED: { bg:'rgba(220,38,38,0.09)',   color:'#dc2626', bd:'rgba(220,38,38,0.22)'   },
  COMPLETED: { bg:'rgba(100,116,139,0.09)', color:'#475569', bd:'rgba(100,116,139,0.22)' },
};

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .scrp {
    --pink:#ec4899; --pink2:#db2777; --pink4:#fdf2f8; --pink5:#fff0f9;
    --pink-border:rgba(236,72,153,0.22); --pink-glow:rgba(236,72,153,0.18);
    --mauve:#c084fc;
    --green:#16a34a; --red:#dc2626; --amber:#d97706;
    --bg:#fff5fb; --card:#ffffff; --card2:#faf7f4; --border:#fce7f3;
    --ink:#1e0a17; --ink2:#6b3a54; --ink3:#a87090; --ink4:#d4a8be;
    --sh:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07);
    --sh-up:0 12px 36px rgba(236,72,153,0.14),0 4px 12px rgba(30,10,23,0.06);
    font-family:'DM Sans',sans-serif; color:var(--ink);
  }
  .scrp * { box-sizing:border-box; margin:0; padding:0; }

  .scrp-main {
    flex:1; margin-left:var(--sidebar-width,240px);
    min-height:100vh; background:var(--bg);
    padding:38px 36px 64px; overflow-y:auto; position:relative;
  }
  .scrp-main::before {
    content:''; position:fixed; top:-100px; right:-80px;
    width:420px; height:420px; border-radius:50%;
    background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%);
    pointer-events:none; z-index:0;
  }
  .scrp-content { position:relative; z-index:1; }

  .scrp-header {
    display:flex; align-items:flex-start; justify-content:space-between;
    flex-wrap:wrap; gap:14px; margin-bottom:28px;
    animation:scUp 0.4s ease both;
  }
  .scrp-title {
    font-family:'Playfair Display',serif;
    font-size:28px; font-weight:800; color:var(--ink); letter-spacing:-0.02em;
    display:flex; align-items:center; gap:10px;
  }
  .scrp-title-bar {
    width:5px; height:28px; border-radius:3px;
    background:linear-gradient(180deg,var(--pink),var(--mauve));
    box-shadow:0 0 10px var(--pink-glow);
  }
  .scrp-sub { font-size:13.5px; color:var(--ink3); margin-top:6px; }

  .scrp-add-btn {
    display:flex; align-items:center; gap:7px;
    padding:11px 20px; border-radius:12px;
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    color:#fff; border:none; cursor:pointer;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 16px var(--pink-glow);
    transition:all 0.2s cubic-bezier(.34,1.56,.64,1);
  }
  .scrp-add-btn:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 24px rgba(236,72,153,0.30); }

  .scrp-filters {
    display:flex; gap:10px; flex-wrap:wrap; align-items:center;
    margin-bottom:22px; animation:scUp 0.45s 0.05s ease both;
  }
  .scrp-search {
    display:flex; align-items:center; gap:8px;
    background:var(--card); border:1.5px solid var(--border);
    border-radius:99px; padding:9px 16px;
    box-shadow:var(--sh); flex:1; max-width:320px;
    transition:border-color 0.2s;
  }
  .scrp-search:focus-within { border-color:var(--pink-border); }
  .scrp-search input {
    border:none; outline:none; background:transparent;
    font-size:13px; font-family:'DM Sans',sans-serif; color:var(--ink); width:100%;
  }
  .scrp-search input::placeholder { color:var(--ink3); }

  .scrp-filter-btn {
    padding:8px 16px; border-radius:99px;
    border:1.5px solid var(--border); background:var(--card);
    font-size:12.5px; font-weight:600; color:var(--ink2);
    cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s;
    display:flex; align-items:center; gap:6px;
  }
  .scrp-filter-btn:hover { border-color:var(--pink-border); color:var(--pink); }
  .scrp-filter-btn.active {
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    color:#fff; border-color:transparent;
    box-shadow:0 4px 14px var(--pink-glow);
  }
  .scrp-count-badge {
    background:rgba(255,255,255,0.25); color:#fff;
    border-radius:99px; padding:1px 7px;
    font-size:10px; font-weight:700;
  }
  .scrp-results {
    margin-left:auto; font-size:12.5px; color:var(--ink3);
    font-weight:500; font-family:'JetBrains Mono',monospace;
  }

  .scrp-table-card {
    background:var(--card); border:1.5px solid var(--border);
    border-radius:20px; box-shadow:var(--sh); overflow:hidden;
    animation:scUp 0.45s 0.09s ease both;
  }
  .scrp-table { width:100%; border-collapse:collapse; }
  .scrp-table thead tr { background:var(--pink4); border-bottom:2px solid var(--border); }
  .scrp-table th {
    text-align:left; padding:13px 16px;
    font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.13em; color:var(--ink3);
  }
  .scrp-table th:first-child { padding-left:22px; }
  .scrp-table tbody tr { border-bottom:1px solid var(--border); transition:background 0.13s; }
  .scrp-table tbody tr:last-child { border-bottom:none; }
  .scrp-table tbody tr:hover { background:var(--pink5); }
  .scrp-table td { padding:13px 16px; font-size:13px; color:var(--ink); vertical-align:middle; }
  .scrp-table td:first-child { padding-left:22px; }

  .scrp-id { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink4); }
  .scrp-event-name { font-weight:700; font-size:13.5px; color:var(--ink); }
  .scrp-event-cat {
    font-size:10px; font-weight:700; text-transform:uppercase;
    letter-spacing:0.07em; color:var(--ink3); margin-top:2px;
  }
  .scrp-venue { font-size:12.5px; color:var(--ink2); }
  .scrp-date { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink2); }
  .scrp-time { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; color:var(--pink2); }

  .scrp-occ-wrap { display:flex; flex-direction:column; gap:4px; min-width:100px; }
  .scrp-occ-top  { display:flex; justify-content:space-between; align-items:center; }
  .scrp-occ-seats { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; }
  .scrp-occ-pct  { font-size:10.5px; font-weight:700; }
  .scrp-occ-track {
    height:6px; background:rgba(168,112,144,0.12);
    border-radius:99px; overflow:hidden;
  }
  .scrp-occ-fill {
    height:100%; border-radius:99px;
    transition:width 0.8s cubic-bezier(.4,0,.2,1);
  }

  .scrp-status {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 11px; border-radius:99px;
    font-size:10.5px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.07em;
  }
  .scrp-status::before {
    content:''; width:5px; height:5px; border-radius:50%;
    animation:scBlink 2.5s ease-in-out infinite;
  }
  @keyframes scBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

  .scrp-act-row { display:flex; gap:6px; }
  .scrp-act-btn {
    width:32px; height:32px; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    font-size:14px; cursor:pointer; border:none;
    transition:all 0.18s cubic-bezier(.34,1.56,.64,1);
  }
  .scrp-act-btn:hover { transform:scale(1.1); }
  .scrp-btn-edit { background:rgba(139,92,246,0.09); color:#7c3aed; }
  .scrp-btn-del  { background:rgba(220,38,38,0.09); color:var(--red); }

  .scrp-empty { display:flex; flex-direction:column; align-items:center; padding:64px 0; gap:14px; }
  .scrp-empty-icon  { font-size:48px; opacity:0.25; }
  .scrp-empty-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--ink); }
  .scrp-empty-sub   { font-size:13.5px; color:var(--ink3); }

  .scrp-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .scrp-spinner {
    width:42px; height:42px; border:3px solid var(--pink4); border-top-color:var(--pink);
    border-radius:50%; animation:scSpin 0.75s linear infinite;
    box-shadow:0 0 18px var(--pink-glow);
  }

  .scrp-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(30,10,23,0.45); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    padding:20px; animation:scFadeIn 0.2s ease both;
  }
  @keyframes scFadeIn { from{opacity:0;} to{opacity:1;} }
  .scrp-modal {
    background:var(--card); border-radius:22px;
    border:1.5px solid var(--border);
    box-shadow:0 24px 80px rgba(236,72,153,0.18),0 8px 24px rgba(30,10,23,0.12);
    width:100%; animation:scSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both;
    overflow:hidden; max-height:90vh; display:flex; flex-direction:column;
  }
  @keyframes scSlideUp {
    from{opacity:0;transform:translateY(28px) scale(0.97);}
    to{opacity:1;transform:translateY(0) scale(1);}
  }
  .scrp-modal-head {
    padding:20px 24px 16px; border-bottom:1.5px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(135deg,var(--pink4),#fff); flex-shrink:0;
  }
  .scrp-modal-title {
    font-family:'Playfair Display',serif;
    font-size:20px; font-weight:800; color:var(--ink);
  }
  .scrp-modal-close {
    width:34px; height:34px; border-radius:50%;
    background:var(--pink5); border:1.5px solid var(--pink-border);
    color:var(--pink2); font-size:16px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.18s;
  }
  .scrp-modal-close:hover { background:var(--pink3); transform:scale(1.08); }
  .scrp-modal-body { padding:22px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:14px; }
  .scrp-modal-foot {
    padding:16px 24px; border-top:1.5px solid var(--border);
    display:flex; gap:10px; justify-content:flex-end;
    background:var(--pink4); flex-shrink:0;
  }

  .scrp-form-group { display:flex; flex-direction:column; gap:5px; }
  .scrp-form-label { font-size:12px; font-weight:700; color:var(--ink2); text-transform:uppercase; letter-spacing:0.07em; }
  .scrp-form-input {
    padding:10px 14px; border-radius:11px; border:1.5px solid var(--border);
    background:var(--card2); font-size:13.5px;
    font-family:'DM Sans',sans-serif; color:var(--ink);
    outline:none; transition:border-color 0.2s;
  }
  .scrp-form-input:focus { border-color:var(--pink-border); box-shadow:0 0 0 3px rgba(236,72,153,0.08); }
  .scrp-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .scrp-venue-hint { font-size:11px; color:var(--pink2); font-weight:600; margin-top:3px; }
  .scrp-error {
    background:rgba(220,38,38,0.09); border:1px solid rgba(220,38,38,0.22);
    border-radius:10px; padding:10px 14px;
    color:var(--red); font-size:13.5px; font-weight:600;
  }

  .scrp-btn-cancel {
    padding:10px 22px; border-radius:11px;
    background:var(--card2); color:var(--ink2);
    border:1.5px solid var(--border); cursor:pointer;
    font-size:13.5px; font-weight:600; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .scrp-btn-cancel:hover { border-color:var(--pink-border); color:var(--pink2); }
  .scrp-btn-save {
    padding:10px 24px; border-radius:11px;
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    color:#fff; border:none; cursor:pointer;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 14px var(--pink-glow); transition:all 0.18s;
  }
  .scrp-btn-save:hover:not(:disabled) { transform:translateY(-1px); }
  .scrp-btn-save:disabled { opacity:0.6; cursor:not-allowed; }
  .scrp-btn-delete {
    padding:10px 22px; border-radius:11px;
    background:rgba(220,38,38,0.09); color:var(--red);
    border:1.5px solid rgba(220,38,38,0.22); cursor:pointer;
    font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif; transition:all 0.15s;
  }
  .scrp-btn-delete:hover { background:rgba(220,38,38,0.16); }

  @keyframes scSpin { to{transform:rotate(360deg);} }
  @keyframes scUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

  @media(max-width:768px) {
    .scrp-main { padding:22px 14px 48px; }
    .scrp-form-grid { grid-template-columns:1fr; }
  }
`;

export default function ManageScreeningsPage() {
  const { user } = useAuth();
  const [screenings, setScreenings]     = useState([]);
  const [events, setEvents]             = useState([]);
  const [venues, setVenues]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modal, setModal]               = useState(null);
  const [form, setForm]                 = useState(EMPTY);
  const [editId, setEditId]             = useState(null);
  const [saving, setSaving]             = useState(false);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError]               = useState('');

  const fetchAll = () => {
    Promise.all([
      screeningsAPI.getAll(),
      eventsAPI.getAll(),   // ✅ FIXED: Always fetch ALL events so names show correctly
      venuesAPI.getAll(),
    ]).then(([scrs, evs, vens]) => {
      setScreenings(scrs); setEvents(evs); setVenues(vens);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal('form'); };
  const openEdit   = s => {
    setForm({ eventId:s.event?.eventId||'', venueId:s.venue?.venueId||'',
      screenDate:s.screenDate||'', startTime:s.startTime||'',
      endTime:s.endTime||'', remainingSeats:s.remainingSeats||'', status:s.status||'ACTIVE' });
    setEditId(s.screeningId); setError(''); setModal('form');
  };
  const openDelete = s => { setDeleteTarget(s); setModal('delete'); };
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleEventChange = id => setForm(f=>({...f,eventId:id,venueId:''}));

  const handleSave = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = {
        event:{eventId:parseInt(form.eventId)}, venue:{venueId:parseInt(form.venueId)},
        screenDate:form.screenDate, startTime:form.startTime, endTime:form.endTime,
        remainingSeats:parseInt(form.remainingSeats), status:form.status,
      };
      if (editId) await screeningsAPI.update(editId, payload);
      else        await screeningsAPI.create(payload);
      setModal(null); fetchAll();
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await screeningsAPI.delete(deleteTarget.screeningId); fetchAll(); setModal(null); }
    catch(err) { alert(err.message); }
  };

  const getEvent = id => events.find(e=>e.eventId===id);
  const getVenue = id => venues.find(v=>v.venueId===id);
  const selectedEvent  = events.find(e=>e.eventId===parseInt(form.eventId));
  const filteredVenues = getFilteredVenues(venues, selectedEvent);

  const getOccupancy = s => {
    const ev  = getEvent(s.event?.eventId);
    const ven = getVenue(s.venue?.venueId);
    const cap = ven?.capacity || 0;
    const rem = s.remainingSeats ?? cap;
    if (!cap) return null;
    const sold = cap - rem;
    const pct  = Math.round((sold / cap) * 100);
    return { sold, cap, rem, pct };
  };

  const filtered = screenings.filter(s => {
    const ev = getEvent(s.event?.eventId);
    const matchSearch = ev?.title?.toLowerCase().includes(search.toLowerCase()) || s.screenDate?.includes(search);
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = screenings.reduce((a,s)=>{a[s.status]=(a[s.status]||0)+1;return a;},{});
  const occColor = pct => pct >= 90 ? '#dc2626' : pct >= 60 ? '#d97706' : '#16a34a';

  return (
    <div className="scrp" style={{display:'flex',minHeight:'100vh',background:'#fff5fb'}}>
      <style>{S}</style>
      <AdminSidebar/>

      <main className="scrp-main">
        <div className="scrp-content">

          <div className="scrp-header">
            <div>
              <div className="scrp-title"><div className="scrp-title-bar"/>Manage Screenings</div>
              <div className="scrp-sub">{screenings.length} screening{screenings.length!==1?'s':''} scheduled</div>
            </div>
            <button className="scrp-add-btn" onClick={openCreate}>＋ Add Screening</button>
          </div>

          <div className="scrp-filters">
            <div className="scrp-search">
              <span style={{fontSize:15,color:'var(--ink3)'}}>🔍</span>
              <input placeholder="Search by event or date..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {['All','ACTIVE','COMPLETED','CANCELLED'].map(s=>(
              <button key={s}
                className={`scrp-filter-btn${statusFilter===s?' active':''}`}
                onClick={()=>setStatusFilter(s)}>
                {s}
                {s!=='All' && counts[s]>0 && (
                  <span className={statusFilter===s?'scrp-count-badge':''}
                    style={statusFilter!==s?{fontSize:10,fontWeight:700,color:'var(--ink3)'}:{}}>
                    {counts[s]}
                  </span>
                )}
              </button>
            ))}
            <span className="scrp-results">{filtered.length} results</span>
          </div>

          {loading ? (
            <div className="scrp-spin-wrap"><div className="scrp-spinner"/></div>
          ) : filtered.length===0 ? (
            <div className="scrp-empty">
              <div className="scrp-empty-icon">🎬</div>
              <div className="scrp-empty-title">No screenings found</div>
              <div className="scrp-empty-sub">Schedule your first screening!</div>
              <button className="scrp-add-btn" onClick={openCreate}>＋ Add Screening</button>
            </div>
          ) : (
            <div className="scrp-table-card">
              <div style={{overflowX:'auto'}}>
                <table className="scrp-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Event</th><th>Venue</th>
                      <th>Date</th><th>Time</th>
                      <th>Occupancy</th>
                      <th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s=>{
                      const ev  = getEvent(s.event?.eventId);
                      const ven = getVenue(s.venue?.venueId);
                      const occ = getOccupancy(s);
                      const sm  = STATUS_META[s.status] || STATUS_META.COMPLETED;
                      return (
                        <tr key={s.screeningId}>
                          <td><span className="scrp-id">#{s.screeningId}</span></td>
                          <td>
                            <div className="scrp-event-name">{ev?.title || '—'}</div>
                            {ev?.category && <div className="scrp-event-cat">{ev.category}</div>}
                          </td>
                          <td><span className="scrp-venue">{ven?.venueName||s.venue?.venueName||'—'}</span></td>
                          <td><span className="scrp-date">{s.screenDate}</span></td>
                          <td><span className="scrp-time">{s.startTime}</span></td>
                          <td>
                            {occ ? (
                              <div className="scrp-occ-wrap">
                                <div className="scrp-occ-top">
                                  <span className="scrp-occ-seats" style={{color:occColor(occ.pct)}}>
                                    {occ.rem} left
                                  </span>
                                  <span className="scrp-occ-pct" style={{color:occColor(occ.pct)}}>
                                    {occ.pct}%
                                  </span>
                                </div>
                                <div className="scrp-occ-track">
                                  <div className="scrp-occ-fill"
                                    style={{width:`${occ.pct}%`, background:occColor(occ.pct)}}/>
                                </div>
                              </div>
                            ) : (
                              <span style={{color:'var(--ink3)',fontSize:12}}>
                                {s.remainingSeats??'—'}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="scrp-status"
                              style={{background:sm.bg,color:sm.color,border:`1px solid ${sm.bd}`}}>
                              {s.status}
                            </span>
                          </td>
                          <td>
                            <div className="scrp-act-row">
                              <button className="scrp-act-btn scrp-btn-edit" onClick={()=>openEdit(s)} title="Edit">✏️</button>
                              <button className="scrp-act-btn scrp-btn-del"  onClick={()=>openDelete(s)} title="Delete">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {modal==='form' && (
        <div className="scrp-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="scrp-modal" style={{maxWidth:560}}>
            <div className="scrp-modal-head">
              <div className="scrp-modal-title">{editId?'✏️ Edit Screening':'🎬 Add Screening'}</div>
              <button className="scrp-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="scrp-modal-body">
              {error && <div className="scrp-error">{error}</div>}
              <form id="scrp-form" onSubmit={handleSave}>
                <div className="scrp-form-group" style={{marginBottom:14}}>
                  <label className="scrp-form-label">Event *</label>
                  <select className="scrp-form-input" value={form.eventId} onChange={e=>handleEventChange(e.target.value)} required>
                    <option value="">Select event</option>
                    {events.map(ev=>(
                      <option key={ev.eventId} value={ev.eventId}>
                        {ev.title}{ev.category?` (${ev.category})`:''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="scrp-form-group" style={{marginBottom:14}}>
                  <label className="scrp-form-label">
                    Venue *
                    {selectedEvent?.category && (
                      <span className="scrp-venue-hint"> — Showing venues for: {selectedEvent.category}</span>
                    )}
                  </label>
                  <select className="scrp-form-input" value={form.venueId} onChange={e=>set('venueId',e.target.value)} required>
                    <option value="">Select venue</option>
                    {filteredVenues.map(v=>(
                      <option key={v.venueId} value={v.venueId}>
                        {v.venueName} — {v.district} (Cap: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="scrp-form-grid">
                  <div className="scrp-form-group">
                    <label className="scrp-form-label">Date *</label>
                    <input className="scrp-form-input" type="date" value={form.screenDate} onChange={e=>set('screenDate',e.target.value)} required/>
                  </div>
                  <div className="scrp-form-group">
                    <label className="scrp-form-label">Remaining Seats *</label>
                    <input className="scrp-form-input" type="number" value={form.remainingSeats} onChange={e=>set('remainingSeats',e.target.value)} required min={0} placeholder="100"/>
                  </div>
                  <div className="scrp-form-group">
                    <label className="scrp-form-label">Start Time *</label>
                    <input className="scrp-form-input" type="time" value={form.startTime} onChange={e=>set('startTime',e.target.value)} required/>
                  </div>
                  <div className="scrp-form-group">
                    <label className="scrp-form-label">End Time *</label>
                    <input className="scrp-form-input" type="time" value={form.endTime} onChange={e=>set('endTime',e.target.value)} required/>
                  </div>
                  <div className="scrp-form-group" style={{gridColumn:'1/-1'}}>
                    <label className="scrp-form-label">Status</label>
                    <select className="scrp-form-input" value={form.status} onChange={e=>set('status',e.target.value)}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="scrp-modal-foot">
              <button className="scrp-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button className="scrp-btn-save" form="scrp-form" type="submit" disabled={saving}>
                {saving?'Saving…':editId?'Update Screening':'Add Screening'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal==='delete' && deleteTarget && (
        <div className="scrp-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="scrp-modal" style={{maxWidth:400}}>
            <div className="scrp-modal-head">
              <div className="scrp-modal-title">🗑️ Delete Screening?</div>
              <button className="scrp-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="scrp-modal-body">
              <p style={{fontSize:14,color:'var(--ink2)',lineHeight:1.6}}>
                Delete screening on <strong style={{color:'var(--ink)'}}>{deleteTarget.screenDate}</strong>?<br/>
                <span style={{color:'var(--red)',fontWeight:600}}>This cannot be undone.</span>
              </p>
            </div>
            <div className="scrp-modal-foot">
              <button className="scrp-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button className="scrp-btn-delete" onClick={handleDelete}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}