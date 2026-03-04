'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/shared';
import { CheckCircle, Download, Package, ArrowRight, Printer, Loader2, Clock, MapPin, CreditCard } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';

function OrderDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                toast.error('Order not found');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const downloadSummary = async () => {
        if (!summaryRef.current || downloading) return;

        setDownloading(true);
        const toastId = toast.loading('Preparing your receipt...');

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const element = summaryRef.current;
            const originalWidth = element.style.width;
            element.style.width = '800px';

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

            if (!dataUrl || dataUrl.length < 100) {
                throw new Error('Generated image is too small or invalid');
            }

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4'
            });

            // Explicitly handle coordinates and scaling
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`e-receipt-${orderId?.slice(-6).toUpperCase()}.pdf`);

            toast.success('Receipt downloaded successfully!', { id: toastId });
        } catch (err) {
            console.error('Download error:', err);
            toast.error('Download failed. Please use the Print button.', { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['PENDING', 'PROCESSING', 'DELIVERED'];
        const index = steps.indexOf(status);
        return index === -1 ? 1 : index + 1;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
                <p className="font-bold tracking-widest text-xs uppercase">Loading order details...</p>
            </div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                    <Package className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                <p className="text-gray-500 text-sm mb-6">We couldn't find an order with the ID you provided.</p>
                <Button onClick={() => router.push('/')} className="w-full h-12 rounded-2xl">Return to Home</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight italic">Order Details</h1>
                        <p className="text-gray-500 font-medium text-sm">#{orderId.toUpperCase()}</p>
                    </div>
                    <div className="flex gap-3">
                        {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadSummary}
                            disabled={downloading}
                            className="rounded-xl gap-2 font-black tracking-widest text-[10px] h-10 border-gray-200"
                        >
                            {downloading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                            DOWNLOAD RECEIPT
                        </Button> */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="rounded-xl gap-2 font-black tracking-widest text-[10px] h-10 border-gray-200"
                        >
                            <Printer className="h-3 w-3" /> PRINT PDF
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Status Tracking Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 scroll-mt-24" id="order-status">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                            <div>
                                <p className="text-xs font-black text-gray-400 tracking-widest mb-1 uppercase">Order Status</p>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full animate-pulse ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                    <h2 className="text-xl font-black text-gray-700 italic underline decoration-blue-500 decoration-4">
                                        {order.status}
                                    </h2>
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-xs font-black text-gray-400 tracking-widest mb-1 uppercase">Order Date</p>
                                <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                        </div>

                        <div className="relative pt-4 pb-8">
                            <div className="absolute top-[42px] left-0 w-full h-1 bg-gray-100 hidden md:block"></div>
                            <div
                                className="absolute top-[42px] left-0 h-1 bg-blue-600 transition-all duration-1000 hidden md:block"
                                style={{ width: `${((getStatusStep(order.status) - 1) / 2) * 100}%` }}
                            ></div>

                            <div className="relative flex flex-col md:flex-row justify-between gap-8">
                                {['PENDING', 'PROCESSING', 'DELIVERED'].map((step, idx) => {
                                    const currentStep = getStatusStep(order.status);
                                    const isActive = idx + 1 <= currentStep;
                                    const isLast = idx === 2;

                                    return (
                                        <div key={step} className="flex flex-row md:flex-col items-center gap-4 md:gap-4 flex-1">
                                            <div className={`
                                                h-12 w-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500
                                                ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-gray-100 text-gray-400'}
                                            `}>
                                                {idx === 0 && <Clock className="h-6 w-6" />}
                                                {idx === 1 && <Package className="h-6 w-6" />}
                                                {idx === 2 && <MapPin className="h-6 w-6" />}
                                            </div>
                                            <div className="text-left md:text-center mt-2">
                                                <p className={`text-xs font-black tracking-widest uppercase ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    {step}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-medium">
                                                    {idx === 0 && 'Awaiting Confirmation'}
                                                    {idx === 1 && 'Preparing your package'}
                                                    {idx === 2 && 'Handed Over Successfully'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-black text-gray-700 italic mb-6">Order Summary</h3>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                                                {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <Package className="p-3 text-gray-300" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-700 truncate">{item.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold">Qty: {item.quantity} × ৳{item.price}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-gray-700 whitespace-nowrap">৳{item.price * item.quantity}</p>
                                    </div>
                                ))}
                                <div className="pt-6 mt-2 space-y-2 border-t-2 border-dashed border-gray-100">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                        <p>Subtotal</p>
                                        <p>৳{order.totalAmount - (order.deliveryCharge || 0)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                        <p>Delivery Fee</p>
                                        <p>৳{order.deliveryCharge || 0}</p>
                                    </div>
                                    <div className="pt-2 flex justify-between items-center">
                                        <p className="text-sm font-black text-gray-700 tracking-widest uppercase">Total Paid</p>
                                        <p className="text-2xl font-black text-blue-600">৳{order.totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Payment Info */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-black text-gray-700 italic mb-6">Shipping & Payment</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 tracking-widest mb-1 uppercase">Delivery Address</p>
                                        <p className="text-sm font-bold text-gray-700 leading-snug">
                                            {order.shippingAddress?.guestName || order.guestName || 'Valued Customer'}<br />
                                            {order.shippingAddress?.village}, {order.shippingAddress?.thana}<br />
                                            {order.shippingAddress?.district}
                                        </p>
                                        <p className="text-xs font-bold text-gray-500 mt-1">{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${order.paymentStatus?.advancePaid ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 tracking-widest mb-1 uppercase">Payment Status</p>
                                        <p className={`text-sm font-bold ${order.paymentStatus?.advancePaid ? 'text-green-600' : 'text-amber-600'}`}>
                                            {order.paymentStatus?.advancePaid ? 'Advance Paid ✓' : 'Payment Awaiting Confirmation'}
                                        </p>
                                        {order.paymentStatus?.trxId && (
                                            <div className="mt-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block font-mono text-[10px] font-bold text-gray-600">
                                                TRX: {order.paymentStatus.trxId}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mt-4">
                                    <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                                        Our verify team will review your order details within 2-4 business hours. If you need any help, call our support at <span className="underline">01620-919681</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="gap-2 font-bold text-gray-500 hover:text-indigo-600 rounded-xl transition-all h-12"
                    >
                        Continue Shopping <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/track-order')}
                        className="gap-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all h-12"
                    >
                        Track Another Order
                    </Button>
                </div>

                {/* Hidden Receipt for Generation - Positioned off-screen instead of hidden to allow capture */}
                <div className="absolute left-[-9999px] top-0 pointer-events-none">
                    <div ref={summaryRef} className="bg-white p-12 rounded-[3rem] w-[800px] text-left relative">
                        {/* Watermark/Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        {/* Receipt Header */}
                        <div className="flex justify-between items-start border-b-4 border-blue-600 pb-8">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black text-blue-600 italic tracking-tighter leading-none uppercase">
                                    HASIB-ECOM
                                </h1>
                                <div className="inline-block bg-blue-600 px-3 py-1 rounded-full">
                                    <p className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Official Order Summary</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs font-black text-gray-300 tracking-widest uppercase mb-1">Order Identifier</p>
                                <p className="text-xl font-mono font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 italic">
                                    #{orderId.toUpperCase()}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold mt-2">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 my-12 pt-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-300 tracking-[0.2em] mb-4 uppercase">BILL TO / SHIP TO</p>
                                <p className="text-lg font-black text-gray-700">{order.shippingAddress?.guestName || order.guestName || 'Valued Customer'}</p>
                                <p className="text-sm font-bold mt-2 text-gray-600">{order.shippingAddress?.village}, {order.shippingAddress?.thana}</p>
                                <p className="text-sm font-black text-blue-600 mt-1">{order.shippingAddress?.district}</p>
                                <p className="text-xs font-bold text-gray-400 mt-2">Phone: {order.shippingAddress?.phone}</p>
                            </div>
                            <div className="text-right flex flex-col justify-end">
                                <p className="text-[10px] font-black text-gray-300 tracking-[0.2em] mb-4 uppercase">PAYMENT DETAILS</p>
                                <p className="text-sm font-bold text-gray-600">Method: Advance Payment</p>
                                <p className={`text-sm font-black mt-1 ${order.paymentStatus?.advancePaid ? 'text-green-600' : 'text-amber-600'}`}>
                                    {order.paymentStatus?.advancePaid ? 'STATUS: PAID' : 'STATUS: PENDING VERIFICATION'}
                                </p>
                                {order.paymentStatus?.trxId && <p className="text-xs font-mono font-bold text-gray-400 mt-1">TrxID: {order.paymentStatus.trxId}</p>}
                            </div>
                        </div>

                        <div className="mb-12 border rounded-[2rem] border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-b border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Description</p>
                                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Subtotal</p>
                            </div>
                            <div className="p-8 space-y-6">
                                {order.items.map((item: any) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-black text-gray-700 tracking-tight">{item.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">Quantity: {item.quantity} × ৳{item.price}</p>
                                        </div>
                                        <p className="text-md font-black text-gray-700 italic">৳{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total Footer */}
                        <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black tracking-[0.3em] opacity-80 uppercase">Total Transaction Amount</p>
                                <p className="text-2xl font-black italic tracking-tighter">ORDER STATUS: {order.status}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black italic tracking-tighter">৳{order.totalAmount}</p>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-dashed border-gray-100 flex flex-col items-center">
                            <CheckCircle className="h-8 w-8 text-blue-100 mb-4" />
                            <p className="text-[11px] text-gray-400 font-black tracking-[0.3em] uppercase mb-2">
                                Thank you for choosing Hasib-Ecom
                            </p>
                            <p className="text-[9px] text-gray-300 font-bold italic">
                                For support, contact us at help@hasib-ecom.com or WhatsApp +880 1620-919681
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function OrderDetailsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
                    <p className="font-bold tracking-widest text-xs uppercase">Loading Secure Connection...</p>
                </div>
            </div>
        }>
            <OrderDetailsContent />
        </Suspense>
    );
}
