'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/shared';

function ProfileContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const orderSuccess = searchParams.get('orderSuccess');
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState({
        name: '',
        lastName: '',
        email: '',
        primaryPhone: '',
        secondaryPhone: '',
        village: '',
        thana: '',
        district: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'

    useEffect(() => {
        if (session) {
            fetchOrders();
            fetchProfile();
        }
    }, [session]);

    const fetchOrders = async () => {
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

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile({
                    name: data.name || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    primaryPhone: data.primaryPhone || '',
                    secondaryPhone: data.secondaryPhone || '',
                    village: data.village || '',
                    thana: data.thana || '',
                    district: data.district || ''
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });
            if (res.ok) {
                import('react-hot-toast').then(({ toast }) => toast.success('Profile updated successfully'));
            } else {
                import('react-hot-toast').then(({ toast }) => toast.error('Failed to update profile'));
            }
        } catch (error) {
            import('react-hot-toast').then(({ toast }) => toast.error('Error updating profile'));
        } finally {
            setSaving(false);
        }
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {orderSuccess && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700 font-medium">
                                    Order placed successfully! We will contact you soon for confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Center</h1>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 mt-4 md:mt-0 gap-1">
                        <Button
                            variant={activeTab === 'orders' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('orders')}
                            size="sm"
                            className="rounded-lg transition-all"
                        >
                            Order History
                        </Button>
                        <Button
                            variant={activeTab === 'profile' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('profile')}
                            size="sm"
                            className="rounded-lg transition-all"
                        >
                            Profile Details
                        </Button>
                    </div>
                </div>

                {activeTab === 'orders' ? (
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-4 text-gray-500 font-medium">Loading your orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="bg-indigo-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-gray-900 font-bold text-xl">No orders yet</p>
                                <p className="mt-2 text-gray-500">When you purchase items, they will appear here.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = '/'}
                                    className="mt-6"
                                >
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            orders.map((order: any) => (
                                <div key={order._id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden rounded-2xl border border-gray-100 mb-6">
                                    <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold text-gray-900 uppercase">
                                                    Order #{order._id.slice(-6)}
                                                </h3>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500 font-medium italic">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-indigo-600">৳{order.totalAmount}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">Total Amount</p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-6 lg:flex lg:gap-12">
                                        <div className="flex-1">
                                            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Ordered Items</h4>
                                            <ul className="space-y-4">
                                                {order.items.map((item: any) => (
                                                    <li key={item._id} className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                                                                {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <div className="h-6 w-6 text-gray-300">📦</div>}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase">{item.name}</p>
                                                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-black text-gray-900">৳{item.price * item.quantity}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-8 lg:mt-0 lg:w-72 bg-gray-50 p-5 rounded-2xl border border-dashed border-gray-200">
                                            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Verification Info</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Advance Status</p>
                                                    <p className={`text-sm font-bold mt-1 ${order.paymentStatus.advancePaid ? 'text-green-600' : 'text-amber-600 animate-pulse'}`}>
                                                        {order.paymentStatus.advancePaid ? '✅ VERIFIED' : '⏳ PENDING'}
                                                    </p>
                                                </div>
                                                {order.paymentStatus.trxId && (
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-bold uppercase">Transaction ID</p>
                                                        <p className="text-sm font-mono font-bold bg-white px-2 py-1 rounded inline-block mt-1 border border-gray-200">
                                                            {order.paymentStatus.trxId}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-8 md:px-10">
                            <form onSubmit={handleProfileUpdate} className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4 border-gray-100">Personal Information</h3>
                                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">First Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                readOnly
                                                value={profile.email}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                                            />
                                            <p className="mt-2 text-xs text-gray-400">Email cannot be changed.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4 border-gray-100">Contact & Address</h3>
                                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Primary Phone</label>
                                            <input
                                                type="tel"
                                                placeholder="017XXXXXXXX"
                                                value={profile.primaryPhone}
                                                onChange={(e) => setProfile({ ...profile, primaryPhone: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Secondary Phone (Optional)</label>
                                            <input
                                                type="tel"
                                                placeholder="018XXXXXXXX"
                                                value={profile.secondaryPhone}
                                                onChange={(e) => setProfile({ ...profile, secondaryPhone: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Village / Ward / Road</label>
                                            <input
                                                type="text"
                                                placeholder="House 12, Road 5, Block B"
                                                value={profile.village}
                                                onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Thana / Sub-district</label>
                                            <input
                                                type="text"
                                                value={profile.thana}
                                                onChange={(e) => setProfile({ ...profile, thana: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">District</label>
                                            <input
                                                type="text"
                                                value={profile.district}
                                                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="gap-2 px-8 py-3 rounded-xl shadow-lg shadow-indigo-100"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full"></div>
                                                Saving Changes...
                                            </>
                                        ) : 'Update Account'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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
