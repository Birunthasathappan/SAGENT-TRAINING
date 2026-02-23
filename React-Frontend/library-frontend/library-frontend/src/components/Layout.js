import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Layout({ allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)', padding: '28px 32px' }}>
        <Outlet />
      </main>
    </>
  );
}
