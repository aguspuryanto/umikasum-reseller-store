'use client';

import { useEffect, useRef, useState } from 'react';

/* ─── DESCRIPTION COLLAPSE ────────────────────────────────── */
const COLLAPSED_LINES = 4;

export function DescriptionCollapse({ text }) {
    const [expanded, setExpanded] = useState(false);
    const [needsClamp, setNeedsClamp] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Check if content is taller than the clamped height
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
        const clampedH = lineHeight * COLLAPSED_LINES;
        setNeedsClamp(el.scrollHeight > clampedH + 2);
    }, [text]);

    return (
        <div style={{ marginBottom: '20px' }}>
            <p
                ref={ref}
                style={{
                    fontSize: '0.9rem',
                    color: '#5b6072',
                    lineHeight: 1.75,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: expanded ? 'unset' : COLLAPSED_LINES,
                    transition: 'all 0.3s ease',
                }}
            >
                {text}
            </p>
            {needsClamp && (
                <button
                    onClick={() => setExpanded(e => !e)}
                    style={{
                        marginTop: '6px',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: '#6366f1',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    {expanded ? 'Sembunyikan ▲' : 'Selengkapnya ▼'}
                </button>
            )}
        </div>
    );
}

/* ─── WISHLIST BUTTON ─────────────────────────────────────── */
export function WishlistButton({ productId, productName }) {
    const [wishlisted, setWishlisted] = useState(false);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setWishlisted(list.includes(productId));
        } catch { }
    }, [productId]);

    const toggle = () => {
        try {
            const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
            let next;
            if (list.includes(productId)) {
                next = list.filter(id => id !== productId);
            } else {
                next = [...list, productId];
            }
            localStorage.setItem('wishlist', JSON.stringify(next));
            setWishlisted(next.includes(productId));
        } catch { }
    };

    return (
        <button
            onClick={toggle}
            title={wishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: `1.5px solid ${wishlisted ? '#ef4444' : '#e7e8ee'}`,
                background: wishlisted ? 'rgba(239,68,68,0.06)' : '#ffffff',
                color: wishlisted ? '#ef4444' : '#5b6072',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
            }}
        >
            <svg
                width="17" height="17" viewBox="0 0 24 24"
                fill={wishlisted ? '#ef4444' : 'none'}
                stroke={wishlisted ? '#ef4444' : 'currentColor'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlisted ? 'Wishlisted' : 'Wishlist'}
        </button>
    );
}

/* ─── SHARE BUTTONS ───────────────────────────────────────── */
export function ShareButtons({ productName, productUrl }) {
    const [copied, setCopied] = useState(false);

    const shareWA = () => {
        const text = `Lihat produk ini: *${productName}*\n${productUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareFB = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(productUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const btnBase = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '9px 14px',
        borderRadius: '10px',
        border: 'none',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#8a8fa3', fontWeight: 500 }}>Bagikan:</span>

            {/* WhatsApp */}
            <button onClick={shareWA} title="Bagikan ke WhatsApp" style={{ ...btnBase, background: '#25D366', color: '#fff' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
            </button>

            {/* Facebook */}
            <button onClick={shareFB} title="Bagikan ke Facebook" style={{ ...btnBase, background: '#1877F2', color: '#fff' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
            </button>

            {/* Copy Link */}
            <button onClick={copyLink} title="Salin link" style={{ ...btnBase, background: copied ? '#10b981' : '#f1f2f6', color: copied ? '#fff' : '#383c4a' }}>
                {copied ? (
                    <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Tersalin!
                    </>
                ) : (
                    <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        Salin Link
                    </>
                )}
            </button>
        </div>
    );
}

/* ─── REVIEWS ─────────────────────────────────────────────── */
const STORAGE_KEY = (id) => `reviews_${id}`;

const DUMMY_REVIEWS = [
    { id: 1, name: 'Siti R.', rating: 5, comment: 'Produknya bagus sekali, pengiriman cepat dan aman. Sangat puas!', date: '10 Agu 2025' },
    { id: 2, name: 'Budi S.', rating: 4, comment: 'Kualitas sesuai dengan deskripsi. Harga terjangkau, akan beli lagi.', date: '2 Agu 2025' },
    { id: 3, name: 'Dewi A.', rating: 5, comment: 'Mantap! Sudah beli beberapa kali, selalu memuaskan.', date: '28 Jul 2025' },
];

function StarRating({ value, onChange, size = 22 }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;
    return (
        <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map(s => (
                <span
                    key={s}
                    onClick={() => onChange?.(s)}
                    onMouseEnter={() => onChange && setHovered(s)}
                    onMouseLeave={() => onChange && setHovered(0)}
                    style={{
                        fontSize: size,
                        cursor: onChange ? 'pointer' : 'default',
                        color: s <= active ? '#f59e0b' : '#d1d5db',
                        transition: 'color 0.15s',
                        lineHeight: 1,
                    }}
                >★</span>
            ))}
        </div>
    );
}

export function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState('reviews');

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY(productId)) || 'null');
            setReviews(saved || DUMMY_REVIEWS);
        } catch {
            setReviews(DUMMY_REVIEWS);
        }
    }, [productId]);

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '0';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.comment.trim()) return;
        setSubmitting(true);
        setTimeout(() => {
            const newReview = {
                id: Date.now(),
                name: form.name.trim(),
                rating: form.rating,
                comment: form.comment.trim(),
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            };
            const updated = [newReview, ...reviews];
            setReviews(updated);
            try { localStorage.setItem(STORAGE_KEY(productId), JSON.stringify(updated)); } catch { }
            setForm({ name: '', rating: 5, comment: '' });
            setSubmitting(false);
            setSubmitted(true);
            setActiveTab('reviews');
            setTimeout(() => setSubmitted(false), 3000);
        }, 600);
    };

    const tabStyle = (active) => ({
        padding: '10px 20px',
        fontWeight: 700,
        fontSize: '0.9rem',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: active ? '#6366f1' : '#8a8fa3',
        borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
        transition: 'all 0.2s',
    });

    return (
        <div style={{ marginTop: '48px' }}>
            {/* Tab header */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eef0f5', marginBottom: '28px' }}>
                <button style={tabStyle(activeTab === 'reviews')} onClick={() => setActiveTab('reviews')}>
                    Ulasan Pembeli ({reviews.length})
                </button>
                <button style={tabStyle(activeTab === 'write')} onClick={() => setActiveTab('write')}>
                    ✍️ Tulis Ulasan
                </button>
            </div>

            {activeTab === 'reviews' && (
                <div>
                    {/* Rating summary */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
                        border: '1px solid rgba(99,102,241,0.12)',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        marginBottom: '24px',
                    }}>
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                            <div className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{avgRating}</div>
                            <StarRating value={Math.round(parseFloat(avgRating))} size={16} />
                            <div style={{ fontSize: '0.75rem', color: '#8a8fa3', marginTop: '4px' }}>{reviews.length} ulasan</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = reviews.filter(r => r.rating === star).length;
                                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#5b6072', width: '14px', textAlign: 'right' }}>{star}</span>
                                        <span style={{ color: '#f59e0b', fontSize: '12px' }}>★</span>
                                        <div style={{ flex: 1, height: '6px', background: '#eef0f5', borderRadius: '99px', overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '99px', transition: 'width 0.6s ease' }} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#8a8fa3', width: '20px' }}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Review list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {reviews.map(r => (
                            <div key={r.id} style={{
                                background: '#fff',
                                border: '1px solid #eef0f5',
                                borderRadius: '14px',
                                padding: '18px 20px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '38px', height: '38px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                                        }}>
                                            {r.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#14161f' }}>{r.name}</div>
                                            <StarRating value={r.rating} size={14} />
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#8a8fa3', flexShrink: 0 }}>{r.date}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#383c4a', lineHeight: 1.7, margin: 0 }}>{r.comment}</p>
                            </div>
                        ))}
                    </div>

                    {submitted && (
                        <div style={{
                            marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                            color: '#059669', fontSize: '0.875rem', fontWeight: 600,
                        }}>
                            ✓ Ulasan berhasil dikirim. Terima kasih!
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'write' && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '540px' }}>
                    <div>
                        <label className="label-dark">Nama Kamu</label>
                        <input
                            type="text"
                            className="input-dark"
                            placeholder="Nama..."
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <label className="label-dark" style={{ marginBottom: '8px', display: 'block' }}>Rating</label>
                        <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} size={28} />
                    </div>
                    <div>
                        <label className="label-dark">Ulasan</label>
                        <textarea
                            className="input-dark"
                            placeholder="Ceritakan pengalamanmu dengan produk ini..."
                            rows={4}
                            style={{ resize: 'vertical', minHeight: '100px' }}
                            value={form.comment}
                            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary"
                        style={{ padding: '12px', alignSelf: 'flex-start', minWidth: '160px' }}
                    >
                        {submitting ? 'Mengirim...' : '✓ Kirim Ulasan'}
                    </button>
                </form>
            )}
        </div>
    );
}
