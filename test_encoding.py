import json

text = "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©"
try:
    print(text.encode('cp1252').decode('utf-8'))
except Exception as e:
    print("cp1252 failed:", e)

try:
    print(text.encode('latin1').decode('utf-8'))
except Exception as e:
    print("latin1 failed:", e)

