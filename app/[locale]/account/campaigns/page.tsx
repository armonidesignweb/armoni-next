import { connectToDatabase } from '@/lib/mongodb';
import { Campaign } from '@/models/Campaign';
import { getSession } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CustomerCampaignsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  
  await connectToDatabase();
  
  const currentDate = new Date();
  
  // Find active campaigns that have started and haven't ended yet
  const campaigns = await Campaign.find({ 
    isActive: true,
    startDate: { $lte: currentDate },
    $or: [{ endDate: null }, { endDate: { $gte: currentDate } }],
    $and: [
      { $or: [{ target: 'all' }, { targetUsers: session?.user.id }] }
    ]
  }).sort({ createdAt: -1 });

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif mb-6 text-white">Kampanyalar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => {
          const title = camp.title[locale as keyof typeof camp.title] || camp.title.en || camp.title.tr;
          const description = camp.description[locale as keyof typeof camp.description] || camp.description.en || camp.description.tr;

          const CardContent = (
            <div className="bg-neutral-900 border border-brand-500/20 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-brand-500/10 hover:border-brand-500/40 h-full flex flex-col relative">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1.5 uppercase rounded-bl-lg z-10">
                Kampanya
              </div>
              {camp.image && (
                <div className="relative w-full h-48">
                  <Image src={camp.image} alt={title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-xs text-brand-400 mb-2 font-medium">
                  <span>Başlangıç: {new Date(camp.startDate).toLocaleDateString(locale)}</span>
                  {camp.endDate && (
                    <span className="text-neutral-500">Bitiş: {new Date(camp.endDate).toLocaleDateString(locale)}</span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
                <p className="text-neutral-400 text-sm whitespace-pre-wrap flex-1">{description}</p>
                
                {camp.targetUrl && (
                  <div className="mt-4 pt-4 border-t border-neutral-800 text-brand-400 font-medium text-sm flex items-center justify-center group-hover:text-brand-300 transition-colors">
                    Kampanyayı İncele &rarr;
                  </div>
                )}
              </div>
            </div>
          );

          if (camp.targetUrl) {
            return (
              <Link key={camp._id.toString()} href={camp.targetUrl} className="block">
                {CardContent}
              </Link>
            );
          }

          return <div key={camp._id.toString()}>{CardContent}</div>;
        })}

        {campaigns.length === 0 && (
          <div className="col-span-full p-8 text-center bg-neutral-900 border border-neutral-800 rounded-xl">
            <p className="text-neutral-500">Şu an için aktif bir kampanya bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
