import React, { useEffect, useState } from 'react';
import { patientAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Modal({ patient, onClose, onSave }) {
  const [form, setForm] = useState(patient || { name: '', age: '', phnNo: '', mail: '', password: '', address: '', gender: 'Male' });
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    await onSave({ ...form, age: parseInt(form.age) });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{patient ? 'Edit Patient' : 'Add New Patient'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group"><label>Full Name</label><input name="name" value={form.name} onChange={change} required /></div>
              <div className="form-group"><label>Age</label><input name="age" type="number" value={form.age} onChange={change} required /></div>
              <div className="form-group"><label>Phone Number</label><input name="phnNo" value={form.phnNo} onChange={change} /></div>
              <div className="form-group"><label>Email</label><input name="mail" type="email" value={form.mail} onChange={change} required /></div>
              <div className="form-group"><label>Password</label><input name="password" type="password" value={form.password} onChange={change} required /></div>
              <div className="form-group"><label>Gender</label><select name="gender" value={form.gender} onChange={change}><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div className="form-group full"><label>Address</label><input name="address" value={form.address} onChange={change} /></div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PatientsPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await patientAPI.getAll();

      if (isPatient) {
        // Patient — தன்னுடைய data மட்டும் காட்டு
        const myData = res.data.filter(p => p.patientId === user.id);
        setPatients(myData);
      } else {
        // Doctor — எல்லா patients data காட்டு
        setPatients(res.data);
      }
    } catch {
      setError('Could not load patients. Make sure backend is running.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (modal?.patientId) {
        await patientAPI.update(modal.patientId, data);
      } else {
        await patientAPI.create(data);
      }
      setModal(null);
      load();
    } catch { setError('Failed to save patient.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try { await patientAPI.delete(id); load(); } catch { setError('Failed to delete.'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          {isPatient ? 'My Profile' : 'Patients'}
        </div>
        <div className="page-subtitle">
          {isPatient
            ? 'உங்கள் personal health profile'
            : 'Manage all patient records and profiles'}
        </div>
      </div>

      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}

        {/* Role Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '20px', marginBottom: '16px',
          background: isDoctor ? 'rgba(124,58,237,0.15)' : 'rgba(0,212,255,0.15)',
          border: isDoctor ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(0,212,255,0.3)',
          color: isDoctor ? '#a78bfa' : 'var(--accent)',
          fontSize: '13px', fontWeight: 600
        }}>
          {isDoctor ? '🩺 Doctor View — All Patients' : '👤 Patient View — My Data Only'}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="card-title" style={{ marginBottom: 0 }}>
              👤 {isPatient ? 'My Profile' : `All Patients (${patients.length})`}
            </div>
            {/* Only Doctor can add new patients */}
            {isDoctor && (
              <button className="btn btn-primary" onClick={() => setModal('add')}>
                + Add Patient
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Loading...</div>
          ) : (
            <div className="table-wrap" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    {isDoctor && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={isDoctor ? 8 : 7}
                        style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>
                        {isPatient ? 'உங்கள் profile data கிடைக்கவில்லை.' : 'No patients found.'}
                      </td>
                    </tr>
                  ) : patients.map(p => (
                    <tr key={p.patientId}>
                      <td>#{p.patientId}</td>
                      <td style={{ color: 'var(--text)', fontWeight: 600 }}>{p.name}</td>
                      <td>{p.age}</td>
                      <td>
                        <span className={`badge ${p.gender === 'Male' ? 'badge-blue' : 'badge-orange'}`}>
                          {p.gender}
                        </span>
                      </td>
                      <td>{p.phnNo}</td>
                      <td>{p.mail}</td>
                      <td>{p.address}</td>
                      {/* Edit/Delete only for Doctor */}
                      {isDoctor && (
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.patientId)}>Delete</button>
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

        {/* Patient — Extra Info Card */}
        {isPatient && patients.length > 0 && (
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-title">📋 My Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Full Name', value: patients[0]?.name, icon: '👤' },
                { label: 'Age', value: patients[0]?.age + ' years', icon: '🎂' },
                { label: 'Gender', value: patients[0]?.gender, icon: '⚥' },
                { label: 'Phone', value: patients[0]?.phnNo, icon: '📱' },
                { label: 'Email', value: patients[0]?.mail, icon: '✉️' },
                { label: 'Address', value: patients[0]?.address, icon: '📍' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '14px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                    {item.value || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          patient={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
