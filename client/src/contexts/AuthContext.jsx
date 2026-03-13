import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { apiGetCurrentUser, apiLogin, apiLogout, apiRegister } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const refreshSession = useCallback(async () => {
    try {
      const data = await apiGetCurrentUser();
      setUser(data.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  // Restore session on initial load
  useEffect(() => {
    let cancelled = false;
    apiGetCurrentUser()
      .then((data) => {
        if (!cancelled) setUser(data.data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (credentials) => {
    setAuthError(null);
    const data = await apiLogin(credentials);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError(null);
    const data = await apiRegister(payload);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      authError,
      login,
      register,
      logout,
      refreshSession,
      clearAuthError,
    }),
    [user, isLoading, authError, login, register, logout, refreshSession, clearAuthError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
