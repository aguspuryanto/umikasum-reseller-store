import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import ProductsManager from '@/components/dashboard/ProductsManager';

export const dynamic = 'force-dynamic';

async function getProducts() {
    try {
        return await prisma.product.findMany({ orderBy: { no: 'asc' } });
    } catch {
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsManager initialProducts={products} />
        </Suspense>
    );
}

