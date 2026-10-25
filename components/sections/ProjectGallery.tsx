'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Images } from 'lucide-react';

interface Project {
  id: string | number;
  title: string;
  description: string;
  images: string[];
  category: string;
  year: string;
}

interface ProjectLightboxProps {
  projects: Project[];
  locale: string;
}

const labels: Record<string, {
  all: string;
  images: (n: number) => string;
  imageCount: (cur: number, tot: number) => string;
  prevProject: string;
  nextProject: string;
  viewGallery: string;
}> = {
  tr: {
    all: 'Tümü',
    images: (n) => `${n} Görsel`,
    imageCount: (c, t) => `Görsel ${c} / ${t}`,
    prevProject: 'Önceki Proje',
    nextProject: 'Sonraki Proje',
    viewGallery: 'Galeriyi İncele',
  },
  en: {
    all: 'All',
    images: (n) => `${n} Photos`,
    imageCount: (c, t) => `Photo ${c} of ${t}`,
    prevProject: 'Previous Project',
    nextProject: 'Next Project',
    viewGallery: 'View Gallery',
  },
  de: {
    all: 'Alle',
    images: (n) => `${n} Fotos`,
    imageCount: (c, t) => `Foto ${c} von ${t}`,
    prevProject: 'Vorheriges Projekt',
    nextProject: 'Nächstes Projekt',
    viewGallery: 'Galerie ansehen',
  },
  ru: {
    all: 'Все',
    images: (n) => `${n} Фото`,
    imageCount: (c, t) => `Фото ${c} из ${t}`,
    prevProject: 'Предыдущий проект',
    nextProject: 'Следующий проект',
    viewGallery: 'Смотреть галерею',
  },
  ar: {
    all: 'الكل',
    images: (n) => `${n} صور`,
    imageCount: (c, t) => `صورة ${c} من ${t}`,
    prevProject: 'المشروع السابق',
    nextProject: 'المشروع التالي',
    viewGallery: 'عرض المعرض',
  },
};

export default function ProjectGallery({ projects, locale }: ProjectLightboxProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightbox, setLightbox] = useState<{ projectIndex: number; imgIndex: number } | null>(null);

  const t = labels[locale] || labels.tr;

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return cats;
  }, [projects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const activeProject = lightbox !== null ? filteredProjects[lightbox.projectIndex] : null;
  const activeImages = activeProject?.images || [];
  const activeImgIndex = lightbox?.imgIndex ?? 0;

  // Navigate images within current project
  const goPrevImage = useCallback(() => {
    if (!activeProject || activeImages.length <= 1) return;
    setLightbox((prev) => {
      if (!prev) return null;
      const newIdx = (prev.imgIndex - 1 + activeImages.length) % activeImages.length;
      return { ...prev, imgIndex: newIdx };
    });
  }, [activeProject, activeImages.length]);

  const goNextImage = useCallback(() => {
    if (!activeProject || activeImages.length <= 1) return;
    setLightbox((prev) => {
      if (!prev) return null;
      const newIdx = (prev.imgIndex + 1) % activeImages.length;
      return { ...prev, imgIndex: newIdx };
    });
  }, [activeProject, activeImages.length]);

  // Navigate between projects
  const goPrevProject = useCallback(() => {
    if (!lightbox || filteredProjects.length <= 1) return;
    const newProjIdx = (lightbox.projectIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setLightbox({ projectIndex: newProjIdx, imgIndex: 0 });
  }, [lightbox, filteredProjects.length]);

  const goNextProject = useCallback(() => {
    if (!lightbox || filteredProjects.length <= 1) return;
    const newProjIdx = (lightbox.projectIndex + 1) % filteredProjects.length;
    setLightbox({ projectIndex: newProjIdx, imgIndex: 0 });
  }, [lightbox, filteredProjects.length]);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrevImage();
      if (e.key === 'ArrowRight') goNextImage();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, goPrevImage, goNextImage]);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills (if more than 1 category) */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {t.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid: ONE CARD PER PROJECT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredProjects.map((project, pIdx) => {
          const cover = project.images[0] || '/images/placeholder.jpg';
          const imageCount = project.images.length;

          return (
            <motion.div
              key={project.id || pIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: pIdx * 0.05 }}
              onClick={() => setLightbox({ projectIndex: pIdx, imgIndex: 0 })}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800/80 hover:border-brand-500/50 transition-all duration-500 shadow-xl flex flex-col"
            >
              {/* Cover Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-950">
                <Image
                  src={cover}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/60 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 w-12 h-12 rounded-full bg-brand-500/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>

                {/* Image Count Badge */}
                {imageCount > 1 && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-medium shadow-md">
                    <Images className="w-3.5 h-3.5 text-brand-400" />
                    <span>{t.images(imageCount)}</span>
                  </div>
                )}

                {/* Gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* Project Info on Cover Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                  <div className="flex items-center gap-2">
                    {project.category && (
                      <span className="text-[11px] uppercase tracking-[0.2em] text-brand-400 font-medium">
                        {project.category}
                      </span>
                    )}
                    {project.year && (
                      <>
                        <span className="text-neutral-500 text-xs">·</span>
                        <span className="text-[11px] font-mono text-neutral-400">{project.year}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-white text-xl font-light font-serif tracking-tight leading-snug group-hover:text-brand-300 transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-neutral-400 text-xs line-clamp-1 font-light pt-0.5">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox !== null && activeProject && (
          <div className="fixed inset-0 z-[200] flex flex-col justify-between">
            {/* Backdrop */}
            <motion.div
              key="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md"
              onClick={close}
            />

            {/* Header Bar */}
            <div className="relative z-[205] flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.25em] text-brand-400 font-medium">
                      {activeProject.category || 'Proje'}
                    </span>
                    {activeProject.year && (
                      <span className="text-xs text-neutral-500">· {activeProject.year}</span>
                    )}
                  </div>
                  <h2 className="text-white text-lg md:text-xl font-serif font-light">
                    {activeProject.title}
                  </h2>
                </div>
              </div>

              {/* Center Project Switcher (If multiple projects) */}
              {filteredProjects.length > 1 && (
                <div className="hidden sm:flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-full px-3 py-1">
                  <button
                    onClick={goPrevProject}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5"
                    title={t.prevProject}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{t.prevProject}</span>
                  </button>
                  <span className="text-neutral-600">|</span>
                  <button
                    onClick={goNextProject}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5"
                    title={t.nextProject}
                  >
                    <span>{t.nextProject}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Close Button & Counter */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-neutral-400 tracking-wider bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full">
                  {t.imageCount(activeImgIndex + 1, activeImages.length)}
                </span>
                <button
                  onClick={close}
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Stage: Image and Left/Right Nav */}
            <div className="relative z-[204] flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">
              {/* Prev Image Button */}
              {activeImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrevImage();
                  }}
                  className="absolute left-4 md:left-8 z-[206] w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-neutral-900/80 hover:bg-brand-500 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-xl hover:scale-105"
                  aria-label="Önceki Görsel"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Image View */}
              <div className="relative w-full h-full max-w-5xl max-h-[72vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${lightbox.projectIndex}-${activeImgIndex}`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full h-full"
                  >
                    {activeImages[activeImgIndex] && (
                      <Image
                        src={activeImages[activeImgIndex]}
                        alt={`${activeProject.title} - ${activeImgIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1280px) 100vw, 85vw"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Image Button */}
              {activeImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNextImage();
                  }}
                  className="absolute right-4 md:right-8 z-[206] w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-neutral-900/80 hover:bg-brand-500 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-xl hover:scale-105"
                  aria-label="Sonraki Görsel"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Footer: Thumbnails & Description */}
            <div className="relative z-[205] py-3 px-4 bg-neutral-950/85 backdrop-blur-md border-t border-white/10 flex flex-col items-center gap-2">
              {/* Project Description (if any) */}
              {activeProject.description && (
                <p className="text-xs text-neutral-400 font-light text-center max-w-xl line-clamp-2">
                  {activeProject.description}
                </p>
              )}

              {/* Thumbnails Row */}
              {activeImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 custom-scrollbar">
                  {activeImages.map((thumbSrc, idx) => {
                    const isActive = idx === activeImgIndex;
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightbox({ projectIndex: lightbox.projectIndex, imgIndex: idx });
                        }}
                        className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all duration-200 border ${
                          isActive
                            ? 'ring-2 ring-brand-400 border-transparent scale-105 opacity-100'
                            : 'border-white/15 opacity-50 hover:opacity-90 hover:scale-100'
                        }`}
                      >
                        <Image
                          src={thumbSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
