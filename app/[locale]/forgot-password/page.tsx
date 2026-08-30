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
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setStatus('success');
      setMessage('E-posta adresi kayıtlıysa şifre yenileme bağlantısı gönderildi.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white font-serif">
          Şifremi Unuttum
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Şifrenizi hatırladınız mı?{' '}
          <Link href={`/${locale}/login`} className="font-medium text-brand-400 hover:text-brand-300">
            Giriş Yap
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-800">
          {status === 'success' ? (
            <div className="text-green-500 text-sm bg-green-500/10 border border-green-500/20 rounded p-4 text-center">
              {message}
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  E-posta Adresi
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-neutral-700 px-3 py-2 placeholder-neutral-500 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded p-3">
                  {message}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex w-full justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {status === 'loading' ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
