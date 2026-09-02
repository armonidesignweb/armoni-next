import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ALL_PRODUCTS } from '@/lib/products-data';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import { ArrowLeft } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductOverride } from '@/models/ProductOverride';
import { getSession } from '@/lib/auth';
import { CATEGORIES } from '@/lib/data';

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
  const tCat = await getTranslations({ locale, namespace: 'categories' });

  const session = await getSession();
  const isCustomer = session?.user?.role === 'customer' || session?.user?.role === 'admin';

  let product: any = ALL_PRODUCTS.find((p) => p.slug === slug);
  let price: number | undefined;

  await connectToDatabase();

  if (product) {
    const override = await ProductOverride.findOne({ legacyProductId: product.id }).lean();
    if (override) {
      if (override.isActive === false) notFound();
      const { Category } = await import('@/models/Category');
      const catSlug = override.categorySlug || product.categorySlug;
      const dbCategory = await Category.findOne({ slug: catSlug }).lean();
      
      let catName = catSlug;
      if (dbCategory) {
        catName = dbCategory.title?.[locale] || dbCategory.title?.tr || catSlug;
      } else {
        catName = CATEGORIES.find(c => c.slug === catSlug)?.key || catSlug;
      }

      product = {
        ...product,
        name: { 
          tr: override.title?.tr || product.name?.tr || '', 
          en: override.title?.en || product.name?.en || '', 
          de: override.title?.de || product.name?.de || '', 
          ru: override.title?.ru || product.name?.ru || '', 
          ar: override.title?.ar || product.name?.ar || '' 
        },
        description: { 
          tr: override.description?.tr || product.description?.tr || '',
          en: override.description?.en || product.description?.en || '',
          de: override.description?.de || product.description?.de || '',
          ru: override.description?.ru || product.description?.ru || '',
          ar: override.description?.ar || product.description?.ar || ''
        },
        categorySlug: catSlug,
        categoryName: catName,
        image: override.image || override.images?.[0] || product.image,
        images: override.images?.length ? override.images : (override.image ? [override.image] : (product.images || [])),
      };
      price = override.price;
    }
  } else {
    const dbProduct = await Product.findOne({ slug, isActive: true }).lean();
    
    if (!dbProduct) {
      notFound();
    }
    const { Category } = await import('@/models/Category');
    const dbCategory = await Category.findOne({ slug: dbProduct.categorySlug }).lean();
    let catName = dbProduct.categorySlug;
    if (dbCategory) {
      catName = dbCategory.title?.[locale] || dbCategory.title?.tr || dbProduct.categorySlug;
    } else {
      catName = CATEGORIES.find(c => c.slug === dbProduct.categorySlug)?.key || dbProduct.categorySlug;
    }

    product = {
      id: dbProduct._id.toString(),
      slug: dbProduct.slug,
      name: { 
        tr: dbProduct.title?.tr || '', 
        en: dbProduct.title?.en || '', 
        de: dbProduct.title?.de || '', 
        ru: dbProduct.title?.ru || '', 
        ar: dbProduct.title?.ar || '' 
      },
      categorySlug: dbProduct.categorySlug,
      categoryName: catName,
      description: { 
        tr: dbProduct.description?.tr || '',
        en: dbProduct.description?.en || '',
        de: dbProduct.description?.de || '',
        ru: dbProduct.description?.ru || '',
        ar: dbProduct.description?.ar || ''
      },
      image: dbProduct.images?.[0] || '/images/placeholder.jpg',
      images: dbProduct.images || [],
    };
    price = dbProduct.price;
  }

  const productName = product.name[locale] || product.name.tr;
  const categoryName = typeof product.categoryName === 'string' && tCat(product.categoryName) !== product.categoryName 
    ? tCat(product.categoryName) 
    : product.categoryName[locale] || product.categoryName.tr || product.categoryName;

  // Use product images if available, fall back to main image
  const rawImages = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : ['/images/placeholder.jpg'];
  // De-duplicate image list
  const images = rawImages.filter((img: string, i: number, arr: string[]) => arr.indexOf(img) === i);

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
              <h1 className="text-4xl md:text-5xl font-light text-white font-serif tracking-tight">
                {productName}
              </h1>
              {product.badge && (
                <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 text-xs uppercase tracking-widest rounded-full border border-brand-500/30">
                  {product.badge === 'Bestseller' ? t('bestseller') : product.badge}
                </span>
              )}
              {session?.user && price && (
                <div className="text-2xl text-brand-400 font-medium mt-4">
                  {price.toLocaleString('tr-TR')} ₺
                </div>
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
