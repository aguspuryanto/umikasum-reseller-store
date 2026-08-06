import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

const ALLOWED_STATUSES = ["pending", "processing", "completed", "cancelled"];

export async function PATCH(request: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

        if (!ALLOWED_STATUSES.includes(status)) {
            return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
