'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export default function CartWidget() {
    const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(o => !o)}
                aria-label="Keranjang"
                style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid #e7e8ee',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#c7c9d9')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e7e8ee')}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14161f" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6L5 3H2" />
                    <circle cx="9" cy="20" r="1.4" fill="#14161f" stroke="none" />
                    <circle cx="18" cy="20" r="1.4" fill="#14161f" stroke="none" />
                </svg>
                {totalItems > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            minWidth: '18px',
                            height: '18px',
                            padding: '0 4px',
                            borderRadius: '999px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {totalItems}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="animate-slide-in-right"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        right: 0,
                        width: '340px',
                        maxWidth: '90vw',
                        background: '#ffffff',
                        border: '1px solid #e7e8ee',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px rgba(20,22,31,0.12)',
                        zIndex: 60,
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #eef0f5' }}>
                        <strong style={{ fontSize: '0.9rem' }}>Keranjang ({totalItems})</strong>
                    </div>

                    {items.length === 0 ? (
                        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#8a8fa3', fontSize: '0.85rem' }}>
                            Keranjang kamu masih kosong.
                        </div>
                    ) : (
                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f4f5f8',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '8px',
                                            background: '#f1f2f6',
                                            flexShrink: 0,
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '18px' }}>📦</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid #e0e1ea', background: '#fff', cursor: 'pointer', fontSize: '0.75rem', lineHeight: 1 }}
                                                >
                                                    −
                                                </button>
                                                <span style={{ fontSize: '0.78rem', minWidth: '14px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid #e0e1ea', background: '#fff', cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer', fontSize: '0.75rem', lineHeight: 1, opacity: item.quantity >= item.stock ? 0.4 : 1 }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5' }}>
                                                {formatRupiah(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Hapus"
                                        style={{ color: '#a5a9ba', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', alignSelf: 'flex-start' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {items.length > 0 && (
                        <div style={{ padding: '14px 16px', borderTop: '1px solid #eef0f5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
                                <span style={{ color: '#5b6072' }}>Subtotal</span>
                                <strong>{formatRupiah(totalPrice)}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link
                                    href="/cart"
                                    onClick={() => setOpen(false)}
                                    className="btn-secondary"
                                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '9px' }}
                                >
                                    Keranjang
                                </Link>
                                <Link
                                    href="/checkout"
                                    onClick={() => setOpen(false)}
                                    className="btn-primary"
                                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '9px' }}
                                >
                                    Checkout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
