'use client';

import Image from 'next/image';
import SlideButton from './ui/SlideButton';
import { useRef, useState, useEffect} from 'react';

function buildDividerPath({
  tabW   = 300,  // flat horizontal tab at each side edge
  outerR = 0,   // ① ⑥  wall → tab corner radius
  diagW  = 50,   // horizontal span of diagonal
  depth  = 40,   // vertical depth of scoops (animates to 0)
  entryR = 16,   // ② ⑤  tab → diagonal corner radius
  innerR = 20,   // ③ ④  diagonal → centre corner radius
} = {}) {
  const W = 1440, H = 72;
  const cy  = H - depth;
  const len = Math.sqrt(diagW**2 + depth**2);
  const adx = diagW / len,  ady = depth / len;

  const orC = Math.min(outerR, tabW/2, depth/2);
  const erC = Math.min(entryR, tabW/2 - orC/2, len/3);
  const irC = Math.min(innerR, len/3);

  const p = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;

  return [
    `M 0,0 L ${W},0`,
    `L ${W},${H-orC}`,
    `Q ${p(W,H)} ${p(W-orC, H)}`,                             // ① outer right
    `L ${p(W-tabW+erC, H)}`,
    `Q ${p(W-tabW,H)} ${p(W-tabW-erC*adx, H-erC*ady)}`,      // ② entry right
    `L ${p(W-tabW-diagW+irC*adx, cy+irC*ady)}`,
    `Q ${p(W-tabW-diagW,cy)} ${p(W-tabW-diagW-irC, cy)}`,     // ③ inner right
    `L ${p(tabW+diagW+irC, cy)}`,
    `Q ${p(tabW+diagW,cy)} ${p(tabW+diagW-irC*adx, cy+irC*ady)}`, // ④ inner left
    `L ${p(tabW+erC*adx, H-erC*ady)}`,
    `Q ${p(tabW,H)} ${p(tabW-erC, H)}`,                       // ⑤ entry left
    `L ${p(orC, H)}`,
    `Q ${p(0,H)} ${p(0, H-orC)}`,                             // ⑥ outer left
    `Z` 
  ].join(' ');
}

function TopDivider() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxDepth, setMaxDepth] = useState(20);

  useEffect(() => {
    const updateMaxDepth = () => {
      // Responsive depth: smaller on mobile, larger on desktop
      const vw = window.innerWidth;
      if (vw < 768) {
        setMaxDepth(20); // Mobile
      } else if (vw < 1024) {
        setMaxDepth(20); // Tablet
      } else {
        setMaxDepth(30); // Desktop
      }
    };

    updateMaxDepth();
    window.addEventListener('resize', updateMaxDepth);
    return () => window.removeEventListener('resize', updateMaxDepth);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementTop = rect.top;
      const triggerPoint = windowHeight; 
      
      if (elementTop < triggerPoint) {
        // Transition over 2x viewport height for slower animation
        const scrollProgress = Math.max(0, Math.min(1, (triggerPoint - elementTop) / (windowHeight)));
        setProgress(scrollProgress);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    
    const depth = maxDepth * (1 - progress);
    const path = buildDividerPath({ depth });
    pathRef.current.setAttribute('d', path);
  }, [progress, maxDepth]);

  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 right-0 w-full pointer-events-none bg-white"
      style={{ height: '72px', transform: 'translateY(-100%)' }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <path
          ref={pathRef}
          fill="#000000"
          d={buildDividerPath({ depth: 44 })}
        />
      </svg>
    </div>
  );
}

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

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ background: '#060606', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <TopDivider />
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
        className="flex flex-col items-center justify-center text-center flex-1 relative z-10"
        style={{
          padding: 'clamp(80px, 12vh, 140px) clamp(24px, 8vw, 120px)',
          paddingBottom: 'clamp(60px, 8vh, 100px)',
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.18em] text-white/35 uppercase mb-6 block">
          Ready to ship?
        </span>

        <h2
          className="unica-text font-bold tracking-tight leading-tight text-white max-w-[900px] mx-auto mb-13"
          style={{
            fontSize: 'clamp(36px, 6.5vw, 96px)',
          }}
        >
          Your freight.
          <br />
          Our precision.
        </h2>

        <SlideButton
          href="#contact"
          variant="outline-white"
          from="left"
          style={{
            padding:    '18px 52px',
            fontSize:   12,
          } as React.CSSProperties}
        >
          Start Your Shipment
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
        <div className="flex flex-col gap-5">
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

          <p className="text-[13px] leading-relaxed text-white/40 max-w-[240px]">
            Global freight forwarding and trade facilitation for businesses that demand precision, reliability, and transparency.
          </p>
        </div>
        {/* Column 4 — Reach Us */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-1.5">
            Reach Us
          </p>

          <p className="text-white/55 text-[13px] leading-relaxed">
            Ready to move your freight?
          </p>

          <a
            href="tel:+911145678900"
            className="unica-text text-white text-xl font-semibold tracking-tight no-underline"
          >
            +91 11 4567 8900
          </a>

          <a
            href="mailto:info@tridentintl.com"
            className="text-white/40 text-[13px] no-underline"
          >
            info@tridentintl.com
          </a>

          {/* Socials */}
          <div className="flex gap-4 mt-2">
            {[
              { Icon: IconLinkedIn,  href: '#', label: 'LinkedIn'  },
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
