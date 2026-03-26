const BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (method, path, body = null) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Access denied (403). Please log in again.');
    }
    let errorMessage = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      errorMessage = err.message || err.reason || err.error || JSON.stringify(err);
    } catch (_) {
      errorMessage = await res.text().catch(() => `HTTP ${res.status}`);
    }
    throw new Error(errorMessage);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const authAPI = {
  register: (data) => request('POST', '/auth/register', data),
  login:    (data) => request('POST', '/auth/login', data),

  // ✅ NEW - Forgot Password
  forgotPassword: (email) => request('POST', '/users/forgot-password', { email }),
  verifyOtp:      (data)  => request('POST', '/users/verify-otp', data),
  resetPassword:  (data)  => request('POST', '/users/reset-password', data),
};

export const eventsAPI = {
  getAll:          ()           => request('GET',    '/events'),
  getById:         (id)         => request('GET',    `/events/${id}`),
  getByCategory:   (cat)        => request('GET',    `/events/category/${cat}`),
  getByGenre:      (genre)      => request('GET',    `/events/genre/${genre}`),
  getByLanguage:   (lang)       => request('GET',    `/events/language/${lang}`),
  getByStatus:     (status)     => request('GET',    `/events/status/${status}`),
  getByOrganizer:  (id)         => request('GET',    `/events/organizer/${id}`),
  getLanguages:    ()           => request('GET',    '/events/languages'),
  create:          (data)       => request('POST',   '/events', data),
  update:          (id, data)   => request('PUT',    `/events/${id}`, data),
  delete:          (id)         => request('DELETE', `/events/${id}`),
};

export const venuesAPI = {
  getAll:        ()           => request('GET',    '/venues'),
  getById:       (id)         => request('GET',    `/venues/${id}`),
  getByDistrict: (d)          => request('GET',    `/venues/district/${d}`),
  create:        (data)       => request('POST',   '/venues', data),
  update:        (id, data)   => request('PUT',    `/venues/${id}`, data),
  delete:        (id)         => request('DELETE', `/venues/${id}`),
};

export const screeningsAPI = {
  getAll:     ()           => request('GET',    '/screenings'),
  getById:    (id)         => request('GET',    `/screenings/${id}`),
  getByEvent: (id)         => request('GET',    `/screenings/event/${id}`),
  getByVenue: (id)         => request('GET',    `/screenings/venue/${id}`),
  getByDate:  (date)       => request('GET',    `/screenings/date/${date}`),
  getByStatus:(s)          => request('GET',    `/screenings/status/${s}`),
  create:     (data)       => request('POST',   '/screenings', data),
  update:     (id, data)   => request('PUT',    `/screenings/${id}`, data),
  delete:     (id)         => request('DELETE', `/screenings/${id}`),
};

export const seatsAPI = {
  getAll:               ()             => request('GET',    '/seats'),
  getById:              (id)           => request('GET',    `/seats/${id}`),
  getByVenue:           (id)           => request('GET',    `/seats/venue/${id}`),
  getByCategory:        (cat)          => request('GET',    `/seats/category/${cat}`),
  getByVenueAndCategory:(vId, cat)     => request('GET',    `/seats/venue/${vId}/category/${cat}`),
  create:               (data)         => request('POST',   '/seats', data),
  update:               (id, data)     => request('PUT',    `/seats/${id}`, data),
  delete:               (id)           => request('DELETE', `/seats/${id}`),
};

export const screeningSeatsAPI = {
  getAll:             ()         => request('GET',   '/screening-seats'),
  getById:            (id)       => request('GET',   `/screening-seats/${id}`),
  getByScreening:     (id)       => request('GET',   `/screening-seats/screening/${id}`),
  getAvailable:       (id)       => request('GET',   `/screening-seats/screening/${id}/available`),
  getHeldByUser:      (id)       => request('GET',   `/screening-seats/held/user/${id}`),
  create:             (data)     => request('POST',  '/screening-seats', data),
  updateAvailability: (id, avail)=> request('PATCH', `/screening-seats/${id}/availability?availability=${avail}`),
  update:             (id, data) => request('PUT',   `/screening-seats/${id}`, data),
  delete:             (id)       => request('DELETE',`/screening-seats/${id}`),
};

export const bookingsAPI = {
  getAll:           ()           => request('GET',    '/bookings'),
  getById:          (id)         => request('GET',    `/bookings/${id}`),
  getByRef:         (ref)        => request('GET',    `/bookings/ref/${ref}`),
  getByUser:        (id)         => request('GET',    `/bookings/user/${id}`),
  getByScreening:   (id)         => request('GET',    `/bookings/screening/${id}`),
  getByStatus:      (s)          => request('GET',    `/bookings/status/${s}`),
  getByUserAndStatus:(uid, s)    => request('GET',    `/bookings/user/${uid}/status/${s}`),
  create:           (data)       => request('POST',   '/bookings', data),
  updateStatus:     (id, status) => request('PATCH',  `/bookings/${id}/status?status=${status}`),
  update:           (id, data)   => request('PUT',    `/bookings/${id}`, data),
  delete:           (id)         => request('DELETE', `/bookings/${id}`),
};

export const bookingItemsAPI = {
  getAll:       ()           => request('GET',    '/booking-items'),
  getById:      (id)         => request('GET',    `/booking-items/${id}`),
  getByBooking: (id)         => request('GET',    `/booking-items/booking/${id}`),
  getBySeat:    (id)         => request('GET',    `/booking-items/seat/${id}`),
  create:       (data)       => request('POST',   '/booking-items', data),
  updateStatus: (id, status) => request('PATCH',  `/booking-items/${id}/status?status=${status}`),
  update:       (id, data)   => request('PUT',    `/booking-items/${id}`, data),
  delete:       (id)         => request('DELETE', `/booking-items/${id}`),
};

export const paymentsAPI = {
  getAll:       ()           => request('GET',    '/payments'),
  getById:      (id)         => request('GET',    `/payments/${id}`),
  getByBooking: (id)         => request('GET',    `/payments/booking/${id}`),
  getByStatus:  (s)          => request('GET',    `/payments/status/${s}`),
  getByUser:    (id)         => request('GET',    `/payments/user/${id}`),
  create:       (data)       => request('POST',   '/payments', data),
  updateStatus: (id, status) => request('PATCH',  `/payments/${id}/status?status=${status}`),
  update:       (id, data)   => request('PUT',    `/payments/${id}`, data),
  delete:       (id)         => request('DELETE', `/payments/${id}`),
};

export const cancellationsAPI = {
  getAll:           ()           => request('GET',    '/cancellations'),
  getById:          (id)         => request('GET',    `/cancellations/${id}`),
  getByUser:        (id)         => request('GET',    `/cancellations/user/${id}`),
  getByBooking:     (id)         => request('GET',    `/cancellations/booking/${id}`),
  getByStatus:      (s)          => request('GET',    `/cancellations/status/${s}`),
  getByUserAndStatus:(uid, s)    => request('GET',    `/cancellations/user/${uid}/status/${s}`),
  create:           (data)       => request('POST',   '/cancellations', data),
  updateStatus:     (id, status) => request('PATCH',  `/cancellations/${id}/status?status=${status}`),
  update:           (id, data)   => request('PUT',    `/cancellations/${id}`, data),
  delete:           (id)         => request('DELETE', `/cancellations/${id}`),
};

export const alertsAPI = {
  getAll:       ()       => request('GET',    '/alerts'),
  getByUser:    (id)     => request('GET',    `/alerts/user/${id}`),
  getByBooking: (id)     => request('GET',    `/alerts/booking/${id}`),
  getUnread:    (id)     => request('GET',    `/alerts/user/${id}/unread`),
  countUnread:  (id)     => request('GET',    `/alerts/user/${id}/unread/count`),
  getByType:    (type)   => request('GET',    `/alerts/type/${type}`),
  create:       (data)   => request('POST',   '/alerts', data),
  markAsRead:   (id)     => request('PATCH',  `/alerts/${id}/read`),
  markAllAsRead:(userId) => request('PATCH',  `/alerts/user/${userId}/read-all`),
  delete:       (id)     => request('DELETE', `/alerts/${id}`),
};

export const usersAPI = {
  getAll:  ()   => request('GET',    '/users'),
  getById: (id) => request('GET',    `/users/${id}`),
  delete:  (id) => request('DELETE', `/users/${id}`),
};
