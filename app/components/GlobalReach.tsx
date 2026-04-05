'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function GlobalReach() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    { number: '28+', label: 'Markets' },
    { number: '96h', label: 'Port SLA' },
    { number: '-18°C', label: 'Cold Chain' },
    { number: '100%', label: 'Compliant' },
  ];

  const routes = [
    {
      from: '🇮🇳',
      to: '🇺🇸',
      route: 'India → USA',
      badge: 'West Coast',
      detail: 'Mumbai/Chennai to LA/Seattle - 18-22 days',
    },
    {
      from: '🇮🇳',
      to: '🇪🇺',
      route: 'India → EU',
      badge: 'Rotterdam Hub',
      detail: 'Direct service to major European ports - 20-25 days',
    },
    {
      from: '🇮🇳',
      to: '🇯🇵',
      route: 'India → Japan',
      badge: 'Asia Pacific',
      detail: 'Express routes to Tokyo/Osaka - 12-15 days',
    },
    {
      from: '🇮🇳',
      to: '🇦🇪',
      route: 'India → Middle East',
      badge: 'Gulf Region',
      detail: 'Fast transit to Dubai/Abu Dhabi - 7-10 days',
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
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">Global Reach</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text">
            CONNECTING CONTINENTS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Map and Stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="bg-slate-800/50 border border-white/8 rounded-lg p-8 mb-8"
            >
              <svg viewBox="0 0 500 280" className="w-full h-auto">
                {/* Simplified world map outline */}
                <path
                  d="M 50 140 Q 100 120, 150 140 T 250 140 Q 300 130, 350 140 T 450 140"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                />
                
                {/* India - Pulsing origin dot */}
                <circle cx="280" cy="160" r="8" className="animate-pulse">
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="280" cy="160" r="8" fill="#EF4444" />
                
                {/* Trade routes - dashed lines */}
                <path d="M 280 160 Q 200 100, 120 120" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 280 160 Q 320 80, 360 100" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 280 160 Q 350 140, 400 150" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M 280 160 Q 300 180, 320 190" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                
                {/* Destination dots */}
                <circle cx="120" cy="120" r="4" fill="white" />
                <circle cx="360" cy="100" r="4" fill="white" />
                <circle cx="400" cy="150" r="4" fill="white" />
                <circle cx="320" cy="190" r="4" fill="white" />
                
                <text x="280" y="180" fill="white" fontSize="10" textAnchor="middle">INDIA</text>
              </svg>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.3 + index * 0.1 }}
                  className="bg-slate-800/50 border border-white/8 rounded-lg p-6 text-center"
                >
                  <div className="text-3xl font-bold text-blue-400 nebula-text mb-1">{stat.number}</div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Route Cards */}
          <div className="space-y-4">
            {routes.map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.4 + index * 0.1 }}
                className="group bg-slate-800/50 border-l-4 border-red-600 hover:border-blue-500 transition-all duration-300 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{route.from}</span>
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-3xl">{route.to}</span>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {route.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white nebula-text mb-2">{route.route}</h3>
                <p className="text-gray-400 text-sm">{route.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
