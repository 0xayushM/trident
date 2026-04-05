'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const testimonials = [
    {
      quote: "Trident has been our go-to logistics partner for frozen seafood imports for over three years. Their cold chain management is flawless, and we've never had a single compliance issue with FDA documentation.",
      name: 'Michael Chen',
      company: 'Pacific Seafood Distributors',
      country: '🇺🇸',
    },
    {
      quote: "The real-time tracking and proactive communication set Trident apart. They handle our high-value agricultural shipments with the precision and care we demand. Exceptional service across the board.",
      name: 'Sarah Williams',
      company: 'EuroTrade Solutions GmbH',
      country: '🇩🇪',
    },
    {
      quote: "Working with Trident transformed our import operations. Their supplier network in India is reliable, their documentation is always perfect, and their rates are competitive. A true partner in every sense.",
      name: 'Yuki Tanaka',
      company: 'Tokyo Marine Foods Ltd',
      country: '🇯🇵',
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
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">Client Testimonials</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text">
            TRUSTED BY INDUSTRY LEADERS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: index * 0.15 }}
              className="bg-slate-800/50 border border-white/8 rounded-lg p-8"
            >
              <div className="text-6xl text-blue-400 mb-4 leading-none">"</div>
              <p className="text-gray-300 italic text-lg leading-relaxed mb-6 font-serif">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{testimonial.country}</span>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
