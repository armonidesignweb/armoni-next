import os
import re
import shutil
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

OLD_BASE = r"C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armonidesign-eskihali\www.armonidesign.com"
OLD_URUN_DIR = os.path.join(OLD_BASE, "urun")
PROJECT_DIR = r"C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armoni-next"
PUBLIC_PRODUCTS_DIR = os.path.join(PROJECT_DIR, "public", "products")
PRODUCTS_DATA_FILE = os.path.join(PROJECT_DIR, "lib", "products-data.ts")

# Helper to sanitize filenames (slug format)
def sanitize_filename(filename):
    name, ext = os.path.splitext(filename)
    name = name.lower()
    for tr, en in [("ğ","g"),("ü","u"),("ş","s"),("ı","i"),("ö","o"),("ç","c"),
                   ("İ","i"),("Ğ","g"),("Ü","u"),("Ş","s"),("Ö","o"),("Ç","c")]:
        name = name.replace(tr, en)
    name = re.sub(r"[^a-z0-9]+", "-", name)
    name = name.strip("-")
    return f"{name}{ext.lower()}"

def clean_url(url):
    return url.split('?')[0].split('#')[0]

# Parse all products from the filesystem and update products-data.ts
def main():
    if not os.path.exists(OLD_URUN_DIR):
        print(f"❌ Error: {OLD_URUN_DIR} does not exist.")
        return

    os.makedirs(PUBLIC_PRODUCTS_DIR, exist_ok=True)

    # 1. Load current products-data.ts to keep other fields (badge, etc.) if any
    # Actually, we can just regenerate it like migrate.py did, but with fixed image paths.
    # Let's read all products in OLD_URUN_DIR
    product_dirs = [d for d in os.listdir(OLD_URUN_DIR) if os.path.isdir(os.path.join(OLD_URUN_DIR, d))]
    print(f"[INFO] Found {len(product_dirs)} product directories.")

    products = []
    slug_count = {}

    for d in sorted(product_dirs):
        html_path = os.path.join(OLD_URUN_DIR, d, "index.html")
        if not os.path.exists(html_path):
            continue

        with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()

        # Extract title
        m = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
        if not m:
            continue
        title = m.group(1).strip()
        # Decode HTML entities
        title = (title.replace("&#8211;", "–").replace("&#8212;", "—")
                      .replace("&#8216;", "'").replace("&#8217;", "'")
                      .replace("&#038;", "&").replace("&amp;", "&")
                      .replace("&lt;", "<").replace("&gt;", ">")
                      .replace("&quot;", '"'))
        title = re.sub(r"\s*[–\-]\s*Armoni Design.*", "", title, flags=re.IGNORECASE).strip()

        # Slug
        base_slug = title.lower()
        for tr, en in [("ğ","g"),("ü","u"),("ş","s"),("ı","i"),("ö","o"),("ç","c"),
                       ("İ","i"),("Ğ","g"),("Ü","u"),("Ş","s"),("Ö","o"),("Ç","c")]:
            base_slug = base_slug.replace(tr, en)
        base_slug = re.sub(r"[^a-z0-9]+", "-", base_slug).strip("-")

        slug_count[base_slug] = slug_count.get(base_slug, 0) + 1
        slug = base_slug if slug_count[base_slug] == 1 else f"{base_slug}-{slug_count[base_slug]}"

        # Category
        cat_name = "Genel"
        m_cat = re.search(r'class="posted_in"[^>]*>.*?<a[^>]*>([^<]+)</a>', html, re.IGNORECASE | re.DOTALL)
        if m_cat:
            cat_name = m_cat.group(1).strip()
        else:
            m_cat2 = re.search(r'<meta property="article:section" content="([^"]+)"', html, re.IGNORECASE)
            if m_cat2:
                cat_name = m_cat2.group(1).strip()

        # Category Slug
        CATEGORY_MAP = [
            ("berjer", "berjer"),
            ("kanepe", "kanepe-kose-takimlari"),
            ("köşe", "kanepe-kose-takimlari"),
            ("kose", "kanepe-kose-takimlari"),
            ("sandalye", "sandalye-benchler"),
            ("bench", "sandalye-benchler"),
            ("tabure", "sandalye-benchler"),
            ("yatak", "yatak-odasi"),
            ("baza", "yatak-odasi"),
            ("ayna", "ayna-konsol"),
            ("konsol", "ayna-konsol"),
            ("bahçe", "bahce-mobilyalari"),
            ("bahce", "bahce-mobilyalari"),
            ("ofis", "ofis"),
        ]
        cat_slug = "genel"
        cat_lower = cat_name.lower()
        for key, val in CATEGORY_MAP:
            if key in cat_lower:
                cat_slug = val
                break
        if cat_slug == "genel":
            # slugify category
            cs = cat_name.lower()
            for tr, en in [("ğ","g"),("ü","u"),("ş","s"),("ı","i"),("ö","o"),("ç","c"),
                           ("İ","i"),("Ğ","g"),("Ü","u"),("Ş","s"),("Ö","o"),("Ç","c")]:
                cs = cs.replace(tr, en)
            cat_slug = re.sub(r"[^a-z0-9]+", "-", cs).strip("-") or "genel"

        # Find all raw images containing wp-content/uploads/
        raw_urls = []
        # Match src="..." or href="..."
        matches = re.findall(r'(?:src|href)="([^"]*wp-content/uploads/[^"]+?\.(?:jpg|jpeg|png|webp))"', html, re.IGNORECASE)
        for url in matches:
            clean = clean_url(url)
            # Ignore size-cropped thumbnail images
            if not re.search(r'-\d+x\d+\.(?:jpg|jpeg|png|webp)$', clean, re.IGNORECASE):
                # Ignore header/footer logo images
                if not any(logo in clean.lower() for logo in ["armoni-koltuk", "armoni-beyaz", "logo"]):
                    if clean not in raw_urls:
                        raw_urls.append(clean)

        # Copy images
        copied_images = []
        for idx, r_url in enumerate(raw_urls):
            # Resolve relative path
            # Example: ../../wp-content/uploads/2026/01/Regalia-sandalye.png
            # Resolved relative to html_path parent directory
            rel_path = r_url.replace('/', os.sep)
            # If it starts with ../ or absolute, handle it
            # Standard wordpress path is relative like: ../../wp-content/uploads/...
            # Let's construct path relative to OLD_BASE by extracting everything from wp-content onwards
            wp_index = rel_path.find("wp-content")
            if wp_index != -1:
                sub_path = rel_path[wp_index:]
                src_file_path = os.path.join(OLD_BASE, sub_path)
            else:
                # Try relative to the HTML file
                src_file_path = os.path.abspath(os.path.join(os.path.dirname(html_path), rel_path))

            if os.path.exists(src_file_path):
                original_filename = os.path.basename(src_file_path)
                sanitized_name = sanitize_filename(original_filename)
                
                # Copy to public/products/sanitized_name
                dest_file_path = os.path.join(PUBLIC_PRODUCTS_DIR, sanitized_name)
                try:
                    shutil.copy2(src_file_path, dest_file_path)
                    public_path = f"/products/{sanitized_name}"
                    if public_path not in copied_images:
                        copied_images.append(public_path)
                except Exception as e:
                    print(f"  [ERROR] Failed to copy {src_file_path} to {dest_file_path}: {e}")

        # If no images copied, use a default placeholder
        if not copied_images:
            copied_images = ["/images/placeholder.jpg"]

        products.append({
            "id": f"p-{d}",
            "slug": slug,
            "name": title,
            "cat_name": cat_name,
            "cat_slug": cat_slug,
            "images": copied_images,
            "main_image": copied_images[0]
        })
        print(f"  [OK] Processed {title} -> {copied_images}")

    # Write out products-data.ts
    locales = ["tr", "en", "de", "ru", "ar"]
    ts_lines = [
        "// AUTO-GENERATED – fix-images.py",
        f"// {len(products)} products with sanitized image paths",
        "",
        "export interface ProductData {",
        "  id: string;",
        "  slug: string;",
        "  name: Record<string, string>;",
        "  categorySlug: string;",
        "  categoryName: Record<string, string>;",
        "  description: Record<string, string>;",
        "  image: string;",
        "  images?: string[];",
        "  badge?: string;",
        "}",
        "",
        "export const ALL_PRODUCTS: ProductData[] = ["
    ]

    for p in products:
        name_obj = ", ".join(f'{l}: {json.dumps(p["name"], ensure_ascii=False)}' for l in locales)
        cat_obj  = ", ".join(f'{l}: {json.dumps(p["cat_name"], ensure_ascii=False)}' for l in locales)
        desc_obj = ", ".join(f'{l}: ""' for l in locales)
        imgs_ts  = json.dumps(p["images"], ensure_ascii=False)

        ts_lines.append("  {")
        ts_lines.append(f'    id: {json.dumps(p["id"])},')
        ts_lines.append(f'    slug: {json.dumps(p["slug"])},')
        ts_lines.append(f'    name: {{ {name_obj} }},')
        ts_lines.append(f'    categorySlug: {json.dumps(p["cat_slug"])},')
        ts_lines.append(f'    categoryName: {{ {cat_obj} }},')
        ts_lines.append(f'    description: {{ {desc_obj} }},')
        ts_lines.append(f'    image: {json.dumps(p["main_image"])},')
        ts_lines.append(f'    images: {imgs_ts},')
        ts_lines.append("  },")

    ts_lines.append("];")
    ts_lines.append("")
    ts_lines.append("export default ALL_PRODUCTS;")

    with open(PRODUCTS_DATA_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(ts_lines))

    print(f"\n[DONE] Successfully wrote {len(products)} products with sanitized images to products-data.ts")

if __name__ == "__main__":
    main()
