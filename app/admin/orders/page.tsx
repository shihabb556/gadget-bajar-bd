'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Download, MapPin, Phone, CreditCard, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import OrderReceipt from '@/components/OrderReceipt';

function AdminOrdersContent() {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState(searchParams.get('orderId') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
    const router = useRouter();
    const summaryRef = useRef<HTMLDivElement>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [viewOrder, setViewOrder] = useState<any>(null);


    useEffect(() => {
        fetchOrders();
    }, [statusFilter, searchParams]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const userIdFromUrl = searchParams.get('userId');
            if (userIdFromUrl) params.append('userId', userIdFromUrl);
            if (searchId) params.append('orderId', searchId);
            if (statusFilter !== 'ALL') params.append('status', statusFilter);

            const res = await fetch(`/api/admin/orders?${params.toString()}`);
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders();
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Order Management</h2>

                <div className="flex flex-row  gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Order ID..."
                            className="w-full md:w-[10rem] text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <Button type="submit" size="sm" className="bg-gray-800">Search</Button>
                    </form>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm text-gray-700! bg-gray-50 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[10rem] px-4 py-2"
                    >
                        <option className="text-gray-700" value="ALL">All Status</option>
                        <option className="text-gray-700" value="PENDING">Pending</option>
                        <option className="text-gray-700" value="PROCESSING">Processing</option>
                        <option className="text-gray-700" value="DELIVERED">Delivered</option>
                        <option className="text-gray-700" value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Advance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500   tracking-wider">Actions</th>
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
                                            <div className="text-sm font-medium text-gray-700">{order.user?.name || order.guestName || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{order.shippingAddress?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            ৳{order.totalAmount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleAdvancePayment(order._id, order.paymentStatus.advancePaid)}
                                                className={`h-7 px-3 text-[10px]   tracking-wider font-black rounded-full transition-all ${order.paymentStatus.advancePaid
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
                                                className="text-sm text-gray-700! border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => setViewOrder(order)}>
                                                View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                                className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600"
                                                title="Download Summary"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <Modal
                isOpen={!!viewOrder}
                onClose={() => setViewOrder(null)}
                title={`Order Details — #${viewOrder?._id?.slice(-6).toUpperCase() || ''}`}
                variant="info"
                maxWidth="lg"
                actions={[{ label: 'Close', onClick: () => setViewOrder(null), variant: 'ghost' }]}
            >
                {viewOrder && (
                    <div className="space-y-5">
                        {/* Customer */}
                        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-indigo-400   tracking-widest mb-1">Customer</p>
                                <p className="text-sm font-bold text-gray-700">{viewOrder.user?.name || viewOrder.guestName || 'Unknown'}</p>
                                {viewOrder.user?.email && <p className="text-xs text-gray-500">{viewOrder.user.email}</p>}
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400   tracking-widest mb-1">Phone</p>
                                    <p className="text-sm font-semibold text-gray-800">{viewOrder.shippingAddress?.phone || 'N/A'}</p>
                                    {viewOrder.shippingAddress?.secondaryPhone && (
                                        <p className="text-xs text-gray-500">Alt: {viewOrder.shippingAddress.secondaryPhone}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400   tracking-widest mb-1">Address</p>
                                    <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                                        {viewOrder.shippingAddress?.village}, {viewOrder.shippingAddress?.thana || ''}<br />
                                        {viewOrder.shippingAddress?.district || viewOrder.shippingAddress?.city}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-emerald-500   tracking-widest mb-1">Payment</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">TrxID: <span className="font-mono font-bold text-gray-800">{viewOrder.paymentStatus?.trxId || 'N/A'}</span></p>
                                        <p className="text-xs text-gray-500 mt-0.5">Advance: <span className={`font-semibold ${viewOrder.paymentStatus?.advancePaid ? 'text-emerald-600' : 'text-red-500'}`}>{viewOrder.paymentStatus?.advancePaid ? 'Paid ✓' : 'Unpaid'}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400  ">Total</p>
                                        <p className="text-xl font-black text-indigo-600">৳{viewOrder.totalAmount}</p>
                                        {viewOrder.deliveryCharge > 0 && <p className="text-xs text-gray-400">Inc. ৳{viewOrder.deliveryCharge} delivery</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <p className="text-[10px] font-black text-gray-400   tracking-widest mb-3 flex items-center gap-2">
                                <ShoppingBag className="w-3 h-3" /> Items Ordered
                            </p>
                            <div className="space-y-2">
                                {viewOrder.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        {item.image && (
                                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                                        </div>
                                        <p className="text-sm font-black text-gray-700">৳{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Hidden Summary Template for Download */}
            <OrderReceipt
                order={selectedOrder}
                onComplete={() => setSelectedOrder(null)}
            />
        </div>
    );
}

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={<div>Loading orders...</div>}>
            <AdminOrdersContent />
        </Suspense>
    );
}
