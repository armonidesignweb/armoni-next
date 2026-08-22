'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';

interface TopBarProps {
  locale: string;
}

export default function TopBar({ locale }: TopBarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const languages = ['tr', 'en', 'de', 'ru', 'ar'];
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const getPathWithoutLocale = () => {
    const parts = pathname.split('/');
    if (parts.length > 1 && languages.includes(parts[1])) {
      parts.splice(1, 1);
    }
    return parts.join('/') || '/';
  };

  const basePath = getPathWithoutLocale();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full h-10 bg-neutral-950 text-gray-300 text-xs border-b border-neutral-800 hidden lg:block">
      <div className="w-full px-6 md:px-12 lg:px-20 2xl:px-32 flex justify-between items-center h-full mx-auto">
        {/* Left Side - Languages */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[10px] font-medium tracking-widest text-neutral-400">
          {languages.map((lang, index) => (
            <div key={lang} className="flex items-center">
              <Link
                href={`/${lang}${basePath === '/' ? '' : basePath}`}
                className={`uppercase transition-colors hover:text-white ${
                  locale === lang ? 'text-white' : 'opacity-70'
                }`}
              >
                {lang}
              </Link>
              {index < languages.length - 1 && (
                <span className="mx-3 text-neutral-700">|</span>
              )}
            </div>
          ))}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-8 rtl:space-x-reverse text-[10px] uppercase font-medium tracking-widest text-neutral-400">
          <Link href={`/${locale}/kayit`} className="hover:text-white transition-colors">
            {t('signUp')}
          </Link>
          <a
            href="/catalog/armoni-design-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {t('catalog')}
          </a>
          <Link href={`/${locale}/iletisim`} className="hover:text-white transition-colors">
            {t('getQuote')}
          </Link>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center space-x-2 hover:text-white transition-colors rtl:space-x-reverse"
          >
            <span>{t('search')}</span>
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full-screen Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-8 right-8 md:top-12 md:right-12 text-neutral-400 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="w-10 h-10 md:w-12 md:h-12" />
          </button>
          <div className="w-full max-w-3xl px-6">
            <input
              type="text"
              autoFocus
              placeholder={`${t('search')}...`}
              className="w-full bg-transparent border-b-2 border-neutral-500 text-white text-3xl md:text-5xl py-4 outline-none placeholder:text-neutral-600 focus:border-white transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
