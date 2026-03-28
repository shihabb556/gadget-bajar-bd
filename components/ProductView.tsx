'use client';

import { useState, useEffect } from 'react';
import ProductGallery from './ProductGallery';
import ProductActions from './ProductActions';
import { CheckCircle2, Truck, Star } from 'lucide-react';

export default function ProductView({ product }: { product: any }) {
    // Combine base images and all color-specific images for the slideshow
    const baseImages = product.images || [];
    const colorImages = (product.colors || [])
        .map((c: any) => c.image)
        .filter((img: string) => img && !baseImages.includes(img));

    const allImages = [...baseImages, ...colorImages];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleColorChange = (image?: string) => {
        if (image) {
            const index = allImages.indexOf(image);
            if (index !== -1) {
                setSelectedIndex(index);
            }
        }
    };

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start bg-white rounded-[3rem] p-6 md:p-12 shadow-xl shadow-blue-100/20 border border-gray-100">
            {/* Image gallery */}
            <ProductGallery
                images={allImages}
                name={product.name}
                selectedIndex={selectedIndex}
            />

            {/* Product info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                <div className="space-y-6">
                    {/* Badges & Status */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black tracking-widest border border-green-100">
                            <CheckCircle2 className="h-3 w-3" /> In Stock
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            SKU: GB-{product._id.slice(-8).toUpperCase()}
                        </span>
                    </div>

                    <h1 className="text-xl font-black text-gray-700 leading-tight tracking-tighter">
                        {product.name}
                    </h1>

                    {/* Trust Seals */}
                    <div className="flex items-center gap-4 py-2 border-y border-gray-50">
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="h-4 w-[1px] bg-gray-200"></div>
                    </div>

                    {/* Price Section */}
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-3">
                            {(() => {
                                const dp = Number(product.discountPrice) || 0;
                                const hasDiscount = dp > 0 && dp < product.price;
                                return hasDiscount ? (
                                    <>
                                        <p className="text-xl font-black text-red-600 tracking-tighter">৳{dp.toLocaleString()}</p>
                                        <p className="text-lg font-bold text-gray-400 line-through">৳{product.price.toLocaleString()}</p>
                                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg tracking-widest shadow-lg shadow-red-100">
                                            SAVE {Math.round(((product.price - dp) / product.price) * 100)}%
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xl font-black text-gray-700 tracking-tighter">৳{product.price.toLocaleString()}</p>
                                        <p className="text-lg font-bold text-gray-400 line-through">৳{(product.price * 1.05).toLocaleString()}</p>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    <div className="h-[1px] bg-gray-100 w-full" />

                    <ProductActions
                        product={product}
                        onColorChange={handleColorChange}
                    />

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 gap-4 mt-8 pt-8 border-t border-gray-50">
                        <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors group">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Truck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-700 tracking-widest mb-0.5">Delivery Charge</p>
                                <p className="text-[14px] text-gray-500 font-bold tracking-widest">
                                    Inside Dhaka: ৳80 (ঢাকাঃ ৮০ টাকা) <br />
                                    Outside Dhaka: ৳120 (ঢাকার বাইরেঃ ১২০ টাকা)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
