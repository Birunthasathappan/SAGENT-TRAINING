import React from 'react';

export default function Modal({ title, onClose, children, accent = '#0EA5A0' }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(15,44,78,0.5)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, padding: '36px 40px',
        width: '100%', maxWidth: 500,
        boxShadow: '0 24px 80px rgba(15,44,78,0.2)',
        animation: 'scaleIn 0.2s ease',
        border: '1px solid #DDE5EE',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D1B2A' }}>{title}</h2>
          <button onClick={onClose} style={{
            background: '#F8FAFB', border: '1px solid #DDE5EE',
            width: 32, height: 32, borderRadius: '50%',
            color: '#6B7C93', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
