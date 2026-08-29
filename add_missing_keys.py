import json
import os

# Add new keys to all locale files
new_keys = {
    'tr': {
        'contact': {
            'label': 'İletişim & Teklif',
            'namePlaceholder': 'Adınız Soyadınız',
            'emailPlaceholder': 'ornek@domain.com',
            'messagePlaceholder': 'İlgilendiğiniz mobilya veya özel tasarım talebiniz hakkında bilgi verin...'
        },
        'products': {
            'showingRange': '{total} üründen {start}–{end} gösteriliyor',
            'design': 'Tasarım'
        },
        'homepage': {
            'collectionLabel': 'Armoni Collection',
            'featuredLabel': 'Özel Seçki',
            'discover': 'Keşfet',
            'customProduction': 'Özel Üretim',
            'customProductionDesc': 'Kişiselleştirilebilir Mobilya'
        },
        'references': {
            'metaTitle': 'Referanslar | Armoni Design',
            'metaDesc': 'Armoni Design referansları — dünyanın dört bir yanındaki seçkin iş ortaklarımızla hayata geçirilen projeler.'
        }
    },
    'en': {
        'contact': {
            'label': 'Contact & Quote',
            'namePlaceholder': 'Your Full Name',
            'emailPlaceholder': 'example@domain.com',
            'messagePlaceholder': 'Tell us about the furniture or custom design you are interested in...'
        },
        'products': {
            'showingRange': 'Showing {start}–{end} of {total} products',
            'design': 'Design'
        },
        'homepage': {
            'collectionLabel': 'Armoni Collection',
            'featuredLabel': 'Special Selection',
            'discover': 'Discover',
            'customProduction': 'Custom Production',
            'customProductionDesc': 'Customizable Furniture'
        },
        'references': {
            'metaTitle': 'References | Armoni Design',
            'metaDesc': 'Armoni Design references — projects realized with our distinguished partners around the world.'
        }
    },
    'de': {
        'contact': {
            'label': 'Kontakt & Angebot',
            'namePlaceholder': 'Ihr vollständiger Name',
            'emailPlaceholder': 'beispiel@domain.com',
            'messagePlaceholder': 'Erzählen Sie uns von den Möbeln oder dem individuellen Design, das Sie interessiert...'
        },
        'products': {
            'showingRange': '{start}–{end} von {total} Produkten werden angezeigt',
            'design': 'Design'
        },
        'homepage': {
            'collectionLabel': 'Armoni Collection',
            'featuredLabel': 'Besondere Auswahl',
            'discover': 'Entdecken',
            'customProduction': 'Sonderanfertigung',
            'customProductionDesc': 'Personalisierbare Möbel'
        },
        'references': {
            'metaTitle': 'Referenzen | Armoni Design',
            'metaDesc': 'Armoni Design Referenzen — Projekte, die mit unseren angesehenen Partnern weltweit realisiert wurden.'
        }
    },
    'ar': {
        'contact': {
            'label': 'التواصل والعروض',
            'namePlaceholder': 'الاسم الكامل',
            'emailPlaceholder': 'example@domain.com',
            'messagePlaceholder': 'أخبرنا عن الأثاث أو التصميم المخصص الذي تهتم به...'
        },
        'products': {
            'showingRange': 'عرض {start}–{end} من {total} منتج',
            'design': 'تصميم'
        },
        'homepage': {
            'collectionLabel': 'Armoni Collection',
            'featuredLabel': 'اختيارات خاصة',
            'discover': 'اكتشف',
            'customProduction': 'إنتاج مخصص',
            'customProductionDesc': 'أثاث قابل للتخصيص'
        },
        'references': {
            'metaTitle': 'المراجع | أرموني ديزاين',
            'metaDesc': 'مراجع أرموني ديزاين — المشاريع التي حققناها مع شركائنا المتميزين حول العالم.'
        }
    }
}

for loc, groups in new_keys.items():
    filepath = f"messages/{loc}.json"
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        for namespace, keys in groups.items():
            if namespace not in content:
                content[namespace] = {}
            for key, value in keys.items():
                content[namespace][key] = value
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

print("All new translation keys added successfully.")
