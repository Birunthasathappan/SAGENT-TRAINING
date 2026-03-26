import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}
            style={{ pointerEvents: 'all' }}>
            <span>{icons[t.type] || icons.info}</span>
            <span style={{ flex: 1, fontSize: 14 }}>{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  // Return a no-op if used outside provider to avoid crashes
  if (!ctx) return { show: () => {} };
  return ctx;
}
