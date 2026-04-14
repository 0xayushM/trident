'use client';

import { useState } from 'react';
import VideoScrollCanvas from "./components/VideoScrollCanvas";
import Navbar from "./components/Navbar";
import WaveDivider from "./components/WaveDivider";
import BrandStatement from "./components/BrandStatement";
import About from "./components/About";
import StatsBar from "./components/StatsBar";
import ServicesGrid from "./components/ServicesGrid";
import TrustProcess from "./components/TrustProcess";
import GlobalReach from "./components/GlobalReach";
import WhyTrident from "./components/WhyTrident";
import Certifications from "./components/Certifications";
import Testimonials from "./components/Testimonials";
import CTAStrip from "./components/CTAStrip";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import KeyPoints from "./components/KeyPoints";
import Benefits from "./components/Benefits";
import Preloader from "./components/Preloader";

export default function Home() {
  const [preloading, setPreloading] = useState(true);

  return (
    <div className="min-h-screen">
      {preloading && <Preloader onComplete={() => setPreloading(false)} />}
      <div
        className="transition-opacity duration-1000 ease-out"
        style={{ opacity: preloading ? 0 : 1 }}
      >
        <Navbar ready={!preloading} />
        <VideoScrollCanvas />
      {/* <WaveDivider /> */}
      <BrandStatement />
      <KeyPoints />
      <About />
      <Benefits />
      {/* <StatsBar /> */}
      <ServicesGrid />
      <TrustProcess />
      <GlobalReach />
      <WhyTrident />
      <Certifications />
      <Testimonials />
      <CTAStrip />
      <Contact />
      <Footer />
      </div>
    </div>
  );
}
