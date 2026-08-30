'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function CustomerLogin() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowVerifiedMessage(true);
    }
  }, [searchParams]);

  const getLocalizedPath = (path: string) => {
    if (locale === 'tr') return path;
    return `/${locale}${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowVerifiedMessage(false);

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

      if (data.user.role !== 'customer') {
        throw new Error(locale === 'tr' ? 'Yetkisiz erişim. Lütfen admin panelini kullanın.' : 'Unauthorized access. Please use the admin panel.');
      }

      window.location.href = getLocalizedPath('/account');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isRtl = locale === 'ar';

  return (
    <div className="space-y-6">
      <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-serif font-light text-white tracking-tight">
          {locale === 'tr' ? 'Müşteri Girişi' : locale === 'ar' ? 'دخول العملاء' : locale === 'de' ? 'Kunden-Login' : 'Customer Login'}
        </h2>
        <p className="text-sm text-neutral-400 font-light">
          {locale === 'tr' ? 'Hesabınız yok mu?' : locale === 'ar' ? 'ليس لديك حساب؟' : locale === 'de' ? 'Haben Sie kein Konto?' : "Don't have an account?"}{' '}
          <Link href={getLocalizedPath('/register')} className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
            {locale === 'tr' ? 'Kayıt Ol' : locale === 'ar' ? 'سجل الآن' : locale === 'de' ? 'Registrieren' : 'Sign Up'}
          </Link>
        </p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md">
        {showVerifiedMessage && (
          <div className="mb-6 flex items-center space-x-3 rtl:space-x-reverse text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
            <span>
              {locale === 'tr' 
                ? 'E-posta adresiniz başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.' 
                : locale === 'ar' 
                ? 'تم التحقق من بريدك الإلكتروني بنجاح. يمكنك تسجيل الدخول الآن.' 
                : locale === 'de' 
                ? 'Ihre E-Mail-Adresse wurde erfolgreich verifiziert. Sie können sich jetzt einloggen.' 
                : 'Your email address has been successfully verified. You can now log in.'}
            </span>
          </div>
        )}

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
              className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              placeholder="example@domain.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Şifre' : locale === 'ar' ? 'كلمة المرور' : locale === 'de' ? 'Passwort' : 'Password'}
              </label>
              <Link href={getLocalizedPath('/forgot-password')} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                {locale === 'tr' ? 'Şifremi Unuttum' : locale === 'ar' ? 'نسيت كلمة المرور؟' : locale === 'de' ? 'Passwort vergessen?' : 'Forgot Password?'}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right pl-12' : 'text-left pr-12'}`}
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
              className="flex w-full justify-center items-center rounded-xl bg-brand-500 py-3 px-4 text-sm font-medium text-white shadow-lg shadow-brand-500/10 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (locale === 'tr' ? 'Giriş Yapılıyor...' : 'Signing In...') : (locale === 'tr' ? 'Giriş Yap' : 'Sign In')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
