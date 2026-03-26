import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/common/AdminSidebar';
import { cancellationsAPI, paymentsAPI, alertsAPI } from '../../services/api';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  .cp {
    --pink:#ec4899; --pink2:#db2777; --pink3:#f9a8d4; --pink4:#fdf2f8; --pink5:#fff0f9;
    --pink-border:rgba(236,72,153,0.22); --pink-glow:rgba(236,72,153,0.18); --mauve:#c084fc;
    --green:#16a34a; --green-bg:rgba(22,163,74,0.09); --green-bd:rgba(22,163,74,0.22);
    --amber:#d97706; --amber-bg:rgba(217,119,6,0.09); --amber-bd:rgba(217,119,6,0.22);
    --red:#dc2626; --red-bg:rgba(220,38,38,0.09); --red-bd:rgba(220,38,38,0.22);
    --teal:#0d9488; --bg:#fff5fb; --card:#ffffff; --card2:#faf7f4; --border:#fce7f3;
    --ink:#1e0a17; --ink2:#6b3a54; --ink3:#a87090; --ink4:#d4a8be;
    --sh:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07);
    --sh-up:0 12px 36px rgba(236,72,153,0.14),0 4px 12px rgba(30,10,23,0.06);
    font-family:'DM Sans',sans-serif; color:var(--ink);
  }
  .cp * { box-sizing:border-box; margin:0; padding:0; }
  .cp-main { flex:1; margin-left:var(--sidebar-width,240px); min-height:100vh; background:var(--bg); padding:38px 36px 64px; overflow-y:auto; position:relative; }
  .cp-main::before { content:''; position:fixed; top:-100px; right:-80px; width:420px; height:420px; border-radius:50%; background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%); pointer-events:none; z-index:0; }
  .cp-content { position:relative; z-index:1; }
  .cp-header { margin-bottom:32px; animation:cpUp 0.4s ease both; }
  .cp-title { font-family:'Playfair Display',serif; font-size:28px; font-weight:800; color:var(--ink); letter-spacing:-0.02em; display:flex; align-items:center; gap:10px; }
  .cp-title-bar { width:5px; height:28px; border-radius:3px; background:linear-gradient(180deg,var(--pink),var(--mauve)); box-shadow:0 0 10px var(--pink-glow); }
  .cp-sub { font-size:13.5px; color:var(--ink3); margin-top:6px; font-weight:400; }
  .cp-pending-badge { display:inline-flex; align-items:center; gap:5px; background:var(--amber-bg); color:var(--amber); border:1px solid var(--amber-bd); border-radius:99px; padding:3px 10px; font-size:12px; font-weight:700; margin-left:10px; }
  .cp-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:14px; margin-bottom:28px; animation:cpUp 0.45s 0.06s ease both; }
  .cp-stat { background:var(--card); border:1.5px solid var(--border); border-radius:18px; padding:22px 20px 18px; position:relative; overflow:hidden; box-shadow:var(--sh); transition:transform 0.22s cubic-bezier(.34,1.56,.64,1),box-shadow 0.2s; }
  .cp-stat:hover { transform:translateY(-3px); box-shadow:var(--sh-up); }
  .cp-stat-stripe { position:absolute; top:0; left:0; height:3px; width:40%; border-radius:18px 0 3px 0; transition:width 0.3s ease; }
  .cp-stat:hover .cp-stat-stripe { width:100%; }
  .cp-stat-icon { font-size:24px; margin-bottom:12px; }
  .cp-stat-val { font-family:'Playfair Display',serif; font-size:32px; font-weight:800; color:var(--ink); line-height:1; margin-bottom:4px; }
  .cp-stat-lbl { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.11em; color:var(--ink3); }
  .cp-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:22px; animation:cpUp 0.45s 0.09s ease both; }
  .cp-search { display:flex; align-items:center; gap:8px; background:var(--card); border:1.5px solid var(--border); border-radius:99px; padding:9px 16px; box-shadow:var(--sh); flex:1; max-width:320px; transition:border-color 0.2s; }
  .cp-search:focus-within { border-color:var(--pink-border); }
  .cp-search input { border:none; outline:none; background:transparent; font-size:13px; font-family:'DM Sans',sans-serif; color:var(--ink); width:100%; }
  .cp-search input::placeholder { color:var(--ink3); }
  .cp-filter-btn { padding:8px 16px; border-radius:99px; border:1.5px solid var(--border); background:var(--card); font-size:12.5px; font-weight:600; color:var(--ink2); cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.18s; display:flex; align-items:center; gap:6px; }
  .cp-filter-btn:hover { border-color:var(--pink-border); color:var(--pink); }
  .cp-filter-btn.active { background:linear-gradient(135deg,var(--pink),var(--mauve)); color:#fff; border-color:transparent; box-shadow:0 4px 14px var(--pink-glow); }
  .cp-count-dot { background:rgba(255,255,255,0.3); color:#fff; border-radius:99px; padding:1px 7px; font-size:10px; font-weight:700; }
  .cp-list { display:flex; flex-direction:column; gap:14px; animation:cpUp 0.45s 0.12s ease both; }
  .cp-card { background:var(--card); border-radius:18px; border:1.5px solid var(--border); border-left-width:5px; box-shadow:var(--sh); padding:22px 24px; transition:box-shadow 0.2s,transform 0.2s; }
  .cp-card:hover { box-shadow:var(--sh-up); transform:translateY(-1px); }
  .cp-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
  .cp-card-left { flex:1; }
  .cp-card-meta { display:flex; align-items:center; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
  .cp-status-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:99px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; }
  .cp-status-pill::before { content:''; width:5px; height:5px; border-radius:50%; animation:cpBlink 2.5s ease-in-out infinite; }
  @keyframes cpBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
  .st-pending { background:var(--amber-bg); color:var(--amber); border:1px solid var(--amber-bd); }
  .st-pending::before { background:var(--amber); }
  .st-approved { background:var(--green-bg); color:var(--green); border:1px solid var(--green-bd); }
  .st-approved::before { background:var(--green); }
  .st-rejected { background:var(--red-bg); color:var(--red); border:1px solid var(--red-bd); }
  .st-rejected::before { background:var(--red); }
  .cp-req-id { font-size:12px; color:var(--ink3); font-weight:500; }
  .cp-req-date { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--ink4); }
  .cp-fields { display:flex; gap:28px; flex-wrap:wrap; margin-bottom:14px; }
  .cp-field-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink3); margin-bottom:3px; }
  .cp-field-val { font-weight:600; font-size:14px; color:var(--ink); }
  .cp-ref { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; color:var(--teal); background:rgba(13,148,136,0.08); border:1px solid rgba(13,148,136,0.18); padding:3px 8px; border-radius:6px; }
  .cp-amount { font-family:'Playfair Display',serif; font-size:18px; font-weight:800; color:var(--pink2); }
  .cp-reason { background:var(--pink4); border:1px solid var(--border); border-radius:10px; padding:10px 14px; font-size:13.5px; color:var(--ink2); font-style:italic; line-height:1.5; }
  .cp-actions { display:flex; flex-direction:column; gap:8px; min-width:140px; }
  .cp-btn { display:flex; align-items:center; justify-content:center; gap:7px; padding:10px 18px; border-radius:11px; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; border:none; cursor:pointer; transition:all 0.2s cubic-bezier(.34,1.56,.64,1); }
  .cp-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none !important; }
  .cp-btn-approve { background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; box-shadow:0 4px 14px rgba(22,163,74,0.25); }
  .cp-btn-approve:hover:not(:disabled) { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 22px rgba(22,163,74,0.35); }
  .cp-btn-reject { background:var(--red-bg); color:var(--red); border:1.5px solid var(--red-bd); }
  .cp-btn-reject:hover:not(:disabled) { background:rgba(220,38,38,0.15); transform:translateY(-2px) scale(1.03); }
  .cp-btn-view { background:var(--pink5); color:var(--pink2); border:1.5px solid var(--pink-border); width:100%; }
  .cp-btn-view:hover:not(:disabled) { background:#fce7f3; transform:translateY(-2px) scale(1.03); box-shadow:0 6px 18px var(--pink-glow); }
  .cp-btn-spin { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:cpSpin 0.6s linear infinite; }
  @keyframes cpSpin { to { transform:rotate(360deg); } }
  .cp-overlay { position:fixed; inset:0; z-index:1000; background:rgba(30,10,23,0.45); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; animation:cpFadeIn 0.2s ease both; }
  @keyframes cpFadeIn { from{opacity:0;} to{opacity:1;} }
  .cp-modal { background:var(--card); border-radius:22px; border:1.5px solid var(--border); box-shadow:0 24px 80px rgba(236,72,153,0.18),0 8px 24px rgba(30,10,23,0.12); width:100%; max-width:520px; animation:cpSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both; overflow:hidden; }
  @keyframes cpSlideUp { from{opacity:0;transform:translateY(28px) scale(0.97);} to{opacity:1;transform:translateY(0) scale(1);} }
  .cp-modal-header { padding:22px 24px 18px; border-bottom:1.5px solid var(--border); display:flex; align-items:center; justify-content:space-between; background:linear-gradient(135deg,var(--pink4),#fff); }
  .cp-modal-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; color:var(--ink); display:flex; align-items:center; gap:8px; }
  .cp-modal-close { width:34px; height:34px; border-radius:50%; background:var(--pink5); border:1.5px solid var(--pink-border); color:var(--pink2); font-size:16px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.18s; font-family:'DM Sans',sans-serif; }
  .cp-modal-close:hover { background:var(--pink3); transform:scale(1.08); }
  .cp-modal-body { padding:24px; display:flex; flex-direction:column; gap:18px; }
  .cp-modal-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .cp-modal-field { background:var(--pink4); border:1px solid var(--border); border-radius:12px; padding:12px 14px; }
  .cp-modal-field-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink3); margin-bottom:5px; }
  .cp-modal-field-val { font-size:14px; font-weight:600; color:var(--ink); }
  .cp-modal-reason { background:var(--pink4); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; }
  .cp-modal-reason p { font-size:14px; color:var(--ink2); font-style:italic; line-height:1.6; margin-top:6px; }
  .cp-modal-footer { padding:18px 24px; border-top:1.5px solid var(--border); display:flex; gap:10px; justify-content:flex-end; background:var(--pink4); }
  .cp-empty { display:flex; flex-direction:column; align-items:center; padding:64px 0; gap:12px; }
  .cp-empty-icon { font-size:48px; opacity:0.25; }
  .cp-empty-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--ink); }
  .cp-empty-sub { font-size:13.5px; color:var(--ink3); }
  .cp-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .cp-spinner { width:42px; height:42px; border:3px solid var(--pink4); border-top-color:var(--pink); border-radius:50%; animation:cpSpin 0.75s linear infinite; box-shadow:0 0 18px var(--pink-glow); }
  @keyframes cpUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @media (max-width:768px) {
    .cp-main { padding:22px 14px 48px; }
    .cp-modal-row { grid-template-columns:1fr; }
    .cp-card-top { flex-direction:column; }
    .cp-actions { flex-direction:row; flex-wrap:wrap; min-width:auto; }
  }
`;

const statusPillClass = s => ({ PENDING:'st-pending', APPROVED:'st-approved', REJECTED:'st-rejected' }[s] ?? 'st-pending');
const borderColor = s => ({ PENDING:'#f59e0b', APPROVED:'#16a34a', REJECTED:'#dc2626' }[s] ?? '#e2e8f0');
const accentColor = s => ({ PENDING:'#fef3c7', APPROVED:'#f0fdf4', REJECTED:'#fff1f2' }[s] ?? '#fff');

export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [statusFilter, setStatusFilter]   = useState('All');
  const [search, setSearch]               = useState('');
  const [processing, setProcessing]       = useState(null);
  const [selected, setSelected]           = useState(null);

  const fetchAll = () => cancellationsAPI.getAll().then(setCancellations).finally(() => setLoading(false));
  useEffect(() => { fetchAll(); }, []);

  const handleAction = async (c, action) => {
    setProcessing(c.cancellationId);
    try {
      await cancellationsAPI.updateStatus(c.cancellationId, action);
      if (action === 'APPROVED') {
        // ✅ FIXED: use flat field c.bookingId
        const payments = await paymentsAPI.getByBooking(c.bookingId);
        if (payments.length > 0) await paymentsAPI.updateStatus(payments[0].paymentId, 'REFUNDED');
      }
      await alertsAPI.create({
        // ✅ FIXED: use flat fields c.userId, c.bookingId
        user:    { userId: c.userId },
        booking: { bookingId: c.bookingId },
        message: action === 'APPROVED'
          ? `Your cancellation has been approved. Refund of ₹${c.amount} will be processed within 5-7 business days.`
          : `Your cancellation request has been rejected. Your booking remains active.`,
        type: 'CANCELLATION',
      });
      setSelected(null);
      fetchAll();
    } catch (err) { alert(err.message); }
    finally { setProcessing(null); }
  };

  const filtered = cancellations.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    // ✅ FIXED: use flat fields
    const matchSearch =
      c.userName?.toLowerCase().includes(search.toLowerCase()) ||
      c.refCode?.toLowerCase().includes(search.toLowerCase()) ||
      c.reason?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pending       = cancellations.filter(c => c.status === 'PENDING').length;
  const approved      = cancellations.filter(c => c.status === 'APPROVED').length;
  const totalRefunded = cancellations.filter(c => c.status === 'APPROVED')
                          .reduce((s, c) => s + parseFloat(c.amount || 0), 0);

  return (
    <div className="cp" style={{ display:'flex', minHeight:'100vh', background:'#fff5fb' }}>
      <style>{S}</style>
      <AdminSidebar />

      <main className="cp-main">
        <div className="cp-content">

          <div className="cp-header">
            <div className="cp-title">
              <div className="cp-title-bar" />
              Cancellation Requests
            </div>
            <div className="cp-sub">
              Review and process cancellation requests
              {pending > 0 && <span className="cp-pending-badge">⏳ {pending} pending</span>}
            </div>
          </div>

          {loading ? (
            <div className="cp-spin-wrap"><div className="cp-spinner" /></div>
          ) : (
            <>
              <div className="cp-stats">
                {[
                  { label:'Total Requests', value:cancellations.length, icon:'📋', accent:'#ec4899' },
                  { label:'Pending Review', value:pending,              icon:'⏳', accent:'#d97706' },
                  { label:'Approved',       value:approved,             icon:'✅', accent:'#16a34a' },
                  { label:'Total Refunded', value:`₹${totalRefunded.toFixed(0)}`, icon:'↩️', accent:'#7c3aed' },
                ].map(({ label, value, icon, accent }) => (
                  <div key={label} className="cp-stat"
                    onMouseEnter={e => e.currentTarget.style.borderColor = accent + '44'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                    <div className="cp-stat-stripe" style={{ background:accent }} />
                    <div className="cp-stat-icon">{icon}</div>
                    <div className="cp-stat-val">{value}</div>
                    <div className="cp-stat-lbl">{label}</div>
                  </div>
                ))}
              </div>

              <div className="cp-filters">
                <div className="cp-search">
                  <span style={{ fontSize:15, color:'var(--ink3)' }}>🔍</span>
                  <input
                    placeholder="Search by user, booking ref..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                {['All','PENDING','APPROVED','REJECTED'].map(s => (
                  <button key={s}
                    className={`cp-filter-btn${statusFilter === s ? ' active' : ''}`}
                    onClick={() => setStatusFilter(s)}>
                    {s}
                    {s === 'PENDING' && pending > 0 && <span className="cp-count-dot">{pending}</span>}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="cp-empty">
                  <div className="cp-empty-icon">🌸</div>
                  <div className="cp-empty-title">No requests found</div>
                  <div className="cp-empty-sub">All caught up!</div>
                </div>
              ) : (
                <div className="cp-list">
                  {filtered.map(c => (
                    <div key={c.cancellationId} className="cp-card"
                      style={{ borderLeftColor:borderColor(c.status), background:accentColor(c.status) }}>
                      <div className="cp-card-top">
                        <div className="cp-card-left">
                          <div className="cp-card-meta">
                            <span className={`cp-status-pill ${statusPillClass(c.status)}`}>{c.status}</span>
                            <span className="cp-req-id">Request #{c.cancellationId}</span>
                            {c.cancelledAt && (
                              <span className="cp-req-date">
                                {new Date(c.cancelledAt).toLocaleDateString('en-IN')}
                              </span>
                            )}
                          </div>
                          <div className="cp-fields">
                            <div>
                              <div className="cp-field-lbl">User</div>
                              {/* ✅ FIXED: flat field */}
                              <div className="cp-field-val">{c.userName || `#${c.userId}`}</div>
                            </div>
                            <div>
                              <div className="cp-field-lbl">Booking</div>
                              {/* ✅ FIXED: flat field */}
                              <span className="cp-ref">{c.refCode || `#${c.bookingId}`}</span>
                            </div>
                            <div>
                              <div className="cp-field-lbl">Refund Amount</div>
                              <span className="cp-amount">₹{Number(c.amount || 0).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="cp-reason">"{c.reason}"</div>
                        </div>

                        <div className="cp-actions">
                          <button className="cp-btn cp-btn-view" onClick={() => setSelected(c)}>
                            👁️ View Details
                          </button>
                          {c.status === 'PENDING' && (
                            <>
                              <button
                                className="cp-btn cp-btn-approve"
                                disabled={processing === c.cancellationId}
                                onClick={() => handleAction(c, 'APPROVED')}>
                                {processing === c.cancellationId
                                  ? <><div className="cp-btn-spin" /> Processing…</>
                                  : <>✓ Approve</>}
                              </button>
                              <button
                                className="cp-btn cp-btn-reject"
                                disabled={processing === c.cancellationId}
                                onClick={() => handleAction(c, 'REJECTED')}>
                                ✗ Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* MODAL */}
      {selected && (
        <div className="cp-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="cp-modal">
            <div className="cp-modal-header">
              <div className="cp-modal-title">
                🌸 Request #{selected.cancellationId}
                <span className={`cp-status-pill ${statusPillClass(selected.status)}`} style={{ fontSize:11 }}>
                  {selected.status}
                </span>
              </div>
              <button className="cp-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="cp-modal-body">
              <div className="cp-modal-row">
                <div className="cp-modal-field">
                  <div className="cp-modal-field-lbl">👤 User</div>
                  {/* ✅ FIXED */}
                  <div className="cp-modal-field-val">{selected.userName || `#${selected.userId}`}</div>
                </div>
                <div className="cp-modal-field">
                  <div className="cp-modal-field-lbl">📧 Email</div>
                  {/* ✅ FIXED */}
                  <div className="cp-modal-field-val" style={{ fontSize:13 }}>{selected.userEmail || '—'}</div>
                </div>
              </div>

              <div className="cp-modal-row">
                <div className="cp-modal-field">
                  <div className="cp-modal-field-lbl">🎟️ Booking Ref</div>
                  {/* ✅ FIXED */}
                  <span className="cp-ref">{selected.refCode || `#${selected.bookingId}`}</span>
                </div>
                <div className="cp-modal-field">
                  <div className="cp-modal-field-lbl">💰 Refund Amount</div>
                  <span className="cp-amount" style={{ fontSize:22 }}>₹{Number(selected.amount || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="cp-modal-row">
                <div className="cp-modal-field">
                  <div className="cp-modal-field-lbl">📅 Requested On</div>
                  <div className="cp-modal-field-val">
                    {selected.cancelledAt
                      ? new Date(selected.cancelledAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
                      : '—'}
                  </div>
                </div>
                <div className="cp-modal-field">
                  <div className="cp-modal-field-lbl">🎭 Event</div>
                  {/* ✅ FIXED: use eventTitle flat field */}
                  <div className="cp-modal-field-val" style={{ fontSize:13 }}>{selected.eventTitle || '—'}</div>
                </div>
              </div>

              <div className="cp-modal-reason">
                <div className="cp-modal-field-lbl">💬 Reason</div>
                <p>"{selected.reason}"</p>
              </div>
            </div>

            <div className="cp-modal-footer">
              {selected.status === 'PENDING' ? (
                <>
                  <button
                    className="cp-btn cp-btn-reject"
                    style={{ padding:'10px 22px' }}
                    disabled={processing === selected.cancellationId}
                    onClick={() => handleAction(selected, 'REJECTED')}>
                    ✗ Reject
                  </button>
                  <button
                    className="cp-btn cp-btn-approve"
                    style={{ padding:'10px 22px' }}
                    disabled={processing === selected.cancellationId}
                    onClick={() => handleAction(selected, 'APPROVED')}>
                    {processing === selected.cancellationId
                      ? <><div className="cp-btn-spin" /> Processing…</>
                      : <>✓ Approve & Refund</>}
                  </button>
                </>
              ) : (
                <button
                  className="cp-btn cp-btn-view"
                  style={{ padding:'10px 22px' }}
                  onClick={() => setSelected(null)}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}