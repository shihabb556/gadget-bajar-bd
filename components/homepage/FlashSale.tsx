'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

function getTimeRemaining() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();
  return {
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function FlashSale() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(getTimeRemaining());
    const timer = setInterval(() => setTime(getTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-gradient relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzRtNC00SDJ2MmgzOHpNMzYgMjZ2MkgydjJoMzRtNC00SDJ2MmgzOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Content */}
          <div className="text-center md:text-left text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
              Flash Sale Today
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-md">
              Grab incredible deals before time runs out. Save up to 40% on selected gadgets!
            </p>
          </div>

          {/* Center: Countdown */}
          <div className="flex items-center gap-3">
            <TimeBlock value={time.hours} label="Hours" />
            <span className="text-white text-3xl font-bold mt-[-20px]">:</span>
            <TimeBlock value={time.minutes} label="Mins" />
            <span className="text-white text-3xl font-bold mt-[-20px]">:</span>
            <TimeBlock value={time.seconds} label="Secs" />
          </div>

          {/* Right: CTA */}
          <Link
            href="/?category=flash-sale"
            className="group inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-white rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-xl">
        <span className="text-2xl md:text-3xl font-extrabold text-orange-600">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] font-bold text-white/80 mt-2 block uppercase tracking-wider">{label}</span>
    </div>
  );
}
