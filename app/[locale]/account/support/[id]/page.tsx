import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';
import TicketDetailClient from './TicketDetailClient';
import { notFound } from 'next/navigation';

export default async function CustomerTicketPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const session = await getSession();

  if (!session || !session.user || !session.user.id) {
    return notFound();
  }

  await connectToDatabase();
  
  let ticket;
  try {
    ticket = await SupportTicket.findOne({ _id: id, userId: session.user.id }).lean();
  } catch (error) {
    // Catch invalid ObjectId
    return notFound();
  }

  if (!ticket) {
    return notFound();
  }

  const serializedTicket = {
    _id: ticket._id.toString(),
    subject: ticket.subject,
    status: ticket.status,
    messages: ticket.messages.map((m: any) => ({
      sender: m.sender,
      message: m.message,
      createdAt: m.createdAt.toISOString()
    })),
    createdAt: ticket.createdAt.toISOString()
  };

  return <TicketDetailClient ticket={serializedTicket as any} locale={locale} />;
}
