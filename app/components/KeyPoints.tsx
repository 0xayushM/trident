'use client';

import { useEffect, useRef, useId, useState } from 'react';
import keypointsData from '../data/keypoints.json';

const VIDEOS = [
  '/videos/point1.mp4',
  '/videos/point2.mp4',
  '/videos/point3.mp4',
  '/videos/point4.mp4',
];

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

const CARD_W = 600;
const CARD_H = 900;

const CARD_PATH_CONFIG: CardPathConfig = {
  W: CARD_W, H: CARD_H,
  stepFlatW:  200, stepH: 30,  stepDiagW: 30, stepRadius: 12,
  tr: 24,
  slotDepth:  30, slotFlatH: 200,  slotAngleH: 30,
  slotPosPct: 30, slotIR:    10,  slotER: 7,
  br: 40, bl: 10,
};

function YardCard({ videoIndex, slotProgress }: { videoIndex: number; slotProgress: number }) {
  const clipId = `yard-clip-${useId().replace(/:/g, '')}`;
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState('');
  const sizeRef = useRef({ width: 0, height: 0 });

  // Animate slit position: 20% → 75% based on scroll progress through all cards
  const slotPosPct = 25 + slotProgress * 35;

  useEffect(() => {
    const rebuildPath = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      sizeRef.current = { width, height };
      const config: CardPathConfig = {
        ...CARD_PATH_CONFIG,
        W: width,
        H: height,
        slotPosPct,
      };
      setClipPath(buildCardPath(config));
    };

    rebuildPath();
    const observer = new ResizeObserver(rebuildPath);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [slotPosPct]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === videoIndex || index === videoIndex + 1) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [videoIndex]);

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
            <path d={clipPath} />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={containerRef}
        style={{
          width: 'calc(45vw - 10px)',
          height: '85vh',
          background: '#0b0d11',
          clipPath: clipPath ? `url(#${clipId})` : undefined,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {VIDEOS.map((videoSrc, index) => (
          <video
            key={index}
            ref={(el) => { videoRefs.current[index] = el; }}
            src={videoSrc}
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: index === videoIndex ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
            }}
          />
        ))}
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
// Mobile Carousel
// ─────────────────────────────────────────────────────────────────────────────

function MobileAnimatedLetter({
  children,
  delay = 0,
  isActive = false,
}: {
  children: string;
  delay?: number;
  isActive?: boolean;
}) {
  const [phase, setPhase] = useState<'initial' | 'red' | 'black'>('initial');

  useEffect(() => {
    if (!isActive) {
      setPhase('initial');
      return;
    }

    const timer1 = setTimeout(() => setPhase('red'), delay);
    const timer2 = setTimeout(() => setPhase('black'), delay + 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay, isActive]);

  const color = phase === 'initial' ? '#d0d0d0' : phase === 'red' ? '#dc2626' : '#1a1a1a';

  return (
    <span style={{ color, transition: 'color 0.3s ease-in-out' }}>
      {children}
    </span>
  );
}

function MobileAnimatedTitle({ title, isActive }: { title: string; isActive: boolean }) {
  const letters = title.split('');
  return (
    <h2 className='px-4' style={{
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: 'clamp(24px, 7vw, 36px)',
      fontWeight: 500,
      letterSpacing: '-0.03em',
      lineHeight: 1.15,
      margin: 0,
    }}>
      {letters.map((letter, index) => (
        <MobileAnimatedLetter
          key={index}
          delay={index * 5}
          isActive={isActive}
        >
          {letter}
        </MobileAnimatedLetter>
      ))}
    </h2>
  );
}

function MobileKeyPoints() {
  const [activeIndex, setActiveIndex] = useState(0);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(keypointsData.cards.length - 1, index));
    setActiveIndex(clamped);
    if (textScrollRef.current) {
      const containerWidth = textScrollRef.current.offsetWidth;
      textScrollRef.current.scrollTo({
        left: clamped * containerWidth,
        behavior: 'smooth',
      });
    }
  };

  // Play/pause videos based on active index
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  return (
    <section
      aria-label="Key Points"
      style={{
        width: '100%',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Video area */}
      <div style={{
        width: '100%',
        height: '60vh',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0 0 10px 10px',
      }}>
        {VIDEOS.map((videoSrc, index) => (
          <video
            key={index}
            ref={(el) => { videoRefs.current[index] = el; }}
            src={videoSrc}
            loop
            muted
            playsInline
            autoPlay
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: index === activeIndex ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
            }}
          />
        ))}

        {/* Navigation arrows */}
        <button
          onClick={() => goTo(activeIndex - 1)}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 70,
            width: 44,
            height: 44,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: activeIndex === 0 ? 0.3 : 1,
          }}
        >
          ‹
        </button>
        <button
          onClick={() => goTo(activeIndex + 1)}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 16,
            width: 44,
            height: 44,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.9)',
            color: '#1a1a1a',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: activeIndex === keypointsData.cards.length - 1 ? 0.3 : 1,
          }}
        >
          ›
        </button>
      </div>

      {/* Number indicators */}
      <div style={{
        display: 'flex',
        gap: 20,
        padding: '20px 24px 12px',
      }}>
        {keypointsData.cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => goTo(index)}
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              color: index === activeIndex ? '#1a1a1a' : '#c0c0c0',
              fontWeight: index === activeIndex ? 600 : 400,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Horizontal scrolling titles with animated text */}
      <div
        ref={textScrollRef}
        style={{
          display: 'flex',
          overflowX: 'hidden',
          scrollSnapType: 'x mandatory',
          padding: '0 24px',
        }}
      >
        {keypointsData.cards.map((card, index) => (
          <div
            key={card.id}
            style={{
              minWidth: '100%',
              scrollSnapAlign: 'start',
              paddingRight: 24,
              boxSizing: 'border-box',
            }}
          >
            <MobileAnimatedTitle
              title={card.title}
              isActive={index === activeIndex}
            />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        margin: '20px 24px 32px',
        height: 2,
        background: '#e5e5e5',
        borderRadius: 1,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${((activeIndex + 1) / keypointsData.cards.length) * 100}%`,
          background: '#1a1a1a',
          borderRadius: 1,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop section
// ─────────────────────────────────────────────────────────────────────────────

function DesktopKeyPoints() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Simple calculation: how far through the section are we?
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - windowHeight)));
      
      // Map progress to card transitions
      // Extra space at end for last card to finish its text sweep
      const totalProgress = progress * keypointsData.cards.length;
      const cardIndex = Math.min(
        Math.floor(totalProgress),
        keypointsData.cards.length - 1
      );
      const cardProgress = totalProgress - cardIndex;
      
      setActiveIndex(cardIndex);
      setProgress(cardProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section height = cards * 100vh (extra 100vh so last card can finish transition)
  const sectionHeight = `${keypointsData.cards.length * 100}vh`;

  return (
    <section
      ref={containerRef}
      aria-label="Key Points"
      style={{
        width: '100%',
        height: sectionHeight,
        background: '#ffffff',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 96px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(40px, 6vw, 96px)',
        boxSizing: 'border-box',
      }}>
        {/* ── LEFT: clipped card with video ── */}
        <YardCard
          videoIndex={activeIndex}
          slotProgress={(activeIndex + progress) / (keypointsData.cards.length - 1)}
        />

        {/* ── RIGHT: text content ── */}
        <div style={{
          flex: 1,
          maxWidth: 560,
          position: 'relative',
          alignSelf: 'stretch',
        }}>
          {/* Fixed counter */}
          <span style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#999',
            letterSpacing: '0.06em',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: -30,
          }}>
            {String(activeIndex + 1).padStart(2, '0')}
          </span>

          {/* Scrolling text column */}
          <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
          }}>
            <div
              style={{
                transform: `translateY(calc(30vh - ${(activeIndex + progress) * 40}vh))`,
              }}
            >
              {keypointsData.cards.map((card, index) => {
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;
                const chars = card.title.split('');
                const totalChars = chars.length;
                
                // Sweep position: how many chars have been "touched" by the red sweep
                // progress 0→0.5: red sweeps across all chars
                // progress 0.5→1: red turns to black behind
                const sweepPos = isActive ? progress * totalChars * 3 : 0;

                return (
                  <div
                    key={card.id}
                    style={{
                      height: '40vh',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 'clamp(28px, 3.2vw, 48px)',
                        fontWeight: 500,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.15,
                        margin: 0,
                      }}
                    >
                      {chars.map((char, charIndex) => {
                        let color: string;
                        if (isPast) {
                          color = '#1a1a1a';
                        } else if (isActive) {
                          if (charIndex < sweepPos - 5) {
                            color = '#1a1a1a';
                          } else if (charIndex < sweepPos) {
                            color = '#dc2626';
                          } else {
                            color = '#d0d0d0';
                          }
                        } else {
                          color = '#d0d0d0';
                        }

                        return (
                          <span
                            key={charIndex}
                            style={{ color, transition: 'color 0.15s ease-in-out' }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — responsive switch
// ─────────────────────────────────────────────────────────────────────────────

export default function KeyPoints() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile ? <MobileKeyPoints /> : <DesktopKeyPoints />;
}