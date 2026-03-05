'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/components/auth/auth-context';
import Navbar from '@/components/main/navbar';

export default function AuthPage() {
  const { loading, user, signInWithGoogle, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return fallback;
  };

  const onGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          'Google sign-in failed. Check your Supabase and Google OAuth configuration.',
        ),
      );
      setIsLoading(false);
    }
  };

  const onSignOut = async () => {
    try {
      setErrorMessage(null);
      await signOut();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Sign out failed. Please try again.'));
    }
  };

  return (
    <main className="auth-page">
      <Navbar />

      <section className="auth-shell">
        <div className="auth-orb auth-orb--one" aria-hidden="true" />
        <div className="auth-orb auth-orb--two" aria-hidden="true" />

        <div className="auth-grid">
          <section className="auth-media">
            <div className="auth-media-inner">
              <div className="auth-video-wrap">
                <iframe
                  className="auth-video"
                  src="https://www.youtube.com/embed/7TQLNzg9zv4?autoplay=1&mute=1&loop=1&playlist=7TQLNzg9zv4&playsinline=1&rel=0&modestbranding=1"
                  title="Featured YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="auth-display-block">
                <p className="auth-media-label">Create. Test. Publish.</p>
                <h2 className="auth-display-title">NAILART</h2>
              </div>
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-card">
              <p className="auth-kicker">NailArt AI</p>
              <h1>{user ? 'You are signed in' : 'Sign in to start generating thumbnails'}</h1>
              <p className="auth-subtitle">
                {user
                  ? `Signed in as ${user.email ?? 'Google user'}. You can continue creating high-impact YouTube thumbnail concepts.`
                  : 'Continue with Google to access your workspace and create high-impact YouTube thumbnail concepts.'}
              </p>

              {!loading && !user ? (
                <button
                  type="button"
                  onClick={onGoogleSignIn}
                  disabled={isLoading}
                  className="auth-google-btn"
                >
                  {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
                </button>
              ) : null}

              {loading ? <p className="auth-status">Checking your session...</p> : null}
              {user ? (
                <div className="auth-actions">
                  <Link href="/" className="auth-link-btn">
                    Go to Home
                  </Link>
                  <button type="button" onClick={onSignOut} className="auth-ghost-btn">
                    Sign Out
                  </button>
                </div>
              ) : null}
              {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
            </div>
          </section>
        </div>
      </section>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #ffffff;
          background:
            radial-gradient(120% 90% at 10% 10%, rgba(89, 142, 255, 0.26), transparent 56%),
            radial-gradient(120% 90% at 90% 0%, rgba(255, 85, 164, 0.22), transparent 52%),
            linear-gradient(180deg, #060a18 0%, #0a1025 45%, #040712 100%);
        }

        .auth-shell {
          min-height: 100vh;
          padding: 96px 20px 28px;
          display: grid;
          place-items: center;
          position: relative;
        }

        .auth-grid {
          width: min(1320px, 100%);
          min-height: calc(100vh - 132px);
          display: grid;
          grid-template-columns: 3fr 2fr;
          border-radius: 30px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.03));
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.12),
            0 28px 60px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(10px) saturate(120%);
          position: relative;
          z-index: 1;
        }

        .auth-media {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(120% 100% at 0% 0%, rgba(77, 141, 255, 0.34), transparent 56%),
            radial-gradient(90% 80% at 100% 10%, rgba(255, 88, 162, 0.24), transparent 56%),
            linear-gradient(145deg, #10192d 0%, #090d17 52%, #04070d 100%);
        }

        .auth-media::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.34);
          z-index: 0;
        }

        .auth-media-inner {
          position: relative;
          z-index: 1;
          min-height: 100%;
          padding: clamp(20px, 3.2vw, 34px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
        }

        .auth-video-wrap {
          width: min(100%, 720px);
          aspect-ratio: 16 / 9;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.42);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.16),
            0 20px 40px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(8px);
        }

        .auth-video {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        .auth-display-block {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
        }

        .auth-media-label {
          margin: 0;
          font-size: 0.82rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.76;
        }

        .auth-display-title {
          margin: 0;
          font-size: clamp(4.5rem, 12vw, 9.5rem);
          line-height: 0.86;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.96);
          text-shadow: 0 14px 36px rgba(0, 0, 0, 0.48);
        }

        .auth-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(20px, 3vw, 34px);
          background: linear-gradient(180deg, rgba(10, 14, 25, 0.52), rgba(8, 10, 18, 0.24));
        }

        .auth-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(44px);
          pointer-events: none;
        }

        .auth-orb--one {
          width: 220px;
          height: 220px;
          left: max(6vw, 24px);
          top: 26%;
          background: rgba(86, 206, 255, 0.34);
        }

        .auth-orb--two {
          width: 240px;
          height: 240px;
          right: max(8vw, 28px);
          bottom: 18%;
          background: rgba(255, 96, 162, 0.3);
        }

        .auth-card {
          width: min(540px, 100%);
          border-radius: 24px;
          padding: clamp(24px, 5vw, 40px);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05));
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.2),
            0 24px 50px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(12px) saturate(124%);
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .auth-kicker {
          margin: 0;
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.82;
        }

        h1 {
          margin: 14px 0 0;
          font-size: clamp(1.9rem, 5vw, 2.7rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 8px 28px rgba(0, 0, 0, 0.36);
        }

        .auth-subtitle {
          margin: 14px auto 0;
          max-width: 44ch;
          font-size: clamp(0.98rem, 2vw, 1.07rem);
          line-height: 1.6;
          opacity: 0.9;
          text-shadow: 0 5px 20px rgba(0, 0, 0, 0.34);
        }

        .auth-google-btn {
          width: 100%;
          margin-top: 28px;
          height: 52px;
          border: 0;
          border-radius: 14px;
          cursor: pointer;
          color: #ffffff;
          font-size: 1rem;
          letter-spacing: 0.02em;
          font-family: inherit;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.08));
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.3),
            0 12px 24px rgba(0, 0, 0, 0.24);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            opacity 0.18s ease;
        }

        .auth-google-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.34),
            0 16px 28px rgba(0, 0, 0, 0.28);
        }

        .auth-google-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
          transform: none;
        }

        .auth-status {
          margin: 20px 0 0;
          font-size: 0.95rem;
          opacity: 0.82;
        }

        .auth-actions {
          margin-top: 24px;
          display: inline-flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .auth-link-btn,
        .auth-ghost-btn {
          height: 42px;
          border-radius: 11px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-family: inherit;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
        }

        .auth-link-btn {
          color: #ffffff;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.1));
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.28),
            0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .auth-ghost-btn {
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: transparent;
          color: rgba(255, 255, 255, 0.92);
          cursor: pointer;
        }

        .auth-error {
          margin: 14px 0 0;
          color: #ffd2d9;
          font-size: 0.9rem;
          line-height: 1.45;
        }

        @media (max-width: 640px) {
          .auth-shell {
            padding-top: 92px;
          }

          .auth-grid {
            border-radius: 22px;
          }

          .auth-media-inner {
            padding: 16px;
          }

          .auth-card {
            border-radius: 20px;
            padding: 24px 18px;
          }
        }

        @media (max-width: 980px) {
          .auth-grid {
            grid-template-columns: 1fr;
          }

          .auth-media {
            min-height: 420px;
          }

          .auth-video-wrap {
            width: 100%;
          }

          .auth-display-title {
            font-size: clamp(3.6rem, 14vw, 7rem);
          }
        }
      `}</style>
    </main>
  );
}
