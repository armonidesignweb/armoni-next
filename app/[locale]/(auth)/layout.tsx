import Image from 'next/image';
import Link from 'next/link';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col lg:flex-row relative selection:bg-brand-500 selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top right language selector and home link */}
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex items-center space-x-4 rtl:space-x-reverse`}>
        <LanguageSelector currentLocale={locale} />
        <Link 
          href={locale === 'tr' ? '/' : `/${locale}`}
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-200"
        >
          {locale === 'tr' ? 'Anasayfa' : locale === 'ar' ? 'الرئيسية' : locale === 'de' ? 'Startseite' : 'Home'}
        </Link>
      </div>

      {/* Left visual side - premium presentation of Armoni Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-905 border-r border-neutral-900 flex-col justify-between p-16 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(180,140,80,0.15),transparent_50%)]">
        {/* Brand Logo */}
        <Link href={locale === 'tr' ? '/' : `/${locale}`} className="relative z-10 block mb-12">
          <Image
            src="/images/2024/12/armoni-beyaz.png"
            alt="Armoni Design"
            width={240}
            height={60}
            className="h-12 w-auto object-contain object-left rtl:object-right"
            priority
          />
        </Link>

        {/* Premium presentation message */}
        <div className="relative z-10 mb-auto max-w-lg space-y-6">
          <p className="text-brand-400 font-medium tracking-[0.25em] text-xs uppercase">
            {locale === 'tr' ? 'Özgün & Lüks Mobilya Tasarımı' : locale === 'ar' ? 'تصميم أثاث فريد وفاخر' : locale === 'de' ? 'Exklusives & Luxuriöses Möbeldesign' : 'Unique & Luxury Furniture Design'}
          </p>
          <h1 className="text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
            {locale === 'tr' ? 'Zarafet, Her Detayda.' : locale === 'ar' ? 'الأناقة في كل تفاصيلها.' : locale === 'de' ? 'Eleganz in jedem Detail.' : 'Elegance in Every Detail.'}
          </h1>
          <p className="text-neutral-400 font-light leading-relaxed text-sm">
            {locale === 'tr' 
              ? 'Armoni Design müşteri portalına giriş yaparak sipariş durumlarınızı kontrol edebilir, size özel fiyatları görebilir ve destek talebi oluşturabilirsiniz.' 
              : locale === 'ar' 
              ? 'من خلال تسجيل الدخول إلى بوابة عملاء Armoni Design، يمكنك التحقق من حالة طلبك، والاطلاع على الأسعار الخاصة بك، وإنشاء طلبات الدعم.' 
              : locale === 'de' 
              ? 'Melden Sie sich im Kundenportal von Armoni Design an, um den Status Ihrer Bestellungen zu überprüfen, Ihre Sonderpreise einzusehen und Supportanfragen zu erstellen.' 
              : 'By logging in to the Armoni Design customer portal, you can check your order status, view special pricing, and create support requests.'}
          </p>
        </div>

        {/* Bottom brand tagline */}
        <div className="relative z-10 text-neutral-500 text-xs flex items-center space-x-2 rtl:space-x-reverse font-light">
          <ShieldCheck className="w-4 h-4 text-brand-500" />
          <span>© {new Date().getFullYear()} Armoni Design. {locale === 'tr' ? 'Güvenli Müşteri Paneli' : locale === 'ar' ? 'بوابة عملاء آمنة' : locale === 'de' ? 'Sicheres Kundenportal' : 'Secure Customer Portal'}</span>
        </div>
      </div>

      {/* Right form side */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:py-24 relative overflow-hidden bg-neutral-950">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Ambient glow on mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-brand-500/5 blur-[80px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo visible only on mobile/tablet */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href={locale === 'tr' ? '/' : `/${locale}`} className="relative block w-40 h-10">
              <Image
                src="/images/2024/12/armoni-beyaz.png"
                alt="Armoni Design"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
