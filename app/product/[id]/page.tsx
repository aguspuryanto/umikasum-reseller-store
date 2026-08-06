import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AddToCartSection from "@/components/AddToCartSection";
import type { Product } from "@/app/generated/prisma/client";

async function getProduct(id: string) {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

async function getRelated(category: string | null, excludeId: string): Promise<Product[]> {
  if (!category) return [];
  try {
    return await prisma.product.findMany({
      where: { category, id: { not: excludeId } },
      take: 4,
      orderBy: { no: 'asc' },
    });
  } catch {
    return [];
  }
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const related = await getRelated(product.category, product.id);
  const stock = product.stock ?? 0;

  return (
    <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#8a8fa3', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#8a8fa3', textDecoration: 'none' }}>Beranda</Link>
          <span>/</span>
          {product.category ? (
            <>
              <Link
                href={`/?category=${encodeURIComponent(product.category)}`}
                style={{ color: '#8a8fa3', textDecoration: 'none' }}
              >
                {product.category}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span style={{ color: '#383c4a', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '40px',
          }}
        >
          <style>{`
            @media (min-width: 900px) {
              .product-detail-grid { grid-template-columns: 460px minmax(0, 1fr) !important; }
            }
          `}</style>
          <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '40px' }}>
            {/* Image */}
            <div
              className="card"
              style={{
                height: '440px',
                background: '#f1f2f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <svg style={{ width: '80px', height: '80px', opacity: 0.5, color: '#c7c9d9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            {/* Details */}
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <span className="badge badge-brand">#{product.no}</span>
                {product.category && <span className="badge" style={{ background: '#f1f2f6', color: '#383c4a', border: '1px solid #e7e8ee' }}>{product.category}</span>}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#14161f',
                  marginBottom: '16px',
                  lineHeight: 1.3,
                }}
              >
                {product.name}
              </h1>

              <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                {formatRupiah(product.sellPrice)}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <span
                  className="badge"
                  style={{
                    background: stock > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                    color: stock > 0 ? '#059669' : '#dc2626',
                    border: `1px solid ${stock > 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  }}
                >
                  {stock > 0 ? `Stok tersedia: ${stock}` : 'Stok habis'}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #eef0f5', paddingTop: '24px' }}>
                <AddToCartSection product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#14161f' }}>
              Produk Serupa
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px',
              }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
