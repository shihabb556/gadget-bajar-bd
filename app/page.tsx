import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/db';
import { Product, Category } from '@/models/schema';
import { Metadata } from 'next';

import AnnouncementBar from '@/components/homepage/AnnouncementBar';
import HeroBanner from '@/components/homepage/HeroBanner';
import TrustBadges from '@/components/homepage/TrustBadges';
import ShopByCategory from '@/components/homepage/ShopByCategory';
import FlashSale from '@/components/homepage/FlashSale';
import FeaturedProducts from '@/components/homepage/FeaturedProducts';
import BestSellers from '@/components/homepage/BestSellers';
import WhyChooseUs from '@/components/homepage/WhyChooseUs';
import PromotionalBanner from '@/components/homepage/PromotionalBanner';
import CustomerReviews from '@/components/homepage/CustomerReviews';
import Statistics from '@/components/homepage/Statistics';
import LatestArrivals from '@/components/homepage/LatestArrivals';
import Brands from '@/components/homepage/Brands';
import FAQ from '@/components/homepage/FAQ';
import Newsletter from '@/components/homepage/Newsletter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gadget Bazar BD - Premium Gadgets & Electronics Shop',
  description:
    'Explore the best collection of gadgets and electronics at Gadget Bazar BD. Smart watches, earbuds, power banks, and more at unbeatable prices with nationwide delivery.',
  keywords: [
    'Gadget Bazar BD',
    'Gadgets Bangladesh',
    'Online Shopping BD',
    'Electronics Dhaka',
    'Smart Watches BD',
    'Earbuds Bangladesh',
  ],
};

const EMPTY = {
  featuredProducts: [],
  flashSaleProducts: [],
  bestSellers: [],
  latestArrivals: [],
  categories: [],
};

async function getHomepageData() {
  try {
    await dbConnect();

    const [
      featuredProducts,
      flashSaleProducts,
      bestSellers,
      latestArrivals,
      categories,
    ] = await Promise.all([
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Product.find({ isActive: true, discountPrice: { $gt: 0 } })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Product.find({ isActive: true, stock: { $gt: 0 } })
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Category.find({ isActive: true }).sort({ name: 1 }).lean(),
    ]);

    return {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      flashSaleProducts: JSON.parse(JSON.stringify(flashSaleProducts)),
      bestSellers: JSON.parse(JSON.stringify(bestSellers)),
      latestArrivals: JSON.parse(JSON.stringify(latestArrivals)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch {
    return EMPTY;
  }
}

export default async function Home() {
  const { featuredProducts, flashSaleProducts, bestSellers, latestArrivals, categories } =
    await getHomepageData();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AnnouncementBar />
      <HeroBanner />
      <TrustBadges />
      <ShopByCategory categories={categories} />
      {flashSaleProducts.length > 0 && <FlashSale />}
      <FeaturedProducts products={featuredProducts} />
      {bestSellers.length > 3 && <BestSellers products={bestSellers} />}
      <WhyChooseUs />
      <PromotionalBanner />
      <CustomerReviews />
      <Statistics />
      {latestArrivals.length > 0 && <LatestArrivals products={latestArrivals} />}
      <Brands />
      <FAQ />
      <Newsletter />
    </div>
  );
}
