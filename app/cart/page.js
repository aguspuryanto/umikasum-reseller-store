'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

    return (
        <main style={{ minHeight: '100vh', paddingTop: '92px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px', color: '#14161f' }}>
                    Keranjang Belanja
                </h1>
                <p style={{ color: '#5b6072', fontSize: '0.9rem', marginBottom: '32px' }}>
                    {totalItems > 0 ? `${totalItems} item di keranjang kamu` : 'Belum ada item di keranjang'}
                </p>

                {items.length === 0 ? (
                    <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
                        <p style={{ color: '#5b6072', marginBottom: '20px' }}>Keranjang kamu masih kosong.</p>
                        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 24px', display: 'inline-block' }}>
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="card" style={{ overflow: 'hidden' }}>
                            {items.map((item, i) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '20px',
                                        borderBottom: i < items.length - 1 ? '1px solid #eef0f5' : 'none',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Link href={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                                        <div
                                            style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '10px',
                                                background: '#f1f2f6',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '24px' }}>📦</span>
                                            )}
                                        </div>
                                    </Link>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>{item.name}</div>
                                        </Link>
                                        <div style={{ color: '#4f46e5', fontWeight: 700, fontSize: '0.9rem' }}>
                                            {formatRupiah(item.price)}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="btn-secondary"
                                            style={{ width: '30px', height: '30px', padding: 0 }}
                                        >
                                            −
                                        </button>
                                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                            className="btn-secondary"
                                            style={{ width: '30px', height: '30px', padding: 0, opacity: item.quantity >= item.stock ? 0.4 : 1 }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div style={{ minWidth: '110px', textAlign: 'right', fontWeight: 700 }}>
                                        {formatRupiah(item.price * item.quantity)}
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Hapus"
                                        style={{ background: 'none', border: 'none', color: '#a5a9ba', fontSize: '1.3rem', cursor: 'pointer' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <span style={{ color: '#5b6072', fontSize: '0.85rem' }}>Total Belanja</span>
                                <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                                    {formatRupiah(totalPrice)}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Link href="/" className="btn-secondary" style={{ textDecoration: 'none', padding: '11px 20px' }}>
                                    Lanjut Belanja
                                </Link>
                                <Link href="/checkout" className="btn-primary" style={{ textDecoration: 'none', padding: '11px 24px' }}>
                                    Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

