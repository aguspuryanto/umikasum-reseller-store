'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

export default function AddToCartSection({ product }) {
    const { addItem } = useCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const stock = product.stock ?? 0;
    const outOfStock = stock <= 0;

    const changeQty = (delta) => {
        setQuantity(q => Math.min(Math.max(1, q + delta), stock));
    };

    const handleAddToCart = () => {
        if (outOfStock) return;
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleBuyNow = () => {
        if (outOfStock) return;
        addItem(product, quantity);
        router.push('/checkout');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="label-dark" style={{ marginBottom: 0 }}>Jumlah</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => changeQty(-1)}
                        disabled={outOfStock || quantity <= 1}
                        className="btn-secondary"
                        style={{ width: '36px', height: '36px', padding: 0, fontSize: '1rem' }}
                    >
                        −
                    </button>
                    <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                    <button
                        onClick={() => changeQty(1)}
                        disabled={outOfStock || quantity >= stock}
                        className="btn-secondary"
                        style={{ width: '36px', height: '36px', padding: 0, fontSize: '1rem' }}
                    >
                        +
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className={added ? 'btn-success' : 'btn-secondary'}
                    style={{ flex: '1 1 180px', padding: '13px', fontSize: '0.9rem' }}
                >
                    {outOfStock ? 'Stok Habis' : added ? '✓ Ditambahkan' : '+ Tambah ke Keranjang'}
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={outOfStock}
                    className="btn-primary"
                    style={{ flex: '1 1 180px', padding: '13px', fontSize: '0.9rem' }}
                >
                    Beli Sekarang
                </button>
            </div>
        </div>
    );
}
