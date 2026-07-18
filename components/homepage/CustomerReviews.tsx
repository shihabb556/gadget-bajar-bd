'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Rahim Uddin',
    avatar: 'R',
    rating: 5,
    text: 'Amazing quality earbuds! The sound is crystal clear and the battery lasts all day. Highly recommend Gadget Bazar BD.',
    product: 'Wireless Earbuds Pro',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Fatima Khan',
    avatar: 'F',
    rating: 5,
    text: 'Fast delivery and the smartwatch exceeded my expectations. The build quality is premium for the price.',
    product: 'Smart Watch GT5',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    name: 'Sakib Ahmed',
    avatar: 'S',
    rating: 5,
    text: 'Best online gadget store in BD! Cash on delivery and genuine products. Will order again.',
    product: 'Power Bank 20000mAh',
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Nusrat Jahan',
    avatar: 'N',
    rating: 5,
    text: 'Ordered a mini fan for the summer. Works perfectly and delivered within 3 days. Great service!',
    product: 'Portable Mini Fan',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    name: 'Tanvir Hossain',
    avatar: 'T',
    rating: 5,
    text: 'The RGB light strip is exactly as shown. Easy setup and the quality is impressive. Love the store!',
    product: 'RGB LED Strip Light',
    color: 'bg-rose-100 text-rose-600',
  },
];

export default function CustomerReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) as unknown as void; };
  }, [emblaApi]);

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-orange-500 rounded-full" />
              <span className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase">Testimonials</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              What Our Customers Say
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-500 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-500 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {reviews.map((review, i) => (
              <div key={i} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 min-w-0">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-blue-100" />
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{review.text}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center`}>
                      <span className="text-sm font-bold">{review.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{review.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{review.product}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex ? 'bg-blue-600 w-6' : 'bg-gray-200 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
