import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const blob = await put(`umikasum/${Date.now()}-${file.name}`, file, {
            access: 'public',
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}