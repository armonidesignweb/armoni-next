import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { REFERENCES } from '@/lib/references-data';

interface ReferanslarPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ReferanslarPageProps) {
  const { locale } = await params;
  await getTranslations({ locale, namespace: 'nav' });
  return {
    title: `Referanslar | Armoni Design`,
    description:
      'Armoni Design referansları — dünyanın dört bir yanındaki seçkin iş ortaklarımızla hayata geçirilen projeler.',
  };
}

export default async function ReferanslarPage() {
  return (
    <div className="pt-40 pb-24 bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Başlık */}
        <div className="mb-16 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
            Güven &amp; Başarı
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-white font-serif tracking-tight">
            Referanslarımız
          </h1>
          <p className="text-neutral-400 font-light max-w-2xl mx-auto text-sm leading-relaxed">
            Dünyanın dört bir yanındaki seçkin iş ortaklarımızla birlikte hayata geçirdiğimiz
            projeler.
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {REFERENCES.map((ref) => (
            <a
              key={ref.slug}
              href={ref.href}
              target={ref.href !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={ref.name}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 flex items-center justify-center aspect-square group transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/referanslar/renkli/${ref.file}`}
                  alt={ref.name}
                  fill
                  className="w-full h-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Alt bilgi */}
        <div className="mt-20 text-center">
          <p className="text-neutral-500 text-xs uppercase tracking-widest">
            {REFERENCES.length}+ Prestijli Marka &amp; İş Ortağı
          </p>
        </div>
      </div>
    </div>
  );
}
