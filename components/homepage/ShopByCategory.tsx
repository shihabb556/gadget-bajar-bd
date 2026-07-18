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
  0: 'from-blue-100 to-blue-50',
  1: 'from-orange-100 to-orange-50',
  2: 'from-green-100 to-green-50',
  3: 'from-purple-100 to-purple-50',
  4: 'from-pink-100 to-pink-50',
  5: 'from-cyan-100 to-cyan-50',
  6: 'from-amber-100 to-amber-50',
  7: 'from-rose-100 to-rose-50',
  8: 'from-indigo-100 to-indigo-50',
  9: 'from-teal-100 to-teal-50',
};

export default function ShopByCategory({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const parentCategories = categories.filter((c) => !c.parent);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">Browse</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {parentCategories.slice(0, 12).map((cat, i) => {
            const emoji = CATEGORY_ICONS[cat.name.toLowerCase()] || '📦';
            const gradient = CATEGORY_COLORS[i % Object.keys(CATEGORY_COLORS).length];

            return (
              <Link
                key={cat._id}
                href={`/?category=${cat.slug}`}
                className="group relative bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300"
              >
                {cat.image ? (
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-2xl overflow-hidden bg-gray-50">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl md:text-4xl">{emoji}</span>
                  </div>
                )}
                <h3 className="text-xs md:text-sm font-bold text-gray-700 truncate">{cat.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
