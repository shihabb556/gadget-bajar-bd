import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/db';
import { Product } from '@/models/schema';
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found | Gadget Bazar BD',
        };
    }

    return {
        title: product.name,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.slice(0, 160),
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description.slice(0, 160),
            images: product.images?.[0] ? [product.images[0]] : [],
        }
    };
}

async function getProduct(slug: string) {
    await dbConnect();
    const product = await Product.findOne({ slug, isActive: true });
    return product ? JSON.parse(JSON.stringify(product)) : null;
}

async function getRelatedProducts(category: string, currentId: string) {
    await dbConnect();
    const related = await Product.find({
        category,
        isActive: true,
        _id: { $ne: currentId }
    }).limit(4);
    return JSON.parse(JSON.stringify(related));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.category, product._id);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: `GB-${product._id.slice(-8).toUpperCase()}`,
        brand: {
            '@type': 'Brand',
            name: 'Gadget Bazar BD',
        },
        offers: {
            '@type': 'Offer',
            url: `https://gadgetbazarbd.com/products/${product.slug}`,
            priceCurrency: 'BDT',
            price: (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black   tracking-[0.2em] text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href={`/?category=${product.category}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <ProductView product={product} />

                {/* Description & Specs Section */}
                <div className="mt-16 mx-auto">
                    <div>
                        <h2 className="text-xl font-black text-gray-700   italic tracking-tighter mb-6 flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                            Description
                        </h2>
                        <div className="text-gray-700 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-blue-100/10 transition-all hover:shadow-blue-100/20">
                            <div
                                className="text-base break-words text-gray-600 leading-relaxed font-medium prose prose-sm max-w-none ql-editor overflow-hidden
                                        prose-headings:text-gray-700 prose-headings:font-black prose-headings:  
                                        prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-700"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </div>
                </div>



                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-xl font-black text-gray-700   italic tracking-tighter flex items-center gap-3">
                                <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                                Related Products
                            </h2>
                            <Link href={`/?category=${product.category}`} className="text-xs font-black text-blue-600   tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1">
                                View All <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                            {relatedProducts.map((p: any) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
