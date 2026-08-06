import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import prisma from "@/lib/prisma";
import type { Prisma, Product, Slider } from "@/app/generated/prisma/client";

async function getSliders(): Promise<Slider[]> {
  try {
    return await prisma.slider.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map(r => r.category).filter((c): c is string => Boolean(c));
  } catch {
    return [];
  }
}

type ProductFilters = {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
};

async function getProducts(filters: ProductFilters): Promise<Product[]> {
  try {
    const { category, q, minPrice, maxPrice } = filters;
    const where: Prisma.ProductWhereInput = {};

    if (category) where.category = category;
    if (q) where.name = { contains: q, mode: 'insensitive' };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.sellPrice = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    return await prisma.product.findMany({ where, orderBy: { no: 'asc' } });
  } catch {
    return [];
  }
}

const parsePrice = (value?: string) => {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const { category, q, minPrice: minPriceParam, maxPrice: maxPriceParam } = await searchParams;
  const minPrice = parsePrice(minPriceParam);
  const maxPrice = parsePrice(maxPriceParam);
  const hasActiveFilters = Boolean(category || q || minPrice !== undefined || maxPrice !== undefined);

  const [products, categories, sliders] = await Promise.all([
    getProducts({ category, q, minPrice, maxPrice }),
    getCategories(),
    getSliders(),
  ]);

  return (
    <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
      {/* Hero Slider (full width) */}
      <HeroSlider slides={sliders} />

      {/* Stats Bar */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #eef0f5' }}>
        <div
          className="animate-fade-in"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(24px, 6vw, 48px)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
              {products.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8a8fa3', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Produk
            </div>
          </div>
          <div style={{ width: '1px', background: '#eef0f5' }} />
          <div style={{ textAlign: 'center' }}>
            <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.5rem' }}>100%</div>
            <div style={{ fontSize: '0.72rem', color: '#8a8fa3', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Original
            </div>
          </div>
          <div style={{ width: '1px', background: '#eef0f5' }} />
          <div style={{ textAlign: 'center' }}>
            <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.5rem' }}>Fast</div>
            <div style={{ fontSize: '0.72rem', color: '#8a8fa3', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pengiriman
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '28px' }}>
          <style>{`
            @media (min-width: 1024px) {
              .shop-grid { grid-template-columns: 260px minmax(0, 1fr) !important; }
            }
          `}</style>
          <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '28px' }}>
            {/* Filter Sidebar */}
            <aside className="animate-fade-in">
              <form method="GET" action="/" className="card" style={{ padding: '22px 20px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#14161f', marginBottom: '20px' }}>
                  Filter Produk
                </h2>

                <div style={{ marginBottom: '22px' }}>
                  <label className="label-dark" htmlFor="q">Cari Produk</label>
                  <input
                    id="q"
                    type="text"
                    name="q"
                    defaultValue={q || ''}
                    placeholder="Nama produk..."
                    className="input-dark"
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label className="label-dark">Kategori</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#383c4a', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="category"
                        value=""
                        defaultChecked={!category}
                        style={{ width: '15px', height: '15px', accentColor: '#6366f1' }}
                      />
                      Semua Kategori
                    </label>
                    {categories.map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#383c4a', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          defaultChecked={category === cat}
                          style={{ width: '15px', height: '15px', accentColor: '#6366f1' }}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label className="label-dark">Rentang Harga (Rp)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      name="minPrice"
                      min="0"
                      defaultValue={minPrice ?? ''}
                      placeholder="Min"
                      className="input-dark"
                    />
                    <span style={{ color: '#8a8fa3' }}>–</span>
                    <input
                      type="number"
                      name="maxPrice"
                      min="0"
                      defaultValue={maxPrice ?? ''}
                      placeholder="Max"
                      className="input-dark"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px' }}>
                  Terapkan Filter
                </button>

                {hasActiveFilters && (
                  <Link
                    href="/"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: '12px',
                      fontSize: '0.8rem',
                      color: '#8a8fa3',
                      textDecoration: 'none',
                    }}
                  >
                    Reset Filter
                  </Link>
                )}
              </form>
            </aside>

            {/* Grid */}
            <div>
              <p style={{ fontSize: '0.85rem', color: '#5b6072', marginBottom: '16px' }}>
                {products.length} produk ditemukan
              </p>

              {products.length === 0 ? (
                <div
                  className="card"
                  style={{
                    textAlign: 'center',
                    padding: '80px 24px',
                    color: '#8a8fa3',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
                  <p style={{ fontSize: '1.1rem' }}>
                    {hasActiveFilters ? 'Tidak ada produk yang cocok dengan filter kamu.' : 'Belum ada produk tersedia.'}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {products.map((product, i) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
