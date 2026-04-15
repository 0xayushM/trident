'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const STATS = [
  { value: '500+',  label: 'Containers Delivered' },
  { value: '7+',    label: 'Years in Operation' },
  { value: '100%',  label: 'Documentation Clearance Rate' },
  { value: '80%+',  label: 'Repeat Buyer Rate' },
  { value: '50+',   label: 'Certified Supplier Network' },
  { value: '24 hr', label: 'Quote Turnaround' },
];

function StatItem({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay]);

  return (
    <div
      ref={ref}
      className="flex flex-col justify-center text-center items-center gap-0.5 
                 border-r border-slate-200 last:border-0"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
      }}
    >
      <span className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 unica-text tracking-tight leading-none">
        {value}
      </span>
      <span className="text-[11px] md:text-xs text-slate-400 font-medium leading-tight text-center max-w-[90px] md:max-w-[120px]">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className="w-full bg-white border-y border-slate-100 py-6 md:py-8 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-center justify-between md:min-w-0">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 70} />
          ))}
        </div>
      </div>
    </div>
  );
}
