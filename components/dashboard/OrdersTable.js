'use client';

import { Fragment, useState } from 'react';
import { STATUS_OPTIONS, STATUS_STYLE } from '@/lib/order-status';

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function OrdersTable({ orders: initialOrders }) {
    const [orders, setOrders] = useState(initialOrders);
    const [expandedId, setExpandedId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const handleStatusChange = async (id, status) => {
        setUpdatingId(id);
        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
            } else {
                alert('Gagal memperbarui status pesanan');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        } finally {
            setUpdatingId(null);
        }
    };

    if (orders.length === 0) {
        return (
            <div className="card" style={{ padding: '60px 24px', textAlign: 'center', color: '#8a8fa3' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🧾</div>
                <p>Belum ada pesanan masuk.</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table className="table-dark" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['No. Pesanan', 'Pelanggan', 'Tanggal', 'Total', 'Status', ''].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <Fragment key={order.id}>
                                <tr>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.orderNumber}</td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: '#383c4a' }}>{order.customerName}</div>
                                        <div style={{ fontSize: '0.78rem', color: '#8a8fa3' }}>{order.customerPhone}</div>
                                    </td>
                                    <td style={{ color: '#5b6072' }}>{formatDate(order.createdAt)}</td>
                                    <td style={{ fontWeight: 700, color: '#4f46e5' }}>{formatRupiah(order.total)}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            disabled={updatingId === order.id}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                ...STATUS_STYLE[order.status] || STATUS_STYLE.pending,
                                                borderRadius: '999px',
                                                padding: '4px 10px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                outline: 'none',
                                            }}
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                            className="btn-secondary"
                                            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                                        >
                                            {expandedId === order.id ? 'Tutup' : 'Detail'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === order.id && (
                                    <tr>
                                        <td colSpan={6} style={{ background: '#f7f7fb', padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: order.address || order.note ? '12px' : 0 }}>
                                                {order.items.map(item => (
                                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                                        <span style={{ color: '#383c4a' }}>
                                                            {item.product?.name ?? 'Produk dihapus'} × {item.quantity}
                                                        </span>
                                                        <span style={{ fontWeight: 600 }}>{formatRupiah(item.price * item.quantity)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.address && (
                                                <p style={{ fontSize: '0.8rem', color: '#5b6072', marginBottom: '4px' }}>
                                                    <strong>Alamat:</strong> {order.address}
                                                </p>
                                            )}
                                            {order.note && (
                                                <p style={{ fontSize: '0.8rem', color: '#5b6072' }}>
                                                    <strong>Catatan:</strong> {order.note}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
