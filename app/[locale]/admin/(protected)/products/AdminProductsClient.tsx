'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Info, Check, Loader2, Eye, EyeOff, Edit, Plus } from 'lucide-react';
import AdminProductModal, { ProductData } from './AdminProductModal';

interface ProductRow extends ProductData {
  hasOverride?: boolean;
}

export default function AdminProductsClient({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductRow | null>(null);

  const handlePriceClick = useCallback((product: ProductRow) => {
    // Both legacy and DB products can have price edited inline now if desired, but we keep it open for all or just static as before.
    setEditingId(product._id || null);
    setEditPrice(product.price !== undefined ? product.price.toString() : '');
    setErrorMsg('');
  }, []);

  const handleSavePrice = useCallback(async (product: ProductRow) => {
    setSavingId(product._id || null);
    setErrorMsg('');

    try {
      const endpoint = product.isStatic ? '/api/admin/products/override' : '/api/admin/products';
      const method = 'PUT';
      const body = product.isStatic 
        ? { legacyProductId: product._id, price: editPrice === '' ? null : editPrice }
        : { _id: product._id, price: editPrice === '' ? null : editPrice };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p =>
            p._id === product._id
              ? { ...p, price: editPrice === '' ? undefined : Number(editPrice), hasOverride: p.isStatic ? true : undefined }
              : p
          )
        );
        setEditingId(null);
        setSuccessId(product._id || null);
        setTimeout(() => setSuccessId(null), 2000);
      } else {
        setErrorMsg('Kaydetme hatası');
      }
    } catch (err) {
      setErrorMsg('Bağlantı hatası');
    } finally {
      setSavingId(null);
    }
  }, [editPrice]);

  const handleToggleActive = useCallback(async (product: ProductRow) => {
    setTogglingId(product._id || null);
    setErrorMsg('');

    try {
      const endpoint = product.isStatic ? '/api/admin/products/override' : '/api/admin/products';
      const body = product.isStatic 
        ? { legacyProductId: product._id, isActive: !product.isActive }
        : { _id: product._id, isActive: !product.isActive };

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p =>
            p._id === product._id
              ? { ...p, isActive: !p.isActive, hasOverride: p.isStatic ? true : undefined }
              : p
          )
        );
      } else {
        setErrorMsg('Durum değiştirme hatası');
      }
    } catch (err) {
      setErrorMsg('Bağlantı hatası');
    } finally {
      setTogglingId(null);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, product: ProductRow) => {
    if (e.key === 'Enter') {
      handleSavePrice(product);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setErrorMsg('');
    }
  }, [handleSavePrice]);

  const openModal = (product?: ProductRow) => {
    setCurrentProduct(product || null);
    setIsModalOpen(true);
  };

  const handleModalSave = async (updatedProduct: ProductData) => {
    const isNew = !updatedProduct._id;
    const isStatic = updatedProduct.isStatic;
    
    let endpoint = '/api/admin/products';
    let method = 'POST';
    let payload: any = { ...updatedProduct };

    if (!isNew) {
      method = 'PUT';
      if (isStatic) {
        endpoint = '/api/admin/products/override';
        payload = { ...updatedProduct, legacyProductId: updatedProduct._id };
        delete payload._id;
      }
    }

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Save failed');
    }

    const data = await res.json();
    
    if (isNew) {
      setProducts(prev => [{ ...data.product, isStatic: false }, ...prev]);
    } else {
      setProducts(prev => prev.map(p => {
        if (p._id === updatedProduct._id) {
          return { ...p, ...updatedProduct, hasOverride: isStatic ? true : p.hasOverride };
        }
        return p;
      }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white">Ürün Yönetimi</h1>
          <p className="text-neutral-500 text-xs mt-1">Detay / Düzenle butonu ile detaylı ürün yönetimini kullanabilirsiniz.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" /> Yeni Ürün Ekle
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-widest text-xs border-b border-neutral-800">
              <tr>
                <th className="px-4 py-4 font-medium">Görsel</th>
                <th className="px-4 py-4 font-medium">Ürün Adı (TR)</th>
                <th className="px-4 py-4 font-medium">Kategori</th>
                <th className="px-4 py-4 font-medium">Fiyat (₺)</th>
                <th className="px-4 py-4 font-medium">Durum</th>
                <th className="px-4 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className={`transition-colors ${product.isActive ? 'hover:bg-neutral-800/50' : 'opacity-50 bg-neutral-950/50'}`}>
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 bg-neutral-800 rounded overflow-hidden">
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0]} alt={product.title.tr} fill className="object-cover" unoptimized={product.isStatic} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">Yok</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate max-w-[200px]" title={product.title.tr}>{product.title.tr}</span>
                        {product.isStatic && (
                          <span className="flex-shrink-0 flex items-center gap-1 text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full" title="Legacy Ürün">
                            <Info className="w-3 h-3" /> Eski
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{product.categorySlug}</td>
                    <td className="px-4 py-3">
                      {editingId === product._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, product)}
                            autoFocus
                            placeholder="0"
                            className="w-28 bg-neutral-950 border border-brand-500 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-400"
                            min="0"
                            step="0.50"
                          />
                          <button
                            onClick={() => handleSavePrice(product)}
                            disabled={savingId === product._id}
                            className="p-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded transition-colors disabled:opacity-50"
                            title="Kaydet"
                          >
                            {savingId === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePriceClick(product)}
                          className={`min-w-[80px] text-left px-3 py-1.5 rounded border transition-all ${
                            successId === product._id 
                              ? 'border-green-500/50 bg-green-900/20 text-green-400' 
                              : product.price !== undefined 
                                ? 'border-neutral-700 bg-neutral-800 text-white hover:border-brand-500/50' 
                                : 'border-dashed border-neutral-700 text-neutral-500 hover:border-brand-500/50 hover:text-neutral-300'
                          }`}
                          title="Hızlı fiyat düzenlemek için tıklayın"
                        >
                          {successId === product._id ? (
                            <span className="flex items-center gap-1 text-sm">
                              <Check className="w-3.5 h-3.5" /> Kaydedildi
                            </span>
                          ) : product.price !== undefined ? (
                            <span className="text-sm font-medium">{product.price.toLocaleString('tr-TR')} ₺</span>
                          ) : (
                            <span className="text-xs italic">Fiyat gir...</span>
                          )}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(product)}
                        disabled={togglingId === product._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full transition-all cursor-pointer ${
                          product.isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        } disabled:opacity-50`}
                        title={product.isActive ? 'Pasif yapmak için tıklayın' : 'Aktif yapmak için tıklayın'}
                      >
                        {togglingId === product._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : product.isActive ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {product.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className={`text-[10px] hidden sm:inline-block ${product.hasOverride ? 'text-brand-400' : 'text-neutral-600'}`}>
                          {product.isStatic ? (product.hasOverride ? 'Override Mevcut' : 'Sistem Ürünü') : 'DB Ürünü'}
                        </span>
                        <button
                          onClick={() => openModal(product)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-brand-600 text-neutral-300 hover:text-white rounded text-xs transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" /> Detay / Düzenle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                    Henüz ürün bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={currentProduct}
        onSave={handleModalSave}
      />
    </div>
  );
}
