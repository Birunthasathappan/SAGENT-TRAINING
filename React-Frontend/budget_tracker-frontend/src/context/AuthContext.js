import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bt_user')) || null; }
    catch { return null; }
  });

  const login = (u) => { setUser(u); localStorage.setItem('bt_user', JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem('bt_user'); };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
