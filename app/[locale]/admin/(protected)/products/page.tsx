import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { ProductOverride } from '@/models/ProductOverride';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Plus, Info } from 'lucide-react';
import { ALL_PRODUCTS } from '@/lib/products-data';

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await connectToDatabase();
  
  const dbProducts = await Product.find().sort({ order: 1, createdAt: -1 }).lean();
  const overrides = await ProductOverride.find().lean();
  
  const combinedProducts = [
    // 164 Static Products (with Overrides Applied)
    ...ALL_PRODUCTS.map(p => {
      const override = overrides.find((o: any) => o.legacyProductId === p.id);
      return {
        _id: p.id,
        title: { tr: override?.title?.tr || p.name.tr || (typeof p.name === 'string' ? p.name : '') },
        images: override?.images?.length ? override.images : (override?.image ? [override.image] : [p.image]),
        categorySlug: override?.categorySlug || p.categorySlug,
        isActive: override?.isActive !== undefined ? override.isActive : true,
        price: override?.price,
        isStatic: true,
        hasOverride: !!override
      };
    }),
    // Dynamic DB Products
    ...dbProducts.map((p: any) => ({
      _id: p._id.toString(),
      title: { tr: p.title?.tr || '' },
      images: p.images || [],
      categorySlug: p.categorySlug,
      isActive: p.isActive,
      price: p.price,
      isStatic: false,
      hasOverride: false
    }))
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif text-white">Ürün Yönetimi</h1>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-widest text-xs border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Görsel</th>
                <th className="px-6 py-4 font-medium">Ürün Adı (TR)</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {combinedProducts.length > 0 ? (
                combinedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 bg-neutral-800 rounded overflow-hidden">
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0]} alt={product.title.tr} fill className="object-cover" unoptimized={product.isStatic} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">Yok</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                      {product.title.tr}
                      {product.isStatic && (
                        <span className="flex items-center gap-1 text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full" title="Sistem Dosyası (Salt Okunur)">
                          <Info className="w-3 h-3" /> Eski
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{product.categorySlug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'}`}>
                        {product.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {product.isStatic ? (
                        <span className="text-neutral-500 text-xs">Sistem Ürünü</span>
                      ) : (
                        <button className="text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1">
                          <Edit className="w-4 h-4" />
                          <span>Düzenle</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
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
