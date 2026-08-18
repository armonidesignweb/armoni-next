import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin, MessageCircle, Send, Navigation, Store, Factory } from 'lucide-react';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('contactTitle'),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  // Encoded address for Google Maps iframe embed
  const newAddress = "Kağıthane Cad, Limon Sk. 1A, 34400 Kağıthane, İstanbul";
  const mapAddress = encodeURIComponent(newAddress);
  const publicMapUrl = `https://maps.google.com/maps?q=${mapAddress}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
  const directMapsLink = "https://www.google.com/maps?vet=10CAAQoqAOahcKEwj4yKqqm6WWAxUAAAAAHQAAAAAQCg..i&sca_esv=3bb46e3c35a5f9bd&pvq=Cg0vZy8xMWM2el9naGpxIhsKFWFybW9uaSBkZXNpZ24gSEFSxLBUQRACGAM&lqi=ChVhcm1vbmkgZGVzaWduIEhBUsSwVEFIlvzc75urgIAIWiAQABABEAIYABgBIhRhcm1vbmkgZGVzaWduIGhhcml0YZIBCnNvZmFfc3RvcmU&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=tr&sa=X&ftid=0x14cab6dd95d9a07b:0xd3c7416a91e2021b";

  return (
    <div className="pt-40 pb-28 bg-neutral-950 min-h-screen text-neutral-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
            İletişim & Teklif
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-white font-serif tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 3-Column Luxury Contact Info Cards (As in reference image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Adresimiz */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-6 hover:border-brand-500/40 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-light text-white font-serif">{t('ourAddresses')}</h3>
            <div className="space-y-4 text-xs text-neutral-300 font-light leading-relaxed w-full text-left rtl:text-right">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Factory className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">{t('factoryAddressLabel')}: </span>
                  <span>{t('factoryAddress')}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 rtl:space-x-reverse pt-2 border-t border-white/5">
                <Store className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">{t('storeAddressLabel')}: </span>
                  <span>{t('storeAddress')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Email Adresimiz */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-6 hover:border-brand-500/40 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-light text-white font-serif">{t('ourEmails')}</h3>
            <div className="space-y-3 text-sm text-neutral-300 font-light">
              <a
                href="mailto:iletisim@armonidesign.com"
                className="block hover:text-brand-400 transition-colors"
              >
                {t('primaryEmail')}
              </a>
              <a
                href="mailto:info@armonidesign.com"
                className="block text-neutral-400 hover:text-brand-400 transition-colors text-xs"
              >
                {t('secondaryEmail')}
              </a>
            </div>
          </div>

          {/* Card 3: Telefon Numaramız */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-6 hover:border-brand-500/40 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-light text-white font-serif">{t('ourPhones')}</h3>
            <div className="space-y-3 text-sm text-neutral-300 font-light">
              <a
                href="tel:+902122961356"
                className="block hover:text-brand-400 transition-colors font-medium text-white"
              >
                {t('phone1')}
              </a>
              <a
                href="https://wa.me/905525833234"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-brand-400 transition-colors font-medium text-white"
              >
                {t('phone2')}
              </a>
            </div>
          </div>

        </div>

        {/* 2-Column Section: Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-6 glass-card p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-light text-white font-serif mb-6">{t('title')}</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@domain.com"
                    className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  placeholder="0 212 296 13 56"
                  className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
                  {t('message')}
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="İlgilendiğiniz mobilya veya özel tasarım talebiniz hakkında bilgi verin..."
                  className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-white bg-brand-500 hover:bg-brand-600 py-4 rounded-xl transition-all shadow-xl shadow-brand-500/25"
              >
                <Send className="w-4 h-4" />
                <span>{t('send')}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-6 h-full min-h-[400px]">
            <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.808303733504!2d28.97491567655453!3d41.07318271542498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab6dd95d9a07b%3A0xd3c7416a91e2021b!2sArmoni%20Design%20Proje%20Tasar%C4%B1m%20Mobilya%20ve%20Koltuk%20%C4%B0malat%20Ma%C4%9Fazas%C4%B1!5e0!3m2!1str!2str!4v1786905104303!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{border: 0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
