import { connectToDatabase } from '@/lib/mongodb';
import { Campaign } from '@/models/Campaign';
import AdminCampaignsClient from './AdminCampaignsClient';

export default async function AdminCampaignsPage() {
  await connectToDatabase();
  
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();
  
  const serializedCampaigns = campaigns.map((c: any) => ({
    _id: c._id.toString(),
    title: {
      tr: c.title?.tr || '',
      en: c.title?.en || '',
      de: c.title?.de || '',
      ru: c.title?.ru || '',
      ar: c.title?.ar || ''
    },
    description: {
      tr: c.description?.tr || '',
      en: c.description?.en || '',
      de: c.description?.de || '',
      ru: c.description?.ru || '',
      ar: c.description?.ar || ''
    },
    image: c.image || '',
    isActive: c.isActive,
    targetUrl: c.targetUrl || '',
    startDate: c.startDate ? c.startDate.toISOString() : null,
    endDate: c.endDate ? c.endDate.toISOString() : null,
  }));

  return <AdminCampaignsClient initialCampaigns={serializedCampaigns as any} />;
}
