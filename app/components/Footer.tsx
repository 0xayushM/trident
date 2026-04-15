'use client';

import Image from 'next/image';
import SlideButton from './ui/SlideButton';
import { useRef, useState, useEffect} from 'react';
import { useInView } from 'react-intersection-observer';
import { SplitReveal } from './animations';

function IconLinkedIn({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function IconTwitterX({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.264 5.636 5.9-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Letter & Word Components
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedLetter({ 
  children, 
  delay = 0,
  inView = false
}: { 
  children: string; 
  delay?: number;
  inView?: boolean;
}) {
  const [phase, setPhase] = useState<'initial' | 'red' | 'white'>('initial');

  useEffect(() => {
    if (!inView) {
      setPhase('initial');
      return;
    }

    // Phase 1: gray → red
    const timer1 = setTimeout(() => {
      setPhase('red');
    }, delay);

    // Phase 2: red → white
    const timer2 = setTimeout(() => {
      setPhase('white');
    }, delay + 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay, inView]);

  const getColor = () => {
    switch (phase) {
      case 'initial': return 'rgba(255,255,255,0.3)';
      case 'red': return '#ef4444';
      case 'white': return '#ffffff';
    }
  };

  return (
    <span
      className="inline-block"
      style={{
        color: getColor(),
        transition: 'color 0.3s ease-in-out',
      }}
    >
      {children}
    </span>
  );
}

function AnimatedWord({ 
  children, 
  delay = 0,
  inView = false
}: { 
  children: string; 
  delay?: number;
  inView?: boolean;
}) {
  const letters = children.split('');
  
  return (
    <span className="inline-block">
      {letters.map((letter, index) => (
        <AnimatedLetter 
          key={index} 
          delay={delay + (index * 80)}
          inView={inView}
        >
          {letter}
        </AnimatedLetter>
      ))}
    </span>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const [ctaRef, ctaInView] = useInView({ triggerOnce: false, threshold: 0.3 });
  const [brandRef, brandInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ background: '#060606', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Contact section is now dark — no top divider needed */}
      {/* Video background with red overlay */}
      <div className="absolute inset-0 z-0">
        <video
          src="/videos/about.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Red overlay - makes white parts look red */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(142, 14, 14, 0.95) 0%, rgba(0, 0, 0, 1) 100%)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>
      {/* CTA — top section */}
      <div
        ref={ctaRef}
        className="flex flex-col items-center justify-center text-center flex-1 relative z-10"
        style={{
          padding: 'clamp(80px, 12vh, 140px) clamp(24px, 8vw, 120px)',
          paddingBottom: 'clamp(60px, 8vh, 100px)',
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.18em] text-white/35 uppercase mb-6 block">
          Ready to ship?
        </span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl unica-text mb-8 font-medium tracking-tighter leading-[1.02]">
          <span className="text-slate-100">Better </span>
          <AnimatedWord delay={300} inView={ctaInView}>sourcing</AnimatedWord>{' '}
          <AnimatedWord delay={600} inView={ctaInView}>starts</AnimatedWord>
          <br />
          <span className="text-slate-100">with the </span>
          <AnimatedWord delay={900} inView={ctaInView}>right</AnimatedWord>{' '}
          <AnimatedWord delay={1100} inView={ctaInView}>broker</AnimatedWord>
          <span className="text-slate-100">.</span>
        </h2>

        <SlideButton
          onClick={(e) => {
            e?.preventDefault();
            // Trigger the QuotePopup
            window.dispatchEvent(new Event('openQuotePopup'));
          }}
          variant="outline-white"
          from="left"
          style={{
            padding:    '18px 52px',
            fontSize:   12,
          } as React.CSSProperties}
        >
          Start A Conversation
        </SlideButton>
      </div>

      {/* Divider */}
      <div
        className="relative z-10 h-px bg-white/8"
        style={{
          margin: '0 clamp(24px, 5vw, 80px)',
        }}
      />

      {/* ── Bottom grid ──────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 relative z-10"
        style={{
          padding: 'clamp(40px, 6vh, 72px) clamp(24px, 5vw, 80px)',
        }}
      >

        {/* Column 1 — Brand */}
        <div ref={brandRef} className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Trident Logo"
              width={36}
              height={36}
              style={{ width: 36, height: 36, objectFit: 'contain' }}
            />
            <span className="unica-text font-bold text-base tracking-widest uppercase text-white">
              Trident
            </span>
          </div>

          <SplitReveal
            text="Wholesale Import and Export specializing in Seafood Export, Shrimp Brokerage, and Frozen Seafood with USFDA Compliance."
            active={brandInView}
            className="text-[13px] leading-relaxed text-white/40 max-w-[280px]"
          />
          
          <p className="text-[11px] text-white/30 mt-2">
            Room No. 401, 4th Floor, 5 Mullick Street
          </p>
          <p className="text-[11px] text-white/30">
            Kolkata, India - 700007
          </p>
        </div>
        {/* Column 4 — Reach Us */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-1.5">
            Reach Us
          </p>

          <SplitReveal
            text="Ready to move your freight?"
            active={brandInView}
            className="text-white/55 text-[13px] leading-relaxed"
          />

          <a
            href="tel:+919431267872"
            className="unica-text text-white text-xl font-semibold tracking-tight no-underline hover:text-red-400 transition-colors"
          >
            +91 9431267872
          </a>
          <p className="text-[11px] text-white/30 -mt-2">
            (Anand)
          </p>

          <a
            href="mailto:enquiry@tridentintjp.in"
            className="text-white/40 text-[13px] no-underline hover:text-white/60 transition-colors"
          >
            enquiry@tridentintjp.in
          </a>

          {/* Socials */}
          <div className="flex gap-4 mt-2">
            {[
              { Icon: IconLinkedIn,  href: 'https://www.linkedin.com/company/internationaltrident/', label: 'LinkedIn'  },
              { Icon: IconTwitterX,  href: '#', label: 'Twitter/X' },
              { Icon: IconInstagram, href: '#', label: 'Instagram' },
            ].map(({ Icon, href, label }) => (
              <SocialIcon key={label} href={href} label={label}>
                <Icon size={16} />
              </SocialIcon>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row justify-between items-center gap-3 relative z-10 border-t border-white/6"
        style={{
          padding: 'clamp(16px, 2.5vh, 28px) clamp(24px, 5vw, 80px)',
        }}
      >
        <p className="text-xs text-white/20 m-0">
          © {new Date().getFullYear()} Trident International Pvt. Ltd. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service'].map((t) => (
            <a
              key={t}
              href="#"
              className="text-xs text-white/20 no-underline transition-colors hover:text-white/60"
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm unica-text text-white/55 no-underline transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 no-underline transition-all hover:border-white/50 hover:text-white"
    >
      {children}
    </a>
  );
}
