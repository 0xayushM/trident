'use client';

import { useState, useEffect } from 'react';

interface AnimatedLetterProps {
  children: string;
  delay?: number;
  inView?: boolean;
}

export default function AnimatedLetter({ children, delay = 0, inView = false }: AnimatedLetterProps) {
  const [phase, setPhase] = useState<'initial' | 'red' | 'black'>('initial');

  useEffect(() => {
    if (!inView) {
      setPhase('initial');
      return;
    }

    const timer1 = setTimeout(() => {
      setPhase('red');
    }, delay);

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
      case 'initial':
        return '#d0d0d0';
      case 'red':
        return '#dc2626';
      case 'black':
        return '#1a1a1a';
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
