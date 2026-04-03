'use client';

import { useEffect, useRef, useState } from 'react';
import ScrollText from './ScrollText';
import HeroOverlays from './HeroOverlays';

const FRAME_COUNT_1 = 301;
// const FRAME_COUNT_2 = 241;
const TOTAL_FRAMES = FRAME_COUNT_1;

export default function VideoScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    });
    if (!ctx) return;

    let animationId: number;
    let imageAspect = 1880 / 1100;
    let drawWidth = 0;
    let drawHeight = 0;
    let offsetX = 0;
    let offsetY = 0;
    let currentFrame = 0;

    const calculateDimensions = () => {
      const canvasAspect = canvas.width / canvas.height;

      if (canvasAspect > imageAspect) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imageAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imageAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      calculateDimensions();
    };

    const preloadImages = () => {
      let loadedCount = 0;
      
      for (let i = 1; i <= FRAME_COUNT_1; i++) {
        const img = new Image();
        img.src = `/frames/frame-${String(i).padStart(4, '0')}.webp`;
        
        img.onload = () => {
          loadedCount++;
          if (loadedCount === 1) {
            imageAspect = img.width / img.height;
            resizeCanvas();
          }
          if (loadedCount === TOTAL_FRAMES) {
            setImagesLoaded(true);
          }
        };
        
        framesRef.current[i - 1] = img;
      }
    };

    const render = () => {
      if (imagesLoaded && framesRef.current.length > 0) {
        const rect = container.getBoundingClientRect();
        const scrollStart = 0;
        const scrollEnd = window.innerHeight;
        
        const progress = Math.max(
          0,
          Math.min(1, (scrollStart - rect.top) / (rect.height - scrollEnd))
        );
        
        setScrollProgress(progress);

        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * TOTAL_FRAMES)
        );

        if (frameIndex !== currentFrame) {
          currentFrame = frameIndex;
        }

        const img = framesRef.current[currentFrame];
        if (img && img.complete) {
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    resizeCanvas();
    preloadImages();
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [imagesLoaded]);

  return (
    <div ref={containerRef} className="relative h-[540vh] w-full bg-gradient-to-br from-slate-200 to-slate-300">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="relative overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />
          <ScrollText scrollProgress={scrollProgress} />
          {/* <HeroOverlays /> */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black">
              {/* <div className="text-lg">Loading frames...</div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
