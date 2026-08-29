import os

mojibake_chars = ['Ø', 'Ù', 'Ã', 'Â', '§', 'Å']
ignore_dirs = {'.next', 'node_modules', '.git'}

found_files = []

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ignore_dirs]
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json', '.js', '.jsx', '.md', '.css')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for char in mojibake_chars:
                        if char in content:
                            found_files.append((path, char))
                            break
            except Exception as e:
                pass

if found_files:
    print("Found mojibake in:")
    for path, char in found_files:
        print(f"  {path} (contains '{char}')")
else:
    print("No mojibake found in the entire repository!")
