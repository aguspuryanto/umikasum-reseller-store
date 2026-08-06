import Link from 'next/link';
import prisma from '@/lib/prisma';
import { computeDashboardStats } from '@/lib/dashboard-stats';
import { STATUS_LABELS, STATUS_STYLE } from '@/lib/order-status';
import DailySalesChart from '@/components/dashboard/DailySalesChart';
import MonthlySalesChart from '@/components/dashboard/MonthlySalesChart';
import TopCategories from '@/components/dashboard/TopCategories';

async function getOrders() {
    try {
        return await prisma.order.findMany({
            include: {
                items: {
                    include: { product: { select: { category: true } } },
                },
            },
        });
    } catch {
        return [];
    }
}

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

function DeltaBadge({ value }) {
    const positive = value >= 0;
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                color: positive ? '#059669' : '#dc2626',
            }}
        >
            {positive ? '↑' : '↓'} {Math.abs(value)}%
        </span>
    );
}

function StatCard({ icon, label, value, delta }) {
    return (
        <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(99,102,241,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                    }}
                >
                    {icon}
                </div>
                <DeltaBadge value={delta} />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#5b6072', marginBottom: '4px' }}>{label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14161f', letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: '0.72rem', color: '#8a8fa3', marginTop: '4px' }}>vs bulan lalu</p>
        </div>
    );
}

export default async function DashboardOverview() {
    const orders = await getOrders();
    const stats = computeDashboardStats(orders);

    return (
        <div>
            <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
                <p style={{ color: '#8a8fa3', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    👋 Selamat datang
                </p>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#14161f', marginBottom: '4px' }}>
                    Dashboard Reseller
                </h1>
                <p style={{ color: '#5b6072', fontSize: '0.875rem' }}>Ringkasan performa toko Umi Kasum</p>
            </div>

            {/* Customers & Orders */}
            <div
                className="animate-fade-in"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}
            >
                <StatCard icon="👥" label="Pelanggan" value={stats.totalCustomers} delta={stats.customersDelta} />
                <StatCard icon="🧾" label="Pesanan" value={stats.totalOrders} delta={stats.ordersDelta} />
            </div>

            {/* Daily Sales & Monthly Sales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <style>{`
                    @media (min-width: 1024px) {
                        .sales-charts-grid { grid-template-columns: 1fr 1fr !important; }
                    }
                `}</style>
                <div className="sales-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
                    <div className="card animate-fade-in" style={{ padding: '20px 22px' }}>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14161f', marginBottom: '2px' }}>Daily Sales</h2>
                        <p style={{ fontSize: '0.75rem', color: '#8a8fa3', marginBottom: '16px' }}>14 hari terakhir</p>
                        <DailySalesChart data={stats.dailySales} />
                    </div>
                    <div className="card animate-fade-in" style={{ padding: '20px 22px' }}>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14161f', marginBottom: '2px' }}>Monthly Sales</h2>
                        <p style={{ fontSize: '0.75rem', color: '#8a8fa3', marginBottom: '16px' }}>6 bulan terakhir</p>
                        <MonthlySalesChart data={stats.monthlySales} />
                    </div>
                </div>
            </div>

            {/* Recent Orders & Top Categories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
                <style>{`
                    @media (min-width: 1024px) {
                        .bottom-grid { grid-template-columns: minmax(0, 1fr) 320px !important; }
                    }
                `}</style>
                <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
                    <div className="card animate-fade-in" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '18px 22px', borderBottom: '1px solid #eef0f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14161f' }}>Recent Orders</h2>
                            <Link href="/dashboard/orders" style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                                Lihat Semua →
                            </Link>
                        </div>
                        {stats.recentOrders.length === 0 ? (
                            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#8a8fa3' }}>
                                <p style={{ fontSize: '0.85rem' }}>Belum ada pesanan.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table-dark" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            {['No. Pesanan', 'Pelanggan', 'Total', 'Status', 'Tanggal'].map(h => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.orderNumber}</td>
                                                <td style={{ color: '#383c4a' }}>{order.customerName}</td>
                                                <td style={{ fontWeight: 700, color: '#4f46e5' }}>{formatRupiah(order.total)}</td>
                                                <td>
                                                    <span
                                                        className="badge"
                                                        style={{ ...(STATUS_STYLE[order.status] || STATUS_STYLE.pending) }}
                                                    >
                                                        {STATUS_LABELS[order.status] || order.status}
                                                    </span>
                                                </td>
                                                <td style={{ color: '#8a8fa3' }}>{formatDate(order.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="card animate-fade-in" style={{ padding: '20px 22px' }}>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14161f', marginBottom: '2px' }}>Top Kategori Produk</h2>
                        <p style={{ fontSize: '0.75rem', color: '#8a8fa3', marginBottom: '20px' }}>Berdasarkan pendapatan</p>
                        <TopCategories categories={stats.topCategories} />
                    </div>
                </div>
            </div>
        </div>
    );
}
