'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// ─── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  {
    num:    500,
    suffix: '+',
    label:  'Shipments\nBrokered',
    fill:   100,   // progress bar fill %
    icon: (
      <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
           stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="16" height="11" rx="1.5" />
        <path d="M6 6V4a4 4 0 0 1 8 0v2" />
        <path d="M2 10h16" />
      </svg>
    ),
  },
  {
    num:    7,
    suffix: '+',
    label:  'Years in\nOperation',
    fill:   70,
    icon: (
      <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
           stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 5v5l3 3" />
      </svg>
    ),
  },
  {
    num:    100,
    suffix: '%',
    label:  'Documentation\nClearance Rate',
    fill:   100,
    icon: (
      <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
           stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10l4 4 8-8" />
      </svg>
    ),
  },
  {
    num:    80,
    suffix: '%+',
    label:  'Repeat\nBuyer Rate',
    fill:   80,
    icon: (
      <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
           stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8A7 7 0 1 1 9.4 3.1" />
        <path d="M17 3v5h-5" />
      </svg>
    ),
  },
  {
    num:    50,
    suffix: '+',
    label:  'Certified\nSuppliers',
    fill:   50,
    icon: (
      <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
           stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="3" />
        <circle cx="14" cy="7" r="3" />
        <path d="M1 17c0-3 2.7-5 6-5" />
        <path d="M19 17c0-3-2.7-5-6-5" />
        <path d="M10 17c0-2.5 2-4 4-4" />
      </svg>
    ),
  },
  {
    num:    24,
    suffix: ' hr',
    label:  'Quote\nTurnaround',
    fill:   24,   // out of 24 → full circle
    icon: (
      <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
           stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H7L2 7v6l5 5h6l5-5V7l-5-5z" />
        <path d="M10 7v3l2 2" />
      </svg>
    ),
  },
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
      const pct = Math.min((ts - startTime) / duration, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - pct, 3);
      setCount(Math.floor(eased * target));
      if (pct < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
}

// ─── Single stat ───────────────────────────────────────────────────────────────

function StatItem({
  num, suffix, label, fill, icon, delay,
}: (typeof STATS)[0] & { delay: number }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (inView && !fired) {
      const t = setTimeout(() => setFired(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, fired, delay]);

  const count = useCountUp(num, 1100, fired);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center gap-0 cursor-default select-none
                 px-2 py-5 md:py-7 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* Number */}
      <div className="flex items-baseline gap-0 leading-none mb-2">
        <span
          className="unica-text font-bold tracking-tight tabular-nums transition-colors duration-300"
          style={{
            fontSize:   'clamp(38px, 4.5vw, 60px)',
            lineHeight: 1,
            color:      hovered ? '#ef4444' : '#0f172a',
          }}
        >
          {count}
        </span>
        <span
          className="unica-text font-bold tracking-tight transition-colors duration-300"
          style={{
            fontSize:   'clamp(22px, 2.6vw, 34px)',
            lineHeight: 1,
            color:      '#ef4444',
            marginLeft: suffix.startsWith(' ') ? '0.25em' : '0.05em',
          }}
        >
          {suffix}
        </span>
      </div>

      {/* Label with icon */}
      <div className="flex flex-col items-center gap-1.5 mt-1">
        <span
          className="font-mono text-center leading-tight transition-colors duration-300"
          style={{
            fontSize:      'clamp(9px, 0.85vw, 11px)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:          hovered ? '#64748b' : '#94a3b8',
            whiteSpace:    'pre-line',
          }}
        >
          {label}
        </span>
        <span
          className="transition-colors duration-300"
          style={{ color: hovered ? '#ef4444' : '#cbd5e1' }}
        >
          {icon}
        </span>
      </div>

      {/* Bottom hover accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-red-500 transition-all duration-300"
        style={{ width: hovered ? '40px' : '0px' }}
      />
    </div>
  );
}

// ─── Divider between items ─────────────────────────────────────────────────────

function Slash() {
  return (
    <div className="hidden md:flex items-center justify-center flex-shrink-0 self-stretch py-4">
      <span
        className="unica-text text-slate-200 font-light select-none"
        style={{ fontSize: 'clamp(24px, 3vw, 40px)', lineHeight: 1 }}
      >
        /
      </span>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function StatsBar() {
  return (
    <div className="w-full bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Desktop: single row with slash dividers */}
        <div className="hidden md:flex items-stretch">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-stretch flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <StatItem {...stat} delay={i * 80} />
              </div>
              {i < STATS.length - 1 && <Slash />}
            </div>
          ))}
        </div>

        {/* Mobile: 3×2 grid */}
        <div className="grid grid-cols-3 md:hidden divide-x divide-y divide-slate-100">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 80} />
          ))}
        </div>
      </div>
    </div>
  );
}
