import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Announcement } from '@/models/Announcement';
import { User } from '@/models/User';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, context: any) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = context.params?.id;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await connectToDatabase();
    const body = await request.json();

    const announcement = await Announcement.findByIdAndUpdate(id, body, { new: true });
    
    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = context.params?.id;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await connectToDatabase();
    
    const announcement = await Announcement.findByIdAndDelete(id);
    
    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
