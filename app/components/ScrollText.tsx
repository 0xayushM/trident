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
  { text: "Your", startProgress: 0.15, endProgress: 0.22 },
  { text: "global", startProgress: 0.22, endProgress: 0.32 },
  { text: "gateway", startProgress: 0.32, endProgress: 0.42 },
  { text: "to", startProgress: 0.42, endProgress: 0.48 },
  { text: "premium", startProgress: 0.48, endProgress: 0.58 },
  { text: "shrimp.", startProgress: 0.58, endProgress: 0.7 },
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
    <div ref={containerRef} className="absolute inset-x-0 bottom-[180px] md:bottom-[150px] flex justify-center pointer-events-none px-4 md:px-8">
      <div className="text-center max-w-6xl">
        <div 
          className="flex flex-wrap justify-center gap-x-4 gap-y-0 unica-text tracking-tight leading-[0.1]"
        >
          {words.map((word, wordIndex) => (
            <div
              key={wordIndex}
              ref={(el) => { wordsRef.current[wordIndex] = el; }}
              className="text-4xl md:text-6xl lg:text-8xl font-normal tracking-tighter"
            >
              {word.text.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="char opacity-0 px-0"
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
