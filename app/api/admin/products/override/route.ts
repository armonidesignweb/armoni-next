import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProductOverride } from '@/models/ProductOverride';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { legacyProductId, price, isActive, title, description, categorySlug, images } = body;

    if (!legacyProductId) {
      return NextResponse.json({ error: 'legacyProductId is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Build update object with only provided fields
    const updateFields: Record<string, any> = {};
    if (price !== undefined) {
      updateFields.price = price === '' || price === null ? undefined : Number(price);
    }
    if (isActive !== undefined) {
      updateFields.isActive = isActive;
    }
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (categorySlug !== undefined) updateFields.categorySlug = categorySlug;
    if (images !== undefined) updateFields.images = images;

    // Upsert: create if doesn't exist, update if exists
    const override = await ProductOverride.findOneAndUpdate(
      { legacyProductId },
      { $set: updateFields },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, override });
  } catch (error) {
    console.error('Error updating product override:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
