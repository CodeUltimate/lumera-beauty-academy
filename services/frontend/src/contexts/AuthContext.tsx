'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  authApi,
  RegisterRequest,
  AuthResponse,
  AuthUser,
  ApiError,
} from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (redirectPath?: string) => Promise<void>;
  register: (data: RegisterRequest, redirectPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state from server session (cookies)
  useEffect(() => {
    const loadSession = async () => {
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = useCallback(async (redirectPath?: string) => {
    setError(null);
    // Default to /login which handles role-based redirect after authentication
    const target = redirectPath || '/login';
    const url = `${API_BASE}/v1/auth/login?redirect=${encodeURIComponent(target)}`;
    window.location.href = url;
  }, []);

  const register = useCallback(
    async (data: RegisterRequest, redirectPath?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authApi.register(data);
        // Fetch full user data after registration
        const fullUser = await authApi.me();
        setUser(fullUser);

        // Redirect based on user role
        const destination =
          redirectPath ||
          (fullUser.role === 'EDUCATOR' ? '/educator' : fullUser.role === 'ADMIN' ? '/admin' : '/student');
        router.push(destination);
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.validationErrors) {
          const firstError = Object.values(apiError.validationErrors)[0];
          setError(firstError);
        } else {
          setError(apiError.message || 'Registration failed');
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      await authApi.refreshToken();
      // Fetch full user data after token refresh
      const fullUser = await authApi.me();
      setUser(fullUser);
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      setUser(null);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
