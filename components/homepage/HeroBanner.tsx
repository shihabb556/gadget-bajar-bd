'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Star } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/80">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">#1 Gadget Store in Bangladesh</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
              Premium{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                Gadgets
              </span>
              <br />
              for Every{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">
                Lifestyle
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
              Discover the latest tech at unbeatable prices. From smartwatches to earbuds, we bring you
              quality gadgets with nationwide delivery and cash on payment.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/70 hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?category=flash-sale"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-gray-100 hover:shadow-xl hover:-translate-y-0.5 border border-gray-100 transition-all duration-300"
              >
                <Zap className="w-4 h-4 text-orange-500" />
                Today&apos;s Deals
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-xs font-semibold text-gray-500 ml-1">4.8/5</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <span className="text-xs font-semibold text-gray-500">10,000+ Happy Customers</span>
            </div>
          </div>

          {/* Right: Floating Product Icons */}
          <div className="relative h-[400px] md:h-[500px] hidden lg:block">
            {/* Main glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-200/40 to-blue-300/20 rounded-full blur-3xl" />
            </div>

            {/* Floating product cards */}
            <div className="absolute top-8 left-12 animate-float bg-white rounded-3xl p-5 shadow-xl shadow-blue-100/40 border border-blue-50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-3xl">⌚</span>
              </div>
              <p className="text-xs font-bold text-gray-700">Smart Watches</p>
              <p className="text-[10px] text-blue-600 font-semibold">From ৳1,299</p>
            </div>

            <div className="absolute top-4 right-8 animate-float-delayed bg-white rounded-3xl p-5 shadow-xl shadow-orange-100/40 border border-orange-50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-3xl">🎧</span>
              </div>
              <p className="text-xs font-bold text-gray-700">Earbuds</p>
              <p className="text-[10px] text-orange-600 font-semibold">From ৳599</p>
            </div>

            <div className="absolute bottom-24 left-4 animate-float-slow bg-white rounded-3xl p-5 shadow-xl shadow-green-100/40 border border-green-50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-3xl">🔋</span>
              </div>
              <p className="text-xs font-bold text-gray-700">Power Banks</p>
              <p className="text-[10px] text-green-600 font-semibold">From ৳899</p>
            </div>

            <div className="absolute bottom-16 right-16 animate-float bg-white rounded-3xl p-5 shadow-xl shadow-purple-100/40 border border-purple-50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-3xl">🔊</span>
              </div>
              <p className="text-xs font-bold text-gray-700">Speakers</p>
              <p className="text-[10px] text-purple-600 font-semibold">From ৳799</p>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-2xl shadow-blue-200/60 border border-blue-100">
              <div className="text-center">
                <span className="text-2xl font-extrabold text-blue-600 block">40%</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
