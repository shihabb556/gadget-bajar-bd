import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Logo } from '@/models/schema';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { url } = body;
        console.log('Update Logo request:', { url });
        await dbConnect();

        console.log('Using DB URI:', process.env.MONGODB_URI?.substring(0, 15) + '...');

        await Logo.deleteMany({});
        let logo = null;
        if (url) {
            try {
                logo = await Logo.create({ url });
                console.log('Logo created:', logo);
            } catch (err) {
                console.error('Create error:', err);
            }
        }

        console.log('Logo persisted:', logo);
        return NextResponse.json(logo);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating logo' }, { status: 500 });
    }
}
