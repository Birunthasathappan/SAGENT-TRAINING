import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Modal({ doctor, onClose, onSave }) {
  const [form, setForm] = useState(doctor || { name: '', email: '', password: '', specialization: '', contactNo: '' });
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => { e.preventDefault(); await onSave(form); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{doctor ? 'Edit Doctor' : 'Add New Doctor'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group"><label>Full Name</label><input name="name" value={form.name} onChange={change} required /></div>
              <div className="form-group"><label>Specialization</label><input name="specialization" value={form.specialization} onChange={change} required /></div>
              <div className="form-group"><label>Email</label><input name="email" type="email" value={form.email} onChange={change} required /></div>
              <div className="form-group"><label>Contact No</label><input name="contactNo" value={form.contactNo} onChange={change} /></div>
              <div className="form-group full"><label>Password</label><input name="password" type="password" value={form.password} onChange={change} required /></div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Doctor</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await doctorAPI.getAll();
      if (isDoctor) {
        // Doctor — தன்னோட record மட்டும்
        setDoctors(res.data.filter(d => d.doctorId === user.id));
      } else {
        // Patient / Admin — எல்லா doctors-உம்
        setDoctors(res.data);
      }
    } catch { setError('Could not load doctors.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (modal?.doctorId) await doctorAPI.update(modal.doctorId, data);
      else await doctorAPI.create(data);
      setModal(null); load();
    } catch { setError('Failed to save.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try { await doctorAPI.delete(id); load(); } catch { setError('Failed to delete.'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Doctors</div>
        <div className="page-subtitle">
          {isDoctor ? 'Your profile' : 'All doctors'}
        </div>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="card">
          <div className="section-header">
            <div className="card-title" style={{ marginBottom: 0 }}>
              🩺 {isDoctor ? 'My Profile' : `All Doctors (${doctors.length})`}
            </div>
            {/* Patient-க்கும் Doctor-க்கும் Add button வேண்டாம் */}
            {!isDoctor && !isPatient && (
              <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add Doctor</button>
            )}
          </div>
          {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : (
            <div className="table-wrap" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Email</th><th>Contact</th>
                  {/* Patient-க்கும் Doctor-க்கும் Actions column வேண்டாம் */}
                  {!isPatient && !isDoctor && <th>Actions</th>}
                  {isDoctor && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {doctors.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>No data found.</td></tr>
                  ) : doctors.map(d => (
                    <tr key={d.doctorId}>
                      <td>#{d.doctorId}</td>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>Dr. {d.name}</td>
                      <td><span className="badge badge-purple" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>{d.specialization}</span></td>
                      <td>{d.email}</td>
                      <td>{d.contactNo}</td>
                      {/* Doctor — Edit மட்டும் (தன்னோட record) */}
                      {isDoctor && (
                        <td>
                          <button className="btn btn-ghost btn-sm" onClick={() => setModal(d)}>Edit</button>
                        </td>
                      )}
                      {/* Admin — Edit + Delete */}
                      {!isDoctor && !isPatient && (
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal(d)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.doctorId)}>Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {modal && <Modal doctor={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </>
  );
}