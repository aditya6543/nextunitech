import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/api.js';

type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const sessionRes: any = await authService.session();
      if (sessionRes?.success && sessionRes.data?.user) {
        setUser(sessionRes.data.user as AuthUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refreshSession();
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    await refreshSession();
  };

  const signup = async (name: string, email: string, password: string) => {
    await authService.signup({ name, email, password });
    await refreshSession();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, isLoading, refreshSession, login, signup, logout }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


