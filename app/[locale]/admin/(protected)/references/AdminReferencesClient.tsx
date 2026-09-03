'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import Image from 'next/image';

interface Reference {
  _id: string;
  companyName: string;
  logo: string;
  link: string;
  isActive: boolean;
  order: number;
}

export default function AdminReferencesClient() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<Reference | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    logo: '',
    link: '',
    isActive: true,
  });

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/references?seed=true');
      if (res.ok) {
        const data = await res.json();
        setReferences(data);
      }
    } catch (error) {
      console.error('Error fetching references:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const handleOpenModal = (ref?: Reference) => {
    if (ref) {
      setEditingRef(ref);
      setFormData({
        companyName: ref.companyName,
        logo: ref.logo,
        link: ref.link || '',
        isActive: ref.isActive,
      });
    } else {
      setEditingRef(null);
      setFormData({
        companyName: '',
        logo: '',
        link: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRef ? `/api/admin/references/${editingRef._id}` : '/api/admin/references';
      const method = editingRef ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchReferences();
      } else {
        alert('Kaydetme başarısız!');
      }
    } catch (error) {
      console.error(error);
      alert('Hata oluştu!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu referansı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/references/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchReferences();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const moveRef = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === references.length - 1) return;

    const newRefs = [...references];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newRefs[index];
    newRefs[index] = newRefs[swapIndex];
    newRefs[swapIndex] = temp;

    setReferences(newRefs);

    // Save order
    const orderedIds = newRefs.map(r => r._id);
    try {
      await fetch('/api/admin/references', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedIds }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = async (ref: Reference) => {
    try {
      const res = await fetch(`/api/admin/references/${ref._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !ref.isActive }),
      });
      if (res.ok) {
        fetchReferences();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-neutral-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white">Referanslar</h1>
          <p className="text-neutral-400 text-sm mt-1">Ön yüzdeki referans logolarını buradan yönetebilirsiniz.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          <span>Yeni Ekle</span>
        </button>
      </div>

      {loading ? (
        <div className="text-neutral-400 py-8 text-center">Yükleniyor...</div>
      ) : (
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 text-sm uppercase tracking-wider">
                <th className="p-4 w-16 text-center">Sıra</th>
                <th className="p-4">Logo</th>
                <th className="p-4">Firma Adı</th>
                <th className="p-4">Link</th>
                <th className="p-4 text-center">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {references.map((ref, index) => (
                <tr key={ref._id} className="border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-1 text-neutral-500">
                      <button 
                        onClick={() => moveRef(index, 'up')}
                        disabled={index === 0}
                        className="hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                      >
                        ▲
                      </button>
                      <span className="text-xs">{index + 1}</span>
                      <button 
                        onClick={() => moveRef(index, 'down')}
                        disabled={index === references.length - 1}
                        className="hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="w-16 h-16 relative bg-white rounded-lg p-2 overflow-hidden flex items-center justify-center">
                      {ref.logo ? (
                        <Image
                          src={ref.logo}
                          alt={ref.companyName}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-neutral-400">Yok</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-white">{ref.companyName}</td>
                  <td className="p-4">
                    {ref.link ? (
                      <a href={ref.link} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline text-sm truncate max-w-[200px] inline-block">
                        {ref.link.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-neutral-500 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(ref)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        ref.isActive
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {ref.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(ref)}
                      className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ref._id)}
                      className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {references.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    Henüz hiç referans eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">
                {editingRef ? 'Referans Düzenle' : 'Yeni Referans Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Firma Adı</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                  placeholder="Örn: Asuman"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Kare Logo</label>
                
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-lg border border-neutral-700 flex items-center justify-center overflow-hidden relative p-2 flex-shrink-0">
                    {formData.logo ? (
                      <Image src={formData.logo} alt="Logo Önizleme" fill className="object-contain p-2" unoptimized />
                    ) : (
                      <span className="text-xs text-neutral-400 text-center">Görsel Yok</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        try {
                          const uploadData = new FormData();
                          uploadData.append('file', file);
                          
                          // Optional: add a simple loading indicator or just rely on speed
                          const input = e.target;
                          input.disabled = true;
                          
                          const res = await fetch('/api/admin/upload', {
                            method: 'POST',
                            body: uploadData,
                          });
                          
                          input.disabled = false;
                          
                          if (res.ok) {
                            const { url } = await res.json();
                            setFormData({ ...formData, logo: url });
                          } else {
                            alert('Görsel yüklenemedi.');
                          }
                        } catch (error) {
                          console.error(error);
                          alert('Görsel yüklenirken bir hata oluştu.');
                        }
                      }}
                      className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 transition-colors cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      Sadece tek bir KARE, RENKLİ logo seçin. Siyah-beyaz efekti sitede CSS ile uygulanacaktır.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Web Sitesi (Opsiyonel)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500"
                  placeholder="Örn: https://www.asuman.com"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                </label>
                <span className="text-sm font-medium text-neutral-300">
                  {formData.isActive ? 'Ön Yüzde Görünsün' : 'Gizli (Pasif)'}
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
