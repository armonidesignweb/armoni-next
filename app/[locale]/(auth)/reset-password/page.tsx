'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const getLocalizedPath = (path: string) => {
    if (locale === 'tr') return path;
    return `/${locale}${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage(locale === 'tr' ? 'Şifreler uyuşmuyor.' : 'Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (locale === 'tr' ? 'Şifre sıfırlama başarısız.' : 'Password reset failed.'));
      }

      setStatus('success');
      setMessage(locale === 'tr' ? 'Şifreniz başarıyla güncellendi. Yönlendiriliyorsunuz...' : 'Password reset successful. Redirecting...');
      setTimeout(() => {
        router.push(getLocalizedPath('/login'));
      }, 3000);
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
          {locale === 'tr' ? 'Yeni Şifre Belirle' : locale === 'ar' ? 'تعيين كلمة مرور جديدة' : locale === 'de' ? 'Neues Passwort festlegen' : 'Set New Password'}
        </h2>
        <p className="text-sm text-neutral-400 font-light">
          {locale === 'tr' ? 'Lütfen hesabınız için yeni şifrenizi girin.' : locale === 'ar' ? 'يرجى إدخال كلمة المرور الجديدة لحسابك.' : locale === 'de' ? 'Bitte geben Sie Ihr neues Passwort ein.' : 'Please enter your new password.'}
        </p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md">
        {status === 'success' ? (
          <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            {message}
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Yeni Şifre' : locale === 'ar' ? 'كلمة المرور الجديدة' : locale === 'de' ? 'Neues Passwort' : 'New Password'}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {locale === 'tr' ? 'Şifre Tekrar' : locale === 'ar' ? 'تأكيد كلمة المرور' : locale === 'de' ? 'Passwort bestätigen' : 'Confirm Password'}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full rounded-xl border border-neutral-800 px-4 py-3 placeholder-neutral-600 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white font-light transition-all duration-200 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            {status === 'error' && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex w-full justify-center items-center rounded-xl bg-brand-500 py-3 px-4 text-sm font-medium text-white shadow-lg shadow-brand-500/10 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 transition-all duration-200"
              >
                {status === 'loading' ? (locale === 'tr' ? 'Güncelleniyor...' : 'Updating...') : (locale === 'tr' ? 'Şifreyi Güncelle' : 'Update Password')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
