'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ServicesGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      number: '01',
      icon: '🚢',
      title: 'SEA FREIGHT',
      description: 'Full container load (FCL) and less than container load (LCL) services with temperature-controlled options for perishable cargo.',
      tag: 'Global Coverage',
    },
    {
      number: '02',
      icon: '✈️',
      title: 'AIR FREIGHT',
      description: 'Express and standard air cargo solutions for time-sensitive shipments with priority customs clearance.',
      tag: 'Fast Delivery',
    },
    {
      number: '03',
      icon: '📋',
      title: 'CUSTOMS BROKERAGE',
      description: 'Expert handling of import/export documentation, duty optimization, and regulatory compliance across all markets.',
      tag: 'Compliance Ready',
    },
    {
      number: '04',
      icon: '📄',
      title: 'TRADE DOCUMENTATION',
      description: 'Complete preparation of bills of lading, certificates of origin, insurance, and compliance certificates.',
      tag: 'Full Support',
    },
    {
      number: '05',
      icon: '🔍',
      title: 'SUPPLIER SOURCING',
      description: 'Verified supplier network with factory audits, quality assurance, and ethical sourcing verification.',
      tag: 'Vetted Partners',
    },
    {
      number: '06',
      icon: '📦',
      title: 'WAREHOUSING & DISTRIBUTION',
      description: 'Temperature-controlled storage facilities and last-mile distribution services in key markets.',
      tag: 'Cold Chain',
    },
  ];

  return (
    <section className="relative w-full bg-slate-900 py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">Our Services</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text">
            COMPREHENSIVE LOGISTICS SOLUTIONS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              className="group relative bg-slate-800/50 border border-white/8 rounded-lg p-8 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 text-8xl font-bold text-white/5 nebula-text">
                {service.number}
              </div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-white nebula-text mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{service.description}</p>
                <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                  {service.tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-red-500 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
