'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import benefitsData from '../data/benefits.json';
import { SplitReveal } from './animations';

const TOTAL = benefitsData.benefits.length;

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
