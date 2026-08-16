'use client';

import { useEffect, useRef, useState } from 'react';
import ImageUpload from './ImageUpload';

const EMPTY_FORM = {
    no: '',
    name: '',
    sellPrice: '',
    buyPrice: '',
    image: '',
    category: '',
    stock: 0,
    description: ''
};

export default function ProductForm({ onProductAdded, editingProduct, onProductEdited, onCancelEdit, onClose }) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const isEditing = Boolean(editingProduct);

    // Sync form fields whenever editingProduct changes (opened for edit or reset to add).
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                no: editingProduct.no,
                name: editingProduct.name,
                sellPrice: editingProduct.sellPrice,
                buyPrice: editingProduct.buyPrice,
                image: editingProduct.image || '',
                category: editingProduct.category || '',
                stock: editingProduct.stock || 0,
                description: editingProduct.description || '',
            });
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [editingProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setLoading(true);

        try {
            const response = await fetch(
                isEditing ? `/api/products/${editingProduct.id}` : '/api/products',
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        no: parseInt(formData.no),
                        sellPrice: parseFloat(formData.sellPrice),
                        buyPrice: parseFloat(formData.buyPrice),
                        stock: parseInt(formData.stock) || 0
                    }),
                }
            );

            if (response.ok) {
                if (isEditing) {
                    alert('Produk berhasil diperbarui!');
                    setFormData(EMPTY_FORM);
                    onProductEdited();
                } else {
                    alert('Produk berhasil ditambahkan!');
                    setFormData(EMPTY_FORM);
                    onProductAdded();
                }
            } else {
                alert(isEditing ? 'Gagal memperbarui produk' : 'Gagal menambahkan produk');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: 'Nama Produk', name: 'name', type: 'text', placeholder: 'Nama produk...' },
        { label: 'Harga Jual', name: 'sellPrice', type: 'number', placeholder: '0' },
        { label: 'Harga Beli', name: 'buyPrice', type: 'number', placeholder: '0' },
        { label: 'Kategori', name: 'category', type: 'text', placeholder: 'Skincare, Supplement...' },
        { label: 'Stok', name: 'stock', type: 'number', placeholder: '0' },
    ];

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
            {/* Header */}
            <div
                style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #eef0f5',
                    background: 'rgba(99,102,241,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
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
                        {isEditing ? '✏️' : '➕'}
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#14161f', margin: 0 }}>
                            {isEditing ? 'Edit Produk' : 'Tambah Produk'}
                        </h2>
                        <p style={{ fontSize: '0.75rem', color: '#8a8fa3', margin: 0 }}>
                            {isEditing ? `Mengubah "${editingProduct.name}"` : 'Isi detail produk baru'}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: '1px solid #e7e8ee',
                            background: '#ffffff',
                            color: '#5b6072',
                            fontSize: '0.9rem',
                            lineHeight: 1,
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="hidden" name="no" value={formData.no} />
                {fields.map(field => (
                    <div key={field.name}>
                        <label className="label-dark">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required={['name','sellPrice','buyPrice'].includes(field.name)}
                            placeholder={field.placeholder}
                            className="input-dark"
                        />
                    </div>
                ))}

                <div>
                    <label className="label-dark">Gambar Produk</label>
                    <ImageUpload onUpload={handleImageUpload} />
                    {formData.image && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={formData.image}
                                alt="Preview"
                                style={{
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #e7e8ee',
                                }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="label-dark">Deskripsi</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Deskripsi produk (opsional)..."
                        rows={4}
                        className="input-dark"
                        style={{ resize: 'vertical', minHeight: '90px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn-secondary"
                            style={{ flex: '0 0 auto', padding: '12px 20px' }}
                        >
                            Batal
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ flex: 1, padding: '12px' }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span
                                    style={{
                                        width: '14px',
                                        height: '14px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                        animation: 'spin 0.7s linear infinite',
                                        display: 'inline-block',
                                    }}
                                />
                                Menyimpan...
                            </span>
                        ) : isEditing ? '✓ Simpan Perubahan' : '+ Tambah Produk'}
                    </button>
                </div>
            </form>
        </div>
    );
}
