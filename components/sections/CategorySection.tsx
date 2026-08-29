'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';

interface CategorySectionProps {
  locale: string;
}

export default function CategorySection({ locale }: CategorySectionProps) {
  const t = useTranslations('categories');
  const tHome = useTranslations('homepage');
  const tProducts = useTranslations('products');

  return (
    <section className="py-28 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 relative">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
            {tHome('collectionLabel')}
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-white font-serif tracking-tight">
            {t('title')}
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            {t('subtitle')}
          </p>

          <Link
            href={`/${locale}/urunler`}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-brand-400 transition-colors group mt-6"
          >
            <span>{t('viewAll')}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/${locale}/urunler?kategori=${category.slug}`}
                className="group block relative rounded-2xl overflow-hidden glass-card aspect-[4/5] p-6 flex flex-col justify-between"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 img-zoom-container">
                  <Image
                    src={category.image}
                    alt={t(category.key)}
                    fill
                    className="object-cover object-center brightness-75 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                    {category.itemCount} {tProducts('design')}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-brand-500 transition-all duration-300 transform group-hover:scale-100 scale-75">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-light text-white font-serif group-hover:text-brand-300 transition-colors">
                    {t(category.key)}
                  </h3>
                  <div className="h-[1px] w-12 bg-brand-500/50 group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
