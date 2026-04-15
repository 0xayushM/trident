'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

type SplitMode = 'lines' | 'words' | 'chars';

interface ModeSettings {
  duration?: number;
  stagger?: number;
}

type SplitRevealConfig = Partial<Record<SplitMode, ModeSettings>>;

interface SplitLineRevealProps {
  children: string;
  className?: string;
  mode?: SplitMode;
  config?: SplitRevealConfig;
  delay?: number;
  triggerOnScroll?: boolean;
  scrollElement?: string | HTMLElement | null;
  as?: keyof HTMLElementTagNameMap;
}

const DEFAULT_CONFIG: Record<SplitMode, { duration: number; stagger: number }> = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.008 },
};

export default function SplitLineReveal({
  children,
  className = '',
  mode = 'lines',
  config,
  as = 'div',
  delay = 0,
  triggerOnScroll = false,
  scrollElement,
}: SplitLineRevealProps) {
  const wrapperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const node = wrapperRef.current;
    if (!node) return;

    const resolvedScroller =
      typeof scrollElement === 'string'
        ? document.querySelector<HTMLElement>(scrollElement)
        : scrollElement instanceof HTMLElement
        ? scrollElement
        : null;

    const scroller = resolvedScroller instanceof HTMLElement ? resolvedScroller : window;

    const overrides = config?.[mode];
    const defaults = DEFAULT_CONFIG[mode];
    const resolvedConfig = {
      duration: overrides?.duration ?? defaults.duration,
      stagger: overrides?.stagger ?? defaults.stagger,
    };

    const split = SplitText.create(node, {
      type: 'lines,words,chars',
      linesClass: '++split-line-wrapper',
    });

    const targets =
      mode === 'lines' ? split.lines ?? [] : mode === 'words' ? split.words ?? [] : split.chars ?? [];

    if (!targets.length) {
      split.revert();
      return;
    }

    gsap.set(targets, { yPercent: 110 });

    const tween = gsap.to(targets, {
      yPercent: 0,
      duration: resolvedConfig.duration,
      stagger: resolvedConfig.stagger,
      ease: 'power4.out',
      delay: delay,
      scrollTrigger: triggerOnScroll
        ? {
            trigger: node,
            scroller,
            start: 'top 85%',
          }
        : undefined,
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, [mode, config, delay, triggerOnScroll, scrollElement, as]);

  const Component = as as any;

  return (
    <Component 
      ref={wrapperRef} 
      className={className}
    >
      {children}
    </Component>
  );
}
