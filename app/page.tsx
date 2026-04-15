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
export default function Home() {
  const [preloading, setPreloading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  return (
    <div className="min-h-screen">
      {preloading && <Preloader onComplete={() => setPreloading(false)} />}
      <Navbar ready={!preloading} />
      <VideoScrollCanvas onReady={() => setHeroReady(true)} />
      <BrandStatement />
      <KeyPoints />
      <Brands />
      <Tos />
      <About />
      <Benefits />
      <Team />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
