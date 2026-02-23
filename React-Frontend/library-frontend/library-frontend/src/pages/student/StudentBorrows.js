// import React, { useEffect, useState } from 'react';
// import { getBorrows, returnBook } from '../../api';
// import Toast from '../../components/Toast';
// import './Dashboard.css';

// export default function StudentBorrows() {
//   const [borrows, setBorrows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);

//   const load = () => {
//     setLoading(true);
//     getBorrows()
//       .then(r => { setBorrows(r.data); setLoading(false); })
//       .catch(() => setLoading(false));
//   };

//   useEffect(() => { load(); }, []);

//   const handleReturn = async (borrowId) => {
//     try {
//       await returnBook(borrowId);
//       setToast({ message: 'Book returned successfully!', type: 'success' });
//       load();
//     } catch (e) {
//       setToast({ message: e.response?.data?.message || 'Could not return book.', type: 'error' });
//     }
//   };

//   return (
//     <div className="dashboard fade-up">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <div className="page-header">
//         <h1 className="page-title">📖 My Borrows</h1>
//       </div>
//       <div className="card table-card">
//         {loading ? <div className="spinner" /> : borrows.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">📭</div>
//             <p>No borrow records found.</p>
//           </div>
//         ) : (
//           <div className="table-wrap">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Book</th>
//                   <th>Borrow Date</th>
//                   <th>Due Date</th>
//                   <th>Return Date</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {borrows.map((b, i) => (
//                   <tr key={b.id}>
//                     <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
//                     <td><strong>{b.book?.title || '—'}</strong></td>
//                     <td>{b.issueDate ? new Date(b.issueDate).toLocaleDateString() : '—'}</td>
//                     <td>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : '—'}</td>
//                     <td>{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : '—'}</td>
//                     <td>
//                       <span className={`badge ${b.boStatus === 'RETURNED' ? 'badge-green' : 'badge-yellow'}`}>
//                         {b.boStatus === 'RETURNED' ? '✅ Returned' : '⏳ Active'}
//                       </span>
//                     </td>
//                     <td>
//                       {b.boStatus !== 'RETURNED' && (
//                         <button className="btn btn-success"
//                           style={{ padding: '6px 14px', fontSize: '0.82rem' }}
//                           onClick={() => handleReturn(b.id)}>
//                           ↩️ Return
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { getBorrowsByMember } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import './Dashboard.css';

export default function StudentBorrows() {
  const { user } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    getBorrowsByMember(user.id)
      .then(r => { setBorrows(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleReturn = async (borrowId) => {
    try {
      const { returnBook } = await import('../../api');
      await returnBook(borrowId);
      setToast({ message: 'Book returned successfully!', type: 'success' });
      load();
    } catch (e) {
      setToast({ message: e.response?.data?.message || 'Could not return book.', type: 'error' });
    }
  };

  return (
    <div className="dashboard fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">📖 My Borrows</h1>
      </div>
      <div className="card table-card">
        {loading ? <div className="spinner" /> : borrows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>You have no borrow records.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((b, i) => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td><strong>{b.book?.title || '—'}</strong></td>
                    <td>{b.issueDate ? new Date(b.issueDate).toLocaleDateString() : '—'}</td>
                    <td>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : '—'}</td>
                    <td>{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${b.boStatus === 'RETURNED' ? 'badge-green' : 'badge-yellow'}`}>
                        {b.boStatus === 'RETURNED' ? '✅ Returned' : '⏳ Active'}
                      </span>
                    </td>
                    <td>
                      {b.boStatus !== 'RETURNED' && (
                        <button className="btn btn-success"
                          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                          onClick={() => handleReturn(b.id)}>
                          ↩️ Return
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