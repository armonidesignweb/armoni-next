'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import AdminCategoryModal, { CategoryData } from './AdminCategoryModal';
import Image from 'next/image';

interface ProductData {
  _id: string;
  title: { tr: string };
  images: string[];
  categorySlug: string;
  isActive: boolean;
  isStatic: boolean;
}

interface AdminCategoriesClientProps {
  initialCategories: CategoryData[];
  initialProducts: ProductData[];
}

export default function AdminCategoriesClient({ initialCategories, initialProducts }: AdminCategoriesClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  const handleSaveCategory = async (cat: CategoryData) => {
    const isEditing = !!cat._id;
    const url = '/api/admin/categories';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Kaydetme başarısız');

    router.refresh();
    
    // Optimistic update
    if (isEditing) {
      setCategories(prev => prev.map(c => c._id === cat._id ? data.category : c));
    } else {
      setCategories(prev => [...prev, data.category]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Silme başarısız');
      
      setCategories(prev => prev.filter(c => c._id !== id));
      router.refresh();
    } catch (error) {
      alert('Kategori silinemedi.');
    }
  };

  const handleProductCategoryChange = async (productId: string, newCategorySlug: string, isStatic: boolean) => {
    try {
      const url = isStatic ? '/api/admin/products/override' : '/api/admin/products';
      const payload = isStatic 
        ? { legacyProductId: productId, categorySlug: newCategorySlug }
        : { _id: productId, categorySlug: newCategorySlug };
        
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Kategori güncellenemedi');
      
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, categorySlug: newCategorySlug } : p));
      router.refresh();
    } catch (error) {
      alert('Ürün kategorisi güncellenirken hata oluştu.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold font-sans text-white">Kategoriler</h1>
        {activeTab === 'categories' && (
          <button
            onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ekle
          </button>
        )}
      </div>

      <div className="flex space-x-1 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'categories' ? 'border-brand-500 text-brand-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Kategori Yönetimi
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'products' ? 'border-brand-500 text-brand-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Ürün Kategorileri
        </button>
      </div>

      {activeTab === 'categories' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950/50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-medium">Kategori Görseli</th>
                <th className="px-6 py-4 font-medium">Kategori Adı (TR)</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {categories.map((cat) => (
                <tr key={cat.slug} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 relative rounded overflow-hidden bg-neutral-950">
                      <Image src={cat.image || '/images/placeholder.jpg'} alt="" fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{cat.title.tr} {cat.isStatic && <span className="text-xs text-neutral-500 ml-2">(Sistem)</span>}</td>
                  <td className="px-6 py-4 text-neutral-400">{cat.slug}</td>
                  <td className="px-6 py-4">
                    {cat.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
                        <XCircle className="w-3 h-3 mr-1" /> Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                        className="p-2 text-neutral-400 hover:text-brand-400 bg-neutral-950 hover:bg-brand-500/10 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!cat.isStatic && (
                        <button
                          onClick={() => handleDelete(cat._id!)}
                          className="p-2 text-neutral-400 hover:text-red-400 bg-neutral-950 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Henüz kategori bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950/50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-6 py-4 font-medium">Ürün Görseli</th>
                <th className="px-6 py-4 font-medium">Ürün Adı</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 w-24">
                    <div className="w-16 h-16 relative rounded overflow-hidden bg-neutral-950 border border-neutral-800">
                      <Image src={product.images[0] || '/images/placeholder.jpg'} alt="" fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{product.title.tr}</td>
                  <td className="px-6 py-4">
                    <select
                      value={product.categorySlug || ''}
                      onChange={(e) => handleProductCategoryChange(product._id, e.target.value, product.isStatic)}
                      className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 w-full max-w-xs"
                    >
                      <option value="">-- Kategori Seç --</option>
                      {categories.filter(c => c.isActive).map(cat => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.title.tr}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
