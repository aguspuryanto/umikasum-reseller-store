import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";

type OrderItemInput = {
    productId: string;
    quantity: number;
};

type OrderRequestBody = {
    customerName?: string;
    customerPhone?: string;
    address?: string;
    note?: string;
    items?: OrderItemInput[];
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: { select: { name: true, category: true, image: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(orders);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body: OrderRequestBody = await request.json();
        const { customerName, customerPhone, address, note, items } = body;

        if (!customerName || !customerPhone) {
            return NextResponse.json({ error: "Nama dan nomor HP wajib diisi" }, { status: 400 });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
        }

        const productIds = items.map(item => item.productId);
        const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

        if (products.length !== new Set(productIds).size) {
            return NextResponse.json({ error: "Beberapa produk tidak ditemukan" }, { status: 400 });
        }

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product || (product.stock ?? 0) < item.quantity) {
                return NextResponse.json(
                    { error: `Stok ${product?.name ?? "produk"} tidak mencukupi` },
                    { status: 400 }
                );
            }
        }

        const total = items.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId)!;
            return sum + product.sellPrice * item.quantity;
        }, 0);

        const orderNumber = `ORD-${Date.now()}`;
        const userId = products[0].userId;

        const order = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    total,
                    customerName,
                    customerPhone,
                    address: address || null,
                    note: note || null,
                    items: {
                        create: items.map(item => {
                            const product = products.find(p => p.id === item.productId)!;
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                price: product.sellPrice,
                            };
                        }),
                    },
                },
                include: { items: true },
            });

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return createdOrder;
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
