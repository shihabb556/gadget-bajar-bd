'use client';

import { Truck, Zap, CreditCard, ShieldCheck, Package } from 'lucide-react';

const announcements = [
  { icon: Truck, text: 'Free Delivery Over ৳2,000', color: 'text-blue-400' },
  { icon: Zap, text: 'Flash Sale Today — Up to 40% OFF', color: 'text-amber-400' },
  { icon: CreditCard, text: 'Cash on Delivery Available', color: 'text-emerald-400' },
  { icon: ShieldCheck, text: '100% Quality Checked Products', color: 'text-blue-400' },
  { icon: Package, text: 'Fast Delivery Nationwide', color: 'text-cyan-400' },
];

export default function AnnouncementBar() {
  const doubled = [...announcements, ...announcements];

  return (
    <div className="bg-[#0B1120] border-b border-white/[0.04] overflow-hidden">
      <div className="relative h-9 flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-14">
          {doubled.map((item, i) => {
            const Icon = item.icon;
            return (
              <span key={i} className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-slate-400">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span>{item.text}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
