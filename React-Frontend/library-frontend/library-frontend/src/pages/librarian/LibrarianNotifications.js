import React, { useEffect, useState } from 'react';
import { getNotifications, sendNotification, getMembers } from '../../api';
import Toast from '../../components/Toast';
import '../student/Dashboard.css';

export default function LibrarianNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ memberId: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    Promise.allSettled([getNotifications(), getMembers()]).then(([n, m]) => {
      if (n.status === 'fulfilled') setNotifications(n.value.data);
      if (m.status === 'fulfilled') setMembers(m.value.data);
      setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    if (!form.memberId || !form.message) { setToast({ message: 'Select member and enter message.', type: 'error' }); return; }
    setSaving(true);
    try {
      await sendNotification(form.memberId, form.message);
      setToast({ message: 'Notification sent!', type: 'success' });
      setModal(false); setForm({ memberId: '', message: '' }); load();
    } catch { setToast({ message: 'Failed to send.', type: 'error' }); }
    setSaving(false);
  };

  return (
    <div className="dashboard fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">🔔 Notifications</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>📨 Send Notification</button>
      </div>
      <div className="card" style={{ padding: 16 }}>
        {loading ? <div className="spinner" /> : notifications.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🔕</div><p>No notifications sent yet.</p></div>
        ) : (
          notifications.map((n, i) => (
            <div key={n.id || i} style={{
              padding: '14px 16px', background: 'var(--parchment)', borderRadius: 8,
              marginBottom: 10, borderLeft: '4px solid var(--gold)',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                🔔 To: {n.memberName || n.member?.name || `Member #${n.memberId}`}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{n.message || n.content}</div>
              {n.createdAt && (
                <div style={{ fontSize: '0.78rem', color: 'var(--border)', marginTop: 6 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>📨 Send Notification</h2>
            <div className="form-group">
              <label>Select Member</label>
              <select className="form-input" value={form.memberId}
                onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))}>
                <option value="">— Choose Member —</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-input" rows="4"
                placeholder="Enter notification message..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSend} disabled={saving}>
                {saving ? 'Sending...' : '📨 Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
