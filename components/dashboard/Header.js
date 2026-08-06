'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Header({ onMenuClick }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/dashboard/products?q=${encodeURIComponent(q)}` : '/dashboard/products');
    };

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid #eef0f5',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
            }}
        >
            <button
                onClick={onMenuClick}
                aria-label="Menu"
                className="lg:hidden"
                style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid #e7e8ee',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14161f" strokeWidth="1.8">
                    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '420px' }}>
                <div style={{ position: 'relative' }}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8a8fa3"
                        strokeWidth="1.8"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
                    </svg>
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        type="text"
                        placeholder="Cari produk..."
                        className="input-dark"
                        style={{ paddingLeft: '36px' }}
                    />
                </div>
            </form>

            <div style={{ flex: 1 }} />

            <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setMenuOpen(o => !o)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '10px',
                    }}
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', flexShrink: 0 }}
                    >
                        {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="hidden sm:inline" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#14161f' }}>
                        {session?.user?.name ?? 'Reseller'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8fa3" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                {menuOpen && (
                    <div
                        className="animate-slide-in-right"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            width: '220px',
                            background: '#ffffff',
                            border: '1px solid #e7e8ee',
                            borderRadius: '14px',
                            boxShadow: '0 20px 40px rgba(20,22,31,0.12)',
                            overflow: 'hidden',
                            zIndex: 60,
                        }}
                    >
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #eef0f5' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#14161f' }}>{session?.user?.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#8a8fa3' }}>{session?.user?.email}</div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '12px 16px',
                                background: 'none',
                                border: 'none',
                                color: '#dc2626',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
