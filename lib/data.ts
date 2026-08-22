export interface CategoryData {
  id: string;
  slug: string;
  key: string;
  image: string;
  itemCount: number;
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: Record<string, string>;
  description: Record<string, string>;
  image: string;
  badge?: string;
}

export interface HeroSlide {
  id: number;
  titleKey: string;
  subtitleKey: string;
  video: string;
  category: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    titleKey: "Bellagia Outdoor Takımı",
    subtitleKey: "Modern İtalyan çizgisi, üst düzey konfor",
    video: "/slider-video/Bellagio-Outdoor-Team-Video.mp4",
    category: "outdoor"
  },
  {
    id: 2,
    titleKey: "Crown Sandalye",
    subtitleKey: "Ergonomi ve zarif detayların mükemmel uyumu",
    video: "/slider-video/Crown-Chair-Video.mp4",
    category: "sandalye-benchler"
  },
  {
    id: 3,
    titleKey: "Fjord Berjer",
    subtitleKey: "Dokusal zenginlik ve zamansız estetik",
    video: "/slider-video/Fjord-Berjer-Video.mp4",
    category: "berjer"
  },
  {
    id: 4,
    titleKey: "Nacre Köşe Kanepe",
    subtitleKey: "Zanaatkarlık ve şıklığın simgesi",
    video: "/slider-video/Nacre-Corner Sofa-Video.mp4",
    category: "kanepe-kose-takimlari"
  }
];

export const CATEGORIES: CategoryData[] = [
  {
    id: "1",
    slug: "kanepe-kose-takimlari",
    key: "sofa",
    image: "/images/2026/01/Arco-Kose-Kanepe.png",
    itemCount: 24
  },
  {
    id: "2",
    slug: "berjer",
    key: "berjer",
    image: "/images/2026/01/Zen-Berjer-1.png",
    itemCount: 18
  },
  {
    id: "3",
    slug: "sandalye-benchler",
    key: "chair",
    image: "/images/2026/06/Vittorio-Sandalye-1.png",
    itemCount: 32
  },
  {
    id: "4",
    slug: "yatak-odasi",
    key: "bedroom",
    image: "/images/2026/01/Calma-Yatak.png",
    itemCount: 12
  }
];

export const FEATURED_PRODUCTS: ProductData[] = [
  {
    id: "p1",
    slug: "zen-berjer",
    name: "Zen Berjer",
    categorySlug: "berjer",
    categoryName: { tr: 'Berjer', en: 'Armchair', de: 'Sessel', ru: 'Кресло', ar: 'كرسي' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/01/Zen-Berjer-1.png",
    badge: "Bestseller"
  },
  {
    id: "p2",
    slug: "weave-berjer",
    name: "Weave Berjer",
    categorySlug: "berjer",
    categoryName: { tr: 'Berjer', en: 'Armchair', de: 'Sessel', ru: 'Кресло', ar: 'كرسي' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/01/Weave-Berjerrrs.png",
    badge: "Iconic"
  },
  {
    id: "p3",
    slug: "soft-kose-kanepe",
    name: "Soft Köşe Kanepe",
    categorySlug: "kanepe-kose-takimlari",
    categoryName: { tr: 'Kanepe & Köşe', en: 'Sofa & Corner', de: 'Sofa & Ecke', ru: 'Диван и угловой', ar: 'أريكة وزاوية' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/01/Soft-Kose-Kanepe-1.png",
    badge: "New"
  },
  {
    id: "p4",
    slug: "vittorio-sandalye",
    name: "Vittorio Sandalye",
    categorySlug: "sandalye-benchler",
    categoryName: { tr: 'Sandalye', en: 'Chair', de: 'Stuhl', ru: 'Стул', ar: 'كرسي' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/06/Vittorio-Sandalye-1.png",
    badge: "Signature"
  },
  {
    id: "p5",
    slug: "arco-kose-kanepe",
    name: "Arco Köşe Kanepe",
    categorySlug: "kanepe-kose-takimlari",
    categoryName: { tr: 'Kanepe & Köşe', en: 'Sofa & Corner', de: 'Sofa & Ecke', ru: 'Диван и угловой', ar: 'أريكة وزاوية' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/01/Arco-Kose-Kanepe.png",
    badge: "Exclusive"
  },
  {
    id: "p6",
    slug: "noma-berjer",
    name: "Noma Berjer",
    categorySlug: "berjer",
    categoryName: { tr: 'Berjer', en: 'Armchair', de: 'Sessel', ru: 'Кресло', ar: 'كرسي' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/01/Noma-Berjer-1.png"
  },
  {
    id: "p7",
    slug: "calma-yatak",
    name: "Calma Yatak",
    categorySlug: "yatak-odasi",
    categoryName: { tr: 'Yatak Odası', en: 'Bedroom', de: 'Schlafzimmer', ru: 'Спальня', ar: 'غرفة نوم' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/01/Calma-Yatak.png"
  },
  {
    id: "p8",
    slug: "bellagio-sandalye",
    name: "Bellagio Sandalye",
    categorySlug: "sandalye-benchler",
    categoryName: { tr: 'Sandalye', en: 'Chair', de: 'Stuhl', ru: 'Стул', ar: 'كرسي' },
    description: { tr: 'Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', en: 'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', de: 'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', ru: 'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', ar: 'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.' },
    image: "/images/2026/06/Bellagio-Sandalye.png"
  }
];
