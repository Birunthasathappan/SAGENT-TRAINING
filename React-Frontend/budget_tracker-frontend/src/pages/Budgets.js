import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getBudgets, addBudget, updateBudget, deleteBudget, getExpenses } from '../services/api';

const CATS = ['Food','Transport','Housing','Healthcare','Education','Entertainment','Shopping','Utilities','Other'];
const FREQS = ['Weekly','Monthly','Yearly'];

export default function Budgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bCategory:'', bAmount:'', bFreq:'' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [b, e] = await Promise.all([getBudgets(user.userId), getExpenses(user.userId)]);
      setBudgets(b.data); 
      setExpenses(e.data);
    } catch(err) { console.error('Load error:', err); }
  };
  useEffect(() => { if (user) load(); }, [user]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  
  const openAdd = () => { 
    setForm({ bCategory:'', bAmount:'', bFreq:'' }); 
    setEditId(null); 
    setShowModal(true); 
  };
  
  const openEdit = (b) => { 
    setForm({ 
      bCategory: b.bCategory, 
      bAmount: b.bAmount, 
      bFreq: b.bFreq 
    }); 
    setEditId(b.bId); 
    setShowModal(true); 
  };

  const handleSave = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    const payload = { 
      bCategory: form.bCategory,
      bAmount: parseFloat(form.bAmount),
      bFreq: form.bFreq,
      user: { userId: user.userId } 
    };
    console.log('Budget payload being sent:', payload);
    try {
      if (editId) await updateBudget(editId, payload);
      else await addBudget(payload);
      await load(); 
      setShowModal(false);
    } catch(err) { 
      console.error('Budget save error:', err.response?.data);
      alert('Error saving budget: ' + (err.response?.data || err.message)); 
    }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try { await deleteBudget(id); await load(); } 
    catch { alert('Error deleting'); }
  };

  const fmt = n => 'Rs ' + Number(n).toLocaleString('en-IN');
  const getSpent = cat => expenses
    .filter(e => e.category === cat)
    .reduce((s, e) => s + (e.eAmount || 0), 0);

  const iS = { 
    width:'100%', padding:'11px 14px', borderRadius:10, 
    border:'1.5px solid #DDE5EE', fontSize:14, background:'#F8FAFB', 
    color:'#0D1B2A', outline:'none', fontFamily:'Outfit, sans-serif', 
    boxSizing:'border-box', transition:'border-color 0.15s' 
  };
  const focus = e => e.target.style.borderColor = '#F59E0B';
  const blur = e => e.target.style.borderColor = '#DDE5EE';

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB' }}>
      <Navbar />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 28px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#0D1B2A', marginBottom:4 }}>Budgets</h1>
            <p style={{ color:'#6B7C93', fontSize:14 }}>Set spending limits per category to stay on track</p>
          </div>
          <button onClick={openAdd}
            style={{ 
              padding:'12px 22px', 
              background:'linear-gradient(135deg, #F59E0B, #D97706)', 
              color:'#fff', border:'none', borderRadius:12, fontSize:14, 
              fontWeight:700, cursor:'pointer', 
              boxShadow:'0 4px 14px rgba(245,158,11,0.35)' 
            }}
          >+ Set Budget</button>
        </div>

        {budgets.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, padding:'80px 20px', textAlign:'center', color:'#A8B6C8', border:'1px solid #DDE5EE' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>No budgets created yet</div>
            <div style={{ fontSize:14 }}>Click "+ Set Budget" to create spending limits.</div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20 }}>
            {budgets.map(b => {
              const spent = getSpent(b.bCategory);
              const pct = b.bAmount > 0 ? Math.min(100, Math.round((spent / b.bAmount) * 100)) : 0;
              const over = spent > b.bAmount;

              return (
                <div key={b.bId} style={{
                  background:'#fff', borderRadius:18, padding:'24px 26px',
                  border:'1px solid #DDE5EE', 
                  boxShadow:'0 2px 12px rgba(15,44,78,0.07)',
                  position:'relative', overflow:'hidden', 
                  transition:'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(15,44,78,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(15,44,78,0.07)'; }}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background: over ? 'linear-gradient(90deg, #EF4444, #DC2626)' : 'linear-gradient(90deg, #F59E0B, #0EA5A0)' }} />
                  
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:18, color:'#0D1B2A', marginBottom:4 }}>{b.bCategory}</div>
                      <span style={{ padding:'3px 10px', borderRadius:99, fontSize:12, fontWeight:600, background:'#FEF3C7', color:'#92400E' }}>{b.bFreq}</span>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => openEdit(b)} style={{ padding:'5px 12px', borderRadius:7, fontSize:12, fontWeight:600, background:'#FEF3C7', color:'#92400E', border:'1px solid #FCD34D', cursor:'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(b.bId)} style={{ padding:'5px 12px', borderRadius:7, fontSize:12, fontWeight:600, background:'#FEE2E2', color:'#991B1B', border:'1px solid #FCA5A5', cursor:'pointer' }}>Del</button>
                    </div>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ fontSize:14, color:'#6B7C93' }}>Spent</span>
                    <span style={{ fontWeight:700, fontSize:15, color: over ? '#EF4444' : '#0D1B2A' }}>
                      {fmt(spent)} / {fmt(b.bAmount)}
                    </span>
                  </div>

                  <div style={{ background:'#EEF2F7', borderRadius:99, height:12, overflow:'hidden', marginBottom:12 }}>
                    <div style={{
                      width: pct + '%', height:'100%', borderRadius:99,
                      background: over ? 'linear-gradient(90deg, #FCA5A5, #EF4444)' : 'linear-gradient(90deg, #0EA5A0, #3B5FC0)',
                      transition:'width 0.6s ease',
                      display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6,
                    }}>
                      {pct > 15 && <span style={{ fontSize:9, color:'#fff', fontWeight:800 }}>{pct}%</span>}
                    </div>
                  </div>

                  <div style={{ fontSize:13, fontWeight:700, color: over ? '#EF4444' : '#10B981' }}>
                    {over 
                      ? `⚠ Over budget by ${fmt(spent - b.bAmount)}` 
                      : `✓ ${fmt(b.bAmount - spent)} remaining`
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editId ? 'Edit Budget' : 'Set Budget'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Category</label>
              <select style={iS} value={form.bCategory} onChange={set('bCategory')} required onFocus={focus} onBlur={blur}>
                <option value="">Select category</option>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginTop:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Budget Amount (Rs)</label>
              <input style={iS} type="number" value={form.bAmount} onChange={set('bAmount')} placeholder="0" required onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ marginTop:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Frequency</label>
              <select style={iS} value={form.bFreq} onChange={set('bFreq')} required onFocus={focus} onBlur={blur}>
                <option value="">Select frequency</option>
                {FREQS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ flex:1, padding:'12px', border:'1.5px solid #DDE5EE', borderRadius:10, background:'transparent', color:'#6B7C93', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex:1, padding:'12px', background:'linear-gradient(135deg, #F59E0B, #D97706)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
                {loading ? 'Saving...' : 'Save Budget'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      <Chatbot />
    </div>
  );
}