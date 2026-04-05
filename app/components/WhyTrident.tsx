'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function WhyTrident() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const leftPoints = [
    'Direct relationships with certified exporters in 28+ countries',
    'Proprietary cargo tracking platform with real-time milestone updates',
    'Dedicated trade compliance team handling all regulatory requirements',
    'Temperature-controlled logistics for sensitive cargo (-18°C to +25°C)',
    '24/7 customer support with multilingual trade specialists',
  ];

  const rightPoints = [
    'Bulk purchasing power for competitive pricing on high-volume orders',
    'Quality assurance protocols with third-party inspection services',
    'Flexible payment terms including LC, TT, and escrow arrangements',
    'Consolidated shipping options to optimize freight costs',
  ];

  return (
    <section className="relative w-full bg-slate-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-1"
        >
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="bg-slate-800/30 border border-white/8 p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white nebula-text italic mb-6 leading-tight">
              Your most reliable trade partner
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed font-light">
              We've built our reputation on transparency, reliability, and operational excellence. Every shipment is handled with the same level of care and precision, regardless of size or complexity.
            </p>
            <ul className="space-y-4">
              {leftPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-400 text-xl mt-1">◆</span>
                  <span className="text-gray-300 leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="bg-slate-800/30 border border-white/8 border-l-white/20 p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white nebula-text italic mb-6 leading-tight">
              Sourcing at industry scale
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed font-light">
              Access our vetted supplier network and leverage our purchasing power to secure competitive pricing on bulk orders while maintaining strict quality standards.
            </p>
            <ul className="space-y-4">
              {rightPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-400 text-xl mt-1">◆</span>
                  <span className="text-gray-300 leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
