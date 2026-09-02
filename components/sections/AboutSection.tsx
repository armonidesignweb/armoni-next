'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface AboutSectionProps {
  locale: string;
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const t = useTranslations('about');
  const tHome = useTranslations('homepage');

  const stats = [
    { number: '20+', label: t('stats.years') },
    { number: '500+', label: t('stats.products') },
    { number: '150+', label: t('stats.projects') },
    { number: '30+', label: t('stats.countries') },
  ];

  return (
    <section className="py-32 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column - Imagery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden glass-card">
              <Image
                src="/images/armoni-production-facility.jpg"
                alt="Armoni Design Zanaat"
                fill
                className="object-cover object-center brightness-90 hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            </div>

            {/* Floating Glass Accent Box */}
            <div className="absolute -bottom-8 -right-4 md:right-8 glass-card p-6 rounded-2xl max-w-xs border border-white/10 hidden sm:block">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white font-serif">{tHome('customProduction')}</h4>
                  <p className="text-xs text-neutral-400 font-light">{tHome('customProductionDesc')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium">
                {t('label')}
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-white font-serif tracking-tight leading-[1.2] whitespace-pre-line">
                {t('title')}
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 font-light leading-relaxed text-base">
              <p>{t('p1')}</p>
              <p className="text-neutral-400">{t('p2')}</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-neutral-900">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-3xl font-light text-white font-serif text-brand-400">
                    {stat.number}
                  </span>
                  <p className="text-xs text-neutral-400 font-light">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href={`/${locale}/hakkimizda`}
                className="inline-flex items-center space-x-3 rtl:space-x-reverse text-xs uppercase tracking-[0.2em] font-medium text-white bg-brand-500 hover:bg-brand-600 px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-brand-500/20 hover:-translate-y-0.5"
              >
                <span>{t('cta')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
