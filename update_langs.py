import json
import os

langs = {
    'tr': {
        'bestseller': 'En Çok Satan',
        'customOrderText': 'Özel ölçü ve kumaş seçenekleri için bizimle iletişime geçebilirsiniz.',
        'whatsappInfo': 'WhatsApp\'tan Bilgi Al',
        'viewDetails': 'Detayları İncele'
    },
    'en': {
        'bestseller': 'Bestseller',
        'customOrderText': 'You can contact us for custom dimensions and fabric options.',
        'whatsappInfo': 'Get Info via WhatsApp',
        'viewDetails': 'View Details'
    },
    'de': {
        'bestseller': 'Bestseller',
        'customOrderText': 'Für Sondermaße und Stoffoptionen können Sie uns kontaktieren.',
        'whatsappInfo': 'Info über WhatsApp erhalten',
        'viewDetails': 'Details ansehen'
    },
    'ru': {
        'bestseller': 'Хит продаж',
        'customOrderText': 'Вы можете связаться с нами для нестандартных размеров и вариантов ткани.',
        'whatsappInfo': 'Получить информацию через WhatsApp',
        'viewDetails': 'Подробнее'
    },
    'ar': {
        'bestseller': 'الأكثر مبيعاً',
        'customOrderText': 'يمكنك التواصل معنا لمعرفة خيارات المقاسات والأقمشة الخاصة.',
        'whatsappInfo': 'احصل على معلومات عبر الواتساب',
        'viewDetails': 'عرض التفاصيل'
    }
}

for lang, data in langs.items():
    path = f"c:/Users/TOLGA HOCA/Desktop/armonidesign.com/armoni-next/messages/{lang}.json"
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8-sig') as f:
        j = json.load(f)
    
    if 'products' not in j:
        j['products'] = {}
    
    j['products']['bestseller'] = data['bestseller']
    j['products']['customOrderText'] = data['customOrderText']
    j['products']['whatsappInfo'] = data['whatsappInfo']
    j['products']['viewDetails'] = data['viewDetails']
    
    if 'featured' not in j:
        j['featured'] = {}
    j['featured']['bestseller'] = data['bestseller']
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(j, f, ensure_ascii=False, indent=2)
