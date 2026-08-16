'use client';

import { useEffect } from 'react';

export default function Modal({ open, onClose, children }) {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(20,22,31,0.5)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '40px 16px',
                overflowY: 'auto',
                zIndex: 1000,
            }}
            className="animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '520px',
                    margin: 'auto',
                }}
            >
                {children}
            </div>
        </div>
    );
}
