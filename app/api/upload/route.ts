import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // @ts-ignore
        const bytes: ArrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        // @ts-ignore
        const filename = `${timestamp}-${file.name}`;
        const uploadDir = join(process.cwd(), 'public/uploads');

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Directory already exists
        }

        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        const imageUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}