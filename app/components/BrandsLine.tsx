'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';

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
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl unica-text mb-6 font-medium tracking-tighter leading-[0.9]">
          <span className="text-slate-900">Built by </span>
          <AnimatedWord delay={500} inView={inView}>industry</AnimatedWord>{" "}
          <AnimatedWord delay={500} inView={inView}>leaders</AnimatedWord><br/>
          <span className="text-slate-900"> who want a new</span>
          <br/>
          <AnimatedWord delay={800} inView={inView}>industry</AnimatedWord>{" "}
          <AnimatedWord delay={1100} inView={inView}>standard</AnimatedWord>
          <span className="text-slate-900"> in shipping.</span>
        </h2>
      </motion.div>
    </section>
  );
}
// Imagine your supply chain as an
// intelligent bridge seamlessly
// connecting origin to destination.
