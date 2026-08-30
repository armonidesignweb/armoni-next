'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function CustomerLogin() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        throw new Error(data.error || 'Giriş başarısız');
      }

      if (data.user.role !== 'customer') {
        throw new Error('Yetkisiz erişim. Lütfen admin panelini kullanın.');
      }

      window.location.href = `/${locale}/account`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white font-serif">
          Müşteri Girişi
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Hesabınız yok mu?{' '}
          <Link href={`/${locale}/register`} className="font-medium text-brand-400 hover:text-brand-300">
            Kayıt Ol
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-800">
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

              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-neutral-300">
                  Şifre
                </label>
                <div className="text-sm">
                  <Link href={`/${locale}/forgot-password`} className="font-medium text-brand-400 hover:text-brand-300">
                    Şifremi Unuttum
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-neutral-700 px-3 py-2 placeholder-neutral-500 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm bg-neutral-950 text-white"
                />
              </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
