import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';

const Private = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};
const Public = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login"     element={<Public><Login /></Public>} />
          <Route path="/register"  element={<Public><Register /></Public>} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/income"    element={<Private><Income /></Private>} />
          <Route path="/expenses"  element={<Private><Expenses /></Private>} />
          <Route path="/budgets"   element={<Private><Budgets /></Private>} />
          <Route path="/goals"     element={<Private><Goals /></Private>} />
          <Route path="*"          element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
