'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const [formData, setFormData] = useState({ customerName: '', customerPhone: '', address: '', note: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Gagal membuat pesanan');
                return;
            }

            setOrder(data);
            clearCart();
        } catch {
            setError('Terjadi kesalahan, silakan coba lagi');
        } finally {
            setLoading(false);
        }
    };

    if (order) {
        return (
            <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
                <div style={{ maxWidth: '520px', margin: '0 auto', padding: '64px 24px' }}>
                    <div className="card animate-fade-in" style={{ padding: '40px 32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: '#14161f' }}>
                            Pesanan Diterima!
                        </h1>
                        <p style={{ color: '#5b6072', fontSize: '0.9rem', marginBottom: '24px' }}>
                            Terima kasih, kami akan segera memproses pesananmu.
                        </p>
                        <div style={{ background: '#f7f7fb', border: '1px solid #e7e8ee', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                <span style={{ color: '#5b6072' }}>No. Pesanan</span>
                                <strong>{order.orderNumber}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#5b6072' }}>Total</span>
                                <strong className="gradient-text">{formatRupiah(order.total)}</strong>
                            </div>
                        </div>
                        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '11px 28px', display: 'inline-block' }}>
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
                <div style={{ maxWidth: '520px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
                    <div className="card" style={{ padding: '48px 24px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛒</div>
                        <p style={{ color: '#5b6072', marginBottom: '20px' }}>Keranjang kamu masih kosong.</p>
                        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 24px', display: 'inline-block' }}>
                            Mulai Belanja
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '32px', color: '#14161f' }}>
                    Checkout
                </h1>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr)',
                        gap: '24px',
                    }}
                >
                    <style>{`
                        @media (min-width: 800px) {
                            .checkout-grid { grid-template-columns: minmax(0, 1fr) 340px !important; }
                        }
                    `}</style>
                    <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Informasi Pengiriman</h2>

                            <div>
                                <label className="label-dark" htmlFor="customerName">Nama Lengkap</label>
                                <input
                                    id="customerName"
                                    name="customerName"
                                    required
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className="input-dark"
                                    placeholder="Nama penerima"
                                />
                            </div>

                            <div>
                                <label className="label-dark" htmlFor="customerPhone">Nomor HP / WhatsApp</label>
                                <input
                                    id="customerPhone"
                                    name="customerPhone"
                                    required
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    className="input-dark"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            <div>
                                <label className="label-dark" htmlFor="address">Alamat Pengiriman</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-dark"
                                    rows={3}
                                    placeholder="Alamat lengkap..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div>
                                <label className="label-dark" htmlFor="note">Catatan (opsional)</label>
                                <textarea
                                    id="note"
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    className="input-dark"
                                    rows={2}
                                    placeholder="Catatan tambahan..."
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {error && (
                                <div
                                    style={{
                                        background: 'rgba(239,68,68,0.06)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        borderRadius: '10px',
                                        padding: '12px 14px',
                                        color: '#dc2626',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    ⚠️ {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px', marginTop: '4px' }}>
                                {loading ? 'Memproses...' : `Buat Pesanan · ${formatRupiah(totalPrice)}`}
                            </button>
                        </form>

                        {/* Summary */}
                        <div className="card" style={{ padding: '24px', height: 'fit-content' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>Ringkasan Pesanan</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                {items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#383c4a' }}>{item.name} × {item.quantity}</span>
                                        <span style={{ fontWeight: 600 }}>{formatRupiah(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid #eef0f5', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700 }}>Total</span>
                                <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{formatRupiah(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
