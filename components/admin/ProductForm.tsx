'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui/shared';
import ImageUpload from '@/components/ui/ImageUpload';
import RichTextEditor from '@/components/ui/RichTextEditor';
import Modal from '@/components/ui/Modal';

interface ProductFormProps {
    initialData?: any;
}

interface Category {
    _id: string;
    name: string;
    parent?: { _id: string } | null;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        discountPrice: initialData?.discountPrice || '',
        stock: initialData?.stock || '',
        category: initialData?.category || '',
        subCategory: initialData?.subCategory || '',
        images: initialData?.images || [], // Now array
        colors: initialData?.colors || [],
        isActive: initialData?.isActive ?? true,
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Field length limits
    const MAX_NAME_LENGTH = 150;
    const MAX_DESCRIPTION_LENGTH = 5000;
    const MAX_COLOR_NAME_LENGTH = 50;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    // Derived state for dropdowns
    const topLevelCategories = categories.filter(c => !c.parent);

    // Find the currently selected category object to get its ID
    const selectedCategoryObj = categories.find(c => c.name === formData.category && !c.parent);

    // Filter subcategories based on selected parent ID
    const availableSubCategories = selectedCategoryObj
        ? categories.filter(c => c.parent && c.parent._id === selectedCategoryObj._id)
        : [];

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w-]+/g, '')  // Remove all non-word chars
            .replace(/--+/g, '-');    // Replace multiple - with single -
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = slugify(name);
        setFormData({ ...formData, name, slug });
    };

    const validateForm = (): string | null => {
        if (formData.name.length > MAX_NAME_LENGTH) {
            return `Product name cannot exceed ${MAX_NAME_LENGTH} characters. Current: ${formData.name.length}`;
        }

        if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
            return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters. Current: ${formData.description.length}`;
        }

        for (let i = 0; i < formData.colors.length; i++) {
            if (formData.colors[i].name.length > MAX_COLOR_NAME_LENGTH) {
                return `Color name (${formData.colors[i].name}) cannot exceed ${MAX_COLOR_NAME_LENGTH} characters. Current: ${formData.colors[i].name.length}`;
            }
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            setErrorModal(true);
            return;
        }

        setLoading(true);

        try {
            const url = initialData
                ? `/api/admin/products/${initialData._id}`
                : '/api/admin/products';

            const method = initialData ? 'PUT' : 'POST';

            const submissionData = {
                ...formData,
                price: Number(formData.price),
                discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
                stock: Number(formData.stock)
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (!res.ok) throw new Error('Failed to save product');

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error(error);
            setErrorMessage('There was an error saving the product. Please check your inputs and try again.');
            setErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                isOpen={errorModal}
                onClose={() => setErrorModal(false)}
                title="Save Failed"
                variant="error"
                message={errorMessage || 'There was an error saving the product. Please check your inputs and try again.'}
                actions={[{ label: 'OK', onClick: () => setErrorModal(false), variant: 'ghost' }]}
            />
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={handleNameChange}
                            className="mt-1 text-gray-700"
                            maxLength={MAX_NAME_LENGTH}
                        />
                        <p className={`text-xs mt-1 ${formData.name.length > MAX_NAME_LENGTH * 0.9 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                            {formData.name.length}/{MAX_NAME_LENGTH} characters
                        </p>
                    </div>

                    <div className="opacity-50 pointer-events-none">
                        <label className="block text-sm font-medium text-gray-700">Slug (Auto-generated)</label>
                        <Input
                            disabled
                            value={formData.slug}
                            className="mt-1 bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}
                            className="mt-1 text-gray-700 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Select Category</option>
                            {topLevelCategories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                        <select
                            value={formData.subCategory}
                            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                            className="mt-1 text-gray-700 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            disabled={!formData.category || availableSubCategories.length === 0}
                        >
                            <option value="">Select Sub Category</option>
                            {availableSubCategories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (BDT)</label>
                        <Input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Price (BDT) - Optional</label>
                        <Input
                            type="number"
                            value={formData.discountPrice}
                            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                            className="mt-1"
                            placeholder="Leave empty for no discount"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <Input
                            type="number"
                            required
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Colors & Images</label>
                        <div className="space-y-4">
                            {formData.colors.map((color: any, index: number) => (
                                <div key={index} className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Color Name (e.g. Red, Blue)"
                                                value={color.name}
                                                onChange={(e) => {
                                                    const newColors = [...formData.colors];
                                                    newColors[index].name = e.target.value;
                                                    setFormData({ ...formData, colors: newColors });
                                                }}
                                                className="bg-white"
                                                maxLength={MAX_COLOR_NAME_LENGTH}
                                            />
                                            <p className={`text-xs mt-1 ${color.name.length > MAX_COLOR_NAME_LENGTH * 0.9 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                                {color.name.length}/{MAX_COLOR_NAME_LENGTH} characters
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                const newColors = formData.colors.filter((_: any, i: number) => i !== index);
                                                setFormData({ ...formData, colors: newColors });
                                            }}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">Color-specific Image (This will show up when color is selected)</p>
                                        <ImageUpload
                                            value={color.image ? [color.image] : []}
                                            onChange={(urls) => {
                                                const newColors = [...formData.colors];
                                                newColors[index].image = urls[0] || '';
                                                setFormData({ ...formData, colors: newColors });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormData({
                                    ...formData,
                                    colors: [...formData.colors, { name: '', image: '' }]
                                })}
                                className="w-full border-dashed border-2 hover:border-indigo-600 hover:text-indigo-600 transition-all py-6"
                            >
                                + Add Color Variation
                            </Button>
                            <p className="text-xs text-gray-500">Click to add colors and associate them with a specific image.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <RichTextEditor
                        value={formData.description}
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        placeholder="Enter product description..."
                    />
                    <p className={`text-xs mt-1 ${formData.description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                        {formData.description.length}/{MAX_DESCRIPTION_LENGTH} characters
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <ImageUpload
                        value={formData.images}
                        onChange={(urls) => setFormData({ ...formData, images: urls })}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        id="isActive"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active (Visible to customers)
                    </label>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Product'}
                    </Button>
                </div>
            </form>
        </>
    );
}
