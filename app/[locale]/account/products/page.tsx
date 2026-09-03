import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductOverride } from '@/models/ProductOverride';
import { ALL_PRODUCTS } from '@/lib/products-data';
import { CATEGORIES } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function CustomerProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tCat = await getTranslations({ locale, namespace: 'categories' });

  await connectToDatabase();
  
  const dbProducts = await Product.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
  const overrides = await ProductOverride.find().lean();

  const combinedProducts = [
    ...ALL_PRODUCTS.map(p => {
      const override: any = overrides.find((o: any) => o.legacyProductId === p.id);
      if (override && override.isActive === false) return null;
      return {
        ...p,
        name: { tr: override?.title?.tr || p.name?.tr || '', en: p.name?.en || '', de: p.name?.de || '', ar: p.name?.ar || '' },
        categorySlug: override?.categorySlug || p.categorySlug,
        image: override?.image || override?.images?.[0] || p.image,
        images: override?.images?.length ? override.images : (override?.image ? [override.image] : (p.images || [])),
        price: override?.price,
        isStatic: true
      };
    }).filter((p): p is NonNullable<typeof p> => p !== null),
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

  return (
    <div>
      <h1 className="text-2xl font-bold font-sans mb-2 text-white">Ürünler ve Fiyatlar</h1>
      <p className="text-neutral-400 text-sm mb-8">Koleksiyonumuza ait tüm güncel ürünleri ve size özel fiyatlandırmaları buradan inceleyebilirsiniz.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {combinedProducts.length > 0 ? (
          combinedProducts.map((product) => {
            const rawCategory = product.categoryName;
            const categoryName = typeof rawCategory === 'string' && tCat(rawCategory) !== rawCategory
              ? tCat(rawCategory)
              : typeof rawCategory === 'object' ? (rawCategory[locale as keyof typeof rawCategory] || rawCategory.tr) : rawCategory;
            
            const productName = typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.tr) : product.name;

            return (
              <Link href={`/${locale}/urun/${product.slug}`} key={product.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group hover:border-brand-500/50 transition-colors block">
                <div className="relative aspect-square bg-neutral-950 p-6 flex items-center justify-center">
                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={productName as string} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">Görsel Yok</div>
                  )}
                </div>
                <div className="p-5 border-t border-neutral-800">
                  <div className="text-xs text-brand-400 uppercase tracking-widest mb-1">{categoryName as string || product.categorySlug.replace('-', ' ')}</div>
                  <h3 className="text-lg font-medium text-white font-sans mb-2 truncate" title={productName as string}>{productName as string}</h3>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
                    <span className="text-white font-medium">
                      {product.price ? `${product.price.toLocaleString('tr-TR')} ₺` : 'Fiyat Sorunuz'}
                    </span>
                    <span className="text-brand-400 transition-colors text-sm font-medium group-hover:text-white">İncele →</span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800">
            Katalogda ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
