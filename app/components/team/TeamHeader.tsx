'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TeamHeaderProps {
  inView: boolean;
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

export default function TeamHeader() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });
  return (
    <motion.div
      ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-12 md:pt-20 text-center"
    >
      <p
        style={{
          fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#ef4444',
          margin: '0 0 16px',
        }}
      >
        The People Behind It
      </p>
      <h2 className='text-4xl md:text-6xl lg:text-7xl unica-text mb-0 font-medium tracking-tighter leading-[0.9]'>
        <AnimatedWord delay={200} inView={inView}>Meet</AnimatedWord>{" "}
      <AnimatedWord delay={400} inView={inView}>The</AnimatedWord>{" "}
      <AnimatedWord delay={600} inView={inView}>Team</AnimatedWord>{" "}
      </h2>
    </motion.div>
  );
}
