'use client';

import Image from 'next/image';

export default function Navbar() {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 px-8 md:px-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={56}
            height={56}
            className="w-10 h-10 md:w-14 md:h-14"
            priority
          />
          <h1 className="text-xl md:text-2xl font-bold text-white nebula-text">TRIDENT</h1>
        </div>

        <button className="bg-white text-slate-900 px-3 py-1 md:px-6 md:py-2.5 rounded-full font-semibold text-xs md:text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
          Inquiry Now
          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
