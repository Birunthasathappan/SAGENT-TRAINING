import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../services/api';

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ goalName:'', totalAmount:'', savedAmount:'', deadline:'' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => getGoals(user.userId)
    .then(r => {
      console.log('Goals data:', r.data);
      setGoals(r.data);
    })
    .catch(err => console.error('Load error:', err));

  useEffect(() => { if (user) load(); }, [user]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setForm({ goalName:'', totalAmount:'', savedAmount:'0', deadline:'' });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = g => {
    setForm({
      goalName: g.goalName,
      totalAmount: g.totalAmount,
      savedAmount: g.savedAmount,
      deadline: g.deadline
    });
    setEditId(g.gId);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      goalName: form.goalName,
      totalAmount: parseFloat(form.totalAmount),
      savedAmount: parseFloat(form.savedAmount || 0),
      deadline: form.deadline,
      user: { userId: user.userId }
    };
    console.log('Goal payload:', payload);
    try {
      if (editId) await updateGoal(editId, payload);
      else await addGoal(payload);
      await load();
      setShowModal(false);
    } catch(err) {
      console.error('Save error:', err.response?.data || err.message);
      alert('Error saving goal: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    console.log('Deleting goal id:', id);
    if (!id) { alert('Missing goal ID'); return; }
    if (!window.confirm('Delete this goal?')) return;
    try {
      await deleteGoal(id);
      await load();
    } catch(err) {
      console.error('Delete error:', err.response?.data || err.message);
      alert('Error deleting: ' + (err.response?.data || err.message));
    }
  };

  const fmt = n => 'Rs ' + Number(n).toLocaleString('en-IN');
  const daysLeft = d => d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null;

  const iS = {
    width:'100%', padding:'11px 14px', borderRadius:10,
    border:'1.5px solid #DDE5EE', fontSize:14, background:'#F8FAFB',
    color:'#0D1B2A', outline:'none', fontFamily:'Outfit, sans-serif',
    boxSizing:'border-box', transition:'border-color 0.15s'
  };
  const focus = e => e.target.style.borderColor = '#3B5FC0';
  const blur  = e => e.target.style.borderColor = '#DDE5EE';

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB' }}>
      <Navbar />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 28px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#0D1B2A', marginBottom:4 }}>Savings Goals</h1>
            <p style={{ color:'#6B7C93', fontSize:14 }}>Set targets and track your progress toward financial freedom</p>
          </div>
          <button onClick={openAdd}
            style={{ padding:'12px 22px', background:'linear-gradient(135deg, #3B5FC0, #2D4DAA)', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(59,95,192,0.35)', transition:'all 0.15s' }}
            onMouseEnter={e => e.target.style.transform='translateY(-1px)'}
            onMouseLeave={e => e.target.style.transform='translateY(0)'}
          >+ New Goal</button>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, padding:'80px 20px', textAlign:'center', color:'#A8B6C8', border:'1px solid #DDE5EE' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎯</div>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>No goals set yet</div>
            <div style={{ fontSize:14 }}>Click "+ New Goal" to start tracking your savings milestones.</div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(330px, 1fr))', gap:20 }}>
            {goals.map(g => {
              const pct  = Math.min(100, Math.round((g.savedAmount / g.totalAmount) * 100));
              const days = daysLeft(g.deadline);
              const done = pct >= 100;
              const circ = 2 * Math.PI * 42;

              return (
                <div key={g.gId}
                  style={{ background:'#fff', borderRadius:20, padding:'28px', border:'1px solid #DDE5EE', boxShadow:'0 2px 12px rgba(15,44,78,0.07)', transition:'transform 0.2s, box-shadow 0.2s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(15,44,78,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 2px 12px rgba(15,44,78,0.07)'; }}
                >
                  {/* Top color bar */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg, #3B5FC0, #0EA5A0)' }} />

                  {/* Title + Ring */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>{done ? '🏆' : '🎯'}</div>
                      <div style={{ fontWeight:800, fontSize:18, color:'#0D1B2A', marginBottom:4 }}>{g.goalName}</div>
                      {days !== null && (
                        <div style={{ fontSize:12, fontWeight:600, color: days<0?'#EF4444': days<7?'#F59E0B':'#6B7C93' }}>
                          {days < 0 ? `${Math.abs(days)}d past deadline` : days === 0 ? '📅 Due today!' : `${days} days left`}
                        </div>
                      )}
                    </div>

                    {/* SVG Ring */}
                    <div style={{ position:'relative', flexShrink:0, marginLeft:12 }}>
                      <svg width="96" height="96" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="42" fill="none" stroke="#EEF2F7" strokeWidth="8" />
                        <circle cx="48" cy="48" r="42" fill="none"
                          stroke={done ? '#10B981' : '#3B5FC0'}
                          strokeWidth="8"
                          strokeDasharray={circ}
                          strokeDashoffset={circ * (1 - pct / 100)}
                          strokeLinecap="round"
                          transform="rotate(-90 48 48)"
                          style={{ transition:'stroke-dashoffset 0.8s ease' }}
                        />
                        <text x="48" y="45" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0D1B2A" fontFamily="Outfit">{pct}%</text>
                        <text x="48" y="60" textAnchor="middle" fontSize="9" fill="#A8B6C8" fontFamily="Outfit">complete</text>
                      </svg>
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div style={{ background:'#F8FAFB', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:13, color:'#6B7C93' }}>Saved</span>
                      <span style={{ fontWeight:700, fontSize:14, color: done?'#10B981':'#3B5FC0' }}>{fmt(g.savedAmount)}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:13, color:'#6B7C93' }}>Target</span>
                      <span style={{ fontWeight:700, fontSize:14, color:'#0D1B2A' }}>{fmt(g.totalAmount)}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:13, color:'#6B7C93' }}>Remaining</span>
                      <span style={{ fontWeight:700, fontSize:14, color:'#6B7C93' }}>{fmt(Math.max(0, g.totalAmount - g.savedAmount))}</span>
                    </div>
                  </div>

                  {/* Goal Achieved Banner */}
                  {done && (
                    <div style={{ textAlign:'center', padding:'8px', background:'#D1FAE5', borderRadius:8, fontSize:13, fontWeight:700, color:'#065F46', marginBottom:14 }}>
                      🎉 Goal Achieved!
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => openEdit(g)}
                      style={{ flex:1, padding:'8px', borderRadius:8, fontSize:13, fontWeight:700, background:'#EEF2F7', color:'#334E68', border:'none', cursor:'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(g.gId)}
                      style={{ flex:1, padding:'8px', borderRadius:8, fontSize:13, fontWeight:700, background:'#FEE2E2', color:'#991B1B', border:'none', cursor:'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editId ? 'Edit Goal' : 'New Savings Goal'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Goal Name</label>
            <input style={iS} value={form.goalName} onChange={set('goalName')} placeholder="e.g. Emergency Fund" required onFocus={focus} onBlur={blur} />

            <div style={{ marginTop:14, display:'flex', gap:14 }}>
              <div style={{ flex:1 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Target Amount (Rs)</label>
                <input style={iS} type="number" value={form.totalAmount} onChange={set('totalAmount')} placeholder="0" required onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Saved So Far (Rs)</label>
                <input style={iS} type="number" value={form.savedAmount} onChange={set('savedAmount')} placeholder="0" onFocus={focus} onBlur={blur} />
              </div>
            </div>

            <div style={{ marginTop:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Deadline</label>
              <input style={iS} type="date" value={form.deadline} onChange={set('deadline')} required onFocus={focus} onBlur={blur} />
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ flex:1, padding:'12px', border:'1.5px solid #DDE5EE', borderRadius:10, background:'transparent', color:'#6B7C93', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex:1, padding:'12px', background:'linear-gradient(135deg, #3B5FC0, #2D4DAA)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
                {loading ? 'Saving...' : 'Save Goal'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      <Chatbot />
    </div>
  );
}