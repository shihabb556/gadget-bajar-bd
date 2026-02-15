'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/shared';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

export default function ImageUpload({
    value,
    onChange,
    disabled
}: ImageUploadProps) {
    const [loading, setLoading] = useState(false);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setLoading(true);
            const file = files[0];
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const data = await res.json();
            onChange([...value, data.url]);
        } catch (error) {
            console.error('Upload error', error);
            alert('Something went wrong with the upload');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = (url: string) => {
        onChange(value.filter((current) => current !== url));
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onDelete(url)} variant="destructive" size="sm">
                                X
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || loading}
                    onClick={() => document.getElementById('image-upload')?.click()}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <ImageIcon className="h-4 w-4 mr-2" />
                    )}
                    Upload an Image
                </Button>
                <input
                    id="image-upload"
                    type="file"
                    disabled={loading}
                    onChange={onUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
}
