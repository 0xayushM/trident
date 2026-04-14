'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderImage {
  src: string;
  alt?: string;
  isVideo?: boolean;
}

const IMAGES: PreloaderImage[] = [
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
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const setRevealRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      revealImagesRef.current[index] = el;
    },
    [],
  );

  const setScaleUpRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      scaleUpRef.current[index] = el;
    },
    [],
  );

  const setSecondLoopImgRef = useCallback(
    (index: number) => (el: HTMLImageElement | null) => {
      secondLoopImagesRef.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const middleIndex = Math.floor(IMAGES.length / 2);
    const totalRefs = IMAGES.length * 2;

    const revealEls = revealImagesRef.current.filter(Boolean) as HTMLDivElement[];
    const scaleEls = scaleUpRef.current.filter(Boolean) as HTMLDivElement[];
    const secondImgs = secondLoopImagesRef.current.filter(Boolean) as HTMLImageElement[];

    const radiusTarget = scaleUpRef.current[IMAGES.length + middleIndex];
    const scaleDownTargets = secondImgs.filter((_, i) => i !== middleIndex);

    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        onComplete?.();
        if (containerRef.current) containerRef.current.style.display = 'none';
      },
    });
    tlRef.current = tl;

    // Phase 1: slide all images from right to left
    if (revealEls.length) {
      tl.fromTo(
        revealEls,
        { xPercent: 500 },
        { xPercent: -500, duration: 2.5, stagger: 0.05 },
      );
    }

    // Phase 2: scale down non-middle images
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

    // Phase 3: scale middle image to fullscreen
    if (scaleEls.length) {
      tl.fromTo(
        scaleEls,
        { width: '10em', height: '10em' },
        { width: '100vw', height: '100dvh', duration: 2 },
        '< 0.5',
      );
    }

    // Phase 4: fade out after animation completes
    if (containerRef.current) {
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }, '+=0.5');
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
          maskImage:
            'linear-gradient(to right, transparent, black 5em, black calc(100% - 5em), transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 5em, black calc(100% - 5em), transparent)',
        }}
      >
        <div className="relative overflow-hidden">
          {/* First loop */}
          <div className="absolute flex items-center justify-center rounded-[0.5em]">
            {IMAGES.map((image: PreloaderImage, i: number) => (
              <div
                key={`first-${i}`}
                ref={setRevealRef(i)}
                className="relative px-[1em]"
              >
                <div
                  ref={setScaleUpRef(i)}
                  className="relative flex h-[10em] w-[10em] items-center justify-center rounded-[0.5em]"
                >
                  {image.isVideo ? (
                    <video
                      src={image.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute h-full w-full rounded-[inherit] object-cover object-right md:object-center"
                    />
                  ) : (
                    <img
                      loading="eager"
                      src={image.src}
                      alt={image.alt ?? ''}
                      className="absolute h-full w-full rounded-[inherit] object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Second loop */}
          <div className="relative left-full flex items-center justify-center rounded-[0.5em]">
            {IMAGES.map((image: PreloaderImage, i: number) => {
              const isMiddle = i === middleIndex;
              return (
                <div
                  key={`second-${i}`}
                  ref={setRevealRef(IMAGES.length + i)}
                  className="relative px-[1em]"
                >
                  <div
                    ref={setScaleUpRef(IMAGES.length + i)}
                    className={`relative flex h-[10em] w-[10em] items-center justify-center rounded-[0.5em] ${isMiddle ? 'will-change-transform' : ''}`}
                    style={
                      isMiddle
                        ? { transition: 'border-radius 0.5s cubic-bezier(1, 0, 0, 1)' }
                        : undefined
                    }
                  >
                    {image.isVideo ? (
                      <video
                        ref={setSecondLoopImgRef(i) as any}
                        src={image.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`absolute h-full w-full rounded-[inherit] object-cover object-right md:object-center ${isMiddle ? '' : 'will-change-transform'}`}
                      />
                    ) : (
                      <img
                        ref={setSecondLoopImgRef(i)}
                        loading="eager"
                        src={image.src}
                        alt={image.alt ?? ''}
                        className={`absolute h-full w-full rounded-[inherit] object-cover ${isMiddle ? '' : 'will-change-transform'}`}
                      />
                    )}
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
