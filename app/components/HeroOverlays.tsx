'use client';

import Image from 'next/image';

export default function HeroOverlays() {
  return (
    <>
      <div className="hidden md:block absolute bottom-8 left-8 md:left-12 z-40 max-w-xs">
        <h1 className="text-4xl md:text-6xl font-bold text-white doomsday-text">TRIDENT</h1>
      </div>

      <div className="absolute bottom-8 px-8 md:right-12 z-40 max-w-md">
        <div className="flex items-center gap-4 text-white">
          <p className="text-lg md:text-xl font-medium">
            Delivering your cargo safely, on time, and anywhere in the world.
          </p>
          <div className="w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="50" cy="50" r="48" />
              <line x1="50" y1="20" x2="50" y2="80" />
              <line x1="20" y1="50" x2="80" y2="50" />
              <line x1="30" y1="30" x2="70" y2="70" />
              <line x1="70" y1="30" x2="30" y2="70" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
