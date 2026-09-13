'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ContactFormProps {
  t: {
    title: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    success?: string;
  };
}

export default function ContactForm({ t }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      setErrorMessage('Mesajınız gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="lg:col-span-6 glass-card p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
      <h3 className="text-2xl font-light text-white font-serif mb-6">{t.title}</h3>

      {status === 'success' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3 text-emerald-400 rtl:space-x-reverse">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-light leading-relaxed">
            <p className="font-medium text-emerald-300">Mesajınız başarıyla gönderildi.</p>
            <p className="text-xs text-emerald-400/80 mt-1">Size en kısa sürede dönüş yapılacaktır.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-400 rtl:space-x-reverse">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-light leading-relaxed">
            <p className="font-medium text-rose-300">{errorMessage || 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
              {t.name}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.namePlaceholder}
              className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
              {t.email}
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t.emailPlaceholder}
              className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
            {t.phone}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0 212 296 13 56"
            className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-neutral-300 block font-medium">
            {t.message}
          </label>
          <textarea
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t.messagePlaceholder}
            className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-white bg-brand-500 hover:bg-brand-600 py-4 rounded-xl transition-all shadow-xl shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gönderiliyor...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t.send}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
