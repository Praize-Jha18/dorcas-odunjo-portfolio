import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, getToken, setToken, clearToken } from '../lib/api';

interface AuthState {
  ready: boolean;
  authed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setReady(true);
      return;
    }
    api
      .get('/api/auth/me')
      .then(() => setAuthed(true))
      .catch(() => clearToken())
      .finally(() => setReady(true));
  }, []);

  const login = async (email: string, password: string) => {
    const { token } = await api.post<{ token: string }>('/api/auth/login', { email, password });
    setToken(token);
    setAuthed(true);
  };

  const logout = () => {
    clearToken();
    setAuthed(false);
  };

  return <AuthContext.Provider value={{ ready, authed, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
