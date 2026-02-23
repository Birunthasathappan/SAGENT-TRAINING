import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientAPI, doctorAPI } from '../services/api';

export default function LoginPage() {
  const [tab, setTab] = useState('patient');
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ name: '', age: '', phnNo: '', mail: '', password: '', address: '', gender: 'Male', specialization: '', contactNo: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (tab === 'patient') {
          const payload = { name: form.name, age: parseInt(form.age), phnNo: form.phnNo, mail: form.mail, password: form.password, address: form.address, gender: form.gender };
          const res = await patientAPI.create(payload);
          login({ id: res.data.patientId, name: res.data.name, role: 'patient', data: res.data });
        } else {
          const payload = { name: form.name, email: form.email, password: form.password, specialization: form.specialization, contactNo: form.contactNo };
          const res = await doctorAPI.create(payload);
          login({ id: res.data.doctorId, name: res.data.name, role: 'doctor', data: res.data });
        }
        navigate('/');
      } else {
        // Login: fetch all and match
        if (tab === 'patient') {
          const res = await patientAPI.getAll();
          const found = res.data.find(p => p.mail === form.mail && p.password === form.password);
          if (!found) throw new Error('Invalid email or password');
          login({ id: found.patientId, name: found.name, role: 'patient', data: found });
        } else {
          const res = await doctorAPI.getAll();
          const found = res.data.find(d => d.email === form.email && d.password === form.password);
          if (!found) throw new Error('Invalid email or password');
          login({ id: found.doctorId, name: found.name, role: 'doctor', data: found });
        }
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Make sure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-grid-lines" />
      <div className="login-card">
        <div className="login-logo">MediMonitor</div>
        <div className="login-tagline">Patient Monitoring System — Secure Health Tracking</div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === 'patient' ? 'active' : ''}`} onClick={() => { setTab('patient'); setError(''); }}>
            👤 Patient
          </button>
          <button className={`login-tab ${tab === 'doctor' ? 'active' : ''}`} onClick={() => { setTab('doctor'); setError(''); }}>
            🩺 Doctor
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={change} placeholder="Enter your name" required />
              </div>
              {tab === 'patient' && (
                <>
                  <div className="form-group">
                    <label>Age</label>
                    <input name="age" type="number" value={form.age} onChange={change} placeholder="Age" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phnNo" value={form.phnNo} onChange={change} placeholder="Phone number" required />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input name="address" value={form.address} onChange={change} placeholder="Address" />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={form.gender} onChange={change}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </>
              )}
              {tab === 'doctor' && (
                <>
                  <div className="form-group">
                    <label>Specialization</label>
                    <input name="specialization" value={form.specialization} onChange={change} placeholder="e.g. Cardiology" required />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input name="contactNo" value={form.contactNo} onChange={change} placeholder="Contact number" />
                  </div>
                </>
              )}
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input name={tab === 'patient' ? 'mail' : 'email'} type="email"
              value={tab === 'patient' ? form.mail : form.email}
              onChange={change} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={change} placeholder="Enter password" required />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (mode === 'login' ? `Login as ${tab === 'patient' ? 'Patient' : 'Doctor'}` : 'Create Account')}
          </button>
        </form>

        <div className="register-link">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setMode('register'); setError(''); }}>Register here</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError(''); }}>Login</button></>
          )}
        </div>
      </div>
    </div>
  );
}
