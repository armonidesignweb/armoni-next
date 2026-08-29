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
            tr: prod.name.tr || prod.slug,
            en: prod.name.en || '',
            de: prod.name.de || '',
            ar: prod.name.ar || '',
          },
          description: {
            tr: prod.description.tr || '',
            en: prod.description.en || '',
            de: prod.description.de || '',
            ar: prod.description.ar || '',
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
