'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/shared';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

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
    const [uploadError, setUploadError] = useState<string | null>(null);
    const inputId = useId();



    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            const file = files[0];
            const MAX_FILE_SIZE = 800 * 1024; // 800KB
            
            if (file.size > MAX_FILE_SIZE) {
                setUploadError('File size exceeds 800KB limit. Please choose a smaller image.');
                return;
            }

            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Upload failed');
            }

            const data = await res.json();
            onChange([...value, data.url]);
        } catch (error) {
            console.error('Upload error', error);
            setUploadError(error instanceof Error ? error.message : 'Something went wrong with the upload. Please try again or use a different image.');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(value.filter((current) => current !== url));
    };


    return (
        <>
            <Modal
                isOpen={!!uploadError}
                onClose={() => setUploadError(null)}
                title="Upload Failed"
                variant="error"
                message={uploadError || 'Something went wrong with the upload. Please try again or use a different image.'}
                actions={[{ label: 'OK', onClick: () => setUploadError(null), variant: 'ghost' }]}
            />
            <div>
                <div className="mb-4 flex items-center gap-4">
                    {value.map((url) => (
                        <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                            <div className="z-10 absolute top-2 right-2">
                                <Button type="button" onClick={(e) => onDelete(e, url)} variant="destructive" size="sm">
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
                        onClick={() => document.getElementById(inputId)?.click()}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <ImageIcon className="h-4 w-4 mr-2" />
                        )}
                        Upload an Image
                    </Button>
                    <input
                        id={inputId}
                        type="file"
                        disabled={loading}
                        onChange={onUpload}
                        accept="image/*"
                        className="hidden"
                    />

                </div>
            </div>
        </>
    );
}
