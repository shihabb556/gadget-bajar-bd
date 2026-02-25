'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/shared';
import { Star, ShoppingCart, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    // Calculate if the product is "NEW" (created in the last 7 days)
    const isNew = new Date(product.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock > 0) {
            addToCart(product);
            toast.success(`${product.name} added to cart!`);
        }
    };

    return (
        <div className="group relative bg-white border border-gray-100 rounded-[2rem] flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-1">
            {/* Image Container */}
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {isNew && (
                    <div className="absolute top-4 left-4 z-20">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">New</span>
                    </div>
                )}
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="h-full w-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                    </div>
                )}

                {/* Overlay with Quick Info */}
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Info className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="mb-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{product.category || 'GADGET'}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight min-h-[2.5rem] line-clamp-2 uppercase italic tracking-tighter">
                    <Link href={`/products/${product.slug}`}>
                        {product.name}
                    </Link>
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">4.8 (120)</span>
                </div>

                <div className="flex items-end justify-between mt-auto">
                    <div className="space-y-0.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pricing</p>
                        <p className="text-xl font-black text-gray-900 tracking-tighter">৳{product.price.toLocaleString()}</p>
                    </div>

                    <Button
                        variant="default"
                        size="icon"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${product.stock > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <Link href={`/products/${product.slug}`} className="absolute inset-x-0 top-0 h-[calc(100%-80px)] z-10" aria-hidden="true" />
        </div>
    );
}
