import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ───────────────────────────────────────────────
export const loginMember    = (data)     => api.post('/members/login', data);
export const loginLibrarian = (data)     => api.post('/librarians/login', data);

// ── Books ──────────────────────────────────────────────
export const getBooks       = ()         => api.get('/books');
export const getBook        = (id)       => api.get(`/books/${id}`);
export const createBook     = (data)     => api.post('/books', data);
export const deleteBook     = (id)       => api.delete(`/books/${id}`);

// ── Members ────────────────────────────────────────────
export const getMembers     = ()         => api.get('/members');
export const getMember      = (id)       => api.get(`/members/${id}`);
export const createMember   = (data)     => api.post('/members', data);
export const deleteMember   = (id)       => api.delete(`/members/${id}`);

// ── Librarians ─────────────────────────────────────────
export const getLibrarians   = ()        => api.get('/librarians');
export const createLibrarian = (data)    => api.post('/librarians', data);
export const deleteLibrarian = (id)      => api.delete(`/librarians/${id}`);

// ── Borrow ─────────────────────────────────────────────
export const getBorrows     = ()         => api.get('/borrow');
export const getBorrowsByMember = (memId) => api.get(`/borrow/member/${memId}`);
export const borrowBook     = (mId, bId) => api.post(`/borrow/${mId}/${bId}`);
export const returnBook     = (borrowId) => api.put(`/borrow/${borrowId}/return`);
export const deleteBorrow   = (id)       => api.delete(`/borrow/${id}`);

// ── Fines ──────────────────────────────────────────────
export const getFines       = ()         => api.get('/fine');
export const payFine        = (fineId)   => api.put(`/fine/${fineId}/pay`);

// ── Notifications ──────────────────────────────────────
export const getNotifications = ()               => api.get('/notifications');
export const sendNotification = (memId, message) =>
  api.post(`/notifications/${memId}`, null, { params: { message } });

export default api;