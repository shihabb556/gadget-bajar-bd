import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Track Order',
    description: 'Track your HealthPortall order status in real-time. Enter your Order ID to get started.',
};

export default function TrackOrderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
