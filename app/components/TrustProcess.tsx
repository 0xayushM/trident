'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

export default function TrustProcess() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      icon: '🤝',
      title: 'Verified Partnership Agreement',
      description: 'Formal trade agreement, compliance checks, and comprehensive buyer onboarding process.',
    },
    {
      number: 2,
      icon: '🏭',
      title: 'Supplier Due Diligence',
      description: 'Factory inspections, ethical sourcing verification, and regulatory compliance checks.',
    },
    {
      number: 3,
      icon: '✅',
      title: 'Pre-Shipment Quality Assurance',
      description: 'Independent third-party inspection with lab reports shared in real time.',
    },
    {
      number: 4,
      icon: '📑',
      title: 'Airtight Documentation',
      description: 'Bill of Lading, Certificate of Origin, Insurance, and all compliance certificates.',
    },
    {
      number: 5,
      icon: '📍',
      title: 'End-to-End Cargo Visibility',
      description: 'Live tracking with proactive milestone updates throughout the journey.',
    },
    {
      number: 6,
      icon: '💳',
      title: 'Secure Payment & Settlement',
      description: 'Letter of Credit, TT, escrow options with full transparency and documentation.',
    },
  ];

  return (
    <section className="relative w-full bg-slate-950 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">The Trust Process</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text">
            HOW WE PROTECT EVERY SHIPMENT
          </h2>
        </motion.div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-slate-800">
              <motion.div
                initial={{ width: '0%' }}
                animate={inView ? { width: '100%' } : {}}
                transition={{ duration: 2, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-red-500"
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-6 gap-4 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: index * 0.15 }}
                  className="flex flex-col items-center"
                >
                  {/* Dot with Badge */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center relative z-10">
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold z-20">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-white nebula-text mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Accordion */}
        <div className="md:hidden space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              className="bg-slate-800/50 border border-white/8 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setActiveStep(activeStep === index ? null : index)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white nebula-text">{step.title}</h3>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeStep === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-gray-400 leading-relaxed pl-16">
                    {step.description}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
