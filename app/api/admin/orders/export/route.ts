import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/schema';
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

    if (!from || !to) {
        return NextResponse.json({ message: 'From and To dates are required' }, { status: 400 });
    }

    await dbConnect();

    const query: any = {
        createdAt: {
            $gte: new Date(from),
            $lte: new Date(to)
        }
    };

    const orders = await Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    // CSV Header
    let csv = 'Order ID,Date,Customer Name,Email,Phone,Area,Address,Items Count,Total Amount,Status,Payment Status,TrxID\n';

    // CSV Rows
    orders.forEach((order: any) => {
        const orderId = order._id.toString();
        const date = new Date(order.createdAt).toLocaleDateString();
        const customerName = (order.user?.name || order.guestName || 'N/A').replace(/,/g, ' ');
        const email = (order.user?.email || order.guestEmail || 'N/A');
        const phone = (order.shippingAddress?.phone || 'N/A');
        const area = order.deliveryArea || 'N/A';
        const address = `${order.shippingAddress?.village || ''} ${order.shippingAddress?.thana || ''} ${order.shippingAddress?.district || ''}`.trim().replace(/,/g, ' ');
        const itemsCount = order.items?.length || 0;
        const total = order.totalAmount;
        const status = order.status;
        const paymentStatus = order.paymentStatus?.advancePaid ? 'Paid' : 'Unpaid';
        const trxId = order.paymentStatus?.trxId || 'N/A';

        csv += `${orderId},${date},"${customerName}",${email},${phone},${area},"${address}",${itemsCount},${total},${status},${paymentStatus},${trxId}\n`;
    });

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="orders-export-${from}-to-${to}.csv"`
        }
    });
}
