import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await connectToDatabase();

    const ticket = await SupportTicket.findOne({ _id: id, userId: session.user.id });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    ticket.messages.push({
      sender: 'customer',
      message: message,
      createdAt: new Date()
    });

    // Optionally update status if it was answered/closed?
    if (ticket.status === 'answered' || ticket.status === 'closed') {
      ticket.status = 'investigating'; // Customer replied, so it needs review
    }

    await ticket.save();

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error adding message to support ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
