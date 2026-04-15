'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const problems = [
  {
    icon: '❌',
    headline: 'Bad documentation = your container sits at port.',
    body: 'A missing certificate of origin or a non-compliant label can cost you $15,000–$40,000 in demurrage and re-export fees.',
  },
  {
    icon: '❌',
    headline: 'Unvetted suppliers = FDA detention.',
    body: 'One shipment flagged under FFDCA Import Alert 16-131 can blacklist your company for months.',
  },
  {
    icon: '❌',
    headline: 'Opaque broker pricing = margin erosion.',
    body: 'Most brokers charge 3–5% on top of supplier price without disclosing it. You don\'t know what you\'re actually paying.',
  },
];

export default function ProblemSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [transitionRef, transitionInView] = useInView({ triggerOnce: true, threshold: 0.8 });

  return (
    <section className="relative w-full bg-[#0a0a0a] py-24 md:py-32 overflow-hidden">
      {/* Subtle noise/texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        backgroundSize: '200px 200px',
      }} />

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Headline */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20"
        >
          <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-4">
            The Problem
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white unica-text leading-tight tracking-tight max-w-3xl">
            Importing shrimp without the right broker is an expensive education.
          </h2>
        </motion.div>

        {/* Pain points */}
        <div className="flex flex-col gap-0 divide-y divide-white/8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-12 items-start"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5 shrink-0">{problem.icon}</span>
                <p className="text-base md:text-lg font-semibold text-white leading-snug tracking-tight">
                  {problem.headline}
                </p>
              </div>
              <p className="text-sm md:text-base text-white/50 leading-relaxed pl-7 md:pl-0">
                {problem.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Transition line */}
        <motion.div
          ref={transitionRef}
          initial={{ opacity: 0, y: 16 }}
          animate={transitionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mt-16 pt-10 border-t border-white/10"
        >
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 leading-snug max-w-2xl">
            Trident was built specifically to{' '}
            <span className="text-red-500 font-semibold">eliminate all three.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
