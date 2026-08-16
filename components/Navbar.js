'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import CartWidget from "./CartWidget";

export default function Navbar() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    const categories = ['Semua', 'Skincare', 'Supplement', 'Vitamin', 'Herbal', 'Lainnya'];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
            {/* ── TOP BAR ── */}
            <div style={{ background: '#e8192c', padding: '6px 0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left: Pusat Bantuan */}
                    <Link
                        href="#"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500 }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                        </svg>
                        Pusat Bantuan
                    </Link>

                    {/* Right: Top links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {['Produk', 'Blog', 'Jadi Affiliate', 'Jadi Seller'].map(item => (
                            <Link
                                key={item}
                                href="#"
                                style={{ color: '#fff', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 500, opacity: 0.9, transition: 'opacity 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN NAVBAR ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eef0f5', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '64px' }}>

                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e8192c', letterSpacing: '-0.04em', fontFamily: 'Georgia, serif' }}>
                            Umi Kasum
                        </span>
                    </Link>

                    {/* Search bar group */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0', maxWidth: '640px', marginLeft: '8px' }}>

                        {/* Kategori dropdown */}
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <button
                                onClick={() => setCategoryOpen(o => !o)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '0 12px', height: '42px',
                                    background: '#f7f7fb', border: '1px solid #e0e1ea',
                                    borderRight: 'none', borderRadius: '8px 0 0 8px',
                                    fontSize: '0.82rem', fontWeight: 600, color: '#383c4a',
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                                </svg>
                                {selectedCategory}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {categoryOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 100,
                                    background: '#fff', border: '1px solid #e0e1ea', borderRadius: '8px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: '140px', overflow: 'hidden',
                                }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); }}
                                            style={{
                                                display: 'block', width: '100%', padding: '9px 16px',
                                                textAlign: 'left', fontSize: '0.83rem', fontWeight: cat === selectedCategory ? 700 : 500,
                                                color: cat === selectedCategory ? '#e8192c' : '#383c4a',
                                                background: cat === selectedCategory ? 'rgba(232,25,44,0.06)' : 'transparent',
                                                border: 'none', cursor: 'pointer',
                                            }}
                                            onMouseEnter={e => { if (cat !== selectedCategory) e.currentTarget.style.background = '#f7f7fb'; }}
                                            onMouseLeave={e => { if (cat !== selectedCategory) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search input */}
                        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari Produk, Brand atau Store"
                                style={{
                                    flex: 1, height: '42px', padding: '0 14px',
                                    border: '1px solid #e0e1ea', borderLeft: 'none', borderRight: 'none',
                                    outline: 'none', fontSize: '0.85rem', color: '#14161f',
                                    background: '#fff',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    width: '44px', height: '42px', flexShrink: 0,
                                    background: '#e8192c', border: '1px solid #e8192c',
                                    borderRadius: '0 8px 8px 0', color: '#fff', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Right: icons + auth */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexShrink: 0 }}>

                        {/* Bell */}
                        <button style={{ width: '38px', height: '38px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b6072' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>

                        {/* Cart */}
                        <CartWidget />

                        {/* Auth */}
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem',
                                        fontWeight: 600, color: '#383c4a', textDecoration: 'none',
                                        border: '1.5px solid #e0e1ea', background: '#fff',
                                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e1ea'; e.currentTarget.style.color = '#383c4a'; }}
                                >
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>
                                        {session.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                                    </div>
                                    {session.user?.name?.split(' ')[0]}
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem',
                                        fontWeight: 600, color: '#fff', border: 'none',
                                        background: '#e8192c', cursor: 'pointer', transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    style={{
                                        padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem',
                                        fontWeight: 600, color: '#e8192c', textDecoration: 'none',
                                        border: '1.5px solid #e8192c', background: '#fff',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,25,44,0.06)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    style={{
                                        padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem',
                                        fontWeight: 600, color: '#fff', textDecoration: 'none',
                                        border: '1.5px solid #e8192c', background: '#e8192c',
                                        transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
