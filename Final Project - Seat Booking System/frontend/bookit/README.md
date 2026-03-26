# BOOKIT — Frontend

React frontend for the Seat Booking Application (Movies, Events & Concerts).

## Tech Stack
- **React 18** + **Vite**
- **React Router v6** — client-side routing
- **Vanilla CSS** — custom design system (no UI framework)
- **Fetch API** — all backend communication

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server (runs on port 3000)
npm run dev
```

Make sure your Spring Boot backend is running on `http://localhost:8080`.

## Project Structure

```
src/
├── services/
│   └── api.js              # All API calls mapped to every backend endpoint
├── context/
│   └── AuthContext.jsx      # Auth state (login/logout/user)
├── components/
│   └── common/
│       ├── Navbar.jsx       # User navbar with notification badge
│       ├── AdminSidebar.jsx # Admin/Organizer sidebar
│       └── Toast.jsx        # Toast notification system
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── user/
│   │   ├── HomePage.jsx          # Discover events with search, filter, sort
│   │   ├── EventDetailPage.jsx   # Event info + screenings by date
│   │   ├── SeatSelectionPage.jsx # Interactive seat map (BookMyShow style)
│   │   ├── PaymentPage.jsx       # UPI / Card / NetBanking / Wallet
│   │   ├── BookingConfirmPage.jsx # Ticket confirmation
│   │   ├── MyBookingsPage.jsx    # Booking history + cancellation
│   │   ├── NotificationsPage.jsx # In-app alerts
│   │   └── UserProfilePage.jsx   # Profile + stats
│   └── admin/
│       ├── AdminDashboard.jsx        # Stats + recent bookings
│       ├── ManageEventsPage.jsx      # Full CRUD for events
│       ├── ManageVenuesPage.jsx      # Full CRUD for venues
│       ├── ManageScreeningsPage.jsx  # Full CRUD for screenings
│       ├── ManageSeatsPage.jsx       # Seat layout + screening seat assignment
│       ├── BookingAnalyticsPage.jsx  # All bookings + revenue charts
│       ├── PaymentHistoryPage.jsx    # Payment management
│       └── CancellationsPage.jsx     # Approve/reject + notify user
└── index.css               # Full design system (dark theme, CSS variables)
```

## Roles & Access

| Role       | Access                                                  |
|------------|---------------------------------------------------------|
| USER       | Browse events, book seats, payments, cancel, alerts     |
| ORGANIZER  | Admin panel — own events, screenings, seats, analytics  |
| ADMIN      | Full admin panel — all data including venues and users  |

## Booking Flow

1. **Discover** → Browse/search/filter events on homepage
2. **Event Detail** → View screenings by date, pick a show
3. **Seat Selection** → Interactive seat map, select up to 10 seats
4. **Payment** → Choose pay mode, confirm payment (simulated)
5. **Confirmation** → Ticket shown, in-app notification created
6. **Cancellation** → From My Bookings, admin approves/rejects + notifies via in-app alert

## Notifications
- In-app notifications are created automatically on:
  - Booking confirmation (after payment)
  - Cancellation request approval/rejection
  - Admin-triggered events
- Notifications page shows unread count (polled every 30 seconds)
- Email notifications are handled by the Spring Boot backend (MailConfig)
