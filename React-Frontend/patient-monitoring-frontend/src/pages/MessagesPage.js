import React, { useEffect, useState } from 'react';
import { messageAPI, consultationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsult, setSelectedConsult] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [m, c] = await Promise.all([messageAPI.getAll(), consultationAPI.getAll()]);
      setMessages(m.data); setConsultations(c.data);
    } catch { setError('Could not load messages.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filteredMsgs = selectedConsult
    ? messages.filter(m => m.consultation?.consultId === parseInt(selectedConsult))
    : messages;

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedConsult) return;
    try {
      await messageAPI.create({
        sender: user?.name || user?.role || 'User',
        message: newMsg,
        time: new Date().toTimeString().slice(0, 5),
        consultation: { consultId: parseInt(selectedConsult) }
      });
      setNewMsg('');
      load();
    } catch { setError('Failed to send message.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await messageAPI.delete(id); load(); } catch {}
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Messages</div>
        <div className="page-subtitle">Communication between doctors and patients</div>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="grid-2">
          <div className="card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">✉️ Messages</div>
            <div style={{ marginBottom: '12px' }}>
              <select value={selectedConsult} onChange={e => setSelectedConsult(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px' }}>
                <option value="">All Consultations</option>
                {consultations.map(c => (
                  <option key={c.consultId} value={c.consultId}>
                    Consult #{c.consultId} — {c.patient?.name} & Dr. {c.doctor?.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {loading ? <div className="loading"><div className="spinner" /></div> :
                filteredMsgs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>No messages found.</div>
                ) : filteredMsgs.map(m => (
                  <div key={m.messageId} style={{
                    background: m.sender === user?.name ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))' : 'var(--card2)',
                    border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px',
                    alignSelf: m.sender === user?.name ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>{m.sender}</span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{m.time}</span>
                        <button onClick={() => handleDelete(m.messageId)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text)' }}>{m.message}</div>
                  </div>
                ))
              }
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <input
                value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={selectedConsult ? 'Type a message...' : 'Select consultation first'}
                disabled={!selectedConsult}
                style={{ flex: 1, padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px', fontFamily: 'var(--dm)', outline: 'none' }}
              />
              <button className="btn btn-primary" onClick={sendMessage} disabled={!selectedConsult || !newMsg.trim()}>Send</button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">💬 Active Consultations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {consultations.slice(0, 8).map(c => (
                <div key={c.consultId}
                  onClick={() => setSelectedConsult(String(c.consultId))}
                  style={{
                    padding: '14px', background: selectedConsult === String(c.consultId) ? 'rgba(0,212,255,0.08)' : 'var(--bg)',
                    border: `1px solid ${selectedConsult === String(c.consultId) ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                    borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{c.patient?.name || '—'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Dr. {c.doctor?.name} · {c.date}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.remark}</div>
                </div>
              ))}
              {consultations.length === 0 && <div style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No consultations yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
