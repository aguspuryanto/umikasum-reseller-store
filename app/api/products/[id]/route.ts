import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id }
        });
        return NextResponse.json(product);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...data,
                sellPrice: parseFloat(data.sellPrice),
                buyPrice: parseFloat(data.buyPrice),
            }
        });

        return NextResponse.json(product);
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
        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
