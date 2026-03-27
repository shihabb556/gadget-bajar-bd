'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

interface IBanner {
    _id: string;
    image: string;
    title?: string;
    link?: string;
    isActive: boolean;
}

const DEFAULT_BANNERS = [
    {
        _id: 'default-1',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&h=400&auto=format&fit=crop',
        title: 'Latest Smartphones',
        link: '/products',
    },
    {
        _id: 'default-2',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&h=400&auto=format&fit=crop',
        title: 'Cool Gadgets',
        link: '/products',
    }
];

export default function BannerSlider() {
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => { emblaApi.off('select', onSelect) as unknown as void; };
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch('/api/banners');
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setBanners(data);
                    } else {
                        setBanners(DEFAULT_BANNERS as unknown as IBanner[]);
                    }
                } else {
                    setBanners(DEFAULT_BANNERS as unknown as IBanner[]);
                }
            } catch (error) {
                setBanners(DEFAULT_BANNERS as unknown as IBanner[]);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    if (loading) {
        return <div className="w-full h-[200px] md:h-[400px] bg-gray-200 animate-pulse rounded-lg mt-4"></div>;
    }

    return (
        <div className="relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 overflow-hidden">
            <div className="overflow-hidden rounded-xl shadow-lg border border-gray-100" ref={emblaRef}>
                <div className="flex">
                    {banners.map((banner) => (
                        <div key={banner._id} className="relative flex-[0_0_100%] min-w-0 h-[200px] md:h-[400px]">
                            {banner.link ? (
                                <Link href={banner.link}>
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        fill
                                        priority
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {banner.title && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-12">
                                            <h2 className="text-white text-xl md:text-3xl font-bold">{banner.title}</h2>
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <>
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        fill
                                        priority
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {banner.title && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-12">
                                            <h2 className="text-white text-xl md:text-3xl font-bold">{banner.title}</h2>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? 'bg-white w-6' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
