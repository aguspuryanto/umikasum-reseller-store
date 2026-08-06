import prisma from '@/lib/prisma';
import SlidersManager from '@/components/dashboard/SlidersManager';

async function getSliders() {
    try {
        return await prisma.slider.findMany({ orderBy: { order: 'asc' } });
    } catch {
        return [];
    }
}

export default async function SlidersPage() {
    const sliders = await getSliders();
    return <SlidersManager initialSliders={sliders} />;
}
