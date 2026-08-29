import json
import os

locales = {
    'tr': {
        'references': {
            'label': 'Güven & Başarı',
            'title': 'Referanslarımız',
            'subtitle': 'Dünyanın dört bir yanındaki seçkin iş ortaklarımızla birlikte hayata geçirdiğimiz projeler.',
            'prestigious': 'Prestijli Marka & İş Ortağı'
        },
        'projects_label': 'Portföy'
    },
    'en': {
        'references': {
            'label': 'Trust & Success',
            'title': 'Our References',
            'subtitle': 'Projects we have brought to life with our distinguished business partners around the world.',
            'prestigious': 'Prestigious Brand & Partner'
        },
        'projects_label': 'Portfolio'
    },
    'de': {
        'references': {
            'label': 'Vertrauen & Erfolg',
            'title': 'Unsere Referenzen',
            'subtitle': 'Projekte, die wir mit unseren angesehenen Geschäftspartnern auf der ganzen Welt realisiert haben.',
            'prestigious': 'Renommierte Marke & Partner'
        },
        'projects_label': 'Portfolio'
    },
    'ar': {
        'references': {
            'label': 'الثقة والنجاح',
            'title': 'مراجعنا',
            'subtitle': 'المشاريع التي حققناها مع شركائنا المتميزين في جميع أنحاء العالم.',
            'prestigious': 'علامة تجارية وشريك متميز'
        },
        'projects_label': 'محفظة المشاريع'
    }
}

for loc, data in locales.items():
    filepath = f"messages/{loc}.json"
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        content['references'] = data['references']
        
        if 'projects' not in content:
            content['projects'] = {}
        content['projects']['label'] = data['projects_label']
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

print("Translations updated successfully.")
