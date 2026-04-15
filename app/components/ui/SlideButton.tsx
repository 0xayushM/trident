'use client';

import { useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FillDirection = 'left' | 'right' | 'top' | 'bottom';

/**
 * Preset variants.
 *   outline-white  — ghost, white border/text → fills white, label turns dark
 *   outline-dark   — ghost, dark border/text  → fills dark, label turns white
 *   outline-red    — ghost, red border/text   → fills red,  label stays white
 *   solid-red      — red bg                   → fills dark, label stays white
 *   solid-dark     — dark bg                  → fills white, label turns dark
 */
type Variant = 'outline-white' | 'outline-dark' | 'outline-red' | 'solid-red' | 'solid-dark';

interface SlideButtonProps {
  children: React.ReactNode;

  // Navigation
  href?: string;

  // Events
  onClick?: (e?: React.MouseEvent) => void;

  // Slide fill direction  (default: 'left')
  from?: FillDirection;

  // Visual variant (quick preset)
  variant?: Variant;

  // Override individual colors when you need something custom
  bg?:          string;  // resting background
  border?:      string;  // border color (CSS string); omit for no border
  fillColor?:   string;  // fill that slides in on hover
  textColor?:   string;  // label color at rest
  textHover?:   string;  // label color after fill arrives


  // Extra classes / HTML attrs
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

// ─── Variant defaults ─────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<Variant, {
  bg: string; border: string | undefined;
  fillColor: string; textColor: string; textHover: string;
}> = {
  'outline-white': {
    bg:        'transparent',
    border:    'rgba(255,255,255,0.45)',
    fillColor: '#ffffff',
    textColor: '#ffffff',
    textHover: '#0f172a',
  },
  'outline-dark': {
    bg:        'transparent',
    border:    'rgba(15,23,42,0.55)',
    fillColor: '#0f172a',
    textColor: '#0f172a',
    textHover: '#ffffff',
  },
  'outline-red': {
    bg:        'transparent',
    border:    '#ef4444',
    fillColor: '#ef4444',
    textColor: '#ef4444',
    textHover: '#ffffff',
  },
  'solid-red': {
    bg:        '#ef4444',
    border:    undefined,
    fillColor: '#0f172a',
    textColor: '#ffffff',
    textHover: '#ffffff',
  },
  'solid-dark': {
    bg:        '#0f172a',
    border:    undefined,
    fillColor: '#ffffff',
    textColor: '#ffffff',
    textHover: '#0f172a',
  },
};

// ─── Initial transform for the sliding fill ───────────────────────────────────

const FILL_INITIAL: Record<FillDirection, string> = {
  left:   'translateX(-101%)',
  right:  'translateX(101%)',
  top:    'translateY(-101%)',
  bottom: 'translateY(101%)',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SlideButton({
  children,
  href,
  onClick,
  from        = 'left',
  variant     = 'outline-white',
  bg,
  border,
  fillColor,
  textColor,
  textHover,
  className   = '',
  style,
  type        = 'button',
  disabled    = false,
}: SlideButtonProps) {
  const defaults   = VARIANT_STYLES[variant];
  const resolvedBg         = bg        ?? defaults.bg;
  const resolvedBorder     = border    !== undefined ? border    : defaults.border;
  const resolvedFill       = fillColor ?? defaults.fillColor;
  const resolvedText       = textColor ?? defaults.textColor;
  const resolvedTextHover  = textHover ?? defaults.textHover;

  const [hovered, setHovered] = useState(false);

  // ── Shared inner content ────────────────────────────────────────────────────

  const label = (
    <>
      {/* Sliding fill panel */}
      <span
        aria-hidden
        style={{
          position:   'absolute',
          inset:      0,
          background: resolvedFill,
          transform:  hovered ? 'translate(0,0)' : FILL_INITIAL[from],
          transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex:     0,
        }}
      />

      {/* Text — sits above the fill, color cross-fades */}
      <span
        style={{
          position:   'relative',
          zIndex:     1,
          color:      hovered ? resolvedTextHover : resolvedText,
          transition: 'color 0.35s ease',
          display:    'inline-flex',
          alignItems: 'center',
          gap:        8,
        }}
      >
        {children}
      </span>
    </>
  );

  // ── Shared CSS ──────────────────────────────────────────────────────────────

  const sharedStyle: React.CSSProperties = {
    position:      'relative',
    overflow:      'hidden',
    display:       'inline-flex',
    alignItems:    'center',
    justifyContent:'center',
    padding:       '14px 36px',
    borderRadius:  6,
    background:    resolvedBg,
    border:        resolvedBorder ? `1px solid ${resolvedBorder}` : 'none',
    cursor:        disabled ? 'not-allowed' : 'pointer',
    opacity:       disabled ? 0.45 : 1,
    letterSpacing: '0.12em',
    fontSize:      12,
    fontWeight:    600,
    textTransform: 'uppercase',
    fontFamily:    '"Haas Unica", "Helvetica Neue", sans-serif',
    textDecoration:'none',
    userSelect:    'none',
    whiteSpace:    'nowrap',
    // User overrides last so they take precedence
    ...style,
  };

  const handlers = disabled ? {} : {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus:      () => setHovered(true),
    onBlur:       () => setHovered(false),
  };

  // ── Render as <a> or <button> ───────────────────────────────────────────────

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        style={sharedStyle}
        className={className}
        {...handlers}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={sharedStyle}
      className={className}
      {...handlers}
    >
      {label}
    </button>
  );
}
