'use client';

import Link from 'next/link';
import { ArrowRight, Percent } from 'lucide-react';

export default function PromotionalBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16 gap-8">
            {/* Left: Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-4">
                <Percent className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wide">Limited Time Offer</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">50% OFF</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-lg">
                Exclusive deals on premium gadgets. Don&apos;t miss out on these incredible savings!
              </p>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop the Sale
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
