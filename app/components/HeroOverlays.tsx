'use client';

export default function HeroOverlays() {
  return (
    <>
      {/* Bottom-left: CTAs */}
      <div className="absolute bottom-10 left-8 md:left-12 z-40">
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
          >
            Get a sourcing quote in 24 hours
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
          >
            Get a 15-Minute Procurement Audit
          </a>
        </div>
      </div>

      {/* Bottom-right: trust signals */}
      <div className="hidden md:flex absolute bottom-10 right-12 z-40 flex-col items-end gap-1.5">
        {[
          '6+ years operating globally',
          'USFDA & EU HACCP certified network',
          'Zero documented FDA holds',
          'Direct supplier relationships, no sub-brokers',
        ].map((item) => (
          <span key={item} className="text-xs text-white/60 font-medium tracking-wide">
            {item}
          </span>
        ))}
      </div>
    </>
  );
}
