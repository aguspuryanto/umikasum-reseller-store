'use client';

export default function SliderTable({ sliders, onSliderUpdated, onEdit }) {
    const deleteSlider = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus slider ini?')) return;

        try {
            const response = await fetch(`/api/sliders/${id}`, { method: 'DELETE' });
            if (response.ok) {
                onSliderUpdated();
            } else {
                alert('Gagal menghapus slider');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        }
    };

    const toggleActive = async (slider) => {
        try {
            const response = await fetch(`/api/sliders/${slider.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...slider, active: !slider.active }),
            });
            if (response.ok) {
                onSliderUpdated();
            } else {
                alert('Gagal memperbarui status slider');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        }
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
                <div>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#14161f', margin: 0 }}>Daftar Slider</h2>
                    <p style={{ fontSize: '0.75rem', color: '#8a8fa3', margin: 0 }}>{sliders.length} slider terdaftar</p>
                </div>
                <span className="badge badge-brand">{sliders.length} Items</span>
            </div>

            {sliders.length === 0 ? (
                <div style={{ padding: '60px 24px', textAlign: 'center', color: '#8a8fa3' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🖼️</div>
                    <p>Belum ada slider. Tambahkan banner pertama untuk homepage!</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="table-dark" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Preview', 'Judul', 'Urutan', 'Status', 'Aksi'].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sliders.map(slider => (
                                <tr key={slider.id}>
                                    <td>
                                        <img
                                            src={slider.image}
                                            alt={slider.title || 'Slider'}
                                            style={{
                                                width: '72px',
                                                height: '40px',
                                                objectFit: 'cover',
                                                borderRadius: '6px',
                                                border: '1px solid #e7e8ee',
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: '#383c4a' }}>{slider.title || <em style={{ color: '#8a8fa3' }}>Tanpa judul</em>}</div>
                                        {slider.subtitle && <div style={{ fontSize: '0.78rem', color: '#8a8fa3' }}>{slider.subtitle}</div>}
                                    </td>
                                    <td style={{ fontFamily: 'monospace' }}>{slider.order}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleActive(slider)}
                                            className="badge"
                                            style={{
                                                cursor: 'pointer',
                                                border: 'none',
                                                background: slider.active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                                                color: slider.active ? '#059669' : '#dc2626',
                                            }}
                                        >
                                            {slider.active ? 'Aktif' : 'Nonaktif'}
                                        </button>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                onClick={() => onEdit(slider)}
                                                className="btn-primary"
                                                style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '7px' }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button onClick={() => deleteSlider(slider.id)} className="btn-danger">
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
