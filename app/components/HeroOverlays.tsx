'use client';

import SlideButton from './ui/SlideButton';

const scrollToContact = () => {
  const el = document.getElementById('contact');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function HeroOverlays() {
  return (
    <>
      {/* Bottom-left: CTAs */}
      <div className="absolute bottom-10 left-6 md:bottom-14 md:left-12 z-10">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Primary CTA — red slide */}
          <SlideButton
            onClick={scrollToContact}
            href="#contact"
            variant="solid-red"
            from="left"
            style={{
              padding: '14px 26px',
              fontSize: 13,
              borderRadius: 8,
              boxShadow: '0 8px 28px rgba(239,68,68,0.28)',
              letterSpacing: '0.06em',
            }}
          >
            Get a sourcing quote in 24 hours
          </SlideButton>

          {/* Secondary CTA — ghost white slide */}
          <SlideButton
            onClick={scrollToContact}
            href="#contact"
            variant="outline-white"
            from="left"
            style={{
              padding: '14px 26px',
              fontSize: 13,
              borderRadius: 8,
              letterSpacing: '0.06em',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            Get a Free Procurement Audit
          </SlideButton>

        </div>
      </div>

      {/* Bottom-right: trust signals */}
      <div className="hidden md:flex absolute bottom-12 right-12 z-40 flex-col items-end gap-2">
        {[
          '7+ years in operation',
          'USFDA & EU HACCP certified network',
          'Zero documented FDA holds',
          'Direct supplier relationships — no sub-brokers',
        ].map(item => (
          <div key={item} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0" />
            <span className="text-[11px] text-white/55 font-medium tracking-wide">{item}</span>
          </div>
        ))}
      </div>
    </>
  );
}
