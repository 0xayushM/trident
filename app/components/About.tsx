'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['Trident', 'Operating', 'System.'];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1 (0–0.25):   letters fade from end of each word
  // Phase 2 (0.25–0.5):  non-first letters collapse width
  // Phase 3 (0.5–0.75):  first letters move together (gap shrinks) + scale starts
  // Phase 4 (0.75–1.0):  bg → white, text → black, ™ fades in
  const fadeP     = Math.max(0, Math.min(1, progress / 0.25));
  const collapseP = Math.max(0, Math.min(1, (progress - 0.25) / 0.25));
  const movePRaw  = Math.max(0, Math.min(1, (progress - 0.5) / 0.25));
  const colorP    = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  // Ease-out: fast start, slows down as letters approach center
  const moveP = 1 - Math.pow(1 - movePRaw, 3);

  // Word gap: 40px → 4px
  const wordGap = 40 - moveP * 36;

  // Scale: start scaling immediately when only first letters remain (progress >= 0.5)
  // Scale through remaining scroll (0.5 -> 1.0)
  const scaleRaw = Math.max(0, Math.min(1, (progress - 0.5) / 0.5));
  const zoomScale = 1 + scaleRaw * 0.5;

  // Text color: white → black
  const tv = Math.round(255 * (1 - colorP));
  const textColor = `rgb(${tv},${tv},${tv})`;

  // Subtitle color
  const subColor = colorP > 0.5
    ? `rgba(0,0,0,0.5)`
    : `rgba(255,255,255,0.5)`;

  return (
    <section ref={containerRef} className="relative h-screen" style={{ height: '400vh', backgroundColor: colorP > 0.5 ? 'white' : 'black' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background video */}
        <video
          src="/videos/about.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 opacity-50"
          style={{
            filter: colorP > 0.5 ? 'invert(1)' : 'invert(0)',
            opacity: colorP > 0.5 ? 0.2 : 0.5,
          }}
        />

        {/* Dark overlay */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${0.6 * (1 - colorP)})` }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
          <p 
            className="text-xs md:text-sm lg:text-base tracking-wider mb-6"
            style={{ 
              color: subColor,
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              letterSpacing: '0.04em'
            }}
          >
            That&apos;s the
          </p>

          <h2 
            className="font-medium leading-tighter md:leading-normal m-0 flex flex-col md:flex-row items-center md:items-baseline justify-center gap-1 md:gap-4"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(36px, 7vw, 150px)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: textColor,
              transform: `scale(${zoomScale})`,
              willChange: 'transform',
            }}
          >
            {WORDS.map((word, wIdx) => {
              const letters = word.split('');
              const totalNF = letters.length - 1; // non-first count

              return (
                <span key={wIdx} className="inline-flex items-baseline">
                  {letters.map((letter, lIdx) => {
                    if (lIdx === 0) {
                      return (
                        <span key={lIdx} className="inline-block">
                          {letter}
                        </span>
                      );
                    }

                    // Fade from end first: last letter fades first
                    const posFromFirst = lIdx - 1;
                    const distFromEnd = totalNF - 1 - posFromFirst;
                    const sweepPos = fadeP * (totalNF + 1);
                    const letterOpacity = Math.max(0, Math.min(1, 1 - (sweepPos - distFromEnd)));

                    // Collapse width
                    const maxW = (1 - collapseP) * 1;

                    return (
                      <span
                        key={lIdx}
                        className="inline-block overflow-hidden whitespace-nowrap"
                        style={{
                          opacity: letterOpacity,
                          maxWidth: `${maxW}em`,
                        }}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </h2>
        </div>
      </div>
    </section>
  );
}
