import { connectToDatabase } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductOverride } from '@/models/ProductOverride';
import { ALL_PRODUCTS } from '@/lib/products-data';
import { CATEGORIES as STATIC_CATEGORIES } from '@/lib/data';
import AdminCategoriesClient from './AdminCategoriesClient';
import { getTranslations } from 'next-intl/server';

export default async function AdminCategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tCat = await getTranslations({ locale, namespace: 'categories' });

  await connectToDatabase();
  
  const dbCategories = await Category.find().sort({ order: 1, createdAt: -1 }).lean();
  
  // Create unified categories array
  const combinedCategories = [
    ...STATIC_CATEGORIES.map(c => ({
      _id: c.slug,
      slug: c.slug,
      title: { tr: tCat(c.key, { locale: 'tr' }) || c.key, en: tCat(c.key, { locale: 'en' }) || c.key, de: tCat(c.key, { locale: 'de' }) || c.key, ru: tCat(c.key, { locale: 'ru' }) || c.key, ar: tCat(c.key, { locale: 'ar' }) || c.key },
      image: c.image,
      isActive: true,
      isStatic: true
    })),
    ...dbCategories.map((c: any) => ({
      _id: c._id.toString(),
      slug: c.slug,
      title: { 
        tr: c.title?.tr || '',
        en: c.title?.en || '',
        de: c.title?.de || '',
        ru: c.title?.ru || '',
        ar: c.title?.ar || ''
      },
      image: c.image,
      isActive: c.isActive,
      isStatic: false
    }))
  ];

  const dbProducts = await Product.find().sort({ order: 1, createdAt: -1 }).lean();
  const overrides = await ProductOverride.find().lean();
  
  const combinedProducts = [
    ...ALL_PRODUCTS.map(p => {
      const override = overrides.find((o: any) => o.legacyProductId === p.id);
      return {
        _id: p.id,
        title: { tr: override?.title?.tr || p.name?.tr || '' },
        images: override?.images?.length ? override.images : (override?.image ? [override.image] : (p.images?.length ? p.images : [p.image])),
        categorySlug: override?.categorySlug || p.categorySlug,
        isActive: override?.isActive !== undefined ? override.isActive : true,
        isStatic: true,
      };
    }),
    ...dbProducts.map((p: any) => ({
      _id: p._id.toString(),
      title: { tr: p.title?.tr || '' },
      images: p.images || [],
      categorySlug: p.categorySlug,
      isActive: p.isActive,
      isStatic: false,
    }))
  ];

  return <AdminCategoriesClient initialCategories={combinedCategories} initialProducts={combinedProducts} />;
}
