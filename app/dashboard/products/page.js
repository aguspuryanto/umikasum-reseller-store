import prisma from '@/lib/prisma';
import ProductsManager from '@/components/dashboard/ProductsManager';

async function getProducts() {
    try {
        return await prisma.product.findMany({ orderBy: { no: 'asc' } });
    } catch {
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();
    return <ProductsManager initialProducts={products} />;
}
