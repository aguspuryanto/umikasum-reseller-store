'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import CartWidget from "./CartWidget";

export default function Navbar() {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 animate-slide-down"
            style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: scrolled
                    ? '1px solid #e0e1ea'
                    : '1px solid rgba(20,22,31,0.05)',
                boxShadow: scrolled ? '0 4px 20px rgba(20,22,31,0.06)' : 'none',
                transition: 'all 0.3s ease',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                        >
                            U
                        </div>
                        <span
                            className="text-xl font-bold gradient-text-brand"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Umi Kasum
                        </span>
                    </Link>

                    {/* Nav Items */}
                    <div className="flex items-center gap-3">
                        <CartWidget />

                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                                    style={{ color: '#5b6072' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.color = '#14161f';
                                        e.currentTarget.style.background = '#f1f2f6';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.color = '#5b6072';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    Dashboard
                                </Link>

                                <div
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                    style={{
                                        background: '#f7f7fb',
                                        border: '1px solid #e7e8ee',
                                    }}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                    >
                                        {session.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: '#383c4a' }}>
                                        {session.user?.name}
                                    </span>
                                </div>

                                <button
                                    onClick={() => signOut()}
                                    className="btn-danger"
                                    style={{ padding: '7px 14px', borderRadius: '8px' }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
