'use client';

import { useEffect, useRef, useState } from 'react';
import ImageUpload from '@/app/dashboard/components/ImageUpload';

const EMPTY_FORM = {
    image: '',
    title: '',
    subtitle: '',
    link: '',
    order: 0,
    active: true,
};

export default function SliderForm({ onSliderAdded, editingSlider, onSliderEdited, onCancelEdit }) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [prevEditingSlider, setPrevEditingSlider] = useState(editingSlider);
    const formRef = useRef(null);
    const isEditing = Boolean(editingSlider);

    if (editingSlider !== prevEditingSlider) {
        setPrevEditingSlider(editingSlider);
        setFormData(
            editingSlider
                ? {
                    image: editingSlider.image,
                    title: editingSlider.title || '',
                    subtitle: editingSlider.subtitle || '',
                    link: editingSlider.link || '',
                    order: editingSlider.order || 0,
                    active: editingSlider.active,
                }
                : EMPTY_FORM
        );
    }

    useEffect(() => {
        if (editingSlider) {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [editingSlider]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleCancel = () => {
        setFormData(EMPTY_FORM);
        onCancelEdit();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert('Silakan upload gambar slider terlebih dahulu');
            return;
        }
        setLoading(true);

        try {
            const response = await fetch(
                isEditing ? `/api/sliders/${editingSlider.id}` : '/api/sliders',
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, order: parseInt(formData.order) || 0 }),
                }
            );

            if (response.ok) {
                if (isEditing) {
                    alert('Slider berhasil diperbarui!');
                    setFormData(EMPTY_FORM);
                    onSliderEdited();
                } else {
                    alert('Slider berhasil ditambahkan!');
                    setFormData(EMPTY_FORM);
                    onSliderAdded();
                }
            } else {
                alert(isEditing ? 'Gagal memperbarui slider' : 'Gagal menambahkan slider');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={formRef}
            style={{
                background: '#ffffff',
                border: isEditing ? '1px solid rgba(99,102,241,0.4)' : '1px solid #e7e8ee',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
            }}
        >
            <div
                style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #eef0f5',
                    background: 'rgba(99,102,241,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}
            >
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
                    {isEditing ? '✏️' : '🖼️'}
                </div>
                <div>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#14161f', margin: 0 }}>
                        {isEditing ? 'Edit Slider' : 'Tambah Slider'}
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#8a8fa3', margin: 0 }}>
                        {isEditing ? 'Mengubah slide banner' : 'Tambahkan banner untuk homepage'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                    <label className="label-dark">Gambar Slider</label>
                    <ImageUpload onUpload={handleImageUpload} />
                    {formData.image && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={formData.image}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #e7e8ee',
                                }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="label-dark">Judul (opsional)</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Judul banner..."
                        className="input-dark"
                    />
                </div>

                <div>
                    <label className="label-dark">Subjudul (opsional)</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        placeholder="Subjudul / deskripsi singkat..."
                        className="input-dark"
                    />
                </div>

                <div>
                    <label className="label-dark">Link Tujuan (opsional)</label>
                    <input
                        type="text"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="/?category=Skincare"
                        className="input-dark"
                    />
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                    <div style={{ flex: 1 }}>
                        <label className="label-dark">Urutan</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            placeholder="0"
                            className="input-dark"
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#383c4a', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                            />
                            Tampilkan di homepage
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    {isEditing && (
                        <button type="button" onClick={handleCancel} className="btn-secondary" style={{ flex: '0 0 auto', padding: '12px 20px' }}>
                            Batal
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                        {loading ? 'Menyimpan...' : isEditing ? '✓ Simpan Perubahan' : '+ Tambah Slider'}
                    </button>
                </div>
            </form>
        </div>
    );
}
