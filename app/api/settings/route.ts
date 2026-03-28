import { NextResponse } from 'next/server';
import { Settings } from '@/models/schema';
import dbConnect from '@/lib/db';

export const revalidate = 0;

export async function GET() {
    try {
        await dbConnect();
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ advanceOption: 'Unpaid' });
        }
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
    }
}
