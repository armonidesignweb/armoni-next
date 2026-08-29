import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Image from 'next/image';

export default async function CustomerProductsPage() {
  await connectToDatabase();
  
  // Sadece aktif ürünleri getir
  const products = await Product.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif mb-2 text-white">Ürünler ve Fiyatlar</h1>
      <p className="text-neutral-400 text-sm mb-8">Koleksiyonumuza ait tüm güncel ürünleri ve size özel fiyatlandırmaları buradan inceleyebilirsiniz.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id.toString()} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group hover:border-brand-500/50 transition-colors">
              <div className="relative aspect-square bg-neutral-950 p-6 flex items-center justify-center">
                {product.images && product.images[0] ? (
                  <Image 
                    src={product.images[0]} 
                    alt={product.title.tr} 
                    fill 
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">Görsel Yok</div>
                )}
              </div>
              <div className="p-5 border-t border-neutral-800">
                <div className="text-xs text-brand-400 uppercase tracking-widest mb-1">{product.categorySlug.replace('-', ' ')}</div>
                <h3 className="text-lg font-medium text-white font-serif mb-2">{product.title.tr}</h3>
                
                {/* Admin can set specific prices via metadata in the future, for now show standard CTA */}
                <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
                  <span className="text-neutral-400 text-sm">Fiyat için tıklayın</span>
                  <button className="text-brand-400 hover:text-white transition-colors text-sm font-medium">İncele →</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800">
            Katalogda ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
