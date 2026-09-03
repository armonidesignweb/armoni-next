import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Campaign } from '@/models/Campaign';
import { SupportTicket } from '@/models/SupportTicket';
import { ALL_PRODUCTS } from '@/lib/products-data';

export default async function AdminDashboard() {
  const session = await getSession();
  
  await connectToDatabase();
  
  const dbProductCount = await Product.countDocuments();
  const productCount = ALL_PRODUCTS.length + dbProductCount;
  const customerCount = await User.countDocuments({ role: 'customer' });
  const campaignCount = await Campaign.countDocuments({ isActive: true });
  const ticketCount = await SupportTicket.countDocuments({ status: 'new' });

  const stats = [
    { label: 'Toplam Ürün', value: productCount },
    { label: 'Toplam Müşteri', value: customerCount },
    { label: 'Aktif Kampanyalar', value: campaignCount },
    { label: 'Yeni Destek Mesajları', value: ticketCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-sans mb-6 text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-neutral-400 text-sm uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-light text-brand-400">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Hoş Geldiniz, {session?.user.name}</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Armoni Design CMS paneline giriş yaptınız. Sol menüden ürünlerinizi, müşterilerinizi ve site içeriklerini yönetebilirsiniz. 
          Değişiklikler anında canlıya yansıyacaktır. Lütfen veri silme işlemlerinde dikkatli olunuz.
        </p>
      </div>
    </div>
  );
}
