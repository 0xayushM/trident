'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import BrandsLine from './BrandsLine';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Brand {
  name: string;
  logo?: string;
}

interface BrandsProps {
  brands?: Brand[];
  /**
   * Total column count INCLUDING the ghost columns on each side.
   * Desktop default: 7  →  1 ghost | 5 brands | 1 ghost
   */
  columns?: number;
  /**
   * Empty columns on the LEFT and RIGHT of the brand row(s).
   * Desktop default: 1. On smaller screens this is reduced automatically.
   */
  ghostCols?: number;
  /** Empty rows above + below logo rows. Default 1. */
  ghostRows?: number;
  title?: string;
  subtitle?: string;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_BRANDS: Brand[] = [
  { name: 'Days Eady' , logo: '/images/brands/dayseaday.png'},
  { name: 'I Schroeder' , logo: '/images/brands/i_schroeder.png'},
  { name: 'Oceanis' , logo: '/images/brands/oceanis.png'},
  { name: 'Taprobane' , logo: '/images/brands/taprobane.png'},
];

// ─── Responsive config ────────────────────────────────────────────────────────
// Returns { cols, ghostCols, cellH } for the current viewport.
// `cols` = TOTAL columns (including ghost col padding).

function getResponsive(
  desktopCols: number,
  desktopGhostCols: number
): { cols: number; ghostCols: number; cellH: number } {
  if (typeof window === 'undefined')
    return { cols: desktopCols, ghostCols: desktopGhostCols, cellH: 160 };

  const w = window.innerWidth;
  // On mobile there's no room for ghost columns — use 0 ghost cols
  if (w < 480)  return { cols: 2, ghostCols: 0, cellH: 110 };
  if (w < 768)  return { cols: 3, ghostCols: 0, cellH: 130 };
  if (w < 1024) return { cols: 5, ghostCols: 0, cellH: 150 };
  return { cols: desktopCols, ghostCols: desktopGhostCols, cellH: 160 };
}

// ─── Ghost cell ───────────────────────────────────────────────────────────────

function GhostCell({ cellH }: { cellH: number }) {
  return <div style={{ height: cellH }} />;
}

// ─── Brand cell ───────────────────────────────────────────────────────────────

function BrandCell({
  brand,
  index,
  inView,
  cellH,
}: {
  brand: Brand;
  index: number;
  inView: boolean;
  cellH: number;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mouse,   setMouse]   = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cellRef.current?.getBoundingClientRect();
    if (r) setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      ref={cellRef}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
      className="relative flex items-center justify-center px-4 sm:px-6 md:px-10 cursor-pointer"
      style={{ height: cellH }}
    >
      {/* Fill spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 200px at ${mouse.x}px ${mouse.y}px, rgba(239,68,68,0.10) 0%, transparent 70%)`,
        }}
        suppressHydrationWarning
      ></div>

      {/* Logo / text */}
      <div className="relative z-10 flex items-center justify-center w-full h-8 sm:h-10 md:h-12">
        {brand.logo ? (
          <div className="relative w-full h-full">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain"
              style={{
                filter: hovered ? 'grayscale(0) opacity(1)' : 'grayscale(1) opacity(0.45)',
                transition: 'filter 0.3s ease',
              }}
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 20vw"
            />
          </div>
        ) : (
          <span
            className="font-semibold text-sm sm:text-base md:text-lg tracking-wide unica-text select-none"
            style={{
              color: hovered ? '#ef4444' : '#0c0c0c',
              transition: 'color 0.25s ease',
            }}
          >
            {brand.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Brands({
  brands      = DEFAULT_BRANDS,
  columns     = 6,
  ghostCols   = 1,
  ghostRows   = 1,
  title       = 'TRUSTED BY INDUSTRY LEADERS',
  subtitle    = 'Clients & Partners',
}: BrandsProps) {
  const [sectionRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const desktopCols      = Math.min(Math.max(columns, 1), 10);
  const desktopGhostCols = Math.max(ghostCols, 0);

  // ── Responsive config ──────────────────────────────────────────────────────
  const [responsive, setResponsive] = useState(
    () => getResponsive(desktopCols, desktopGhostCols)
  );

  useEffect(() => {
    const onResize = () => setResponsive(getResponsive(desktopCols, desktopGhostCols));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [desktopCols, desktopGhostCols]);

  const { cols, ghostCols: gc, cellH } = responsive;

  // Brand columns available after reserving ghost cols on each side
  const brandColsPerRow = Math.max(cols - gc * 2, 1);
  const logoRows        = Math.ceil(brands.length / brandColsPerRow);
  const totalRows       = ghostRows + logoRows + ghostRows;

  // ── Grid-level mouse / size tracking ──────────────────────────────────────
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridW,  setGridW]  = useState(0);
  const [mouse,  setMouse]  = useState({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const sync = () => setGridW(el.offsetWidth);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const gridH = totalRows * cellH;

  // SVG line positions
  const vLines = Array.from({ length: cols + 1 }, (_, i) =>
    gridW > 0 ? (i / cols) * gridW : 0
  );
  const hLines = Array.from({ length: totalRows + 1 }, (_, i) => i * cellH);

  const plusMarks: { x: number; y: number }[] = [];
  for (const x of vLines) for (const y of hLines) plusMarks.push({ x, y });

  // ── Build cell list ────────────────────────────────────────────────────────
  //
  // Top ghost rows  → cols × ghostRows plain empty cells
  // Brand rows      → each row: [gc ghost cells] [brand cells] [gc ghost cells]
  //                   pad with empty cells if the last row is short
  // Bottom ghost rows → cols × ghostRows plain empty cells
  //
  const topGhosts    = ghostRows * cols;
  const botGhosts    = ghostRows * cols;

  // Pre-fill brand rows with ghost padding
  const brandRowCells: React.ReactNode[] = [];
  for (let row = 0; row < logoRows; row++) {
    // Left ghost columns
    for (let g = 0; g < gc; g++) {
      brandRowCells.push(<GhostCell key={`lc-${row}-${g}`} cellH={cellH} />);
    }
    // Brand content columns
    for (let col = 0; col < brandColsPerRow; col++) {
      const idx = row * brandColsPerRow + col;
      if (idx < brands.length) {
        brandRowCells.push(
          <BrandCell
            key={`brand-${idx}`}
            brand={brands[idx]}
            index={idx}
            inView={inView}
            cellH={cellH}
          />
        );
      } else {
        // Pad short last row with ghost cells so the grid stays rectangular
        brandRowCells.push(<GhostCell key={`pad-${row}-${col}`} cellH={cellH} />);
      }
    }
    // Right ghost columns
    for (let g = 0; g < gc; g++) {
      brandRowCells.push(<GhostCell key={`rc-${row}-${g}`} cellH={cellH} />);
    }
  }

  return (
    <section className="relative w-full bg-white py-10 md:py-16 lg:py-24">
      <div ref={sectionRef} className="max-w-8xl mx-auto px-4 sm:px-8 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-8 md:mb-12"
        >
          <p className="text-red-500 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3">
            {subtitle}
          </p>
          <BrandsLine />
        </motion.div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            WebkitMaskImage:
              'linear-gradient(to right,  transparent 0%, black 14%, black 86%, transparent 100%), ' +
              'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
            WebkitMaskComposite: 'destination-in',
            maskImage:
              'linear-gradient(to right,  transparent 0%, black 14%, black 86%, transparent 100%), ' +
              'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
            maskComposite: 'intersect',
          }}
          onMouseMove={(e) => {
            const r = gridRef.current?.getBoundingClientRect();
            if (r) setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => { setActive(false); setMouse({ x: -9999, y: -9999 }); }}
        >
          {/* Top ghost rows (full width) */}
          {Array.from({ length: topGhosts }).map((_, i) => (
            <GhostCell key={`top-${i}`} cellH={cellH} />
          ))}

          {/* Brand rows with ghost column padding */}
          {brandRowCells}

          {/* Bottom ghost rows (full width) */}
          {Array.from({ length: botGhosts }).map((_, i) => (
            <GhostCell key={`bot-${i}`} cellH={cellH} />
          ))}

          {/* SVG overlay */}
          {gridW > 0 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={gridW}
              height={gridH}
              style={{ overflow: 'visible' }}
            >
              <defs>
                <radialGradient
                  id="lineGlow"
                  gradientUnits="userSpaceOnUse"
                  cx={mouse.x}
                  cy={mouse.y}
                  r={170}
                >
                  <stop offset="0%"   stopColor="rgb(239,68,68)" stopOpacity={active ? 1 : 0} />
                  <stop offset="100%" stopColor="rgb(239,68,68)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base gray lines */}
              {vLines.map((x, i) => (
                <line key={`vb-${i}`} x1={x} y1={0} x2={x} y2={gridH}
                  stroke="rgb(226,232,240)" strokeWidth={1} />
              ))}
              {hLines.map((y, i) => (
                <line key={`hb-${i}`} x1={0} y1={y} x2={gridW} y2={y}
                  stroke="rgb(226,232,240)" strokeWidth={1} />
              ))}

              {/* Glow lines */}
              {vLines.map((x, i) => (
                <line key={`vg-${i}`} x1={x} y1={0} x2={x} y2={gridH}
                  stroke="url(#lineGlow)" strokeWidth={1} />
              ))}
              {hLines.map((y, i) => (
                <line key={`hg-${i}`} x1={0} y1={y} x2={gridW} y2={y}
                  stroke="url(#lineGlow)" strokeWidth={1} />
              ))}

              {/* Base + markers */}
              {plusMarks.map(({ x, y }, i) => (
                <text key={`pb-${i}`} x={x} y={y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontWeight={300} fill="rgb(203,213,225)"
                  style={{ userSelect: 'none' }}>+</text>
              ))}

              {/* Glow + markers */}
              {plusMarks.map(({ x, y }, i) => (
                <text key={`pg-${i}`} x={x} y={y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontWeight={300} fill="url(#lineGlow)"
                  style={{ userSelect: 'none' }}>+</text>
              ))}
            </svg>
          )}
        </div>

      </div>
    </section>
  );
}
