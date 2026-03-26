import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin',                label: 'Dashboard',    icon: '📊', roles: ['ADMIN', 'ORGANIZER'] },
  { path: '/admin/events',         label: 'Events',       icon: '🎭', roles: ['ADMIN', 'ORGANIZER'] },
  { path: '/admin/venues',         label: 'Venues',       icon: '🏛️', roles: ['ADMIN', 'ORGANIZER'] },
  { path: '/admin/screenings',     label: 'Screenings',   icon: '🎬', roles: ['ADMIN', 'ORGANIZER'] },
  { path: '/admin/seats',          label: 'Seat Layout',  icon: '💺', roles: ['ADMIN', 'ORGANIZER'] },
  { path: '/admin/analytics',      label: 'Analytics',    icon: '📈', roles: ['ADMIN', 'ORGANIZER'] },
  { path: '/admin/payments',       label: 'Payments',     icon: '💳', roles: ['ADMIN', 'ORGANIZER'] },
  { path: '/admin/cancellations',  label: 'Cancellations',icon: '❌', roles: ['ADMIN', 'ORGANIZER'] },
];

const SB = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .pk-sidebar {
    width: var(--sidebar-width, 240px);
    min-height: 100vh;
    background: #ffffff;
    border-right: 1.5px solid #fce7f3;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0;
    z-index: 100;
    font-family: 'DM Sans', sans-serif;
  }

  /* Logo */
  .pk-sb-logo {
    padding: 22px 20px;
    border-bottom: 1.5px solid #fce7f3;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pk-sb-logo-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    background: linear-gradient(135deg, #ec4899, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 18px; color: #fff;
    box-shadow: 0 4px 14px rgba(236,72,153,0.30);
    font-family: 'DM Sans', sans-serif;
  }

  .pk-sb-logo-text {
    font-weight: 800; font-size: 16px;
    color: #1e0a17;
    letter-spacing: 0.02em;
  }

  .pk-sb-logo-role {
    font-size: 10.5px;
    color: #a87090;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    margin-top: 1px;
  }

  /* User info */
  .pk-sb-user {
    padding: 14px 20px;
    border-bottom: 1.5px solid #fce7f3;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pk-sb-user-av {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f472b6, #c084fc);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(244,114,182,0.25);
  }

  .pk-sb-user-name {
    font-weight: 600; font-size: 13.5px;
    color: #1e0a17;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .pk-sb-user-email {
    font-size: 11.5px; color: #a87090;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* Nav */
  .pk-sb-nav {
    flex: 1;
    padding: 14px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
  }

  .pk-sb-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 500;
    text-decoration: none;
    color: #6b3a54;
    transition: all 0.18s ease;
    border-left: 3px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .pk-sb-link:hover {
    background: #fff0f9;
    color: #ec4899;
    border-left-color: #f9a8d4;
  }

  .pk-sb-link.active {
    background: linear-gradient(90deg, #fdf2f8, #fff0f9);
    color: #db2777;
    font-weight: 700;
    border-left-color: #ec4899;
    box-shadow: 0 2px 8px rgba(236,72,153,0.10);
  }

  .pk-sb-link .pk-sb-icon {
    font-size: 16px;
    line-height: 1;
    flex-shrink: 0;
  }

  /* active dot */
  .pk-sb-link.active::after {
    content: '';
    position: absolute;
    right: 12px; top: 50%;
    transform: translateY(-50%);
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #ec4899;
    box-shadow: 0 0 6px rgba(236,72,153,0.5);
  }

  /* Logout */
  .pk-sb-logout-wrap {
    padding: 14px 10px;
    border-top: 1.5px solid #fce7f3;
  }

  .pk-sb-logout {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border-radius: 12px;
    background: none;
    border: none;
    color: #f43f5e;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s ease;
    text-align: left;
  }

  .pk-sb-logout:hover {
    background: rgba(244,63,94,0.08);
    color: #e11d48;
  }
`;

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const filtered = navItems.filter(i => i.roles.includes(user?.role));

  return (
    <>
      <style>{SB}</style>
      <aside className="pk-sidebar">

        {/* Logo */}
        <div className="pk-sb-logo">
          <div className="pk-sb-logo-icon">B</div>
          <div>
            <div className="pk-sb-logo-text">BOOKIT</div>
            <div className="pk-sb-logo-role">
              {user?.role === 'ADMIN' ? 'Admin Panel' : 'Organizer'}
            </div>
          </div>
        </div>

        {/* User */}
        <div className="pk-sb-user">
          <div className="pk-sb-user-av">{user?.name?.[0]?.toUpperCase()}</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="pk-sb-user-name">{user?.name}</div>
            <div className="pk-sb-user-email">{user?.email}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="pk-sb-nav">
          {filtered.map(({ path, label, icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`pk-sb-link${active ? ' active' : ''}`}
              >
                <span className="pk-sb-icon">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pk-sb-logout-wrap">
          <button className="pk-sb-logout" onClick={handleLogout}>
            <span style={{ fontSize: 16 }}>🚪</span> Logout
          </button>
        </div>

      </aside>
    </>
  );
}