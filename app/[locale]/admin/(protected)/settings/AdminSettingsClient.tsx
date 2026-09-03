'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

type SiteSettings = {
  siteTitle: string;
  metaDescription: string;
  logo: string;
  favicon: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  otherUrls: string;
  footerText: string;
  googleAnalytics: string;
  googleTagManager: string;
  googleAds: string;
};

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: '',
    metaDescription: '',
    logo: '',
    favicon: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    otherUrls: '',
    footerText: '',
    googleAnalytics: '',
    googleTagManager: '',
    googleAds: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Kaydedilemedi');
      alert('Ayarlar başarıyla kaydedildi.');
    } catch (error) {
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingFavicon(true);

    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'settings');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.url) {
        setSettings(prev => ({ ...prev, [type]: data.url }));
      }
    } catch (error) {
      alert('Görsel yüklenemedi.');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Genel Ayarlar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Genel Site Ayarları</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Site Başlığı (Title)</label>
            <input
              type="text"
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Meta Description</label>
            <textarea
              name="metaDescription"
              value={settings.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Site Logosu</label>
            <div className="flex items-center gap-4">
              {settings.logo && (
                <div className="relative w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                  <Image src={settings.logo} alt="Logo" fill className="object-contain p-2" />
                </div>
              )}
              <div className="flex-1">
                <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} />
                <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo} className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                  <ImageIcon className="w-5 h-5" />
                  {uploadingLogo ? 'Yükleniyor...' : 'Logo Seç / Değiştir'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Favicon</label>
            <div className="flex items-center gap-4">
              {settings.favicon && (
                <div className="relative w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                  <Image src={settings.favicon} alt="Favicon" fill className="object-contain p-1" />
                </div>
              )}
              <div className="flex-1">
                <input type="file" accept="image/*" className="hidden" ref={faviconInputRef} onChange={(e) => handleImageUpload(e, 'favicon')} />
                <button type="button" onClick={() => faviconInputRef.current?.click()} disabled={uploadingFavicon} className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                  <ImageIcon className="w-5 h-5" />
                  {uploadingFavicon ? 'Yükleniyor...' : 'Favicon Seç / Değiştir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İletişim Bilgileri */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">İletişim & Sosyal Medya</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Telefon</label>
            <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">E-posta</label>
            <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">WhatsApp Numarası</label>
            <input type="text" name="whatsapp" value={settings.whatsapp} onChange={handleChange} placeholder="Örn: +905001234567" className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Adres</label>
            <textarea name="address" value={settings.address} onChange={handleChange} rows={2} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Instagram URL</label>
            <input type="text" name="instagram" value={settings.instagram} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Facebook URL</label>
            <input type="text" name="facebook" value={settings.facebook} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Footer Hakkımızda Metni</label>
            <textarea name="footerText" value={settings.footerText} onChange={handleChange} rows={3} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
      </div>

      {/* SEO & Google */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">SEO & Entegrasyonlar</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Google Analytics Kodu</label>
            <textarea name="googleAnalytics" value={settings.googleAnalytics} onChange={handleChange} placeholder="<script>...</script>" rows={4} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Google Tag Manager Kodu</label>
            <textarea name="googleTagManager" value={settings.googleTagManager} onChange={handleChange} placeholder="<script>...</script>" rows={4} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Google Ads / Dönüşüm Kodu</label>
            <textarea name="googleAds" value={settings.googleAds} onChange={handleChange} placeholder="<script>...</script>" rows={4} className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end sticky bottom-6">
        <button type="submit" disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-primary-600/20">
          <Save className="w-5 h-5" />
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </div>
    </form>
  );
}
