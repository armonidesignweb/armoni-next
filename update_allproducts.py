import json
import os

locales = {
    'tr': 'Tüm Ürünler',
    'en': 'All Products',
    'de': 'Alle Produkte',
    'ar': 'جميع المنتجات'
}

for loc, text in locales.items():
    filepath = f"messages/{loc}.json"
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        if 'products' not in content:
            content['products'] = {}
        content['products']['allProducts'] = text
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

print("Translations updated successfully.")

# Fix lib/products-data.ts
data_path = 'lib/products-data.ts'
if os.path.exists(data_path):
    with open(data_path, 'r', encoding='utf-8') as f:
        data_content = f.read()
    
    # Replace the hardcoded translations in the file
    data_content = data_content.replace('en: "Tüm Ürünler"', 'en: "All Products"')
    data_content = data_content.replace('de: "Tüm Ürünler"', 'de: "Alle Produkte"')
    data_content = data_content.replace('ar: "Tüm Ürünler"', 'ar: "جميع المنتجات"')
    data_content = data_content.replace('ru: "Tüm Ürünler"', 'ru: "All Products"')
    
    with open(data_path, 'w', encoding='utf-8') as f:
        f.write(data_content)
    
    print("Fixed lib/products-data.ts")
