'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const getLocalizedPath = (path: string) => {
    if (locale === 'tr') return path;
    return `/${locale}${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (locale === 'tr' ? 'Bir hata oluştu' : 'An error occurred'));
      }

      setStatus('success');
      setMessage(locale === 'tr' ? 'E-posta adresi kayıtlıysa şifre yenileme bağlantısı gönderildi.' : 'If this email is registered, a password reset link has been sent.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const isRtl = locale === 'ar';

  return (
    <div className="space-y-6">
      <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-serif font-light text-white tracking-tight">
          {locale === 'tr' ? 'Şifremi Unuttum' : locale === 'ar' ? 'نسيت كلمة المرور' : locale === 'de' ? 'Passwort vergessen' : 'Forgot Password'}
        </h2>
        <p className="text-sm text-neutral-400 font-light">
          {locale === 'tr' 
            ? 'Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi girin.' 
            : locale === 'ar' 
            ? 'أدخل عنوان بريدك الإلكتروني المسجل لإعادة تعيين كلمة المرور الخاصة بك.' 
            : locale === 'de' 
            ? 'Geben Sie Ihre registrierte E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen.' 
            : 'Enter your registered email address to reset your password.'}
        </p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md">
        {status === 'success' ? (
          <div className="space-y-4">
            <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              {message}
            </div>
            <Link 
              href={getLocalizedPath('/login')}
              className="flex w-full justify-center items-center rounded-xl border border-neutral-800 py-3 text-sm font-medium text-neutral-400 hover:text-white transition-all"
            >
              {locale === 'tr' ? 'Giriş Sayfasına Dön' : locale === 'ar' ? 'العودة لصفحة الدخول' : locale === 'de' ? 'Zurück zum Login' : 'Back to Login'}
            </Link>
          </div>
        ) : (
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

            {status === 'error' && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex w-full justify-center items-center rounded-xl bg-brand-500 py-3 px-4 text-sm font-medium text-white shadow-lg shadow-brand-500/10 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 transition-all duration-200"
              >
                {status === 'loading' ? (locale === 'tr' ? 'Gönderiliyor...' : 'Sending...') : (locale === 'tr' ? 'Sıfırlama Bağlantısı Gönder' : 'Send Reset Link')}
              </button>

              <div className="text-center">
                <Link 
                  href={getLocalizedPath('/login')} 
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  {locale === 'tr' ? 'Giriş Yap' : locale === 'ar' ? 'تسجيل الدخول' : locale === 'de' ? 'Einloggen' : 'Sign In'}
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
