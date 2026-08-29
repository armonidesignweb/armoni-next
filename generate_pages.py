import os

admin_pages = ['categories', 'projects', 'references', 'content', 'customers', 'announcements', 'campaigns', 'support', 'settings']
customer_pages = ['campaigns', 'announcements', 'support', 'profile']

admin_template = """export default function AdminPage() {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
      <h1 className="text-2xl font-bold font-serif text-white mb-4">TITLE</h1>
      <p className="text-neutral-400">Bu modül CMS mimarisine hazırlandı ve yakında aktif edilecektir.</p>
    </div>
  );
}
"""

customer_template = """export default function CustomerPage() {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
      <h1 className="text-2xl font-bold font-serif text-white mb-4">TITLE</h1>
      <p className="text-neutral-400">Size özel içerikler yakında bu alanda listelenecektir.</p>
    </div>
  );
}
"""

def create_page(path, template, title):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        with open(path, 'w', encoding='utf-8') as f:
            f.write(template.replace("TITLE", title.capitalize()))

base_dir = r"c:\Users\TOLGA HOCA\Desktop\armonidesign.com\armoni-next\app\[locale]"

for p in admin_pages:
    create_page(os.path.join(base_dir, "admin", p, "page.tsx"), admin_template, p)

for p in customer_pages:
    create_page(os.path.join(base_dir, "account", p, "page.tsx"), customer_template, p)

print("Pages created.")
