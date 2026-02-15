'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/shared';

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <div className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-64 relative">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <div className="flex-1 p-4 space-y-2 flex flex-col">
                <h3 className="text-sm font-medium text-gray-900">
                    <Link href={`/products/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </Link>
                </h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <div className="flex-1 flex flex-col justify-end">
                    <p className="text-base font-medium text-gray-900">৳{product.price}</p>
                </div>
                <div className="mt-4 z-10">
                    {/* z-10 to be above the absolute link */}
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Prevent navigation
                            addToCart(product);
                        }}
                        className="w-full relative z-20"
                        disabled={product.stock <= 0}
                    >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
