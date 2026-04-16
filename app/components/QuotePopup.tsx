'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlideButton from './ui/SlideButton';

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  whatToSource: string;
  destination: string;
};

const EMPTY: FormData = {
  fullName: '',
  email: '',
  phone: '',
  whatToSource: '',
  destination: '',
};

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  id, label, type = 'text', placeholder, required = false, value, onChange,
}: {
  id: string; label: string; type?: string;
  placeholder: string; required?: boolean;
  value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="group flex flex-col gap-2.5">
      <label
        htmlFor={id}
        className="block font-mono text-[9px] tracking-[0.22em] uppercase transition-colors duration-200"
        style={{ color: focused ? '#ef4444' : 'rgba(255,255,255,0.32)' }}
      >
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-base text-white outline-none transition-all duration-200 placeholder:text-white/15 placeholder:opacity-100 hover:border-white/15 focus:border-red-500/55 focus:bg-white/[0.045] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)] autofill-dark"
        style={{
          caretColor: '#ffffff',
          fontFamily: 'Haas Unica, sans-serif',
          boxShadow: focused ? '0 0 0 1px rgba(239,68,68,0.12) inset' : '0 1px 0 rgba(255,255,255,0.03) inset',
        }}
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'trident_quote_shown';
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function QuotePopup() {
  const [visible, setVisible]   = useState(false);
  const [form, setForm]         = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // ── Show after 5 seconds, once per session ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      console.log('[QuotePopup] Already shown this session');
      return;
    }
    console.log('[QuotePopup] Will show in 5 seconds...');
    const t = setTimeout(() => {
      console.log('[QuotePopup] Showing now');
      setVisible(true);
    }, 10000);
    return () => clearTimeout(t);
  }, []);

  // ── Listen for external trigger ──
  useEffect(() => {
    const handleOpen = () => {
      setForm(EMPTY);
      setSubmitted(false);
      setError('');
      setVisible(true);
    };
    window.addEventListener('openQuotePopup', handleOpen);
    return () => window.removeEventListener('openQuotePopup', handleOpen);
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, '1');
  };

  const set = (key: keyof FormData) => (v: string) =>
    setForm(f => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Collect client-side metadata
    const params     = new URLSearchParams(window.location.search);
    const metadata   = {
      page:         window.location.href,
      referrer:     document.referrer,
      utm_source:   params.get('utm_source')   ?? '',
      utm_medium:   params.get('utm_medium')   ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
    };

    try {
      const res = await fetch('/api/quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, ...metadata }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] bg-black/65 backdrop-blur-sm"
            onClick={close}
          />

          {/* ── Panel ── */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg pointer-events-auto overflow-hidden"
              style={{
                background: '#080808',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(239,68,68,0.08)',
              }}
            >
              {/* Coordinate grid */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
                    'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />

              {/* Red glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 360, height: 360, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
                  top: '-40%', right: '-20%',
                }}
              />

              {/* Top red accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-red-500/60 to-transparent" />

              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-20 w-7 h-7 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors duration-200"
                aria-label="Close"
              >
                <svg viewBox="0 0 16 16" width={14} height={14} fill="none"
                     stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>

              <div className="relative z-10 p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {submitted ? (

                    /* ── Success ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="flex flex-col items-center text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
                        className="w-14 h-14 rounded-full border border-red-500/50 flex items-center justify-center mb-6"
                        style={{ boxShadow: '0 0 28px rgba(239,68,68,0.14)' }}
                      >
                        <svg viewBox="0 0 24 24" width={22} height={22} fill="none"
                             stroke="#ef4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <motion.path
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.45, duration: 0.5 }}
                          />
                        </svg>
                      </motion.div>
                      <h3 className="unica-text font-bold text-white text-2xl mb-2">
                        We&apos;ll be in touch.
                      </h3>
                      <p className="unica-text text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
                        Our sourcing team will review your request and send a custom quote within 24 hours.
                      </p>
                      <button
                        onClick={close}
                        className="font-mono text-[9px] text-white/25 tracking-widest hover:text-white/50 transition-colors underline underline-offset-4"
                      >
                        Close
                      </button>
                    </motion.div>

                  ) : (

                    /* ── Form ── */
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Header */}
                      <div className="mb-7">
                        <p className="font-mono text-[9px] text-red-500 tracking-[0.28em] uppercase mb-3">
                          Free Quote · 24-Hour Response
                        </p>
                        <h2 className="unica-text font-bold text-white leading-tight"
                            style={{ fontSize: 'clamp(22px, 3vw, 28px)' }}>
                          Get a free sourcing<br />
                          <span className="text-white/45">quote in 24 hours.</span>
                        </h2>
                      </div>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">

                        {/* Row 1: Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field id="popup-name" label="Full Name" placeholder=""
                                 required value={form.fullName} onChange={set('fullName')} />
                          <Field id="popup-email" label="Email" type="email" placeholder=""
                                 required value={form.email} onChange={set('email')} />
                        </div>

                        {/* Row 2: Phone + Destination */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field id="popup-phone" label="Phone / WhatsApp" type="tel"
                                 placeholder="" value={form.phone} onChange={set('phone')} />
                          <Field id="popup-dest" label="Destination Country" placeholder=""
                                 required value={form.destination} onChange={set('destination')} />
                        </div>

                        {/* What to source */}
                        <Field id="popup-source" label="What do you want to source?"
                               placeholder="e.g. Vannamei shrimp, 20 MT, IQF"
                               required value={form.whatToSource} onChange={set('whatToSource')} />

                        {/* Error */}
                        {error && (
                          <p className="font-mono text-[9px] text-red-400 tracking-wider">{error}</p>
                        )}

                        {/* Submit */}
                        <div className="mt-1">
                          <SlideButton
                            type="submit"
                            variant="solid-red"
                            from="left"
                            style={{
                              width: '100%',
                              padding: '14px 28px',
                              fontSize: 12,
                              borderRadius: 8,
                              letterSpacing: '0.1em',
                              justifyContent: 'space-between',
                              opacity: loading ? 0.7 : 1,
                            }}
                          >
                            <span>{loading ? 'Sending…' : 'Get My Free Quote'}</span>
                            <svg viewBox="0 0 20 20" width={14} height={14} fill="none"
                                 stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 10h12M11 5l5 5-5 5" />
                            </svg>
                          </SlideButton>
                          <p className="font-mono text-[8px] text-white/50 text-center tracking-[0.18em] uppercase mt-3">
                            Free of charge · Kolkata, India
                          </p>
                        </div>

                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
