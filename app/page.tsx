import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/db';
import { Product, Category } from '@/models/schema';
import Link from 'next/link';

// Force dynamic because we want refreshed products
export const dynamic = 'force-dynamic';

async function getProducts(categorySlug?: string) {
  await dbConnect();
  const query: any = { isActive: true };

  if (categorySlug) {
    // If we filtered by category, we need to find products with that category
    // Since we store category NAME in product, and we have SLUG in url,
    // we should ideally look up the category name from slug first.
    // Or just store slug in product? Currently Product has 'category' name.

    // Let's find the category document first to get its name
    const categoryDoc = await Category.findOne({ slug: categorySlug });
    if (categoryDoc) {
      // Find products specific to this category OR its subcategories?
      // For now, exact match on category name or subCategory name could be tricky 
      // if we don't store slugs in product.
      // Let's assume strict match on 'category' field for now, assuming it matches the category name.
      // But wait, slug is URL safe, name might have spaces. 
      // If Product.category = "Mobile Accessories", and slug is "mobile-accessories".
      // We found the category doc, so we match Product.category = categoryDoc.name

      // Also match if it is a subcategory? 
      // Product.category stores the "Category Name" (top level) usually? 
      // Or if it matches subCategory?

      query.$or = [
        { category: categoryDoc.name },
        { subCategory: categoryDoc.name }
      ];
    }
  }

  return Product.find(query).sort({ createdAt: -1 }).limit(20);
}

async function getCategories() {
  await dbConnect();
  return Category.find({ parent: null, isActive: true }).sort({ name: 1 });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = await getProducts(category);
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Premium Electronics</span>{' '}
            <span className="block text-indigo-600 xl:inline">For Your Lifestyle</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the latest mobile accessories, headphones, and smart watches.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max justify-center">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.slug
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {category ? `Products in ${category}` : 'Featured Products'}
        </h2>

        {products.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-gray-500">
            <p className="text-xl">No products found in this category.</p>
            <p>Try selecting another category or check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
}
