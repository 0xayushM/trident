'use client';

import Image from 'next/image';
import SlideButton from './ui/SlideButton';

export default function Navbar({ ready = true }: { ready?: boolean }) {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openQuotePopup = () => {
    window.dispatchEvent(new Event('openQuotePopup'));
  };

  return (
    <div
      className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-1000 ease-out"
      style={{
        opacity:   ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(-2rem)',
      }}
    >
      <nav className="mx-auto max-w-7xl bg-gradient-to-r from-red-800/50 via-white/10 to-blue-800/50 backdrop-blur-md rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg">
        <div className="flex items-center justify-between gap-3">

          {/* Left: Logo */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-7 h-7 md:w-10 md:h-10 shrink-0"
              priority
            />
            <h1 className="text-sm md:text-xl font-bold text-white unica-text truncate" suppressHydrationWarning>Trident International</h1>
          </div>

          {/* Right: CTAs */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Free Quote — hidden on mobile, shown md+ */}
            <div className="hidden md:block">
              <SlideButton
                onClick={openQuotePopup}
                from="left"
                bg="#ef4444"
                fillColor="#b91c1c"
                textColor="#ffffff"
                textHover="#ffffff"
                style={{
                  padding:      '10px 22px',
                  fontSize:     12,
                  borderRadius: 8,
                  letterSpacing:'0.12em',
                }}
              >
                Free Quote
              </SlideButton>
            </div>

            <SlideButton
              onClick={scrollToContact}
              from="left"
              bg="#ffffff"
              fillColor="#0f172a"
              textColor="#0f172a"
              textHover="#ffffff"
              style={{
                padding:      '8px 14px',
                fontSize:     11,
                borderRadius: 8,
                letterSpacing:'0.10em',
              }}
            >
              Contact
            </SlideButton>
          </div>

        </div>
      </nav>
    </div>
  );
}
