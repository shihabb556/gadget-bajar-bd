'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function ProfileContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const orderSuccess = searchParams.get('orderSuccess');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [session]);

    const fetchOrders = async () => {
        if (!session) return;
        try {
            const res = await fetch('/api/user/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {orderSuccess && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    Order placed successfully! We will contact you soon for confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                <div className="space-y-6">
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <p>You haven't placed any orders yet.</p>
                    ) : (
                        orders.map((order: any) => (
                            <div key={order._id} className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                                <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Order #{order._id.slice(-6)}
                                        </h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">৳{order.totalAmount}</dd>
                                        </div>
                                        <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Advance Paid</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {order.paymentStatus.advancePaid ? 'Yes' : 'No (Pending Verification)'}
                                            </dd>
                                        </div>
                                        <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Items</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <ul className="list-disc pl-5">
                                                    {order.items.map((item: any) => (
                                                        <li key={item._id}>
                                                            {item.name} x {item.quantity} - ৳{item.price * item.quantity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
