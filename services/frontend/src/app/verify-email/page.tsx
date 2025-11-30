'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Initialize status based on token presence - derived state
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>(
    token ? 'loading' : 'no-token'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token || status === 'no-token') {
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/verification/verify?token=${token}`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          // Redirect to educator dashboard after 3 seconds
          setTimeout(() => {
            router.push('/educator');
          }, 3000);
        } else {
          const error = await response.json();
          setStatus('error');
          setMessage(error.message || 'Verification failed. The link may be expired or invalid.');
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again.');
      }
    };

    verifyEmail();
  }, [token, router, status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--cream)] to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-[var(--champagne)]">LUMÉRA</h1>
            <p className="text-xs tracking-[0.3em] text-[var(--text-muted)] mt-1">BEAUTY ACADEMY</p>
          </Link>
        </div>

        {/* Card */}
        <div className="card-premium p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-[var(--champagne-light)] rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--champagne)] animate-spin" />
              </div>
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-2">
                Verifying Your Email
              </h2>
              <p className="text-[var(--text-secondary)] font-light">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-2">
                Email Verified!
              </h2>
              <p className="text-[var(--text-secondary)] font-light mb-6">
                {message}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Redirecting you to your dashboard...
              </p>
              <div className="mt-6">
                <Link href="/educator" className="btn-primary">
                  Go to Dashboard
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-2">
                Verification Failed
              </h2>
              <p className="text-[var(--text-secondary)] font-light mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link href="/login" className="btn-primary w-full block text-center">
                  Go to Login
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary w-full"
                >
                  Try Again
                </button>
              </div>
            </>
          )}

          {status === 'no-token' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-[var(--champagne-light)] rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-[var(--champagne)]" />
              </div>
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-2">
                Check Your Email
              </h2>
              <p className="text-[var(--text-secondary)] font-light mb-6">
                We&apos;ve sent a verification link to your email address. Click the link to verify your account.
              </p>
              <div className="bg-[var(--cream)] rounded-lg p-4 mb-6">
                <p className="text-sm text-[var(--text-muted)]">
                  Didn&apos;t receive the email? Check your spam folder or request a new verification link.
                </p>
              </div>
              <Link href="/login" className="btn-secondary w-full block text-center">
                Back to Login
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Need help?{' '}
          <Link href="/contact" className="text-[var(--champagne)] hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[var(--cream)] to-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[var(--champagne)] animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
