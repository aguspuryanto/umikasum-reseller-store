'use client';

import { useState } from 'react';
import SliderForm from './SliderForm';
import SliderTable from './SliderTable';

export default function SlidersManager({ initialSliders }) {
    const [sliders, setSliders] = useState(initialSliders);
    const [editingSlider, setEditingSlider] = useState(null);

    const fetchSliders = async () => {
        try {
            const response = await fetch('/api/sliders');
            const data = await response.json();
            setSliders(data);
        } catch (error) {
            console.error('Error fetching sliders:', error);
        }
    };

    return (
        <div>
            <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#14161f', marginBottom: '4px' }}>
                    Slider
                </h1>
                <p style={{ color: '#5b6072', fontSize: '0.875rem' }}>Kelola banner slider di halaman utama</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
                <style>{`
                    @media (min-width: 1024px) {
                        .sliders-grid { grid-template-columns: 340px minmax(0, 1fr) !important; }
                    }
                `}</style>
                <div className="sliders-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
                    <div className="animate-fade-in">
                        <SliderForm
                            editingSlider={editingSlider}
                            onSliderAdded={fetchSliders}
                            onSliderEdited={() => {
                                fetchSliders();
                                setEditingSlider(null);
                            }}
                            onCancelEdit={() => setEditingSlider(null)}
                        />
                    </div>
                    <div className="animate-fade-in">
                        <SliderTable sliders={sliders} onSliderUpdated={fetchSliders} onEdit={setEditingSlider} />
                    </div>
                </div>
            </div>
        </div>
    );
}
