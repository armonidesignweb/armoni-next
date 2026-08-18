import { getTranslations } from 'next-intl/server';
import AboutSection from '@/components/sections/AboutSection';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('aboutTitle'),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  return (
    <div className="pt-20">
      <AboutSection locale={locale} />
    </div>
  );
}
