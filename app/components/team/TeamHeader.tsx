'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { AnimatedWord } from '../animations';

export default function TeamHeader() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });
  return (
    <motion.div
      ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-12 md:pt-20 text-center"
    >
      <p
        style={{
          fontFamily: '"Haas Unica", "Helvetica Neue", sans-serif',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#ef4444',
          margin: '0 0 16px',
        }}
      >
        The People Behind It
      </p>
      <h2 className='text-4xl md:text-6xl lg:text-7xl unica-text mb-8 md:mb-12 font-medium tracking-tighter leading-[0.9]'>
        <AnimatedWord delay={200} inView={inView}>Meet</AnimatedWord>{" "}
        <AnimatedWord delay={400} inView={inView}>The</AnimatedWord>{" "}
        <AnimatedWord delay={600} inView={inView}>Team</AnimatedWord>{" "}
      </h2>
    </motion.div>
  );
}
