'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Button, Input } from '@/components/ui/shared';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { pixelInitiateCheckout, pixelPurchase } from '@/lib/pixel';
import { orderSchema, ShippingAddressInput } from '@/lib/validations';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState({ advanceOption: 'Unpaid' });

    const [shippingAddress, setShippingAddress] = useState<ShippingAddressInput>({
        street: '',
        city: '',
        phone: '',
        village: '',
        thana: '',
        district: '',
        secondaryPhone: '',
    });
    const [trxId, setTrxId] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestName, setGuestName] = useState('');
    const [fieldErrors, setFieldErrors] = useState<any>({});
    const [deliveryArea, setDeliveryArea] = useState<'Inside Dhaka' | 'Outside Dhaka' | ''>('');
    const deliveryCharge = deliveryArea === 'Inside Dhaka' ? 80 : deliveryArea === 'Outside Dhaka' ? 170 : 0;

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && items.length === 0) {
            router.push('/cart');
        }
        fetchSettings();
        if (session) {
            fetchProfile();
        }
        // Fire InitiateCheckout when user arrives at checkout with items
        if (mounted && items.length > 0) {
            pixelInitiateCheckout({
                value: total(),
                num_items: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
            });
        }
    }, [mounted, items, router, session]);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setShippingAddress({
                    street: data.street || '',
                    city: data.district || '', // Mapping district to city if city is missing
                    phone: data.primaryPhone || '',
                    village: data.village || '',
                    thana: data.thana || '',
                    district: data.district || '',
                    secondaryPhone: data.secondaryPhone || '',
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!mounted) return null;

    if (items.length === 0) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        if (!trxId) {
            toast.error('Please provide your Payment Transaction ID (TrxID) to proceed.');
            return;
        }

        const orderData = {
            items,
            shippingAddress,
            trxId: trxId,
            deliveryArea,
            guestEmail: !session ? guestEmail : undefined,
            guestName: !session ? guestName : undefined,
        };

        // Frontend validation
        const result = orderSchema.safeParse(orderData);
        if (!result.success) {
            const errors: any = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                errors[path] = issue.message;
            });
            setFieldErrors(errors);
            toast.error('Please fix the errors in the form');
            return;
        }

        if (settings.advanceOption === 'Paid' && !trxId) {
            toast.error('Please provide your Payment Transaction ID (TrxID) to proceed.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/user/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingAddress,
                    totalAmount: total() + deliveryCharge,
                    trxId: trxId,
                    deliveryArea,
                    guestEmail: !session ? guestEmail : undefined,
                    guestName: !session ? guestName : undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to place order');
            }

            const data = await res.json();
            // Fire Purchase event before clearing cart
            pixelPurchase({
                value: total(),
                num_items: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
                order_id: data.orderId,
            });
            clearCart();
            console.log('Order placed successfully!', data.orderId, data);
            toast.success('Order placed successfully!');
            router.push(`/order-success?orderId=${data.orderId}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-extrabold text-gray-700 tracking-tight italic">Secure Checkout</h1>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
                            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                                <span className="h-6 w-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs">1</span>
                                Shipping Information
                            </h2>
                            {/* {settings.advanceOption === 'Paid' && ( */}
                            <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-100 shadow-sm">
                                <div className="bg-indigo-600 px-6 py-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        📦 অর্ডার কনফার্মেশন নোটিস 📦
                                    </h3>
                                </div>
                                <div className="bg-indigo-50/30 p-6 space-y-4">
                                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                        প্রিয় কাস্টমার,<br />
                                        আপনার অর্ডার কনফার্ম করার জন্য অনুগ্রহ করে সঠিক তথ্য দিন এবং ১০০ টাকা অ্যাডভান্স প্রদান করুন।
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                                            <span className="text-green-600">✅</span> অ্যাডভান্স পাওয়ার পরই আপনার অর্ডার প্রসেস শুরু হবে।
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                                            <span className="text-green-600">✅</span> বিকাশ / নগদ / রকেট মাধ্যমে পেমেন্ট করতে পারবেন।
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-indigo-100">
                                        <p className="text-xs font-black text-indigo-600   tracking-widest mb-2">পেমেন্ট নাম্বার (অ্যাডভান্স):</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <span className="text-xl">📲</span>
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-gray-700">01620-919681</p>
                                                <p className="text-[10px] text-gray-500 font-bold   tracking-tight">বিকাশ / নগদ / রকেট (Send Money)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 text-[11px] text-gray-500 font-medium bg-white/50 p-3 rounded-xl border border-indigo-50">
                                        <p className="mb-2 font-bold text-gray-700">নিচের তথ্যগুলো দিয়ে অর্ডার কনফার্ম করুন:</p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            <p>— নাম</p>
                                            <p>— গ্রাম/ঠিকানা</p>
                                            <p>— থানা</p>
                                            <p>— জেলা</p>
                                            <p className="col-span-2">— দুটি সচল ফোন নাম্বার</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* )} */}
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">Recipient Name</label>
                                        {session ? (
                                            <Input readOnly value={session.user.name || ''} className="bg-gray-100 border-gray-100 rounded-xl font-medium cursor-not-allowed" />
                                        ) : (
                                            <>
                                                <Input
                                                    required
                                                    value={guestName}
                                                    onChange={(e) => setGuestName(e.target.value)}
                                                    className={`rounded-xl border ${fieldErrors.guestName ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-600 focus:ring-0`}
                                                    placeholder="Your Full Name"
                                                />
                                                {fieldErrors.guestName && (
                                                    <p className="mt-1 text-xs text-red-500">{fieldErrors.guestName}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">Email Address</label>
                                        {session ? (
                                            <Input readOnly value={session.user.email || ''} className="bg-gray-100 border-gray-100 rounded-xl font-medium cursor-not-allowed" />
                                        ) : (
                                            <>
                                                <Input
                                                    required
                                                    type="email"
                                                    value={guestEmail}
                                                    onChange={(e) => setGuestEmail(e.target.value)}
                                                    className={`rounded-xl border ${fieldErrors.guestEmail ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-600 focus:ring-0`}
                                                    placeholder="email@example.com"
                                                />
                                                {fieldErrors.guestEmail && (
                                                    <p className="mt-1 text-xs text-red-500">{fieldErrors.guestEmail}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">Village / Ward / Road</label>
                                        <Input
                                            required
                                            value={shippingAddress.village}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, village: e.target.value })}
                                            className={`rounded-xl border ${fieldErrors['shippingAddress.village'] ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-600 focus:ring-0`}
                                            placeholder="House 12, Road 5"
                                        />
                                        {fieldErrors['shippingAddress.village'] && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors['shippingAddress.village']}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">Thana / Sub-district</label>
                                        <Input
                                            required
                                            value={shippingAddress.thana}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, thana: e.target.value })}
                                            className={`rounded-xl border ${fieldErrors['shippingAddress.thana'] ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-600 focus:ring-0`}
                                            placeholder="Your Thana"
                                        />
                                        {fieldErrors['shippingAddress.thana'] && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors['shippingAddress.thana']}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">District</label>
                                        <Input
                                            required
                                            value={shippingAddress.district}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                                            className={`rounded-xl border ${fieldErrors['shippingAddress.district'] ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-600 focus:ring-0`}
                                            placeholder="Your District"
                                        />
                                        {fieldErrors['shippingAddress.district'] && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors['shippingAddress.district']}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">Delivery Area (ডেলিভারি এলাকা নির্বাচন করুন) *</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setDeliveryArea('Inside Dhaka')}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryArea === 'Inside Dhaka'
                                                    ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-sm font-black   tracking-tight ${deliveryArea === 'Inside Dhaka' ? 'text-indigo-600' : 'text-gray-700'}`}>
                                                        Inside Dhaka
                                                    </span>
                                                    {deliveryArea === 'Inside Dhaka' && <span className="text-indigo-600 font-bold">✓</span>}
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-bold   tracking-widest">Charge: ৳80 (ঢাকা সিটির ভেতরে)</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeliveryArea('Outside Dhaka')}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryArea === 'Outside Dhaka'
                                                    ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-sm font-black   tracking-tight ${deliveryArea === 'Outside Dhaka' ? 'text-indigo-600' : 'text-gray-700'}`}>
                                                        Outside Dhaka
                                                    </span>
                                                    {deliveryArea === 'Outside Dhaka' && <span className="text-indigo-600 font-bold">✓</span>}
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-bold   tracking-widest">Charge: ৳170 (ঢাকার বাইরে)</p>
                                            </button>
                                        </div>
                                        {fieldErrors.deliveryArea && (
                                            <p className="mt-2 text-xs text-red-500 font-bold">{fieldErrors.deliveryArea}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">Primary Phone</label>
                                        <Input
                                            required
                                            type="tel"
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                            className={`rounded-xl border ${fieldErrors['shippingAddress.phone'] ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-600 focus:ring-0`}
                                            placeholder="017XXXXXXXX"
                                        />
                                        {fieldErrors['shippingAddress.phone'] && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors['shippingAddress.phone']}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400   tracking-widest mb-2">Secondary Phone</label>
                                        <Input
                                            type="tel"
                                            value={shippingAddress.secondaryPhone}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, secondaryPhone: e.target.value })}
                                            className={`rounded-xl border ${fieldErrors['shippingAddress.secondaryPhone'] ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-600 focus:ring-0`}
                                            placeholder="018XXXXXXXX"
                                        />
                                        {fieldErrors['shippingAddress.secondaryPhone'] && (
                                            <p className="mt-1 text-xs text-red-500">{fieldErrors['shippingAddress.secondaryPhone']}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 ring-1 ring-indigo-50 transition-all hover:shadow-md">
                                    <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                                        <span className="h-6 w-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs">2</span>
                                        Advance Payment (100 BDT)
                                    </h2>
                                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row gap-6 items-center">
                                        <div className="flex-1">
                                            <p className="text-indigo-900 font-bold text-sm mb-2">📲 পেমেন্ট নাম্বার (অ্যাডভান্স):</p>
                                            <p className="text-xl font-black text-indigo-700 tracking-tighter">01620-919681</p>
                                            <p className="text-xs text-gray-500 font-medium mt-2   tracking-wider">বিকাশ / নগদ / রকেট (Send Money)</p>
                                        </div>
                                        <div className="w-full md:w-64">
                                            <label className="block text-xs font-black text-indigo-600   tracking-widest mb-1">Enter TrxID here</label>
                                            <p className="text-[10px] text-indigo-400 font-bold mb-2   tracking-tight">মেসেজে আসা TrxID নাম্বারটি দিন</p>
                                            <Input
                                                required
                                                value={trxId}
                                                onChange={(e) => setTrxId(e.target.value)}
                                                className="rounded-xl border-indigo-300 uppercase focus:border-indigo-600 focus:ring-0 font-mono text-center   py-4 shadow-sm"
                                                placeholder="Transaction ID"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex gap-3 items-start text-xs text-gray-400 font-medium leading-relaxed">
                                <svg className="h-5 w-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>Your order will remain in "PENDING" status until our team verifies the Transaction ID. Verification usually takes 1-2 hours.</p>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-600 font-bold mb-3 flex items-center gap-2">
                                    <span className="text-lg">📞</span> যোগাযোগ: 01620-919681
                                </p>
                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                    অর্ডার করতে কোনো অসুবিধা হলে দয়া করে এই নাম্বারে <span className="font-bold text-indigo-600 underline"> <Link href="https://wa.me/8801832087091?text=Hello%20I%20want%20to%20know%20more" target="_blank">
                                        +880 1832-087091
                                    </Link> </span> হোয়াটসঅ্যাপ করুন। আমাদের টিম দ্রুত আপনার সহায়তা করবে।
                                </p>
                            </div>
                        </div>



                        <div className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200 border-dashed">
                            <h3 className="text-sm font-bold text-gray-700 mb-2">🚚 ডেলিভারি টাইম: ২-৩ দিন ⏳</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                Our team will call you for final confirmation before dispatching your parcel.
                            </p>
                        </div>
                    </div>



                    <div className="mt-10 lg:mt-0 lg:col-span-5">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-8 overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-indigo-50 rounded-full opacity-50"></div>
                            <h2 className="text-xl font-bold text-gray-700 mb-6 relative">Order Summary</h2>
                            <div className="flow-root relative">
                                <ul className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={item._id} className="py-4 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                                                    {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <div className="h-6 w-6 text-gray-300">📦</div>}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h3 className="text-sm font-bold text-gray-700   group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                                    <p className="text-xs text-gray-500 font-medium">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-gray-700 whitespace-nowrap">৳{item.price * item.quantity}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
                                <div className="flex justify-between text-sm text-gray-500 font-medium   tracking-tighter">
                                    <p>Subtotal</p>
                                    <p>৳{total()}</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium   tracking-tighter">
                                    <p>Delivery Fee</p>
                                    <p className="text-gray-700 font-bold">{deliveryArea ? `৳${deliveryCharge}` : 'Select Area'}</p>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-100">
                                    <p className="text-lg font-black text-gray-700  ">Total Payable</p>
                                    <p className="text-xl font-black text-indigo-600">৳{total() + deliveryCharge}</p>
                                </div>
                            </div>

                            <Button
                                form="checkout-form"
                                type="submit"
                                disabled={loading || !deliveryArea}
                                className={`w-full mt-8 py-7 rounded-2xl text-white font-black   tracking-widest transition-all shadow-lg ${!deliveryArea
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-indigo-100'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full"></div>
                                        Processing Order...
                                    </div>
                                ) : (
                                    !deliveryArea ? 'Select Delivery Area' : 'Complete Order')
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
