'use client';

import { useRef, useState, useEffect, useId } from 'react';
import Image from 'next/image';
import { buildCardPath } from './CardPath';

interface PhotoCardProps {
  src: string;
  name: string;
  flip?: boolean;
}

export default function PhotoCard({ src, name, flip = false }: PhotoCardProps) {
  const clipId = `team-clip-${useId().replace(/:/g, '')}`;
  const divRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState('');

  useEffect(() => {
    const rebuild = () => {
      if (!divRef.current) return;
      const { width, height } = divRef.current.getBoundingClientRect();
      setPath(
        buildCardPath({
          W: width,
          H: height,
          stepFlatW: Math.round(width * 0.32),
          stepH: 28,
          stepDiagW: 28,
          stepRadius: 11,
          tr: 22,
          slotDepth: 28,
          slotFlatH: Math.round(height * 0.22),
          slotAngleH: 28,
          slotPosPct: 35,
          slotIR: 9,
          slotER: 6,
          br: 36,
          bl: 36,
        })
      );
    };
    rebuild();
    const ro = new ResizeObserver(rebuild);
    if (divRef.current) ro.observe(divRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <svg width={0} height={0} aria-hidden className="absolute overflow-hidden">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={path} />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={divRef}
        className="flex-shrink-0 relative bg-[#0b0d11] overflow-hidden"
        style={{
          width: 'clamp(360px, 42vw, 560px)',
          height: 'clamp(340px, 60vh, 680px)',
          clipPath: path ? `url(#${clipId})` : undefined,
          transform: flip ? 'scaleX(-1)' : undefined,
        }}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover object-top grayscale"
          style={{ transform: flip ? 'scaleX(-1)' : undefined }}
          sizes="(max-width: 768px) 90vw, 42vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)',
          }}
        />
      </div>
    </>
  );
}
