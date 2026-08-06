'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result.error) {
                setError('Email atau password salah');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            setError('Terjadi kesalahan, silakan coba lagi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated background orbs */}
            <div
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: '20%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
                    animation: 'float 6s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '15%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '25%',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
                    animation: 'float 5s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* Login Card */}
            <div
                className="animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: '#ffffff',
                    border: '1px solid #e7e8ee',
                    borderRadius: '24px',
                    padding: '40px 36px',
                    boxShadow: '0 40px 80px rgba(20,22,31,0.1), 0 0 60px rgba(99,102,241,0.05)',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            fontSize: '24px',
                            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                        }}
                    >
                        🔐
                    </div>
                    <h1
                        style={{
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: '#14161f',
                            marginBottom: '8px',
                        }}
                    >
                        Login Reseller
                    </h1>
                    <p style={{ color: '#5b6072', fontSize: '0.875rem' }}>
                        Umi Kasum Official Reseller
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label className="label-dark" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input-dark"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label className="label-dark" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="input-dark"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                background: 'rgba(239,68,68,0.06)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '10px',
                                padding: '12px 14px',
                                color: '#dc2626',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '0.95rem' }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                        animation: 'spin 0.7s linear infinite',
                                        display: 'inline-block',
                                    }}
                                />
                                Masuk...
                            </span>
                        ) : 'Masuk'}
                    </button>
                </form>

                {/* Footer */}
                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: '#8a8fa3' }}>
                    Hanya untuk reseller terdaftar
                </p>
            </div>
        </div>
    );
}