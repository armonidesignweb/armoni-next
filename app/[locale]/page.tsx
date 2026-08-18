import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/sections/HeroSection';
import CategorySection from '@/components/sections/CategorySection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import AboutSection from '@/components/sections/AboutSection';
import GoogleReviews from '@/components/sections/GoogleReviews';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('homeTitle'),
    description: t('homeDesc'),
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDesc'),
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  return (
    <>
      <HeroSection locale={locale} />
      <CategorySection locale={locale} />
      <FeaturedProducts locale={locale} />
      <AboutSection locale={locale} />
      <GoogleReviews />
    </>
  );
}
