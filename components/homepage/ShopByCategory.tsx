'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parent?: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  'smart watch': '⌚',
  'watches': '⌚',
  'earbuds': '🎧',
  'headphones': '🎧',
  'speakers': '🔊',
  'speaker': '🔊',
  'fans': '🌀',
  'mini fan': '🌀',
  'phone accessories': '📱',
  'charger': '🔌',
  'chargers': '🔌',
  'power bank': '🔋',
  'power banks': '🔋',
  'lighting': '💡',
  'gaming': '🎮',
  'home gadgets': '🏠',
};

const CATEGORY_COLORS: Record<number, string> = {
  0: 'from-blue-500 to-blue-400',
  1: 'from-orange-500 to-orange-400',
  2: 'from-emerald-500 to-emerald-400',
  3: 'from-violet-500 to-violet-400',
  4: 'from-pink-500 to-pink-400',
  5: 'from-cyan-500 to-cyan-400',
  6: 'from-amber-500 to-amber-400',
  7: 'from-rose-500 to-rose-400',
  8: 'from-indigo-500 to-indigo-400',
  9: 'from-teal-500 to-teal-400',
};

const CATEGORY_BG: Record<number, string> = {
  0: 'bg-blue-50 group-hover:bg-blue-100',
  1: 'bg-orange-50 group-hover:bg-orange-100',
  2: 'bg-emerald-50 group-hover:bg-emerald-100',
  3: 'bg-violet-50 group-hover:bg-violet-100',
  4: 'bg-pink-50 group-hover:bg-pink-100',
  5: 'bg-cyan-50 group-hover:bg-cyan-100',
  6: 'bg-amber-50 group-hover:bg-amber-100',
  7: 'bg-rose-50 group-hover:bg-rose-100',
  8: 'bg-indigo-50 group-hover:bg-indigo-100',
  9: 'bg-teal-50 group-hover:bg-teal-100',
};

export default function ShopByCategory({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const parentCategories = categories.filter((c) => !c.parent);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">Browse</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-400 mt-1.5 font-medium">Find exactly what you need</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group/view"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover/view:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {parentCategories.slice(0, 12).map((cat, i) => {
            const emoji = CATEGORY_ICONS[cat.name.toLowerCase()] || '📦';
            const gradient = CATEGORY_COLORS[i % Object.keys(CATEGORY_COLORS).length];
            const bgHover = CATEGORY_BG[i % Object.keys(CATEGORY_BG).length];

            return (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl md:rounded-[1.75rem] p-4 md:p-5 text-center transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1.5 border border-gray-100 hover:border-gray-200"
              >
                <div className={`relative w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full ${bgHover} transition-colors duration-300 flex items-center justify-center`}>
                  {cat.image ? (
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-gray-200/50 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <span className="text-xl md:text-2xl">{emoji}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xs md:text-sm font-bold text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
