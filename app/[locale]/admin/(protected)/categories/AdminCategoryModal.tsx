import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface LocalizedField {
  tr: string;
  en?: string;
  de?: string;
  ru?: string;
  ar?: string;
}

export interface CategoryData {
  _id?: string;
  slug: string;
  title: LocalizedField;
  image: string;
  isActive: boolean;
  isStatic?: boolean;
}

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryData | null;
  onSave: (category: CategoryData) => Promise<void>;
}

export default function AdminCategoryModal({ isOpen, onClose, category, onSave }: AdminCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryData>({
    slug: '',
    title: { tr: '', en: '', de: '', ru: '', ar: '' },
    image: '',
    isActive: true,
  });
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'de' | 'ru' | 'ar'>('tr');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        _id: category._id,
        slug: category.slug,
        title: {
          tr: category.title?.tr || '',
          en: category.title?.en || '',
          de: category.title?.de || '',
          ru: category.title?.ru || '',
          ar: category.title?.ar || '',
        },
        image: category.image || '',
        isActive: category.isActive !== undefined ? category.isActive : true,
        isStatic: category.isStatic,
      });
    } else {
      setFormData({
        slug: '',
        title: { tr: '', en: '', de: '', ru: '', ar: '' },
        image: '',
        isActive: true,
      });
    }
    setErrorMsg('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (lang: string, value: string) => {
    setFormData(prev => ({ ...prev, title: { ...prev.title, [lang]: value } }));
    // Auto-generate slug from TR title if new category and slug is empty
    if (!category && lang === 'tr') {
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug) {
      setErrorMsg('Slug alanı zorunludur.');
      return;
    }
    setIsSaving(true);
    setErrorMsg('');
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Kaydetme başarısız oldu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold font-sans text-white">
            {category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
              {errorMsg}
            </div>
          )}
          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Kategori URL (Slug)</label>
                <input
                  type="text"
                  required
                  disabled={!!category?.isStatic}
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Durum</label>
                <select
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                >
                  <option value="true">Aktif (Sitede Göster)</option>
                  <option value="false">Pasif (Gizle)</option>
                </select>
              </div>
            </div>



            <div className="border border-neutral-800 rounded-xl overflow-hidden">
              <div className="flex bg-neutral-950 border-b border-neutral-800">
                {(['tr', 'en', 'de', 'ru', 'ar'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`flex-1 py-3 text-sm font-medium uppercase tracking-wider transition-colors ${
                      activeTab === lang ? 'bg-brand-600 text-white' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Kategori Adı ({activeTab.toUpperCase()})</label>
                  <input
                    type="text"
                    required={activeTab === 'tr'}
                    value={(formData.title as any)[activeTab] || ''}
                    onChange={e => handleTitleChange(activeTab, e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

          </form>
        </div>
        
        <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            form="categoryForm"
            disabled={isSaving}
            className="px-8 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
