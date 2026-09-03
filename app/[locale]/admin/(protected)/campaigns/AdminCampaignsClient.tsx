'use client';

import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

type LocalizedString = { tr: string; en: string; de: string; ru: string; ar: string };

type Campaign = {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  isActive: boolean;
  targetUrl: string;
  startDate: string;
  endDate: string | null;
};

export default function AdminCampaignsClient({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [activeLang, setActiveLang] = useState<keyof LocalizedString>('tr');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: { tr: '', en: '', de: '', ru: '', ar: '' },
    description: { tr: '', en: '', de: '', ru: '', ar: '' },
    image: '',
    isActive: true,
    targetUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const resetForm = () => {
    setFormData({
      title: { tr: '', en: '', de: '', ru: '', ar: '' },
      description: { tr: '', en: '', de: '', ru: '', ar: '' },
      image: '',
      isActive: true,
      targetUrl: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setEditingCampaign(null);
    setActiveLang('tr');
  };

  const openModal = (campaign?: Campaign) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        title: { ...campaign.title },
        description: { ...campaign.description },
        image: campaign.image || '',
        isActive: campaign.isActive,
        targetUrl: campaign.targetUrl || '',
        startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'campaigns');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Görsel yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.tr || !formData.description.tr) {
      alert('Türkçe başlık ve açıklama zorunludur.');
      return;
    }

    setLoading(true);
    try {
      const url = editingCampaign 
        ? `/api/admin/campaigns/${editingCampaign._id}`
        : '/api/admin/campaigns';
      const method = editingCampaign ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        })
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      
      if (editingCampaign) {
        setCampaigns(prev => prev.map(c => c._id === data._id ? data : c));
      } else {
        setCampaigns(prev => [data, ...prev]);
      }
      
      closeModal();
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setCampaigns(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      alert('Silinemedi.');
    }
  };

  const toggleActive = async (campaign: Campaign) => {
    try {
      const res = await fetch(`/api/admin/campaigns/${campaign._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !campaign.isActive })
      });
      if (res.ok) {
        setCampaigns(prev => prev.map(c => c._id === campaign._id ? { ...c, isActive: !c.isActive } : c));
      }
    } catch (error) {
      alert('Durum güncellenemedi.');
    }
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-sans text-white">Kampanyalar</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Kampanya Ekle
        </button>
      </div>

      <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-700 bg-neutral-800">
              <th className="p-4 text-neutral-300 font-medium">Görsel</th>
              <th className="p-4 text-neutral-300 font-medium">Başlık (TR)</th>
              <th className="p-4 text-neutral-300 font-medium">Başlangıç</th>
              <th className="p-4 text-neutral-300 font-medium">Bitiş</th>
              <th className="p-4 text-neutral-300 font-medium">Durum</th>
              <th className="p-4 text-neutral-300 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((item) => (
              <tr key={item._id} className="border-b border-neutral-700/50 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  {item.image ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                      <Image src={item.image} alt={item.title.tr} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-neutral-700 flex items-center justify-center text-neutral-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </td>
                <td className="p-4 text-white font-medium">{item.title.tr}</td>
                <td className="p-4 text-neutral-400 text-sm">
                  {item.startDate ? new Date(item.startDate).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td className="p-4 text-neutral-400 text-sm">
                  {item.endDate ? new Date(item.endDate).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleActive(item)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-neutral-700 text-neutral-400'}`}
                  >
                    {item.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  Henüz kampanya bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-10 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}
              </h2>
              <button onClick={closeModal} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Language Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
                {(['tr', 'en', 'de', 'ru', 'ar'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                      activeLang === lang 
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30' 
                        : 'text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Başlık ({activeLang.toUpperCase()}) {activeLang === 'tr' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={activeLang === 'tr'}
                    value={formData.title[activeLang]}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [activeLang]: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Açıklama ({activeLang.toUpperCase()}) {activeLang === 'tr' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    required={activeLang === 'tr'}
                    rows={4}
                    value={formData.description[activeLang]}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, [activeLang]: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Bitiş Tarihi (İsteğe bağlı)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Hedef URL (Bağlantı)</label>
                <input
                  type="url"
                  placeholder="Örn: https://armonidesign.com/urunler/..."
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Kampanya Görseli</label>
                  <div className="flex gap-4 items-start">
                    {formData.image && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-neutral-700">
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <ImageIcon className="w-5 h-5" />
                        {uploading ? 'Yükleniyor...' : 'Görsel Seç / Değiştir'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isActive ? 'bg-primary-600' : 'bg-neutral-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="text-white font-medium">Aktif olarak yayınla</span>
                  </label>
                  <p className="text-sm text-neutral-500 mt-2">
                    Eğer kapalıysa veya bitiş tarihi geçmişse, müşteri panelinde görünmez.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : (
                    <>
                      <Check className="w-5 h-5" />
                      {editingCampaign ? 'Güncelle' : 'Kaydet'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
