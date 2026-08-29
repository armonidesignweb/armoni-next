import shutil
import os

admin_dir = r"c:\Users\TOLGA HOCA\Desktop\armonidesign.com\armoni-next\app\[locale]\admin"
protected_dir = os.path.join(admin_dir, "(protected)")
os.makedirs(protected_dir, exist_ok=True)

# Move layout.tsx, page.tsx, LogoutButton.tsx to (protected)/
for f in ["layout.tsx", "page.tsx", "LogoutButton.tsx"]:
    src = os.path.join(admin_dir, f)
    dst = os.path.join(protected_dir, f)
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.move(src, dst)
        print(f"Moved {f} -> (protected)/{f}")
    elif os.path.exists(src) and os.path.exists(dst):
        os.remove(src)
        print(f"Removed duplicate {f} from admin/")

# Move subdirectories to (protected)/
for d in ["products", "categories", "projects", "references", "content", "customers", "announcements", "campaigns", "support", "settings"]:
    src = os.path.join(admin_dir, d)
    dst = os.path.join(protected_dir, d)
    if os.path.isdir(src) and not os.path.isdir(dst):
        shutil.move(src, dst)
        print(f"Moved {d}/ -> (protected)/{d}/")
    elif os.path.isdir(src) and os.path.isdir(dst):
        shutil.rmtree(src)
        print(f"Removed duplicate {d}/ from admin/")

print("\nFinal admin/ contents:")
for item in os.listdir(admin_dir):
    print(f"  {item}")
