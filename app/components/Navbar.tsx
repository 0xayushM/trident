'use client';

import Image from 'next/image';

export default function Navbar({ ready = true }: { ready?: boolean }) {
  return (
    <div
      className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-1000 ease-out"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(-2rem)',
      }}
    >
      <nav className="mx-auto max-w-7xl bg-gradient-to-r from-red-800/50 via-white/10 to-blue-800/50 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
                priority
              />
              <h1 className="text-lg md:text-xl font-bold text-white unica-text">Trident</h1>
            </div>
          </div>

          {/* Right: Contact Button */}
          <button 
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors uppercase tracking-wide"
          >
            CONTACT
          </button>
        </div>
      </nav>
    </div>
  );
}
