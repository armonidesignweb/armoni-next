import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import ProfileClient from './ProfileClient';
import { notFound } from 'next/navigation';

export default async function CustomerProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();

  if (!session || !session.user || !session.user.id) {
    return notFound();
  }

  await connectToDatabase();
  
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    return notFound();
  }

  const serializedProfile = {
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    isActive: user.isActive,
    createdAt: user.createdAt?.toISOString() || new Date().toISOString()
  };

  return <ProfileClient initialProfile={serializedProfile as any} locale={locale} />;
}
