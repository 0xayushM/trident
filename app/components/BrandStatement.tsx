'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import StatsBar from './StatsBar';

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
        setMaxDepth(20); // Desktop
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
      className="absolute top-0 left-0 right-0 w-full pointer-events-none"
      style={{ height: '40px', transform: 'translateY(-100%)', zIndex: 1 }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="w-full h-full block bg-transparent"
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

function AnimatedLetter({ 
  children, 
  delay = 0,
  inView = false
}: { 
  children: string; 
  delay?: number;
  inView?: boolean;
}) {
  const [phase, setPhase] = useState<'initial' | 'red' | 'black'>('initial');

  useEffect(() => {
    if (!inView) {
      setPhase('initial');
      return;
    }

    // Phase 1: light gray → red
    const timer1 = setTimeout(() => {
      setPhase('red');
    }, delay);

    // Phase 2: red → black
    const timer2 = setTimeout(() => {
      setPhase('black');
    }, delay + 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay, inView]);

  const getColor = () => {
    switch (phase) {
      case 'initial': return '#d0d0d0';
      case 'red': return '#dc2626';
      case 'black': return '#1a1a1a';
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

export default function BrandStatement() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  return (
    <section className="relative w-full bg-white">
      <TopDivider />
      <StatsBar />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-8 py-24 md:py-32 text-center"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[11px] font-semibold text-red-500 uppercase tracking-[0.18em] mb-7"
        >
          Indian Seafood · Global Standards
        </motion.p>

        <h2 className="text-4xl md:text-6xl lg:text-7xl unica-text mb-8 font-medium tracking-tighter leading-[1.02]">
          <span className="text-slate-900">The </span>
          <AnimatedWord delay={300} inView={inView}>precision</AnimatedWord>{' '}
          <AnimatedWord delay={600} inView={inView}>bridge</AnimatedWord>
          <br />
          <span className="text-slate-900">between </span>
          <AnimatedWord delay={900} inView={inView}>Indian</AnimatedWord>{' '}
          <AnimatedWord delay={1100} inView={inView}>farms</AnimatedWord>
          <span className="text-slate-900"> and</span>
          <br />
          <AnimatedWord delay={1300} inView={inView}>global</AnimatedWord>{' '}
          <AnimatedWord delay={1500} inView={inView}>plates.</AnimatedWord>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.55 }}
          className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Eliminate the volatility of international seafood procurement through
          rigorous on-ground auditing, zero-variance sourcing, and precision logistics.
        </motion.p>
      </motion.div>
    </section>
  );
}
