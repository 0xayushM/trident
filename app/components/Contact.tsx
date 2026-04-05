'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    enquiryType: '',
    volume: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white nebula-text">
            START YOUR SHIPMENT TODAY
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Office Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white nebula-text mb-8">HEADQUARTERS</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Address</p>
                  <p className="text-gray-400">Trident International Pvt. Ltd.<br />New Delhi, India 110001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Email</p>
                  <p className="text-gray-400">info@tridentintl.com<br />sales@tridentintl.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Phone</p>
                  <p className="text-gray-400">+91 11 4567 8900<br />+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Business Hours</p>
                  <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM IST<br />Saturday: 9:00 AM - 2:00 PM IST</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-white text-sm font-semibold mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-white/8 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-white text-sm font-semibold mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-white/8 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-white text-sm font-semibold mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-white/8 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-white/8 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiryType" className="block text-white text-sm font-semibold mb-2">
                    Enquiry Type *
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    required
                    value={formData.enquiryType}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-white/8 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="sea-freight">Sea Freight</option>
                    <option value="air-freight">Air Freight</option>
                    <option value="customs">Customs Brokerage</option>
                    <option value="sourcing">Supplier Sourcing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="volume" className="block text-white text-sm font-semibold mb-2">
                    Expected Volume
                  </label>
                  <select
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-white/8 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="lcl">LCL (&lt;20 MT)</option>
                    <option value="fcl">FCL (20-100 MT)</option>
                    <option value="bulk">Bulk (&gt;100 MT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-white text-sm font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-white/8 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about your shipment requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Submit Enquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
