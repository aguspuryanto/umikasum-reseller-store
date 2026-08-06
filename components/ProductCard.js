'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const outOfStock = (product.stock ?? 0) <= 0;

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (outOfStock) return;
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="card" style={{ overflow: 'hidden', borderRadius: '16px' }}>
            <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {/* Image */}
                <div className="relative" style={{ height: '200px', background: '#f1f2f6' }}>
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ color: '#c7c9d9' }}
                        >
                            <svg
                                style={{ width: '48px', height: '48px', opacity: 0.6 }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Badge */}
                    <span
                        className="badge badge-brand"
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)' }}
                    >
                        #{product.no}
                    </span>

                    {product.category && (
                        <span
                            className="badge"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: 'rgba(255,255,255,0.9)',
                                color: '#383c4a',
                                border: '1px solid #e7e8ee',
                            }}
                        >
                            {product.category}
                        </span>
                    )}

                    {outOfStock && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(255,255,255,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span className="badge" style={{ background: '#14161f', color: '#fff' }}>
                                Stok Habis
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                    <h3
                        style={{
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: '#14161f',
                            marginBottom: '12px',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.6em',
                        }}
                    >
                        {product.name}
                    </h3>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '12px',
                            borderTop: '1px solid #eef0f5',
                        }}
                    >
                        <span
                            className="gradient-text"
                            style={{ fontWeight: 700, fontSize: '1rem' }}
                        >
                            {formatRupiah(product.sellPrice)}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#8a8fa3' }}>
                            Stok {product.stock ?? 0}
                        </span>
                    </div>
                </div>
            </Link>

            <div style={{ padding: '0 16px 16px' }}>
                <button
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className={added ? 'btn-success' : 'btn-primary'}
                    style={{ width: '100%', padding: '10px', fontSize: '0.8rem' }}
                >
                    {outOfStock ? 'Stok Habis' : added ? '✓ Ditambahkan' : '+ Tambah ke Keranjang'}
                </button>
            </div>
        </div>
    );
}
