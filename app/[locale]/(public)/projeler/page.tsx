import { getTranslations } from 'next-intl/server';
import { locales } from '@/middleware';
import ProjectGallery from '@/components/sections/ProjectGallery';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/models/Project';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return {
    title: `${t('title')} — Armoni Design`,
    description: t('subtitle'),
  };
}

// Ensure the page gets fresh data
export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  await connectToDatabase();
  
  const dbProjects = await Project.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
  
  // If db empty, fallback to seed data equivalent
  const projectsData = dbProjects.length > 0 
    ? dbProjects.map((p: any) => ({
        id: p._id.toString(),
        title: p.title[locale] || p.title.tr || '',
        description: p.description?.[locale] || p.description?.tr || '',
        category: p.location || '',
        year: p.year?.toString() || '',
        images: [p.coverImage, ...(p.gallery || [])].filter(Boolean),
      }))
    : [
        {
          id: 'bogazici-residences',
          title: 'Boğaziçi Residences',
          description: 'İstanbul Boğazı\'na nazır lüks konut projesi',
          category: 'Residential',
          year: '2024',
          images: ['/images/projeler/project-1.jpg', '/images/projeler/project-2.jpg'],
        },
        {
          id: 'grand-mira-hotel',
          title: 'Grand Mira Hotel',
          description: 'Butik otel lobi ve lounge tasarımı',
          category: 'Hospitality',
          year: '2024',
          images: ['/images/projeler/project-3.jpg', '/images/projeler/project-4.jpg'],
        },
        {
          id: 'nisantasi-penthouse',
          title: 'Nişantaşı Penthouse',
          description: 'Özel villa yatak odası koleksiyonu',
          category: 'Residential',
          year: '2023',
          images: ['/images/projeler/project-5.jpg', '/images/projeler/project-6.jpg'],
        },
      ];

  return (
    <div className="pt-32 pb-28 bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
            {t('label')}
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-white font-serif tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Gallery */}
        <ProjectGallery projects={projectsData as any} locale={locale} />

      </div>
    </div>
  );
}
