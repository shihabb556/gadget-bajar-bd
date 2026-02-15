'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/shared';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Cards */}
                {[
                    { label: 'Total Sales', value: '৳ 0', color: 'bg-blue-500' },
                    { label: 'Total Orders', value: '0', color: 'bg-indigo-500' },
                    { label: 'Total Products', value: '0', color: 'bg-green-500' },
                    { label: 'Total Users', value: '0', color: 'bg-orange-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`h-10 w-10 rounded-full ${stat.color} opacity-10`}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                <p className="text-gray-500 text-sm">No recent orders found.</p>
            </div>
        </div>
    );
}
