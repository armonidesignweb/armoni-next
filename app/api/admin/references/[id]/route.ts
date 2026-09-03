import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Reference } from '@/models/Reference';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { companyName, logo, link, isActive, order } = body;

    await connectToDatabase();

    const updateFields: any = {};
    if (companyName !== undefined) updateFields.companyName = companyName;
    if (logo !== undefined) updateFields.logo = logo;
    if (link !== undefined) updateFields.link = link;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (order !== undefined) updateFields.order = order;

    const updatedRef = await Reference.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedRef) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json(updatedRef);
  } catch (error) {
    console.error('Error updating reference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();
    const deleted = await Reference.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
