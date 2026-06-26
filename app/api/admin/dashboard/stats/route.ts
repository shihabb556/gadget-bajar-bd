import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order, Product, User } from '@/models/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'ADMIN';
}

export async function GET(req: Request) {
    if (!await isAdmin()) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    await dbConnect();

    const orderQuery: any = {};
    const productQuery: any = {};
    const userQuery: any = {};

    if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        orderQuery.createdAt = { $gte: fromDate, $lte: toDate };
        productQuery.createdAt = { $gte: fromDate, $lte: toDate };
        userQuery.createdAt = { $gte: fromDate, $lte: toDate };
    }

    try {
        const [
            orders,
            totalProducts,
            totalUsers,
            recentOrders
        ] = await Promise.all([
            Order.find(orderQuery),
            Product.countDocuments(from && to ? productQuery : {}),
            User.countDocuments(from && to ? userQuery : {}),
            Order.find(orderQuery)
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .limit(7)
        ]);

        const totalSales = orders
            .filter((o: any) => o.status === 'DELIVERED')
            .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        const totalOrders = orders.length;
        const cancelledOrders = orders.filter((o: any) => o.status === 'CANCELLED').length;
        const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;

        return NextResponse.json({
            stats: {
                totalSales,
                totalOrders,
                totalProducts,
                totalUsers,
                cancelledOrders,
                pendingOrders,
            },
            recentOrders
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
