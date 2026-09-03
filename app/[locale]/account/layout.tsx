import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  Ticket, 
  Megaphone, 
  LifeBuoy, 
  User as UserIcon,
} from 'lucide-react';
import LogoutButton from '../admin/(protected)/LogoutButton';

export default async function AccountLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session || session.user.role !== 'customer') {
    redirect(locale === 'tr' ? '/login' : `/${locale}/login`);
  }

  const navItems = [
    { name: 'Genel Bakış', href: `/${locale}/account`, icon: LayoutDashboard },
    { name: 'Ürünler & Fiyatlar', href: `/${locale}/account/products`, icon: Package },
    { name: 'Kampanyalar', href: `/${locale}/account/campaigns`, icon: Ticket },
    { name: 'Duyurular', href: `/${locale}/account/announcements`, icon: Megaphone },
    { name: 'Yardım & Destek', href: `/${locale}/account/support`, icon: LifeBuoy },
    { name: 'Profil', href: `/${locale}/account/profile`, icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800 flex flex-col justify-center">
          <div className="relative w-44 h-8 mb-2">
            <Image
              src="/images/2024/12/armoni-beyaz.png"
              alt="Armoni Design"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <p className="text-xs text-brand-400 uppercase tracking-widest">Müşteri Portalı</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className="flex items-center space-x-3 px-6 py-3 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-brand-400" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-neutral-800">
          <LogoutButton redirectUrl={`/${locale}/login`} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-neutral-950 min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  );
}
