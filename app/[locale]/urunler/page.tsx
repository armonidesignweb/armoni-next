import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_PRODUCTS, CATEGORIES } from '@/lib/data';
import { MessageCircle, Eye } from 'lucide-react';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategori?: string }>;
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
  const { kategori } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'products' });
  const tCat = await getTranslations({ locale, namespace: 'categories' });

  const activeCategory = kategori;

  const filteredProducts = activeCategory
    ? FEATURED_PRODUCTS.filter((p) => p.categorySlug === activeCategory)
    : FEATURED_PRODUCTS;

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
            Tüm Ürünler ({FEATURED_PRODUCTS.length})
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-neutral-950 p-6 flex items-center justify-center img-zoom-container">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
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
                    {product.categoryName}
                  </span>
                  <h3 className="text-lg font-light text-white group-hover:text-brand-300 transition-colors">
                    {product.name}
                  </h3>
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
            ))}
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
