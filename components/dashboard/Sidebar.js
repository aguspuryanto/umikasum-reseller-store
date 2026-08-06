'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
        ),
    },
    {
        href: '/dashboard/products',
        label: 'Produk',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7L12 3 4 7v10l8 4 8-4V7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 4 8-4M12 11v10" />
            </svg>
        ),
    },
    {
        href: '/dashboard/orders',
        label: 'Pesanan',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6L5 3H2" />
                <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
                <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        href: '/dashboard/sliders',
        label: 'Slider',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l4.5-4.5a2 2 0 012.8 0L15 15M13.5 13.5L15.6 11.4a2 2 0 012.8 0L21 14" />
                <circle cx="8" cy="9" r="1.3" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
];

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    const isActive = (href) => (href === '/dashboard' ? pathname === '/dashboard' : pathname?.startsWith(href));

    return (
        <>
            <style>{`
                .admin-sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 260px;
                    transform: translateX(${isOpen ? '0' : '-100%'});
                    transition: transform 0.25s ease;
                    z-index: 70;
                }
                .admin-sidebar-overlay { display: block; }
                @media (min-width: 1024px) {
                    .admin-sidebar { position: static !important; transform: none !important; height: auto; flex-shrink: 0; z-index: 1; }
                    .admin-sidebar-overlay { display: none !important; }
                }
            `}</style>

            {isOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(20,22,31,0.4)',
                        zIndex: 60,
                    }}
                />
            )}

            <aside
                className="admin-sidebar"
                style={{
                    background: '#ffffff',
                    borderRight: '1px solid #e7e8ee',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{ padding: '20px 20px', borderBottom: '1px solid #eef0f5' }}>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', flexShrink: 0 }}
                        >
                            U
                        </div>
                        <span className="text-lg font-bold gradient-text-brand" style={{ letterSpacing: '-0.02em' }}>
                            Umi Kasum
                        </span>
                    </Link>
                </div>

                <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8a8fa3', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px', marginBottom: '4px' }}>
                        Menu
                    </p>
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: active ? '#4f46e5' : '#5b6072',
                                    background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f1f2f6'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '16px 20px', borderTop: '1px solid #eef0f5' }}>
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: '#8a8fa3',
                            textDecoration: 'none',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                        </svg>
                        Kembali ke Toko
                    </Link>
                </div>
            </aside>
        </>
    );
}
