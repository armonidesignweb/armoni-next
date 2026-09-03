import { connectToDatabase } from '@/lib/mongodb';
import { SupportTicket } from '@/models/SupportTicket';
import AdminSupportClient from './AdminSupportClient';
import { User } from '@/models/User';

export default async function AdminSupportPage() {
  await connectToDatabase();
  
  // Need to make sure User model is registered before populate
  User.init();

  const tickets = await SupportTicket.find()
    .populate('userId', 'name email company phone')
    .sort({ updatedAt: -1 })
    .lean();
  
  const serializedTickets = tickets.map((t: any) => ({
    _id: t._id.toString(),
    subject: t.subject,
    status: t.status,
    createdAt: t.createdAt ? t.createdAt.toISOString() : null,
    updatedAt: t.updatedAt ? t.updatedAt.toISOString() : null,
    user: t.userId ? {
      name: t.userId.name,
      email: t.userId.email,
      company: t.userId.company,
      phone: t.userId.phone
    } : null,
    messages: (t.messages || []).map((m: any) => ({
      _id: m._id ? m._id.toString() : Math.random().toString(),
      sender: m.sender,
      message: m.message,
      attachment: m.attachment,
      createdAt: m.createdAt ? m.createdAt.toISOString() : null,
    }))
  }));

  return <AdminSupportClient initialTickets={serializedTickets as any} />;
}
