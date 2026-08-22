import json, os

langs = {
    'tr': 'Detaylı bilgi için bizimle iletişime geçebilirsiniz.',
    'en': 'Please contact us for detailed information.',
    'de': 'Bitte kontaktieren Sie uns für detaillierte Informationen.',
    'ru': 'Пожалуйста, свяжитесь с нами для получения подробной информации.',
    'ar': 'يرجى التواصل معنا للحصول على معلومات تفصيلية.'
}

base = r'C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armoni-next\messages'

for lang, text in langs.items():
    path = os.path.join(base, f'{lang}.json')
    with open(path, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    if 'products' not in data:
        data['products'] = {}
    data['products']['contactForDetails'] = text
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print('Done')
