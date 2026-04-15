'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';

// Approximate [x%, y%] positions on a 100×100 viewBox world map (equirectangular)
const ORIGINS = [
  { id: 'india', label: 'India', flag: '🇮🇳', x: 68, y: 44 },
  { id: 'ecuador', label: 'Ecuador', flag: '🇪🇨', x: 22, y: 55 },
  { id: 'indonesia', label: 'Indonesia', flag: '🇮🇩', x: 78, y: 54 },
  { id: 'vietnam', label: 'Vietnam', flag: '🇻🇳', x: 75, y: 46 },
  { id: 'argentina', label: 'Argentina', flag: '🇦🇷', x: 28, y: 74 },
];

const DESTINATIONS = [
  { id: 'usa', label: 'USA', flag: '🇺🇸', x: 15, y: 38 },
  { id: 'eu', label: 'EU', flag: '🇪🇺', x: 50, y: 32 },
  { id: 'gulf', label: 'Gulf', flag: '🇦🇪', x: 60, y: 44 },
  { id: 'japan', label: 'Japan', flag: '🇯🇵', x: 84, y: 36 },
  { id: 'uk', label: 'UK', flag: '🇬🇧', x: 47, y: 28 },
];

// Trade corridors: [originId, destId]
const CORRIDORS: [string, string][] = [
  ['india', 'usa'],
  ['india', 'eu'],
  ['india', 'gulf'],
  ['india', 'uk'],
  ['ecuador', 'usa'],
  ['ecuador', 'eu'],
  ['indonesia', 'japan'],
  ['indonesia', 'eu'],
  ['vietnam', 'usa'],
  ['vietnam', 'japan'],
  ['argentina', 'usa'],
  ['argentina', 'eu'],
];

function getNode(id: string) {
  return (
    ORIGINS.find((o) => o.id === id) || DESTINATIONS.find((d) => d.id === id)
  );
}

// Curved SVG path between two points using a quadratic bezier with control point offset upward
function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 12;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

interface AnimatedLineProps {
  path: string;
  delay: number;
  active: boolean;
}

function AnimatedLine({ path, delay, active }: AnimatedLineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [path]);

  return (
    <path
      ref={pathRef}
      d={path}
      fill="none"
      stroke="url(#corridorGrad)"
      strokeWidth="0.4"
      strokeLinecap="round"
      style={{
        strokeDasharray: length,
        strokeDashoffset: active ? 0 : length,
        transition: active
          ? `stroke-dashoffset 1.2s ease-out ${delay}ms`
          : 'none',
        opacity: active ? 0.6 : 0,
      }}
    />
  );
}

export default function GlobalMap() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [linesActive, setLinesActive] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setLinesActive(true), 400);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <section className="relative w-full bg-[#080808] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-16 max-w-2xl"
        >
          <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-4">
            Where We Operate
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white unica-text leading-tight tracking-tight mb-4">
            Global reach. Local expertise. Zero middlemen between us.
          </h2>
          <p className="text-sm md:text-base text-white/50 leading-relaxed">
            Trident sources from and connects buyers across every major seafood trade corridor in the world. Whether you're a US importer looking for Indian white shrimp, a European retailer sourcing from Ecuador, or a Gulf distributor buying from Vietnam — we know the suppliers, the ports, and the paperwork for every lane.
          </p>
        </motion.div>

        {/* World Map SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0d0d0d]"
          style={{ paddingBottom: '52%' }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 52"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Subtle grid */}
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 6}
                y1="0"
                x2={i * 6}
                y2="52"
                stroke="white"
                strokeWidth="0.08"
                strokeOpacity="0.06"
              />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 6.5}
                x2="100"
                y2={i * 6.5}
                stroke="white"
                strokeWidth="0.08"
                strokeOpacity="0.06"
              />
            ))}

            {/* Trade corridor lines */}
            {CORRIDORS.map(([originId, destId], index) => {
              const origin = getNode(originId);
              const dest = getNode(destId);
              if (!origin || !dest) return null;
              return (
                <AnimatedLine
                  key={`${originId}-${destId}`}
                  path={curvePath(
                    origin.x,
                    origin.y * 0.52,
                    dest.x,
                    dest.y * 0.52
                  )}
                  delay={index * 80}
                  active={linesActive}
                />
              );
            })}

            {/* Origin nodes */}
            {ORIGINS.map((node) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <circle
                  cx={node.x}
                  cy={node.y * 0.52}
                  r="0.9"
                  fill="#ef4444"
                  opacity="0.9"
                />
                <circle
                  cx={node.x}
                  cy={node.y * 0.52}
                  r="1.8"
                  fill="#ef4444"
                  opacity="0.15"
                />
                <text
                  x={node.x}
                  y={node.y * 0.52 - 2.2}
                  textAnchor="middle"
                  fontSize="2"
                  fill="white"
                  opacity="0.8"
                  fontFamily="system-ui, sans-serif"
                >
                  {node.flag} {node.label}
                </text>
              </motion.g>
            ))}

            {/* Destination nodes */}
            {DESTINATIONS.map((node) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <circle
                  cx={node.x}
                  cy={node.y * 0.52}
                  r="0.7"
                  fill="#60a5fa"
                  opacity="0.9"
                />
                <circle
                  cx={node.x}
                  cy={node.y * 0.52}
                  r="1.5"
                  fill="#60a5fa"
                  opacity="0.12"
                />
                <text
                  x={node.x}
                  y={node.y * 0.52 - 2}
                  textAnchor="middle"
                  fontSize="1.8"
                  fill="white"
                  opacity="0.7"
                  fontFamily="system-ui, sans-serif"
                >
                  {node.flag} {node.label}
                </text>
              </motion.g>
            ))}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] text-white/50 font-medium">Origins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[10px] text-white/50 font-medium">Buyers</span>
            </div>
          </div>
        </motion.div>

        {/* Callout below map */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center text-sm md:text-base text-white/40 font-medium tracking-wide"
        >
          Buyer in Germany. Supplier in India. Compliance for both jurisdictions.{' '}
          <span className="text-white/70">One invoice.</span>
        </motion.p>
      </div>
    </section>
  );
}
