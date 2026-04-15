'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function StatsBar() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const stats = [
    { number: 28, suffix: '+', label: 'Countries Served' },
    { number: 12000, suffix: ' MT', label: 'Annual Volume' },
    { number: 96, suffix: '%', label: 'On-Time Delivery' },
    { number: 15, suffix: '+', label: 'Years Experience' },
  ];

  return (
    <section className="relative w-full bg-[#0d0d0d] border-b border-white/10 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-wrap items-center justify-between gap-6 md:gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col items-start gap-0.5 min-w-[120px]"
            >
              <span className="text-2xl md:text-3xl font-bold text-white unica-text tracking-tight leading-none">
                {stat.number}{stat.suffix}
              </span>
              <span className="text-xs text-white/50 font-medium leading-tight max-w-[160px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
