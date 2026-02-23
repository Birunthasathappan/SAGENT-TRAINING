import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

// Auth
import AuthPage from './pages/AuthPage';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentBooks from './pages/student/StudentBooks';
import StudentBorrows from './pages/student/StudentBorrows';
import StudentFines from './pages/student/StudentFines';

// Staff
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffBooks from './pages/staff/StaffBooks';
import StaffMembers from './pages/staff/StaffMembers';
import StaffBorrows from './pages/staff/StaffBorrows';

// Librarian
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import LibrarianBooks from './pages/librarian/LibrarianBooks';
import LibrarianMembers from './pages/librarian/LibrarianMembers';
import LibrarianBorrows from './pages/librarian/LibrarianBorrows';
import LibrarianFines from './pages/librarian/LibrarianFines';
import LibrarianNotifications from './pages/librarian/LibrarianNotifications';

// Shared
import NotificationsPage from './pages/NotificationsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Student Routes */}
          <Route element={<Layout allowedRole="STUDENT" />}>
            <Route path="/student/dashboard"  element={<StudentDashboard />} />
            <Route path="/student/books"      element={<StudentBooks />} />
            <Route path="/student/borrows"    element={<StudentBorrows />} />
            <Route path="/student/fines"      element={<StudentFines />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Staff Routes */}
          <Route element={<Layout allowedRole="STAFF" />}>
            <Route path="/staff/dashboard"    element={<StaffDashboard />} />
            <Route path="/staff/books"        element={<StaffBooks />} />
            <Route path="/staff/members"      element={<StaffMembers />} />
            <Route path="/staff/borrows"      element={<StaffBorrows />} />
            <Route path="/staff/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Librarian Routes */}
          <Route element={<Layout allowedRole="LIBRARIAN" />}>
            <Route path="/librarian/dashboard"      element={<LibrarianDashboard />} />
            <Route path="/librarian/books"          element={<LibrarianBooks />} />
            <Route path="/librarian/members"        element={<LibrarianMembers />} />
            <Route path="/librarian/borrows"        element={<LibrarianBorrows />} />
            <Route path="/librarian/fines"          element={<LibrarianFines />} />
            <Route path="/librarian/notifications"  element={<LibrarianNotifications />} />
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
