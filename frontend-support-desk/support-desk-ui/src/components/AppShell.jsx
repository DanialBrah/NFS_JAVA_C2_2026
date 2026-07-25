import { NavLink, Outlet } from 'react-router';
import AppHeader from './AppHeader';

export default function AppShell() {
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
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
