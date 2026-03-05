'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <header className="na-navbar-wrap">
        <nav className="na-navbar" aria-label="Main Navigation">
          <Link href="/" className="na-brand" aria-label="NailArt AI Home">
            <span className="na-logo" aria-hidden="true">
              <svg
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                role="presentation"
              >
                <defs>
                  <linearGradient id="na-logo-grad" x1="6" y1="4" x2="58" y2="60">
                    <stop offset="0" stopColor="#57D0FF" />
                    <stop offset="0.5" stopColor="#7B5CFF" />
                    <stop offset="1" stopColor="#FF6F91" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#na-logo-grad)" />
                <rect
                  x="4"
                  y="4"
                  width="56"
                  height="56"
                  rx="14"
                  stroke="rgba(255,255,255,0.35)"
                />
                <path
                  d="M17 46V18h8l14 17V18h8v28h-8L25 29v17h-8Z"
                  fill="rgba(255,255,255,0.95)"
                />
                <path d="M40 24.5L50 32L40 39.5V24.5Z" fill="rgba(12,16,36,0.78)" />
              </svg>
            </span>
          </Link>

          <ul className="na-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          <div className="na-action">
            <Link href="/auth" className="na-generate-btn">
              Generate
            </Link>
          </div>
        </nav>
      </header>

      <style jsx>{`
        .na-navbar-wrap {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 30;
          pointer-events: none;
          padding: 0;
        }

        .na-navbar {
          pointer-events: auto;
          width: 100%;
          min-height: 72px;
          border-radius: 0;
          padding: 14px clamp(16px, 3vw, 36px);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          background: transparent;
          box-shadow: none;
          backdrop-filter: none;
        }

        .na-brand {
          display: inline-flex;
          align-items: center;
          color: #f7f9ff;
          text-decoration: none;
          justify-self: start;
        }

        .na-logo {
          width: 44px;
          height: 44px;
          display: inline-flex;
          flex-shrink: 0;
        }

        .na-logo svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .na-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: clamp(16px, 3.2vw, 38px);
          justify-self: center;
        }

        .na-links a {
          color: rgba(248, 251, 255, 0.9);
          text-decoration: none;
          font-size: 0.96rem;
          letter-spacing: 0.03em;
          transition: color 0.2s ease;
        }

        .na-links a:hover {
          color: #ffffff;
        }

        .na-action {
          justify-self: end;
        }

        .na-generate-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          padding: 0 18px;
          border-radius: 12px;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.08)
          );
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.3),
            0 10px 24px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(6px) saturate(120%);
        }

        @media (max-width: 860px) {
          .na-navbar {
            grid-template-columns: 1fr auto;
            gap: 12px;
            padding: 12px;
          }

          .na-links {
            grid-column: 1 / -1;
            width: 100%;
            justify-content: center;
            gap: 20px;
            padding: 2px 0 4px;
          }

        }

        @media (max-width: 520px) {
          .na-logo {
            width: 40px;
            height: 40px;
          }

          .na-links a {
            font-size: 0.9rem;
          }

          .na-generate-btn {
            height: 38px;
            padding: 0 14px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}
