'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SplitReveal } from './animations';

const problems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none"
        stroke="#ef4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M12 18v-4M12 10h.01" />
      </svg>
    ),
    headline: 'Bad documentation = your container sits at port.',
    body: 'A missing certificate of origin or a non-compliant label can cost you $15,000–$40,000 in demurrage and re-export fees.',
    stat: '$40K',
    statLabel: 'avg. demurrage exposure',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none"
        stroke="#ef4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={9} />
        <path d="M12 8v5M12 16h.01" />
      </svg>
    ),
    headline: 'Unvetted suppliers = FDA detention.',
    body: 'One shipment flagged under FFDCA Import Alert 16-131 can blacklist your company for months.',
    stat: 'Months',
    statLabel: 'of delays from one flagged shipment',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none"
        stroke="#ef4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v10M12 18v4M4.22 4.22l7.07 7.07M18.36 5.64l-5.66 5.66M2 12h10M18 12h4M4.22 19.78l7.07-7.07M18.36 18.36l-5.66-5.66" />
      </svg>
    ),
    headline: 'Opaque broker pricing = margin erosion.',
    body: 'Most brokers charge 3–5% on top of supplier price without disclosing it. You don\'t know what you\'re actually paying.',
    stat: '3–5%',
    statLabel: 'hidden broker markup',
  },
];

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
      case 'white': return 'rgba(255,255,255,0.95)';
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

export default function ProblemSection() {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.12 });
  const [painPointsRef, painPointsInView] = useInView({ triggerOnce: true, threshold: 0.12 });
  const [transitionRef, transitionInView] = useInView({ triggerOnce: false, threshold: 0.7 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-[#080808] py-24 md:py-36 overflow-hidden">
      {/* Fine grain texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Faint red glow top-left */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        {/* Section label + headline */}
        <div ref={ref} className="mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] font-semibold text-red-500 uppercase tracking-[0.18em] mb-5"
          >
            The Problem
          </motion.p>
          <h2 className="unica-text text-3xl md:text-5xl lg:text-[56px] font-semibold
                          leading-tight tracking-tight max-w-3xl">
            <AnimatedWord delay={200} inView={inView}>Importing</AnimatedWord>{' '}
            <AnimatedWord delay={600} inView={inView}>shrimp</AnimatedWord>{' '}
            <AnimatedWord delay={900} inView={inView}>without</AnimatedWord>{' '}
            <span className="text-white/95">the </span>
            <AnimatedWord delay={1200} inView={inView}>right</AnimatedWord>{' '}
            <AnimatedWord delay={1500} inView={inView}>broker</AnimatedWord>{' '}
            <span className="text-white/95">is an </span>
            <AnimatedWord delay={1800} inView={inView}>expensive</AnimatedWord>{' '}
            <AnimatedWord delay={2100} inView={inView}>education.</AnimatedWord>
          </h2>
        </div>

        {/* Pain points */}
        <div ref={painPointsRef} className="flex flex-col divide-y divide-white/[0.06]">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={painPointsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: 0.25 + index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="py-10 md:py-12 grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr] gap-6 md:gap-10 items-center
                         cursor-pointer transition-all duration-300 relative group"
              style={{
                transform: hoveredIndex === index ? 'translateX(8px)' : 'translateX(0)',
              }}
            >
              {/* Hover glow effect */}
              <div 
                className="absolute inset-0 -mx-6 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at left, rgba(239,68,68,0.03) 0%, transparent 70%)',
                }}
              />

              {/* Icon + headline */}
              <div className="flex items-start gap-4 relative z-10">
                <motion.div 
                  className="mt-0.5 shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center relative overflow-hidden"
                  style={{
                    borderColor: hoveredIndex === index ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.2)',
                    backgroundColor: hoveredIndex === index ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.05)',
                  }}
                  animate={hoveredIndex === index ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.6, repeat: hoveredIndex === index ? Infinity : 0, repeatDelay: 1 }}
                >
                  {/* Icon glow */}
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-red-500/20 blur-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <div className="relative z-10">
                    {problem.icon}
                  </div>
                </motion.div>
                <div className="flex-1">
                  <SplitReveal
                    text={problem.headline}
                    active={painPointsInView}
                    className="text-base md:text-lg font-semibold leading-snug tracking-tight text-white/90"
                  />
                </div>
              </div>

              {/* Body */}
              <div className="relative z-10">
                <SplitReveal
                  text={problem.body}
                  active={painPointsInView}
                  className="text-sm md:text-[15px] leading-relaxed text-white/45"
                />
              </div>

              {/* Stat */}
              <motion.div 
                className="text-right hidden md:block relative z-10"
                animate={hoveredIndex === index ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p 
                  className="text-2xl lg:text-3xl font-bold unica-text leading-none mb-1"
                  style={{
                    color: hoveredIndex === index ? '#ef4444' : '#ef4444',
                    textShadow: hoveredIndex === index ? '0 0 20px rgba(239,68,68,0.4)' : 'none',
                  }}
                >
                  {problem.stat}
                </motion.p>
                <p className="text-[11px] text-white/30 leading-snug">
                  {problem.statLabel}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Transition line */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-white/[0.08] relative overflow-hidden">
          {/* Animated border reveal */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={transitionInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-red-500/40 via-red-500/60 to-transparent origin-left"
          />
          
          <div ref={transitionRef}>
            <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-snug max-w-2xl">
              <AnimatedWord delay={200} inView={transitionInView}>Trident</AnimatedWord>{' '}
              <span className="text-white/90">was built specifically to </span>
              <AnimatedWord delay={800} inView={transitionInView}>eliminate</AnimatedWord>{' '}
              <AnimatedWord delay={1200} inView={transitionInView}>all</AnimatedWord>{' '}
              <AnimatedWord delay={1500} inView={transitionInView}>three.</AnimatedWord>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
