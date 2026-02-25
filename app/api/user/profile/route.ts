import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models/schema';
import dbConnect from '@/lib/db';
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(2, 'First name is too short').max(60).trim(),
    lastName: z.string().max(60).trim().optional(),
    primaryPhone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid phone number format').optional(),
    secondaryPhone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid secondary phone number format').optional().or(z.literal('')),
    village: z.string().max(200).trim().optional(),
    thana: z.string().max(100).trim().optional(),
    district: z.string().max(100).trim().optional(),
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select('-password');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = profileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const data = result.data;

        await dbConnect();
        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: data },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
    }
}
