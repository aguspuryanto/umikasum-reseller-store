'use client';

export default function ProductTable({ products, onProductUpdated, onEdit }) {
    const deleteProduct = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Produk berhasil dihapus!');
                onProductUpdated();
            } else {
                alert('Gagal menghapus produk');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        }
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div
            style={{
                background: '#ffffff',
                border: '1px solid #e7e8ee',
                borderRadius: '20px',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #eef0f5',
                    background: 'rgba(99,102,241,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                        }}
                    >
                        📋
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#14161f', margin: 0 }}>
                            Daftar Produk
                        </h2>
                        <p style={{ fontSize: '0.75rem', color: '#8a8fa3', margin: 0 }}>
                            {products.length} produk terdaftar
                        </p>
                    </div>
                </div>

                <span className="badge badge-brand">
                    {products.length} Items
                </span>
            </div>

            {/* Table */}
            {products.length === 0 ? (
                <div
                    style={{
                        padding: '60px 24px',
                        textAlign: 'center',
                        color: '#8a8fa3',
                    }}
                >
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📦</div>
                    <p>Belum ada produk. Tambahkan produk pertama kamu!</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="table-dark" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['No', 'Nama', 'Harga Jual', 'Harga Beli', 'Keuntungan', 'Stok', 'Aksi'].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <span className="badge badge-brand" style={{ fontFamily: 'monospace' }}>
                                            #{product.no}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e7e8ee',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        background: 'rgba(99,102,241,0.15)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    📦
                                                </div>
                                            )}
                                            <span style={{ fontWeight: 500, color: '#383c4a' }}>
                                                {product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: '#059669', fontWeight: 600 }}>
                                            {formatRupiah(product.sellPrice)}
                                        </span>
                                    </td>
                                    <td style={{ color: '#8a8fa3', textDecoration: 'line-through' }}>
                                        {formatRupiah(product.buyPrice)}
                                    </td>
                                    <td>
                                        <span className="badge badge-emerald">
                                            +{formatRupiah(product.sellPrice - product.buyPrice)}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: (product.stock ?? 0) > 0 ? '#059669' : '#dc2626',
                                            }}
                                        >
                                            {product.stock ?? 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="btn-primary"
                                                style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '7px' }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="btn-danger"
                                            >
                                                🗑️ Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
