import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app/dashboard" element={<DashboardPage />} />
      <Route path="/app/tickets" element={<TicketsPage />} />
      <Route path="*" element={<p>Page not found.</p>} />
    </Routes>
  );
}
