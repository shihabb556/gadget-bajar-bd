import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, Order } from '@/models/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'ADMIN';
}

export async function GET(req: Request) {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        await dbConnect();

        const result = await User.aggregate([
            {
                $facet: {
                    data: [
                        {
                            $lookup: {
                                from: 'orders',
                                localField: '_id',
                                foreignField: 'user',
                                as: 'userOrders'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                role: 1,
                                isActive: 1,
                                createdAt: 1,
                                orderCount: { $size: '$userOrders' }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    total: [
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        const users = result[0]?.data || [];
        const total = result[0]?.total[0]?.count || 0;

        return NextResponse.json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error('Fetch users error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
export async function PATCH(req: Request) {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { userId, action, value } = await req.json();
        await dbConnect();

        let update = {};
        if (action === 'toggleStatus') {
            update = { isActive: value };
        } else if (action === 'toggleRole') {
            update = { role: value };
        }

        const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
        return NextResponse.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (session?.user?.id === userId) {
            return NextResponse.json({ message: 'You cannot delete your own account' }, { status: 400 });
        }

        await dbConnect();

        const orderCount = await Order.countDocuments({ user: userId });
        if (orderCount > 0) {
            return NextResponse.json({ message: 'Cannot delete user with existing orders. Deactivate them instead.' }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
