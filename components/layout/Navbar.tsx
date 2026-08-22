'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import LanguageSelector from '../ui/LanguageSelector';

const DEFAULT_LOCALE = 'tr';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Build a locale-aware path respecting 'as-needed' prefix strategy.
  // Default locale (TR) has no prefix in the URL.
  const lp = (segment?: string) => {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
    return segment ? `${prefix}/${segment}` : prefix || '/';
  };

  const navLinks = [
    { href: lp(), label: t('home') },
    { href: lp('urunler'), label: t('products') },
    { href: lp('projeler'), label: t('projects') },
    { href: lp('hakkimizda'), label: t('about') },
    { href: lp('referanslar'), label: t('references') },
    { href: lp('iletisim'), label: t('contact') },
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 w-full z-50 transition-all duration-500 top-0 lg:top-10 ${
          isScrolled
            ? 'glass-header py-4 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
        }`}
      >
        <div className="w-full px-6 md:px-12 lg:px-20 2xl:px-32 mx-auto">
          <div className="w-full flex items-center justify-between">
            {/* Logo */}
            <Link href={lp()} className="relative z-10 flex items-center group">
              <div className="relative h-9 w-48 md:w-56 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/2024/12/armoni-beyaz.png"
                  alt="Armoni Design"
                  fill
                  className="object-contain object-left rtl:object-right"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-10 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-300 hover:text-brand-400 transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-500 hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              <a
                href="https://wa.me/905525833234"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-2 rounded-full"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center space-x-4 rtl:space-x-reverse">
              <LanguageSelector currentLocale={locale} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-neutral-950/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28"
          >
            <div className="space-y-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl uppercase tracking-[0.25em] font-light text-neutral-200 hover:text-brand-400 transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-neutral-800">
              <a
                href="https://wa.me/905525833234"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 text-sm uppercase tracking-widest text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 py-3 rounded-full"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <Link
                href={lp('iletisim')}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center text-sm uppercase tracking-widest bg-brand-500 text-white py-3.5 rounded-full font-medium shadow-lg"
              >
                {t('getQuote')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
