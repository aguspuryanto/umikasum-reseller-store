import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const slider = await prisma.slider.update({
            where: { id },
            data: {
                image: data.image,
                title: data.title || null,
                subtitle: data.subtitle || null,
                link: data.link || null,
                order: parseInt(data.order) || 0,
                active: data.active ?? true,
            },
        });

        return NextResponse.json(slider);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await prisma.slider.delete({ where: { id } });

        return NextResponse.json({ message: "Slider deleted" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
