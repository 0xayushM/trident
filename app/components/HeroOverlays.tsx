'use client';

const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function HeroOverlays() {
  return (
    <>
      {/* Bottom-left: CTAs */}
      <div className="absolute bottom-10 left-6 md:bottom-14 md:left-12 z-10">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Primary CTA — red, not blue */}
          <a
            href="#contact"
            onClick={scrollToContact}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5
                       bg-red-600 hover:bg-red-700 active:bg-red-800
                       text-white text-sm font-semibold rounded-lg
                       transition-all duration-200 whitespace-nowrap
                       shadow-lg shadow-red-600/30"
          >
            Get a sourcing quote in 24 hours
          </a>

          {/* Secondary CTA */}
          <a
            href="#contact"
            onClick={scrollToContact}
            className="inline-flex items-center justify-center px-6 py-3.5
                       bg-white/10 hover:bg-white/18 backdrop-blur-sm
                       border border-white/25 text-white text-sm font-medium
                       rounded-lg transition-all duration-200 whitespace-nowrap"
          >
            Get a Free Procurement Audit
          </a>
        </div>

        {/* Lead magnet */}
        <p className="hidden md:block mt-3 text-[11px] text-white/35 tracking-wide">
          Or{' '}
          <a href="#contact" onClick={scrollToContact} className="underline underline-offset-2 text-white/50 hover:text-white/75 transition-colors">
            download the 2026 Indian Shrimp Export Quality Checklist ↗
          </a>
        </p>
      </div>

      {/* Bottom-right: trust signals */}
      <div className="hidden md:flex absolute bottom-12 right-12 z-40 flex-col items-end gap-2">
        {[
          '7+ years in operation',
          'USFDA & EU HACCP certified network',
          'Zero documented FDA holds',
          'Direct supplier relationships — no sub-brokers',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0" />
            <span className="text-[11px] text-white/55 font-medium tracking-wide">
              {item}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
