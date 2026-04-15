'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitReveal from './animations/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

// ─── SVG dimensions ─────────────────────────────────────────────────────────
const VB_H       = 1497;
const VB_W_DESK  = 1110;
const VB_W_MOB   = 724;

// Desktop path arms: left x≈306, right x≈779
const ARM_L_DESK = 306;
const ARM_R_DESK = 779;

// Mobile path arms: left x≈117, right x≈590
const ARM_L_MOB  = 117;
const ARM_R_MOB  = 590;

const TRAIL_D_DESK =
  'M2.35254 57.7771C2.35254 57.7771 716.853 -27.2225 779.353 57.7771C841.853 142.777 ' +
  '821.726 214.177 779.353 297.777C695.752 462.713 391.375 133.83 305.853 297.777C' +
  '261.24 383.3 261.24 459.254 305.853 544.777C391.375 708.725 699.558 377.966 779.353 544.777C' +
  '817.522 624.571 817.522 691.483 779.353 771.277C699.558 938.088 393.13 608.257 305.853 771.277C' +
  '259.127 858.554 259.127 937.5 305.853 1024.78C393.13 1187.8 703.345 856.207 779.353 1024.78C' +
  '813.624 1100.78 813.624 1162.27 779.353 1238.28C703.345 1406.85 382.745 1070.11 305.853 1238.28C' +
  '270.695 1315.17 243.353 1419.28 305.853 1454.78C368.353 1490.28 1047.07 1475.5 1102.85 1454.78';

const TRAIL_D_MOB =
  'M3.1875 57.7773C3.1875 57.7773 528.188 -27.2226 590.688 57.7771C653.188 142.777 ' +
  '633.061 214.177 590.688 297.777C507.087 462.713 202.71 133.83 117.188 297.777C' +
  '72.5748 383.3 72.5748 459.254 117.188 544.777C202.71 708.724 510.893 377.966 590.688 544.777C' +
  '628.857 624.571 628.857 691.483 590.688 771.277C510.893 938.088 204.465 608.257 117.188 771.277C' +
  '70.4616 858.554 70.4616 937.5 117.188 1024.78C204.465 1187.8 514.68 856.207 590.688 1024.78C' +
  '624.959 1100.78 624.959 1162.27 590.688 1238.28C514.68 1406.85 194.08 1070.11 117.188 1238.28C' +
  '82.0299 1315.17 54.6875 1419.28 117.188 1454.78C179.688 1490.28 660.904 1475.5 716.688 1454.78';

// ─── Step data (gapY only — gapX is computed from arm positions at render time) ─
const STEPS = [
  {
    pct:         0.168,
    side:        'left' as const,  // card in LEFT interior (steps with right-side milestone)
    gapY:        178,
    number:      1,
    title:       'Verified Partnership Agreement',
    description: 'Formal trade agreement, compliance checks, and comprehensive buyer onboarding.',
  },
  {
    pct:         0.302,
    side:        'right' as const, // card in RIGHT interior
    gapY:        421,
    number:      2,
    title:       'Supplier Due Diligence',
    description: 'Factory audits, ethical sourcing verification, and regulatory compliance.',
  },
  {
    pct:         0.435,
    side:        'left' as const,
    gapY:        658,
    number:      3,
    title:       'Pre-Shipment Quality Assurance',
    description: 'Third-party inspection with lab reports shared in real time.',
  },
  {
    pct:         0.569,
    side:        'right' as const,
    gapY:        898,
    number:      4,
    title:       'Airtight Documentation',
    description: 'Bill of Lading, Certificate of Origin, Insurance, and compliance certificates.',
  },
  {
    pct:         0.701,
    side:        'left' as const,
    gapY:        1132,
    number:      5,
    title:       'End-to-End Cargo Visibility',
    description: 'Live tracking with proactive milestone updates throughout the journey.',
  },
  {
    pct:         0.830,
    side:        'right' as const,
    gapY:        1347,
    number:      6,
    title:       'Secure Payment & Settlement',
    description: 'Letter of Credit, TT, escrow options with full transparency.',
  },
];

// ─── Animated SVG Icons (pathLength=1 stroke-draw technique) ─────────────────
function StepIcon({ n, active }: { n: number; active: boolean }) {
  const color = active ? '#ef4444' : '#cbd5e1';
  const offset = active ? 0 : 1;
  const transition = 'stroke-dashoffset 0.8s cubic-bezier(0.65,0,0.35,1), stroke 0.4s';

  const shared = {
    fill:             'none'    as const,
    stroke:           color,
    strokeWidth:      1.6,
    strokeLinecap:    'round'  as const,
    strokeLinejoin:   'round'  as const,
    pathLength:       1,
    strokeDasharray:  1,
    strokeDashoffset: offset,
    style:            { transition },
  };

  const icons: React.ReactNode[] = [
    // 1 – Handshake (partnership)
    <svg key={1} viewBox="0 0 24 24" className="w-10 h-10 md:w-[60px] md:h-[60px] lg:w-30 lg:h-30" fill="none">
      <path {...shared} d="M9 11V8H7l-4 4 4 4h2v-3" />
      <path {...shared} d="M15 11V8h2l4 4-4 4h-2v-3" />
      <path {...shared} d="M9 11h6M9 13h6" />
      <path {...shared} d="M12 8V5" />
      <path {...shared} d="M12 19v3" />
    </svg>,

    // 2 – Factory (supplier)
    <svg key={2} viewBox="0 0 24 24" className="w-10 h-10 md:w-[60px] md:h-[60px] lg:w-30 lg:h-30" fill="none">
      <path {...shared} d="M2 20V9l6 4V9l6 4V5h4v15H2z" />
      <path {...shared} d="M10 20v-5h4v5" />
      <path {...shared} d="M18 2v3" />
      <path {...shared} d="M3 20h18" />
    </svg>,

    // 3 – Magnifying glass + check (quality)
    <svg key={3} viewBox="0 0 24 24" className="w-10 h-10 md:w-[60px] md:h-[60px] lg:w-30 lg:h-30" fill="none">
      <circle {...shared} cx={11} cy={11} r={7} />
      <path {...shared} d="M16.5 16.5L22 22" />
      <path {...shared} d="M8 11l2.5 2.5L15 8" />
    </svg>,

    // 4 – Document + lines (documentation)
    <svg key={4} viewBox="0 0 24 24" className="w-10 h-10 md:w-[60px] md:h-[60px] lg:w-30 lg:h-30" fill="none">
      <path {...shared} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path {...shared} d="M14 2v6h6" />
      <path {...shared} d="M8 13h8M8 17h5" />
    </svg>,

    // 5 – Map pin + signal waves (tracking)
    <svg key={5} viewBox="0 0 24 24" className="w-10 h-10 md:w-[60px] md:h-[60px] lg:w-30 lg:h-30" fill="none">
      <path {...shared} d="M12 21C12 21 5 14 5 9a7 7 0 0 1 14 0c0 5-7 12-7 12z" />
      <circle {...shared} cx={12} cy={9} r={2.5} />
      <path {...shared} d="M3.5 6.5C5.5 2 18.5 2 20.5 6.5" />
    </svg>,

    // 6 – Credit card + shield (payment)
    <svg key={6} viewBox="0 0 24 24" className="w-10 h-10 md:w-[60px] md:h-[60px] lg:w-30 lg:h-30" fill="none">
      <rect {...shared} x={2} y={5} width={20} height={14} rx={2} />
      <path {...shared} d="M2 10h20" />
      <path {...shared} d="M6 15h4M14 15h3" />
      <path {...shared} d="M12 11l1 1-1 1-1-1z" />
    </svg>,
  ];

  return <>{icons[n - 1]}</>;
}

type Point = { x: number; y: number };

export default function Tos() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const drawPathRef = useRef<SVGPathElement>(null);

  const [dotPos,     setDotPos]     = useState<Point>({ x: 2, y: 58 });
  const [milestones, setMilestones] = useState<Point[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [started,    setStarted]    = useState(false);
  const [mobile,     setMobile]     = useState(false);

  // Detect screen size
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Derived config
  const vbW    = mobile ? VB_W_MOB   : VB_W_DESK;
  const trailD = mobile ? TRAIL_D_MOB : TRAIL_D_DESK;
  const armL   = mobile ? ARM_L_MOB  : ARM_L_DESK;
  const armR   = mobile ? ARM_R_MOB  : ARM_R_DESK;

  // Gap X: 30% into interior for left cards, 70% for right cards
  const gapXFor = (side: 'left' | 'right') =>
    side === 'left'
      ? armL + (armR - armL) * 0.50
      : armL + (armR - armL) * 0.50;

  // (Re-)init GSAP when path changes (mobile ↔ desktop)
  useEffect(() => {
    const pathEl = drawPathRef.current;
    if (!pathEl || !sectionRef.current) return;

    let st: ScrollTrigger | null = null;

    const raf = requestAnimationFrame(() => {
      const totalLen = pathEl.getTotalLength();

      setMilestones(
        STEPS.map(s => {
          const pt = pathEl.getPointAtLength(s.pct * totalLen);
          return { x: pt.x, y: pt.y };
        })
      );

      gsap.set(pathEl, {
        strokeDasharray:  totalLen,
        strokeDashoffset: totalLen,
      });

      const p0 = pathEl.getPointAtLength(0);
      setDotPos({ x: p0.x, y: p0.y });

      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   'top 20%',
        end:     'bottom bottom',
        scrub:   1.2,
        onUpdate(self) {
          const drawn = self.progress * totalLen;
          gsap.set(pathEl, { strokeDashoffset: totalLen - drawn });
          const pt = pathEl.getPointAtLength(Math.min(drawn, totalLen - 1));
          setDotPos({ x: pt.x, y: pt.y });

          let active = -1;
          for (let i = 0; i < STEPS.length; i++) {
            if (self.progress >= STEPS[i].pct) active = i;
          }
          setActiveStep(active);
          setStarted(self.progress > 0.005);
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      st?.kill();
    };
  }, [mobile]); // re-init when switching path

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100vh] overflow-hidden bg-[#f4f4f2]"
    >
      {/* ── Sticky heading ── */}
      <div className="sticky top-0 z-30 flex flex-col items-center pt-10 pb-8 md:pt-16 md:pb-12 pointer-events-none bg-[linear-gradient(to_bottom,#f4f4f2_72%,transparent_100%)]">
        <span className="font-mono text-[11px] tracking-[0.16em] text-red-500 font-semibold uppercase mb-2">
          How It Works
        </span>
        <h2 className="unica-text font-bold tracking-tight text-slate-900 text-3xl md:text-4xl lg:text-5xl xl:text-[52px]">
          Trail of Shipment
        </h2>
      </div>

      {/* ── Full-width aspect-ratio canvas ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${vbW} / ${VB_H}` }}
      >
        {/* ── Overlay SVG ── */}
        <svg
          viewBox={`0 0 ${vbW} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {/* Ghost trail */}
          <path
            d={trailD}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={42}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Animated draw trail */}
          <path
            ref={drawPathRef}
            d={trailD}
            fill="none"
            stroke="#0f172a"
            strokeWidth={42}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Milestone circles ON the path */}
          {milestones.map((pt, i) => {
            const reached = started && activeStep >= i;
            return (
              <g key={i}>
                <circle
                  cx={pt.x} cy={pt.y} r={30}
                  fill="none"
                  stroke={reached ? '#ef4444' : 'rgba(0,0,0,0.12)'}
                  strokeWidth={2.5}
                  style={{ transition: 'stroke 0.4s' }}
                />
                <circle
                  cx={pt.x} cy={pt.y} r={17}
                  fill={reached ? '#ef4444' : 'rgba(0,0,0,0.14)'}
                  style={{ transition: 'fill 0.4s' }}
                />
                <text
                  x={pt.x} y={pt.y + 5}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={reached ? '#fff' : 'rgba(0,0,0,0.3)'}
                  fontFamily='"Haas Unica","Helvetica Neue",sans-serif'
                  style={{ transition: 'fill 0.4s' }}
                >
                  {String(STEPS[i].number).padStart(2, '0')}
                </text>
              </g>
            );
          })}

          {/* Moving red dot at tip */}
          <circle cx={dotPos.x} cy={dotPos.y} r={26} fill="rgba(239,68,68,0.18)"
            style={{ opacity: started ? 1 : 0, transition: 'opacity 0.3s' }} />
          <circle cx={dotPos.x} cy={dotPos.y} r={13} fill="#ef4444"
            style={{ opacity: started ? 1 : 0, transition: 'opacity 0.3s' }} />
          <circle cx={dotPos.x} cy={dotPos.y} r={4.5} fill="#fff"
            style={{ opacity: started ? 1 : 0, transition: 'opacity 0.3s' }} />
        </svg>

        {/* ── Step cards inside loop gaps ── */}
        {STEPS.map((step, i) => {
          const reached  = started && activeStep >= i;
          const gapX     = gapXFor(step.side);
          const leftPct  = (gapX / vbW) * 100;
          const topPct   = (step.gapY / VB_H) * 100;
          
          // Alternate layout: odd steps (1,3,5) icon left, even steps (2,4,6) icon right
          const isOdd = step.number % 2 === 1;

          return (
            <div
              key={i}
              className="absolute pointer-events-none w-full flex justify-center"
              style={{
                left:      `${leftPct}%`,
                top:       `${topPct}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className={`flex items-center gap-4 md:gap-6 ${isOdd ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Animated SVG icon */}
                <div
                  className="flex-shrink-0"
                  style={{
                    opacity:    reached ? 1 : 0,
                    transform:  reached ? 'scale(1)' : 'scale(0.4)',
                    transition: 'opacity 0.5s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  <StepIcon n={step.number} active={reached} />
                </div>

                {/* Text block */}
                <div className={`w-full max-w-[200px] md:max-w-[350px] lg:max-w-[450px] ${isOdd ? 'text-left' : 'text-right'}`}>
                  <SplitReveal
                    text={step.title}
                    active={reached}
                    className="unica-text font-bold text-slate-900 leading-tight mb-0.5 text-xs md:text-xl lg:text-2xl"
                  />

                  {/* Description */}
                  <SplitReveal
                    text={step.description}
                    active={reached}
                    className="text-slate-500 leading-snug text-[10px] md:text-sm lg:text-lg tracking-tighter leading-[0.8]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-[6vh]" />
    </section>
  );
}
