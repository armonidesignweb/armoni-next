import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Reference } from '@/models/Reference';
import { REFERENCES as STATIC_REFERENCES } from '@/lib/references-data';

export const dynamic = 'force-dynamic';

interface ReferanslarPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ReferanslarPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'references' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  };
}

export default async function ReferanslarPage({ params }: ReferanslarPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'references' });

  await connectToDatabase();
  const dbRefs = await Reference.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
  
  // If no DB references exist yet, use static fallback
  const finalRefs = dbRefs.length > 0 
    ? dbRefs.map((r: any) => ({
        _id: r._id.toString(),
        name: r.companyName,
        logo: r.logo,
        href: r.link || '#',
      }))
    : STATIC_REFERENCES.map((r, i) => ({
        _id: r.slug,
        name: r.name,
        logo: `/referanslar/renkli/${r.file}`,
        href: r.href,
      }));

  return (
    <div className="pt-40 pb-24 bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Başlık */}
        <div className="mb-16 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
            {t('label')}
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-white font-serif tracking-tight">
            {t('title')}
          </h1>
          <p className="text-neutral-400 font-light max-w-2xl mx-auto text-sm leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {finalRefs.map((ref) => (
            <a
              key={ref._id}
              href={ref.href}
              target={ref.href !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={ref.name}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 flex items-center justify-center aspect-square group transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="relative w-full h-full">
                <Image
                  src={ref.logo}
                  alt={ref.name}
                  fill
                  className="w-full h-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  unoptimized
                />
              </div>
            </a>
          ))}
        </div>

        {/* Alt bilgi */}
        <div className="mt-20 text-center">
          <p className="text-neutral-500 text-xs uppercase tracking-widest">
            {finalRefs.length}+ {t('prestigious')}
          </p>
        </div>
      </div>
    </div>
  );
}
