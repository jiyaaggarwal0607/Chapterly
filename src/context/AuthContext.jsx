import { createContext, useContext, useMemo, useState } from 'react';
import { loadStorage, saveStorage } from '../utils/storage';

const AuthContext = createContext(null);

const credentials = {
  user: { email: 'reader@chapterly.dev', password: 'reader123' },
  admin: { email: 'admin@chapterly.dev', password: 'admin123' }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadStorage('chapterly-session', null));

  function login({ role, email, password }) {
    const expected = credentials[role];
    const valid = expected && expected.email === email && expected.password === password;
    if (!valid) {
      throw new Error(`Invalid ${role} credentials.`);
    }

    const user = {
      id: `${role}-001`,
      name: role === 'admin' ? 'Admin Librarian' : 'Avid Reader',
      email,
      role,
      token: `mock-jwt-${role}-${Date.now()}`
    };
    setSession(user);
    saveStorage('chapterly-session', user);
    return user;
  }

  function logout() {
    setSession(null);
    localStorage.removeItem('chapterly-session');
  }

  const value = useMemo(() => ({ user: session, login, logout }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
