'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductForm from '@/app/dashboard/components/ProductForm';
import ProductTable from '@/app/dashboard/components/ProductTable';

export default function ProductsManager({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [editingProduct, setEditingProduct] = useState(null);
    const searchParams = useSearchParams();
    const query = (searchParams.get('q') || '').toLowerCase();

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const filteredProducts = useMemo(() => {
        if (!query) return products;
        return products.filter(p => p.name.toLowerCase().includes(query));
    }, [products, query]);

    const stats = [
        { label: 'Total Produk', value: products.length, icon: '📦', color: '#6366f1' },
        { label: 'Stok Tersedia', value: products.filter(p => (p.stock ?? 0) > 0).length, icon: '✅', color: '#10b981' },
        { label: 'Stok Habis', value: products.filter(p => (p.stock ?? 0) === 0).length, icon: '⚠️', color: '#f59e0b' },
    ];

    return (
        <div>
            <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#14161f', marginBottom: '4px' }}>
                    Produk
                </h1>
                <p style={{ color: '#5b6072', fontSize: '0.875rem' }}>Kelola katalog produk Umi Kasum</p>
            </div>

            <div
                className="animate-fade-in"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                }}
            >
                {stats.map(stat => (
                    <div
                        key={stat.label}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e7e8ee',
                            borderRadius: '14px',
                            padding: '18px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: `${stat.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                flexShrink: 0,
                            }}
                        >
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14161f', lineHeight: 1 }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#8a8fa3', fontWeight: 500, marginTop: '3px' }}>
                                {stat.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
                <style>{`
                    @media (min-width: 1024px) {
                        .products-grid { grid-template-columns: 340px minmax(0, 1fr) !important; }
                    }
                `}</style>
                <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
                    <div className="animate-fade-in">
                        <ProductForm
                            editingProduct={editingProduct}
                            onProductAdded={fetchProducts}
                            onProductEdited={() => {
                                fetchProducts();
                                setEditingProduct(null);
                            }}
                            onCancelEdit={() => setEditingProduct(null)}
                        />
                    </div>
                    <div className="animate-fade-in">
                        {query && (
                            <p style={{ marginBottom: '12px', fontSize: '0.85rem', color: '#5b6072' }}>
                                Menampilkan hasil untuk &quot;{query}&quot; ({filteredProducts.length} produk)
                            </p>
                        )}
                        <ProductTable
                            products={filteredProducts}
                            onProductUpdated={fetchProducts}
                            onEdit={setEditingProduct}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
