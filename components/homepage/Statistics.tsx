'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, ShoppingBag, Truck, ThumbsUp } from 'lucide-react';

const stats = [
  { icon: Users, value: 10000, suffix: '+', label: 'Happy Customers', color: 'from-blue-500 to-blue-600' },
  { icon: ShoppingBag, value: 25000, suffix: '+', label: 'Products Sold', color: 'from-orange-500 to-orange-600' },
  { icon: Truck, value: 20000, suffix: '+', label: 'Orders Delivered', color: 'from-green-500 to-green-600' },
  { icon: ThumbsUp, value: 98, suffix: '%', label: 'Positive Reviews', color: 'from-purple-500 to-purple-600' },
];

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatItem({ stat }: { stat: typeof stats[0] }) {
  const { count, ref } = useCountUp(stat.value);
  const Icon = stat.icon;

  return (
    <div ref={ref} className="text-center group">
      <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
        {stat.value >= 1000 ? `${(count / 1000).toFixed(count >= 1000 ? 0 : 0)},${String(count % 1000).padStart(3, '0')}` : count}{stat.suffix}
      </p>
      <p className="text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
