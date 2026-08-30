import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Image as ImageIcon, 
  Briefcase, 
  Users, 
  Megaphone, 
  Ticket, 
  LifeBuoy, 
  Settings,
  LogOut
} from 'lucide-react';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session || session.user.role !== 'admin') {
    redirect(locale === 'tr' ? '/admin/login' : `/${locale}/admin/login`);
  }

  const navItems = [
    { name: 'DASHBOARD', href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: 'ÜRÜNLER', href: `/${locale}/admin/products`, icon: Package },
    { name: 'KATEGORİLER', href: `/${locale}/admin/categories`, icon: Tags },
    { name: 'PROJELER', href: `/${locale}/admin/projects`, icon: Briefcase },
    { name: 'REFERANSLAR', href: `/${locale}/admin/references`, icon: ImageIcon },
    { name: 'SİTE İÇERİĞİ', href: `/${locale}/admin/content`, icon: ImageIcon },
    { name: 'MÜŞTERİLER', href: `/${locale}/admin/customers`, icon: Users },
    { name: 'DUYURULAR', href: `/${locale}/admin/announcements`, icon: Megaphone },
    { name: 'KAMPANYALAR', href: `/${locale}/admin/campaigns`, icon: Ticket },
    { name: 'DESTEK', href: `/${locale}/admin/support`, icon: LifeBuoy },
    { name: 'AYARLAR', href: `/${locale}/admin/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-xl font-serif text-brand-500 font-bold">Armoni Design</h2>
          <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Admin Panel</p>
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
          <div className="flex items-center space-x-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
              {session.user.name.charAt(0)}
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <p className="text-sm text-white truncate">{session.user.name}</p>
              <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
            </div>
          </div>
          <LogoutButton redirectUrl={`/${locale}/admin/login`} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-neutral-950">
        {children}
      </main>
    </div>
  );
}
