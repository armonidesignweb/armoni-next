import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface LocalizedField {
  tr: string;
  en?: string;
  de?: string;
  ru?: string;
  ar?: string;
}

export interface ProjectData {
  _id?: string;
  title: LocalizedField;
  description: LocalizedField;
  location: string;
  year: number;
  images: string[];
  isActive: boolean;
}

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
  onSave: (project: ProjectData) => Promise<void>;
}

export default function AdminProjectModal({ isOpen, onClose, project, onSave }: AdminProjectModalProps) {
  const [formData, setFormData] = useState<ProjectData>({
    title: { tr: '', en: '', de: '', ru: '', ar: '' },
    description: { tr: '', en: '', de: '', ru: '', ar: '' },
    location: '',
    year: new Date().getFullYear(),
    images: [],
    isActive: true,
  });
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'de' | 'ru' | 'ar'>('tr');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        _id: project._id,
        title: {
          tr: project.title?.tr || '',
          en: project.title?.en || '',
          de: project.title?.de || '',
          ru: project.title?.ru || '',
          ar: project.title?.ar || '',
        },
        description: {
          tr: project.description?.tr || '',
          en: project.description?.en || '',
          de: project.description?.de || '',
          ru: project.description?.ru || '',
          ar: project.description?.ar || '',
        },
        location: project.location || '',
        year: project.year || new Date().getFullYear(),
        images: project.images?.length ? [...project.images] : [],
        isActive: project.isActive !== undefined ? project.isActive : true,
      });
    } else {
      setFormData({
        title: { tr: '', en: '', de: '', ru: '', ar: '' },
        description: { tr: '', en: '', de: '', ru: '', ar: '' },
        location: '',
        year: new Date().getFullYear(),
        images: [],
        isActive: true,
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (lang: string, value: string) => {
    setFormData(prev => ({ ...prev, title: { ...prev.title, [lang]: value } }));
  };

  const handleDescChange = (lang: string, value: string) => {
    setFormData(prev => ({ ...prev, description: { ...prev.description, [lang]: value } }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/admin/projects/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      } else {
        alert('Görsel yüklenemedi.');
      }
    } catch (error) {
      console.error(error);
      alert('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.images.length - 1) return;
    
    setFormData(prev => {
      const newImages = [...prev.images];
      const target = direction === 'up' ? index - 1 : index + 1;
      [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
      return { ...prev, images: newImages };
    });
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const newImages = [...prev.images];
      const cover = newImages.splice(index, 1)[0];
      newImages.unshift(cover);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Lütfen en az bir proje görseli ekleyin.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Kaydetme başarısız oldu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold font-sans text-white">
            {project ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="projectForm" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Örn: Residential"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Yıl</label>
                <input
                  type="number"
                  required
                  value={formData.year || ''}
                  onChange={e => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
                  placeholder="2024"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
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
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Proje Adı ({activeTab.toUpperCase()})</label>
                  <input
                    type="text"
                    required={activeTab === 'tr'}
                    value={(formData.title as any)[activeTab] || ''}
                    onChange={e => handleTitleChange(activeTab, e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Kısa Açıklama ({activeTab.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={(formData.description as any)[activeTab] || ''}
                    onChange={e => handleDescChange(activeTab, e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-neutral-400">Proje Görselleri (İlk görsel kapak olur)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    className="inline-flex items-center text-xs text-brand-400 hover:text-brand-300 bg-brand-500/10 px-3 py-1.5 rounded-full disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3 mr-1" /> {uploadingImage ? 'Yükleniyor...' : 'Görsel Yükle'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {formData.images.map((img, i) => (
                  <div key={i} className="flex gap-2 items-center bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                    <div className="flex-shrink-0 w-16 h-16 bg-neutral-900 rounded border border-neutral-700 flex items-center justify-center overflow-hidden relative">
                      {img ? (
                        <Image src={img} alt="" fill className="object-cover" unoptimized />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-neutral-600" />
                      )}
                    </div>
                    <div className="flex-1 px-2 overflow-hidden">
                      <p className="text-sm text-neutral-300 truncate">{img.split('/').pop()}</p>
                      {i === 0 && <span className="text-xs text-brand-400">Ana/Kapak Görseli</span>}
                    </div>
                    <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
                      <button type="button" onClick={() => moveImage(i, 'up')} disabled={i === 0} className="p-1.5 text-neutral-500 hover:text-white disabled:opacity-30">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => moveImage(i, 'down')} disabled={i === formData.images.length - 1} className="p-1.5 text-neutral-500 hover:text-white disabled:opacity-30">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      {i !== 0 && (
                        <button type="button" onClick={() => setAsCover(i)} className="p-1.5 text-brand-500 hover:text-brand-400 text-xs font-medium px-2 border border-brand-500/30 rounded">
                          Kapak Yap
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(i)} className="p-1.5 text-red-500 hover:text-red-400 ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {formData.images.length === 0 && (
                  <div className="text-center p-6 border border-dashed border-neutral-700 rounded-lg text-neutral-500 text-sm">
                    Henüz görsel eklenmemiş. Lütfen "Görsel Yükle" butonunu kullanın.
                  </div>
                )}
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
            form="projectForm"
            disabled={isSaving}
            className="px-8 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
