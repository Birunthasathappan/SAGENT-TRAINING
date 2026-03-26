import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/common/AdminSidebar';
import { eventsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EMPTY = { organizerId:'', title:'', category:'', genre:'', description:'', duration:'', language:'', tag:'', showStatus:'UPCOMING' };

const CATEGORIES = ['Movie', 'Concert', 'Events'];
const STATUSES   = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

// ✅ Genre options per category
const GENRES = {
  Movie:   ['Action', 'Drama', 'Comedy', 'Romance', 'Thriller', 'Horror', 'Sci-Fi', 'Adventure', 'Animation'],
  Concert: ['Classical', 'Pop', 'Rock', 'Jazz', 'Folk', 'EDM', 'Hip-Hop', 'Devotional'],
  Events:  ['Cultural', 'Dance', 'Theatre', 'Festival', 'Stand-up', 'Art', 'Food', 'Sports'],
};

// ✅ Language options
const LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

// ✅ Tag options
const DURATIONS = [
  { label:"1 hr",   value:60  },
  { label:"1.5 hrs", value:90  },
  { label:"2 hrs",  value:120 },
  { label:"2.5 hrs", value:150 },
  { label:"3 hrs",  value:180 },
  { label:"3.5 hrs", value:210 },
  { label:"4 hrs",  value:240 },
];

const TAGS = ['New Release', 'Hot', 'Trending', 'Blockbuster', 'Live', 'Featured', 'Exclusive', 'Limited'];

const STATUS_META = {
  UPCOMING:  { bg:'rgba(14,165,233,0.09)',  color:'#0284c7', bd:'rgba(14,165,233,0.22)'  },
  ONGOING:   { bg:'rgba(22,163,74,0.09)',   color:'#15803d', bd:'rgba(22,163,74,0.22)'   },
  COMPLETED: { bg:'rgba(100,116,139,0.09)', color:'#475569', bd:'rgba(100,116,139,0.22)' },
  CANCELLED: { bg:'rgba(220,38,38,0.09)',   color:'#dc2626', bd:'rgba(220,38,38,0.22)'   },
};

const TAG_COLORS = ['#ec4899','#8b5cf6','#0ea5e9','#f59e0b','#10b981','#f43f5e'];
const tagColor = (tag) => TAG_COLORS[Math.abs([...(tag||'')].reduce((a,c)=>a+c.charCodeAt(0),0)) % TAG_COLORS.length];
const CATEGORY_EMOJI = { Movie:'🎬', Concert:'🎵', Events:'🎭', default:'🎟️' };

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  .ep {
    --pink:#ec4899; --pink2:#db2777; --pink3:#f9a8d4; --pink4:#fdf2f8; --pink5:#fff0f9;
    --pink-border:rgba(236,72,153,0.22); --pink-glow:rgba(236,72,153,0.18);
    --mauve:#c084fc; --red:#dc2626; --red-bg:rgba(220,38,38,0.09); --red-bd:rgba(220,38,38,0.22);
    --teal:#0d9488; --bg:#fff5fb; --card:#ffffff; --card2:#faf7f4; --border:#fce7f3;
    --ink:#1e0a17; --ink2:#6b3a54; --ink3:#a87090; --ink4:#d4a8be;
    --sh:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07);
    --sh-up:0 12px 36px rgba(236,72,153,0.14),0 4px 12px rgba(30,10,23,0.06);
    font-family:'DM Sans',sans-serif; color:var(--ink);
  }
  .ep * { box-sizing:border-box; margin:0; padding:0; }
  .ep-main { flex:1; margin-left:var(--sidebar-width,240px); min-height:100vh; background:var(--bg); padding:38px 36px 64px; overflow-y:auto; position:relative; }
  .ep-main::before { content:''; position:fixed; top:-100px; right:-80px; width:420px; height:420px; border-radius:50%; background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%); pointer-events:none; z-index:0; }
  .ep-content { position:relative; z-index:1; }
  .ep-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:14px; margin-bottom:28px; animation:epUp 0.4s ease both; }
  .ep-title { font-family:'Playfair Display',serif; font-size:28px; font-weight:800; color:var(--ink); letter-spacing:-0.02em; display:flex; align-items:center; gap:10px; }
  .ep-title-bar { width:5px; height:28px; border-radius:3px; background:linear-gradient(180deg,var(--pink),var(--mauve)); box-shadow:0 0 10px var(--pink-glow); }
  .ep-sub { font-size:13.5px; color:var(--ink3); margin-top:6px; }
  .ep-header-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .ep-view-toggle { display:flex; background:var(--card); border:1.5px solid var(--border); border-radius:11px; overflow:hidden; box-shadow:var(--sh); }
  .ep-vt-btn { padding:9px 16px; border:none; background:transparent; cursor:pointer; font-size:16px; transition:background 0.15s; font-family:'DM Sans',sans-serif; }
  .ep-vt-btn.active { background:linear-gradient(135deg,var(--pink),var(--mauve)); color:#fff; }
  .ep-vt-btn:not(.active):hover { background:var(--pink5); }
  .ep-create-btn { display:flex; align-items:center; gap:7px; padding:11px 20px; border-radius:12px; background:linear-gradient(135deg,var(--pink),var(--mauve)); color:#fff; border:none; cursor:pointer; font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif; box-shadow:0 4px 16px var(--pink-glow); transition:all 0.2s cubic-bezier(.34,1.56,.64,1); }
  .ep-create-btn:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 24px rgba(236,72,153,0.30); }
  .ep-search { display:flex; align-items:center; gap:8px; background:var(--card); border:1.5px solid var(--border); border-radius:99px; padding:9px 16px; box-shadow:var(--sh); max-width:360px; margin-bottom:22px; transition:border-color 0.2s; animation:epUp 0.45s 0.06s ease both; }
  .ep-search:focus-within { border-color:var(--pink-border); }
  .ep-search input { border:none; outline:none; background:transparent; font-size:13px; font-family:'DM Sans',sans-serif; color:var(--ink); width:100%; }
  .ep-search input::placeholder { color:var(--ink3); }
  .ep-table-card { background:var(--card); border:1.5px solid var(--border); border-radius:20px; box-shadow:var(--sh); overflow:hidden; animation:epUp 0.45s 0.09s ease both; }
  .ep-table { width:100%; border-collapse:collapse; }
  .ep-table thead tr { background:var(--pink4); border-bottom:2px solid var(--border); }
  .ep-table th { text-align:left; padding:13px 16px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.13em; color:var(--ink3); }
  .ep-table th:first-child { padding-left:22px; }
  .ep-table tbody tr { border-bottom:1px solid var(--border); transition:background 0.13s; }
  .ep-table tbody tr:last-child { border-bottom:none; }
  .ep-table tbody tr:hover { background:var(--pink5); }
  .ep-table td { padding:13px 16px; font-size:13px; color:var(--ink); vertical-align:middle; }
  .ep-table td:first-child { padding-left:22px; }
  .ep-id { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink4); }
  .ep-event-title { font-weight:700; font-size:14px; }
  .ep-event-tag { font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:99px; display:inline-block; margin-top:3px; }
  .ep-cat-tag { display:inline-block; padding:3px 11px; border-radius:99px; font-size:11.5px; font-weight:700; background:var(--pink4); color:var(--ink2); border:1px solid var(--border); }
  .ep-status-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 11px; border-radius:99px; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; }
  .ep-status-pill::before { content:''; width:5px; height:5px; border-radius:50%; animation:epBlink 2.5s ease-in-out infinite; }
  @keyframes epBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
  .ep-action-row { display:flex; gap:6px; }
  .ep-act-btn { display:flex; align-items:center; gap:5px; padding:6px 12px; border-radius:9px; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; border:none; cursor:pointer; transition:all 0.18s cubic-bezier(.34,1.56,.64,1); }
  .ep-act-btn:hover { transform:translateY(-1px) scale(1.05); }
  .ep-btn-view { background:var(--pink5); color:var(--pink2); border:1.5px solid var(--pink-border)!important; }
  .ep-btn-view:hover { background:#fce7f3; box-shadow:0 4px 12px var(--pink-glow); }
  .ep-btn-edit { background:rgba(139,92,246,0.09); color:#7c3aed; border:1.5px solid rgba(139,92,246,0.22)!important; }
  .ep-btn-edit:hover { background:rgba(139,92,246,0.16); }
  .ep-btn-del { background:var(--red-bg); color:var(--red); border:1.5px solid var(--red-bd)!important; }
  .ep-btn-del:hover { background:rgba(220,38,38,0.16); }
  .ep-card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px; animation:epUp 0.45s 0.09s ease both; }
  .ep-event-card { background:var(--card); border:1.5px solid var(--border); border-radius:20px; padding:22px 20px 18px; box-shadow:var(--sh); position:relative; overflow:hidden; transition:transform 0.22s cubic-bezier(.34,1.56,.64,1),box-shadow 0.2s,border-color 0.2s; }
  .ep-event-card:hover { transform:translateY(-5px); box-shadow:var(--sh-up); border-color:var(--pink-border); }
  .ep-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
  .ep-card-emoji { width:52px; height:52px; border-radius:14px; background:var(--pink4); border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:26px; }
  .ep-card-id { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--ink4); }
  .ep-card-title { font-weight:800; font-size:16px; color:var(--ink); margin-bottom:4px; line-height:1.2; }
  .ep-card-meta { display:flex; flex-wrap:wrap; gap:6px; margin:10px 0 14px; }
  .ep-card-chip { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:99px; font-size:11px; font-weight:600; background:var(--pink4); color:var(--ink2); border:1px solid var(--border); }
  .ep-card-actions { display:flex; gap:7px; margin-top:14px; padding-top:14px; border-top:1px solid var(--border); }
  .ep-card-actions .ep-act-btn { flex:1; justify-content:center; }
  .ep-empty { display:flex; flex-direction:column; align-items:center; padding:64px 0; gap:14px; }
  .ep-empty-icon { font-size:48px; opacity:0.25; }
  .ep-empty-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--ink); }
  .ep-empty-sub { font-size:13.5px; color:var(--ink3); }
  .ep-overlay { position:fixed; inset:0; z-index:1000; background:rgba(30,10,23,0.45); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; animation:epFadeIn 0.2s ease both; }
  @keyframes epFadeIn { from{opacity:0;} to{opacity:1;} }
  .ep-modal { background:var(--card); border-radius:22px; border:1.5px solid var(--border); box-shadow:0 24px 80px rgba(236,72,153,0.18),0 8px 24px rgba(30,10,23,0.12); width:100%; animation:epSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both; overflow:hidden; max-height:90vh; display:flex; flex-direction:column; }
  @keyframes epSlideUp { from{opacity:0;transform:translateY(28px) scale(0.97);} to{opacity:1;transform:translateY(0) scale(1);} }
  .ep-modal-head { padding:20px 24px 16px; border-bottom:1.5px solid var(--border); display:flex; align-items:center; justify-content:space-between; background:linear-gradient(135deg,var(--pink4),#fff); flex-shrink:0; }
  .ep-modal-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; color:var(--ink); display:flex; align-items:center; gap:8px; }
  .ep-modal-close { width:34px; height:34px; border-radius:50%; background:var(--pink5); border:1.5px solid var(--pink-border); color:var(--pink2); font-size:16px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.18s; }
  .ep-modal-close:hover { background:var(--pink3); transform:scale(1.08); }
  .ep-modal-body { padding:22px 24px; overflow-y:auto; display:flex; flex-direction:column; gap:14px; }
  .ep-modal-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .ep-mf { background:var(--pink4); border:1px solid var(--border); border-radius:12px; padding:12px 14px; }
  .ep-mf-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink3); margin-bottom:5px; }
  .ep-mf-val { font-size:14px; font-weight:600; color:var(--ink); }
  .ep-desc-box { background:var(--pink4); border:1px solid var(--border); border-radius:12px; padding:14px 16px; }
  .ep-desc-box p { font-size:13.5px; color:var(--ink2); line-height:1.6; margin-top:6px; }
  .ep-modal-foot { padding:16px 24px; border-top:1.5px solid var(--border); display:flex; justify-content:flex-end; gap:10px; background:var(--pink4); flex-shrink:0; }
  .ep-form-modal { max-width:580px; }
  .ep-form-group { display:flex; flex-direction:column; gap:5px; }
  .ep-form-label { font-size:12px; font-weight:700; color:var(--ink2); text-transform:uppercase; letter-spacing:0.07em; }
  .ep-form-input { padding:10px 14px; border-radius:11px; border:1.5px solid var(--border); background:var(--card2); font-size:13.5px; font-family:'DM Sans',sans-serif; color:var(--ink); outline:none; transition:border-color 0.2s; }
  .ep-form-input:focus { border-color:var(--pink-border); box-shadow:0 0 0 3px rgba(236,72,153,0.08); }
  .ep-form-input:disabled { opacity:0.5; cursor:not-allowed; }
  .ep-form-input::placeholder { color:var(--ink4); }
  .ep-error { background:var(--red-bg); border:1px solid var(--red-bd); border-radius:10px; padding:10px 14px; color:var(--red); font-size:13.5px; font-weight:600; }
  .ep-btn-cancel { padding:10px 22px; border-radius:11px; background:var(--card2); color:var(--ink2); border:1.5px solid var(--border); cursor:pointer; font-size:13.5px; font-weight:600; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .ep-btn-cancel:hover { border-color:var(--pink-border); color:var(--pink2); }
  .ep-btn-save { padding:10px 24px; border-radius:11px; background:linear-gradient(135deg,var(--pink),var(--mauve)); color:#fff; border:none; cursor:pointer; font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif; box-shadow:0 4px 14px var(--pink-glow); transition:all 0.18s; }
  .ep-btn-save:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 22px var(--pink-glow); }
  .ep-btn-save:disabled { opacity:0.6; cursor:not-allowed; }
  .ep-btn-delete { padding:10px 22px; border-radius:11px; background:var(--red-bg); color:var(--red); border:1.5px solid var(--red-bd); cursor:pointer; font-size:13.5px; font-weight:700; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .ep-btn-delete:hover { background:rgba(220,38,38,0.16); }
  .ep-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .ep-spinner { width:42px; height:42px; border:3px solid var(--pink4); border-top-color:var(--pink); border-radius:50%; animation:epSpin 0.75s linear infinite; box-shadow:0 0 18px var(--pink-glow); }
  @keyframes epSpin { to{transform:rotate(360deg);} }
  @keyframes epUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @media (max-width:768px) {
    .ep-main { padding:22px 14px 48px; }
    .ep-modal-row { grid-template-columns:1fr; }
    .ep-card-grid { grid-template-columns:1fr; }
  }
`;

export default function ManageEventsPage() {
  const { user } = useAuth();
  const [events, setEvents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modal, setModal]               = useState(null);
  const [form, setForm]                 = useState(EMPTY);
  const [editId, setEditId]             = useState(null);
  const [saving, setSaving]             = useState(false);
  const [search, setSearch]             = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget]     = useState(null);
  const [error, setError]               = useState('');
  const [viewMode, setViewMode]         = useState('table');

  const fetchEvents = () => {
    eventsAPI.getAll().then(setEvents).finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => { setForm({...EMPTY, organizerId: user.userId}); setEditId(null); setError(''); setModal('form'); };
  const openEdit = (ev) => {
    setForm({
      organizerId: ev.organizer?.userId || user.userId,
      title: ev.title || '', category: ev.category || '',
      genre: ev.genre || '', description: ev.description || '',
      duration: ev.duration || '', language: ev.language || '',
      tag: ev.tag || '', showStatus: ev.showStatus || 'UPCOMING',
    });
    setEditId(ev.eventId); setError(''); setModal('form');
  };
  const openView   = (ev) => { setViewTarget(ev); setModal('view'); };
  const openDelete = (ev) => { setDeleteTarget(ev); setModal('delete'); };

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleCategoryChange = (val) => {
    setForm(f => ({...f, category: val, genre: ''}));
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = {...form, organizerId: parseInt(form.organizerId), duration: parseInt(form.duration)};
      if (editId) await eventsAPI.update(editId, payload);
      else        await eventsAPI.create(payload);
      setModal(null); fetchEvents();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await eventsAPI.delete(deleteTarget.eventId); fetchEvents(); setModal(null); setDeleteTarget(null); }
    catch (err) { alert(err.message); }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const StatusPill = ({ status }) => {
    const m = STATUS_META[status] || STATUS_META.UPCOMING;
    return (
      <span className="ep-status-pill" style={{ background: m.bg, color: m.color, border: `1px solid ${m.bd}` }}>
        {status}
      </span>
    );
  };

  const genreOptions = GENRES[form.category] || [];

  return (
    <div className="ep" style={{ display:'flex', minHeight:'100vh', background:'#fff5fb' }}>
      <style>{S}</style>
      <AdminSidebar />

      <main className="ep-main">
        <div className="ep-content">

          <div className="ep-header">
            <div>
              <div className="ep-title"><div className="ep-title-bar"/>Manage Events</div>
              <div className="ep-sub">{events.length} event{events.length !== 1 ? 's' : ''} total</div>
            </div>
            <div className="ep-header-right">
              <div className="ep-view-toggle">
                <button className={`ep-vt-btn${viewMode==='table'?' active':''}`} onClick={()=>setViewMode('table')} title="Table View">☰</button>
                <button className={`ep-vt-btn${viewMode==='card'?' active':''}`}  onClick={()=>setViewMode('card')}  title="Card View">⊞</button>
              </div>
              <button className="ep-create-btn" onClick={openCreate}>＋ Create Event</button>
            </div>
          </div>

          <div className="ep-search">
            <span style={{fontSize:15, color:'var(--ink3)'}}>🔍</span>
            <input placeholder="Search events..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>

          {loading ? (
            <div className="ep-spin-wrap"><div className="ep-spinner"/></div>
          ) : filtered.length === 0 ? (
            <div className="ep-empty">
              <div className="ep-empty-icon">🎭</div>
              <div className="ep-empty-title">No events found</div>
              <div className="ep-empty-sub">Create your first event!</div>
              <button className="ep-create-btn" style={{marginTop:8}} onClick={openCreate}>＋ Create Event</button>
            </div>
          ) : viewMode === 'table' ? (
            <div className="ep-table-card">
              <div style={{overflowX:'auto'}}>
                <table className="ep-table">
                  <thead>
                    <tr><th>#</th><th>Title</th><th>Category</th><th>Genre</th><th>Language</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(ev => (
                      <tr key={ev.eventId}>
                        <td><span className="ep-id">#{ev.eventId}</span></td>
                        <td>
                          <div className="ep-event-title">{ev.title}</div>
                          {ev.tag && <span className="ep-event-tag" style={{background:`${tagColor(ev.tag)}15`,color:tagColor(ev.tag)}}>{ev.tag}</span>}
                        </td>
                        <td><span className="ep-cat-tag">{ev.category}</span></td>
                        <td style={{color:'var(--ink3)',fontSize:13}}>{ev.genre}</td>
                        <td style={{color:'var(--ink3)',fontSize:13}}>{ev.language}</td>
                        <td style={{color:'var(--ink3)',fontSize:13,fontFamily:'JetBrains Mono,monospace'}}>{ev.duration ? (ev.duration/60 % 1 === 0 ? ev.duration/60+'hr' : ev.duration/60+'hrs') : '—'}</td>
                        <td><StatusPill status={ev.showStatus}/></td>
                        <td>
                          <div className="ep-action-row">
                            <button className="ep-act-btn ep-btn-view" onClick={()=>openView(ev)}>👁️</button>
                            <button className="ep-act-btn ep-btn-edit" onClick={()=>openEdit(ev)}>✏️ Edit</button>
                            <button className="ep-act-btn ep-btn-del"  onClick={()=>openDelete(ev)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="ep-card-grid">
              {filtered.map(ev => (
                <div key={ev.eventId} className="ep-event-card">
                  <div className="ep-card-top">
                    <div className="ep-card-emoji">{CATEGORY_EMOJI[ev.category] || CATEGORY_EMOJI.default}</div>
                    <span className="ep-card-id">#{ev.eventId}</span>
                  </div>
                  <div className="ep-card-title">{ev.title}</div>
                  {ev.tag && <span className="ep-event-tag" style={{background:`${tagColor(ev.tag)}15`,color:tagColor(ev.tag),marginTop:4,display:'inline-block'}}>{ev.tag}</span>}
                  <div className="ep-card-meta">
                    <span className="ep-card-chip">🎭 {ev.category}</span>
                    <span className="ep-card-chip">🌐 {ev.language}</span>
                    <span className="ep-card-chip">⏱ {ev.duration ? (ev.duration/60 % 1 === 0 ? ev.duration/60+'hr' : ev.duration/60+'hrs') : '—'}</span>
                    {ev.genre && <span className="ep-card-chip">🎨 {ev.genre}</span>}
                  </div>
                  <StatusPill status={ev.showStatus}/>
                  <div className="ep-card-actions">
                    <button className="ep-act-btn ep-btn-view" onClick={()=>openView(ev)}>👁️ View</button>
                    <button className="ep-act-btn ep-btn-edit" onClick={()=>openEdit(ev)}>✏️ Edit</button>
                    <button className="ep-act-btn ep-btn-del"  onClick={()=>openDelete(ev)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* VIEW MODAL */}
      {modal==='view' && viewTarget && (
        <div className="ep-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="ep-modal" style={{maxWidth:520}}>
            <div className="ep-modal-head">
              <div className="ep-modal-title">{CATEGORY_EMOJI[viewTarget.category]||'🎟️'} Event Details <StatusPill status={viewTarget.showStatus}/></div>
              <button className="ep-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="ep-modal-body">
              <div className="ep-modal-row">
                <div className="ep-mf" style={{gridColumn:'1/-1'}}>
                  <div className="ep-mf-lbl">🎬 Event Title</div>
                  <div className="ep-mf-val" style={{fontSize:18,fontFamily:'Playfair Display,serif'}}>{viewTarget.title}</div>
                  {viewTarget.tag && <span className="ep-event-tag" style={{background:`${tagColor(viewTarget.tag)}15`,color:tagColor(viewTarget.tag),marginTop:6,display:'inline-block'}}>{viewTarget.tag}</span>}
                </div>
              </div>
              <div className="ep-modal-row">
                <div className="ep-mf"><div className="ep-mf-lbl">🎭 Category</div><div className="ep-mf-val">{viewTarget.category}</div></div>
                <div className="ep-mf"><div className="ep-mf-lbl">🎨 Genre</div><div className="ep-mf-val">{viewTarget.genre||'—'}</div></div>
              </div>
              <div className="ep-modal-row">
                <div className="ep-mf"><div className="ep-mf-lbl">🌐 Language</div><div className="ep-mf-val">{viewTarget.language||'—'}</div></div>
                <div className="ep-mf"><div className="ep-mf-lbl">⏱ Duration</div><div className="ep-mf-val" style={{fontFamily:'JetBrains Mono,monospace'}}>{viewTarget.duration ? (viewTarget.duration/60 % 1 === 0 ? viewTarget.duration/60+' hr' : viewTarget.duration/60+' hrs') : '—'}</div></div>
              </div>
              {viewTarget.description && (
                <div className="ep-desc-box"><div className="ep-mf-lbl">📝 Description</div><p>"{viewTarget.description}"</p></div>
              )}
            </div>
            <div className="ep-modal-foot">
              <button className="ep-btn-cancel" onClick={()=>setModal(null)}>Close</button>
              <button className="ep-btn-save" style={{background:'linear-gradient(135deg,#7c3aed,#a78bfa)'}} onClick={()=>{setModal(null);openEdit(viewTarget);}}>✏️ Edit Event</button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {modal==='form' && (
        <div className="ep-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="ep-modal ep-form-modal">
            <div className="ep-modal-head">
              <div className="ep-modal-title">{editId ? '✏️ Edit Event' : '✨ Create Event'}</div>
              <button className="ep-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="ep-modal-body">
              {error && <div className="ep-error">{error}</div>}
              <form id="ep-form" onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="ep-form-group">
                  <label className="ep-form-label">Event Title *</label>
                  <input className="ep-form-input" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Avengers: Endgame" required/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>

                  {/* Category dropdown */}
                  <div className="ep-form-group">
                    <label className="ep-form-label">Category *</label>
                    <select className="ep-form-input" value={form.category} onChange={e=>handleCategoryChange(e.target.value)} required>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Genre dropdown — changes based on category */}
                  <div className="ep-form-group">
                    <label className="ep-form-label">Genre *</label>
                    <select className="ep-form-input" value={form.genre} onChange={e=>set('genre',e.target.value)} required disabled={!form.category}>
                      <option value="">{form.category ? 'Select genre' : 'Select category first'}</option>
                      {genreOptions.map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  {/* ✅ Language dropdown */}
                  <div className="ep-form-group">
                    <label className="ep-form-label">Language *</label>
                    <select className="ep-form-input" value={form.language} onChange={e=>set('language',e.target.value)} required>
                      <option value="">Select language</option>
                      {LANGUAGES.map(l=><option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  {/* ✅ Duration dropdown in hours */}
                  <div className="ep-form-group">
                    <label className="ep-form-label">Duration *</label>
                    <select className="ep-form-input" value={form.duration} onChange={e=>set('duration',e.target.value)} required>
                      <option value="">Select duration</option>
                      {DURATIONS.map(d=><option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>

                  <div className="ep-form-group">
                    <label className="ep-form-label">Status *</label>
                    <select className="ep-form-input" value={form.showStatus} onChange={e=>set('showStatus',e.target.value)}>
                      {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Tag dropdown */}
                  <div className="ep-form-group">
                    <label className="ep-form-label">Tag</label>
                    <select className="ep-form-input" value={form.tag} onChange={e=>set('tag',e.target.value)}>
                      <option value="">No tag</option>
                      {TAGS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                </div>
                <div className="ep-form-group">
                  <label className="ep-form-label">Description</label>
                  <textarea className="ep-form-input" rows={3} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Short description..." style={{resize:'vertical'}}/>
                </div>
              </form>
            </div>
            <div className="ep-modal-foot">
              <button className="ep-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button className="ep-btn-save" form="ep-form" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modal==='delete' && deleteTarget && (
        <div className="ep-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="ep-modal" style={{maxWidth:400}}>
            <div className="ep-modal-head">
              <div className="ep-modal-title">🗑️ Delete Event?</div>
              <button className="ep-modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="ep-modal-body">
              <p style={{fontSize:14,color:'var(--ink2)',lineHeight:1.6}}>
                Are you sure you want to delete <strong style={{color:'var(--ink)'}}>{deleteTarget.title}</strong>?<br/>
                <span style={{color:'var(--red)',fontWeight:600}}>This action cannot be undone.</span>
              </p>
            </div>
            <div className="ep-modal-foot">
              <button className="ep-btn-cancel" onClick={()=>setModal(null)}>Cancel</button>
              <button className="ep-btn-delete" onClick={handleDelete}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}