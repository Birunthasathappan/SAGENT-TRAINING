import React, { useState } from 'react';

export default function FormField({ label, as, children, ...props }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: '100%', padding: '11px 14px',
    border: `1.5px solid ${focused ? '#0EA5A0' : '#DDE5EE'}`,
    borderRadius: 10, fontSize: 14, color: '#0D1B2A',
    background: '#F8FAFB', outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: focused ? '0 0 0 3px rgba(14,165,160,0.12)' : 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 700,
          color: '#334E68', marginBottom: 6,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>{label}</label>
      )}
      {as === 'select' ? (
        <select {...props} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={base}>
          {children}
        </select>
      ) : (
        <input {...props} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={base} />
      )}
    </div>
  );
}
