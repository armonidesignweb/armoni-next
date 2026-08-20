'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import LegalModal from '@/components/ui/LegalModal';

interface FooterProps {
  locale: string;
}

type ModalType = 'privacy' | 'terms' | null;

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCat = useTranslations('categories');
  const tContact = useTranslations('contact');

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const address = tContact('addressValue');
  const phone = tContact('phoneValue');
  const email = tContact('emailValue');

  return (
    <>
      <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-neutral-900">
            {/* Brand Info & Socials */}
            <div className="lg:col-span-2 space-y-6">
              <Link href={`/${locale}`} className="inline-block">
                <div className="relative h-10 w-52">
                  <Image
                    src="/images/2024/12/armoni-beyaz.png"
                    alt="Armoni Design"
                    fill
                    className="object-contain object-left rtl:object-right"
                  />
                </div>
              </Link>
              <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
                {t('description')}
              </p>
              <div className="flex items-center space-x-4 rtl:space-x-reverse pt-2">
                <a
                  href="https://www.instagram.com/armoniidesign/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/10 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/p/Armoni-Design-100090877368606/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/10 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white font-medium">
                {t('quickLinks')}
              </h3>
              <ul className="space-y-2.5 text-sm font-light">
                <li>
                  <Link href={`/${locale}`} className="hover:text-brand-400 transition-colors">
                    {tNav('home')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/urunler`} className="hover:text-brand-400 transition-colors">
                    {tNav('products')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/projeler`} className="hover:text-brand-400 transition-colors">
                    {tNav('projects')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/hakkimizda`} className="hover:text-brand-400 transition-colors">
                    {tNav('about')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/iletisim`} className="hover:text-brand-400 transition-colors">
                    {tNav('contact')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white font-medium">
                {t('categories')}
              </h3>
              <ul className="space-y-2.5 text-sm font-light">
                {CATEGORIES.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/${locale}/urunler?kategori=${cat.slug}`}
                      className="hover:text-brand-400 transition-colors"
                    >
                      {tCat(cat.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white font-medium">
                {tNav('contact')}
              </h3>
              <ul className="space-y-3 text-sm font-light">
                <li className="flex items-start space-x-3 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                  <span className="text-xs leading-relaxed">{address}</span>
                </li>
                <li className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <a href="tel:+902122961356" className="hover:text-white transition-colors">
                    {phone}
                  </a>
                </li>
                <li className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                  <a href="mailto:iletisim@armonidesign.com" className="hover:text-white transition-colors">
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-light text-neutral-500 gap-4">
            <p>© {new Date().getFullYear()} Armoni Design. {t('rights')}</p>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                {t('privacy')}
              </button>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                {t('terms')}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <LegalModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
        locale={locale}
      />
    </>
  );
}
