'use client';

import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number;
  images: string[];
  category: string;
  stock: number;
  createdAt: string;
  colors?: { name: string; image: string }[];
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section id="featured-products" className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">Our Selection</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">Handpicked gadgets at the best prices</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>
      </div>
    </section>
  );
}
