import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/lib/products-data';
import { CATEGORIES } from '@/lib/data';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductOverride } from '@/models/ProductOverride';
import { getSession } from '@/lib/auth';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategori?: string; page?: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('productsTitle'),
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  const { kategori, page } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'products' });
  const tCat = await getTranslations({ locale, namespace: 'categories' });

  const session = await getSession();
  const isCustomer = session?.user?.role === 'customer' || session?.user?.role === 'admin';

  await connectToDatabase();
  const dbProducts = await Product.find({ isActive: true }).lean();
  const overrides = await ProductOverride.find().lean();

  const combinedProducts = [
    ...ALL_PRODUCTS.map(p => {
      const override: any = overrides.find((o: any) => o.legacyProductId === p.id);
      if (override && override.isActive === false) return null; // Skip if override disabled it
      return {
        ...p,
        name: { tr: override?.title?.tr || (typeof p.name === 'string' ? p.name : p.name?.tr || ''), en: p.name?.en || '', de: p.name?.de || '', ar: p.name?.ar || '' },
        categorySlug: override?.categorySlug || p.categorySlug,
        image: override?.image || override?.images?.[0] || p.image,
        images: override?.images?.length ? override.images : (override?.image ? [override.image] : (p.images || [])),
        price: override?.price,
        isStatic: true
      };
    }).filter(Boolean),
    ...dbProducts.map((p: any) => ({
      id: p._id.toString(),
      slug: p.slug,
      name: { tr: p.title?.tr || '', en: p.title?.en || '', de: p.title?.de || '', ar: p.title?.ar || '' },
      categorySlug: p.categorySlug,
      categoryName: CATEGORIES.find(c => c.slug === p.categorySlug)?.key || p.categorySlug,
      description: { tr: p.description?.tr || '' },
      image: p.images?.[0] || '/images/placeholder.jpg',
      images: p.images || [],
      price: p.price,
      isStatic: false
    }))
  ];

  const activeCategory = kategori;

  const currentPage = page ? parseInt(page, 10) : 1;
  const ITEMS_PER_PAGE = 12;

  const filteredProducts = activeCategory
    ? combinedProducts.filter((p) => p.categorySlug === activeCategory)
    : combinedProducts;

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /** Smart page numbers with ellipsis */
  function getPageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <div className="pt-32 pb-28 bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
            Armoni Design
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-white font-serif tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-x-auto pb-4 mb-12 no-scrollbar">
          <Link
            href={`/${locale}/urunler`}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
              !activeCategory
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 font-medium'
                : 'glass-card text-neutral-300 hover:text-white border border-white/10'
            }`}
          >
            {t('allProducts')} ({ALL_PRODUCTS.length})
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/urunler?kategori=${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat.slug
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 font-medium'
                  : 'glass-card text-neutral-300 hover:text-white border border-white/10'
              }`}
            >
              {tCat(cat.key)}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paginatedProducts.map((product) => {
                const productName =
                  typeof product.name === 'string'
                    ? product.name
                    : (product.name as Record<string, string>)[locale] ||
                      (product.name as Record<string, string>).tr ||
                      '';
                const catName =
                  typeof product.categoryName === 'string'
                    ? product.categoryName
                    : (product.categoryName as Record<string, string>)[locale] ||
                      (product.categoryName as Record<string, string>).tr ||
                      '';

                return (
                  <div
                    key={product.id}
                    className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-square w-full bg-neutral-900 rounded-t-2xl overflow-hidden">
                      <Image
                        src={product.image || '/images/placeholder.jpg'}
                        alt={productName}
                        fill
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 rtl:space-x-reverse">
                        <Link
                          href={`/${locale}/urun/${product.slug}`}
                          className="w-11 h-11 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-xl"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                    <div className="p-6 space-y-2 border-t border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                        {typeof catName === 'string' && tCat(catName) !== catName ? tCat(catName) : catName}
                      </span>
                      <h3 className="text-lg font-light text-white group-hover:text-brand-300 transition-colors">
                        {productName}
                      </h3>
                      {isCustomer && product.price && (
                        <div className="text-brand-400 font-medium">
                          ${product.price.toLocaleString()}
                        </div>
                      )}
                      <div className="pt-2 flex items-center justify-between">
                        <Link
                          href={`/${locale}/urun/${product.slug}`}
                          className="text-xs uppercase tracking-widest text-brand-400 hover:text-brand-300 font-medium transition-colors"
                        >
                          {t('viewDetails')} →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mt-16">
                {/* Prev */}
                <Link
                  href={`/${locale}/urunler?${new URLSearchParams({
                    ...(kategori ? { kategori } : {}),
                    page: Math.max(1, safePage - 1).toString(),
                  }).toString()}`}
                  className={`p-2 rounded-full border transition-colors ${
                    safePage === 1
                      ? 'border-white/10 text-neutral-600 pointer-events-none'
                      : 'border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>

                {pageNumbers.map((p, idx) =>
                  p === '...' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-10 h-10 flex items-center justify-center text-neutral-500 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={`/${locale}/urunler?${new URLSearchParams({
                        ...(kategori ? { kategori } : {}),
                        page: p.toString(),
                      }).toString()}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all ${
                        safePage === p
                          ? 'bg-brand-500 text-white font-medium'
                          : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}

                {/* Next */}
                <Link
                  href={`/${locale}/urunler?${new URLSearchParams({
                    ...(kategori ? { kategori } : {}),
                    page: Math.min(totalPages, safePage + 1).toString(),
                  }).toString()}`}
                  className={`p-2 rounded-full border transition-colors ${
                    safePage === totalPages
                      ? 'border-white/10 text-neutral-600 pointer-events-none'
                      : 'border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* Page info */}
            <p className="text-center text-neutral-600 text-xs mt-4">
              {t('showingRange', { total: String(totalItems), start: String(startIndex + 1), end: String(Math.min(startIndex + ITEMS_PER_PAGE, totalItems)) })}
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-sm font-light">{t('noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

