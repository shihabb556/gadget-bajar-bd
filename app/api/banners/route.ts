import { NextResponse } from 'next/server';
import { Banner } from '@/models/schema';
import dbConnect from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();
        const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching banners' }, { status: 500 });
    }
}
