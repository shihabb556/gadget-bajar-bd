'use client';

import Navbar from '@/components/Navbar';
import { useCartStore } from '@/lib/store';
import { Button, Input } from '@/components/ui/shared';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        phone: '',
    });

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && items.length === 0) {
            router.push('/cart');
        }
    }, [mounted, items, router]);

    if (!mounted) return null;

    if (items.length === 0) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/user/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingAddress,
                    totalAmount: total(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to place order');
            }

            await res.json();
            clearCart();
            router.push('/profile?orderSuccess=true');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <Input readOnly value={session?.user?.name || ''} className="mt-1 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                    <Input
                                        required
                                        value={shippingAddress.street}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                        className="mt-1"
                                        placeholder="House 123, Road 4, Block A"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <Input
                                        required
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        className="mt-1"
                                        placeholder="Dhaka"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <Input
                                        required
                                        type="tel"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        className="mt-1"
                                        placeholder="017xxxxxxxx"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-600">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Payment Terms</h2>
                            <p className="text-gray-600 mb-4">
                                To confirm your order, a mandatory advance payment of <span className="font-bold">100 BDT</span> is required.
                                The remaining amount will be collected as Cash on Delivery.
                            </p>
                            <p className="text-sm text-gray-500">
                                After placing the order, our team will call you to confirm the advance payment details (Bkash/Nagad).
                                Status will be "PENDING" until verification.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item._id} className="py-4 flex">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm font-medium">{item.name}</h3>
                                                    <p className="text-sm font-medium">৳{item.price * item.quantity}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border-t border-gray-200 py-6 mt-4">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Total</p>
                                    <p>৳{total()}</p>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Including taxes</p>
                            </div>

                            <Button
                                form="checkout-form"
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6"
                            >
                                {loading ? 'Processing...' : 'Place Order (COD)'}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
