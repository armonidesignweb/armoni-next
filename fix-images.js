const fs = require('fs');
const path = require('path');

const OLD_BASE = 'C:\\Users\\TOLGA HOCA\\Desktop\\armonidesign.com\\armonidesign-eskihali\\www.armonidesign.com';
const OLD_URUN_DIR = path.join(OLD_BASE, 'urun');
const PROJECT_DIR = 'C:\\Users\\TOLGA HOCA\\Desktop\\armonidesign.com\\armoni-next';
const PUBLIC_PRODUCTS_DIR = path.join(PROJECT_DIR, 'public', 'products');
const PRODUCTS_DATA_FILE = path.join(PROJECT_DIR, 'lib', 'products-data.ts');

function sanitizeFilename(filename) {
  const ext = path.extname(filename);
  let name = path.basename(filename, ext).toLowerCase();
  
  const trMap = {
    'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c',
    'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c'
  };
  
  for (const [key, val] of Object.entries(trMap)) {
    name = name.split(key).join(val);
  }
  
  name = name.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${name}${ext.toLowerCase()}`;
}

function cleanUrl(url) {
  return url.split('?')[0].split('#')[0];
}

function main() {
  if (!fs.existsSync(OLD_URUN_DIR)) {
    console.error(`❌ Error: ${OLD_URUN_DIR} does not exist.`);
    return;
  }

  if (!fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
    fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
  }

  const productDirs = fs.readdirSync(OLD_URUN_DIR).filter(d => 
    fs.statSync(path.join(OLD_URUN_DIR, d)).isDirectory()
  );

  console.log(`[INFO] Found ${productDirs.length} product directories.`);

  const products = [];
  const slugCount = {};

  for (const d of productDirs.sort()) {
    const htmlPath = path.join(OLD_URUN_DIR, d, 'index.html');
    if (!fs.existsSync(htmlPath)) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');

    // Extract title
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (!titleMatch) continue;
    let title = titleMatch[1].trim();
    title = title
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&#8216;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#038;/g, '&')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
    title = title.replace(/\s*[–\-]\s*Armoni Design.*/i, '').trim();

    // Slug
    let baseSlug = title.toLowerCase();
    const trMap = {
      'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c',
      'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c'
    };
    for (const [key, val] of Object.entries(trMap)) {
      baseSlug = baseSlug.split(key).join(val);
    }
    baseSlug = baseSlug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    slugCount[baseSlug] = (slugCount[baseSlug] || 0) + 1;
    const slug = slugCount[baseSlug] === 1 ? baseSlug : `${baseSlug}-${slugCount[baseSlug]}`;

    // Category
    let catName = 'Genel';
    const catMatch = html.match(/class="posted_in"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
    if (catMatch) {
      catName = catMatch[1].trim();
    } else {
      const catMatch2 = html.match(/<meta property="article:section" content="([^"]+)"/i);
      if (catMatch2) {
        catName = catMatch2[1].trim();
      }
    }

    // Category Slug
    const categoryMap = [
      ['berjer', 'berjer'],
      ['kanepe', 'kanepe-kose-takimlari'],
      ['köşe', 'kanepe-kose-takimlari'],
      ['kose', 'kanepe-kose-takimlari'],
      ['sandalye', 'sandalye-benchler'],
      ['bench', 'sandalye-benchler'],
      ['tabure', 'sandalye-benchler'],
      ['yatak', 'yatak-odasi'],
      ['baza', 'yatak-odasi'],
      ['ayna', 'ayna-konsol'],
      ['konsol', 'ayna-konsol'],
      ['bahçe', 'bahce-mobilyalari'],
      ['bahce', 'bahce-mobilyalari'],
      ['ofis', 'ofis']
    ];
    let catSlug = 'genel';
    const catLower = catName.toLowerCase();
    for (const [key, val] of categoryMap) {
      if (catLower.includes(key)) {
        catSlug = val;
        break;
      }
    }
    if (catSlug === 'genel') {
      let cs = catName.toLowerCase();
      for (const [key, val] of Object.entries(trMap)) {
        cs = cs.split(key).join(val);
      }
      catSlug = cs.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'genel';
    }

    // Find all raw images containing wp-content/uploads/
    const rawUrls = [];
    const re = /(?:src|href)="([^"]*wp-content\/uploads\/[^"]+?\.(?:jpg|jpeg|png|webp))"/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      const clean = cleanUrl(m[1]);
      // Ignore thumbnail size images
      if (!/-\d+x\d+\.(?:jpg|jpeg|png|webp)$/i.test(clean)) {
        // Ignore logo images
        if (!['armoni-koltuk', 'armoni-beyaz', 'logo'].some(logo => clean.toLowerCase().includes(logo))) {
          if (!rawUrls.includes(clean)) {
            rawUrls.push(clean);
          }
        }
      }
    }

    // Copy images
    const copiedImages = [];
    rawUrls.forEach((rUrl, idx) => {
      const relPath = rUrl.replace(/\//g, path.sep);
      const wpIndex = relPath.indexOf('wp-content');
      let srcFilePath;
      if (wpIndex !== -1) {
        srcFilePath = path.join(OLD_BASE, relPath.substring(wpIndex));
      } else {
        srcFilePath = path.resolve(path.dirname(htmlPath), relPath);
      }

      if (fs.existsSync(srcFilePath)) {
        const originalFilename = path.basename(srcFilePath);
        const sanitizedName = sanitizeFilename(originalFilename);
        const destFilePath = path.join(PUBLIC_PRODUCTS_DIR, sanitizedName);
        try {
          fs.copyFileSync(srcFilePath, destFilePath);
          const publicPath = `/products/${sanitizedName}`;
          if (!copiedImages.includes(publicPath)) {
            copiedImages.push(publicPath);
          }
        } catch (e) {
          console.error(`  [ERROR] Failed to copy ${srcFilePath} to ${destFilePath}: ${e}`);
        }
      }
    });

    if (copiedImages.length === 0) {
      copiedImages.push('/images/placeholder.jpg');
    }

    products.push({
      id: `p-${d}`,
      slug,
      name: title,
      catName,
      catSlug,
      images: copiedImages,
      mainImage: copiedImages[0]
    });
    console.log(`  [OK] Processed ${title} -> ${JSON.stringify(copiedImages)}`);
  }

  // Write TS file
  const locales = ['tr', 'en', 'de', 'ru', 'ar'];
  const tsLines = [
    '// AUTO-GENERATED – fix-images.js',
    `// ${products.length} products with sanitized image paths`,
    '',
    'export interface ProductData {',
    '  id: string;',
    '  slug: string;',
    '  name: Record<string, string>;',
    '  categorySlug: string;',
    '  categoryName: Record<string, string>;',
    '  description: Record<string, string>;',
    '  image: string;',
    '  images?: string[];',
    '  badge?: string;',
    '}',
    '',
    'export const ALL_PRODUCTS: ProductData[] = ['
  ];

  for (const p of products) {
    const nameObj = locales.map(l => `${l}: ${JSON.stringify(p.name)}`).join(', ');
    const catObj = locales.map(l => `${l}: ${JSON.stringify(p.catName)}`).join(', ');
    const descObj = locales.map(l => `${l}: ""`).join(', ');
    const imgsTs = JSON.stringify(p.images);

    tsLines.push('  {');
    tsLines.push(`    id: ${JSON.stringify(p.id)},`);
    tsLines.push(`    slug: ${JSON.stringify(p.slug)},`);
    tsLines.push(`    name: { ${nameObj} },`);
    tsLines.push(`    categorySlug: ${JSON.stringify(p.catSlug)},`);
    tsLines.push(`    categoryName: { ${catObj} },`);
    tsLines.push(`    description: { ${descObj} },`);
    tsLines.push(`    image: ${JSON.stringify(p.mainImage)},`);
    tsLines.push(`    images: ${imgsTs},`);
    tsLines.push('  },');
  }

  tsLines.push('];');
  tsLines.push('');
  tsLines.push('export default ALL_PRODUCTS;');

  fs.writeFileSync(PRODUCTS_DATA_FILE, tsLines.join('\n'), 'utf8');
  console.log(`\n[DONE] Successfully wrote ${products.length} products to products-data.ts`);
}

main();
