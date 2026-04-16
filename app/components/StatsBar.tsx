'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// ─── Data ──────────────────────────────────────────────────────────────────────

const HERO_STATS = [
  {
    num:     80,
    suffix:  '%+',
    label:   'Repeat Buyer Rate',
    context: 'Buyers keep coming back — because the product is right every time.',
    delay:   0,
  },
  { 
    num: 500, 
    suffix: '+',
    label: 'Shipments Brokered',
    context: 'We handle the paperwork and background checks so you can focus on growth.',
    delay: 80,
  },
  {
    num:     100,
    suffix:  '%',
    label:   'Documentation Clearance',
    context: 'Zero FDA holds. Zero customs rejections. Ever.',
    delay:   120,
  },
];

const SUPPORT_STATS = [
    {
    num:     24,
    suffix:  ' hr',
    label:   'Quote Turnaround',
    delay:   240,
  },
  { num: 7,   suffix: '+', label: 'Years in Operation',  delay: 160 },
  { num: 50,  suffix: '+', label: 'Certified Suppliers', delay: 240 },
];

// ─── Count-up hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, active: boolean): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) { setCount(0); return; }
    let startTime: number | null = null;

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const pct   = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setCount(Math.floor(eased * target));
      if (pct < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
}

// ─── Hero stat card ────────────────────────────────────────────────────────────

function HeroStat({
  num, suffix, label, context, delay,
}: (typeof HERO_STATS)[0]) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (inView && !fired) {
      const t = setTimeout(() => setFired(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, fired, delay]);

  const count = useCountUp(num, 1400, fired);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-6 py-8 md:py-10 relative group"
      style={{
        opacity:    fired ? 1 : 0,
        transform:  fired ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Red glow behind number */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)' }}
      />

      {/* Number */}
      <div className="flex items-baseline leading-none mb-3 relative z-10">
        <span
          className="unica-text font-bold tabular-nums text-white"
          style={{ fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {count}
        </span>
        <span
          className="unica-text font-bold text-red-500"
          style={{
            fontSize:    'clamp(32px, 4vw, 54px)',
            lineHeight:  1,
            marginLeft:  suffix.startsWith(' ') ? '0.2em' : '0.04em',
            letterSpacing: '-0.02em',
          }}
        >
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p
        className="font-mono text-white uppercase tracking-[0.18em] mb-3 relative z-10"
        style={{ fontSize: 'clamp(9px, 0.9vw, 11px)' }}
      >
        {label}
      </p>

      {/* Red rule */}
      <div
        className="h-px bg-red-500/50 mb-3 relative z-10 transition-all duration-500"
        style={{ width: fired ? '32px' : '0px' }}
      />

      {/* Context line */}
      <p
        className="text-white/35 leading-relaxed relative z-10 max-w-[220px]"
        style={{ fontSize: 'clamp(11px, 0.85vw, 13px)' }}
      >
        {context}
      </p>
    </div>
  );
}

// ─── Support stat ──────────────────────────────────────────────────────────────

function SupportStat({
  num, suffix, label, delay,
}: (typeof SUPPORT_STATS)[0]) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (inView && !fired) {
      const t = setTimeout(() => setFired(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, fired, delay]);

  const count = useCountUp(num, 1200, fired);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-4 py-6 md:py-8"
      style={{
        opacity:    fired ? 1 : 0,
        transform:  fired ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="flex items-baseline leading-none mb-2">
        <span
          className="unica-text font-bold text-white/80 tabular-nums"
          style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          {count}
        </span>
        <span
          className="unica-text font-bold text-red-500"
          style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', lineHeight: 1, marginLeft: '0.05em' }}
        >
          {suffix}
        </span>
      </div>
      <p
        className="font-mono text-white/35 uppercase tracking-[0.16em]"
        style={{ fontSize: 'clamp(9px, 0.8vw, 11px)' }}
      >
        {label}
      </p>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function StatsBar() {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#080808' }}>

      {/* Coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Eyebrow */}
      <div className="relative z-10 flex justify-center pt-12 pb-2">
        <span className="font-mono text-[10px] text-red-500 tracking-[0.28em] uppercase">
          Proven Track Record
        </span>
      </div>

      {/* ── Hero stats row ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
          {HERO_STATS.map(s => (
            <HeroStat key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mx-auto max-w-5xl px-4">
        <div className="h-px bg-white/8" />
      </div>

      {/* ── Support stats row ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-3 divide-x divide-white/8">
          {SUPPORT_STATS.map(s => (
            <SupportStat key={s.label} {...s} />
          ))}
        </div>
      </div>

    </div>
  );
}
