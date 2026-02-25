'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/shared';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, action: 'updateStatus', value: status }),
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleAdvancePayment = async (orderId: string, currentVal: boolean) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, action: 'toggleAdvance', value: !currentVal }),
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No orders found</td>
                            </tr>
                        ) : (
                            orders.map((order: any) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ...{order._id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{order.shippingAddress?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ৳{order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleAdvancePayment(order._id, order.paymentStatus.advancePaid)}
                                            className={`h-7 px-3 text-[10px] uppercase tracking-wider font-black rounded-full transition-all ${order.paymentStatus.advancePaid
                                                ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                                                : 'bg-white text-red-600 border-red-100 hover:bg-red-50'
                                                }`}
                                        >
                                            {order.paymentStatus.advancePaid ? 'Paid' : 'Unpaid'}
                                        </Button>
                                        {order.paymentStatus.trxId && (
                                            <div className="text-[10px] mt-1 font-mono text-gray-500">
                                                ID: {order.paymentStatus.trxId}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PROCESSING">Processing</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button variant="outline" size="sm" onClick={() => {
                                            const addr = order.shippingAddress;
                                            alert(`
Customer: ${order.user?.name}
Phone: ${addr?.phone}
Alt Phone: ${addr?.secondaryPhone || 'N/A'}
Address: ${addr?.village}, ${addr?.thana || ''}, ${addr?.district || addr?.city}
TrxID: ${order.paymentStatus.trxId || 'N/A'}
Total: ৳${order.totalAmount}
                                            `.trim());
                                        }}>
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
