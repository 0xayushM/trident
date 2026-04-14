'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Image {
  src: string;
  alt?: string;
}

const IMAGES: Image[] = [
  { src: '/images/img1.jpg', alt: 'Image 1' },
  { src: '/images/img2.jpg', alt: 'Image 2' },
  { src: '/images/main.webp', alt: 'Main' },
  { src: '/images/img4.jpg', alt: 'Image 4' },
  { src: '/images/img5.jpg', alt: 'Image 5' },
];

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const scaleUpRef = useRef<(HTMLDivElement | null)[]>([]);
  const secondLoopImagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const middleIndex = Math.floor(IMAGES.length / 2);
    const radiusTarget = scaleUpRef.current[IMAGES.length + middleIndex];
    const scaleDownTargets = secondLoopImagesRef.current.filter((_, i) => i !== middleIndex);

    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        if (onComplete) onComplete();
        if (containerRef.current) containerRef.current.style.display = 'none';
      },
    });

    const revealEls = revealImagesRef.current.filter(Boolean);
    const scaleEls = scaleUpRef.current.filter(Boolean);

    if (revealEls.length) {
      tl.fromTo(
        revealEls,
        { xPercent: 500 },
        { xPercent: -500, duration: 2.5, stagger: 0.05 },
      );
    }

    if (scaleDownTargets.length) {
      tl.to(
        scaleDownTargets,
        {
          scale: 0.5,
          duration: 2,
          stagger: { each: 0.05, from: 'edges', ease: 'none' },
          onComplete: () => {
            if (radiusTarget) radiusTarget.style.borderRadius = '0';
          },
        },
        '-=0.1',
      );
    }

    if (scaleEls.length) {
      tl.fromTo(
        scaleEls,
        { width: '10em', height: '10em' },
        { width: '100vw', height: '100dvh', duration: 2 },
        '< 0.5',
      );
    }

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const middleIndex = Math.floor(IMAGES.length / 2);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-black"
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 5em, black calc(100% - 5em), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5em, black calc(100% - 5em), transparent)',
        }}
      >
        <div className="relative overflow-hidden">
          <div className="absolute flex items-center justify-center rounded-[0.5em]">
            {IMAGES.map((image, i) => (
              <div
                key={`first-${i}`}
                ref={(el) => { revealImagesRef.current[i] = el; }}
                className="relative px-[1em]"
              >
                <div
                  ref={(el) => { scaleUpRef.current[i] = el; }}
                  className="relative flex h-[10em] w-[10em] items-center justify-center rounded-[0.5em]"
                >
                  <img
                    loading="eager"
                    src={image.src}
                    alt={image.alt ?? ''}
                    className={`absolute h-full w-full rounded-[inherit] object-cover ${i === middleIndex ? 'object-right md:object-center' : ''}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="relative left-full flex items-center justify-center rounded-[0.5em]">
            {IMAGES.map((image, i) => {
              const isMiddle = i === middleIndex;
              return (
                <div
                  key={`second-${i}`}
                  ref={(el) => { revealImagesRef.current[IMAGES.length + i] = el; }}
                  className="relative px-[1em]"
                >
                  <div
                    ref={(el) => { scaleUpRef.current[IMAGES.length + i] = el; }}
                    className={`relative flex h-[10em] w-[10em] items-center justify-center rounded-[0.5em] ${isMiddle ? 'will-change-transform' : ''}`}
                    style={isMiddle ? { transition: 'border-radius 0.5s cubic-bezier(1, 0, 0, 1)' } : undefined}
                  >
                    <img
                      ref={(el) => { secondLoopImagesRef.current[i] = el; }}
                      loading="eager"
                      src={image.src}
                      alt={image.alt ?? ''}
                      className={`absolute h-full w-full rounded-[inherit] object-cover ${isMiddle ? 'object-right md:object-center' : 'will-change-transform'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
