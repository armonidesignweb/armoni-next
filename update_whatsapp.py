import json
import os

locales = {
    'tr': 'Merhaba, {product} ürünü hakkında bilgi ve fiyat almak istiyorum.',
    'en': 'Hello, I would like to get information and pricing for the {product} product.',
    'de': 'Hallo, ich hätte gerne Informationen und Preise für das Produkt {product}.',
    'ar': 'مرحباً، أود الحصول على معلومات وأسعار لمنتج {product}.'
}

for loc, text in locales.items():
    filepath = f"messages/{loc}.json"
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        if 'products' not in content:
            content['products'] = {}
        content['products']['whatsappMessage'] = text
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

print("Translations updated successfully.")
