import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import { Product, Category } from '@/models/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await dbConnect();

    const baseUrl = 'https://gadgetbazarbd.com';

    // Fetch all active products
    const products = await Product.find({ isActive: true }).select('slug updatedAt');
    const productEntries = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Fetch all active categories
    const categories = await Category.find({ isActive: true }).select('slug updatedAt');
    const categoryEntries = categories.map((category) => ({
        url: `${baseUrl}/?category=${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Static routes
    const staticRoutes = [
        '',
        '/cart',
        '/track-order',
        '/auth/login',
        '/auth/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.5,
    }));

    return [...staticRoutes, ...productEntries, ...categoryEntries];
}
