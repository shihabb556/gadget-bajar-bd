'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Download, MapPin, Phone, CreditCard, ShoppingBag, User, Trash2, AlertTriangle, Calendar, History, FileText } from 'lucide-react';
import { Button } from '@/components/ui/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import OrderReceipt from '@/components/OrderReceipt';
import { Pagination } from '@/components/ui/Pagination';

function AdminOrdersContent() {
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState(searchParams.get('orderId') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
    const router = useRouter();
    const summaryRef = useRef<HTMLDivElement>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [viewOrder, setViewOrder] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState({
        timeframe: 'month',
        statuses: ['CANCELLED', 'DELIVERED']
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportDateRange, setExportDateRange] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });


    useEffect(() => {
        fetchOrders();
    }, [statusFilter, searchParams, currentPage]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const userIdFromUrl = searchParams.get('userId');
            if (userIdFromUrl) params.append('userId', userIdFromUrl);
            if (searchId) params.append('orderId', searchId);
            if (statusFilter !== 'ALL') params.append('status', statusFilter);
            params.append('page', currentPage.toString());
            params.append('limit', '10');

            const res = await fetch(`/api/admin/orders?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
                setPagination({
                    totalPages: data.totalPages,
                    total: data.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchOrders();
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
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

    const handleDeleteHistory = async () => {
        if (!confirm('Are you absolutely sure? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deleteConfig),
            });
            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setIsDeleteModalOpen(false);
                fetchOrders();
            } else {
                alert('Failed to delete history');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting history');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleExportCSV = async () => {
        const params = new URLSearchParams({
            from: new Date(exportDateRange.from).toISOString(),
            to: new Date(new Date(exportDateRange.to).setHours(23, 59, 59, 999)).toISOString()
        });
        window.open(`/api/admin/orders/export?${params.toString()}`, '_blank');
        setIsExportModalOpen(false);
    };

    const setQuickExport = (type: 'today' | 'month' | 'year') => {
        const today = new Date();
        let from = new Date();
        const to = today.toISOString().split('T')[0];

        if (type === 'today') {
            from = today;
        } else if (type === 'month') {
            from = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (type === 'year') {
            from = new Date(today.getFullYear(), 0, 1);
        }

        setExportDateRange({
            from: from.toISOString().split('T')[0],
            to: to
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Order Management</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Order ID..."
                            className="flex-1 sm:w-[10rem] text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <Button type="submit" size="sm" className="bg-gray-800">Search</Button>
                    </form>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="flex-1 sm:w-[10rem] text-sm text-gray-700! bg-gray-50 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2"
                        >
                            <option className="text-gray-700" value="ALL">All Status</option>
                            <option className="text-gray-700" value="PENDING">Pending</option>
                            <option className="text-gray-700" value="PROCESSING">Processing</option>
                            <option className="text-gray-700" value="DELIVERED">Delivered</option>
                        </select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex-1 sm:flex-none text-blue-600 border-blue-100 hover:bg-blue-50"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            <span className="hidden xs:inline">Export CSV</span>
                            <span className="xs:hidden">CSV</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex-1 sm:flex-none text-red-600 border-red-100 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            <span className="hidden xs:inline">Delete History</span>
                            <span className="xs:hidden">Delete</span>
                        </Button>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                />
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

            {/* Delete History Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Order History"
                variant="error"
                maxWidth="md"
                actions={[
                    { label: 'Cancel', onClick: () => setIsDeleteModalOpen(false), variant: 'ghost' },
                    {
                        label: isDeleting ? 'Deleting...' : 'Confirm Deletion',
                        onClick: handleDeleteHistory,
                        variant: 'danger',
                        disabled: isDeleting || deleteConfig.statuses.length === 0
                    }
                ]}
            >
                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-800">Dangerous Action</p>
                            <p className="text-xs text-red-600 mt-1">
                                This will permanently delete orders that match your criteria. This action cannot be reversed.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                                <History className="w-3 h-3" /> Select Statuses
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['CANCELLED', 'DELIVERED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            const newStatuses = deleteConfig.statuses.includes(status)
                                                ? deleteConfig.statuses.filter(s => s !== status)
                                                : [...deleteConfig.statuses, status];
                                            setDeleteConfig({ ...deleteConfig, statuses: newStatuses });
                                        }}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${deleteConfig.statuses.includes(status)
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Select Timeframe
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setDeleteConfig({ ...deleteConfig, timeframe: 'month' })}
                                    className={`p-4 rounded-xl border text-left transition-all ${deleteConfig.timeframe === 'month'
                                        ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/20'
                                        : 'bg-gray-50 border-gray-100 hover:border-indigo-100'
                                        }`}
                                >
                                    <p className={`text-sm font-bold ${deleteConfig.timeframe === 'month' ? 'text-indigo-700' : 'text-gray-700'}`}>Last Month</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Orders older than 30 days only</p>
                                </button>
                                <button
                                    onClick={() => setDeleteConfig({ ...deleteConfig, timeframe: 'all' })}
                                    className={`p-4 rounded-xl border text-left transition-all ${deleteConfig.timeframe === 'all'
                                        ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/20'
                                        : 'bg-gray-50 border-gray-100 hover:border-indigo-100'
                                        }`}
                                >
                                    <p className={`text-sm font-bold ${deleteConfig.timeframe === 'all' ? 'text-indigo-700' : 'text-gray-700'}`}>All Times</p>
                                    <p className="text-[10px] text-gray-500 mt-1">All orders regardless of date</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Export CSV Modal */}
            <Modal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Orders (CSV)"
                variant="info"
                maxWidth="md"
                actions={[
                    { label: 'Cancel', onClick: () => setIsExportModalOpen(false), variant: 'ghost' },
                    { label: 'Download CSV', onClick: handleExportCSV, variant: 'primary' }
                ]}
            >
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-blue-800">Export Order Details</p>
                            <p className="text-xs text-blue-600 mt-1">
                                Download order history including customer details, addresses, and payment information in CSV format.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" size="sm" onClick={() => setQuickExport('today')}>Today</Button>
                        <Button variant="outline" size="sm" onClick={() => setQuickExport('month')}>This Month</Button>
                        <Button variant="outline" size="sm" onClick={() => setQuickExport('year')}>This Year</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 tracking-widest block mb-2 uppercase">From Date</label>
                            <input
                                type="date"
                                className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 bg-gray-50 border shadow-sm"
                                value={exportDateRange.from}
                                onChange={(e) => setExportDateRange({ ...exportDateRange, from: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 tracking-widest block mb-2 uppercase">To Date</label>
                            <input
                                type="date"
                                className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 bg-gray-50 border shadow-sm"
                                value={exportDateRange.to}
                                onChange={(e) => setExportDateRange({ ...exportDateRange, to: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
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
