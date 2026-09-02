import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductOverride } from '@/models/ProductOverride';
import { ALL_PRODUCTS } from '@/lib/products-data';
import AdminProductsClient from './AdminProductsClient';

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await connectToDatabase();
  
  const dbProducts = await Product.find().sort({ order: 1, createdAt: -1 }).lean();
  const overrides = await ProductOverride.find().lean();
  
  const combinedProducts = [
    // 164 Static Products (with Overrides Applied)
    ...ALL_PRODUCTS.map(p => {
      const override = overrides.find((o: any) => o.legacyProductId === p.id);
      return {
        _id: p.id,
        title: { 
          tr: override?.title?.tr || p.name?.tr || '',
          en: override?.title?.en || p.name?.en || '',
          de: override?.title?.de || p.name?.de || '',
          ru: override?.title?.ru || p.name?.ru || '',
          ar: override?.title?.ar || p.name?.ar || ''
        },
        description: {
          tr: override?.description?.tr || p.description?.tr || '',
          en: override?.description?.en || p.description?.en || '',
          de: override?.description?.de || p.description?.de || '',
          ru: override?.description?.ru || p.description?.ru || '',
          ar: override?.description?.ar || p.description?.ar || ''
        },
        images: override?.images?.length ? override.images : (override?.image ? [override.image] : (p.images?.length ? p.images : [p.image])),
        categorySlug: override?.categorySlug || p.categorySlug,
        isActive: override?.isActive !== undefined ? override.isActive : true,
        price: override?.price,
        isStatic: true,
        hasOverride: !!override
      };
    }),
    // Dynamic DB Products
    ...dbProducts.map((p: any) => ({
      _id: p._id.toString(),
      title: { 
        tr: p.title?.tr || '',
        en: p.title?.en || '',
        de: p.title?.de || '',
        ru: p.title?.ru || '',
        ar: p.title?.ar || ''
      },
      description: {
        tr: p.description?.tr || '',
        en: p.description?.en || '',
        de: p.description?.de || '',
        ru: p.description?.ru || '',
        ar: p.description?.ar || ''
      },
      images: p.images || [],
      categorySlug: p.categorySlug,
      isActive: p.isActive,
      price: p.price,
      isStatic: false,
      hasOverride: false
    }))
  ];

  return <AdminProductsClient initialProducts={combinedProducts as any} />;
}
