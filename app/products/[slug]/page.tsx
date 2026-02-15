import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/db';
import { Product } from '@/models/schema';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton'; // Separate client component

async function getProduct(slug: string) {
    await dbConnect();
    const product = await Product.findOne({ slug, isActive: true });
    return product ? JSON.parse(JSON.stringify(product)) : null;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Image gallery */}
                    <div className="flex flex-col-reverse">
                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden relative h-96">
                            {product.images?.[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="w-full h-full object-center object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl text-gray-900">৳{product.price}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="text-base text-gray-700 space-y-6">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center space-x-3 text-sm">
                                <span className="font-medium text-gray-500">Stock:</span>
                                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm mt-1">
                                <span className="font-medium text-gray-500">Category:</span>
                                <span className="text-gray-900">{product.category}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
