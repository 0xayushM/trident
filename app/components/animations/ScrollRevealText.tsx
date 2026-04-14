'use client';

import { useEffect, useState, useRef } from 'react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollRevealText({
  text,
  className = '',
  containerRef,
}: ScrollRevealTextProps) {
  const [progress, setProgress] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !textRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only animate when the text element is in viewport
      // Start when text enters bottom of viewport (80% down)
      // Complete when text reaches center of viewport
      const textTop = textRect.top;
      const textBottom = textRect.bottom;
      
      // Text is visible when top is above 80% of viewport and bottom is above 20%
      if (textTop > windowHeight * 0.8 || textBottom < windowHeight * 0.2) {
        setProgress(0);
        return;
      }

      // Calculate progress: 0 when entering (at 80%), 1 when centered (at 50%)
      const enterPoint = windowHeight * 0.8;
      const centerPoint = windowHeight * 0.5;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (enterPoint - textTop) / (enterPoint - centerPoint))
      );

      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const chars = text.split('');
  const totalChars = chars.length;

  // Sweep position: how many chars have been "touched" by the red sweep
  // progress 0→0.5: red sweeps across all chars
  // progress 0.5→1: red turns to black
  const sweepPos = progress * totalChars * 2;

  return (
    <div ref={textRef} className={className}>
      {chars.map((char, charIndex) => {
        let color: string;

        if (charIndex < sweepPos - 10) {
          // Already swept, turn black
          color = '#1a1a1a';
        } else if (charIndex < sweepPos) {
          // Currently being swept, show red
          color = '#dc2626';
        } else {
          // Not yet swept, stay gray
          color = '#d0d0d0';
        }

        return (
          <span
            key={charIndex}
            style={{
              color,
              transition: 'color 0.15s ease-in-out',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
