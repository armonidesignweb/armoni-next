/**
 * migrate.js
 * Eski WordPress sitesindeki ürünleri okuyup lib/products-data.ts'e yazar.
 * Çalıştırma: node migrate.js
 */

const fs = require('fs');
const path = require('path');

// ─── PATHS ─────────────────────────────────────────────────────────────────
const OLD_URUN_DIR = path.resolve(
  'C:\\Users\\TOLGA HOCA\\Desktop\\armonidesign.com\\armonidesign-eskihali\\www.armonidesign.com\\urun'
);
const OUTPUT_TS = path.resolve(__dirname, 'lib', 'products-data.ts');
const PUBLIC_PRODUCTS_DIR = path.resolve(__dirname, 'public', 'products');

// ─── HELPERS ────────────────────────────────────────────────────────────────

/** HTML entity decode (minimal) */
function decodeHtmlEntities(str) {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, ''')
    .replace(/&#8217;/g, ''')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

/** <title>Ürün Adı – Armoni Design</title> → "Ürün Adı" */
function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  let title = decodeHtmlEntities(m[1].trim());
  // "Ürün Adı – Armoni Design" → sol taraf
  title = title.replace(/[\–\-]\s*Armoni Design.*/i, '').trim();
  return title || null;
}

/** WordPress kategori: <span class="posted_in">...<a ...>Berjer</a></span> */
function extractCategory(html) {
  const m = html.match(/class="posted_in"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
  if (m) return decodeHtmlEntities(m[1].trim());
  // Alternatif: og:article:section
  const og = html.match(/<meta property="article:section" content="([^"]+)"/i);
  if (og) return decodeHtmlEntities(og[1].trim());
  return 'Genel';
}

/** Birinci ürün resmi: og:image veya woocommerce-product-gallery img[src] */
function extractFirstImage(html) {
  const og = html.match(/<meta property="og:image" content="([^"]+)"/i);
  if (og) return og[1].trim();
  const img = html.match(/woocommerce-product-gallery[\s\S]*?<img[^>]+src="([^"]+)"/i);
  if (img) return img[1].trim();
  return null;
}

/** Galeriden TÜM resimler */
function extractGalleryImages(html) {
  const imgs = [];
  // og:image ilk resim
  const og = html.match(/<meta property="og:image" content="([^"]+)"/i);
  if (og) imgs.push(og[1].trim());
  // woocommerce-product-gallery içindeki tüm src
  const galSection = html.match(/woocommerce-product-gallery([\s\S]*?)(?:class="woocommerce-tabs|class="related)/i);
  if (galSection) {
    const re = /data-src="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi;
    let m;
    while ((m = re.exec(galSection[1])) !== null) {
      const url = m[1].split('?')[0];
      if (!imgs.includes(url)) imgs.push(url);
    }
  }
  return imgs;
}

/** Slug: URL'den veya başlıktan üret */
function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/İ/g, 'i').replace(/Ğ/g, 'g').replace(/Ü/g, 'u')
    .replace(/Ş/g, 's').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Kategoriye göre categorySlug map */
const CATEGORY_MAP = {
  'Berjer': 'berjer',
  'Kanepe': 'kanepe-kose-takimlari',
  'Köşe Takımı': 'kanepe-kose-takimlari',
  'Köşe Koltuk': 'kanepe-kose-takimlari',
  'Sandalye': 'sandalye-benchler',
  'Bench': 'sandalye-benchler',
  'Yatak': 'yatak-odasi',
  'Yatak Odası': 'yatak-odasi',
  'Ayna': 'ayna-konsol',
  'Konsol': 'ayna-konsol',
  'Bahçe': 'bahce-mobilyalari',
  'Genel': 'genel',
};

function getCategorySlug(catName) {
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (catName.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return makeSlug(catName);
}

// ─── COPY IMAGE ─────────────────────────────────────────────────────────────
function copyImageToPublic(srcUrl, productSlug, index) {
  // Yalnızca local dosyaya referans varsa
  const localBase = path.resolve(
    'C:\\Users\\TOLGA HOCA\\Desktop\\armonidesign.com\\armonidesign-eskihali\\www.armonidesign.com'
  );
  // URL → local path
  let relativePath = srcUrl.replace(/^https?:\/\/[^/]+/, '');
  const localSrc = path.join(localBase, relativePath.split('?')[0]);
  if (!fs.existsSync(localSrc)) return null;

  const ext = path.extname(localSrc).toLowerCase() || '.jpg';
  const destDir = path.join(PUBLIC_PRODUCTS_DIR, productSlug);
  fs.mkdirSync(destDir, { recursive: true });
  const destName = `${productSlug}-${index + 1}${ext}`;
  const destPath = path.join(destDir, destName);
  fs.copyFileSync(localSrc, destPath);
  return `/products/${productSlug}/${destName}`;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(OLD_URUN_DIR)) {
    console.error('❌  Eski site klasörü bulunamadı:', OLD_URUN_DIR);
    process.exit(1);
  }

  fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });

  const productDirs = fs.readdirSync(OLD_URUN_DIR).filter(d =>
    fs.statSync(path.join(OLD_URUN_DIR, d)).isDirectory()
  );

  console.log(`📦  ${productDirs.length} ürün klasörü bulundu.`);

  const products = [];
  const slugCount = {};

  for (const dir of productDirs) {
    const htmlPath = path.join(OLD_URUN_DIR, dir, 'index.html');
    if (!fs.existsSync(htmlPath)) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');
    const title = extractTitle(html);
    if (!title) continue;

    let slug = makeSlug(title);
    // Slug çakışma önleme
    if (slugCount[slug]) {
      slugCount[slug]++;
      slug = `${slug}-${slugCount[slug]}`;
    } else {
      slugCount[slug] = 1;
    }

    const catName = extractCategory(html);
    const categorySlug = getCategorySlug(catName);
    const galleryUrls = extractGalleryImages(html);

    // Resimleri public'e kopyala
    const localImages = [];
    galleryUrls.forEach((url, i) => {
      const copied = copyImageToPublic(url, slug, i);
      if (copied) localImages.push(copied);
    });

    // Eğer local kopya yoksa dış URL'yi olduğu gibi kullan
    const images = localImages.length > 0 ? localImages : galleryUrls.slice(0, 3);
    const mainImage = images[0] || '/images/placeholder.jpg';

    products.push({
      id: `p-${dir}`,
      slug,
      name: title,
      categorySlug,
      categoryName: catName,
      images,
      mainImage,
    });

    console.log(`  ✅  ${title} → /${slug}`);
  }

  console.log(`\n🖊️  ${products.length} ürün işlendi, TypeScript dosyası yazılıyor...`);

  // ─── TypeScript çıktısı ────────────────────────────────────────────────
  const locales = ['tr', 'en', 'de', 'ru', 'ar'];

  const tsLines = [];
  tsLines.push(`// AUTO-GENERATED by migrate.js – ${new Date().toISOString()}`);
  tsLines.push(`// Bu dosyayı elle düzenlemeyin; migrate.js ile yeniden oluşturun.\n`);
  tsLines.push(`export interface ProductData {`);
  tsLines.push(`  id: string;`);
  tsLines.push(`  slug: string;`);
  tsLines.push(`  name: Record<string, string>;`);
  tsLines.push(`  categorySlug: string;`);
  tsLines.push(`  categoryName: Record<string, string>;`);
  tsLines.push(`  description: Record<string, string>;`);
  tsLines.push(`  image: string;`);
  tsLines.push(`  images?: string[];`);
  tsLines.push(`  badge?: string;`);
  tsLines.push(`}\n`);
  tsLines.push(`export const ALL_PRODUCTS: ProductData[] = [`);

  for (const p of products) {
    // name – tüm diller Türkçe başlık
    const nameObj = locales.map(l => `${l}: ${JSON.stringify(p.name)}`).join(', ');
    // categoryName – tüm diller Türkçe
    const catObj = locales.map(l => `${l}: ${JSON.stringify(p.categoryName)}`).join(', ');
    // description – şimdilik boş (ileride doldurulacak)
    const descObj = locales.map(l => `${l}: ""`).join(', ');
    // images array
    const imagesArr = JSON.stringify(p.images);

    tsLines.push(`  {`);
    tsLines.push(`    id: ${JSON.stringify(p.id)},`);
    tsLines.push(`    slug: ${JSON.stringify(p.slug)},`);
    tsLines.push(`    name: { ${nameObj} },`);
    tsLines.push(`    categorySlug: ${JSON.stringify(p.categorySlug)},`);
    tsLines.push(`    categoryName: { ${catObj} },`);
    tsLines.push(`    description: { ${descObj} },`);
    tsLines.push(`    image: ${JSON.stringify(p.mainImage)},`);
    tsLines.push(`    images: ${imagesArr},`);
    tsLines.push(`  },`);
  }

  tsLines.push(`];\n`);
  tsLines.push(`export default ALL_PRODUCTS;`);

  fs.writeFileSync(OUTPUT_TS, tsLines.join('\n'), 'utf8');
  console.log(`\n✅  lib/products-data.ts başarıyla oluşturuldu (${products.length} ürün).`);
  console.log(`\n🚀  Sonraki adım: git add . && git commit -m "feat: 163 urun i18n formatiyla aktarildi" && git push`);
}

main();
