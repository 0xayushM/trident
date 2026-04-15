'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealText } from './animations';

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

// ─── 6 steps positioned at the loop gaps in the path ───────────────────────────────────
const STEPS = [
  {
    pct:         0.05,
    number:      1,
    icon:        '🤝',
    title:       'Verified Partnership Agreement',
    description: 'Formal trade agreement, compliance checks, and comprehensive buyer onboarding process.',
    side:        'right' as const,   // label placed to this side of the dot
  },
  {
    pct:         0.21,
    number:      2,
    icon:        '🏭',
    title:       'Supplier Due Diligence',
    description: 'Factory inspections, ethical sourcing verification, and regulatory compliance checks.',
    side:        'left' as const,
  },
  {
    pct:         0.38,
    number:      3,
    icon:        '✅',
    title:       'Pre-Shipment Quality Assurance',
    description: 'Independent third-party inspection with lab reports shared in real time.',
    side:        'right' as const,
  },
  {
    pct:         0.54,
    number:      4,
    icon:        '📑',
    title:       'Airtight Documentation',
    description: 'Bill of Lading, Certificate of Origin, Insurance, and all compliance certificates.',
    side:        'left' as const,
  },
  {
    pct:         0.71,
    number:      5,
    icon:        '📍',
    title:       'End-to-End Cargo Visibility',
    description: 'Live tracking with proactive milestone updates throughout the journey.',
    side:        'right' as const,
  },
  {
    pct:         0.87,
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
        start:      'top 5%',
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
      className="w-full relative bg-[#f4f4f2] overflow-hidden"
      style={{ minHeight: 'clamp(100vh, 200vh, 400vh)' }}
    >

      {/* Sticky header */}
      <div
        className="sticky top-0 z-30 flex flex-col items-center py-8 md:py-16 lg:py-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #f4f4f2 65%, transparent 100%)',
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.16em] text-red-500 font-semibold uppercase mb-2">
          How It Works
        </span>
        <h2
          className="unica-text font-bold tracking-tight text-slate-900 mb-0"
          style={{
            fontSize: 'clamp(24px, 3.5vw, 52px)',
          }}
        >
          Trail of Shipment
        </h2>
      </div>

      {/* SVG container: full width */}
      <div className="relative w-full overflow-hidden">

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
          className="block w-full h-auto pointer-events-none select-none"
          style={{
            filter: 'opacity(0.05) saturate(0)',
          }}
        />

        {/*
          Animated overlay SVG.
          Uses the exact same viewBox + preserveAspectRatio as tos.svg so that
          every coordinate maps to the same pixel as in the background img.

          NO overflow:visible here — clipped to the container bounds.
        */}
        <svg
          viewBox="0 0 705 1955"
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

        {/* ── Step labels positioned inside loop gaps with ScrollRevealText ── */}
        {milestones.map((pt, i) => {
          const step = STEPS[i];
          const reached = started && activeStep >= i;
          
          // Calculate position in viewport coordinates
          // SVG viewBox is 705x1955, we need to convert to percentage
          const topPercent = (pt.y / 1955) * 100;
          const leftPercent = (pt.x / 705) * 100;
          
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${topPercent}%`,
                left: `${leftPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '280px',
                maxWidth: '90vw',
                pointerEvents: 'none',
              }}
            >
              <div className="text-center">
                <h3 
                  className="unica-text font-bold tracking-tight text-slate-900 mb-2"
                  style={{
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    opacity: reached ? 1 : 0.3,
                    transition: 'opacity 0.45s',
                  }}
                >
                  {step.title}
                </h3>
                <div
                  style={{
                    opacity: reached ? 1 : 0.2,
                    transition: 'opacity 0.45s',
                  }}
                >
                  <ScrollRevealText
                    text={step.description}
                    containerRef={sectionRef}
                    className="text-sm md:text-base leading-[1.4]"
                  />
                </div>
              </div>
            </div>
          );
        })}
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
