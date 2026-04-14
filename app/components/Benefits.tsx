'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import benefitsData from '../data/benefits.json';

gsap.registerPlugin(SplitText);

const TOTAL = benefitsData.benefits.length;

/* ── SplitReveal: GSAP SplitText line-masked reveal ── */
function SplitReveal({
  text,
  active,
  className = '',
  animateColors = false,
}: {
  text: string;
  active: boolean;
  className?: string;
  animateColors?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const colorTlRef = useRef<gsap.core.Timeline | null>(null);

  // Create split on mount
  useEffect(() => {
    if (!ref.current) return;
    splitRef.current = SplitText.create(ref.current, {
      type: 'lines,words,chars',
      mask: 'lines',
    });
    // Start hidden
    if (splitRef.current.lines) {
      gsap.set(splitRef.current.lines, { yPercent: 110 });
    }
    if (animateColors && splitRef.current.chars) {
      gsap.set(splitRef.current.chars, { color: '#d0d0d0' });
    }
    return () => {
      tweenRef.current?.kill();
      colorTlRef.current?.kill();
      splitRef.current?.revert();
    };
  }, []);

  // Animate in/out when active changes
  useEffect(() => {
    const lines = splitRef.current?.lines;
    const chars = splitRef.current?.chars;
    if (!lines?.length) return;

    tweenRef.current?.kill();
    colorTlRef.current?.kill();

    if (active) {
      // Reset below before revealing upward
      gsap.set(lines, { yPercent: 110 });
      if (animateColors && chars?.length) {
        gsap.set(chars, { color: '#d0d0d0' });
      }

      tweenRef.current = gsap.to(lines, {
        yPercent: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power4.out',
        overwrite: true,
      });

      // Color sweep runs alongside the reveal with a small delay
      if (animateColors && chars?.length) {
        const tl = gsap.timeline({ delay: 0.3 });
        tl.to(chars, {
          color: '#dc2626',
          duration: 0.3,
          stagger: 0.03,
          ease: 'none',
        });
        tl.to(chars, {
          color: '#1a1a1a',
          duration: 0.3,
          stagger: 0.03,
          ease: 'none',
        }, '<0.15');
        colorTlRef.current = tl;
      }
    } else {
      tweenRef.current = gsap.to(lines, {
        yPercent: -150,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power2.inOut',
        overwrite: true,
      });
    }
  }, [active]);

  return (
    <div ref={ref} className={className}>
      {text}
    </div>
  );
}

export default function Benefits() {
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

  const segmentSize = 1 / TOTAL;
  const activeIndex = Math.min(TOTAL - 1, Math.floor(progress / segmentSize));
  const segmentProgress = (progress - activeIndex * segmentSize) / segmentSize;

  // Text transitions at 50% of the video overlay scroll
  const textActiveIndex = segmentProgress >= 0.5 && activeIndex < TOTAL - 1
    ? activeIndex + 1
    : activeIndex;

  return (
    <section
      ref={containerRef}
      className="relative bg-white"
      style={{ height: `${(TOTAL + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* ══════ VIDEO AREA (top ~65%) ══════ */}
        <div className="relative flex-1 overflow-hidden">
          {benefitsData.benefits.map((benefit, i) => {
            let clipTop = '100%';
            if (i <= activeIndex) {
              clipTop = '0%';
            } else if (i === activeIndex + 1) {
              const reveal = segmentProgress * 100;
              clipTop = `${100 - reveal}%`;
            }

            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  clipPath: i <= activeIndex ? 'none' : `inset(${clipTop} 0 0 0)`,
                  zIndex: i,
                }}
              >
                <video
                  src={benefit.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}

          {/* Counter bar */}
          <div className="absolute left-6 md:left-10 bottom-1/3 z-20 flex items-center gap-3">
            <div className="relative w-[3px] h-48 rounded-full bg-white/20 overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full rounded-full bg-red-500 transition-all duration-300"
                style={{ height: `${((activeIndex + 1) / TOTAL) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-medium tracking-wider">
              {benefitsData.benefits[activeIndex].number}
            </span>
          </div>
        </div>

        {/* ══════ TEXT PANEL (bottom ~35%, white bg, SplitReveal) ══════ */}
        <div className="relative bg-white h-[30vh] md:h-[30vh]">
          <div className="h-full px-6 md:px-10 lg:px-16 pt-8 md:pt-10">
            {benefitsData.benefits.map((benefit, i) => (
              <div
                key={i}
                className="absolute inset-0 px-6 md:px-10 lg:px-16 pt-8 md:pt-10"
                style={{
                  visibility: i === textActiveIndex ? 'visible' : 'hidden',
                  pointerEvents: i === textActiveIndex ? 'auto' : 'none',
                }}
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-16 max-w-7xl">
                  {/* Left: label + title */}
                  <div className="md:w-1/2 max-w-[300px]">
                    <SplitReveal
                      text={`Benefit ${benefit.number}`}
                      active={i === textActiveIndex}
                      className="text-md md:text-lg lg:text-xl font-medium text-gray-400 tracking-tighter"
                    />
                    <SplitReveal
                      text={benefit.title}
                      active={i === textActiveIndex}
                      animateColors
                      className="text-lg md:text-xl lg:text-2xl font-medium tracking-tighter leading-[1.1] max-w-md text-[#1a1a1a]"
                    />
                  </div>

                  {/* Right: description */}
                  <div className="w-full max-w-xl text-justify">
                    <SplitReveal
                      text={benefit.description}
                      active={i === textActiveIndex}
                      className="text-sm md:text-base text-gray-500 leading-[1]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
