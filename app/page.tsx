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
