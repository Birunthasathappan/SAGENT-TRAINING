import React, { useEffect, useState } from 'react';
import { consultationAPI, patientAPI, doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Modal({ item, patients, doctors, onClose, onSave, isDoctor, isPatient }) {
  const [form, setForm] = useState(item ? {
    date: item.date, remark: item.remark, consultFee: item.consultFee,
    paymentMode: item.paymentMode || 'Cash',
    paymentStatus: item.paymentStatus || 'Pending',
    doctor: { doctorId: item.doctor?.doctorId },
    patient: { patientId: item.patient?.patientId }
  } : {
    date: '', remark: '', consultFee: '',
    paymentMode: 'Cash', paymentStatus: 'Pending',
    doctor: { doctorId: '' }, patient: { patientId: '' }
  });

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const changeNested = (parent, key, val) =>
    setForm(f => ({ ...f, [parent]: { ...f[parent], [key]: val } }));
  const submit = async (e) => {
    e.preventDefault();
    await onSave({ ...form, consultFee: parseFloat(form.consultFee) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{item ? 'Edit Consultation' : 'New Consultation'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Patient selector: only doctors see this */}
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

              {/* Doctor field:
                  - Patient sees ALL doctors (can pick any)
                  - Doctor sees only themselves (read-only) */}
              <div className="form-group">
                <label>Doctor</label>
                {isPatient ? (
                  <select value={form.doctor.doctorId}
                    onChange={e => changeNested('doctor', 'doctorId', parseInt(e.target.value))} required>
                    <option value="">Select doctor</option>
                    {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>Dr. {d.name}</option>)}
                  </select>
                ) : (
                  <input
                    value={`Dr. ${doctors.find(d => d.doctorId === form.doctor.doctorId)?.name || ''}`}
                    readOnly
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                )}
              </div>

              <div className="form-group">
                <label>Date</label>
                <input name="date" type="date" value={form.date} onChange={change} required />
              </div>
              <div className="form-group">
                <label>Consultation Fee (₹)</label>
                <input name="consultFee" type="number" value={form.consultFee} onChange={change} required />
              </div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select name="paymentMode" value={form.paymentMode} onChange={change}>
                  <option value="Cash">💵 Cash</option>
                  <option value="Online">💳 Online</option>
                  <option value="UPI">📱 UPI</option>
                  <option value="Card">🏧 Card</option>
                </select>
              </div>

              {/* Payment Status: ONLY doctors can change this */}
              <div className="form-group">
                <label>Payment Status</label>
                {isDoctor ? (
                  <select name="paymentStatus" value={form.paymentStatus} onChange={change}>
                    <option value="Paid">✅ Paid</option>
                    <option value="Pending">⏳ Pending</option>
                  </select>
                ) : (
                  <input
                    value={form.paymentStatus === 'Paid' ? '✅ Paid' : '⏳ Pending'}
                    readOnly
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                )}
              </div>

              <div className="form-group full">
                <label>Remark</label>
                <textarea name="remark" value={form.remark} onChange={change}
                  placeholder="Doctor's remarks..." />
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

export default function ConsultationsPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [c, p, d] = await Promise.all([
        consultationAPI.getAll(), patientAPI.getAll(), doctorAPI.getAll()
      ]);

      if (isPatient) {
        // Patient sees only their own consultations
        setItems(c.data.filter(cn => cn.patient?.patientId === user.id));
      } else if (isDoctor) {
        // Doctor sees ONLY consultations assigned to them (filtered by their doctorId)
        setItems(c.data.filter(cn => cn.doctor?.doctorId === user.id));
      } else {
        setItems(c.data);
      }

      setPatients(p.data);
      setDoctors(d.data);
    } catch { setError('Could not load data.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    // Patient: auto-assign their patientId
    const saveData = isPatient
      ? { ...data, patient: { patientId: user.id } }
      : data;

    // Doctor: always lock doctorId to themselves
    const finalData = isDoctor
      ? { ...saveData, doctor: { doctorId: user.id } }
      : saveData;

    try {
      if (modal?.consultId) await consultationAPI.update(modal.consultId, finalData);
      else await consultationAPI.create(finalData);
      setModal(null); load();
    } catch { setError('Failed to save.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await consultationAPI.delete(id); load(); }
    catch { setError('Failed to delete.'); }
  };

  const paymentBadge = (status) => status === 'Paid' ? 'badge-green' : 'badge-orange';

  const modeBadge = (mode) => {
    if (mode === 'Online') return { bg: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: 'rgba(0,212,255,0.3)' };
    if (mode === 'UPI') return { bg: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: 'rgba(124,58,237,0.3)' };
    if (mode === 'Card') return { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' };
    return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' };
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Consultations</div>
        <div className="page-subtitle">
          {isPatient ? 'Your consultation records' : 'Your assigned consultation records'}
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
          {isDoctor ? '🩺 Doctor View — Your Consultations Only' : '👤 Patient View — My Consultations Only'}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="card-title" style={{ marginBottom: 0 }}>
              💬 {isPatient ? 'My Consultations' : 'My Consultations'} ({items.length})
            </div>
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              + New Consultation
            </button>
          </div>

          {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : (
            <div className="table-wrap" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Fee</th>
                    <th>Payment Mode</th>
                    <th>Payment Status</th>
                    <th>Remark</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>
                        {isPatient ? 'No consultations found for you.' : 'No consultations assigned to you yet.'}
                      </td>
                    </tr>
                  ) : items.map(c => {
                    const mb = modeBadge(c.paymentMode);
                    return (
                      <tr key={c.consultId}>
                        <td>#{c.consultId}</td>
                        <td style={{ color: 'var(--text)', fontWeight: 600 }}>{c.patient?.name || '—'}</td>
                        <td>Dr. {c.doctor?.name || '—'}</td>
                        <td>{c.date}</td>
                        <td style={{ color: 'var(--green)', fontWeight: 600 }}>₹{c.consultFee}</td>
                        <td>
                          <span style={{
                            padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                            fontWeight: 600, background: mb.bg, color: mb.color,
                            border: `1px solid ${mb.border}`
                          }}>
                            {c.paymentMode === 'Online' ? '💳' :
                             c.paymentMode === 'UPI' ? '📱' :
                             c.paymentMode === 'Card' ? '🏧' : '💵'} {c.paymentMode || 'Cash'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${paymentBadge(c.paymentStatus)}`}>
                            {c.paymentStatus === 'Paid' ? '✅ Paid' : '⏳ Pending'}
                          </span>
                        </td>
                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.remark}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal(c)}>Edit</button>
                            {isDoctor && (
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.consultId)}>Delete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {modal && (
        <Modal
          item={modal === 'add' ? null : modal}
          patients={patients}
          doctors={doctors}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isDoctor={isDoctor}
          isPatient={isPatient}
        />
      )}
    </>
  );
}
