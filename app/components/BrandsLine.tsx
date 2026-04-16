'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AnimatedWord } from './animations';

export default function BrandStatement() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  return (
    <section className="relative w-full bg-white">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl unica-text mb-6 font-medium tracking-tighter leading-[0.9]">
          <span className="text-slate-900">Trusted by </span>
          <AnimatedWord delay={500} inView={inView}>seafood</AnimatedWord>{" "}
          <AnimatedWord delay={500} inView={inView}>buyers</AnimatedWord><br/>
          <span className="text-slate-900"> who demand a new</span>
          <br/>
          <AnimatedWord delay={800} inView={inView}>standard</AnimatedWord>{" "}
          <AnimatedWord delay={1100} inView={inView}>in</AnimatedWord>{" "}
          <AnimatedWord delay={1300} inView={inView}>sourcing.</AnimatedWord>
        </h2>
      </motion.div>
    </section>
  );
}
// Imagine your supply chain as an
// intelligent bridge seamlessly
// connecting origin to destination.
