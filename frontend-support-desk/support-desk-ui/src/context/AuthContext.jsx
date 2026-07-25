import { createContext, useContext, useState } from 'react';
import { login as loginRequest } from '../services/api';

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem('auth_user');
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(readStoredUser);

  async function login(email, password) {
    const response = await loginRequest(email, password);

    const loggedInUser = {
      id: response.userId,
      name: response.name,
      email: response.email,
      role: response.role,
    };

    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(loggedInUser));

    setToken(response.token);
    setUser(loggedInUser);
  }

  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
