import CustomerSupportClient from './CustomerSupportClient';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';

export default async function CustomerSupportPage() {
  const session = await getSession();
  
  if (!session?.user) {
    return <div>Oturum açmanız gerekiyor.</div>;
  }

  await connectToDatabase();
  
  const tickets = await SupportTicket.find({ userId: session.user.id }).sort({ updatedAt: -1 }).lean();
  
  const serializedTickets = tickets.map((t: any) => ({
    _id: t._id.toString(),
    subject: t.subject,
    status: t.status,
    createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    updatedAt: t.updatedAt ? t.updatedAt.toISOString() : null,
    messages: (t.messages || []).map((m: any) => ({
      _id: m._id ? m._id.toString() : Math.random().toString(),
      sender: m.sender,
      message: m.message,
      attachment: m.attachment,
      createdAt: m.createdAt ? m.createdAt.toISOString() : null,
    }))
  }));

  return <CustomerSupportClient initialTickets={serializedTickets as any} />;
}
