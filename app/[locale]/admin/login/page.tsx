'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';
import LanguageSelector from '@/components/ui/LanguageSelector';

export default function AdminLogin() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getLocalizedPath = (path: string) => {
    if (locale === 'tr') return path;
    return `/${locale}${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (locale === 'tr' ? 'Giriş başarısız' : 'Login failed'));
      }

      if (data.user.role !== 'admin') {
        throw new Error(locale === 'tr' ? 'Yetkisiz erişim' : 'Unauthorized access');
      }

      window.location.href = getLocalizedPath('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-6 py-12 relative selection:bg-brand-500 selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top right options */}
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex items-center space-x-4 rtl:space-x-reverse`}>
        <LanguageSelector currentLocale={locale} />
        <Link 
          href={getLocalizedPath('/')}
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-200"
        >
          {locale === 'tr' ? 'Anasayfa' : locale === 'ar' ? 'الرئيسية' : locale === 'de' ? 'Startseite' : 'Home'}
        </Link>
      </div>

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Red ambient security light in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-red-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Logo & Secure Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative mb-2">
            <Image
              src="/images/2024/12/armoni-beyaz.png"
              alt="Armoni Design"
              width={240}
              height={60}
              className="h-10 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-[10px] tracking-[0.25em] font-medium text-red-500 bg-red-950/30 border border-red-500/20 px-3 py-1 rounded-full uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{locale === 'tr' ? 'Güvenli Yönetim Paneli' : locale === 'ar' ? 'لوحة تحكم آمنة' : locale === 'de' ? 'Gesichertes Admin-Panel' : 'Secure Admin Control'}</span>
          </div>
          <h2 className="text-2xl font-serif font-light text-white pt-2">
            {locale === 'tr' ? 'Yönetici Girişi' : locale === 'ar' ? 'دخول المشرف' : locale === 'de' ? 'Admin-Anmeldung' : 'Administrator Sign In'}
          </h2>
        </div>

        {/* Corporate Form Card */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'E-posta Adresi' : locale === 'ar' ? 'البريد الإلكتروني' : locale === 'de' ? 'E-Mail-Adresse' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
                placeholder="admin@armonidesign.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Şifre' : locale === 'ar' ? 'كلمة المرور' : locale === 'de' ? 'Passwort' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right pl-12' : 'text-left pr-12'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${isRtl ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-neutral-500 hover:text-white transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center rounded-xl bg-red-600 py-3 px-4 text-sm font-medium text-white shadow-lg shadow-red-600/10 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (locale === 'tr' ? 'Doğrulanıyor...' : 'Authenticating...') : (locale === 'tr' ? 'Giriş Yap' : 'Sign In')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
