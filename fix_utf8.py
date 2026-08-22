import os

replacements = {
    "Ãœ": "Ü",
    "Ã¼": "ü",
    "Ä±": "ı",
    "ÅŸ": "ş",
    "Ã§": "ç",
    "Ã¶": "ö",
    "ÄŸ": "ğ",
    "Ä°": "İ",
    "Ã‡": "Ç",
    "Ã–": "Ö",
    "Åž": "Ş",
    "Äž": "Ğ"
}

files = [
    "messages/tr.json",
    "messages/en.json",
    "messages/de.json",
    "messages/ru.json",
    "messages/ar.json",
    "lib/data.ts"
]

base_dir = "c:/Users/TOLGA HOCA/Desktop/armonidesign.com/armoni-next"

for file in files:
    path = os.path.join(base_dir, file)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done")
