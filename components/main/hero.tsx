'use client';

import React, { useEffect, useRef } from 'react';

export type AetherHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
  overlayGradient?: string;
  textColor?: string;
  fragmentSource?: string;
  dprMax?: number;
  clearColor?: [number, number, number, number];
  height?: string | number;
  className?: string;
  ariaLabel?: string;
  showPreview?: boolean;
};

const DEFAULT_FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define S smoothstep
#define MN min(R.x,R.y)
float pattern(vec2 uv) {
  float d=.0;
  for (float i=.0; i<3.; i++) {
    uv.x+=sin(T*(1.+i)+uv.y*1.5)*.2;
    d+=.005/abs(uv.x);
  }
  return d;
}
vec3 scene(vec2 uv) {
  vec3 col=vec3(0);
  uv=vec2(atan(uv.x,uv.y)*2./6.28318,-log(length(uv))+T);
  for (float i=.0; i<3.; i++) {
    int k=int(mod(i,3.));
    col[k]+=pattern(uv+i*6./MN);
  }
  return col;
}
void main() {
  vec2 uv=(FC-.5*R)/MN;
  vec3 col=vec3(0);
  float s=12., e=9e-4;
  col+=e/(sin(uv.x*s)*cos(uv.y*s));
  uv.y+=R.x>R.y?.5:.5*(R.y/R.x);
  col+=scene(uv);
  O=vec4(col,1.);
}`;

const VERT_SRC = `#version 300 es
precision highp float;
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

const compileShader = (gl: WebGL2RenderingContext, src: string, type: number) => {
  const sh = gl.createShader(type);
  if (!sh) {
    throw new Error('Failed to create shader');
  }
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh) || 'Unknown shader error';
    gl.deleteShader(sh);
    throw new Error(info);
  }
  return sh;
};

const createProgram = (gl: WebGL2RenderingContext, vs: string, fs: string) => {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram();
  if (!prog) {
    gl.deleteShader(v);
    gl.deleteShader(f);
    throw new Error('Failed to create program');
  }
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog) || 'Program link error';
    gl.deleteProgram(prog);
    throw new Error(info);
  }
  return prog;
};

export default function AetherHero({
  title = 'Create Better YouTube Thumbnails with NailArt AI',
  subtitle = 'Describe your video topic and style, then generate multiple high-impact thumbnail directions instantly for faster publishing.',
  ctaLabel = 'Get Started Free',
  ctaHref = '#',
  secondaryCtaLabel = 'See Sample Thumbnails',
  secondaryCtaHref = '#',
  align = 'center',
  maxWidth = 960,
  overlayGradient = 'linear-gradient(180deg, #00000099, #00000040 40%, transparent)',
  textColor = '#ffffff',
  fragmentSource = DEFAULT_FRAG,
  dprMax = 2,
  clearColor = [0, 0, 0, 1],
  height = '100vh',
  className = '',
  ariaLabel = 'Aurora hero background',
  showPreview = true,
}: AetherHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufRef = useRef<WebGLBuffer | null>(null);
  const uniTimeRef = useRef<WebGLUniformLocation | null>(null);
  const uniResRef = useRef<WebGLUniformLocation | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!gl) {
      return;
    }

    let prog: WebGLProgram;
    try {
      prog = createProgram(gl, VERT_SRC, fragmentSource);
    } catch (error) {
      console.error(error);
      return;
    }
    programRef.current = prog;

    const verts = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buf = gl.createBuffer();
    if (!buf) {
      gl.deleteProgram(prog);
      return;
    }
    bufRef.current = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    gl.useProgram(prog);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    uniTimeRef.current = gl.getUniformLocation(prog, 'time');
    uniResRef.current = gl.getUniformLocation(prog, 'resolution');

    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);

    const fit = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, dprMax));
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      const width = Math.floor(cssW * dpr);
      const heightPx = Math.floor(cssH * dpr);
      if (canvas.width !== width || canvas.height !== heightPx) {
        canvas.width = width;
        canvas.height = heightPx;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    fit();
    const onResize = () => fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    window.addEventListener('resize', onResize);

    const loop = (now: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      if (uniResRef.current) {
        gl.uniform2f(uniResRef.current, canvas.width, canvas.height);
      }
      if (uniTimeRef.current) {
        gl.uniform1f(uniTimeRef.current, now * 1e-3);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (bufRef.current) {
        gl.deleteBuffer(bufRef.current);
      }
      if (programRef.current) {
        gl.deleteProgram(programRef.current);
      }
    };
  }, [fragmentSource, dprMax, clearColor]);

  const justify =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
  const textAlign =
    align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
  const contentMaxWidth = showPreview ? Math.max(maxWidth + 220, 1120) : maxWidth;

  return (
    <section
      className={['aurora-hero', className].join(' ')}
      style={{ height, position: 'relative', overflow: 'hidden' }}
      aria-label="Hero"
    >
      <style jsx>{`
        .aurora-inner {
          width: 100%;
          max-width: ${contentMaxWidth}px;
          margin-inline: auto;
          display: grid;
          grid-template-columns: ${
            showPreview ? 'minmax(0, 1.06fr) minmax(300px, 0.94fr)' : '1fr'
          };
          gap: clamp(20px, 4vw, 56px);
          align-items: center;
          justify-items: ${showPreview ? 'stretch' : 'center'};
        }

        .aurora-kicker {
          margin: 0 0 14px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          opacity: 0.84;
        }

        .aurora-preview-wrap {
          display: flex;
          justify-content: center;
        }

        .aurora-preview-frame {
          width: min(100%, 480px);
          aspect-ratio: 1 / 1;
          border-radius: 26px;
          padding: 14px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04));
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 20px 48px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(8px) saturate(120%);
        }

        .aurora-preview-caption {
          margin: 12px 0 0;
          text-align: center;
          font-size: 0.82rem;
          line-height: 1.4;
          letter-spacing: 0.03em;
          opacity: 0.78;
        }

        .aurora-preview-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        @media (max-width: 980px) {
          .aurora-inner {
            grid-template-columns: 1fr;
            max-width: min(${contentMaxWidth}px, 720px);
          }

          .aurora-preview-wrap {
            margin-top: 6px;
          }

          .aurora-preview-frame {
            width: min(100%, 460px);
          }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="aurora-canvas"
        role="img"
        aria-label={ariaLabel}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          touchAction: 'none',
        }}
      />

      <div
        className="aurora-overlay"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: overlayGradient,
          pointerEvents: 'none',
        }}
      />

      <div
        className="aurora-content"
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          padding: 'min(6vw, 64px)',
          color: textColor,
        }}
      >
        <div className="aurora-inner">
          <div
            style={{
              width: '100%',
              maxWidth,
              marginInline: align === 'center' ? 'auto' : undefined,
              textAlign,
            }}
          >
            <p className="aurora-kicker">NailArt AI | YouTube Thumbnail Generator</p>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
                lineHeight: 1.04,
                letterSpacing: '-0.02em',
                fontWeight: 700,
                textShadow: '0 6px 36px rgba(0,0,0,0.45)',
              }}
            >
              {title}
            </h1>

            {subtitle ? (
              <p
                style={{
                  marginTop: '1rem',
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  lineHeight: 1.6,
                  opacity: 0.9,
                  textShadow: '0 4px 24px rgba(0,0,0,0.35)',
                  maxWidth: 900,
                  marginInline: align === 'center' ? 'auto' : undefined,
                }}
              >
                {subtitle}
              </p>
            ) : null}

            {(ctaLabel || secondaryCtaLabel) && (
              <div
                style={{
                  display: 'inline-flex',
                  gap: '12px',
                  marginTop: '2rem',
                  flexWrap: 'wrap',
                }}
              >
                {ctaLabel ? (
                  <a
                    href={ctaHref}
                    className="aurora-btn aurora-btn--primary"
                    style={{
                      padding: '12px 18px',
                      borderRadius: 12,
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.06))',
                      color: textColor,
                      textDecoration: 'none',
                      fontWeight: 600,
                      boxShadow:
                        'inset 0 0 0 1px rgba(255,255,255,.28), 0 10px 30px rgba(0,0,0,.2)',
                      backdropFilter: 'blur(6px) saturate(120%)',
                    }}
                  >
                    {ctaLabel}
                  </a>
                ) : null}

                {secondaryCtaLabel ? (
                  <a
                    href={secondaryCtaHref}
                    className="aurora-btn aurora-btn--ghost"
                    style={{
                      padding: '12px 18px',
                      borderRadius: 12,
                      background: 'transparent',
                      color: textColor,
                      opacity: 0.85,
                      textDecoration: 'none',
                      fontWeight: 600,
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.28)',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    {secondaryCtaLabel}
                  </a>
                ) : null}
              </div>
            )}
          </div>

          {showPreview ? (
            <div className="aurora-preview-wrap" aria-hidden="true">
              <div className="aurora-preview-frame">
                <svg
                  className="aurora-preview-svg"
                  viewBox="0 0 640 640"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="presentation"
                >
                  <defs>
                    <linearGradient id="bg" x1="24" y1="0" x2="632" y2="640" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0B1434" />
                      <stop offset="0.42" stopColor="#301459" />
                      <stop offset="1" stopColor="#04203A" />
                    </linearGradient>
                    <linearGradient id="thumbMain" x1="94" y1="188" x2="524" y2="388" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6939FF" />
                      <stop offset="0.5" stopColor="#FF4D85" />
                      <stop offset="1" stopColor="#FFB44D" />
                    </linearGradient>
                    <linearGradient id="thumbAltA" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#57D0FF" />
                      <stop offset="1" stopColor="#3E7BFF" />
                    </linearGradient>
                    <linearGradient id="thumbAltB" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#FFD166" />
                      <stop offset="1" stopColor="#FF6F91" />
                    </linearGradient>
                  </defs>

                  <rect x="10" y="10" width="620" height="620" rx="38" fill="url(#bg)" />
                  <rect x="10" y="10" width="620" height="620" rx="38" stroke="rgba(255,255,255,0.22)" />

                  <rect x="48" y="52" width="544" height="78" rx="14" fill="rgba(5,10,26,0.45)" stroke="rgba(255,255,255,0.18)" />
                  <rect x="78" y="80" width="208" height="16" rx="8" fill="rgba(255,255,255,0.9)" />
                  <rect x="78" y="104" width="142" height="10" rx="5" fill="rgba(255,255,255,0.55)" />
                  <rect x="474" y="78" width="88" height="28" rx="14" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.28)" />

                  <rect x="80" y="166" width="480" height="268" rx="20" fill="rgba(7,14,32,0.58)" stroke="rgba(255,255,255,0.18)" />
                  <rect x="96" y="186" width="448" height="172" rx="16" fill="url(#thumbMain)" />
                  <rect x="116" y="208" width="184" height="22" rx="11" fill="rgba(255,255,255,0.93)" />
                  <rect x="116" y="238" width="140" height="16" rx="8" fill="rgba(255,255,255,0.62)" />
                  <rect x="116" y="262" width="206" height="16" rx="8" fill="rgba(255,255,255,0.62)" />
                  <rect x="116" y="294" width="124" height="40" rx="12" fill="rgba(8,12,30,0.38)" stroke="rgba(255,255,255,0.35)" />

                  <rect x="98" y="376" width="246" height="42" rx="12" fill="rgba(255,255,255,0.08)" />
                  <rect x="112" y="390" width="214" height="14" rx="7" fill="rgba(255,255,255,0.5)" />

                  <g transform="translate(118 466) rotate(-6)">
                    <rect x="0" y="0" width="188" height="116" rx="14" fill="rgba(8,14,34,0.62)" stroke="rgba(255,255,255,0.18)" />
                    <rect x="10" y="10" width="168" height="64" rx="10" fill="url(#thumbAltA)" />
                    <rect x="12" y="84" width="128" height="10" rx="5" fill="rgba(255,255,255,0.6)" />
                    <rect x="12" y="98" width="90" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
                  </g>

                  <g transform="translate(334 462) rotate(6)">
                    <rect x="0" y="0" width="188" height="116" rx="14" fill="rgba(8,14,34,0.62)" stroke="rgba(255,255,255,0.18)" />
                    <rect x="10" y="10" width="168" height="64" rx="10" fill="url(#thumbAltB)" />
                    <rect x="12" y="84" width="122" height="10" rx="5" fill="rgba(255,255,255,0.6)" />
                    <rect x="12" y="98" width="100" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
                  </g>
                </svg>
                <p className="aurora-preview-caption">
                  Generate and compare multiple thumbnail concepts from one prompt.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { AetherHero };
