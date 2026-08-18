'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface Project {
  id: number;
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

export default function ProjectGallery({ projects, locale }: ProjectLightboxProps) {
  const [lightbox, setLightbox] = useState<{ projectIndex: number; imgIndex: number } | null>(null);

  const allImages = projects.flatMap((p) =>
    p.images.map((src, imgIdx) => ({ src, project: p, imgIdx, projectIndex: projects.indexOf(p) }))
  );

  const flatIndex = lightbox
    ? projects.slice(0, lightbox.projectIndex).reduce((acc, p) => acc + p.images.length, 0) + lightbox.imgIndex
    : 0;

  const goPrev = useCallback(() => {
    if (!lightbox) return;
    const newFlat = (flatIndex - 1 + allImages.length) % allImages.length;
    const item = allImages[newFlat];
    setLightbox({ projectIndex: item.projectIndex, imgIndex: item.imgIdx });
  }, [lightbox, flatIndex, allImages]);

  const goNext = useCallback(() => {
    if (!lightbox) return;
    const newFlat = (flatIndex + 1) % allImages.length;
    const item = allImages[newFlat];
    setLightbox({ projectIndex: item.projectIndex, imgIndex: item.imgIdx });
  }, [lightbox, flatIndex, allImages]);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, goPrev, goNext]);

  return (
    <>
      {/* Masonry-style Gallery Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {projects.map((project, pIdx) =>
          project.images.map((src, imgIdx) => (
            <div
              key={`${pIdx}-${imgIdx}`}
              className="relative break-inside-avoid group cursor-pointer overflow-hidden rounded-2xl bg-neutral-900"
              onClick={() => setLightbox({ projectIndex: pIdx, imgIndex: imgIdx })}
            >
              <div className="relative w-full" style={{ aspectRatio: imgIdx % 3 === 1 ? '3/4' : '4/3' }}>
                <Image
                  src={src}
                  alt={`${project.title} - ${imgIdx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/50 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
                {/* Project info badge (only first image per project) */}
                {imgIdx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-brand-400 font-medium block mb-1">
                      {project.category} · {project.year}
                    </span>
                    <h3 className="text-white text-base font-light font-serif">{project.title}</h3>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            {/* Backdrop */}
            <motion.div
              key="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md"
              onClick={close}
            />

            {/* Lightbox Content */}
            <motion.div
              key="lb-content"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-12 pointer-events-none"
            >
              {/* Main image container */}
              <div className="relative w-full h-full max-w-5xl max-h-[80vh] pointer-events-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${lightbox.projectIndex}-${lightbox.imgIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={allImages[flatIndex].src}
                      alt={allImages[flatIndex].project.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1280px) 100vw, 80vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Controls — outside image container so always visible */}
            <div className="fixed inset-0 z-[202] pointer-events-none flex items-center justify-between px-4 md:px-8">
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="pointer-events-auto w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="pointer-events-auto w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Close + Counter */}
            <div className="fixed top-5 right-5 z-[203] flex items-center gap-3 pointer-events-auto">
              <span className="text-xs font-mono text-neutral-400 tracking-widest">
                {flatIndex + 1} / {allImages.length}
              </span>
              <button
                onClick={close}
                className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Caption */}
            <div className="fixed bottom-5 left-0 right-0 z-[203] text-center pointer-events-none">
              <p className="text-xs uppercase tracking-[0.25em] text-brand-400 font-medium">
                {allImages[flatIndex].project.category} · {allImages[flatIndex].project.year}
              </p>
              <p className="text-white font-light font-serif text-lg mt-1">
                {allImages[flatIndex].project.title}
              </p>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
