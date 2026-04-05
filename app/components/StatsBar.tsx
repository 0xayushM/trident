'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

export default function StatsBar() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const stats = [
    { number: 28, suffix: '+', label: 'Countries Served' },
    { number: 12000, suffix: ' MT', label: 'Annual Volume' },
    { number: 96, suffix: '%', label: 'On-Time Delivery' },
    { number: 15, suffix: '+', label: 'Years Experience' },
  ];

  return (
    <section className="relative w-full bg-gradient-to-r from-blue-700 via-blue-800 to-red-600 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.65, delay: index * 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white nebula-text mb-2"
              >
                {inView && <CountUp end={stat.number} suffix={stat.suffix} />}
              </motion.div>
              <p className="text-white/90 text-sm md:text-base font-light tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <>{count}{suffix}</>;
}
