import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ALL_PRODUCTS } from '@/lib/products-data';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import { ArrowLeft } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = ALL_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };
  const productName = product.name[locale] || product.name.tr;
  return { title: `${productName} | Armoni Design` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  const product = ALL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const productName = product.name[locale] || product.name.tr;
  const categoryName = product.categoryName[locale] || product.categoryName.tr;

  // Use product images if available, fall back to main image
  const rawImages = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : ['/images/placeholder.jpg'];
  // De-duplicate image list
  const images = rawImages.filter((img, i, arr) => arr.indexOf(img) === i);

  return (
    <div className="pt-32 pb-28 bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Link
          href={`/${locale}/urunler`}
          className="inline-flex items-center text-sm text-neutral-400 hover:text-brand-300 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {t('back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery Component */}
          <div className="w-full">
            <ProductGallery images={images} />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
                {categoryName}
              </span>
              <h1 className="text-4xl md:text-5xl font-light text-white font-serif tracking-tight">
                {productName}
              </h1>
              {product.badge && (
                <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 text-xs uppercase tracking-widest rounded-full border border-brand-500/30">
                  {product.badge === 'Bestseller' ? t('bestseller') : product.badge}
                </span>
              )}
            </div>

            <div className="prose prose-invert prose-neutral max-w-none">
              <p className="text-neutral-400 font-light leading-relaxed">
                {product.description[locale] || product.description.tr || t('contactForDetails')}
              </p>
            </div>

            <div className="pt-8 border-t border-neutral-900">
              <p className="text-sm text-neutral-500 font-light mb-6">
                {t('customOrderText')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/905525833234?text=${encodeURIComponent(t('whatsappMessage', { product: productName }))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-emerald-500 text-white text-sm font-medium tracking-wide rounded-full hover:bg-emerald-600 transition-colors text-center"
                >
                  {t('whatsappInfo')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
