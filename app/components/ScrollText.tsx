'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ScrollTextProps {
  scrollProgress: number;
}

interface Word {
  text: string;
  startProgress: number;
  endProgress: number;
}

const words: Word[] = [
  { text: "RELIABLE", startProgress: 0.15, endProgress: 0.25 },
  { text: "GLOBAL", startProgress: 0.25, endProgress: 0.35 },
  { text: "SHIPPING", startProgress: 0.35, endProgress: 0.45 },
  { text: "&", startProgress: 0.45, endProgress: 0.5 },
  { text: "LOGISTICS", startProgress: 0.5, endProgress: 0.6 },
  { text: "SOLUTIONS", startProgress: 0.6, endProgress: 0.7 },
];

const fadeOutStart = 0.95;

export default function ScrollText({ scrollProgress }: ScrollTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate each word
    words.forEach((word, wordIndex) => {
      const wordElement = wordsRef.current[wordIndex];
      if (!wordElement) return;

      const chars = wordElement.querySelectorAll('.char');

      if (scrollProgress < word.startProgress) {
        gsap.to(wordElement, {
          opacity: 0,
          duration: 0.2,
        });
        gsap.to(chars, {
          opacity: 0,
          y: 20,
          duration: 0.2,
        });
      } else if (scrollProgress >= word.startProgress && scrollProgress <= word.endProgress) {
        gsap.to(wordElement, {
          opacity: 1,
          duration: 0.3,
        });
        
        const progress = (scrollProgress - word.startProgress) / (word.endProgress - word.startProgress);
        const charsToShow = Math.floor(progress * chars.length);
        
        chars.forEach((char, index) => {
          if (index < charsToShow) {
            gsap.to(char, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
            
            if (index === charsToShow - 1) {
              gsap.to(char, {
                color: '#EF4444',
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out',
              });
            } else {
              gsap.to(char, {
                color: '#FFFFFF',
                scale: 1,
                duration: 0.2,
                ease: 'power2.out',
              });
            }
          } else {
            gsap.to(char, {
              opacity: 0,
              y: 20,
              duration: 0.2,
            });
          }
        });
      } else if (scrollProgress >= fadeOutStart) {
        gsap.to(wordElement, {
          opacity: 0,
          duration: 0.3,
        });
      } else {
        gsap.to(wordElement, {
          opacity: 1,
          duration: 0.3,
        });
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          color: '#FFFFFF',
          scale: 1,
          duration: 0.3,
        });
      }
    });
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-start top-1/4 justify-center pointer-events-none px-4 md:px-8">
      <div className="text-center max-w-8xl">
        <div 
          className="flex flex-wrap justify-center gap-x-4 gap-y-0 nebula-text tracking-tight leading-[0.1]"
        >
          {words.map((word, wordIndex) => (
            <div
              key={wordIndex}
              ref={(el) => { wordsRef.current[wordIndex] = el; }}
              className="text-4xl md:text-6xl lg:text-8xl font-bold"
            >
              {word.text.split(' ').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="char opacity-0 px-2"
                  style={{ 
                    transform: 'translateY(20px)',
                    display: 'inline-block'
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
