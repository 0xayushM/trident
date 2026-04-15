'use client';

import { useEffect, useRef, useState } from 'react';

export default function WaveDivider() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementTop = rect.top;
      const triggerPoint = windowHeight; 
      
      if (elementTop < triggerPoint) {
        const scrollProgress = Math.max(0, Math.min(1, (triggerPoint - elementTop) / 300));
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
    
    const waveHeight = 80 * (1 - progress);
    const baseY = 100;
    const curveUp = baseY - waveHeight;
    
    const path = `
      M 0,100 
      L 0,${baseY} 
      Q 480,${curveUp} 960,${baseY} 
      T 1920,${baseY} 
      L 1920,100 
      Z
    `;

    pathRef.current.setAttribute('d', path);
  }, [progress]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-transparent"
      style={{ height: '150px' }}
    >
      <svg
        viewBox="0 0 1920 150"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <path
          ref={pathRef}
          fill="#ffffff"
          d="M 0,150 Q 480,70 960,150 T 1920,150 L 1920,150 L 0,150 Z"
        />
      </svg>
    </section>
  );
}
