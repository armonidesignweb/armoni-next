import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteSettings } from '@/models/SiteSettings';

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  let settings = null;
  try {
    await connectToDatabase();
    const dbSettings = await SiteSettings.findOne().lean();
    settings = dbSettings ? JSON.parse(JSON.stringify(dbSettings)) : null;
  } catch (e) {}

  return (
    <>
      <TopBar locale={locale} session={session} />
      <Navbar locale={locale} settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer locale={locale} settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
