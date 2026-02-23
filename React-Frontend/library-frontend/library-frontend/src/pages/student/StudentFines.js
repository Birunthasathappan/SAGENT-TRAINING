import React, { useEffect, useState } from 'react';
import { getFines, payFine } from '../../api';
import Toast from '../../components/Toast';
import './Dashboard.css';

export default function StudentFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = () => {
    getFines()
      .then(r => { setFines(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (fineId) => {
    try {
      await payFine(fineId);
      setToast({ message: 'Fine paid successfully!', type: 'success' });
      load();
    } catch {
      setToast({ message: 'Could not process payment.', type: 'error' });
    }
  };

  const unpaidTotal = fines.filter(f => !f.paid).reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <div className="dashboard fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">💰 My Fines</h1>
        {unpaidTotal > 0 && (
          <div className="badge badge-red" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            Total Due: ₹{unpaidTotal.toFixed(2)}
          </div>
        )}
      </div>
      <div className="card table-card">
        {loading ? <div className="spinner" /> : fines.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <p>No fines! You're all clear.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Reason</th><th>Amount</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {fines.map((f, i) => (
                  <tr key={f.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td>{f.reason || 'Overdue fine'}</td>
                    <td><strong>₹{(f.amount || 0).toFixed(2)}</strong></td>
                    <td>
                      <span className={`badge ${f.paid ? 'badge-green' : 'badge-red'}`}>
                        {f.paid ? '✅ Paid' : '❌ Unpaid'}
                      </span>
                    </td>
                    <td>
                      {!f.paid && (
                        <button className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                          onClick={() => handlePay(f.id)}>
                          💳 Pay Now
                        </button>
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