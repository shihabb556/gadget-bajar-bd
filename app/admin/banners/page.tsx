'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui/shared';
import ImageUpload from '@/components/ui/ImageUpload';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Trash2, Eye, EyeOff } from 'lucide-react';

interface IBanner {
    _id: string;
    image: string;
    title?: string;
    link?: string;
    isActive: boolean;
    order: number;
}

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // New banner form state
    const [imageUrl, setImageUrl] = useState<string[]>([]);
    const [title, setTitle] = useState('');

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/admin/banners');
            if (res.ok) {
                const data = await res.json();
                setBanners(data);
            }
        } catch (error) {
            toast.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleAddBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageUrl.length === 0) {
            toast.error('Please upload an image');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageUrl[0],
                    title,
                    order: banners.length
                }),
            });

            if (res.ok) {
                toast.success('Banner added successfully');
                setImageUrl([]);
                setTitle('');
                fetchBanners();
            } else {
                toast.error('Failed to add banner');
            }
        } catch (error) {
            toast.error('Error adding banner');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/banners', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus }),
            });

            if (res.ok) {
                toast.success('Status updated');
                fetchBanners();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteBanner = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            const res = await fetch(`/api/admin/banners?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Banner deleted');
                fetchBanners();
            }
        } catch (error) {
            toast.error('Failed to delete banner');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manage Banners</h1>
            </div>

            {/* Add New Banner Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Add New Banner</h2>
                <form onSubmit={handleAddBanner} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Banner Title (Optional)</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Summer Sale 2024"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Banner Image</label>
                        <ImageUpload
                            value={imageUrl}
                            onChange={(urls) => setImageUrl(urls)}
                        />
                        <p className="text-xs text-gray-500">Recommended size: 1200x400 or similar aspect ratio</p>
                    </div>

                    <Button type="submit" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Banner'}
                    </Button>
                </form>
            </div>

            {/* Banner List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <h2 className="text-lg font-semibold p-4 border-b border-gray-200 text-gray-700">Active Banners</h2>
                <div className="divide-y divide-gray-200">
                    {banners.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No banners found. Add one above.</div>
                    ) : (
                        banners.map((banner) => (
                            <div key={banner._id} className="p-4 flex items-center gap-4">
                                <div className="relative w-32 h-16 rounded overflow-hidden flex-shrink-0 border bg-gray-50">
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800">{banner.title || 'Untitled Banner'}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleStatus(banner._id, banner.isActive)}
                                        title={banner.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {banner.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteBanner(banner._id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
