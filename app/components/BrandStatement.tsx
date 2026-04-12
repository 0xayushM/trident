'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function BrandStatement() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className="relative w-full bg-white border-t-2 border-red-600">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65 }}
        className="max-w-7xl mx-auto px-8 md:px-12 py-24 md:py-32 text-center"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 unica-text mb-6">
          Imagine the yard
        </h2>
      </motion.div>
    </section>
  );
}
