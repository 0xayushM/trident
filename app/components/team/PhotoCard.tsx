'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface PhotoCardProps {
  src: string;
  name: string;
  flip?: boolean;
}

export default function PhotoCard({ src, name, flip = false }: PhotoCardProps) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  // chamfer is proportional — larger on bigger cards
  const C = Math.round(Math.max(36, Math.min(w * 0.13, 56)));

  // SVG polygon points for the chamfered shape (cut top-right + bottom-left)
  // 0,0 → W-C,0 → W,C → W,H → C,H → 0,H-C → close
  const pts = w > 0
    ? `0,0 ${w - C},0 ${w},${C} ${w},${h} ${C},${h} 0,${h - C}`
    : '';

  const cssClip = w > 0
    ? `polygon(0 0, calc(100% - ${C}px) 0, 100% ${C}px, 100% 100%, ${C}px 100%, 0 calc(100% - ${C}px))`
    : undefined;

  // The "shadow plate" polygon — shifted +10px right +10px down
  const shadowPts = w > 0
    ? `${10},${10} ${w - C + 10},${10} ${w + 10},${C + 10} ${w + 10},${h + 10} ${C + 10},${h + 10} ${10},${h - C + 10}`
    : '';

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0"
      style={{ width: '100%', aspectRatio: '3 / 4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Shadow / offset plate ───────────────────────────────────────── */}
      {w > 0 && (
        <svg
          className="absolute pointer-events-none"
          style={{
            top: 0, left: 0,
            width: w + 14,
            height: h + 14,
            overflow: 'visible',
            transition: 'opacity 0.45s ease',
            opacity: hovered ? 0.55 : 0.18,
            zIndex: 0,
          }}
          aria-hidden
        >
          <polygon
            points={shadowPts}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1"
          />
        </svg>
      )}

      {/* ── Image with clip ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: cssClip }}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover object-top"
          style={{
            filter:     hovered ? 'grayscale(0%) contrast(1.05)' : 'grayscale(88%) contrast(1.08)',
            transform:  hovered ? 'scale(1.04)' : 'scale(1.0)',
            transition: 'filter 0.55s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1)',
            transformOrigin: 'top center',
          }}
          sizes="(max-width: 768px) 80vw, 26vw"
          quality={90}
        />

        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 45%)' }}
        />
      </div>

      {/* ── SVG overlay: chamfer border + chamfer fill + detail marks ───── */}
      {w > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none overflow-visible"
          width={w}
          height={h}
          aria-hidden
          style={{ zIndex: 10 }}
        >
          {/* main chamfered border */}
          <polygon
            points={pts}
            fill="none"
            stroke={hovered ? '#ef4444' : 'rgba(226,232,240,0.7)'}
            strokeWidth={hovered ? 1.2 : 1}
            style={{ transition: 'stroke 0.4s ease, stroke-width 0.3s ease' }}
          />

          {/* red fill triangle at top-right chamfer */}
          <polygon
            points={`${w - C},0 ${w},0 ${w},${C}`}
            fill={hovered ? '#ef4444' : 'rgba(239,68,68,0.55)'}
            style={{ transition: 'fill 0.35s ease' }}
          />

          {/* ghost outline triangle offset slightly inward */}
          <polygon
            points={`${w - C + 6},0 ${w},0 ${w},${C - 6}`}
            fill="none"
            stroke={hovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}
            strokeWidth="0.8"
            style={{ transition: 'stroke 0.35s ease' }}
          />

          {/* bottom-left chamfer — subtle dark fill */}
          <polygon
            points={`0,${h - C} ${C},${h} 0,${h}`}
            fill={hovered ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.18)'}
            style={{ transition: 'fill 0.4s ease' }}
          />

          {/* ── vertex accent dots ── */}
          {/* top-right outer corner where chamfer meets — dot at the joint */}
          <circle
            cx={w - C}
            cy={0}
            r={2.5}
            fill="#ef4444"
            opacity={hovered ? 1 : 0.5}
            style={{ transition: 'opacity 0.3s ease' }}
          />
          <circle
            cx={w}
            cy={C}
            r={2.5}
            fill="#ef4444"
            opacity={hovered ? 1 : 0.5}
            style={{ transition: 'opacity 0.3s ease' }}
          />

          {/* bottom-left chamfer dots */}
          <circle
            cx={C}
            cy={h}
            r={2.5}
            fill="#ef4444"
            opacity={hovered ? 0.8 : 0.28}
            style={{ transition: 'opacity 0.3s ease' }}
          />
          <circle
            cx={0}
            cy={h - C}
            r={2.5}
            fill="#ef4444"
            opacity={hovered ? 0.8 : 0.28}
            style={{ transition: 'opacity 0.3s ease' }}
          />

          {/* ── horizontal scan-line at 72% height — appears on hover ── */}
          <line
            x1={0}
            y1={Math.round(h * 0.72)}
            x2={w}
            y2={Math.round(h * 0.72)}
            stroke="rgba(239,68,68,0.35)"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity={hovered ? 1 : 0}
            style={{ transition: 'opacity 0.4s ease' }}
          />

          {/* ── top-left bracket ── */}
          <path
            d={`M 0 14 L 0 0 L 14 0`}
            fill="none"
            stroke={hovered ? '#ef4444' : 'rgba(239,68,68,0.4)'}
            strokeWidth="1.5"
            strokeLinecap="square"
            style={{ transition: 'stroke 0.35s ease' }}
          />

          {/* ── bottom-right bracket ── */}
          <path
            d={`M ${w} ${h - 14} L ${w} ${h} L ${w - 14} ${h}`}
            fill="none"
            stroke={hovered ? '#ef4444' : 'rgba(239,68,68,0.4)'}
            strokeWidth="1.5"
            strokeLinecap="square"
            style={{ transition: 'stroke 0.35s ease' }}
          />

          {/* ── thin red left edge bar that slides up on hover ── */}
          <line
            x1={0}
            y1={h}
            x2={0}
            y2={hovered ? h - C : h}
            stroke="#ef4444"
            strokeWidth="2.5"
            style={{ transition: 'y2 0.55s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
      )}
    </div>
  );
}
