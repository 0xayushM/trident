'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PhotoCard from './PhotoCard';
import type { TeamMember } from './teamData';
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface TeamCardProps {
  member: TeamMember;
  index: number;
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

function SplitReveal({
  text,
  active,
  className = '',
  animateColors = false,
}: {
  text: string;
  active: boolean;
  className?: string;
  animateColors?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const colorTlRef = useRef<gsap.core.Timeline | null>(null);

  // Create split on mount
  useEffect(() => {
    if (!ref.current) return;
    splitRef.current = SplitText.create(ref.current, {
      type: 'lines,words,chars',
      mask: 'lines',
    });
    // Start hidden
    if (splitRef.current.lines) {
      gsap.set(splitRef.current.lines, { yPercent: 110 });
    }
    if (animateColors && splitRef.current.chars) {
      gsap.set(splitRef.current.chars, { color: '#d0d0d0' });
    }
    return () => {
      tweenRef.current?.kill();
      colorTlRef.current?.kill();
      splitRef.current?.revert();
    };
  }, []);

  // Animate in/out when active changes
  useEffect(() => {
    const lines = splitRef.current?.lines;
    const chars = splitRef.current?.chars;
    if (!lines?.length) return;

    tweenRef.current?.kill();
    colorTlRef.current?.kill();

    if (active) {
      // Reset below before revealing upward
      gsap.set(lines, { yPercent: 110 });
      if (animateColors && chars?.length) {
        gsap.set(chars, { color: '#d0d0d0' });
      }

      tweenRef.current = gsap.to(lines, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power4.out',
        overwrite: true,
      });

      // Color sweep runs alongside the reveal with a small delay
      if (animateColors && chars?.length) {
        const tl = gsap.timeline({ delay: 0.3 });
        tl.to(chars, {
          color: '#dc2626',
          duration: 0.3,
          stagger: 0.03,
          ease: 'none',
        });
        tl.to(chars, {
          color: '#1a1a1a',
          duration: 0.3,
          stagger: 0.03,
          ease: 'none',
        }, '<0.15');
        colorTlRef.current = tl;
      }
    } else {
      tweenRef.current = gsap.to(lines, {
        yPercent: -150,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.inOut',
        overwrite: true,
      });
    }
  }, [active]);

  return (
    <div ref={ref} className={className}>
      {text}
    </div>
  );
}

export default function TeamCard({ member, index }: TeamCardProps) {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.15 });
  const isFlipped = member.flip;

  const textPanel = (
    <motion.div
      initial={{ opacity: 0, x: isFlipped ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1,
        maxWidth: 880,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 20,
        padding: '0 clamp(16px, 3vw, 40px)',
      }}
    >
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          letterSpacing: '0.1em',
          color: '#ef4444',
          fontWeight: 600,
        }}
      >
        {member.number}
      </span>

      <h3 className='uppercase'
        style={{
          fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(28px, 3.5vw, 52px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: '#0f172a',
          margin: 0,
        }}
      >
        <AnimatedWord delay={200} inView={inView}>{member.firstname}</AnimatedWord>{" "}
        <AnimatedWord delay={200} inView={inView}>{member.lastname}</AnimatedWord>
         
      </h3>

      <p
        style={{
          fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(12px, 1vw, 14px)',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#ef4444',
          margin: 0,
        }}
      >
        {member.role}
      </p>

      <div style={{ width: 40, height: 2, background: '#e2e8f0' }} />

      <div
        style={{
          fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(14px, 1.1vw, 16px)',
          lineHeight: 1.75,
          color: '#64748b',
          margin: 0,
          maxWidth: 620,
        }}
      >
        <SplitReveal text={member.bio} active={inView} animateColors={true} />
      </div>
    </motion.div>
  );

  const photoPanel = (
    <motion.div
      initial={{ opacity: 0, x: isFlipped ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <PhotoCard src={member.photo} name={member.firstname} flip={isFlipped} />
    </motion.div>
  );

  return (
    <div
      className='py-4 px-8 md:px-12'
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: isFlipped ? 'row-reverse' : 'row',
        alignItems: 'center',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      {photoPanel}
      {textPanel}
    </div>
  );
}
