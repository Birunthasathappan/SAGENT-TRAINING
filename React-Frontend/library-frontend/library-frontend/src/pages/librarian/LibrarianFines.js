import React, { useEffect, useState } from 'react';
import { getFines, payFine } from '../../api';
import Toast from '../../components/Toast';
import '../student/Dashboard.css';

export default function LibrarianFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = () => getFines().then(r => { setFines(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handlePay = async (id) => {
    try { await payFine(id); setToast({ message: 'Fine marked as paid!', type: 'success' }); load(); }
    catch { setToast({ message: 'Failed.', type: 'error' }); }
  };

  const total = fines.reduce((s, f) => s + (f.amount || 0), 0);
  const unpaid = fines.filter(f => !f.paid).reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <div className="dashboard fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">💰 Fines Management</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-red" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
            Unpaid: ₹{unpaid.toFixed(2)}
          </span>
          <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
            Total: ₹{total.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="card table-card">
        {loading ? <div className="spinner" /> : fines.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🎉</div><p>No fines recorded.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>#</th><th>Member</th><th>Reason</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {fines.map((f, i) => (
                  <tr key={f.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td>{f.memberName || f.member?.name || `#${f.memberId}`}</td>
                    <td>{f.reason || 'Overdue fine'}</td>
                    <td><strong>₹{(f.amount || 0).toFixed(2)}</strong></td>
                    <td>
                      <span className={`badge ${f.paid ? 'badge-green' : 'badge-red'}`}>
                        {f.paid ? '✅ Paid' : '❌ Unpaid'}
                      </span>
                    </td>
                    <td>
                      {!f.paid && (
                        <button className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                          onClick={() => handlePay(f.id)}>💳 Mark Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
