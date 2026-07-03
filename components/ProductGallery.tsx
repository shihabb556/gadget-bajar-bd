'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    name: string;
    selectedIndex?: number;
}

export default function ProductGallery({ images, name, selectedIndex }: ProductGalleryProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 4000, stopOnInteraction: true })
    ]);
    const [currentIdx, setCurrentIdx] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentIdx(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    // Handle selectedIndex prop from parent (e.g. from color selection)
    useEffect(() => {
        if (emblaApi && typeof selectedIndex === 'number') {
            emblaApi.scrollTo(selectedIndex);
        }
    }, [emblaApi, selectedIndex]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    if (!images.length) {
        return (
            <div className="w-full aspect-square bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-400 border border-gray-100">
                No Image
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Carousel */}
            <div className="relative group">
                <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-100/20 bg-white" ref={emblaRef}>
                    <div className="flex">
                        {images.map((img, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-square">
                                <Image
                                    src={img}
                                    alt={`${name} - Image ${index + 1}`}
                                    fill
                                    className="object-contain p-8 transform group-hover:scale-110 transition-transform duration-700"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-gray-100 text-gray-700 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-gray-100 text-gray-700 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}

                {/* Counter Badge */}
                <div className="absolute bottom-6 right-6 bg-gray-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest z-10">
                    {currentIdx + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none px-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollTo(idx)}
                        className={`
                            relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all
                            ${currentIdx === idx ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100 hover:border-blue-200'}
                        `}
                    >
                        <Image
                            src={img}
                            alt={`${name} thumbnail ${idx + 1}`}
                            fill
                            className="object-cover p-2"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
