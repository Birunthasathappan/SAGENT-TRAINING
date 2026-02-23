// ================================================================
// AuthContext.jsx
// This file creates a "context" - a way to share the logged-in
// user's info across ALL pages without passing it as props.
//
// How to use in any component:
//   import { useAuth } from "../context/AuthContext";
//   const { user, login, logout } = useAuth();
// ================================================================

import { createContext, useContext, useState } from "react";

// Step 1: Create the context object
const AuthContext = createContext(null);

// Step 2: AuthProvider wraps the entire app (see index.js)
// It holds the 'user' state and shares it with all child components
export function AuthProvider({ children }) {
  // user will look like: { id: 1, name: "John", email: "john@gmail.com", role: "student" }
  // or null if nobody is logged in
  const [user, setUser] = useState(null);

  // Call login() when a user successfully logs in
  const login = (userData) => {
    setUser(userData);
  };

  // Call logout() to clear the user
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Custom hook - makes it easy to use the context
export function useAuth() {
  return useContext(AuthContext);
}
