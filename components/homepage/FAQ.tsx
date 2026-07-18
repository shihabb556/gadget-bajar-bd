'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'We deliver within Dhaka in 1-2 business days. For outside Dhaka, delivery takes 3-5 business days. We ship to all 64 districts in Bangladesh.',
  },
  {
    q: 'What is your warranty policy?',
    a: 'Most products come with a 7-day replacement warranty. Some electronics may have a 1-month seller warranty. Please check the product page for specific warranty details.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 7-day return policy for unopened products in original packaging. If you receive a defective product, we offer free replacement or full refund.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery (COD), bKash, and Nagad. For advance payment, you can send money to our bKash/Nagad number and share the TrxID for verification.',
  },
  {
    q: 'How can I track my order?',
    a: 'After placing an order, you can track it using the "Track Order" feature on our website. Simply enter your order ID to see the current status of your delivery.',
  },
  {
    q: 'Are all products genuine?',
    a: 'Yes! We source all products from authorized distributors and international suppliers. Every product goes through quality checking before dispatch.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">FAQ</span>
            <div className="h-1 w-8 bg-blue-600 rounded-full" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            Everything you need to know about shopping with us
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === i
                  ? 'border-blue-200 shadow-lg shadow-blue-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-bold text-gray-800 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-40 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
