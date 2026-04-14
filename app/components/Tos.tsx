'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Winding trail path from tos.svg (viewBox 0 0 600 1500) ──────────────────
const TRAIL_D =
  'M0 29.0732C164.324 29.0732 356.699 19.9167 420.777 29.0732C484.854 38.2297 ' +
  '580.544 48.6929 571.573 192.571C562.602 336.448 493.398 346.476 451.534 354.76C' +
  '409.67 363.044 270.408 354.76 233.243 354.76C196.078 354.76 89.2816 363.48 ' +
  '93.9806 513.026C98.6796 662.571 173.437 669.983 233.243 678.267C293.049 686.551 ' +
  '411.806 668.239 451.534 678.267C491.262 688.295 566.874 709.222 571.573 843.508C' +
  '576.272 977.794 451.534 995.234 451.534 995.234C451.534 995.234 287.495 1000.03 ' +
  '233.243 1000.47C178.99 1000.9 85.4369 1023.57 93.9806 1167.02C102.524 1310.46 ' +
  '186.252 1307.84 233.243 1322.23C280.233 1336.62 428.893 1317.43 451.534 1322.23C' +
  '474.175 1327.02 566.019 1347.95 570.291 1475.7C574.563 1603.44 501.087 1626.12 ' +
  '451.534 1626.12C401.981 1626.12 233.243 1626.12 233.243 1626.12C233.243 1626.12 ' +
  '86.9324 1639.63 93.7674 1780.89C100.602 1922.16 233.029 1917.8 233.029 1917.8L704 1930';

// ─── 6 steps evenly spread across the path ───────────────────────────────────
const STEPS = [
  {
    pct:         0.08,
    number:      1,
    icon:        '🤝',
    title:       'Verified Partnership Agreement',
    description: 'Formal trade agreement, compliance checks, and comprehensive buyer onboarding.',
    side:        'right' as const,   // label placed to this side of the dot
  },
  {
    pct:         0.24,
    number:      2,
    icon:        '🏭',
    title:       'Supplier Due Diligence',
    description: 'Factory inspections, ethical sourcing verification, and regulatory compliance checks.',
    side:        'left' as const,
  },
  {
    pct:         0.40,
    number:      3,
    icon:        '✅',
    title:       'Pre-Shipment Quality Assurance',
    description: 'Independent third-party inspection with lab reports shared in real time.',
    side:        'right' as const,
  },
  {
    pct:         0.57,
    number:      4,
    icon:        '📑',
    title:       'Airtight Documentation',
    description: 'Bill of Lading, Certificate of Origin, Insurance, and all compliance certificates.',
    side:        'left' as const,
  },
  {
    pct:         0.73,
    number:      5,
    icon:        '📍',
    title:       'End-to-End Cargo Visibility',
    description: 'Live tracking with proactive milestone updates throughout the journey.',
    side:        'right' as const,
  },
  {
    pct:         0.88,
    number:      6,
    icon:        '💳',
    title:       'Secure Payment & Settlement',
    description: 'Letter of Credit, TT, escrow options with full transparency and documentation.',
    side:        'left' as const,
  },
];

type Point = { x: number; y: number };

export default function Tos() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const drawPathRef = useRef<SVGPathElement>(null);

  const [dotPos,      setDotPos]      = useState<Point>({ x: 300, y: 30 });
  const [milestones,  setMilestones]  = useState<Point[]>([]);
  const [activeStep,  setActiveStep]  = useState(-1);   // -1 = not started
  const [started,     setStarted]     = useState(false);

  useEffect(() => {
    const pathEl = drawPathRef.current;
    if (!pathEl || !sectionRef.current) return;

    const raf = requestAnimationFrame(() => {
      const totalLen = pathEl.getTotalLength();

      // Compute exact point on path for every milestone
      setMilestones(
        STEPS.map(s => {
          const pt = pathEl.getPointAtLength(s.pct * totalLen);
          return { x: pt.x, y: pt.y };
        })
      );

      // Initialise draw: nothing visible yet
      gsap.set(pathEl, {
        strokeDasharray:  totalLen,
        strokeDashoffset: totalLen,
      });

      // Dot at path start
      const p0 = pathEl.getPointAtLength(0);
      setDotPos({ x: p0.x, y: p0.y });

      ScrollTrigger.create({
        trigger:    sectionRef.current,
        start:      'top top',
        end:        'bottom bottom',
        scrub:      1.2,
        onUpdate(self) {
          const drawn = self.progress * totalLen;

          // Advance the stroke
          gsap.set(pathEl, { strokeDashoffset: totalLen - drawn });

          // Move dot to tip of drawn stroke
          const pt = pathEl.getPointAtLength(Math.min(drawn, totalLen - 1));
          setDotPos({ x: pt.x, y: pt.y });

          // Which step is active (last one whose pct we've passed)
          let active = -1;
          for (let i = 0; i < STEPS.length; i++) {
            if (self.progress >= STEPS[i].pct) active = i;
          }
          setActiveStep(active);
          if (self.progress > 0.005) setStarted(true);
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const currentStep = activeStep >= 0 ? STEPS[activeStep] : STEPS[0];

  return (
    <section
      ref={sectionRef}
      style={{
        width:    '100vw',
        position: 'relative',
        background: '#f4f4f2',
        // Contain everything — no bleed into adjacent sections
        overflow: 'hidden',
      }}
    >

      {/* ── Sticky header ── */}
      <div
        style={{
          position:      'sticky',
          top:           0,
          zIndex:        30,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          paddingTop:    36,
          paddingBottom: 32,
          background:    'linear-gradient(to bottom, #f4f4f2 65%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily:    'monospace',
            fontSize:      11,
            letterSpacing: '0.16em',
            color:         '#ef4444',
            fontWeight:    600,
            textTransform: 'uppercase',
            marginBottom:  8,
          }}
        >
          How It Works
        </span>
        <h2
          style={{
            fontFamily:    '"Haas Unica", "Helvetica Neue", sans-serif',
            fontSize:      'clamp(24px, 3.5vw, 52px)',
            fontWeight:    700,
            letterSpacing: '-0.04em',
            color:         '#0f172a',
            margin:        0,
          }}
        >
          Trail of Shipment
        </h2>
      </div>

      {/* ── SVG container: full width, auto height ── */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>

        {/*
          Background img: the original infographic faded heavily.
          It acts as a very faint structural guide but doesn't show the
          black trail prominently — that job is the overlay SVG.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/tos.svg"
          alt=""
          aria-hidden
          style={{
            display:       'block',
            width:         '100%',
            height:        'auto',
            // strip the original black trail to ~5% so it's invisible
            filter:        'opacity(0.05) saturate(0)',
            pointerEvents: 'none',
            userSelect:    'none',
          }}
        />

        {/*
          Animated overlay SVG.
          Uses the exact same viewBox + preserveAspectRatio as tos.svg so that
          every coordinate maps to the same pixel as in the background img.

          NO overflow:visible here — clipped to the container bounds.
        */}
        <svg
          viewBox="0 0 600 1500"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          style={{
            position: 'absolute',
            inset:    0,
            width:    '100%',
            height:   '100%',
            // Clip to container — fixes bleed into next section
            overflow: 'hidden',
          }}
        >
          {/* ── Ghost trail — single thin, very light path ── */}
          <path
            d={TRAIL_D}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={46}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Animated drawn trail ── */}
          <path
            ref={drawPathRef}
            d={TRAIL_D}
            fill="none"
            stroke="#0f172a"
            strokeWidth={46}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Step milestone markers (exact positions via getPointAtLength) ── */}
          {milestones.map((pt, i) => {
            const step    = STEPS[i];
            const reached = started && activeStep >= i;
            // Label x: offset 70 units left or right depending on side
            const lx      = step.side === 'right' ? pt.x + 58 : pt.x - 58;
            const anchor  = step.side === 'right' ? 'start'   : 'end';

            return (
              <g key={i}>
                {/* Outer ring */}
                <circle
                  cx={pt.x} cy={pt.y} r={32}
                  fill="none"
                  stroke={reached ? '#ef4444' : 'rgba(0,0,0,0.10)'}
                  strokeWidth={3}
                  style={{ transition: 'stroke 0.45s' }}
                />
                {/* Filled dot */}
                <circle
                  cx={pt.x} cy={pt.y} r={18}
                  fill={reached ? '#ef4444' : 'rgba(0,0,0,0.12)'}
                  style={{ transition: 'fill 0.45s' }}
                />
                {/* Step number */}
                <text
                  x={pt.x} y={pt.y + 5}
                  textAnchor="middle"
                  fontSize={13} fontWeight={700}
                  fill={reached ? '#fff' : 'rgba(0,0,0,0.35)'}
                  fontFamily='"Haas Unica","Helvetica Neue",sans-serif'
                  style={{ transition: 'fill 0.45s' }}
                >
                  {String(step.number).padStart(2, '0')}
                </text>
                {/* Title */}
                <text
                  x={lx} y={pt.y - 8}
                  textAnchor={anchor}
                  fontSize={15} fontWeight={700}
                  letterSpacing="0.02em"
                  fill={reached ? '#0f172a' : 'rgba(0,0,0,0.18)'}
                  fontFamily='"Haas Unica","Helvetica Neue",sans-serif'
                  style={{ transition: 'fill 0.45s' }}
                >
                  {step.title}
                </text>
                {/* Description — wraps at ~28 chars */}
                {step.description.match(/.{1,30}(\s|$)/g)?.slice(0, 2).map((line, li) => (
                  <text
                    key={li}
                    x={lx} y={pt.y + 12 + li * 18}
                    textAnchor={anchor}
                    fontSize={12} fontWeight={400}
                    fill={reached ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.13)'}
                    fontFamily='"Haas Unica","Helvetica Neue",sans-serif'
                    style={{ transition: 'fill 0.45s' }}
                  >
                    {line.trim()}
                  </text>
                ))}
              </g>
            );
          })}

          {/* ── Moving red dot at the tip of the drawn stroke ── */}
          <circle
            cx={dotPos.x} cy={dotPos.y} r={28}
            fill="rgba(239,68,68,0.18)"
            style={{ opacity: started ? 1 : 0, transition: 'opacity 0.3s' }}
          />
          <circle
            cx={dotPos.x} cy={dotPos.y} r={14}
            fill="#ef4444"
            style={{ opacity: started ? 1 : 0, transition: 'opacity 0.3s' }}
          />
          <circle
            cx={dotPos.x} cy={dotPos.y} r={5}
            fill="#fff"
            style={{ opacity: started ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        </svg>
      </div>

      {/* ── Sticky bottom bar: current step info + progress dots ── */}
      <div
        style={{
          position:      'sticky',
          bottom:        0,
          zIndex:        30,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           10,
          padding:       '18px 24px 26px',
          background:    'linear-gradient(to top, #f4f4f2 65%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        {/* Current step label */}
        <p
          key={activeStep}
          style={{
            fontFamily:    '"Haas Unica","Helvetica Neue",sans-serif',
            fontSize:      'clamp(11px, 1.1vw, 14px)',
            fontWeight:    600,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color:         '#0f172a',
            margin:        0,
            animation:     'tos-label-in 0.35s ease',
          }}
        >
          {currentStep.title}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width:        i === activeStep ? 24 : 6,
                height:       6,
                borderRadius: 3,
                background:   i <= activeStep ? '#0f172a' : 'rgba(0,0,0,0.15)',
                transition:   'all 0.35s ease',
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <span
          style={{
            position:      'absolute',
            right:         'clamp(20px, 4vw, 56px)',
            bottom:        26,
            fontFamily:    'monospace',
            fontSize:      11,
            letterSpacing: '0.1em',
            color:         'rgba(0,0,0,0.28)',
          }}
        >
          {String(Math.max(1, activeStep + 1)).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </span>
      </div>

      <style>{`
        @keyframes tos-label-in {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
