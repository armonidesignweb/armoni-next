import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';
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

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (body.action === 'updateStatus' && body.status) {
      ticket.status = body.status;
    } else if (body.action === 'reply' && body.message) {
      ticket.messages.push({
        sender: 'admin',
        message: body.message,
        attachment: body.attachment,
        createdAt: new Date()
      });
      ticket.status = 'answered'; // Auto update status to answered
    }

    await ticket.save();

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
