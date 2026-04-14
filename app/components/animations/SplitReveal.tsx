'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface SplitRevealProps {
  text: string;
  active?: boolean;
  className?: string;
  animateColors?: boolean;
}

export default function SplitReveal({
  text,
  active = true,
  className = '',
  animateColors = false,
}: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const colorTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    splitRef.current = SplitText.create(ref.current, {
      type: 'lines,words,chars',
      mask: 'lines',
    });
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
  }, [animateColors]);

  useEffect(() => {
    const lines = splitRef.current?.lines;
    const chars = splitRef.current?.chars;
    if (!lines?.length) return;

    tweenRef.current?.kill();
    colorTlRef.current?.kill();

    if (active) {
      gsap.set(lines, { yPercent: 110 });
      if (animateColors && chars?.length) {
        gsap.set(chars, { color: '#d0d0d0' });
      }

      tweenRef.current = gsap.to(lines, {
        yPercent: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power4.out',
        overwrite: true,
      });

      if (animateColors && chars?.length) {
        const tl = gsap.timeline({ delay: 0.3 });
        tl.to(chars, {
          color: '#dc2626',
          duration: 0.3,
          stagger: 0.03,
          ease: 'none',
        });
        tl.to(
          chars,
          {
            color: '#1a1a1a',
            duration: 0.3,
            stagger: 0.03,
            ease: 'none',
          },
          '<0.15'
        );
        colorTlRef.current = tl;
      }
    } else {
      tweenRef.current = gsap.to(lines, {
        yPercent: -150,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power2.inOut',
        overwrite: true,
      });
    }
  }, [active, animateColors]);

  return (
    <div ref={ref} className={className}>
      {text}
    </div>
  );
}
