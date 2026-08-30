'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function CustomerRegister() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getLocalizedPath = (path: string) => {
    if (locale === 'tr') return path;
    return `/${locale}${path}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError(locale === 'tr' ? 'Şifreler uyuşmuyor.' : 'Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (locale === 'tr' ? 'Kayıt başarısız' : 'Registration failed'));
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
          {locale === 'tr' ? 'Müşteri Kaydı' : locale === 'ar' ? 'تسجيل عميل جديد' : locale === 'de' ? 'Kunden-Registrierung' : 'Customer Registration'}
        </h2>
        <p className="text-sm text-neutral-400 font-light">
          {locale === 'tr' ? 'Zaten hesabınız var mı?' : locale === 'ar' ? 'هل لديك حساب بالفعل؟' : locale === 'de' ? 'Haben Sie bereits ein Konto?' : 'Already have an account?'}{' '}
          <Link href={getLocalizedPath('/login')} className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
            {locale === 'tr' ? 'Giriş Yap' : locale === 'ar' ? 'تسجيل الدخول' : locale === 'de' ? 'Einloggen' : 'Sign In'}
          </Link>
        </p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Ad Soyad *' : locale === 'ar' ? 'الاسم بالكامل *' : locale === 'de' ? 'Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Firma Adı' : locale === 'ar' ? 'שם החברה' : locale === 'de' ? 'Firmenname' : 'Company Name'}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'E-posta *' : locale === 'ar' ? 'البريد الإلكتروني *' : locale === 'de' ? 'E-Mail *' : 'Email *'}
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Telefon' : locale === 'ar' ? 'الهاتف' : locale === 'de' ? 'Telefon' : 'Phone'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Şifre *' : locale === 'ar' ? 'كلمة المرور *' : locale === 'de' ? 'Passwort *' : 'Password *'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right pl-10' : 'text-left pr-10'}`}
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

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Şifre Tekrar *' : locale === 'ar' ? 'تأكيد كلمة المرور *' : locale === 'de' ? 'Passwort wiederholen *' : 'Confirm Password *'}
              </label>
              <input
                type="password"
                name="passwordConfirm"
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </div>

          <div className="flex items-start pt-2">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              required
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 mt-0.5 rounded border-neutral-800 text-brand-500 focus:ring-brand-500 bg-neutral-950"
            />
            <label htmlFor="acceptTerms" className={`block text-xs text-neutral-400 leading-normal ${isRtl ? 'mr-2' : 'ml-2'}`}>
              {locale === 'tr' 
                ? "KVKK ve Kullanım Şartları'nı okudum ve onaylıyorum." 
                : locale === 'ar' 
                ? "لقد قرأت ووافقت على الشروط والأحكام وسياسة الخصوصية." 
                : locale === 'de' 
                ? "Ich habe die Datenschutzbestimmungen und Nutzungsbedingungen gelesen und akzeptiere sie." 
                : "I have read and accept the Terms of Use and Privacy Policy."}
            </label>
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
              {loading ? (locale === 'tr' ? 'Kayıt Yapılıyor...' : 'Registering...') : (locale === 'tr' ? 'Kayıt Ol' : 'Sign Up')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
