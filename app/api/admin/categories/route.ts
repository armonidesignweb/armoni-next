import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ order: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, image, isActive, order } = body;

    await connectToDatabase();
    const newCategory = await Category.create({
      slug,
      title, // expecting { tr: '...', en: '...', ... }
      image: image || '/images/placeholder.jpg',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Bu slug ile bir kategori zaten var.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { _id, slug, title, image, isActive, order } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Kategori ID gerekli' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Category.findByIdAndUpdate(
      _id,
      { $set: { slug, title, image, isActive, order } },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ category: updated });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Bu slug ile bir kategori zaten var.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Kategori ID gerekli' }, { status: 400 });
    }

    await connectToDatabase();
    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
