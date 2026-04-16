'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitReveal } from './animations';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      'We have not seen this kind of precision in cold-chain logistics. Trident\'s documentation and compliance work is simply unmatched across every corridor we operate in.',
    name: 'Michael Chen',
    role: 'VP of Supply Chain',
    company: 'Pacific Seafood Distributors',
    image: '/images/img1.jpg',
  },
  {
    quote:
      'Trident turned what used to be a weeks-long customs ordeal into a seamless, two-day clearance. Their network in South Asia is extraordinary and their team is always three steps ahead.',
    name: 'Sarah Williams',
    role: 'Head of Global Procurement',
    company: 'EuroTrade Solutions GmbH',
    image: '/images/img2.jpg',
  },
  {
    quote:
      'Every shipment Trident has handled for us arrived on time, fully compliant, and with complete traceability. In three years we have had zero FDA issues. That is truly remarkable.',
    name: 'Yuki Tanaka',
    role: 'Director of Import Operations',
    company: 'Tokyo Marine Foods Ltd',
    image: '/images/img4.jpg',
  },
  {
    quote:
      'What sets Trident apart is their obsessive attention to quality at the source. They are not just a trade broker — they are a genuine strategic partner embedded in our supply chain.',
    name: 'Rajan Mehta',
    role: 'Chief Procurement Officer',
    company: 'Gulf Fresh Trading LLC',
    image: '/images/img5.jpg',
  },
];

const N = TESTIMONIALS.length;

function MobileTestimonials() {
  return (
    <div className="flex flex-col">
      {TESTIMONIALS.map((t, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
          style={{ minHeight: '100svh' }}
        >
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image src={t.image} fill className="object-cover" alt="" />
            <div className="absolute inset-0 bg-black/[0.62]" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
            <span className="text-white/25 text-[96px] leading-[0.8]" style={{ fontFamily: 'Georgia,serif' }}>&ldquo;</span>
            <p className="text-white text-xl font-medium leading-relaxed tracking-tight -mt-4">
              {t.quote}
            </p>
            <div className="w-10 h-px bg-white/25" />
            <div>
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <p className="text-white/50 text-xs">{t.role}</p>
              <p className="text-white/35 text-xs">{t.company}</p>
            </div>
          </div>

          {/* Slide number */}
          <span className="absolute bottom-6 right-6 z-10 font-mono text-[11px] text-white/30 tracking-wider">
            {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
}

function DesktopTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const segmentSize = 1 / N;
  const activeIndex = Math.min(N - 1, Math.floor(progress / segmentSize));
  const segmentProgress = (progress - activeIndex * segmentSize) / segmentSize;

  // Text transitions at 50% through the image overlay scroll
  const textActiveIndex = segmentProgress >= 0.5 && activeIndex < N - 1
    ? activeIndex + 1
    : activeIndex;

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: `${(N + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/*  FULL SCREEN BACKGROUND IMAGES */}
        <div className="absolute inset-0">
          {TESTIMONIALS.map((t, i) => {
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
                <Image
                  src={t.image}
                  fill
                  className="object-cover"
                  alt={t.company}
                  priority={i === 0}
                />
                {/* Gradient dark overlay for text legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/*  CENTERED TEXT OVERLAY */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6 md:px-12">
          {/* Counter bar - positioned on left side */}
          <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <div className="relative w-[3px] h-48 md:h-64 rounded-full bg-white/20 overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full rounded-full bg-red-500 transition-all duration-300"
                style={{ height: `${((activeIndex + 1) / N) * 100}%` }}
              />
            </div>
            <span className="text-white text-xs md:text-sm font-medium tracking-wider">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Content */}
          <div className="relative max-w-5xl mx-8 w-full h-full flex items-center justify-center">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  visibility: i === textActiveIndex ? 'visible' : 'hidden',
                  pointerEvents: i === textActiveIndex ? 'auto' : 'none',
                }}
              >
                <div className="flex flex-col items-center text-center gap-6 md:gap-8">
                  {/* Opening quotation mark */}
                  <div
                    className="text-white/[0.18] leading-[0.85] select-none"
                    style={{
                      fontSize: 'clamp(80px, 10vw, 140px)',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      marginBottom: 'clamp(8px, 1vw, 16px)',
                    }}
                  >
                    &ldquo;
                  </div>

                  {/* Quote with SplitReveal */}
                  <SplitReveal
                    text={t.quote}
                    active={i === textActiveIndex}
                    className="text-white font-medium leading-[1] tracking-tight"
                    style={{
                      fontSize: 'clamp(18px, 2.4vw, 40px)',
                      maxWidth: '860px',
                    } as React.CSSProperties}
                  />

                  {/* Author */}
                  <div
                    className="flex flex-col items-center gap-1 transition-all duration-600 ease-out delay-700"
                    style={{
                      marginTop: 'clamp(28px, 3.5vw, 52px)',
                      opacity: i === textActiveIndex ? 1 : 0,
                      transform: i === textActiveIndex ? 'translateY(0)' : 'translateY(12px)',
                    }}
                  >
                    {/* Divider line */}
                    <div className="w-10 h-px bg-white/30 mb-3" />
                    <p className="text-white font-semibold text-[15px] m-0">
                      {t.name}
                    </p>
                    {/* <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, margin: 0 }}>
                      {t.role}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
                      {t.company}
                    </p> */}
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

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Testimonials() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section className="relative" style={{ background: '#060606' }}>
      <DesktopTestimonials />
    </section>
  );
}
