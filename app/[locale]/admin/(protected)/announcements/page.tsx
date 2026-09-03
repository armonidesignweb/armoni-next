import { connectToDatabase } from '@/lib/mongodb';
import { Announcement } from '@/models/Announcement';
import AdminAnnouncementsClient from './AdminAnnouncementsClient';

export default async function AdminAnnouncementsPage() {
  await connectToDatabase();
  
  const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();
  
  const serializedAnnouncements = announcements.map((a: any) => ({
    _id: a._id.toString(),
    title: {
      tr: a.title?.tr || '',
      en: a.title?.en || '',
      de: a.title?.de || '',
      ru: a.title?.ru || '',
      ar: a.title?.ar || ''
    },
    content: {
      tr: a.content?.tr || '',
      en: a.content?.en || '',
      de: a.content?.de || '',
      ru: a.content?.ru || '',
      ar: a.content?.ar || ''
    },
    image: a.image || '',
    isActive: a.isActive,
    publishDate: a.publishDate ? a.publishDate.toISOString() : null,
  }));

  return <AdminAnnouncementsClient initialAnnouncements={serializedAnnouncements as any} />;
}
