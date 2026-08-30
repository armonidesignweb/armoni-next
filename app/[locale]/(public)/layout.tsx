import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { getSession } from '@/lib/auth';

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  return (
    <>
      <TopBar locale={locale} session={session} />
      <Navbar locale={locale} />
      <main className="flex-grow">{children}</main>
      <Footer locale={locale} />
      <FloatingWhatsApp />
    </>
  );
}
