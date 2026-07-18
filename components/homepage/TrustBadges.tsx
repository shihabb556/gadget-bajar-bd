'use client';

import { Truck, Wallet, ShieldCheck, RefreshCw } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Delivered within 2-5 days',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Wallet,
    title: 'Cash on Delivery',
    desc: 'Pay when you receive',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Checked',
    desc: 'Every product verified',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: RefreshCw,
    title: 'Easy Return',
    desc: '7-day return policy',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-gray-100/80 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${badge.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-10 h-10 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{badge.title}</h3>
                <p className="text-xs text-gray-400">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
