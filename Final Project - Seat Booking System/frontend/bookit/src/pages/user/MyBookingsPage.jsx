import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { bookingsAPI, cancellationsAPI, bookingItemsAPI, paymentsAPI, alertsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CANCELLATION_REASONS = [
  "Change of plans",
  "Wrong booking",
  "Event rescheduled",
  "Health issues",
  "Travel issues",
  "Found better seats",
  "Price concern",
  "Personal emergency",
  "Duplicate booking",
  "Other"
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .mb {
    --pink:#ec4899; --pink2:#db2777; --pink3:#f9a8d4;
    --pink4:#fdf2f8; --pink5:#fff0f9; --pink6:#fce7f3;
    --pink-border:rgba(236,72,153,0.22);
    --pink-glow:rgba(236,72,153,0.18);
    --mauve:#c084fc; --mauve2:#a855f7;
    --green:#16a34a; --green-bg:rgba(22,163,74,0.09); --green-bd:rgba(22,163,74,0.22);
    --amber:#d97706; --amber-bg:rgba(217,119,6,0.09); --amber-bd:rgba(217,119,6,0.22);
    --red:#dc2626; --red-bg:rgba(220,38,38,0.09); --red-bd:rgba(220,38,38,0.22);
    --sky:#0ea5e9; --sky-bg:rgba(14,165,233,0.09); --sky-bd:rgba(14,165,233,0.22);
    --teal:#0d9488;
    --bg:#fff5fb; --card:#ffffff; --border:#fce7f3;
    --ink:#1e0a17; --ink2:#6b3a54; --ink3:#a87090; --ink4:#d4a8be;
    --sh:0 2px 12px rgba(236,72,153,0.10),0 0 0 1px rgba(244,114,182,0.08);
    --sh-up:0 20px 60px rgba(236,72,153,0.18),0 4px 16px rgba(30,10,23,0.08);
    font-family:'DM Sans',sans-serif; color:var(--ink); background:var(--bg);
  }

  .mb * { box-sizing:border-box; margin:0; padding:0; }

  .mb-main {
    max-width:900px; margin:0 auto;
    padding:calc(64px + 40px) 32px 72px;
  }

  .mb-header { margin-bottom:36px; animation:mbUp 0.4s ease both; }

  .mb-title {
    font-family:'Playfair Display',serif;
    font-size:32px; font-weight:800; color:var(--ink);
    display:flex; align-items:center; gap:12px; margin-bottom:6px;
  }

  .mb-title-bar {
    width:5px; height:32px; border-radius:3px; flex-shrink:0;
    background:linear-gradient(180deg,var(--pink),var(--mauve));
    box-shadow:0 0 10px var(--pink-glow);
  }

  .mb-sub { font-size:14px; color:var(--ink3); }

  .mb-summary {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:12px; margin-bottom:28px;
    animation:mbUp 0.4s 0.05s ease both;
  }

  .mb-sum-card {
    background:var(--card); border:1.5px solid var(--border);
    border-radius:16px; padding:16px 18px;
    box-shadow:var(--sh); position:relative; overflow:hidden;
    transition:transform 0.2s;
  }

  .mb-sum-card:hover { transform:translateY(-2px); }
  .mb-sum-stripe { position:absolute; top:0; left:0; right:0; height:3px; }
  .mb-sum-icon { font-size:20px; margin-bottom:8px; }
  .mb-sum-val { font-family:'Playfair Display',serif; font-size:26px; font-weight:800; color:var(--ink); line-height:1; }
  .mb-sum-lbl { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink3); margin-top:4px; }

  .mb-filters {
    display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap;
    animation:mbUp 0.4s 0.08s ease both;
  }

  .mb-filter-btn {
    padding:8px 18px; border-radius:99px; font-size:13px;
    border:1.5px solid var(--border); background:var(--card);
    color:var(--ink3); cursor:pointer; font-weight:600;
    transition:all 0.18s;
  }

  .mb-filter-btn:hover { border-color:var(--pink-border); color:var(--pink2); background:var(--pink5); }

  .mb-filter-btn.active {
    background:linear-gradient(135deg,var(--pink),var(--mauve));
    border-color:transparent; color:#fff;
    box-shadow:0 4px 14px var(--pink-glow);
  }

  .mb-list { display:flex; flex-direction:column; gap:18px; animation:mbUp 0.4s 0.1s ease both; }

  .mb-card {
    background:var(--card); border:1.5px solid var(--border);
    border-radius:22px; overflow:hidden;
    box-shadow:var(--sh); transition:box-shadow 0.2s, transform 0.2s;
  }

  .mb-card:hover { box-shadow:var(--sh-up); transform:translateY(-2px); }

  .mb-card-inner { display:flex; }
  .mb-card-strip { width:5px; flex-shrink:0; }
  .mb-card-body { flex:1; padding:22px 24px; }

  .mb-card-top {
    display:flex; justify-content:space-between;
    align-items:flex-start; gap:16px; flex-wrap:wrap; margin-bottom:16px;
  }

  .mb-card-left { flex:1; }
  .mb-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:10px; }

  .mb-card-meta { display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap; }

  .mb-status-pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 12px; border-radius:99px;
    font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em;
  }

  .mb-status-pill::before { content:''; width:5px; height:5px; border-radius:50%; animation:mbBlink 2.5s ease-in-out infinite; }
  @keyframes mbBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

  .sp-confirmed { background:var(--green-bg); color:var(--green); border:1px solid var(--green-bd); }
  .sp-confirmed::before { background:var(--green); }
  .sp-pending   { background:var(--amber-bg); color:var(--amber); border:1px solid var(--amber-bd); }
  .sp-pending::before { background:var(--amber); }
  .sp-cancelled { background:var(--red-bg); color:var(--red); border:1px solid var(--red-bd); }
  .sp-cancelled::before { background:var(--red); }

  .mb-ref {
    font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600;
    color:var(--teal); background:rgba(13,148,136,0.08);
    border:1px solid rgba(13,148,136,0.18); padding:3px 10px; border-radius:6px;
  }

  .mb-card-title {
    font-family:'Playfair Display',serif;
    font-size:20px; font-weight:800; color:var(--ink); margin-bottom:10px; line-height:1.2;
  }

  .mb-card-details { display:flex; gap:18px; flex-wrap:wrap; }
  .mb-detail-item { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--ink3); }

  .mb-amount {
    font-family:'Playfair Display',serif;
    font-size:28px; font-weight:800; color:var(--pink2);
  }

  .mb-seats-section { margin-top:16px; padding-top:16px; border-top:1px solid var(--border); }
  .mb-seats-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink3); margin-bottom:10px; }
  .mb-seats-row { display:flex; gap:8px; flex-wrap:wrap; }

  .mb-seat-chip {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 12px; border-radius:10px;
    font-family:'JetBrains Mono',monospace;
    font-size:12px; font-weight:700;
    background:var(--pink4); color:var(--ink2); border:1.5px solid var(--border);
  }

  .mb-seat-cat { font-size:10px; font-weight:600; color:var(--ink3); }

  .mb-seat-skeleton { display:flex; gap:8px; flex-wrap:wrap; }
  .mb-seat-skel-chip {
    width:90px; height:32px; border-radius:10px;
    background:linear-gradient(90deg, var(--pink4) 25%, var(--pink6) 50%, var(--pink4) 75%);
    background-size:200% 100%; animation:mbShimmer 1.2s infinite;
  }
  @keyframes mbShimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

  .mb-timeline {
    margin-top:16px; padding-top:16px; border-top:1px solid var(--border);
    display:flex; gap:0; position:relative;
  }

  .mb-timeline::before {
    content:''; position:absolute; top:12px; left:12px; right:12px; height:2px;
    background:var(--border); z-index:0;
  }

  .mb-timeline-step { flex:1; display:flex; flex-direction:column; align-items:center; position:relative; z-index:1; }

  .mb-timeline-dot {
    width:24px; height:24px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:11px; margin-bottom:6px; border:2px solid var(--border); background:var(--card);
  }

  .mb-timeline-dot.done { background:linear-gradient(135deg,var(--pink),var(--mauve)); border-color:transparent; color:#fff; }
  .mb-timeline-dot.current { background:var(--card); border-color:var(--pink); box-shadow:0 0 0 3px rgba(236,72,153,0.15); }

  .mb-timeline-label { font-size:10px; font-weight:600; color:var(--ink3); text-align:center; }
  .mb-timeline-date  { font-size:9px; color:var(--ink4); text-align:center; font-family:'JetBrains Mono',monospace; }

  .mb-cancel-btn {
    padding:9px 18px; border-radius:11px;
    background:var(--red-bg); color:var(--red);
    border:1.5px solid var(--red-bd); cursor:pointer;
    font-size:13px; font-weight:700; transition:all 0.18s cubic-bezier(.34,1.56,.64,1);
  }

  .mb-cancel-btn:hover { background:rgba(220,38,38,0.15); transform:translateY(-1px); }

  .mb-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(30,10,23,0.50); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    padding:20px; animation:mbFadeIn 0.2s ease both;
  }

  @keyframes mbFadeIn { from{opacity:0;} to{opacity:1;} }

  .mb-modal {
    background:var(--card); border-radius:24px; border:1.5px solid var(--border);
    box-shadow:0 24px 80px rgba(236,72,153,0.22),0 8px 24px rgba(30,10,23,0.12);
    width:100%; max-width:480px;
    animation:mbSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both; overflow:hidden;
  }

  @keyframes mbSlideUp { from{opacity:0;transform:translateY(28px) scale(0.97);} to{opacity:1;transform:translateY(0) scale(1);} }

  .mb-modal-head {
    padding:22px 24px 18px; border-bottom:1.5px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(135deg,var(--pink4),#fff);
  }

  .mb-modal-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; color:var(--ink); }

  .mb-modal-close {
    width:34px; height:34px; border-radius:50%;
    background:var(--pink5); border:1.5px solid var(--pink-border);
    color:var(--pink2); font-size:16px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.18s;
  }

  .mb-modal-close:hover { background:var(--pink3); transform:scale(1.08); }

  .mb-modal-body { padding:24px; display:flex; flex-direction:column; gap:14px; }
  .mb-modal-foot { padding:16px 24px; border-top:1.5px solid var(--border); display:flex; gap:10px; justify-content:flex-end; background:var(--pink4); }

  .mb-modal-info {
    background:var(--pink4); border:1px solid var(--border);
    border-radius:12px; padding:14px 16px;
  }

  .mb-modal-ref { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:600; color:var(--teal); }
  .mb-modal-sub { font-size:13.5px; color:var(--ink2); margin-top:6px; line-height:1.5; }

  .mb-textarea-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--ink2); display:block; }

  .mb-select {
    width:100%; padding:12px 14px; border-radius:12px;
    border:1.5px solid var(--border); background:#faf7f4;
    font-size:13.5px; font-family:'DM Sans',sans-serif; color:var(--ink);
    outline:none; cursor:pointer; transition:border-color 0.2s;
    appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a87090' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 14px center;
    background-color:#faf7f4;
  }

  .mb-select:focus { border-color:var(--pink-border); box-shadow:0 0 0 3px rgba(236,72,153,0.08); }

  .mb-textarea {
    width:100%; padding:12px 14px; border-radius:12px;
    border:1.5px solid var(--border); background:#faf7f4;
    font-size:13.5px; font-family:'DM Sans',sans-serif; color:var(--ink);
    outline:none; resize:vertical; transition:border-color 0.2s; min-height:90px;
  }

  .mb-textarea:focus { border-color:var(--pink-border); box-shadow:0 0 0 3px rgba(236,72,153,0.08); }

  .mb-btn-ghost {
    padding:10px 22px; border-radius:11px;
    background:var(--card); color:var(--ink2);
    border:1.5px solid var(--border); cursor:pointer;
    font-size:13.5px; font-weight:600; transition:all 0.15s;
  }

  .mb-btn-ghost:hover { border-color:var(--pink-border); color:var(--pink2); }

  .mb-btn-danger {
    padding:10px 22px; border-radius:11px;
    background:var(--red-bg); color:var(--red);
    border:1.5px solid var(--red-bd); cursor:pointer;
    font-size:13.5px; font-weight:700; transition:all 0.15s;
  }

  .mb-btn-danger:hover:not(:disabled) { background:rgba(220,38,38,0.15); }
  .mb-btn-danger:disabled { opacity:0.55; cursor:not-allowed; }

  .mb-empty {
    display:flex; flex-direction:column; align-items:center;
    padding:72px 0; gap:14px; text-align:center;
  }

  .mb-empty-icon { font-size:56px; opacity:0.25; }
  .mb-empty-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:var(--ink); }
  .mb-empty-sub { font-size:14px; color:var(--ink3); }

  .mb-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .mb-spinner { width:42px; height:42px; border:3px solid var(--pink4); border-top-color:var(--pink); border-radius:50%; animation:mbSpin 0.75s linear infinite; box-shadow:0 0 18px var(--pink-glow); }

  @keyframes mbSpin  { to{transform:rotate(360deg);} }
  @keyframes mbUp    { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

  @media(max-width:768px) {
    .mb-main { padding:calc(64px + 24px) 16px 48px; }
    .mb-summary { grid-template-columns:1fr 1fr; }
    .mb-card-top { flex-direction:column; }
    .mb-card-right { align-items:flex-start; }
  }
`;

const statusPill  = s => ({ CONFIRMED:'sp-confirmed', PENDING:'sp-pending', CANCELLED:'sp-cancelled' }[s] || 'sp-pending');
const stripColor  = s => ({ CONFIRMED:'linear-gradient(180deg,#16a34a,#15803d)', PENDING:'linear-gradient(180deg,#d97706,#b45309)', CANCELLED:'linear-gradient(180deg,#dc2626,#b91c1c)' }[s] || 'linear-gradient(180deg,#a87090,#6b3a54)');

const seatColor = cat => {
  if (!cat) return { bg:'#fdf2f8', color:'#6b3a54', bd:'#fce7f3' };
  const k = cat.toLowerCase();
  if (k.includes('vip'))     return { bg:'rgba(236,72,153,0.10)', color:'#db2777', bd:'rgba(236,72,153,0.22)' };
  if (k.includes('premium')) return { bg:'rgba(245,158,11,0.10)', color:'#b45309', bd:'rgba(245,158,11,0.22)' };
  if (k.includes('regular')) return { bg:'rgba(139,92,246,0.10)', color:'#6d28d9', bd:'rgba(139,92,246,0.22)' };
  return { bg:'#fdf2f8', color:'#6b3a54', bd:'#fce7f3' };
};

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings]                     = useState([]);
  const [items, setItems]                           = useState({});
  const [loadingSeats, setLoadingSeats]             = useState(new Set());
  const [loading, setLoading]                       = useState(true);
  const [statusFilter, setStatusFilter]             = useState('All');
  const [cancelModal, setCancelModal]               = useState(null);
  const [cancelReason, setCancelReason]             = useState('');
  const [cancelReasonSelect, setCancelReasonSelect] = useState('');
  const [cancelling, setCancelling]                 = useState(false);
  const [expanded, setExpanded]                     = useState(new Set());

  const fetchBookings = async () => {
    const data = await bookingsAPI.getByUser(user.userId);
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [user.userId]);

  const toggleExpand = async (bookingId) => {
    const isOpen = expanded.has(bookingId);
    if (isOpen) {
      setExpanded(prev => { const n = new Set(prev); n.delete(bookingId); return n; });
      return;
    }
    if (!items[bookingId]) {
      setLoadingSeats(prev => new Set(prev).add(bookingId));
      setExpanded(prev => new Set(prev).add(bookingId));
      try {
        const data = await bookingItemsAPI.getByBooking(bookingId);
        setItems(prev => ({ ...prev, [bookingId]: data }));
      } catch (_) {
        setItems(prev => ({ ...prev, [bookingId]: [] }));
      } finally {
        setLoadingSeats(prev => { const n = new Set(prev); n.delete(bookingId); return n; });
      }
    } else {
      setExpanded(prev => new Set(prev).add(bookingId));
    }
  };

  const closeModal = () => {
    setCancelModal(null);
    setCancelReason('');
    setCancelReasonSelect('');
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setCancelling(true);
    try {
      await cancellationsAPI.create({
        booking: { bookingId: cancelModal.bookingId },
        user:    { userId: user.userId },
        reason:  cancelReason,
        amount:  cancelModal.totalCost,
      });
      await bookingsAPI.updateStatus(cancelModal.bookingId, 'CANCELLED');
      const its = await bookingItemsAPI.getByBooking(cancelModal.bookingId);
      await Promise.all(its.map(i => bookingItemsAPI.updateStatus(i.bookingItemsId, 'CANCELLED')));
      const pays = await paymentsAPI.getByBooking(cancelModal.bookingId);
      if (pays.length > 0) await paymentsAPI.updateStatus(pays[0].paymentId, 'REFUNDED');
      await alertsAPI.create({
        user:    { userId: user.userId },
        booking: { bookingId: cancelModal.bookingId },
        message: `Your booking has been cancelled. Refund of ₹${cancelModal.totalCost} will be processed.`,
        type: 'CANCELLATION',
      });
      closeModal();
      fetchBookings();
    } catch (err) { alert('Cancellation failed: ' + err.message); }
    finally { setCancelling(false); }
  };

  const filtered  = statusFilter === 'All' ? bookings : bookings.filter(b => b.bookingStatus === statusFilter);
  const total     = bookings.length;
  const confirmed = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
  const spent     = bookings.filter(b => b.bookingStatus !== 'CANCELLED').reduce((s,b) => s + parseFloat(b.totalCost||0), 0);
  const cancelled = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;

  return (
    <div className="mb" style={{ minHeight:'100vh' }}>
      <style>{S}</style>
      <Navbar />

      <div className="mb-main">

        <div className="mb-header">
          <div className="mb-title">
            <div className="mb-title-bar" />
            My Bookings
          </div>
          <div className="mb-sub">Manage all your event tickets and reservations</div>
        </div>

        <div className="mb-summary">
          {[
            { icon:'🎟️', val: total,                  lbl:'Total Bookings', accent:'#ec4899' },
            { icon:'✅', val: confirmed,               lbl:'Confirmed',      accent:'#16a34a' },
            { icon:'❌', val: cancelled,               lbl:'Cancelled',      accent:'#dc2626' },
            { icon:'💰', val: `₹${spent.toFixed(0)}`, lbl:'Total Spent',    accent:'#d97706' },
          ].map(({ icon, val, lbl, accent }) => (
            <div key={lbl} className="mb-sum-card">
              <div className="mb-sum-stripe" style={{ background:`linear-gradient(90deg,${accent},${accent}66)` }} />
              <div className="mb-sum-icon">{icon}</div>
              <div className="mb-sum-val">{val}</div>
              <div className="mb-sum-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        <div className="mb-filters">
          {['All','CONFIRMED','PENDING','CANCELLED'].map(s => (
            <button key={s}
              className={`mb-filter-btn${statusFilter===s?' active':''}`}
              onClick={() => setStatusFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mb-spin-wrap"><div className="mb-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="mb-empty">
            <div className="mb-empty-icon">🎟️</div>
            <div className="mb-empty-title">No bookings yet</div>
            <div className="mb-empty-sub">Browse events and book your first ticket!</div>
          </div>
        ) : (
          <div className="mb-list">
            {filtered.map(booking => {
              const isExpanded     = expanded.has(booking.bookingId);
              const isSeatsLoading = loadingSeats.has(booking.bookingId);
              const seatItems      = items[booking.bookingId] || [];
              const bookedDate     = booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString('en-IN') : '—';
              const showDate       = booking.screening?.screenDate || '—';
              const isCancelled    = booking.bookingStatus === 'CANCELLED';
              const isConfirmed    = booking.bookingStatus === 'CONFIRMED';

              const steps = [
                { label:'Booked',   date: bookedDate,  done: true,                       icon:'✓'  },
                { label:'Show',     date: showDate,    done: isConfirmed || isCancelled, icon:'🎬' },
                { label:'Complete', date: isCancelled ? 'Cancelled' : '—', done: false, icon: isCancelled ? '✕' : '○' },
              ];

              return (
                <div key={booking.bookingId} className="mb-card">
                  <div className="mb-card-inner">
                    <div className="mb-card-strip" style={{ background: stripColor(booking.bookingStatus) }} />
                    <div className="mb-card-body">

                      <div className="mb-card-top">
                        <div className="mb-card-left">
                          <div className="mb-card-meta">
                            <span className={`mb-status-pill ${statusPill(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                            <span className="mb-ref">{booking.refCode}</span>
                            <span style={{ fontSize:11, color:'var(--ink4)', fontFamily:'JetBrains Mono,monospace' }}>
                              {bookedDate}
                            </span>
                          </div>
                          <div className="mb-card-title">
                            {booking.screening?.event?.title || 'Event'}
                          </div>
                          <div className="mb-card-details">
                            <div className="mb-detail-item">📅 {showDate}</div>
                            <div className="mb-detail-item">⏰ {booking.screening?.startTime || '—'}</div>
                            <div className="mb-detail-item">📍 {booking.screening?.venue?.venueName || '—'}</div>
                          </div>
                        </div>

                        <div className="mb-card-right">
                          <div className="mb-amount">₹{Number(booking.totalCost||0).toFixed(2)}</div>
                          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                            <button
                              onClick={() => toggleExpand(booking.bookingId)}
                              style={{
                                padding:'7px 14px', borderRadius:10, fontSize:12.5,
                                border:'1.5px solid var(--border)', background:'var(--pink4)',
                                color:'var(--ink2)', cursor:'pointer', fontWeight:600, transition:'all 0.15s',
                              }}>
                              {isExpanded ? '▲ Hide Details' : '▼ View Seats'}
                            </button>
                            {isConfirmed && (
                              <button className="mb-cancel-btn" onClick={() => setCancelModal(booking)}>
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <>
                          <div className="mb-seats-section">
                            <div className="mb-seats-title">🪑 Booked Seats</div>
                            {isSeatsLoading ? (
                              <div className="mb-seat-skeleton">
                                {[1,2,3].map(i => <div key={i} className="mb-seat-skel-chip" />)}
                              </div>
                            ) : seatItems.length === 0 ? (
                              <div style={{ fontSize:13, color:'var(--ink3)' }}>No seat data found.</div>
                            ) : (
                              <div className="mb-seats-row">
                                {seatItems.map(item => {
                                  // ✅ FIXED: use item.seat directly (not item.screeningSeats?.seat)
                                  const cat = item.seat?.seatCategory;
                                  const no  = item.seat?.seatNo;
                                  const sc  = seatColor(cat);
                                  return (
                                    <div key={item.bookingItemsId} className="mb-seat-chip"
                                      style={{ background:sc.bg, color:sc.color, borderColor:sc.bd }}>
                                      <span>💺</span>
                                      <span>{no || '—'}</span>
                                      {cat && <span className="mb-seat-cat">· {cat}</span>}
                                      {/* ✅ FIXED: use item.price directly */}
                                      <span>₹{Number(item.price||0).toFixed(0)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="mb-seats-section">
                            <div className="mb-seats-title">📋 Booking Timeline</div>
                            <div className="mb-timeline">
                              {steps.map((step, i) => (
                                <div key={i} className="mb-timeline-step">
                                  <div className={`mb-timeline-dot ${step.done ? 'done' : ''}`}>{step.icon}</div>
                                  <div className="mb-timeline-label">{step.label}</div>
                                  <div className="mb-timeline-date">{step.date}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CANCEL MODAL */}
      {cancelModal && (
        <div className="mb-overlay" onClick={closeModal}>
          <div className="mb-modal" onClick={e => e.stopPropagation()}>
            <div className="mb-modal-head">
              <div className="mb-modal-title">🗑️ Cancel Booking</div>
              <button className="mb-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="mb-modal-body">
              <div className="mb-modal-info">
                <div className="mb-modal-ref">{cancelModal.refCode}</div>
                <div className="mb-modal-sub">
                  <strong style={{ color:'var(--ink)' }}>{cancelModal.screening?.event?.title}</strong>
                  <br />Refund of <strong style={{ color:'var(--pink2)' }}>₹{cancelModal.totalCost}</strong> will be processed after approval.
                </div>
              </div>

              <label className="mb-textarea-label">Reason for Cancellation *</label>

              <select
                className="mb-select"
                value={cancelReasonSelect}
                onChange={e => {
                  setCancelReasonSelect(e.target.value);
                  if (e.target.value !== 'Other') setCancelReason(e.target.value);
                  else setCancelReason('');
                }}>
                <option value="">Select a reason...</option>
                {CANCELLATION_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {cancelReasonSelect === 'Other' && (
                <textarea
                  className="mb-textarea"
                  placeholder="Please tell us your reason..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                />
              )}
            </div>

            <div className="mb-modal-foot">
              <button className="mb-btn-ghost" onClick={closeModal}>Keep Booking</button>
              <button
                className="mb-btn-danger"
                onClick={handleCancel}
                disabled={cancelling || !cancelReason.trim()}>
                {cancelling ? '⏳ Cancelling…' : '✕ Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}