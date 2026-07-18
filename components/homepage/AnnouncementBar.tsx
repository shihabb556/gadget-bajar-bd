'use client';

import { Truck, Zap, CreditCard, ShieldCheck, Package } from 'lucide-react';

const announcements = [
  { icon: Truck, text: 'Free Delivery Over ৳2,000', color: 'text-blue-600' },
  { icon: Zap, text: 'Flash Sale Today - Up to 40% OFF', color: 'text-orange-500' },
  { icon: CreditCard, text: 'Cash on Delivery Available', color: 'text-green-600' },
  { icon: ShieldCheck, text: '100% Quality Checked Products', color: 'text-blue-600' },
  { icon: Package, text: 'Fast Delivery Nationwide', color: 'text-emerald-600' },
];

export default function AnnouncementBar() {
  const doubled = [...announcements, ...announcements];

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white overflow-hidden">
      <div className="relative h-10 flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
          {doubled.map((item, i) => {
            const Icon = item.icon;
            return (
              <span key={i} className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                <Icon className="w-3.5 h-3.5" />
                <span>{item.text}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
