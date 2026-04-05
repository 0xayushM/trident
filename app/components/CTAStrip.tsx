'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function CTAStrip() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className="relative w-full bg-gradient-to-br from-blue-700 via-slate-900 to-red-600 py-24 md:py-32 overflow-hidden">
      {/* Watermark text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <p className="text-9xl font-bold text-white nebula-text whitespace-nowrap">
          INTERNATIONAL TRIDENT
        </p>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65 }}
        className="max-w-5xl mx-auto px-8 md:px-12 text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text mb-6">
          READY TO MOVE YOUR CARGO?
        </h2>
        <p className="text-xl text-white/90 mb-10 font-light max-w-3xl mx-auto">
          Get a detailed quote for your shipment or speak with our trade specialists to discuss your logistics requirements.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
            Request a Quote
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300">
            View Services
          </button>
        </div>
      </motion.div>
    </section>
  );
}
