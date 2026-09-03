import { connectToDatabase } from '@/lib/mongodb';
import { Announcement } from '@/models/Announcement';
import { getSession } from '@/lib/auth';
import Image from 'next/image';

export default async function CustomerAnnouncementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  
  await connectToDatabase();
  
  const announcements = await Announcement.find({ 
    isActive: true, 
    $or: [{ target: 'all' }, { targetUsers: session?.user.id }] 
  }).sort({ publishDate: -1, createdAt: -1 });

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif mb-6 text-white">Duyurular</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => {
          // Fallback logic for locale
          const title = ann.title[locale as keyof typeof ann.title] || ann.title.en || ann.title.tr;
          const content = ann.content[locale as keyof typeof ann.content] || ann.content.en || ann.content.tr;

          return (
            <div key={ann._id.toString()} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              {ann.image && (
                <div className="relative w-full h-48">
                  <Image src={ann.image} alt={title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="text-xs text-neutral-500 mb-2">
                  {ann.publishDate ? new Date(ann.publishDate).toLocaleDateString(locale) : new Date(ann.createdAt).toLocaleDateString(locale)}
                </div>
                <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
                <p className="text-neutral-400 text-sm whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          );
        })}

        {announcements.length === 0 && (
          <div className="col-span-full p-8 text-center bg-neutral-900 border border-neutral-800 rounded-xl">
            <p className="text-neutral-500">Şu an için yeni bir duyuru bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
