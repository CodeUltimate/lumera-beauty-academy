'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Helper to get dashboard path based on user role
function getDashboardPath(role: string | undefined): string {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return '/admin';
    case 'EDUCATOR':
      return '/educator';
    case 'STUDENT':
    default:
      return '/student';
  }
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  // Check for error in URL params - derived state, not effect-based
  const errorParam = searchParams.get('error');
  const [error, setError] = useState<string | null>(errorParam);

  useEffect(() => {
    // If there's an error, don't auto-redirect
    if (error) return;

    // Prevent double redirects
    if (hasRedirected.current) return;

    // Wait for auth state to be determined
    if (isLoading) return;

    // If already authenticated, redirect to appropriate dashboard based on role
    if (isAuthenticated && user) {
      hasRedirected.current = true;
      const dashboardPath = getDashboardPath(user.role);
      router.replace(dashboardPath);
      return;
    }

    // Not authenticated - redirect to Keycloak via backend
    // Use /login as the callback target so this page handles the role-based redirect
    hasRedirected.current = true;
    const redirectUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/v1/auth/login?redirect=${encodeURIComponent('/login')}`;
    window.location.href = redirectUrl;
  }, [user, isAuthenticated, isLoading, router, error]);

  const handleRetry = () => {
    setError(null);
    hasRedirected.current = false;
    // Clear URL params and retry
    router.replace('/login');
    const redirectUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/v1/auth/login?redirect=${encodeURIComponent('/login')}`;
    window.location.href = redirectUrl;
  };

  // Show error state if there's an error
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--cream-light)]">
        <div className="text-center max-w-md px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-[var(--charcoal)] mb-1">
            Luméra
          </h1>
          <p className="text-xs font-light tracking-widest uppercase text-[var(--text-muted)] mb-8">
            Beauty Academy
          </p>
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
            <p className="text-sm text-red-700">
              {error === 'access_denied'
                ? 'Login was cancelled or access was denied.'
                : error === 'invalid_callback'
                ? 'There was a problem with the login process.'
                : `Authentication error: ${error}`}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="btn-primary w-full"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Show minimal loading state while redirecting
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--cream-light)]">
      <div className="text-center">
        <h1 className="text-2xl font-light tracking-tight text-[var(--charcoal)] mb-1">
          Luméra
        </h1>
        <p className="text-xs font-light tracking-widest uppercase text-[var(--text-muted)] mb-8">
          Beauty Academy
        </p>
        <div className="flex items-center justify-center space-x-2 text-[var(--text-secondary)]">
          <svg
            className="animate-spin h-5 w-5 text-[var(--champagne)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-light">Redirecting to secure login...</span>
        </div>
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--cream-light)]">
      <div className="text-center">
        <h1 className="text-2xl font-light tracking-tight text-[var(--charcoal)] mb-1">
          Luméra
        </h1>
        <p className="text-xs font-light tracking-widest uppercase text-[var(--text-muted)] mb-8">
          Beauty Academy
        </p>
        <div className="flex items-center justify-center space-x-2 text-[var(--text-secondary)]">
          <svg
            className="animate-spin h-5 w-5 text-[var(--champagne)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-light">Loading...</span>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
