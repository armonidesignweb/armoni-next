import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';
import SupportClient from './SupportClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomerSupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();

  if (!session || !session.user || !session.user.id) {
    return notFound();
  }

  await connectToDatabase();
  
  const tickets = await SupportTicket.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean();

  const serializedTickets = tickets.map((t: any) => ({
    _id: t._id.toString(),
    subject: t.subject,
    status: t.status,
    createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    updatedAt: t.updatedAt ? t.updatedAt.toISOString() : null,
  }));

  return <SupportClient initialTickets={serializedTickets as any} locale={locale} />;
}
