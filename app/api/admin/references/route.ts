import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Reference } from '@/models/Reference';
import { getSession } from '@/lib/auth';
import { REFERENCES } from '@/lib/references-data';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed');

    await connectToDatabase();

    if (seed === 'true') {
      const count = await Reference.countDocuments();
      if (count === 0) {
        const docs = REFERENCES.map((ref, index) => ({
          companyName: ref.name,
          logo: `/referanslar/renkli/${ref.file}`,
          link: ref.href !== '#' ? ref.href : '',
          isActive: true,
          order: index,
        }));
        await Reference.insertMany(docs);
      }
    }

    const references = await Reference.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(references);
  } catch (error) {
    console.error('Error fetching references:', error);
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
    const { companyName, logo, link, isActive } = body;

    if (!companyName || !logo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const lastRef = await Reference.findOne().sort({ order: -1 });
    const newOrder = lastRef ? lastRef.order + 1 : 0;

    const newRef = await Reference.create({
      companyName,
      logo,
      link: link || '',
      isActive: isActive !== undefined ? isActive : true,
      order: newOrder,
    });

    return NextResponse.json(newRef, { status: 201 });
  } catch (error) {
    console.error('Error creating reference:', error);
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
    const { action, orderedIds } = body;

    if (action === 'reorder' && Array.isArray(orderedIds)) {
      await connectToDatabase();
      const operations = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } },
        },
      }));
      await Reference.bulkWrite(operations);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error reordering references:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
