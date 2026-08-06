const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export default function TopCategories({ categories }) {
    if (categories.length === 0) {
        return (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#8a8fa3' }}>
                <p style={{ fontSize: '0.85rem' }}>Belum ada data penjualan.</p>
            </div>
        );
    }

    const maxRevenue = Math.max(...categories.map(c => c.revenue), 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categories.map(cat => (
                <div key={cat.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#14161f' }}>{cat.category}</span>
                        <span style={{ fontSize: '0.8rem', color: '#5b6072' }}>
                            {formatRupiah(cat.revenue)} <span style={{ color: '#8a8fa3' }}>({cat.percentage}%)</span>
                        </span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: '#f1f2f6', overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${Math.max((cat.revenue / maxRevenue) * 100, 3)}%`,
                                borderRadius: '999px',
                                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
