import re
import os

html_path = r"C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armonidesign-eskihali\www.armonidesign.com\urun\4196\index.html"
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

m = re.search(r'<meta property="og:image" content="([^"]+)"', html, re.IGNORECASE)
if m:
    print('og:image:', m.group(1))

for attr in ['data-large_image', 'data-src']:
    for url in re.findall(rf'{attr}="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"', html, re.IGNORECASE):
        print(attr, ':', url)
