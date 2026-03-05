'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/components/auth/auth-context';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (loading || user) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimedOut(true);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loading, user]);

  const showFailureState = !loading && !user && timedOut;

  const message = loading
    ? 'Please wait while we finalize your session.'
    : showFailureState
      ? 'No session was created. This usually means the Supabase Google provider or redirect URL is configured incorrectly.'
      : 'Finalizing your Google sign-in...';

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        color: '#fff',
        textAlign: 'center',
        background:
          'radial-gradient(110% 90% at 10% 10%, rgba(89, 142, 255, 0.24), transparent 56%), radial-gradient(110% 90% at 90% 0%, rgba(255, 85, 164, 0.22), transparent 54%), linear-gradient(180deg, #060a18 0%, #0a1025 45%, #040712 100%)',
      }}
    >
      <div
        style={{
          width: 'min(560px, 100%)',
          borderRadius: 20,
          padding: '28px 20px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))',
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.2), 0 20px 45px rgba(0,0,0,0.34)',
          backdropFilter: 'blur(12px) saturate(125%)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 4.8vw, 2rem)' }}>
          Completing Google sign-in...
        </h1>
        <p style={{ marginTop: 12, opacity: 0.9, lineHeight: 1.6 }}>{message}</p>
        {showFailureState ? (
          <div style={{ marginTop: 18 }}>
            <p style={{ margin: 0, opacity: 0.82, lineHeight: 1.6 }}>
              Check Supabase Google provider settings and confirm the allowed redirect URL includes
              `http://localhost:3000/auth/callback`.
            </p>
            <Link
              href="/auth"
              style={{
                marginTop: 16,
                display: 'inline-block',
                color: '#fff',
                textDecoration: 'underline',
              }}
            >
              Back to sign in
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
