'use client';

import { useEffect, useRef, useId } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Clip-path path builder
// ─────────────────────────────────────────────────────────────────────────────

interface CardPathConfig {
  W: number; H: number;
  stepFlatW: number; stepH: number; stepDiagW: number; stepRadius: number;
  tr: number;
  slotDepth: number; slotFlatH: number; slotAngleH: number;
  slotPosPct: number; slotIR: number; slotER: number;
  br: number; bl: number;
}

function buildCardPath(c: CardPathConfig): string {
  const { W, H, stepFlatW: fw, stepH, stepDiagW: dw, stepRadius: sr,
    tr, slotDepth: sd, slotFlatH, slotAngleH, slotPosPct, slotIR, slotER, br, bl } = c;

  // Step diagonal unit vector
  const diagLen = Math.sqrt(dw * dw + stepH * stepH);
  const ddx = dw / diagLen, ddy = stepH / diagLen;
  const sr2 = Math.min(sr, fw / 2, stepH / 2, diagLen / 2 - 1);

  // Step corners A, B, C
  const A  = { s: [0, stepH + sr2],    cp: [0, stepH],    e: [sr2, stepH] };
  const B  = { s: [fw - sr2, stepH],   cp: [fw, stepH],   e: [fw + sr2 * ddx, stepH - sr2 * ddy] };
  const C  = { s: [fw + dw - sr2 * ddx, sr2 * ddy], cp: [fw + dw, 0], e: [fw + dw + sr2, 0] };

  // Slot geometry
  const slMid = H * (slotPosPct / 100);
  const slT   = slMid - slotFlatH / 2 - slotAngleH;
  const slB   = slMid + slotFlatH / 2 + slotAngleH;
  const slFT  = slMid - slotFlatH / 2;
  const slFB  = slMid + slotFlatH / 2;
  const taLen = Math.sqrt(sd * sd + slotAngleH * slotAngleH);
  const tadx  = sd / taLen, tady = slotAngleH / taLen;
  const ir = Math.min(slotIR, slotFlatH / 2, sd / 2);
  const er = Math.min(slotER, slotAngleH / 2);

  const pt = (x: number, y: number) => `${+x.toFixed(2)},${+y.toFixed(2)}`;

  return [
    `M ${pt(...A.s as [number,number])}`,
    `Q ${pt(...A.cp as [number,number])} ${pt(...A.e as [number,number])}`,
    `L ${pt(...B.s as [number,number])}`,
    `Q ${pt(...B.cp as [number,number])} ${pt(...B.e as [number,number])}`,
    `L ${pt(...C.s as [number,number])}`,
    `Q ${pt(...C.cp as [number,number])} ${pt(...C.e as [number,number])}`,
    `L ${W - tr},0`,
    `Q ${W},0 ${W},${tr}`,
    // Slot entry
    `L ${W},${slT - er}`,
    `Q ${W},${slT} ${pt(W - er * tadx, slT + er * tady)}`,
    `L ${pt(W - sd + ir * tadx, slFT - ir * tady)}`,
    `Q ${pt(W - sd, slFT)} ${pt(W - sd, slFT + ir)}`,
    `L ${pt(W - sd, slFB - ir)}`,
    `Q ${pt(W - sd, slFB)} ${pt(W - sd + ir * tadx, slFB + ir * tady)}`,
    `L ${pt(W - er * tadx, slB - er * tady)}`,
    `Q ${W},${slB} ${W},${slB + er}`,
    // Bottom
    `L ${W},${H - br}`,
    `Q ${W},${H} ${W - br},${H}`,
    `L ${bl},${H}`,
    `Q 0,${H} 0,${H - bl}`,
    `L ${pt(...A.s as [number,number])} Z`,
  ].join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — swap this out for your CMS / props
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_DATA = {
  eyebrow: '04',
  title: 'Yard Networks',
  body: 'Terminal YOS™ was built to scale to all of the yards in your network. This means deep TMS/WMS integrations; a modular platform that can be tuned to each yard; customizable analytics; and single pane of glass visibility to each yard, and all yards, through the Terminal platform.',
  // How many characters of body are "bright" vs "faded"
  // Matches the Terminal site's scroll-reveal fade effect
  brightChars: 120,
  lanes: [
    { id: '8',  active: false },
    { id: '9',  active: false },
    { id: '10', active: true  },
    { id: '12', active: false },
    { id: '13', active: false },
  ],
  gateLabel: 'GATE OPEN',
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function BlueprintGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(80,140,255,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(80,140,255,0.07) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
      }}
    />
  );
}

function DockHeader() {
  return (
    <div style={{ height: 52, display: 'flex', gap: 6, marginBottom: 10 }}>
      {[1, 2.4, 1].map((flex, i) => (
        <div
          key={i}
          style={{
            flex,
            border: '0.5px solid rgba(80,140,255,0.2)',
            borderRadius: 3,
            background: 'rgba(80,140,255,0.03)',
          }}
        />
      ))}
    </div>
  );
}

function LaneGrid({ lanes }: { lanes: typeof SECTION_DATA.lanes }) {
  return (
    <div style={{
      display: 'flex',
      flex: 1,
      borderTop: '0.5px solid rgba(80,140,255,0.15)',
    }}>
      {lanes.map((lane, i) => (
        <div
          key={lane.id}
          style={{
            flex: 1,
            borderRight: i < lanes.length - 1 ? '0.5px solid rgba(80,140,255,0.15)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 8,
            background: lane.active ? 'rgba(160,240,30,0.05)' : 'transparent',
            transition: 'background 0.3s',
          }}
        >
          {/* Lane number */}
          <span style={{
            fontFamily: 'monospace',
            fontSize: 10,
            color: lane.active ? 'rgba(160,240,30,0.6)' : 'rgba(120,170,255,0.4)',
            marginBottom: 8,
            letterSpacing: '0.04em',
          }}>
            {lane.id}
          </span>

          {/* Truck slot */}
          <div style={{
            flex: 1,
            width: 'calc(100% - 8px)',
            marginBottom: 10,
            border: `0.5px solid ${lane.active ? '#7ab820' : 'rgba(80,140,255,0.18)'}`,
            borderRadius: 3,
            background: lane.active ? '#3d600a' : 'rgba(80,140,255,0.04)',
            position: 'relative',
            transition: 'all 0.3s',
          }}>
            {/* Cab silhouette */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              left: '12%', right: '12%',
              height: '30%',
              border: `0.5px solid ${lane.active ? 'rgba(160,240,30,0.45)' : 'rgba(80,140,255,0.22)'}`,
              borderRadius: 2,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

const CARD_W = 600;
const CARD_H = 800;

const CARD_PATH_CONFIG: CardPathConfig = {
  W: CARD_W, H: CARD_H,
  stepFlatW:  200, stepH: 30,  stepDiagW: 30, stepRadius: 12,
  tr: 24,
  slotDepth:  30, slotFlatH: 200,  slotAngleH: 30,
  slotPosPct: 30, slotIR:    10,  slotER: 7,
  br: 40, bl: 40,
};

function YardCard({ data }: { data: typeof SECTION_DATA }) {
  const clipId = `yard-clip-${useId().replace(/:/g, '')}`;
  const d = buildCardPath(CARD_PATH_CONFIG);

  return (
    <>
      {/* Hidden SVG clip-path definition */}
      <svg
        width={0} height={0}
        aria-hidden
        style={{ position: 'absolute', overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={d} />
          </clipPath>
        </defs>
      </svg>

      <div style={{
        width: 'calc(50vw - 10px)',
        minHeight: '100vh',
        margin: '10px',
        background: '#0b0d11',
        clipPath: `url(#${clipId})`,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* <BlueprintGrid /> */}

        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px 20px',
        }}>
          {/* <DockHeader /> */}
          {/* <LaneGrid lanes={data.lanes} /> */}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-faded body text  (bright leading chars → faded trailing chars)
// Mirrors Terminal's progressive text reveal on scroll
// ─────────────────────────────────────────────────────────────────────────────

function FadedBodyText({
  text,
  brightChars,
}: {
  text: string;
  brightChars: number;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Walk up DOM to find the parent section for scroll context
    if (ref.current) {
      sectionRef.current = ref.current.closest('section');
    }

    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      // 0 = text top just entered viewport, 1 = text fully past
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.6)));

      // How many chars are "bright" based on scroll progress
      const revealed = Math.floor(brightChars + progress * (text.length - brightChars));

      // Update custom property so CSS handles the rendering
      el.style.setProperty('--revealed', String(revealed));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount

    return () => window.removeEventListener('scroll', onScroll);
  }, [text, brightChars]);

  // Split into bright + faded spans
  // (Static split at brightChars — scroll updates via CSS var if you want animation)
  return (
    <p
      ref={ref}
      style={{
        fontSize: 'clamp(14px, 1.1vw, 17px)',
        lineHeight: 1.72,
        letterSpacing: '-0.01em',
        margin: 0,
      }}
    >
      <span style={{ color: '#1a1a1a' }}>
        {text.slice(0, brightChars)}
      </span>
      <span style={{ color: '#b0b0b0' }}>
        {text.slice(brightChars)}
      </span>
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────

export default function KeyPoints() {
  const data = SECTION_DATA;

  return (
    <section
      aria-label={data.title}
      style={{
        width: '100%',
        background: '#ffffff',           // Terminal's off-white background
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(40px, 6vw, 96px)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── LEFT: clipped card ── */}
      <YardCard data={data} />

      {/* ── RIGHT: text content ── */}
      <div style={{
        flex: 1,
        maxWidth: 560,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {/* Eyebrow */}
        <span style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: '#999',
          letterSpacing: '0.06em',
          marginBottom: 20,
          display: 'block',
        }}>
          ○{data.eyebrow}
        </span>

        {/* Title */}
        <h2 style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 'clamp(28px, 3.2vw, 48px)',
          fontWeight: 500,
          color: '#0d1f19',
          letterSpacing: '-0.03em',
          lineHeight: 1.08,
          margin: '0 0 28px',
        }}>
          {data.title}
        </h2>

        {/* Body — bright leading text fades into muted trailing text */}
        <FadedBodyText
          text={data.body}
          brightChars={data.brightChars}
        />
      </div>
    </section>
  );
}