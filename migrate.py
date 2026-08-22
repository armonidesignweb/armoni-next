import os
import re
import shutil
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# ─── PATHS ──────────────────────────────────────────────────────────────────
OLD_URUN_DIR = r"C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armonidesign-eskihali\www.armonidesign.com\urun"
PROJECT_DIR  = r"C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armoni-next"
OUTPUT_TS    = os.path.join(PROJECT_DIR, "lib", "products-data.ts")
PUBLIC_DIR   = os.path.join(PROJECT_DIR, "public", "products")

# ─── HELPERS ────────────────────────────────────────────────────────────────
def decode_entities(s):
    return (s.replace("&#8211;", "–").replace("&#8212;", "—")
             .replace("&#8216;", "\u2018").replace("&#8217;", "\u2019")
             .replace("&#038;", "&").replace("&amp;", "&")
             .replace("&lt;", "<").replace("&gt;", ">")
             .replace("&quot;", '"').replace("&#8220;", "\u201c")
             .replace("&#8221;", "\u201d"))

def extract_title(html):
    m = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    if not m: return None
    title = decode_entities(m.group(1).strip())
    title = re.sub(r"\s*[–\-]\s*Armoni Design.*", "", title, flags=re.IGNORECASE).strip()
    return title or None

def extract_category(html):
    # WooCommerce posted_in span
    m = re.search(r'class="posted_in"[^>]*>.*?<a[^>]*>([^<]+)</a>', html, re.IGNORECASE | re.DOTALL)
    if m: return decode_entities(m.group(1).strip())
    # og:article:section
    m = re.search(r'<meta property="article:section" content="([^"]+)"', html, re.IGNORECASE)
    if m: return decode_entities(m.group(1).strip())
    # breadcrumb son eleman
    m = re.search(r'breadcrumb[^>]*>.*?<span[^>]*>([^<]+)</span>\s*</li>\s*<li[^>]*class="[^"]*current', html, re.IGNORECASE | re.DOTALL)
    if m: return decode_entities(m.group(1).strip())
    return "Genel"

def extract_images(html):
    imgs = []
    # og:image
    m = re.search(r'<meta property="og:image" content="([^"]+)"', html, re.IGNORECASE)
    if m: imgs.append(m.group(1).strip())
    # WooCommerce gallery data-src / data-large_image
    for attr in ["data-large_image", "data-src"]:
        for url in re.findall(rf'{attr}="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"', html, re.IGNORECASE):
            clean = url.split("?")[0]
            if clean not in imgs:
                imgs.append(clean)
    return imgs

def make_slug(text):
    slug = text.lower()
    for tr, en in [("ğ","g"),("ü","u"),("ş","s"),("ı","i"),("ö","o"),("ç","c"),
                   ("İ","i"),("Ğ","g"),("Ü","u"),("Ş","s"),("Ö","o"),("Ç","c")]:
        slug = slug.replace(tr, en)
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")

CATEGORY_MAP = [
    ("berjer",         "berjer"),
    ("kanepe",         "kanepe-kose-takimlari"),
    ("köşe",           "kanepe-kose-takimlari"),
    ("kose",           "kanepe-kose-takimlari"),
    ("sandalye",       "sandalye-benchler"),
    ("bench",          "sandalye-benchler"),
    ("tabure",         "sandalye-benchler"),
    ("yatak",          "yatak-odasi"),
    ("baza",           "yatak-odasi"),
    ("ayna",           "ayna-konsol"),
    ("konsol",         "ayna-konsol"),
    ("bahçe",          "bahce-mobilyalari"),
    ("bahce",          "bahce-mobilyalari"),
    ("ofis",           "ofis"),
]

def get_category_slug(cat_name):
    cat_lower = cat_name.lower()
    for key, val in CATEGORY_MAP:
        if key in cat_lower:
            return val
    return make_slug(cat_name) or "genel"

def copy_image(src_url, product_slug, index):
    """Tries to copy image from local backup; returns public path or None."""
    old_base = r"C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armonidesign-eskihali\www.armonidesign.com"
    relative = re.sub(r"^https?://[^/]+", "", src_url).split("?")[0]
    local_src = os.path.join(old_base, relative.lstrip("/").replace("/", os.sep))
    if not os.path.exists(local_src):
        return None
    ext = os.path.splitext(local_src)[1].lower() or ".jpg"
    dest_dir = os.path.join(PUBLIC_DIR, product_slug)
    os.makedirs(dest_dir, exist_ok=True)
    dest_name = f"{product_slug}-{index + 1}{ext}"
    dest_path = os.path.join(dest_dir, dest_name)
    shutil.copy2(local_src, dest_path)
    return f"/products/{product_slug}/{dest_name}"

# ─── MAIN ───────────────────────────────────────────────────────────────────
def main():
    if not os.path.isdir(OLD_URUN_DIR):
        print(f"❌ Eski site klasörü bulunamadı: {OLD_URUN_DIR}")
        return

    os.makedirs(PUBLIC_DIR, exist_ok=True)

    product_dirs = [d for d in os.listdir(OLD_URUN_DIR)
                    if os.path.isdir(os.path.join(OLD_URUN_DIR, d))]
    print(f"[INFO] {len(product_dirs)} urun klasoru bulundu.")

    products = []
    slug_count = {}

    for d in sorted(product_dirs):
        html_path = os.path.join(OLD_URUN_DIR, d, "index.html")
        if not os.path.exists(html_path):
            continue

        with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()

        title = extract_title(html)
        if not title:
            continue

        base_slug = make_slug(title)
        slug_count[base_slug] = slug_count.get(base_slug, 0) + 1
        slug = base_slug if slug_count[base_slug] == 1 else f"{base_slug}-{slug_count[base_slug]}"

        cat_name     = extract_category(html)
        cat_slug     = get_category_slug(cat_name)
        gallery_urls = extract_images(html)

        # Copy images locally
        local_images = []
        for i, url in enumerate(gallery_urls):
            copied = copy_image(url, slug, i)
            if copied:
                local_images.append(copied)

        images     = local_images if local_images else gallery_urls[:3]
        main_image = images[0] if images else "/images/placeholder.jpg"

        products.append({
            "id":           f"p-{d}",
            "slug":         slug,
            "name":         title,
            "cat_name":     cat_name,
            "cat_slug":     cat_slug,
            "images":       images,
            "main_image":   main_image,
        })
        print(f"  [OK]  {title}  ->  /{slug}")

    print(f"\n[INFO] {len(products)} urun islendi. TypeScript dosyasi yaziliyor...")

    locales = ["tr", "en", "de", "ru", "ar"]

    lines = []
    lines.append("// AUTO-GENERATED – migrate.py")
    lines.append(f"// {len(products)} ürün")
    lines.append("")
    lines.append("export interface ProductData {")
    lines.append("  id: string;")
    lines.append("  slug: string;")
    lines.append("  name: Record<string, string>;")
    lines.append("  categorySlug: string;")
    lines.append("  categoryName: Record<string, string>;")
    lines.append("  description: Record<string, string>;")
    lines.append("  image: string;")
    lines.append("  images?: string[];")
    lines.append("  badge?: string;")
    lines.append("}")
    lines.append("")
    lines.append("export const ALL_PRODUCTS: ProductData[] = [")

    for p in products:
        name_obj = ", ".join(f'{l}: {json.dumps(p["name"], ensure_ascii=False)}' for l in locales)
        cat_obj  = ", ".join(f'{l}: {json.dumps(p["cat_name"], ensure_ascii=False)}' for l in locales)
        desc_obj = ", ".join(f'{l}: ""' for l in locales)
        imgs_ts  = json.dumps(p["images"], ensure_ascii=False)

        lines.append("  {")
        lines.append(f'    id: {json.dumps(p["id"])},')
        lines.append(f'    slug: {json.dumps(p["slug"])},')
        lines.append(f'    name: {{ {name_obj} }},')
        lines.append(f'    categorySlug: {json.dumps(p["cat_slug"])},')
        lines.append(f'    categoryName: {{ {cat_obj} }},')
        lines.append(f'    description: {{ {desc_obj} }},')
        lines.append(f'    image: {json.dumps(p["main_image"])},')
        lines.append(f'    images: {imgs_ts},')
        lines.append("  },")

    lines.append("];")
    lines.append("")
    lines.append("export default ALL_PRODUCTS;")

    with open(OUTPUT_TS, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"\n[DONE] lib/products-data.ts basariyla olusturuldu ({len(products)} urun).")

if __name__ == "__main__":
    main()
