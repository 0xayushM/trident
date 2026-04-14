'use client';

import AnimatedLetter from './AnimatedLetter';

interface AnimatedWordProps {
  children: string;
  delay?: number;
  inView?: boolean;
}

export default function AnimatedWord({ children, delay = 0, inView = false }: AnimatedWordProps) {
  const letters = children.split('');

  return (
    <span className="inline-block">
      {letters.map((letter, index) => (
        <AnimatedLetter key={index} delay={delay + index * 80} inView={inView}>
          {letter}
        </AnimatedLetter>
      ))}
    </span>
  );
}
