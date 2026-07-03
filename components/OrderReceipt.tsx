'use client';

import { useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Package } from 'lucide-react';

interface OrderReceiptProps {
    order: any;
    onComplete: () => void;
}

export default function OrderReceipt({ order, onComplete }: OrderReceiptProps) {
    const summaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!order) return;

        const generatePDF = async () => {
            const { toast } = await import('react-hot-toast');
            const toastId = toast.loading('Preparing your receipt...');

            try {
                // Wait for the state update and initial render
                await new Promise(resolve => setTimeout(resolve, 600));

                if (!summaryRef.current) {
                    throw new Error('Failed to initialize download template.');
                }

                const element = summaryRef.current;
                const originalWidth = element.style.width;
                element.style.width = '800px';

                // Use toPng with more robust options
                const dataUrl = await htmlToImage.toPng(element, {
                    backgroundColor: '#ffffff',
                    quality: 1,
                    pixelRatio: 2,
                    cacheBust: true,
                    skipFonts: true,
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left',
                        width: '800px'
                    }
                });

                element.style.width = originalWidth;

                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'px',
                    format: 'a4'
                });

                const imgProps = pdf.getImageProperties(dataUrl);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`e-receipt-${order._id.slice(-6).toUpperCase()}.pdf`);

                toast.success('Receipt downloaded successfully!', { id: toastId });
            } catch (err: any) {
                console.error('Download error:', err);
                toast.error(`Download failed: ${err.message || 'Unknown error'}`, { id: toastId });
            } finally {
                onComplete();
            }
        };

        generatePDF();
    }, [order, onComplete]);

    if (!order) return null;

    return (
        <div className="absolute left-[-9999px] top-0 pointer-events-none">
            <div
                ref={summaryRef}
                className="bg-white p-10 w-[800px] border border-gray-100"
            >
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-xl font-black text-blue-600 italic">GadgetBazarBd</h2>
                        <p className="text-xs font-bold text-gray-400 tracking-widest mt-1">Official Order Summary</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-gray-700">Order ID</p>
                        <p className="text-sm font-mono font-medium text-gray-500">#{order._id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-dashed border-gray-100">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 tracking-widest mb-2">Customer Info</p>
                        <p className="text-sm font-bold text-gray-700">{order.user?.name || order.guestName || 'Valued Customer'}</p>
                        <p className="text-xs text-gray-500 font-medium">{order.user?.email || order.guestEmail || 'customer@example.com'}</p>
                        <p className="text-xs text-gray-500 font-medium">{order.shippingAddress?.phone}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 tracking-widest mb-2">Shipping Address</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {order.shippingAddress?.village}, {order.shippingAddress?.thana}<br />
                            {order.shippingAddress?.district}
                        </p>
                    </div>
                </div>

                <div className="mb-10">
                    <p className="text-[10px] font-black text-gray-400 tracking-widest mb-4">Items Ordered</p>
                    <div className="space-y-4">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-black text-gray-700">{item.name?.slice(0, 50)}...</p>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1">Qty: {item.quantity} × ৳{item.price}</p>
                                </div>
                                <p className="text-sm font-black text-gray-700">৳{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {order.deliveryCharge > 0 && (
                    <div className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 tracking-widest">Delivery Fee ({order.deliveryArea})</p>
                        <p className="text-sm font-black text-gray-700">৳{order.deliveryCharge}</p>
                    </div>
                )}

                <div className="bg-blue-600 p-8 rounded-3xl text-white flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold opacity-80 mb-1">Total Payable</p>
                        <p className="text-sm font-medium opacity-60">Status: {order.status}</p>
                    </div>
                    <p className="text-xl font-black italic">৳{order.totalAmount}</p>
                </div>
            </div>
        </div>
    );
}
