'use client';

import { Shield, Award, Headphones, Lock, MapPin } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '100% Original',
    desc: 'All products are genuine and sourced from authorized distributors.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Award,
    title: 'Trusted Store',
    desc: 'Serving 10,000+ happy customers across Bangladesh.',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Headphones,
    title: 'Fast Support',
    desc: 'Quick response on Facebook, phone, and email support.',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Lock,
    title: 'Secure Checkout',
    desc: 'Safe payment with bKash, Nagad, and Cash on Delivery.',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: MapPin,
    title: 'Nationwide Delivery',
    desc: 'We deliver to every district in Bangladesh.',
    color: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">Why Us</span>
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Why Choose Gadget Bazar BD
          </h2>
          <p className="text-sm text-gray-400 mt-2 font-medium max-w-md mx-auto">
            We make online gadget shopping easy, safe, and affordable
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
