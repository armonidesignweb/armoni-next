'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';

const DEFAULT_LOCALE = 'tr';

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: 'TR' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
  { code: 'ru', label: 'Русский', flag: 'RU' },
  { code: 'ar', label: 'العربية', flag: 'AR' },
];

interface LanguageSelectorProps {
  currentLocale: string;
}

export default function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);

    // Set next-intl cookie so that localeDetection respects the manual choice
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // Strip the current locale prefix from the pathname to get the raw base path.
    const segments = pathname.split('/');
    const hasLocalePrefix = segments.length > 1 && LANGUAGES.some((l) => l.code === segments[1]);
    if (hasLocalePrefix) {
      segments.splice(1, 1);
    }
    const basePath = segments.join('/') || '/';

    // Respect 'as-needed' prefix strategy: default locale (tr) has no prefix.
    let newPath: string;
    if (newLocale === DEFAULT_LOCALE) {
      newPath = basePath === '/' ? '/' : basePath;
    } else {
      newPath = `/${newLocale}${basePath === '/' ? '' : basePath}`;
    }

    window.location.href = newPath;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest text-neutral-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded-full border border-white/10 hover:border-brand-500/50 bg-white/5"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-brand-400" />
        <span className="font-medium">{currentLang.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 w-40 glass-card rounded-lg shadow-2xl py-2 z-50 animate-fade-in border border-white/10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-2 text-xs tracking-wider transition-colors ${
                currentLocale === lang.code
                  ? 'text-brand-400 bg-brand-500/10 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{lang.label}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
