import prisma from '@/lib/prisma';
import OrdersTable from '@/components/dashboard/OrdersTable';

async function getOrders() {
    try {
        return await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    } catch {
        return [];
    }
}

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div>
            <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#14161f', marginBottom: '4px' }}>
                    Pesanan
                </h1>
                <p style={{ color: '#5b6072', fontSize: '0.875rem' }}>
                    {orders.length} pesanan diterima
                </p>
            </div>

            <OrdersTable orders={orders} />
        </div>
    );
}
