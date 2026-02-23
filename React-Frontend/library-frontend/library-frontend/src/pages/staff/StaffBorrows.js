import React, { useEffect, useState } from 'react';
import { getBorrows } from '../../api';
import '../student/Dashboard.css';

export default function StaffBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBorrows()
      .then(r => { setBorrows(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard fade-up">
      <div className="page-header"><h1 className="page-title">🔄 All Borrows</h1></div>
      <div className="card table-card">
        {loading ? <div className="spinner" /> : borrows.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No borrow records.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Member</th><th>Book</th><th>Borrow Date</th><th>Due Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {borrows.map((b, i) => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td>{b.memberName || b.member?.name || `Member #${b.memberId}`}</td>
                    <td><strong>{b.bookTitle || b.book?.title || `Book #${b.bookId}`}</strong></td>
                    <td>{b.borrowDate ? new Date(b.borrowDate).toLocaleDateString() : '—'}</td>
                    <td>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${b.returned ? 'badge-green' : 'badge-yellow'}`}>
                        {b.returned ? '✅ Returned' : '⏳ Active'}
                      </span>
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