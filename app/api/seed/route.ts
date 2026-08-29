import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ALL_PRODUCTS } from '@/lib/products-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== 'armoni-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let addedCount = 0;

    for (const prod of ALL_PRODUCTS) {
      // Check if product exists
      const exists = await Product.findOne({ slug: prod.slug });
      if (!exists) {
        // Map hardcoded structure to Mongoose structure
        await Product.create({
          title: {
            tr: (typeof prod.name === 'string' ? prod.name : prod.name.tr) || prod.slug,
            en: typeof prod.name === 'object' ? prod.name.en : '',
            de: typeof prod.name === 'object' ? prod.name.de : '',
            ar: typeof prod.name === 'object' ? prod.name.ar : '',
          },
          description: {
            tr: (typeof prod.description === 'string' ? prod.description : prod.description?.tr) || '',
            en: typeof prod.description === 'object' ? prod.description?.en : '',
            de: typeof prod.description === 'object' ? prod.description?.de : '',
            ar: typeof prod.description === 'object' ? prod.description?.ar : '',
          },
          slug: prod.slug,
          categorySlug: prod.categorySlug,
          images: [prod.image],
          isActive: true,
          isFeatured: prod.badge === 'Bestseller' || prod.badge === 'Iconic',
          order: addedCount
        });
        addedCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Successfully seeded ${addedCount} products to MongoDB.` });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
