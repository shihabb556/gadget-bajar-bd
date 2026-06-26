'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/shared';
import { toast } from 'react-hot-toast';
import ImageUpload from '@/components/ui/ImageUpload';

export default function AdminSettingsPage() {
    const [advanceOption, setAdvanceOption] = useState('Unpaid');
    const [logo, setLogo] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setAdvanceOption(data.advanceOption);
                }
            } catch (error) {
                console.error('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };

        const fetchLogo = async () => {
            try {
                const res = await fetch('/api/logo', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.url) {
                        setLogo(data.url);
                    } else {
                        setLogo('');
                    }

                }
            } catch (error) {
                console.error('Failed to fetch logo');
            }
        };

        fetchSettings();
        fetchLogo();
    }, []);


    const handleSave = async () => {
        setSaving(true);
        try {
            // Save Settings
            const settingsRes = await fetch('/api/admin/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ advanceOption }),
            });

            if (settingsRes.ok) {
                toast.success('Settings updated successfully');
            } else {
                toast.error('Failed to update settings');
            }

        } catch (error) {
            toast.error('Error updating settings');
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-xl font-bold text-gray-700">General Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Configure global application settings and options.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-700">Website Logo</h3>
                    <div className="mt-2 text-sm text-gray-500">
                        <p>This logo will appear in the website header and other relevant places.</p>
                    </div>
                    <div className="mt-5 max-w-sm">
                        <ImageUpload
                            value={logo ? [logo] : []}
                            onChange={async (urls) => {
                                const newLogo = urls[urls.length - 1] || '';
                                setLogo(newLogo);
                                try {
                                    const res = await fetch('/api/admin/logo', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ url: newLogo }),
                                    });
                                    if (res.ok) {
                                        toast.success(newLogo ? 'Logo updated successfully' : 'Logo deleted successfully');
                                    } else {
                                        toast.error('Failed to update logo');
                                    }
                                } catch (error) {
                                    toast.error('Error updating logo');
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-700">Advance Payment Option</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>
                            When set to <strong>"Paid"</strong>, customers will be required to pay 100 Taka advance
                            and provide a Transaction ID (TrxID) during checkout.
                        </p>
                    </div>
                    <div className="mt-5">
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-indigo-600"
                                    name="advanceOption"
                                    value="Unpaid"
                                    checked={advanceOption === 'Unpaid'}
                                    onChange={(e) => setAdvanceOption(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">Unpaid (COD only)</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-indigo-600"
                                    name="advanceOption"
                                    value="Paid"
                                    checked={advanceOption === 'Paid'}
                                    onChange={(e) => setAdvanceOption(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">Paid (100 TK Advance)</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
