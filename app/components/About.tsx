'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const pillars = [
    {
      title: 'Direct Supplier Network',
      description: 'Vetted partnerships with certified exporters across 28+ countries, ensuring quality and reliability at the source.',
    },
    {
      title: 'Real-Time Cargo Visibility',
      description: 'Track every shipment milestone with our proprietary platform, from factory gate to final destination.',
    },
    {
      title: 'Regulatory Compliance',
      description: 'Full documentation support for customs, FDA, HACCP, and international trade regulations across all markets.',
    },
  ];

  return (
    <section className="relative w-full bg-slate-900 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          <div>
            <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">About Trident</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text mb-8">
              BUILT FOR GLOBAL TRADE COMPLEXITY
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed font-light">
              Trident International is a specialized freight forwarding and trade facilitation company serving importers, distributors, and manufacturers worldwide. We handle high-value, temperature-sensitive, and compliance-critical cargo across seafood, agriculture, and industrial sectors.
            </p>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed font-light">
              With over 15 years of experience, we've built a reputation for reliability, transparency, and operational excellence in markets where precision matters most.
            </p>

            <div className="space-y-6">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: index * 0.15 }}
                  className="border-l-4 border-blue-500 pl-6 py-2"
                >
                  <h3 className="text-xl font-bold text-white nebula-text mb-2">{pillar.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="relative h-[500px] lg:h-full rounded-lg overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800"
                alt="Cargo port operations"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-8 left-8 bg-slate-900/95 backdrop-blur-sm p-6 rounded-lg border border-blue-500/30 max-w-xs">
                <div className="text-5xl font-bold text-blue-400 nebula-text mb-2">500+</div>
                <p className="text-white text-lg font-semibold">Shipments Completed</p>
                <p className="text-gray-400 text-sm mt-1">Across 28 countries in 2024</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
