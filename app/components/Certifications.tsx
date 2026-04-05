'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Certifications() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const certifications = [
    {
      number: '01',
      icon: '🔬',
      title: 'HACCP/ISO 22000',
      description: 'Food safety management system certification ensuring hazard analysis and critical control points throughout the supply chain.',
      badge: 'Food Safety',
    },
    {
      number: '02',
      icon: '🇺🇸',
      title: 'USFDA Registration',
      description: 'Registered with US Food and Drug Administration for seafood and agricultural product imports into United States markets.',
      badge: 'USA Compliant',
    },
    {
      number: '03',
      icon: '🇪🇺',
      title: 'EU Approved Establishment',
      description: 'Authorized supplier for European Union markets with full compliance to EU food safety and traceability regulations.',
      badge: 'EU Certified',
    },
    {
      number: '04',
      icon: '🐟',
      title: 'ASC/BAP Sourcing',
      description: 'Aquaculture Stewardship Council and Best Aquaculture Practices certified suppliers for sustainable seafood sourcing.',
      badge: 'Sustainable',
    },
    {
      number: '05',
      icon: '☪️',
      title: 'Halal Certification',
      description: 'Halal-certified processing and handling for Middle East and Muslim-majority market requirements.',
      badge: 'Halal',
    },
    {
      number: '06',
      icon: '✓',
      title: 'BRC Global Standard',
      description: 'British Retail Consortium certification for food safety, quality management, and operational controls.',
      badge: 'BRC Certified',
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
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">Certifications</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text">
            GLOBALLY RECOGNIZED STANDARDS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              className="relative bg-slate-800/50 border border-white/8 rounded-lg p-8 overflow-hidden"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-transparent" />
              
              {/* Faded number background */}
              <div className="absolute top-4 right-4 text-8xl font-bold text-white/5 nebula-text">
                {cert.number}
              </div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-4">{cert.icon}</div>
                <h3 className="text-xl font-bold text-white nebula-text mb-3">{cert.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4 text-sm">{cert.description}</p>
                <span className="inline-block bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
                  {cert.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
