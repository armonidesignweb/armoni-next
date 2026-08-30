'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Info, Check, Loader2 } from 'lucide-react';

interface ProductRow {
  _id: string;
  title: { tr: string };
  images: string[];
  categorySlug: string;
  isActive: boolean;
  price?: number;
  isStatic: boolean;
  hasOverride: boolean;
}

export default function AdminProductsClient({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handlePriceClick = useCallback((product: ProductRow) => {
    if (!product.isStatic) return; // Only legacy products use override
    setEditingId(product._id);
    setEditPrice(product.price !== undefined ? product.price.toString() : '');
    setErrorMsg('');
  }, []);

  const handleSave = useCallback(async (productId: string) => {
    setSavingId(productId);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/products/override', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legacyProductId: productId,
          price: editPrice === '' ? null : editPrice,
        }),
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p =>
            p._id === productId
              ? { ...p, price: editPrice === '' ? undefined : Number(editPrice), hasOverride: true }
              : p
          )
        );
        setEditingId(null);
        setSuccessId(productId);
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent, productId: string) => {
    if (e.key === 'Enter') {
      handleSave(productId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setErrorMsg('');
    }
  }, [handleSave]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white">Ürün Yönetimi</h1>
          <p className="text-neutral-500 text-xs mt-1">Fiyat alanına tıklayarak doğrudan düzenleyebilirsiniz</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
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
                  <tr key={product._id} className="hover:bg-neutral-800/50 transition-colors">
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
                      {product.isStatic ? (
                        editingId === product._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product._id)}
                              autoFocus
                              placeholder="0"
                              className="w-28 bg-neutral-950 border border-brand-500 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-400"
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={() => handleSave(product._id)}
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
                            title="Fiyat düzenlemek için tıklayın"
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
                        )
                      ) : (
                        <span className="text-sm">
                          {product.price !== undefined ? `${product.price.toLocaleString('tr-TR')} ₺` : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'}`}>
                        {product.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.isStatic ? (
                        <span className="text-neutral-500 text-xs">
                          {product.hasOverride ? 'Override Mevcut' : 'Sistem Ürünü'}
                        </span>
                      ) : (
                        <span className="text-brand-400 text-xs">DB Ürünü</span>
                      )}
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
    </div>
  );
}
