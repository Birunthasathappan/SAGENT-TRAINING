import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast.jsx';

// Auth
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

// User pages
import HomePage from './pages/user/HomePage';
import EventDetailPage from './pages/user/EventDetailPage';
import SeatSelectionPage from './pages/user/SeatSelectionPage';
import PaymentPage from './pages/user/PaymentPage';
import BookingConfirmPage from './pages/user/BookingConfirmPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import NotificationsPage from './pages/user/NotificationsPage';
import UserProfilePage from './pages/user/UserProfilePage';

// Admin/Organizer pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import ManageVenuesPage from './pages/admin/ManageVenuesPage';
import ManageScreeningsPage from './pages/admin/ManageScreeningsPage';
import ManageSeatsPage from './pages/admin/ManageSeatsPage';
import BookingAnalyticsPage from './pages/admin/BookingAnalyticsPage';
import PaymentHistoryPage from './pages/admin/PaymentHistoryPage';
import CancellationsPage from './pages/admin/CancellationsPage';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)' }}>
        <div className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'USER' ? '/' : '/admin'} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)' }}>
        <div className="spinner" />
      </div>
    );
  }
  if (user) return <Navigate to={user.role === 'USER' ? '/' : '/admin'} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Forgot Password Routes */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp"      element={<VerifyOtpPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* User Routes */}
      <Route path="/"               element={<PrivateRoute roles={['USER']}><HomePage /></PrivateRoute>} />
      <Route path="/event/:id"      element={<PrivateRoute roles={['USER']}><EventDetailPage /></PrivateRoute>} />
      <Route path="/event/:eventId/screening/:screeningId/seats" element={<PrivateRoute roles={['USER']}><SeatSelectionPage /></PrivateRoute>} />
      <Route path="/payment/:bookingId"         element={<PrivateRoute roles={['USER']}><PaymentPage /></PrivateRoute>} />
      <Route path="/booking/confirm/:bookingId" element={<PrivateRoute roles={['USER']}><BookingConfirmPage /></PrivateRoute>} />
      <Route path="/my-bookings"    element={<PrivateRoute roles={['USER']}><MyBookingsPage /></PrivateRoute>} />
      <Route path="/notifications"  element={<PrivateRoute roles={['USER']}><NotificationsPage /></PrivateRoute>} />
      <Route path="/profile"        element={<PrivateRoute roles={['USER']}><UserProfilePage /></PrivateRoute>} />

      {/* Admin / Organizer Routes */}
      <Route path="/admin"               element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/events"        element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><ManageEventsPage /></PrivateRoute>} />
      <Route path="/admin/venues"        element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><ManageVenuesPage /></PrivateRoute>} />
      <Route path="/admin/screenings"    element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><ManageScreeningsPage /></PrivateRoute>} />
      <Route path="/admin/seats"         element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><ManageSeatsPage /></PrivateRoute>} />
      <Route path="/admin/analytics"     element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><BookingAnalyticsPage /></PrivateRoute>} />
      <Route path="/admin/payments"      element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><PaymentHistoryPage /></PrivateRoute>} />
      <Route path="/admin/cancellations" element={<PrivateRoute roles={['ADMIN','ORGANIZER']}><CancellationsPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}