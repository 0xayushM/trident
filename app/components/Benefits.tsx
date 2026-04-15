'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import benefitsData from '../data/benefits.json';
import { SplitReveal } from './animations';

const TOTAL = benefitsData.benefits.length;

export default function Benefits() {
  const containerRef  = useRef<HTMLElement>(null);
  const videoRefs     = useRef<(HTMLVideoElement | null)[]>([]);
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

  const segmentSize    = 1 / TOTAL;
  const activeIndex    = Math.min(TOTAL - 1, Math.floor(progress / segmentSize));
  const segmentProgress = (progress - activeIndex * segmentSize) / segmentSize;

  // Text transitions at 50% of the video overlay scroll
  const textActiveIndex = segmentProgress >= 0.5 && activeIndex < TOTAL - 1
    ? activeIndex + 1
    : activeIndex;

  // Play active video, pause + reset others to save bandwidth
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === activeIndex || i === activeIndex + 1) {
        // Ensure src is set and video is playing
        if (vid.paused) {
          vid.play().catch(() => {});
        }
      } else {
        if (!vid.paused) vid.pause();
      }
    });
  }, [activeIndex]);

  return (
    <section
      ref={containerRef}
      className="relative bg-white"
      style={{ height: `${(TOTAL + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ══════ FULL SCREEN VIDEO BACKGROUND ══════ */}
        <div className="absolute inset-0">
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
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={benefit.video}
                  autoPlay={i === 0}
                  loop
                  muted
                  playsInline
                  preload={i === 0 ? 'metadata' : 'none'}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* ══════ CENTERED CARD OVERLAY ══════ */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6 md:px-12">
          {/* Counter bar - positioned on left side */}
          <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <div className="relative w-[3px] h-48 md:h-64 rounded-full bg-white/20 overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full rounded-full bg-red-500 transition-all duration-300"
                style={{ height: `${((activeIndex + 1) / TOTAL) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-medium tracking-wider">
              {benefitsData.benefits[activeIndex].number}
            </span>
          </div>

          {/* Content Card */}
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            {benefitsData.benefits.map((benefit, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  visibility: i === textActiveIndex ? 'visible' : 'hidden',
                  pointerEvents: i === textActiveIndex ? 'auto' : 'none',
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white/80 p-8 md:p-12 lg:p-16 rounded-2xl shadow-lg backdrop-blur-sm items-center justify-center">
                  {/* Label + Title */}
                  <div className="col-span-2">
                    <SplitReveal
                      text={`Benefit ${benefit.number}`}
                      active={i === textActiveIndex}
                      className="text-xs lg:text-sm font-medium text-gray-500 tracking-wider uppercase mb-1"
                    />
                    <SplitReveal
                      text={benefit.title}
                      active={i === textActiveIndex}
                      animateColors
                      className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight leading-[1.1] text-[#1a1a1a]"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-3">
                    <SplitReveal
                      text={benefit.description}
                      active={i === textActiveIndex}
                      className="text-sm md:text-base lg:text-lg text-gray-600 leading-[1]"
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
