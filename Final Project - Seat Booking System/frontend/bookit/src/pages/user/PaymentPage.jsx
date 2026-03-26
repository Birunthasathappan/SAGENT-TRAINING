// ═══════════════════════════════════════════════
//  PaymentPage.jsx  —  Pink Theme
// ═══════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { paymentsAPI, bookingsAPI, screeningSeatsAPI, alertsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const S_PAY = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  .pay { --pink:#ec4899; --pink2:#db2777; --pink4:#fdf2f8; --pink5:#fff0f9; --pink-border:rgba(236,72,153,0.22); --pink-glow:rgba(236,72,153,0.18); --mauve:#c084fc; --green:#16a34a; --bg:#fff5fb; --card:#ffffff; --border:#fce7f3; --ink:#1e0a17; --ink2:#6b3a54; --ink3:#a87090; --ink4:#d4a8be; --sh:0 2px 12px rgba(236,72,153,0.10),0 0 0 1px rgba(244,114,182,0.08); font-family:'DM Sans',sans-serif; color:var(--ink); background:var(--bg); }
  .pay * { box-sizing:border-box; margin:0; padding:0; }
  .pay-main { max-width:940px; margin:0 auto; padding:calc(64px + 40px) 32px 72px; }
  .pay-steps { display:flex; align-items:center; gap:0; margin-bottom:36px; }
  .pay-step { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; position:relative; }
  .pay-step-circle { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; border:2px solid var(--border); background:var(--card); color:var(--ink3); transition:all .2s; }
  .pay-step.done .pay-step-circle { background:var(--green); border-color:var(--green); color:#fff; }
  .pay-step.active .pay-step-circle { background:linear-gradient(135deg,var(--pink),var(--mauve)); border-color:transparent; color:#fff; box-shadow:0 4px 14px var(--pink-glow); }
  .pay-step-label { font-size:11px; font-weight:600; color:var(--ink3); text-transform:uppercase; letter-spacing:.06em; }
  .pay-step.active .pay-step-label { color:var(--pink2); }
  .pay-step.done .pay-step-label { color:var(--green); }
  .pay-step-line { flex:1; height:2px; background:var(--border); margin-bottom:14px; }
  .pay-step-line.done { background:var(--green); }

  .pay-discount-banner { background:linear-gradient(135deg,#fff7ed,#fef9c3); border:2px solid #f59e0b; border-radius:18px; padding:18px 22px; display:flex; align-items:center; gap:14px; margin-bottom:28px; box-shadow:0 4px 20px rgba(245,158,11,0.15); }
  .pay-discount-tag { margin-left:auto; background:#f59e0b; color:#fff; font-family:'Playfair Display',serif; font-weight:800; font-size:18px; padding:8px 16px; border-radius:10px; white-space:nowrap; }

  .pay-grid { display:flex; gap:32px; flex-wrap:wrap; align-items:flex-start; }
  .pay-methods { flex:1; min-width:300px; }
  .pay-method-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:var(--ink); margin-bottom:20px; }
  .pay-method-list { display:flex; flex-direction:column; gap:10px; }

  .pay-mode {
    display:flex; align-items:center; gap:16px;
    padding:16px 20px; border-radius:16px;
    border:2px solid var(--border); background:var(--card);
    cursor:pointer; text-align:left; transition:all .2s;
    font-family:'DM Sans',sans-serif; width:100%;
  }
  .pay-mode:hover { border-color:var(--pink-border); background:var(--pink5); }
  .pay-mode.selected { border-color:var(--pink); background:var(--pink5); box-shadow:0 4px 16px var(--pink-glow); }
  .pay-mode-icon { font-size:24px; flex-shrink:0; }
  .pay-mode-label { font-weight:600; font-size:15px; color:var(--ink); }
  .pay-mode-desc  { font-size:12px; color:var(--ink3); margin-top:2px; }
  .pay-radio { width:18px; height:18px; border-radius:50%; border:2px solid var(--border); display:flex; align-items:center; justify-content:center; margin-left:auto; flex-shrink:0; transition:border-color .2s; }
  .pay-mode.selected .pay-radio { border-color:var(--pink); }
  .pay-radio-dot { width:8px; height:8px; border-radius:50%; background:var(--pink); }

  .pay-summary { width:320px; flex-shrink:0; }
  .pay-summary-card { background:var(--card); border:1.5px solid var(--border); border-radius:22px; padding:24px; box-shadow:var(--sh); position:relative; overflow:hidden; }
  .pay-summary-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,var(--pink),var(--mauve)); }
  .pay-summary-title { font-family:'Playfair Display',serif; font-size:18px; font-weight:800; color:var(--ink); margin-bottom:18px; }
  .pay-event-name { font-weight:700; font-size:15px; color:var(--ink); margin-bottom:6px; }
  .pay-event-meta { font-size:13px; color:var(--ink3); display:flex; flex-direction:column; gap:3px; }
  .pay-divider { height:1px; background:var(--border); margin:16px 0; }
  .pay-seat-row { display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px; }
  .pay-seat-lbl { color:var(--ink3); }
  .pay-seat-val { font-weight:600; color:var(--ink); }
  .pay-total-row { display:flex; justify-content:space-between; align-items:center; }
  .pay-total-lbl { font-weight:700; font-size:16px; color:var(--ink); }
  .pay-total-val { font-family:'Playfair Display',serif; font-size:26px; font-weight:800; color:var(--pink2); }
  .pay-discount-row { display:flex; justify-content:space-between; font-size:14px; color:var(--green); font-weight:600; margin-bottom:8px; }
  .pay-savings-box { background:rgba(22,163,74,0.09); border:1px solid rgba(22,163,74,0.22); border-radius:10px; padding:8px 12px; font-size:12px; color:var(--green); font-weight:600; text-align:center; margin-bottom:16px; }
  .pay-btn { width:100%; padding:13px; border-radius:13px; border:none; cursor:pointer; background:linear-gradient(135deg,var(--pink),var(--mauve)); color:#fff; font-size:15px; font-weight:800; font-family:'DM Sans',sans-serif; box-shadow:0 5px 18px var(--pink-glow); transition:all .22s cubic-bezier(.34,1.56,.64,1); display:flex; align-items:center; justify-content:center; gap:8px; }
  .pay-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 28px var(--pink-glow); }
  .pay-btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }
  .pay-secure { font-size:11px; color:var(--ink4); text-align:center; margin-top:10px; }
`;

const PAY_MODES = [
  { id:'UPI',         label:'UPI',                  icon:'📱', desc:'Google Pay, PhonePe, Paytm' },
  { id:'CARD',        label:'Credit / Debit Card',  icon:'💳', desc:'Visa, Mastercard, RuPay'    },
  { id:'NET_BANKING', label:'Net Banking',           icon:'🏦', desc:'All major banks'             },
  { id:'WALLET',      label:'Wallet',                icon:'👝', desc:'Paytm, Amazon Pay'           },
];

export function PaymentPage() {
  const { bookingId } = useParams();
  const { state }     = useLocation();
  const navigate      = useNavigate();
  const { user }      = useAuth();

  const [payMode, setPayMode]               = useState('UPI');
  const [loading, setLoading]               = useState(false);
  const [isFirstBooking, setIsFirstBooking] = useState(false);
  const [checkingDiscount, setCheckingDiscount] = useState(true);

  const { selectedSeats = [], totalCost = 0, screening, event, venue } = state || {};

  useEffect(() => {
    bookingsAPI.getByUser(user.userId).then(all => {
      const confirmed = all.filter(b => b.bookingStatus === 'CONFIRMED' && b.bookingId !== parseInt(bookingId));
      setIsFirstBooking(confirmed.length === 0);
    }).catch(() => setIsFirstBooking(false)).finally(() => setCheckingDiscount(false));
  }, [user.userId, bookingId]);

  const discountAmount = isFirstBooking ? totalCost * 0.25 : 0;
  const finalAmount    = totalCost - discountAmount;

  const handlePay = async () => {
    setLoading(true);
    try {
      await bookingsAPI.update(parseInt(bookingId), { user:{ userId:user.userId }, screening:{ screeningId:screening?.screeningId }, totalCost:finalAmount, discounts:discountAmount, bookingStatus:'PENDING' });
      const payment = await paymentsAPI.create({ booking:{ bookingId:parseInt(bookingId) }, payMode, amount:finalAmount, discount:discountAmount });
      await paymentsAPI.updateStatus(payment.paymentId, 'SUCCESS');
      await bookingsAPI.updateStatus(parseInt(bookingId), 'CONFIRMED');
      await Promise.all(selectedSeats.map(ss => screeningSeatsAPI.updateAvailability(ss.screeningSeatsId, 'BOOKED')));
      const discountMsg = isFirstBooking ? ` (25% First Booking Discount! Saved ₹${discountAmount.toFixed(2)})` : '';
      await alertsAPI.create({ user:{ userId:user.userId }, booking:{ bookingId:parseInt(bookingId) }, message:`Booking confirmed! ${selectedSeats.length} seat(s) for ${event?.title}.${discountMsg}`, type:'BOOKING_CONFIRMATION' });
      navigate(`/booking/confirm/${bookingId}`, { state:{ payment, selectedSeats, totalCost:finalAmount, discountAmount, isFirstBooking, screening, event, venue } });
    } catch (err) { alert('Payment failed: ' + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="pay">
      <style>{S_PAY}</style>
      <Navbar />
      <div className="pay-main">
        {/* Steps */}
        <div className="pay-steps" style={{ maxWidth:420, marginBottom:36 }}>
          {[{ n:1, label:'Seats', done:true }, { n:2, label:'Payment', active:true }, { n:3, label:'Confirm', done:false }].map((s, i, arr) => (
            <div key={s.n} style={{ display:'flex', alignItems:'center', flex:1 }}>
              <div className={`pay-step ${s.done?'done':s.active?'active':''}`} style={{ flex:'none' }}>
                <div className="pay-step-circle">{s.done ? '✓' : s.n}</div>
                <div className="pay-step-label">{s.label}</div>
              </div>
              {i < arr.length - 1 && <div className={`pay-step-line${s.done?' done':''}`} />}
            </div>
          ))}
        </div>

        {!checkingDiscount && isFirstBooking && (
          <div className="pay-discount-banner">
            <span style={{ fontSize:36 }}>🎉</span>
            <div>
              <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:16, color:'#b45309' }}>First Booking Special — 25% OFF!</div>
              <div style={{ fontSize:13, color:'#92400e', marginTop:2 }}>Welcome! You save <strong>₹{discountAmount.toFixed(2)}</strong> today!</div>
            </div>
            <div className="pay-discount-tag">25% OFF</div>
          </div>
        )}

        <div className="pay-grid">
          <div className="pay-methods">
            <div className="pay-method-title">Choose Payment Method</div>
            <div className="pay-method-list">
              {PAY_MODES.map(mode => (
                <button key={mode.id} className={`pay-mode${payMode === mode.id ? ' selected' : ''}`} onClick={() => setPayMode(mode.id)}>
                  <span className="pay-mode-icon">{mode.icon}</span>
                  <div>
                    <div className="pay-mode-label">{mode.label}</div>
                    <div className="pay-mode-desc">{mode.desc}</div>
                  </div>
                  <div className="pay-radio">{payMode === mode.id && <div className="pay-radio-dot" />}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pay-summary">
            <div className="pay-summary-card">
              <div className="pay-summary-title">Order Summary</div>
              <div className="pay-event-name">{event?.title}</div>
              <div className="pay-event-meta">
                <span>📍 {venue?.venueName}</span>
                <span>📅 {screening?.screenDate} · ⏰ {screening?.startTime}</span>
              </div>
              <div className="pay-divider" />
              {selectedSeats.map(s => (
                <div key={s.screeningSeatsId} className="pay-seat-row">
                  <span className="pay-seat-lbl">Seat {s.seat?.seatNo} <span style={{ fontSize:11 }}>({s.seat?.seatCategory})</span></span>
                  <span className="pay-seat-val">₹{s.price}</span>
                </div>
              ))}
              <div className="pay-divider" />
              <div className="pay-seat-row" style={{ marginBottom:0 }}>
                <span className="pay-seat-lbl">Subtotal</span>
                <span className="pay-seat-val">₹{Number(totalCost).toFixed(2)}</span>
              </div>
              {isFirstBooking && !checkingDiscount && (
                <div className="pay-discount-row" style={{ marginTop:8 }}>
                  <span>🎉 First Booking (25%)</span>
                  <span>− ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pay-divider" />
              <div className="pay-total-row">
                <span className="pay-total-lbl">Total</span>
                <span className="pay-total-val">₹{Number(finalAmount).toFixed(2)}</span>
              </div>
              {isFirstBooking && !checkingDiscount && (
                <div className="pay-savings-box" style={{ marginTop:12 }}>🎉 You save ₹{discountAmount.toFixed(2)} with First Booking Offer!</div>
              )}
              <button className="pay-btn" style={{ marginTop:16 }} onClick={handlePay} disabled={loading || checkingDiscount}>
                {loading ? '⏳ Processing…' : `🔒 Pay ₹${Number(finalAmount).toFixed(2)}`}
              </button>
              <div className="pay-secure">🔒 Secure Payment · Your data is encrypted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;