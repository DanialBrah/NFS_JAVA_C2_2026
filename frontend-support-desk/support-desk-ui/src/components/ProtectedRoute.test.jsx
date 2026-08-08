import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext.jsx';

function renderProtectedTicketsRoute() {
  return render(
    <MemoryRouter initialEntries={['/app/tickets']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route
            path="/app/tickets"
            element={
              <ProtectedRoute>
                <h1>Protected Tickets</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // AuthProvider reads the token from localStorage on mount, so each test
    // controls the "logged in" state by seeding it before rendering.
    localStorage.clear();
  });

  it('redirects a user without a token to the login page', () => {
    renderProtectedTicketsRoute();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Tickets')).not.toBeInTheDocument();
  });

  it('shows the protected ticket page for a user with stored authentication', () => {
    localStorage.setItem('auth_token', 'fake-jwt-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 1, name: 'Ada', email: 'ada@example.com', role: 'AGENT' }),
    );

    renderProtectedTicketsRoute();

    expect(screen.getByText('Protected Tickets')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
