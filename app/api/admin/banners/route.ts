import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Banner } from '@/models/schema';
import dbConnect from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();
        const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching banners' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const banner = await Banner.create(data);
        return NextResponse.json(banner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating banner' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, ...updateData } = await req.json();
        await dbConnect();

        const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
        if (!banner) {
            return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
        }

        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating banner' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Banner ID is required' }, { status: 400 });
        }

        await dbConnect();
        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting banner' }, { status: 500 });
    }
}
