import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Campaign } from '@/models/Campaign';
import { Announcement } from '@/models/Announcement';

export default async function CustomerDashboard() {
  const session = await getSession();
  
  await connectToDatabase();
  
  const activeCampaigns = await Campaign.find({ isActive: true }).sort({ createdAt: -1 }).limit(3);
  const recentAnnouncements = await Announcement.find({ isActive: true, $or: [{ target: 'all' }, { targetUsers: session?.user.id }] }).sort({ createdAt: -1 }).limit(3);

  return (
    <div>
      <h1 className="text-2xl font-bold font-sans mb-6 text-white">Genel Bakış</h1>
      
      <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-medium text-white mb-2">Hoş Geldiniz, {session?.user.company || session?.user.name}</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Müşteri panelinize hoş geldiniz. Sol menüden size özel ürün fiyatlarına erişebilir, yeni kampanyaları inceleyebilir ve bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm uppercase tracking-widest text-neutral-400 font-medium mb-4">Son Duyurular</h3>
          {recentAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {recentAnnouncements.map(ann => (
                <div key={ann._id.toString()} className="bg-neutral-900 border border-neutral-800 p-5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{ann.title.tr}</h4>
                  <p className="text-neutral-400 text-sm">{ann.content.tr}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm bg-neutral-900 p-4 rounded-lg">Şu an için yeni bir duyuru bulunmuyor.</p>
          )}
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-neutral-400 font-medium mb-4">Aktif Kampanyalar</h3>
          {activeCampaigns.length > 0 ? (
            <div className="space-y-4">
              {activeCampaigns.map(camp => (
                <div key={camp._id.toString()} className="bg-neutral-900 border border-brand-500/30 p-5 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-bl-lg">Kampanya</div>
                  <h4 className="text-white font-medium mb-2 mt-1">{camp.title.tr}</h4>
                  <p className="text-neutral-400 text-sm">{camp.description.tr}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm bg-neutral-900 p-4 rounded-lg">Şu an için aktif bir kampanya bulunmuyor.</p>
          )}
        </div>
      </div>
    </div>
  );
}
