'use client';

import { useState } from 'react';

const PADDING = 12;

const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatCompact = (amount) => {
    if (amount >= 1_000_000) return `Rp${(amount / 1_000_000).toFixed(1)}jt`;
    if (amount >= 1_000) return `Rp${Math.round(amount / 1_000)}rb`;
    return `Rp${amount}`;
};

export default function DailySalesChart({ data }) {
    const [hovered, setHovered] = useState(null);
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const usable = 100 - PADDING * 2;
    const n = data.length;

    const xPct = (i) => (n <= 1 ? 50 : (i / (n - 1)) * 100);
    const yPct = (value) => 100 - PADDING - (value / maxValue) * usable;
    const baseline = 100 - PADDING;

    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPct(i)},${yPct(d.value)}`).join(' ');
    const areaPath = `${linePath} L ${xPct(n - 1)},${baseline} L ${xPct(0)},${baseline} Z`;

    const gridLines = [0, 0.5, 1].map(f => ({
        y: 100 - PADDING - f * usable,
        value: Math.round(maxValue * f),
    }));

    return (
        <div>
            <div style={{ position: 'relative', height: '220px' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {gridLines.map(g => (
                        <line key={g.y} x1="0" y1={g.y} x2="100" y2={g.y} stroke="#eef0f5" strokeWidth="0.4" />
                    ))}

                    <path d={areaPath} fill="#6366f1" opacity="0.08" stroke="none" />
                    <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="0.7" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                    {data.map((d, i) => (
                        <g key={d.label}>
                            <circle
                                cx={xPct(i)}
                                cy={yPct(d.value)}
                                r="3"
                                fill="transparent"
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(prev => (prev === i ? null : prev))}
                                style={{ cursor: 'pointer' }}
                            />
                            <circle
                                cx={xPct(i)}
                                cy={yPct(d.value)}
                                r={hovered === i ? '1.6' : '1.1'}
                                fill="#6366f1"
                                stroke="#ffffff"
                                strokeWidth="0.6"
                                style={{ pointerEvents: 'none', transition: 'r 0.15s ease' }}
                            />
                        </g>
                    ))}
                </svg>

                {gridLines.map(g => (
                    <span
                        key={g.y}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: `${g.y}%`,
                            transform: 'translateY(-50%)',
                            fontSize: '0.68rem',
                            color: '#8a8fa3',
                            background: '#ffffff',
                            paddingRight: '4px',
                        }}
                    >
                        {formatCompact(g.value)}
                    </span>
                ))}

                {hovered !== null && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${xPct(hovered)}%`,
                            top: `${yPct(data[hovered].value)}%`,
                            transform: 'translate(-50%, -130%)',
                            background: '#14161f',
                            color: '#fff',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            zIndex: 5,
                            boxShadow: '0 8px 20px rgba(20,22,31,0.25)',
                        }}
                    >
                        <div style={{ fontWeight: 700 }}>{formatRupiah(data[hovered].value)}</div>
                        <div style={{ opacity: 0.7, fontSize: '0.7rem' }}>{data[hovered].label}</div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                {data.map((d, i) => (
                    <span
                        key={d.label}
                        style={{
                            fontSize: '0.65rem',
                            color: hovered === i ? '#4f46e5' : '#8a8fa3',
                            fontWeight: hovered === i ? 700 : 400,
                            flex: 1,
                            textAlign: i === 0 ? 'left' : i === n - 1 ? 'right' : 'center',
                        }}
                    >
                        {i % Math.ceil(n / 7) === 0 ? d.label : ''}
                    </span>
                ))}
            </div>
        </div>
    );
}
