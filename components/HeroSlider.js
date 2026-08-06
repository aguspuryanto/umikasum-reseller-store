'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

function arrowStyle(side) {
    return {
        position: 'absolute',
        top: '50%',
        [side]: 'clamp(12px, 3vw, 32px)',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(255,255,255,0.16)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        fontSize: '1.5rem',
        lineHeight: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        transition: 'background 0.2s ease',
    };
}

function DefaultSlide() {
    return (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a0a12 0%, #14142b 100%)' }}>
            <div
                style={{
                    position: 'absolute',
                    top: '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '400px',
                    background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '24px',
                }}
            >
                <div
                    className="badge badge-brand"
                    style={{ marginBottom: '20px', display: 'inline-flex', fontSize: '0.75rem', padding: '6px 16px' }}
                >
                    ✨ Official Reseller
                </div>
                <h1
                    className="gradient-text"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '12px' }}
                >
                    Umi Kasum
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', maxWidth: '440px' }}>
                    Temukan produk pilihan dengan harga terbaik untuk para reseller kami.
                </p>
            </div>
        </div>
    );
}

export default function HeroSlider({ slides }) {
    const hasSlides = Boolean(slides?.length);
    const count = hasSlides ? slides.length : 1;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
    const next = useCallback(() => goTo(index + 1), [index, goTo]);
    const prev = useCallback(() => goTo(index - 1), [index, goTo]);

    useEffect(() => {
        if (!hasSlides || slides.length <= 1 || paused) return;
        const timer = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [hasSlides, slides, paused]);

    return (
        <section
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onKeyDown={e => {
                if (e.key === 'ArrowLeft') prev();
                if (e.key === 'ArrowRight') next();
            }}
            tabIndex={hasSlides && slides.length > 1 ? 0 : -1}
            style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(300px, 46vw, 480px)',
                overflow: 'hidden',
                background: '#0a0a12',
                outline: 'none',
            }}
        >
            {hasSlides ? (
                slides.map((slide, i) => (
                    <div
                        key={slide.id}
                        aria-hidden={i !== index}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: i === index ? 1 : 0,
                            transition: 'opacity 0.6s ease',
                            pointerEvents: i === index ? 'auto' : 'none',
                        }}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title || 'Slider'}
                            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                        />
                        {(slide.title || slide.subtitle) && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    padding: '32px clamp(20px, 6vw, 80px) clamp(40px, 8vw, 72px)',
                                    color: '#fff',
                                    maxWidth: '640px',
                                }}
                            >
                                {slide.title && (
                                    <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                        {slide.title}
                                    </h2>
                                )}
                                {slide.subtitle && (
                                    <p style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', opacity: 0.85, marginBottom: slide.link ? '16px' : 0 }}>
                                        {slide.subtitle}
                                    </p>
                                )}
                                {slide.link && (
                                    <Link href={slide.link} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 24px' }}>
                                        Lihat Sekarang
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <DefaultSlide />
            )}

            {hasSlides && slides.length > 1 && (
                <>
                    {/* <button onClick={prev} aria-label="Slide sebelumnya" style={arrowStyle('left')}>‹</button>
                    <button onClick={next} aria-label="Slide berikutnya" style={arrowStyle('right')}>›</button> */}
                    <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Ke slide ${i + 1}`}
                                style={{
                                    width: i === index ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '999px',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    background: i === index ? '#ffffff' : 'rgba(255,255,255,0.45)',
                                    transition: 'all 0.25s ease',
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
