'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_SLIDES } from '@/lib/data';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('hero');
  const tHome = useTranslations('homepage');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-950">
      {/* Background Images with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ opacity: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }, scale: { duration: 4, ease: [0.25, 1, 0.5, 1] } }}
          className="absolute inset-0 z-0"
        >
          <video autoPlay loop muted playsInline className="w-full h-full object-cover absolute inset-0 z-0" src={slide.video}></video>
          <div className="absolute inset-0 z-10 bg-black/20 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]"></div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
        <motion.div
          key={`content-${slide.id}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl space-y-6"
        >
          {/* Tagline */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="h-[1px] w-12 bg-brand-500" />
            <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium">
              {t('tagline')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.15] whitespace-pre-line font-serif">
            {slide.titleKey}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-300 font-light max-w-lg leading-relaxed">
            {slide.subtitleKey}
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-5">
            <Link
              href={`/${locale}/urunler`}
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-xs uppercase tracking-[0.2em] font-medium text-white bg-brand-500 hover:bg-brand-600 px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
            >
              <span>{t('cta')}</span>
            </Link>

            <Link
              href={`/${locale}/projeler`}
              className="inline-flex items-center space-x-3 rtl:space-x-reverse text-xs uppercase tracking-[0.2em] font-medium text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300"
            >
              <span>{t('ctaSecondary')}</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows & Controls */}
      <div className="absolute bottom-28 right-6 md:right-12 z-20 flex items-center space-x-4 rtl:space-x-reverse">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 hover:border-brand-500 bg-black/30 hover:bg-brand-500/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <span className="text-xs font-mono text-neutral-400 tracking-widest">
          0{currentSlide + 1} / 0{HERO_SLIDES.length}
        </span>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 hover:border-brand-500 bg-black/30 hover:bg-brand-500/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-180" />
        </button>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center space-y-2 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">{tHome('discover')}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-brand-400" />
        </motion.div>
      </div>
    </section>
  );
}
