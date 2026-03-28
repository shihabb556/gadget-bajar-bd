import { NextResponse } from 'next/server';
import { Logo } from '@/models/schema';
import dbConnect from '@/lib/db';

export const revalidate = 0;

export async function GET() {
    try {
        await dbConnect();
        const logo = await Logo.findOne().sort({ createdAt: -1 });
        return NextResponse.json(logo);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching logo' }, { status: 500 });
    }
}
