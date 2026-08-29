import json
import codecs

with open('messages/ar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def fix_string(s):
    if not isinstance(s, str):
        return s
    
    # Check if string contains already valid arabic
    # Arabic range: \u0600-\u06FF
    has_arabic = any('\u0600' <= c <= '\u06FF' for c in s)
    if has_arabic:
        return s

    try:
        # Try cp1252 first
        return s.encode('cp1252').decode('utf-8')
    except Exception:
        try:
            return s.encode('latin1').decode('utf-8')
        except Exception:
            return s

def fix_dict(d):
    for k, v in d.items():
        if isinstance(v, dict):
            fix_dict(v)
        elif isinstance(v, str):
            new_v = fix_string(v)
            if new_v != v:
                d[k] = new_v
    return d

data = fix_dict(data)

with open('messages/ar.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Arabic encoding fixed.")
