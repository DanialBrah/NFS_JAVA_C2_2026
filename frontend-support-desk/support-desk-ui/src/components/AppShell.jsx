import { NavLink, Outlet, useNavigate } from 'react-router';
import AppHeader from './AppHeader';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      <AppHeader />
      <nav className="app-nav">
        <NavLink to="/app/dashboard" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Dashboard
        </NavLink>
        <NavLink to="/app/tickets" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Tickets
        </NavLink>
        <NavLink to="/app/reports" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Reports
        </NavLink>
        <span className="app-nav-spacer" />
        {user && <span className="app-nav-user">{user.name}</span>}
        <button type="button" className="app-nav-logout" onClick={handleLogout}>
          Log out
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
