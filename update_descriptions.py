import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

PROJECT_DIR = r"C:\Users\TOLGA HOCA\Desktop\armonidesign.com\armoni-next"
PRODUCTS_DATA_FILE = os.path.join(PROJECT_DIR, "lib", "products-data.ts")

# ─── 5-LANGUAGE DESCRIPTION TEMPLATES BY CATEGORY ───────────────────────────
# Each template uses {name} as a placeholder for the product name.

DESCRIPTIONS = {
    "berjer": {
        "tr": (
            "{name}, çağdaş tasarım anlayışını doğa ile buluşturan el yapımı bir şaheserdir. "
            "Yüksek yoğunluklu köpük ve doğal kumaş seçenekleriyle hem estetik hem de kusursuz konfor sunar. "
            "Özel ölçü ve kaplama alternatifleriyle evinizin ruhuna en uygun çözümü birlikteyaratırız."
        ),
        "en": (
            "{name} is a handcrafted masterpiece that harmonizes contemporary design with natural elements. "
            "Featuring high-density foam and premium fabric options, it offers both aesthetic beauty and unmatched comfort. "
            "Custom dimensions and upholstery alternatives are available to perfectly suit your living space."
        ),
        "de": (
            "{name} ist ein handgefertigtes Meisterwerk, das zeitgemäßes Design mit natürlichen Elementen verbindet. "
            "Mit hochdichtem Schaumstoff und hochwertigen Stoffoptionen bietet es sowohl Ästhetik als auch unübertroffenen Komfort. "
            "Maßanfertigungen und individuelle Bezugsstoffe sind auf Anfrage erhältlich."
        ),
        "ru": (
            "{name} — это шедевр ручной работы, сочетающий современный дизайн с природными элементами. "
            "Высокоплотный пенополиуретан и отборные ткани обеспечивают одновременно эстетику и непревзойдённый комфорт. "
            "Доступны индивидуальные размеры и варианты обивки для идеального соответствия вашему интерьеру."
        ),
        "ar": (
            "{name} تحفة فنية مصنوعة يدويًا تجمع بين التصميم المعاصر والعناصر الطبيعية. "
            "يتميز بإسفنج عالي الكثافة وخيارات قماش فاخرة، مما يوفر جمالًا جماليًا وراحة لا مثيل لها. "
            "تتوفر أبعاد مخصصة وبدائل تنجيد لتناسب مساحة معيشتك تمامًا."
        ),
    },
    "kanepe-kose-takimlari": {
        "tr": (
            "{name}, geniş oturma alanı ve dengeli oran anlayışıyla modern yaşam alanlarına değer katan bir tasarımdır. "
            "Çelik iskeleti ve premium kumaş döşemesiyle onlarca yıl kullanım ömrü vadeden kaliteyi temsil eder. "
            "Modüler yapısı sayesinde dilediğiniz konfigürasyonda özel üretim imkânı sunar."
        ),
        "en": (
            "{name} is a design that enhances modern living spaces with its generous seating area and balanced proportions. "
            "Its steel frame and premium fabric upholstery represent quality promising decades of use. "
            "Its modular structure allows custom production in any configuration you desire."
        ),
        "de": (
            "{name} ist ein Design, das moderne Wohnräume mit seiner großzügigen Sitzfläche und ausgewogenen Proportionen aufwertet. "
            "Sein Stahlrahmen und hochwertiger Stoffbezug stehen für Qualität, die Jahrzehnte hält. "
            "Die modulare Struktur ermöglicht individuelle Fertigung in jeder gewünschten Konfiguration."
        ),
        "ru": (
            "{name} — это дизайн, который обогащает современные жилые пространства благодаря просторной зоне сидения и сбалансированным пропорциям. "
            "Стальной каркас и обивка из высококачественных тканей олицетворяют качество, рассчитанное на десятилетия. "
            "Модульная конструкция позволяет изготовить изделие в любой желаемой конфигурации."
        ),
        "ar": (
            "{name} تصميم يُثري المساحات المعيشية الحديثة بمنطقة جلوس واسعة ونسب متوازنة. "
            "إطاره الفولاذي وتنجيده بالقماش الفاخر يُجسّدان جودة تَعِد بعقود من الاستخدام. "
            "يتيح هيكله المعياري الإنتاج المخصص بأي تهيئة مطلوبة."
        ),
    },
    "sandalye-benchler": {
        "tr": (
            "{name}, minimalist çizgileri ve şık formuyla her mekâna estetik bir soluk katan özgün bir tasarımdır. "
            "Sertifikalı ahşap ayakları ve yüksek mukavemetli kontrplak iskeletiyle uzun ömürlü sağlamlık sunar. "
            "Renk ve kaplama seçenekleri özelleştirilerek projenizin gereksinimlerine özel üretilir."
        ),
        "en": (
            "{name} is a distinctive design that brings an aesthetic breath to every space with its minimalist lines and elegant form. "
            "Certified wooden legs and a high-strength plywood frame ensure long-lasting durability. "
            "Color and upholstery options can be customized to meet your project's specific requirements."
        ),
        "de": (
            "{name} ist ein unverwechselbares Design, das mit seinen minimalistischen Linien und seiner eleganten Form jedem Raum einen ästhetischen Hauch verleiht. "
            "Zertifizierte Holzbeine und ein hochfestes Sperrholzgestell gewährleisten dauerhafte Haltbarkeit. "
            "Farb- und Bezugsoptionen können individuell angepasst werden, um den spezifischen Anforderungen Ihres Projekts gerecht zu werden."
        ),
        "ru": (
            "{name} — это самобытный дизайн, который привносит эстетическое дыхание в каждое пространство благодаря минималистичным линиям и элегантной форме. "
            "Сертифицированные деревянные ножки и высокопрочный фанерный каркас обеспечивают долговечность. "
            "Варианты цвета и обивки можно настроить в соответствии с требованиями вашего проекта."
        ),
        "ar": (
            "{name} تصميم مميز يُضفي نَفَسًا جماليًا على كل مكان بخطوطه البسيطة وشكله الأنيق. "
            "أرجل خشبية معتمدة وهيكل من الخشب الرقائقي عالي المقاومة تضمنان متانة طويلة الأمد. "
            "يمكن تخصيص خيارات الألوان والتنجيد لتلبية متطلبات مشروعك المحددة."
        ),
    },
    "yatak-odasi": {
        "tr": (
            "{name}, uyku konforunu sanatsal bir deneyime dönüştüren, gece zamanının kendine özgü ruhuyla tasarlanmış bir yatak odasıdır. "
            "Anatomik destek sağlayan özel baş paneli ve yüksek kalite döşeme kumaşlarıyla dinlendirici bir uyku sunar. "
            "Farklı boyut ve kaplama seçenekleriyle odanıza özel tasarlanabilir."
        ),
        "en": (
            "{name} is a bedroom piece designed with the unique spirit of the night, transforming sleep comfort into an artistic experience. "
            "Its specially designed headboard providing anatomical support and high-quality upholstery fabrics offer a restful sleep. "
            "It can be customized in different sizes and upholstery options to suit your room."
        ),
        "de": (
            "{name} ist ein Schlafzimmerstück, das mit dem einzigartigen Geist der Nacht entworfen wurde und den Schlafkomfort in ein künstlerisches Erlebnis verwandelt. "
            "Das speziell gestaltete Kopfteil mit anatomischer Unterstützung und hochwertige Bezugsstoffe sorgen für einen erholsamen Schlaf. "
            "Es kann in verschiedenen Größen und Bezugsoptionen individuell angepasst werden."
        ),
        "ru": (
            "{name} — это мебель для спальни, созданная в уникальном духе ночи, превращающая комфорт сна в художественный опыт. "
            "Специально разработанное изголовье, обеспечивающее анатомическую поддержку, и высококачественные ткани обивки обеспечивают спокойный сон. "
            "Возможна индивидуальная настройка по размеру и варианту обивки."
        ),
        "ar": (
            "{name} قطعة غرفة نوم مصممة بروح الليل الفريدة، تحوّل راحة النوم إلى تجربة فنية. "
            "لوحة رأس مصممة خصيصًا توفر دعمًا تشريحيًا، وأقمشة تنجيد عالية الجودة توفر نومًا مريحًا. "
            "يمكن تخصيصه بأحجام وخيارات تنجيد مختلفة لتناسب غرفتك."
        ),
    },
    "ayna-konsol": {
        "tr": (
            "{name}, mekânı optik olarak genişleten ve lüks bir atmosfer yaratan dekoratif bir tasarım objesidir. "
            "Altın ya da siyah pirinç çerçeve detayları ve el işçiliğiyle üretilen çerçevesiyle prestijli bir görünüm sunar. "
            "Giriş holleri, salonlar ve yatak odaları için özel boyutlarda sipariş edilebilir."
        ),
        "en": (
            "{name} is a decorative design object that visually expands the space and creates a luxurious atmosphere. "
            "Gold or black brass frame details and its handcrafted frame provide a prestigious appearance. "
            "It can be ordered in custom sizes for entryways, living rooms, and bedrooms."
        ),
        "de": (
            "{name} ist ein dekoratives Designobjekt, das den Raum optisch erweitert und eine luxuriöse Atmosphäre schafft. "
            "Gold- oder schwarze Messingrahmendetails und sein handgefertigter Rahmen verleihen ihm ein prestigeträchtiges Aussehen. "
            "Es kann in individuellen Größen für Eingangshallen, Wohnzimmer und Schlafzimmer bestellt werden."
        ),
        "ru": (
            "{name} — это декоративный дизайнерский объект, который визуально расширяет пространство и создаёт роскошную атмосферу. "
            "Детали из золотой или чёрной латуни и рама ручной работы придают ему престижный вид. "
            "Возможен заказ в нестандартных размерах для прихожих, гостиных и спален."
        ),
        "ar": (
            "{name} قطعة ديكور تُوسّع الفضاء بصريًا وتخلق أجواءً فاخرة. "
            "تفاصيل إطار من الذهب أو النحاس الأسود وإطار مصنوع يدويًا يُضفيان مظهرًا راقيًا. "
            "يمكن طلبه بمقاسات مخصصة للمداخل وغرف الجلوس وغرف النوم."
        ),
    },
    "bahce-mobilyalari": {
        "tr": (
            "{name}, açık hava yaşam alanlarını lüks bir dinlenme köşesine dönüştürmek için tasarlanmış dayanıklı bir mobilyadır. "
            "UV dayanımlı teak ahşap veya alüminyum iskelet ve su geçirmez kumaşlarla dört mevsim kullanım imkânı sunar. "
            "Teras, bahçe ve havuz başları için özel konfigürasyonlarda üretilir."
        ),
        "en": (
            "{name} is a durable piece of furniture designed to transform outdoor living spaces into a luxurious resting corner. "
            "UV-resistant teak wood or aluminum frame and waterproof fabrics allow year-round use. "
            "Custom configurations are available for terraces, gardens, and poolsides."
        ),
        "de": (
            "{name} ist ein langlebiges Möbelstück, das darauf ausgelegt ist, Außenbereiche in eine luxuriöse Ruheoase zu verwandeln. "
            "UV-beständiges Teakholz oder Aluminiumrahmen und wasserdichte Stoffe ermöglichen eine ganzjährige Nutzung. "
            "Individuelle Konfigurationen sind für Terrassen, Gärten und Poolbereiche erhältlich."
        ),
        "ru": (
            "{name} — это долговечный предмет мебели, предназначенный для превращения открытых жилых зон в роскошный уголок отдыха. "
            "Рама из устойчивого к ультрафиолету тика или алюминия и водостойкие ткани обеспечивают круглогодичное использование. "
            "Доступны индивидуальные конфигурации для террас, садов и зон у бассейна."
        ),
        "ar": (
            "{name} قطعة أثاث متينة مصممة لتحويل مساحات المعيشة الخارجية إلى ركن استراحة فاخر. "
            "إطار من خشب الساج أو الألومنيوم المقاوم للأشعة فوق البنفسجية وأقمشة مقاومة للماء تتيح الاستخدام طوال العام. "
            "تتوفر تهيئات مخصصة للتراسات والحدائق وحواف حمامات السباحة."
        ),
    },
    "genel": {
        "tr": (
            "{name}, ince işçiliği ve zamansız tasarımıyla yaşam alanlarına sofistike bir değer katan özgün bir mobilyadır. "
            "Titizlikle seçilmiş malzemeleri ve ergonomik yapısıyla uzun yıllar boyunca işlevselliğini koruyan bir yatırımdır. "
            "Özel ölçü ve kaplama seçenekleriyle mekânınıza özel olarak üretilir."
        ),
        "en": (
            "{name} is a distinctive piece of furniture that adds sophisticated value to living spaces with its fine craftsmanship and timeless design. "
            "Meticulously selected materials and ergonomic structure make it an investment that retains its functionality for many years. "
            "Custom dimensions and upholstery options allow production tailored specifically to your space."
        ),
        "de": (
            "{name} ist ein einzigartiges Möbelstück, das Wohnräumen mit seiner feinen Handwerkskunst und seinem zeitlosen Design einen anspruchsvollen Wert verleiht. "
            "Sorgfältig ausgewählte Materialien und eine ergonomische Struktur machen es zu einer Investition, die ihre Funktionalität über viele Jahre behält. "
            "Individuelle Maße und Bezugsoptionen ermöglichen eine auf Ihren Raum zugeschnittene Fertigung."
        ),
        "ru": (
            "{name} — это уникальный предмет мебели, добавляющий изысканную ценность жилым пространствам благодаря тонкому мастерству и вневременному дизайну. "
            "Тщательно подобранные материалы и эргономичная конструкция делают его инвестицией, сохраняющей функциональность на долгие годы. "
            "Индивидуальные размеры и варианты обивки позволяют создать изделие, идеально подходящее для вашего пространства."
        ),
        "ar": (
            "{name} قطعة أثاث مميزة تُضفي قيمة راقية على مساحات المعيشة بحرفيتها الدقيقة وتصميمها الخالد. "
            "المواد المختارة بعناية والهيكل المريح يجعلانها استثمارًا يحتفظ بوظائفه لسنوات طويلة. "
            "تتاح أبعاد وخيارات تنجيد مخصصة لإنتاج ما يناسب مساحتك تمامًا."
        ),
    },
}

def get_description(cat_slug, name):
    tpl = DESCRIPTIONS.get(cat_slug, DESCRIPTIONS["genel"])
    return {lang: tpl[lang].replace("{name}", name) for lang in tpl}

# ─── READ products-data.ts ───────────────────────────────────────────────────
with open(PRODUCTS_DATA_FILE, "r", encoding="utf-8") as f:
    ts_content = f.read()

# We'll re-generate only the descriptions field inside each product block
# Pattern: description: { tr: "...", en: "...", de: "...", ru: "...", ar: "..." },
# We find each product block by extracting slug, categorySlug and name first,
# then replace its description field.

# Extract all product entries via regex
product_pattern = re.compile(
    r'(\{[^}]*?slug:\s*"([^"]+)"[^}]*?categorySlug:\s*"([^"]+)"[^}]*?name:\s*\{[^}]*?tr:\s*"([^"]+)"[^}]*?\}[^}]*?)description:\s*\{[^}]+?\}',
    re.DOTALL
)

def replacement(m):
    before = m.group(1)
    slug = m.group(2)
    cat_slug = m.group(3)
    name_tr = m.group(4)
    desc = get_description(cat_slug, name_tr)
    desc_str = (
        f'description: {{ '
        f'tr: {json.dumps(desc["tr"], ensure_ascii=False)}, '
        f'en: {json.dumps(desc["en"], ensure_ascii=False)}, '
        f'de: {json.dumps(desc["de"], ensure_ascii=False)}, '
        f'ru: {json.dumps(desc["ru"], ensure_ascii=False)}, '
        f'ar: {json.dumps(desc["ar"], ensure_ascii=False)} }}'
    )
    return before + desc_str

new_content = product_pattern.sub(replacement, ts_content)

with open(PRODUCTS_DATA_FILE, "w", encoding="utf-8") as f:
    f.write(new_content)

# Count how many were replaced
count = len(product_pattern.findall(ts_content))
print(f"[DONE] {count} products updated with 5-language descriptions.")
