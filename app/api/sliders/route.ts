import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sliders = await prisma.slider.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(sliders);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        if (!data.image) {
            return NextResponse.json({ error: "Gambar slider wajib diisi" }, { status: 400 });
        }

        const slider = await prisma.slider.create({
            data: {
                image: data.image,
                title: data.title || null,
                subtitle: data.subtitle || null,
                link: data.link || null,
                order: parseInt(data.order) || 0,
                active: data.active ?? true,
            },
        });

        return NextResponse.json(slider, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
