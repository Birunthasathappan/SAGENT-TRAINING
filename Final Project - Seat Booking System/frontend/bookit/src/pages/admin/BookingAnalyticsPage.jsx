import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/common/AdminSidebar';
import { bookingsAPI, paymentsAPI, eventsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .ap {
    --pink:#ec4899; --pink2:#db2777; --pink3:#f9a8d4;
    --pink4:#fdf2f8; --pink5:#fff0f9;
    --pink-border:rgba(236,72,153,0.22);
    --pink-glow:rgba(236,72,153,0.18);
    --mauve:#c084fc;
    --green:#16a34a; --green-bg:rgba(22,163,74,0.09); --green-bd:rgba(22,163,74,0.22);
    --amber:#d97706; --amber-bg:rgba(217,119,6,0.09); --amber-bd:rgba(217,119,6,0.22);
    --red:#dc2626; --red-bg:rgba(220,38,38,0.09); --red-bd:rgba(220,38,38,0.22);
    --sky:#0ea5e9; --teal:#0d9488;
    --bg:#fff5fb; --card:#ffffff; --card2:#faf7f4; --border:#fce7f3;
    --ink:#1e0a17; --ink2:#6b3a54; --ink3:#a87090; --ink4:#d4a8be;
    --sh:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07);
    --sh-up:0 12px 36px rgba(236,72,153,0.14),0 4px 12px rgba(30,10,23,0.06);
    font-family:'DM Sans',sans-serif; color:var(--ink); background:#fff5fb;
  }
  .ap * { box-sizing:border-box; margin:0; padding:0; }
  .ap-main { flex:1; margin-left:var(--sidebar-width,240px); min-height:100vh; background:#fff5fb !important; padding:38px 36px 64px; overflow-y:auto; position:relative; }
  .ap-main::before { content:''; position:fixed; top:-100px; right:-80px; width:420px; height:420px; border-radius:50%; background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%); pointer-events:none; z-index:0; }
  .ap-content { position:relative; z-index:1; }
  .ap-header { margin-bottom:30px; animation:apUp 0.4s ease both; }
  .ap-title { font-family:'Playfair Display',serif !important; font-size:28px; font-weight:800; color:#1e0a17; letter-spacing:-0.02em; display:flex; align-items:center; gap:10px; }
  .ap-title-bar { width:5px; height:28px; border-radius:3px; flex-shrink:0; background:linear-gradient(180deg,#ec4899,#c084fc); box-shadow:0 0 10px rgba(236,72,153,0.18); }
  .ap-sub { font-size:13.5px; color:#a87090; margin-top:6px; }
  .ap-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:14px; margin-bottom:24px; animation:apUp 0.45s 0.06s ease both; }
  .ap-stat { background:#ffffff; border:1.5px solid #fce7f3; border-radius:18px; padding:22px 20px 18px; position:relative; overflow:hidden; box-shadow:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07); transition:transform 0.22s cubic-bezier(.34,1.56,.64,1),box-shadow 0.2s; }
  .ap-stat:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(236,72,153,0.14),0 4px 12px rgba(30,10,23,0.06); }
  .ap-stat-stripe { position:absolute; top:0; left:0; height:3px; width:40%; border-radius:18px 0 3px 0; transition:width 0.3s ease; }
  .ap-stat:hover .ap-stat-stripe { width:100%; }
  .ap-stat-icon { font-size:24px; margin-bottom:12px; }
  .ap-stat-val { font-family:'Playfair Display',serif !important; font-size:32px; font-weight:800; color:#1e0a17; line-height:1; margin-bottom:4px; }
  .ap-stat-lbl { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.11em; color:#a87090; }
  .ap-charts-row { display:grid; grid-template-columns:1fr 1fr 280px; gap:18px; margin-bottom:22px; animation:apUp 0.45s 0.09s ease both; }
  .ap-card { background:#ffffff; border:1.5px solid #fce7f3; border-radius:20px; padding:24px 22px; box-shadow:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07); position:relative; overflow:hidden; }
  .ap-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#ec4899 0%,#c084fc 60%,transparent 100%); }
  .ap-card-title { font-family:'Playfair Display',serif !important; font-size:17px; font-weight:800; color:#1e0a17; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
  .ap-card-title-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; background:#ec4899; box-shadow:0 0 0 3px rgba(236,72,153,0.15); }
  .ap-bar-chart { display:flex; flex-direction:column; gap:14px; }
  .ap-bar-row { display:flex; flex-direction:column; gap:6px; }
  .ap-bar-meta { display:flex; justify-content:space-between; align-items:center; }
  .ap-bar-label { font-size:13px; color:#6b3a54; font-weight:500; }
  .ap-bar-val { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; }
  .ap-bar-track { height:10px; background:#fdf2f8; border-radius:99px; overflow:hidden; border:1px solid #fce7f3; }
  .ap-bar-fill { height:100%; border-radius:99px; transition:width 1s cubic-bezier(.4,0,.2,1); }
  .ap-pie-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; }
  .ap-pie-svg { filter:drop-shadow(0 4px 12px rgba(236,72,153,0.15)); }
  .ap-pie-legend { display:flex; flex-direction:column; gap:8px; width:100%; }
  .ap-pie-leg-item { display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:600; color:#6b3a54; }
  .ap-pie-leg-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .ap-pie-leg-count { margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; color:#1e0a17; }
  .ap-top-events { display:flex; flex-direction:column; gap:10px; }
  .ap-top-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; background:#fdf2f8; border:1px solid #fce7f3; transition:background 0.15s; }
  .ap-top-item:hover { background:#fce7f3; }
  .ap-top-rank { width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; flex-shrink:0; }
  .ap-top-name { flex:1; font-weight:600; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#1e0a17; }
  .ap-top-count { font-family:'JetBrains Mono',monospace; font-size:11.5px; font-weight:700; color:#db2777; background:#fff0f9; border:1px solid rgba(236,72,153,0.22); padding:2px 8px; border-radius:99px; flex-shrink:0; }
  .ap-table-card { background:#ffffff; border:1.5px solid #fce7f3; border-radius:20px; box-shadow:0 1px 4px rgba(30,10,23,0.06),0 0 0 1px rgba(244,114,182,0.07); overflow:hidden; animation:apUp 0.45s 0.13s ease both; }
  .ap-table-head { padding:18px 22px 14px; border-bottom:1.5px solid #fce7f3; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; background:#fdf2f8; }
  .ap-table-title { font-family:'Playfair Display',serif !important; font-size:17px; font-weight:800; color:#1e0a17; display:flex; align-items:center; gap:8px; }
  .ap-table-controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .ap-search { display:flex; align-items:center; gap:8px; background:#ffffff; border:1.5px solid #fce7f3; border-radius:99px; padding:8px 14px; box-shadow:0 1px 4px rgba(30,10,23,0.06); max-width:240px; transition:border-color 0.2s; }
  .ap-search:focus-within { border-color:rgba(236,72,153,0.22); }
  .ap-search input { border:none; outline:none; background:transparent; font-size:13px; font-family:'DM Sans',sans-serif; color:#1e0a17; width:100%; }
  .ap-search input::placeholder { color:#a87090; }
  .ap-select { padding:8px 14px; border-radius:11px; border:1.5px solid #fce7f3; background:#ffffff; font-size:13px; font-family:'DM Sans',sans-serif; color:#1e0a17; outline:none; cursor:pointer; transition:border-color 0.2s; }
  .ap-select:focus { border-color:rgba(236,72,153,0.22); }
  .ap-table { width:100%; border-collapse:collapse; }
  .ap-table thead tr { border-bottom:2px solid #fce7f3; background:#fdf2f8; }
  .ap-table th { text-align:left; padding:11px 16px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.13em; color:#d4a8be; }
  .ap-table th:first-child { padding-left:22px; }
  .ap-table tbody tr { border-bottom:1px solid #fce7f3; transition:background 0.13s; }
  .ap-table tbody tr:last-child { border-bottom:none; }
  .ap-table tbody tr:hover { background:#fff0f9; }
  .ap-table td { padding:12px 16px; font-size:13px; color:#1e0a17; vertical-align:middle; }
  .ap-table td:first-child { padding-left:22px; }
  .ap-ref { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; color:#0d9488; background:rgba(13,148,136,0.08); border:1px solid rgba(13,148,136,0.18); padding:3px 8px; border-radius:6px; }
  .ap-amt { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; color:#db2777; }
  .ap-date { font-family:'JetBrains Mono',monospace; font-size:11px; color:#d4a8be; }
  .ap-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 11px; border-radius:99px; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; }
  .ap-pill::before { content:''; width:5px; height:5px; border-radius:50%; animation:apBlink 2.5s ease-in-out infinite; }
  @keyframes apBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
  .bs-confirmed { background:rgba(22,163,74,0.09); color:#16a34a; border:1px solid rgba(22,163,74,0.22); }
  .bs-confirmed::before { background:#16a34a; }
  .bs-pending { background:rgba(217,119,6,0.09); color:#d97706; border:1px solid rgba(217,119,6,0.22); }
  .bs-pending::before { background:#d97706; }
  .bs-cancelled { background:rgba(220,38,38,0.09); color:#dc2626; border:1px solid rgba(220,38,38,0.22); }
  .bs-cancelled::before { background:#dc2626; }
  .ap-empty-row td { text-align:center; padding:48px!important; color:#a87090; font-size:14px; }
  .ap-no-data { text-align:center; color:#a87090; font-size:13px; padding:20px 0; margin:0; }
  .ap-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .ap-spinner { width:42px; height:42px; border:3px solid #fdf2f8; border-top-color:#ec4899; border-radius:50%; animation:apSpin 0.75s linear infinite; box-shadow:0 0 18px rgba(236,72,153,0.18); }
  @keyframes apSpin { to { transform:rotate(360deg); } }
  @keyframes apUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @media (max-width:1100px) { .ap-charts-row { grid-template-columns:1fr 1fr; } .ap-charts-row .ap-card:last-child { grid-column:1/-1; } }
  @media (max-width:768px) { .ap-main { padding:22px 14px 48px; } .ap-charts-row { grid-template-columns:1fr; } }
`;

function PieChart({ data }) {
  const size = 160; const r = 60; const cx = size / 2; const cy = size / 2;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) {
    return (
      <div className="ap-pie-wrap">
        <svg width={size} height={size} className="ap-pie-svg">
          <circle cx={cx} cy={cy} r={r} fill="#fdf2f8" stroke="#fce7f3" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={r * 0.45} fill="white" />
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fill="#a87090" fontFamily="DM Sans,sans-serif" fontWeight="600">No Data</text>
        </svg>
        <p className="ap-no-data">No booking data yet 🌸</p>
      </div>
    );
  }
  let angle = -Math.PI / 2;
  const slices = data.filter(d => d.value > 0).map(d => {
    const ratio = d.value / total; const start = angle;
    angle += ratio * 2 * Math.PI;
    return { ...d, start, end: angle, ratio };
  });
  const arc = (s, e) => {
    if (Math.abs(e - s) >= 2 * Math.PI - 0.001) return `M${cx},${cy - r} A${r},${r},0,1,1,${cx - 0.001},${cy - r} Z`;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    return `M${cx},${cy} L${x1},${y1} A${r},${r},0,${e - s > Math.PI ? 1 : 0},1,${x2},${y2} Z`;
  };
  return (
    <div className="ap-pie-wrap">
      <svg width={size} height={size} className="ap-pie-svg">
        {slices.map((s, i) => <path key={i} d={arc(s.start, s.end)} fill={s.color} opacity={0.9}><title>{s.label}: {s.value}</title></path>)}
        <circle cx={cx} cy={cy} r={r * 0.45} fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e0a17" fontFamily="Playfair Display,serif">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#a87090" fontFamily="DM Sans,sans-serif" fontWeight="700">TOTAL</text>
      </svg>
      <div className="ap-pie-legend">
        {slices.map((s, i) => (
          <div key={i} className="ap-pie-leg-item">
            <div className="ap-pie-leg-dot" style={{ background: s.color }} />
            {s.label}
            <span className="ap-pie-leg-count">{s.value} ({Math.round(s.ratio * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, maxVal }) {
  return (
    <div className="ap-bar-chart">
      {data.map(({ label, value, color, formatted }) => (
        <div key={label} className="ap-bar-row">
          <div className="ap-bar-meta">
            <span className="ap-bar-label">{label}</span>
            <span className="ap-bar-val" style={{ color }}>{formatted}</span>
          </div>
          <div className="ap-bar-track">
            <div className="ap-bar-fill" style={{ width: maxVal > 0 ? `${Math.min((value / maxVal) * 100, 100)}%` : '0%', background: `linear-gradient(90deg,${color},${color}88)` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const pillClass = s => ({ CONFIRMED:'bs-confirmed', PENDING:'bs-pending', CANCELLED:'bs-cancelled' }[s] ?? 'bs-pending');
const rankColors = ['#ec4899', '#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981'];

export default function BookingAnalyticsPage() {
  const { user } = useAuth();
  const [bookings, setBookings]         = useState([]);
  const [payments, setPayments]         = useState([]);
  const [events, setEvents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]             = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ FIXED — Both ADMIN & ORGANIZER use getAll()
        // No more getByOrganizer filter — all data show aagum
        const [allBookings, allPayments, allEvents] = await Promise.all([
          bookingsAPI.getAll(),
          paymentsAPI.getAll(),
          eventsAPI.getAll(),
        ]);
        setBookings(allBookings);
        setPayments(allPayments);
        setEvents(allEvents);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const revenue    = payments.filter(p => p.status === 'SUCCESS') .reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const refunded   = payments.filter(p => p.status === 'REFUNDED').reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const pendingAmt = payments.filter(p => p.status === 'PENDING') .reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const confirmed  = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
  const cancelled  = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;
  const pending    = bookings.filter(b => b.bookingStatus === 'PENDING').length;

  const eventBookingCount = {};
  bookings.forEach(b => {
    const id = b.screening?.event?.eventId;
    if (id) eventBookingCount[id] = (eventBookingCount[id] || 0) + 1;
  });
  const topEvents = Object.entries(eventBookingCount)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, count]) => ({ event: events.find(e => e.eventId === parseInt(id)), count }));

  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    const matchSearch =
      b.refCode?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.screening?.event?.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const barMax  = Math.max(revenue, refunded, pendingAmt, 1);
  const barData = [
    { label:'Successful Payments', value:revenue,    color:'#16a34a', formatted:`₹${revenue.toFixed(2)}`    },
    { label:'Refunded',            value:refunded,   color:'#0ea5e9', formatted:`₹${refunded.toFixed(2)}`   },
    { label:'Pending',             value:pendingAmt, color:'#d97706', formatted:`₹${pendingAmt.toFixed(2)}` },
  ];
  const pieData = [
    { label:'Confirmed', value:confirmed, color:'#16a34a' },
    { label:'Pending',   value:pending,   color:'#f59e0b' },
    { label:'Cancelled', value:cancelled, color:'#ec4899' },
  ];

  return (
    <div className="ap" style={{ display:'flex', minHeight:'100vh', background:'#fff5fb' }}>
      <style>{S}</style>
      <AdminSidebar />
      <main className="ap-main">
        <div className="ap-content">
          <div className="ap-header">
            <div className="ap-title"><div className="ap-title-bar"/>Booking Analytics</div>
            <div className="ap-sub">Track bookings, revenue, and occupancy</div>
          </div>

          {loading ? (
            <div className="ap-spin-wrap"><div className="ap-spinner"/></div>
          ) : (
            <>
              <div className="ap-stats">
                {[
                  { label:'Total Bookings', value:bookings.length,          icon:'🎟️', accent:'#ec4899' },
                  { label:'Confirmed',      value:confirmed,                icon:'✅', accent:'#16a34a' },
                  { label:'Pending',        value:pending,                  icon:'⏳', accent:'#d97706' },
                  { label:'Cancelled',      value:cancelled,                icon:'❌', accent:'#dc2626' },
                  { label:'Total Revenue',  value:`₹${revenue.toFixed(0)}`, icon:'💰', accent:'#ec4899' },
                ].map(({ label, value, icon, accent }) => (
                  <div key={label} className="ap-stat"
                    onMouseEnter={e => e.currentTarget.style.borderColor = accent + '44'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                    <div className="ap-stat-stripe" style={{ background: accent }}/>
                    <div className="ap-stat-icon">{icon}</div>
                    <div className="ap-stat-val">{value}</div>
                    <div className="ap-stat-lbl">{label}</div>
                  </div>
                ))}
              </div>

              <div className="ap-charts-row">
                <div className="ap-card">
                  <div className="ap-card-title"><div className="ap-card-title-dot"/>Revenue Breakdown</div>
                  <BarChart data={barData} maxVal={barMax}/>
                </div>
                <div className="ap-card">
                  <div className="ap-card-title"><div className="ap-card-title-dot"/>Booking Status</div>
                  <PieChart data={pieData}/>
                </div>
                <div className="ap-card">
                  <div className="ap-card-title"><div className="ap-card-title-dot"/>Top Events</div>
                  {topEvents.length === 0 ? (
                    <p className="ap-no-data">No data yet 🌸</p>
                  ) : (
                    <div className="ap-top-events">
                      {topEvents.map(({ event, count }, i) => (
                        <div key={i} className="ap-top-item">
                          <div className="ap-top-rank" style={{ background:rankColors[i]+'20', color:rankColors[i] }}>{i+1}</div>
                          <div className="ap-top-name">{event?.title || 'Unknown'}</div>
                          <span className="ap-top-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="ap-table-card">
                <div className="ap-table-head">
                  <div className="ap-table-title"><div className="ap-card-title-dot"/>All Bookings</div>
                  <div className="ap-table-controls">
                    <div className="ap-search">
                      <span style={{ fontSize:15, color:'#a87090' }}>🔍</span>
                      <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
                    </div>
                    <select className="ap-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                      {['All','CONFIRMED','PENDING','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table className="ap-table">
                    <thead>
                      <tr>
                        <th>Ref Code</th><th>User</th><th>Event</th>
                        <th>Date</th><th>Amount</th><th>Status</th><th>Booked At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr className="ap-empty-row"><td colSpan={7}>🌸 No bookings found</td></tr>
                      ) : filtered.map(b => (
                        <tr key={b.bookingId}>
                          <td><span className="ap-ref">{b.refCode}</span></td>
                          <td style={{ fontWeight:600 }}>{b.user?.name || `#${b.user?.userId}`}</td>
                          <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#6b3a54' }}>
                            {b.screening?.event?.title || '—'}
                          </td>
                          <td><span className="ap-date">{b.screening?.screenDate || '—'}</span></td>
                          <td><span className="ap-amt">₹{Number(b.totalCost||0).toFixed(2)}</span></td>
                          <td><span className={`ap-pill ${pillClass(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                          <td><span className="ap-date">{b.bookedAt ? new Date(b.bookedAt).toLocaleDateString('en-IN') : '—'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}