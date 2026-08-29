import json
import os

translations = {
    'tr': {
        'hero': {
            'slides': {
                '1': {
                    'title': 'Bellagia Outdoor Takımı',
                    'subtitle': 'Modern İtalyan çizgisi, üst düzey konfor'
                },
                '2': {
                    'title': 'Crown Sandalye',
                    'subtitle': 'Ergonomi ve zarif detayların mükemmel uyumu'
                },
                '3': {
                    'title': 'Fjord Berjer',
                    'subtitle': 'Dokusal zenginlik ve zamansız estetik'
                },
                '4': {
                    'title': 'Nacre Köşe Kanepe',
                    'subtitle': 'Zanaatkarlık ve şıklığın simgesi'
                }
            }
        },
        'testimonials': {
            'badge': 'Müşteri Yorumları',
            'title': 'Müşterilerimiz Ne Diyor?',
            'googleReviews': '5.0 · Google Yorumları',
            'prev': 'Önceki',
            'next': 'Sonraki',
            'prevReviews': 'Önceki Yorumlar',
            'nextReviews': 'Sonraki Yorumlar'
        }
    },
    'en': {
        'hero': {
            'slides': {
                '1': {
                    'title': 'Bellagia Outdoor Set',
                    'subtitle': 'Modern Italian lines, top-level comfort'
                },
                '2': {
                    'title': 'Crown Chair',
                    'subtitle': 'Perfect harmony of ergonomics and elegant details'
                },
                '3': {
                    'title': 'Fjord Armchair',
                    'subtitle': 'Textural richness and timeless aesthetics'
                },
                '4': {
                    'title': 'Nacre Corner Sofa',
                    'subtitle': 'The symbol of craftsmanship and elegance'
                }
            }
        },
        'testimonials': {
            'badge': 'Customer Reviews',
            'title': 'What Our Customers Say?',
            'googleReviews': '5.0 · Google Reviews',
            'prev': 'Previous',
            'next': 'Next',
            'prevReviews': 'Previous Reviews',
            'nextReviews': 'Next Reviews'
        }
    },
    'de': {
        'hero': {
            'slides': {
                '1': {
                    'title': 'Bellagia Outdoor-Set',
                    'subtitle': 'Moderne italienische Linien, höchster Komfort'
                },
                '2': {
                    'title': 'Crown Stuhl',
                    'subtitle': 'Perfekte Harmonie von Ergonomie und eleganten Details'
                },
                '3': {
                    'title': 'Fjord Sessel',
                    'subtitle': 'Struktureller Reichtum und zeitlose Ästhetik'
                },
                '4': {
                    'title': 'Nacre Ecksofa',
                    'subtitle': 'Das Symbol für Handwerkskunst und Eleganz'
                }
            }
        },
        'testimonials': {
            'badge': 'Kundenbewertungen',
            'title': 'Was unsere Kunden sagen?',
            'googleReviews': '5.0 · Google Bewertungen',
            'prev': 'Vorherige',
            'next': 'Nächste',
            'prevReviews': 'Vorherige Bewertungen',
            'nextReviews': 'Nächste Bewertungen'
        }
    },
    'ar': {
        'hero': {
            'slides': {
                '1': {
                    'title': 'طقم بيلاجيا الخارجي',
                    'subtitle': 'خطوط إيطالية حديثة، راحة على أعلى مستوى'
                },
                '2': {
                    'title': 'كرسي كراون',
                    'subtitle': 'تناغم مثالي بين بيئة العمل والتفاصيل الأنيقة'
                },
                '3': {
                    'title': 'كرسي فيورد',
                    'subtitle': 'ثراء في الملمس وجماليات خالدة'
                },
                '4': {
                    'title': 'أريكة زاوية ناكري',
                    'subtitle': 'رمز الحرفية والأناقة'
                }
            }
        },
        'testimonials': {
            'badge': 'تقييمات العملاء',
            'title': 'ماذا يقول عملاؤنا؟',
            'googleReviews': '5.0 · تقييمات جوجل',
            'prev': 'السابق',
            'next': 'التالي',
            'prevReviews': 'التقييمات السابقة',
            'nextReviews': 'التقييمات التالية'
        }
    }
}

for loc, data in translations.items():
    filepath = f"messages/{loc}.json"
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        if 'hero' not in content:
            content['hero'] = {}
        content['hero']['slides'] = data['hero']['slides']
        
        content['testimonials'] = data['testimonials']
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

print("Translations for hero slides and testimonials added successfully.")
