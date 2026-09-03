import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, context: any) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = context.params?.id;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await connectToDatabase();
    const ticket = await SupportTicket.findOne({ _id: id, userId: session.user.id });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = context.params?.id;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await connectToDatabase();
    const body = await request.json();

    const ticket = await SupportTicket.findOne({ _id: id, userId: session.user.id });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (body.message) {
      ticket.messages.push({
        sender: 'customer',
        message: body.message,
        attachment: body.attachment,
        createdAt: new Date()
      });
      // Assuming customer replying re-opens it if closed or just leaves it as new/investigating
      if (ticket.status === 'answered' || ticket.status === 'closed') {
        ticket.status = 'new';
      }
    }

    await ticket.save();

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
