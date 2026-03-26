import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/common/AdminSidebar';
import { paymentsAPI } from '../../services/api';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .pp {
    --pink:        #ec4899;
    --pink2:       #db2777;
    --pink3:       #f9a8d4;
    --pink4:       #fdf2f8;
    --pink5:       #fff0f9;
    --pink-border: rgba(236,72,153,0.22);
    --pink-glow:   rgba(236,72,153,0.18);
    --mauve:       #c084fc;

    --green:       #16a34a;
    --green-bg:    rgba(22,163,74,0.09);
    --green-bd:    rgba(22,163,74,0.22);
    --amber:       #d97706;
    --amber-bg:    rgba(217,119,6,0.09);
    --amber-bd:    rgba(217,119,6,0.22);
    --red:         #dc2626;
    --red-bg:      rgba(220,38,38,0.09);
    --red-bd:      rgba(220,38,38,0.22);
    --sky:         #0ea5e9;
    --sky-bg:      rgba(14,165,233,0.09);
    --sky-bd:      rgba(14,165,233,0.22);
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

  .pp * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-main {
    flex: 1;
    margin-left: var(--sidebar-width, 240px);
    min-height: 100vh;
    background: var(--bg);
    padding: 38px 36px 64px;
    overflow-y: auto;
    position: relative;
  }

  .pp-main::before {
    content: '';
    position: fixed; top: -100px; right: -80px;
    width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  .pp-content { position: relative; z-index: 1; }

  /* ── HEADER ── */
  .pp-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; flex-wrap: wrap;
    gap: 14px; margin-bottom: 32px;
    animation: ppUp 0.4s ease both;
  }

  .pp-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 800;
    color: var(--ink); letter-spacing: -0.02em;
    display: flex; align-items: center; gap: 10px;
  }

  .pp-title-bar {
    width: 5px; height: 28px; border-radius: 3px;
    background: linear-gradient(180deg, var(--pink), var(--mauve));
    box-shadow: 0 0 10px var(--pink-glow);
  }

  .pp-sub { font-size: 13.5px; color: var(--ink3); margin-top: 6px; }

  /* Export Button */
  .pp-export-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 20px; border-radius: 12px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border: none; cursor: pointer;
    font-size: 13.5px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 16px var(--pink-glow);
    transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
  }

  .pp-export-btn:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 24px rgba(236,72,153,0.30);
  }

  /* ── STATS ── */
  .pp-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
    gap: 14px; margin-bottom: 28px;
    animation: ppUp 0.45s 0.06s ease both;
  }

  .pp-stat {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 18px; padding: 22px 20px 18px;
    position: relative; overflow: hidden;
    box-shadow: var(--sh);
    transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
  }

  .pp-stat:hover { transform: translateY(-3px); box-shadow: var(--sh-up); }

  .pp-stat-stripe {
    position: absolute; top: 0; left: 0;
    height: 3px; width: 40%;
    border-radius: 18px 0 3px 0;
    transition: width 0.3s ease;
  }

  .pp-stat:hover .pp-stat-stripe { width: 100%; }

  .pp-stat-icon { font-size: 24px; margin-bottom: 12px; }

  .pp-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 800;
    color: var(--ink); line-height: 1; margin-bottom: 4px;
  }

  .pp-stat-lbl {
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.11em; color: var(--ink3);
  }

  /* ── FILTERS ── */
  .pp-filters {
    display: flex; gap: 10px; flex-wrap: wrap;
    align-items: center; margin-bottom: 20px;
    animation: ppUp 0.45s 0.09s ease both;
  }

  .pp-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 99px; padding: 9px 16px;
    box-shadow: var(--sh); flex: 1; max-width: 300px;
    transition: border-color 0.2s;
  }

  .pp-search:focus-within { border-color: var(--pink-border); }

  .pp-search input {
    border: none; outline: none; background: transparent;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: var(--ink); width: 100%;
  }

  .pp-search input::placeholder { color: var(--ink3); }

  .pp-filter-btn {
    padding: 8px 16px; border-radius: 99px;
    border: 1.5px solid var(--border);
    background: var(--card);
    font-size: 12.5px; font-weight: 600;
    color: var(--ink2); cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }

  .pp-filter-btn:hover { border-color: var(--pink-border); color: var(--pink); }

  .pp-filter-btn.active {
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 14px var(--pink-glow);
  }

  .pp-results {
    margin-left: auto; font-size: 12.5px;
    color: var(--ink3); font-weight: 500;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── TABLE CARD ── */
  .pp-table-card {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--sh);
    overflow: hidden;
    animation: ppUp 0.45s 0.12s ease both;
  }

  .pp-table { width: 100%; border-collapse: collapse; }

  .pp-table thead tr {
    background: var(--pink4);
    border-bottom: 2px solid var(--border);
  }

  .pp-table th {
    text-align: left; padding: 13px 16px;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.13em;
    color: var(--ink3);
  }

  .pp-table th:first-child { padding-left: 22px; }

  .pp-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.13s;
  }

  .pp-table tbody tr:last-child { border-bottom: none; }
  .pp-table tbody tr:hover { background: var(--pink5); }

  .pp-table td {
    padding: 13px 16px; font-size: 13px;
    color: var(--ink); vertical-align: middle;
  }

  .pp-table td:first-child { padding-left: 22px; }

  .pp-pay-ref {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600; color: var(--pink2);
    background: var(--pink5);
    border: 1px solid var(--pink-border);
    padding: 3px 8px; border-radius: 6px;
    cursor: pointer; transition: background 0.15s;
  }

  .pp-pay-ref:hover { background: #fce7f3; }

  .pp-book-ref {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: var(--teal);
    background: rgba(13,148,136,0.08);
    border: 1px solid rgba(13,148,136,0.18);
    padding: 3px 8px; border-radius: 6px;
  }

  .pp-mode-tag {
    display: inline-block;
    padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 700;
    background: var(--pink4); color: var(--ink2);
    border: 1px solid var(--border);
    letter-spacing: 0.04em;
  }

  .pp-amount { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }

  .pp-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 11px; border-radius: 99px;
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
  }

  .pp-pill::before {
    content: ''; width: 5px; height: 5px; border-radius: 50%;
    animation: ppBlink 2.5s ease-in-out infinite;
  }

  @keyframes ppBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

  .ps-success  { background:var(--green-bg);  color:var(--green); border:1px solid var(--green-bd); }
  .ps-success::before  { background:var(--green); }
  .ps-pending  { background:var(--amber-bg);  color:var(--amber); border:1px solid var(--amber-bd); }
  .ps-pending::before  { background:var(--amber); }
  .ps-failed   { background:var(--red-bg);    color:var(--red);   border:1px solid var(--red-bd); }
  .ps-failed::before   { background:var(--red); }
  .ps-refunded { background:var(--sky-bg);    color:var(--sky);   border:1px solid var(--sky-bd); }
  .ps-refunded::before { background:var(--sky); }

  .pp-date { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink4); }

  /* Action buttons in table */
  .pp-action-row { display:flex; gap:6px; flex-wrap:wrap; }

  .pp-act-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    border: none; cursor: pointer;
    transition: all 0.18s cubic-bezier(.34,1.56,.64,1);
  }

  .pp-act-btn:hover { transform: translateY(-1px) scale(1.04); }

  .pp-act-view {
    background: var(--pink5); color: var(--pink2);
    border: 1.5px solid var(--pink-border);
  }

  .pp-act-view:hover { background: #fce7f3; box-shadow: 0 4px 12px var(--pink-glow); }

  .pp-act-success {
    background: var(--green-bg); color: var(--green);
    border: 1.5px solid var(--green-bd);
  }

  .pp-act-success:hover { background: rgba(22,163,74,0.15); }

  .pp-act-fail {
    background: var(--red-bg); color: var(--red);
    border: 1.5px solid var(--red-bd);
  }

  .pp-act-fail:hover { background: rgba(220,38,38,0.15); }

  .pp-act-refund {
    background: var(--sky-bg); color: var(--sky);
    border: 1.5px solid var(--sky-bd);
  }

  .pp-act-refund:hover { background: rgba(14,165,233,0.15); }

  /* Empty */
  .pp-empty-row td {
    text-align: center; padding: 48px !important;
    color: var(--ink3); font-size: 14px;
  }

  /* ── MODAL ── */
  .pp-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(30,10,23,0.45);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: ppFadeIn 0.2s ease both;
  }

  @keyframes ppFadeIn { from{opacity:0;} to{opacity:1;} }

  .pp-modal {
    background: var(--card);
    border-radius: 22px;
    border: 1.5px solid var(--border);
    box-shadow: 0 24px 80px rgba(236,72,153,0.18), 0 8px 24px rgba(30,10,23,0.12);
    width: 100%; max-width: 500px;
    animation: ppSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both;
    overflow: hidden;
  }

  @keyframes ppSlideUp {
    from { opacity:0; transform:translateY(28px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .pp-modal-head {
    padding: 20px 24px 16px;
    border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(135deg, var(--pink4), #fff);
  }

  .pp-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 800; color: var(--ink);
    display: flex; align-items: center; gap: 8px;
  }

  .pp-modal-close {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--pink5); border: 1.5px solid var(--pink-border);
    color: var(--pink2); font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s;
  }

  .pp-modal-close:hover { background: var(--pink3); transform: scale(1.08); }

  .pp-modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; }

  .pp-modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .pp-modal-field {
    background: var(--pink4);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 14px;
  }

  .pp-mf-lbl {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--ink3); margin-bottom: 5px;
  }

  .pp-mf-val { font-size: 14px; font-weight: 600; color: var(--ink); }

  .pp-modal-foot {
    padding: 16px 24px;
    border-top: 1.5px solid var(--border);
    display: flex; justify-content: flex-end;
    background: var(--pink4);
  }

  .pp-modal-close-btn {
    padding: 10px 24px; border-radius: 11px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border: none; cursor: pointer;
    font-size: 13.5px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }

  .pp-modal-close-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px var(--pink-glow); }

  /* ── SPINNER ── */
  .pp-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .pp-spinner {
    width:42px; height:42px;
    border:3px solid var(--pink4);
    border-top-color:var(--pink);
    border-radius:50%;
    animation:ppSpin 0.75s linear infinite;
    box-shadow:0 0 18px var(--pink-glow);
  }

  @keyframes ppSpin { to { transform:rotate(360deg); } }
  @keyframes ppUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }

  @media (max-width:768px) {
    .pp-main { padding:22px 14px 48px; }
    .pp-modal-row { grid-template-columns:1fr; }
  }
`;

const pillClass = s => ({ SUCCESS:'ps-success', PENDING:'ps-pending', FAILED:'ps-failed', REFUNDED:'ps-refunded' }[s] ?? 'ps-pending');

export default function PaymentHistoryPage() {
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState(null);

  const fetchPayments = () => paymentsAPI.getAll().then(setPayments).finally(() => setLoading(false));
  useEffect(() => { fetchPayments(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try { await paymentsAPI.updateStatus(id, status); fetchPayments(); }
    catch (err) { alert(err.message); }
  };

  /* ── EXPORT CSV ── */
  const exportCSV = () => {
    const headers = ['Ref Code','User','Booking Ref','Mode','Amount','Status','Paid At'];
    const rows = filtered.map(p => [
      p.referenceCode,
      p.booking?.user?.name || `#${p.booking?.user?.userId}`,
      p.booking?.refCode || `#${p.booking?.bookingId}`,
      p.payMode,
      Number(p.amount || 0).toFixed(2),
      p.status,
      p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '—',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = payments.filter(p => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchSearch =
      p.referenceCode?.toLowerCase().includes(search.toLowerCase()) ||
      p.booking?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.payMode?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue  = payments.filter(p => p.status === 'SUCCESS') .reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const totalRefunded = payments.filter(p => p.status === 'REFUNDED').reduce((s, p) => s + parseFloat(p.amount || 0), 0);

  return (
    <div className="pp" style={{ display:'flex', minHeight:'100vh', background:'#fff5fb' }}>
      <style>{S}</style>
      <AdminSidebar />

      <main className="pp-main">
        <div className="pp-content">

          {/* ── HEADER ── */}
          <div className="pp-header">
            <div>
              <div className="pp-title">
                <div className="pp-title-bar" />
                Payment History
              </div>
              <div className="pp-sub">{payments.length} payment transactions</div>
            </div>
            <button className="pp-export-btn" onClick={exportCSV}>
              📊 Export CSV
            </button>
          </div>

          {loading ? (
            <div className="pp-spin-wrap"><div className="pp-spinner" /></div>
          ) : (
            <>
              {/* ── STATS ── */}
              <div className="pp-stats">
                {[
                  { label:'Total Payments', value:payments.length,                                       icon:'💳', accent:'#ec4899' },
                  { label:'Revenue',        value:`₹${totalRevenue.toFixed(0)}`,                         icon:'💰', accent:'#16a34a' },
                  { label:'Refunded',       value:`₹${totalRefunded.toFixed(0)}`,                        icon:'↩️', accent:'#0ea5e9' },
                  { label:'Pending',        value:payments.filter(p => p.status==='PENDING').length,     icon:'⏳', accent:'#d97706' },
                ].map(({ label, value, icon, accent }) => (
                  <div key={label} className="pp-stat"
                    onMouseEnter={e => e.currentTarget.style.borderColor = accent+'44'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                    <div className="pp-stat-stripe" style={{ background: accent }} />
                    <div className="pp-stat-icon">{icon}</div>
                    <div className="pp-stat-val">{value}</div>
                    <div className="pp-stat-lbl">{label}</div>
                  </div>
                ))}
              </div>

              {/* ── FILTERS ── */}
              <div className="pp-filters">
                <div className="pp-search">
                  <span style={{ fontSize:15, color:'var(--ink3)' }}>🔍</span>
                  <input
                    placeholder="Search by ref, user, mode..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                {['All','SUCCESS','PENDING','FAILED','REFUNDED'].map(s => (
                  <button key={s}
                    className={`pp-filter-btn${statusFilter===s?' active':''}`}
                    onClick={() => setStatusFilter(s)}>{s}
                  </button>
                ))}
                <span className="pp-results">{filtered.length} results</span>
              </div>

              {/* ── TABLE ── */}
              <div className="pp-table-card">
                <div style={{ overflowX:'auto' }}>
                  <table className="pp-table">
                    <thead>
                      <tr>
                        <th>Ref Code</th><th>User</th><th>Booking</th>
                        <th>Mode</th><th>Amount</th><th>Status</th>
                        <th>Paid At</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr className="pp-empty-row">
                          <td colSpan={8}>🌸 No payments found</td>
                        </tr>
                      ) : filtered.map(p => (
                        <tr key={p.paymentId}>
                          <td>
                            <span className="pp-pay-ref" onClick={() => setSelected(p)}>
                              {p.referenceCode}
                            </span>
                          </td>
                          <td style={{ fontWeight:600 }}>
                            {p.booking?.user?.name || `#${p.booking?.user?.userId}`}
                          </td>
                          <td>
                            <span className="pp-book-ref">
                              {p.booking?.refCode || `#${p.booking?.bookingId}`}
                            </span>
                          </td>
                          <td><span className="pp-mode-tag">{p.payMode}</span></td>
                          <td>
                            <span className="pp-amount" style={{
                              color: p.status==='SUCCESS' ? 'var(--green)'
                                   : p.status==='REFUNDED' ? 'var(--sky)'
                                   : p.status==='FAILED'   ? 'var(--red)'
                                   : 'var(--ink)'
                            }}>
                              ₹{Number(p.amount||0).toFixed(2)}
                            </span>
                          </td>
                          <td>
                            <span className={`pp-pill ${pillClass(p.status)}`}>{p.status}</span>
                          </td>
                          <td>
                            <span className="pp-date">
                              {p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '—'}
                            </span>
                          </td>
                          <td>
                            <div className="pp-action-row">
                              {/* View Details — always */}
                              <button className="pp-act-btn pp-act-view" onClick={() => setSelected(p)}>
                                👁️
                              </button>
                              {/* PENDING actions */}
                              {p.status==='PENDING' && (<>
                                <button className="pp-act-btn pp-act-success"
                                  onClick={() => handleStatusUpdate(p.paymentId,'SUCCESS')}>✓</button>
                                <button className="pp-act-btn pp-act-fail"
                                  onClick={() => handleStatusUpdate(p.paymentId,'FAILED')}>✗</button>
                              </>)}
                              {/* SUCCESS → refund */}
                              {p.status==='SUCCESS' && (
                                <button className="pp-act-btn pp-act-refund"
                                  onClick={() => handleStatusUpdate(p.paymentId,'REFUNDED')}>↩ Refund</button>
                              )}
                            </div>
                          </td>
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

      {/* ── VIEW DETAILS MODAL ── */}
      {selected && (
        <div className="pp-overlay" onClick={e => e.target===e.currentTarget && setSelected(null)}>
          <div className="pp-modal">

            <div className="pp-modal-head">
              <div className="pp-modal-title">
                💳 Payment Details
                <span className={`pp-pill ${pillClass(selected.status)}`} style={{ fontSize:11 }}>
                  {selected.status}
                </span>
              </div>
              <button className="pp-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="pp-modal-body">

              <div className="pp-modal-row">
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">💳 Payment Ref</div>
                  <div className="pp-mf-val" style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, color:'var(--pink2)' }}>
                    {selected.referenceCode}
                  </div>
                </div>
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">🎟️ Booking Ref</div>
                  <div className="pp-mf-val" style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, color:'var(--teal)' }}>
                    {selected.booking?.refCode || `#${selected.booking?.bookingId}`}
                  </div>
                </div>
              </div>

              <div className="pp-modal-row">
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">👤 User</div>
                  <div className="pp-mf-val">
                    {selected.booking?.user?.name || `#${selected.booking?.user?.userId}`}
                  </div>
                </div>
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">📧 Email</div>
                  <div className="pp-mf-val" style={{ fontSize:13 }}>
                    {selected.booking?.user?.email || '—'}
                  </div>
                </div>
              </div>

              <div className="pp-modal-row">
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">💰 Amount</div>
                  <div className="pp-mf-val" style={{
                    fontFamily:'Playfair Display,serif',
                    fontSize:24, color:'var(--pink2)'
                  }}>
                    ₹{Number(selected.amount||0).toFixed(2)}
                  </div>
                </div>
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">🏦 Pay Mode</div>
                  <span className="pp-mode-tag" style={{ fontSize:13 }}>{selected.payMode}</span>
                </div>
              </div>

              <div className="pp-modal-row">
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">🎭 Event</div>
                  <div className="pp-mf-val" style={{ fontSize:13 }}>
                    {selected.booking?.screening?.event?.title || '—'}
                  </div>
                </div>
                <div className="pp-modal-field">
                  <div className="pp-mf-lbl">📅 Paid At</div>
                  <div className="pp-mf-val" style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12 }}>
                    {selected.paidAt
                      ? new Date(selected.paidAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
                      : '—'}
                  </div>
                </div>
              </div>

            </div>

            <div className="pp-modal-foot">
              <button className="pp-modal-close-btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}