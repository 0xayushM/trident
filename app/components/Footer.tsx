'use client';

import Image from 'next/image';

export default function Footer() {
  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Global Reach', href: '#global' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  const certLogos = [
    { name: 'ISO', emoji: '🔬' },
    { name: 'HACCP', emoji: '✓' },
    { name: 'FDA', emoji: '🇺🇸' },
    { name: 'EU', emoji: '🇪🇺' },
    { name: 'Halal', emoji: '☪️' },
  ];

  return (
    <footer className="relative w-full bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left: Logo + Tagline */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Trident Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h3 className="text-xl font-bold text-white nebula-text">TRIDENT</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Global freight forwarding and trade facilitation for businesses that demand precision, reliability, and transparency.
            </p>
          </div>

          {/* Center: Nav Links */}
          <div className="flex flex-col md:items-center">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Certification Logos */}
          <div className="flex flex-col md:items-end">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Certifications</h4>
            <div className="flex gap-3 flex-wrap">
              {certLogos.map((cert, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/8 flex items-center justify-center text-lg"
                  title={cert.name}
                >
                  {cert.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Trident International Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
