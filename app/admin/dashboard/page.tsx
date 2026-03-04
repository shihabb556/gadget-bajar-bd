'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/shared';
import {
    Plus, ShoppingCart, Package, Users, TrendingUp,
    Clock, CheckCircle, XCircle, Loader, Filter, Calendar
} from 'lucide-react';

interface Stats {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    cancelledOrders: number;
    pendingOrders: number;
}

interface RecentOrder {
    _id: string;
    user?: { name: string; email: string };
    guestName?: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: { name: string; quantity: number }[];
}

const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
    PENDING: <Clock className="w-3 h-3" />,
    PROCESSING: <Loader className="w-3 h-3 animate-spin" />,
    DELIVERED: <CheckCircle className="w-3 h-3" />,
    CANCELLED: <XCircle className="w-3 h-3" />,
};

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('all'); // all, today, month, year

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            let from, to;
            const now = new Date();

            if (dateRange === 'today') {
                from = new Date(now.setHours(0, 0, 0, 0)).toISOString();
                to = new Date(now.setHours(23, 59, 59, 999)).toISOString();
            } else if (dateRange === 'month') {
                from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
            } else if (dateRange === 'year') {
                from = new Date(now.getFullYear(), 0, 1).toISOString();
                to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString();
            }

            const params = new URLSearchParams();
            if (from && to) {
                params.append('from', from);
                params.append('to', to);
            }

            const res = await fetch(`/api/admin/dashboard/stats?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setRecentOrders(data.recentOrders);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Total Sales',
            value: stats?.totalSales !== undefined ? `৳${stats.totalSales.toLocaleString()}` : '—',
            icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            iconBg: 'bg-blue-100',
        },
        {
            label: 'Total Orders',
            value: stats?.totalOrders?.toLocaleString() ?? '—',
            icon: <ShoppingCart className="w-5 h-5 text-indigo-600" />,
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            iconBg: 'bg-indigo-100',
        },
        {
            label: 'Total Products',
            value: stats?.totalProducts?.toLocaleString() ?? '—',
            icon: <Package className="w-5 h-5 text-emerald-600" />,
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            iconBg: 'bg-emerald-100',
        },
        {
            label: 'Total Users',
            value: stats?.totalUsers?.toLocaleString() ?? '—',
            icon: <Users className="w-5 h-5 text-orange-600" />,
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            iconBg: 'bg-orange-100',
        },
        {
            label: 'Cancelled Orders',
            value: stats?.cancelledOrders?.toLocaleString() ?? '—',
            icon: <XCircle className="w-5 h-5 text-red-600" />,
            bg: 'bg-red-50',
            border: 'border-red-100',
            iconBg: 'bg-red-100',
        },
        {
            label: 'Pending Orders',
            value: stats?.pendingOrders?.toLocaleString() ?? '—',
            icon: <Clock className="w-5 h-5 text-amber-600" />,
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            iconBg: 'bg-amber-100',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full sm:w-auto">
                    <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
                    <p className="text-xs text-gray-400 mt-1">Real-time stats based on your selection</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm w-full sm:w-auto">
                        {[
                            { id: 'all', label: 'All Time' },
                            { id: 'today', label: 'Today' },
                            { id: 'month', label: 'This Month' },
                            { id: 'year', label: 'This Year' }
                        ].map((range) => (
                            <button
                                key={range.id}
                                onClick={() => setDateRange(range.id)}
                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${dateRange === range.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>

                    <Link href="/admin/products/new" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className={`bg-white rounded-xl shadow-sm p-5 border ${card.border} flex items-center gap-4`}
                    >
                        <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400   tracking-wider">{card.label}</p>
                            {loading ? (
                                <div className="h-7 w-20 bg-gray-100 rounded animate-pulse mt-1" />
                            ) : (
                                <h3 className="text-xl font-black text-gray-700 mt-0.5">{card.value}</h3>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-800">Recent Orders</h3>
                    <Link
                        href="/admin/orders"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800   tracking-wider"
                    >
                        View All →
                    </Link>
                </div>

                {loading ? (
                    <div className="divide-y divide-gray-50">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4">
                                <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
                                <div className="h-4 bg-gray-100 rounded w-32 animate-pulse flex-1" />
                                <div className="h-4 bg-gray-100 rounded w-16 animate-pulse" />
                                <div className="h-6 bg-gray-100 rounded-full w-20 animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm font-medium">No orders yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400   tracking-widest">Order ID</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400   tracking-widest">Customer</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400   tracking-widest">Items</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400   tracking-widest">Total</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400   tracking-widest">Date</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-gray-400   tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders?orderId=${order._id}`}
                                                className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800"
                                            >
                                                ...{order._id.slice(-6).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {order.user?.name || order.guestName || 'Guest'}
                                            </p>
                                            {order.user?.email && (
                                                <p className="text-xs text-gray-400">{order.user.email}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                            ৳{order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-BD', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black   tracking-wider ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {STATUS_ICONS[order.status]}
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
