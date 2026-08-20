'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: ModalType;
  onClose: () => void;
  locale: string;
}

const PRIVACY_CONTENT = {
  tr: {
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son Güncelleme: Ağustos 2025',
    sections: [
      {
        heading: '1. Toplanan Bilgiler',
        text: 'Armoni Design olarak web sitemizi ziyaret ettiğinizde veya bizimle iletişime geçtiğinizde ad, soyad, e-posta adresi, telefon numarası ve mesaj içeriği gibi kişisel bilgilerinizi toplayabiliriz. Bu bilgiler yalnızca sizinle iletişim kurmak ve hizmetlerimizi sunmak amacıyla kullanılır.',
      },
      {
        heading: '2. Bilgilerin Kullanımı',
        text: 'Topladığımız kişisel bilgileri; taleplerinize yanıt vermek, fiyat teklifi sunmak, sipariş süreçlerini yönetmek ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanırız. Bilgileriniz hiçbir koşulda üçüncü taraflarla pazarlama amacıyla paylaşılmaz.',
      },
      {
        heading: '3. Çerezler (Cookies)',
        text: 'Web sitemiz, kullanıcı deneyimini geliştirmek amacıyla çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda bazı özellikler doğru çalışmayabilir.',
      },
      {
        heading: '4. Veri Güvenliği',
        text: 'Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri uygulamaktayız. SSL şifreleme ve güvenli sunucu altyapısı kullanılmaktadır.',
      },
      {
        heading: '5. Haklarınız',
        text: 'KVKK kapsamında kişisel verilerinize erişme, düzeltme, silme ve itiraz etme haklarına sahipsiniz. Talepleriniz için iletisim@armonidesign.com adresine yazabilirsiniz.',
      },
      {
        heading: '6. İletişim',
        text: 'Gizlilik politikamız hakkında sorularınız için: Kağıthane Cd. No:123, Çağlayan, 34403 Kağıthane/İstanbul | T: 0 212 296 13 56 | E: iletisim@armonidesign.com',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: August 2025',
    sections: [
      { heading: '1. Information We Collect', text: 'As Armoni Design, we may collect personal information such as your name, email address, phone number, and message content when you visit our website or contact us. This information is used solely to communicate with you and provide our services.' },
      { heading: '2. Use of Information', text: 'We use the personal information we collect to respond to your inquiries, provide price quotes, manage order processes, and fulfill our legal obligations. Your information will never be shared with third parties for marketing purposes.' },
      { heading: '3. Cookies', text: 'Our website uses cookies to improve user experience. You can disable cookies in your browser settings, though some features may not function properly as a result.' },
      { heading: '4. Data Security', text: 'We implement industry-standard security measures to protect your personal data, including SSL encryption and secure server infrastructure.' },
      { heading: '5. Your Rights', text: 'You have the right to access, correct, delete, and object to your personal data. For requests, please write to iletisim@armonidesign.com.' },
      { heading: '6. Contact', text: 'For questions about our privacy policy: Kağıthane Cd. No:123, Çağlayan, 34403 Kağıthane/Istanbul | T: +90 212 296 13 56 | E: iletisim@armonidesign.com' },
    ],
  },
  de: {
    title: 'Datenschutzrichtlinie',
    lastUpdated: 'Zuletzt aktualisiert: August 2025',
    sections: [
      { heading: '1. Gesammelte Informationen', text: 'Als Armoni Design können wir personenbezogene Daten wie Ihren Namen, Ihre E-Mail-Adresse, Telefonnummer und Nachrichteninhalt erfassen, wenn Sie unsere Website besuchen oder uns kontaktieren.' },
      { heading: '2. Verwendung der Informationen', text: 'Wir verwenden die gesammelten Daten, um auf Ihre Anfragen zu antworten, Angebote zu erstellen, Bestellprozesse zu verwalten und unsere gesetzlichen Pflichten zu erfüllen.' },
      { heading: '3. Cookies', text: 'Unsere Website verwendet Cookies zur Verbesserung der Benutzererfahrung. Sie können Cookies in Ihren Browsereinstellungen deaktivieren.' },
      { heading: '4. Datensicherheit', text: 'Wir implementieren branchenübliche Sicherheitsmaßnahmen zum Schutz Ihrer persönlichen Daten, einschließlich SSL-Verschlüsselung.' },
      { heading: '5. Ihre Rechte', text: 'Sie haben das Recht auf Zugang, Berichtigung, Löschung und Widerspruch Ihrer personenbezogenen Daten. Schreiben Sie an iletisim@armonidesign.com.' },
      { heading: '6. Kontakt', text: 'Für Fragen: Kağıthane Cd. No:123, Çağlayan, 34403 Kağıthane/Istanbul | T: +90 212 296 13 56 | E: iletisim@armonidesign.com' },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    lastUpdated: 'Последнее обновление: август 2025',
    sections: [
      { heading: '1. Собираемая информация', text: 'Как Armoni Design, мы можем собирать личные данные, такие как ваше имя, адрес электронной почты, номер телефона и содержание сообщений при посещении нашего сайта.' },
      { heading: '2. Использование информации', text: 'Мы используем собранные данные для ответа на ваши запросы, предоставления коммерческих предложений и управления заказами.' },
      { heading: '3. Файлы Cookie', text: 'Наш сайт использует файлы cookie для улучшения пользовательского опыта. Вы можете отключить их в настройках браузера.' },
      { heading: '4. Безопасность данных', text: 'Мы применяем стандартные меры безопасности для защиты ваших личных данных, включая SSL-шифрование.' },
      { heading: '5. Ваши права', text: 'Вы имеете право на доступ, исправление и удаление ваших персональных данных. Пишите на iletisim@armonidesign.com.' },
      { heading: '6. Контакты', text: 'Kağıthane Cd. No:123, Çağlayan, 34403 Kağıthane/Istanbul | T: +90 212 296 13 56 | E: iletisim@armonidesign.com' },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: أغسطس 2025',
    sections: [
      { heading: '١. المعلومات التي نجمعها', text: 'بصفتنا Armoni Design، قد نجمع معلومات شخصية مثل اسمك وعنوان بريدك الإلكتروني ورقم هاتفك عند زيارة موقعنا أو التواصل معنا.' },
      { heading: '٢. استخدام المعلومات', text: 'نستخدم المعلومات المجمعة للرد على استفساراتك وتقديم عروض الأسعار وإدارة طلباتك.' },
      { heading: '٣. ملفات تعريف الارتباط', text: 'يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم. يمكنك تعطيلها من إعدادات متصفحك.' },
      { heading: '٤. أمان البيانات', text: 'نطبق تدابير أمنية قياسية لحماية بياناتك الشخصية بما في ذلك تشفير SSL.' },
      { heading: '٥. حقوقك', text: 'لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. اكتب إلى iletisim@armonidesign.com.' },
      { heading: '٦. التواصل', text: 'Kağıthane Cd. No:123, Çağlayan, 34403 Kağıthane/Istanbul | T: +90 212 296 13 56 | E: iletisim@armonidesign.com' },
    ],
  },
};

const TERMS_CONTENT = {
  tr: {
    title: 'Kullanım Şartları',
    lastUpdated: 'Son Güncelleme: Ağustos 2025',
    sections: [
      { heading: '1. Genel Koşullar', text: 'Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Armoni Design, bu koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar.' },
      { heading: '2. Hizmetlerin Kullanımı', text: 'Web sitemiz yalnızca yasal amaçlarla kullanılabilir. Siteyi kötüye kullanmak, yasadışı içerik paylaşmak veya sistemlere zarar vermek kesinlikle yasaktır.' },
      { heading: '3. Fikri Mülkiyet', text: 'Web sitemizdeki tüm içerikler (metinler, görseller, logolar, tasarımlar) Armoni Design\'a aittir ve telif hakkı yasalarıyla korunmaktadır. İzinsiz kullanım yasaktır.' },
      { heading: '4. Ürün ve Fiyat Bilgileri', text: 'Web sitemizde yer alan ürün görselleri ve bilgileri referans amaçlıdır. Renk ve doku farklılıkları oluşabilir. Fiyatlar önceden haber vermeksizin değiştirilebilir.' },
      { heading: '5. Sorumluluk Sınırlaması', text: 'Armoni Design, web sitesindeki teknik hatalar, kesintiler veya üçüncü taraf bağlantılardan kaynaklanan zararlardan sorumlu tutulamaz.' },
      { heading: '6. Uygulanacak Hukuk', text: 'Bu kullanım koşulları Türk Hukuku\'na tabidir. Tüm anlaşmazlıklarda İstanbul Mahkemeleri yetkilidir.' },
    ],
  },
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: August 2025',
    sections: [
      { heading: '1. General Terms', text: 'By using this website, you agree to the following terms and conditions. Armoni Design reserves the right to modify these terms without prior notice.' },
      { heading: '2. Use of Services', text: 'Our website may only be used for lawful purposes. Misuse, sharing illegal content, or damaging systems is strictly prohibited.' },
      { heading: '3. Intellectual Property', text: 'All content on our website (texts, images, logos, designs) belongs to Armoni Design and is protected by copyright laws. Unauthorized use is prohibited.' },
      { heading: '4. Product Information', text: 'Product images and information on our website are for reference purposes. Color and texture variations may occur. Prices are subject to change without notice.' },
      { heading: '5. Limitation of Liability', text: 'Armoni Design cannot be held liable for technical errors, interruptions, or damages arising from third-party links on this website.' },
      { heading: '6. Governing Law', text: 'These terms of service are governed by Turkish Law. Istanbul Courts have jurisdiction over all disputes.' },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    lastUpdated: 'Zuletzt aktualisiert: August 2025',
    sections: [
      { heading: '1. Allgemeine Bedingungen', text: 'Durch die Nutzung dieser Website stimmen Sie den folgenden Nutzungsbedingungen zu. Armoni Design behält sich vor, diese Bedingungen ohne vorherige Ankündigung zu ändern.' },
      { heading: '2. Nutzung der Dienste', text: 'Unsere Website darf nur für rechtmäßige Zwecke genutzt werden. Missbrauch, das Teilen illegaler Inhalte oder das Beschädigen von Systemen ist streng verboten.' },
      { heading: '3. Geistiges Eigentum', text: 'Alle Inhalte auf unserer Website (Texte, Bilder, Logos, Designs) gehören Armoni Design und sind urheberrechtlich geschützt.' },
      { heading: '4. Produktinformationen', text: 'Produktbilder und -informationen auf unserer Website dienen nur als Referenz. Farb- und Texturabweichungen können auftreten.' },
      { heading: '5. Haftungsbeschränkung', text: 'Armoni Design haftet nicht für technische Fehler, Unterbrechungen oder Schäden, die durch Drittanbieter-Links entstehen.' },
      { heading: '6. Anwendbares Recht', text: 'Diese Nutzungsbedingungen unterliegen türkischem Recht. Für alle Streitigkeiten sind die Gerichte in Istanbul zuständig.' },
    ],
  },
  ru: {
    title: 'Условия использования',
    lastUpdated: 'Последнее обновление: август 2025',
    sections: [
      { heading: '1. Общие условия', text: 'Используя этот сайт, вы соглашаетесь со следующими условиями использования. Armoni Design оставляет за собой право изменять эти условия без предварительного уведомления.' },
      { heading: '2. Использование услуг', text: 'Наш сайт может использоваться только в законных целях. Злоупотребление, распространение незаконного контента или нанесение ущерба системам строго запрещено.' },
      { heading: '3. Интеллектуальная собственность', text: 'Весь контент на нашем сайте принадлежит Armoni Design и защищен законами об авторском праве.' },
      { heading: '4. Информация о продуктах', text: 'Изображения и информация о продуктах на нашем сайте предназначены только для справки. Цвет и текстура могут отличаться.' },
      { heading: '5. Ограничение ответственности', text: 'Armoni Design не несет ответственности за технические ошибки или ущерб, возникший по вине сторонних ссылок.' },
      { heading: '6. Применимое право', text: 'Настоящие условия регулируются законодательством Турции. Все споры рассматриваются судами Стамбула.' },
    ],
  },
  ar: {
    title: 'شروط الاستخدام',
    lastUpdated: 'آخر تحديث: أغسطس 2025',
    sections: [
      { heading: '١. الشروط العامة', text: 'باستخدام هذا الموقع، فإنك توافق على شروط وأحكام الاستخدام التالية. تحتفظ Armoni Design بالحق في تعديل هذه الشروط دون إشعار مسبق.' },
      { heading: '٢. استخدام الخدمات', text: 'لا يجوز استخدام موقعنا إلا للأغراض المشروعة. يُحظر إساءة الاستخدام أو مشاركة المحتوى غير القانوني.' },
      { heading: '٣. الملكية الفكرية', text: 'جميع المحتويات على موقعنا تعود لـ Armoni Design وهي محمية بموجب قوانين حقوق الطبع والنشر.' },
      { heading: '٤. معلومات المنتج', text: 'صور المنتجات والمعلومات الواردة في موقعنا للأغراض المرجعية فقط. قد تختلف الألوان والملمس.' },
      { heading: '٥. تحديد المسؤولية', text: 'لا تتحمل Armoni Design المسؤولية عن الأخطاء التقنية أو الأضرار الناجمة عن روابط الطرف الثالث.' },
      { heading: '٦. القانون الحاكم', text: 'تخضع هذه الشروط للقانون التركي. تختص محاكم إسطنبول بالنظر في جميع النزاعات.' },
    ],
  },
};

export default function LegalModal({ type, onClose, locale }: LegalModalProps) {
  const lang = (locale in PRIVACY_CONTENT ? locale : 'tr') as keyof typeof PRIVACY_CONTENT;
  const content = type === 'privacy' ? PRIVACY_CONTENT[lang] : TERMS_CONTENT[lang as keyof typeof TERMS_CONTENT];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!type) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown, type]);

  return (
    <AnimatePresence>
      {type && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="relative w-full max-w-2xl max-h-[85vh] bg-neutral-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col pointer-events-auto">
              {/* Header */}
              <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-white/10 shrink-0">
                <div className="space-y-1">
                  <h2 className="text-2xl font-light text-white font-serif tracking-tight">
                    {content?.title}
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">{content?.lastUpdated}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200 shrink-0 ml-4"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto px-8 py-6 space-y-6 text-sm font-light text-neutral-300 leading-relaxed scroll-smooth">
                {content?.sections.map((section, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-sm font-medium text-white tracking-wide">
                      {section.heading}
                    </h3>
                    <p className="text-neutral-400 leading-7">{section.text}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-white/10 shrink-0">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-white/10 text-xs uppercase tracking-[0.2em] font-medium text-neutral-300 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/5 transition-all duration-200"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
