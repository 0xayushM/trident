'use client';

import { useState } from 'react';
import VideoScrollCanvas from "./components/VideoScrollCanvas";
import Navbar from "./components/Navbar";
import BrandStatement from "./components/BrandStatement";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import KeyPoints from "./components/KeyPoints";
import Benefits from "./components/Benefits";
import Brands from "./components/Brands";
import Tos from "./components/Tos";
import Team from "./components/Team";
import Preloader from "./components/Preloader";
import WhatsAppButton from "./components/WhatsAppButton";
import ProblemSection from "./components/ProblemSection";
import QuotePopup from "./components/QuotePopup";
import TrafficTracker from "./components/TrafficTracker";

export default function Home() {
  const [preloading, setPreloading] = useState(true);

  return (
    <div className="min-h-screen">
      {preloading && <Preloader onComplete={() => setPreloading(false)} />}
      <Navbar ready={!preloading} />

      {/* 1 · Hero — hook + primary CTA */}
      <VideoScrollCanvas onReady={() => {}} />

      {/* 2 · Brand positioning + Stats bar */}
      <BrandStatement />

      {/* 3 · Key differentiators (scroll-animated cards) */}
      <KeyPoints />

      {/* 4 · Problem section — name the pain before the solution */}
      <ProblemSection />

      {/* 5 · Social proof — partner logos */}
      <Brands />

      {/* 6 · Our process — Trail of Shipment */}
      <Tos />

      {/* 8 · Company story */}
      <About />
      
      {/* 7 · Benefits — detailed value props */}
      <Benefits />

      {/* CTA strip — between Benefits and Team */}
      <div className="relative w-full bg-[#080808] py-20 md:py-24 flex flex-col items-center justify-center text-center gap-6 px-6 overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }} />
        {/* Red glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)',
        }} />
        <p className="relative font-mono text-[10px] tracking-[0.22em] uppercase text-red-500">
          Zero Commitment · 24-Hour Response
        </p>
        <h2 className="relative unica-text font-semibold text-white text-2xl md:text-4xl tracking-tight max-w-xl leading-snug">
          Know your landed cost before you commit to a single kilogram.
        </h2>
        <p className="relative text-white/40 text-sm max-w-md leading-relaxed">
          Send us your product spec — species, volume, IQF or block, destination port — and we&apos;ll come back with supplier options, pricing, and an estimated landed cost. No obligation.
        </p>
        <button
          onClick={() => window.dispatchEvent(new Event('openQuotePopup'))}
          className="relative mt-2 inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white text-[12px] font-mono tracking-[0.14em] uppercase px-10 py-4 rounded-lg transition-colors duration-200"
          style={{ boxShadow: '0 8px 32px rgba(239,68,68,0.25)' }}
        >
          Get My Free Quote
          <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
               stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </button>
        <p className="relative font-mono text-[9px] text-white/20 tracking-widest uppercase">
          No spam · Response within 24 hours · Kolkata, India
        </p>
      </div>

      {/* 9 · Team */}
      <Team />

      {/* 10 · Testimonials */}
      <Testimonials />

      {/* 11 · Contact */}
      <Contact />

      <Footer />
      <WhatsAppButton />

      {/* ── Global overlays ── */}
      <QuotePopup />
      <TrafficTracker />
    </div>
  );
}
