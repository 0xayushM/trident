'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface ScrollToExploreProps {
  scrollProgress: number;
}

export default function ScrollToExplore({ scrollProgress }: ScrollToExploreProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (scrollProgress > 0.1) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [scrollProgress]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (scrollProgress <= 0.1) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scrollProgress]);

  useEffect(() => {
    if (elementRef.current && scrollProgress <= 0.1) {
      gsap.to(elementRef.current, {
        x: mousePosition.x,
        y: mousePosition.y,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [mousePosition, scrollProgress]);

  useEffect(() => {
    if (elementRef.current) {
      if (isVisible) {
        gsap.to(elementRef.current, {
          opacity: 1,
          duration: 0.3,
        });
      } else {
        gsap.to(elementRef.current, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={elementRef}
      className="fixed pointer-events-none z-50"
      style={{
        left: 30,
        top: 0,
        opacity: 0,
      }}
    >
      <div className="relative flex flex-col items-center gap-2">
        <div className="text-white text-sm font-medium tracking-wider uppercase opacity-80">
          Scroll to Explore
        </div>
      </div>
    </div>
  );
}
