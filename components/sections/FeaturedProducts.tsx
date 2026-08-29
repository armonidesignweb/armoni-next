'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FEATURED_PRODUCTS } from '@/lib/data';
import { Eye, MessageCircle } from 'lucide-react';

interface FeaturedProductsProps {
  locale: string;
}

export default function FeaturedProducts({ locale }: FeaturedProductsProps) {
  const t = useTranslations('featured');
  const tHome = useTranslations('homepage');

  return (
    <section className="py-28 bg-neutral-900/50 border-t border-b border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-400 font-medium block">
            {tHome('featuredLabel')}
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-white font-serif tracking-tight">
            {t('title')}
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/4] w-full bg-neutral-950/80 p-6 flex items-center justify-center img-zoom-container overflow-hidden">
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-widest font-mono text-brand-300 bg-brand-950/80 border border-brand-500/30 px-2.5 py-1 rounded-full backdrop-blur-md">
                    {product.badge === 'Bestseller' ? t('bestseller') : product.badge}
                  </span>
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                />

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 rtl:space-x-reverse">
                  <Link
                    href={`/${locale}/urun/${product.slug}`}
                    className="w-11 h-11 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors duration-200 shadow-xl"
                    title={t('viewProduct')}
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="p-6 space-y-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                  {product.categoryName[locale] || product.categoryName.tr}
                </span>
                <h3 className="text-lg font-light text-white group-hover:text-brand-300 transition-colors">
                  <Link href={`/${locale}/urun/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/${locale}/urun/${product.slug}`}
                    className="text-xs uppercase tracking-widest text-brand-400 hover:text-brand-300 font-medium transition-colors"
                  >
                    {t('viewProduct')} →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
