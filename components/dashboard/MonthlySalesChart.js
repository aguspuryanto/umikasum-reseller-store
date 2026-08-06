'use client';

import { useState } from 'react';

const PADDING = 10;

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatCompact = (amount) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}jt`;
    if (amount >= 1_000) return `${Math.round(amount / 1_000)}rb`;
    return `${amount}`;
};

function roundedTopRectPath(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height);
    return `M ${x},${y + r}
        Q ${x},${y} ${x + r},${y}
        L ${x + width - r},${y}
        Q ${x + width},${y} ${x + width},${y + r}
        L ${x + width},${y + height}
        L ${x},${y + height}
        Z`;
}

export default function MonthlySalesChart({ data }) {
    const [hovered, setHovered] = useState(null);
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const usable = 100 - PADDING * 2 - 10;
    const n = data.length;
    const band = 100 / n;
    const barWidth = band * 0.45;

    const barTop = (value) => PADDING + 10 + (1 - value / maxValue) * usable;
    const baseline = PADDING + 10 + usable;

    return (
        <div>
            <div style={{ position: 'relative', height: '220px' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <line x1="0" y1={baseline} x2="100" y2={baseline} stroke="#e7e8ee" strokeWidth="0.4" />

                    {data.map((d, i) => {
                        const x = i * band + (band - barWidth) / 2;
                        const top = barTop(d.value);
                        const height = baseline - top;
                        const isHovered = hovered === i;
                        return (
                            <g key={d.label}>
                                <path
                                    d={roundedTopRectPath(x, top, barWidth, height, 1.6)}
                                    fill={isHovered ? '#4f46e5' : '#6366f1'}
                                    style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(prev => (prev === i ? null : prev))}
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={top - 2.5}
                                    textAnchor="middle"
                                    fontSize="3.6"
                                    fill={isHovered ? '#4f46e5' : '#5b6072'}
                                    fontWeight={isHovered ? '700' : '600'}
                                >
                                    {formatCompact(d.value)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div style={{ display: 'flex', marginTop: '8px' }}>
                {data.map((d, i) => (
                    <span
                        key={d.label}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: '0.72rem',
                            color: hovered === i ? '#4f46e5' : '#8a8fa3',
                            fontWeight: hovered === i ? 700 : 500,
                        }}
                    >
                        {d.label}
                    </span>
                ))}
            </div>

            {hovered !== null && (
                <p style={{ marginTop: '4px', fontSize: '0.78rem', color: '#5b6072', textAlign: 'center' }}>
                    {data[hovered].label}: <strong style={{ color: '#14161f' }}>{formatRupiah(data[hovered].value)}</strong>
                </p>
            )}
        </div>
    );
}
