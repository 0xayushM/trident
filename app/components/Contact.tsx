'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import SlideButton from './ui/SlideButton';

// ─── Data ─────────────────────────────────────────────────────────────────────

const OPTIONS = [
  { id: 'meeting',    num: '01', label: 'Schedule a 30-minute call with a sourcing specialist' },
  { id: 'quote',      num: '02', label: 'Get a custom shrimp sourcing quote' },
  { id: 'compliance', num: '03', label: 'Arrange a compliance consultation' },
  { id: 'sourcing',   num: '04', label: 'Set up a supplier sourcing session' },
  { id: 'other',      num: '05', label: 'Something else' },
];

const SERVICE_LABELS: Record<string, string> = {
  meeting:    'Schedule a 30-minute call',
  quote:      'Get a custom sourcing quote',
  compliance: 'Arrange compliance consultation',
  sourcing:   'Set up supplier sourcing session',
  other:      'Something else',
};

const TICKER_ITEMS = [
  'MUMBAI → ROTTERDAM   ·   847 MT VANNAMEI   ·   ETA 14 DAYS',
  'CHENNAI → LOS ANGELES   ·   320 MT TIGER SHRIMP   ·   IN CUSTOMS CLEARANCE',
  'VIZAG → HAMBURG   ·   512 MT PROCESSED   ·   VESSEL DEPARTED',
  'KOCHI → TOKYO   ·   280 MT IQF   ·   ON SCHEDULE',
  'KOLKATA → DUBAI   ·   195 MT HEADLESS SHELL-ON   ·   PORT CLEARED',
  'CHENNAI → SEATTLE   ·   410 MT VANNAMEI   ·   DOCUMENTATION COMPLETE',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useISTTime() {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="border-t border-white/8 overflow-hidden py-3.5">
      <div className="flex animate-contact-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 mx-10 font-mono text-[10px] text-white/22 tracking-[0.18em]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Form field ───────────────────────────────────────────────────────────────

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
        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-base text-white outline-none transition-all duration-200 placeholder:text-white/15 hover:border-white/15 focus:border-red-500/55 focus:bg-white/[0.045] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)] autofill-dark"
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

type FormData = {
  fullName: string; role: string; phone: string;
  email: string; company: string; helpWith: string;
};

const EMPTY: FormData = { fullName: '', role: '', phone: '', email: '', company: '', helpWith: '' };

export default function Contact() {
  const istTime = useISTTime();
  const [formData, setFormData]       = useState<FormData>(EMPTY);
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { ref, inView } = useInView({ threshold: 0.06, triggerOnce: true });

  const set = (key: keyof FormData) => (v: string) =>
    setFormData(f => ({ ...f, [key]: v }));

  const selectOption = (id: string) =>
    setFormData(f => ({ ...f, helpWith: id }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    const params   = new URLSearchParams(window.location.search);
    const metadata = {
      page:         window.location.href,
      referrer:     document.referrer,
      utm_source:   params.get('utm_source')   ?? '',
      utm_medium:   params.get('utm_medium')   ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
    };

    try {
      // Send to Dashboard API
      const { postToDashboard } = await import('@/app/lib/postToDashboard');
      await postToDashboard('contact', { ...formData, ...metadata });
      
      setSubmitted(true);
    } catch (error) {
      console.error('[Contact] Dashboard error:', error);
      setSubmitError('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

  return (
    <section
      id="contact"
      ref={ref}
      className="relative w-full bg-[#050505] overflow-hidden"
    >
      {/* Coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      {/* Red glow top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
          top: '-20%', right: '-10%',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-10 md:pt-28 md:pb-14">

        {/* ── Section eyebrow ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] text-red-500 tracking-[0.32em] uppercase mb-12 md:mb-16"
        >
          Get In Touch
        </motion.p>

        {/* ── Two columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* ───────── LEFT: Options ───────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          >
            <h2
              className="unica-text font-semibold text-white leading-tight mb-8"
              style={{ fontSize: 'clamp(20px, 2.4vw, 28px)' }}
            >
              Reach out to learn more about
              <br />
              <span className="text-white/50">Trident, on your terms:</span>
            </h2>

            {/* Options list */}
            <div className="relative pl-5 mb-10">
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-500"
                style={{
                  transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'top',
                  transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s',
                }}
              />

              {OPTIONS.map((opt, i) => {
                const active = formData.helpWith === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    type="button"
                    onClick={() => selectOption(opt.id)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: EASE }}
                    className="w-full text-left flex items-start gap-4 py-3.5 group transition-all duration-200"
                  >
                    <span
                      className="font-mono text-[10px] tracking-[0.18em] flex-shrink-0 mt-0.5 transition-colors duration-200"
                      style={{ color: active ? '#ef4444' : 'rgba(255,255,255,0.28)' }}
                    >
                      {opt.num}
                    </span>
                    <span
                      className="unica-text text-sm md:text-base leading-snug transition-colors duration-200"
                      style={{ color: active ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
                    >
                      {opt.label}
                    </span>
                    {active && (
                      <span className="ml-auto flex-shrink-0 text-red-500 mt-0.5">
                        <svg viewBox="0 0 16 16" width={14} height={14} fill="none"
                             stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Direct contact line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col gap-1.5 border-t border-white/8 pt-6"
            >
              <p className="font-mono text-[9px] text-white/25 tracking-[0.2em] uppercase mb-2">
                Or reach us directly
              </p>
              <a href="mailto:enquiry@tridentintjp.in"
                 className="unica-text text-white/50 text-sm hover:text-red-400 transition-colors duration-200">
                enquiry@tridentintjp.in
              </a>
              <a href="https://wa.me/919431267872"
                 className="unica-text text-white/50 text-sm hover:text-red-400 transition-colors duration-200">
                +91 94312 67872 (WhatsApp)
              </a>
              <p className="font-mono text-[9px] text-white/20 tracking-wider mt-1 tabular-nums">
                {istTime} IST &nbsp;·&nbsp; Kolkata, India
              </p>
            </motion.div>
          </motion.div>

          {/* ───────── RIGHT: Form ───────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (

                /* ── SUCCESS ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex flex-col items-center justify-center text-center py-24"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                    className="w-16 h-16 rounded-full border border-red-500/50 flex items-center justify-center mb-7"
                    style={{ boxShadow: '0 0 32px rgba(239,68,68,0.15)' }}
                  >
                    <svg viewBox="0 0 24 24" width={26} height={26} fill="none"
                         stroke="#ef4444" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      />
                    </svg>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="unica-text font-bold text-white text-3xl mb-3"
                  >
                    Message sent.
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="unica-text text-white/40 text-sm max-w-xs leading-relaxed mb-8"
                  >
                    We'll be in touch within 24 hours from our Kolkata desk.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    onClick={() => { setSubmitted(false); setFormData(EMPTY); }}
                    className="font-mono text-[9px] text-white/25 tracking-widest hover:text-white/55 transition-colors underline underline-offset-4"
                  >
                    Send another message
                  </motion.button>
                </motion.div>

              ) : (

                /* ── FORM ── */
                <form onSubmit={handleSubmit} className="flex flex-col gap-0">

                  <h3
                    className="unica-text font-semibold text-white mb-8"
                    style={{ fontSize: 'clamp(20px, 2.4vw, 28px)' }}
                  >
                    Tell us a bit about you:
                  </h3>

                  <div className="flex flex-col gap-6">

                    {/* Full Name */}
                    <Field id="fullName" label="Full Name" placeholder="John Doe"
                           required value={formData.fullName} onChange={set('fullName')} />

                    {/* Role */}
                    <Field id="role" label="Role or Position" placeholder="Project Manager"
                           required value={formData.role} onChange={set('role')} />

                    {/* Phone */}
                    <Field id="phone" label="Phone Number" type="tel"
                           placeholder="(323) 555-0147" value={formData.phone} onChange={set('phone')} />

                    {/* Email */}
                    <Field id="email" label="Email" type="email"
                           placeholder="name@email.com" required value={formData.email} onChange={set('email')} />

                    {/* Company */}
                    <Field id="company" label="Company Name" placeholder="Acme"
                           required value={formData.company} onChange={set('company')} />

                    {/* How Can We Help — styled select */}
                    <HelpSelect
                      value={formData.helpWith}
                      onChange={set('helpWith')}
                    />

                  </div>

                  {/* Error */}
                  {submitError && (
                    <p className="font-mono text-[9px] text-red-400 tracking-wider mt-2">
                      {submitError}
                    </p>
                  )}

                  {/* Submit */}
                  <div className="mt-8">
                    <SlideButton
                      type="submit"
                      variant="solid-red"
                      from="left"
                      className="w-full"
                      style={{
                        width: '100%',
                        padding: '16px 32px',
                        fontSize: 13,
                        borderRadius: 10,
                        boxShadow: '0 8px 32px rgba(239,68,68,0.22)',
                        justifyContent: 'space-between',
                        letterSpacing: '0.1em',
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      <span>{loading ? 'Sending…' : 'Submit'}</span>
                      <svg viewBox="0 0 20 20" width={16} height={16} fill="none"
                           stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 10h12M11 5l5 5-5 5" />
                      </svg>
                    </SlideButton>

                    <p className="font-mono text-[9px] text-white/50 text-center tracking-[0.2em] uppercase mt-4">
                      Response within 24 hours · Kolkata, India
                    </p>
                  </div>

                </form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* Ticker */}
      <Ticker />
    </section>
  );
}

// ─── Styled select ─────────────────────────────────────────────────────────────

function HelpSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="group flex flex-col gap-2.5">
      <label
        className="block font-mono text-[9px] tracking-[0.22em] uppercase transition-colors duration-200"
        style={{ color: focused ? '#ef4444' : 'rgba(255,255,255,0.32)' }}
      >
        How Can We Help?<span className="text-red-500 ml-0.5">*</span>
      </label>
      <div className="relative">
        <select
          required
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 pr-10 text-base outline-none appearance-none cursor-pointer transition-all duration-200 autofill-dark"
          style={{
            borderColor: focused ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.10)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: value ? '#ffffff' : 'rgba(255,255,255,0.15)',
            WebkitTextFillColor: value ? '#ffffff' : 'rgba(255,255,255,0.15)',
            fontFamily: 'Haas Unica, sans-serif',
            boxShadow: focused ? '0 0 0 4px rgba(239,68,68,0.08)' : '0 1px 0 rgba(255,255,255,0.03) inset',
          }}
        >
          <option value="" disabled style={{ background: '#0f172a', color: 'rgba(255,255,255,0.15)' }}>
            Select an option
          </option>
          {OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id} style={{ background: '#0f172a', color: '#ffffff' }}>
              {opt.num} — {opt.label}
            </option>
          ))}
        </select>
        {/* Custom arrow */}
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? '#ef4444' : 'rgba(255,255,255,0.3)' }}
        >
          <svg viewBox="0 0 16 16" width={14} height={14} fill="none"
               stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </div>
    </div>
  );
}
