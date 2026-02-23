import React, { useEffect, useState } from 'react';
import { appointmentAPI, patientAPI, doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Modal({ appt, patients, doctors, onClose, onSave, isDoctor }) {
  const [form, setForm] = useState(appt ? {
    appointDate: appt.appointDate, status: appt.status,
    doctor: { doctorId: appt.doctor?.doctorId },
    patient: { patientId: appt.patient?.patientId }
  } : { appointDate: '', status: 'Scheduled', doctor: { doctorId: '' }, patient: { patientId: '' } });

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const changeNested = (parent, key, val) =>
    setForm(f => ({ ...f, [parent]: { ...f[parent], [key]: val } }));
  const submit = async (e) => { e.preventDefault(); await onSave(form); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{appt ? 'Edit Appointment' : 'New Appointment'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              {isDoctor && (
                <div className="form-group">
                  <label>Patient</label>
                  <select value={form.patient.patientId}
                    onChange={e => changeNested('patient', 'patientId', parseInt(e.target.value))} required>
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Doctor</label>
                <select value={form.doctor.doctorId}
                  onChange={e => changeNested('doctor', 'doctorId', parseInt(e.target.value))} required>
                  <option value="">Select doctor</option>
                  {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>Dr. {d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input name="appointDate" type="date" value={form.appointDate} onChange={change} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={change}>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const statusBadge = (s) => {
  if (s === 'Completed') return 'badge-green';
  if (s === 'Cancelled') return 'badge-red';
  return 'badge-blue';
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const [appts, setAppts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [a, p, d] = await Promise.all([
        appointmentAPI.getAll(), patientAPI.getAll(), doctorAPI.getAll()
      ]);

      if (isPatient) {
        const myAppts = a.data.filter(ap => ap.patient?.patientId === user.id);
        setAppts(myAppts);
      } else {
        setAppts(a.data);
      }

      setPatients(p.data);
      setDoctors(d.data);
    } catch { setError('Could not load data.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    const saveData = isPatient
      ? { ...data, patient: { patientId: user.id } }
      : data;
    try {
      if (modal?.appointId) await appointmentAPI.update(modal.appointId, saveData);
      else await appointmentAPI.create(saveData);
      setModal(null); load();
    } catch { setError('Failed to save.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await appointmentAPI.delete(id); load(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Appointments</div>
        <div className="page-subtitle">
          {isPatient ? 'Your scheduled appointments' : 'Schedule and track all patient appointments'}
        </div>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '20px', marginBottom: '16px',
          background: isDoctor ? 'rgba(124,58,237,0.15)' : 'rgba(0,212,255,0.15)',
          border: isDoctor ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(0,212,255,0.3)',
          color: isDoctor ? '#a78bfa' : 'var(--accent)', fontSize: '13px', fontWeight: 600
        }}>
          {isDoctor ? '🩺 Doctor View — All Appointments' : '👤 Patient View — My Appointments Only'}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="card-title" style={{ marginBottom: 0 }}>
              📅 {isPatient ? 'My Appointments' : 'All Appointments'} ({appts.length})
            </div>
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              + New Appointment
            </button>
          </div>

          {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : (
            <div className="table-wrap" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    {isDoctor && <th>Patient</th>}
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>
                        {isPatient ? 'No appointments found for you.' : 'No appointments yet.'}
                      </td>
                    </tr>
                  ) : appts.map(a => (
                    <tr key={a.appointId}>
                      <td>#{a.appointId}</td>
                      {isDoctor && (
                        <td style={{ color: 'var(--text)', fontWeight: 600 }}>{a.patient?.name || '—'}</td>
                      )}
                      <td>Dr. {a.doctor?.name || '—'}</td>
                      <td>{a.appointDate}</td>
                      <td><span className={`badge ${statusBadge(a.status)}`}>{a.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setModal(a)}>Edit</button>
                          {isDoctor && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.appointId)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {modal && (
        <Modal
          appt={modal === 'add' ? null : modal}
          patients={patients} doctors={doctors}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isDoctor={isDoctor}
        />
      )}
    </>
  );
}