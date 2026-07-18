'use client';

const brands = [
  'Baseus', 'Anker', 'Xiaomi', 'Remax', 'Hoco',
  'Samsung', 'Apple', 'JBL', 'Realme', 'OnePlus',
  'Nothing', 'Amazfit', 'Haylou', 'QCY', 'UGREEN',
];

export default function Brands() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-1 w-8 bg-gray-300 rounded-full" />
            <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Brands</span>
            <div className="h-1 w-8 bg-gray-300 rounded-full" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Top Brands We Carry
          </h2>
        </div>

        {/* Scrolling Brand Strip */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-marquee-slow">
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-4 md:mx-6"
              >
                <div className="h-16 md:h-20 w-32 md:w-40 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer group">
                  <span className="text-sm md:text-base font-bold text-gray-400 group-hover:text-blue-600 transition-colors tracking-wide">
                    {brand}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
