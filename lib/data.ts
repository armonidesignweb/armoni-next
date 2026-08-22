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
  categoryName: string;
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
    categoryName: "Berjer",
    image: "/images/2026/01/Zen-Berjer-1.png",
    badge: "Bestseller"
  },
  {
    id: "p2",
    slug: "weave-berjer",
    name: "Weave Berjer",
    categorySlug: "berjer",
    categoryName: "Berjer",
    image: "/images/2026/01/Weave-Berjerrrs.png",
    badge: "Iconic"
  },
  {
    id: "p3",
    slug: "soft-kose-kanepe",
    name: "Soft Köşe Kanepe",
    categorySlug: "kanepe-kose-takimlari",
    categoryName: "Kanepe & Köşe",
    image: "/images/2026/01/Soft-Kose-Kanepe-1.png",
    badge: "New"
  },
  {
    id: "p4",
    slug: "vittorio-sandalye",
    name: "Vittorio Sandalye",
    categorySlug: "sandalye-benchler",
    categoryName: "Sandalye",
    image: "/images/2026/06/Vittorio-Sandalye-1.png",
    badge: "Signature"
  },
  {
    id: "p5",
    slug: "arco-kose-kanepe",
    name: "Arco Köşe Kanepe",
    categorySlug: "kanepe-kose-takimlari",
    categoryName: "Kanepe & Köşe",
    image: "/images/2026/01/Arco-Kose-Kanepe.png",
    badge: "Exclusive"
  },
  {
    id: "p6",
    slug: "noma-berjer",
    name: "Noma Berjer",
    categorySlug: "berjer",
    categoryName: "Berjer",
    image: "/images/2026/01/Noma-Berjer-1.png"
  },
  {
    id: "p7",
    slug: "calma-yatak",
    name: "Calma Yatak",
    categorySlug: "yatak-odasi",
    categoryName: "Yatak Odası",
    image: "/images/2026/01/Calma-Yatak.png"
  },
  {
    id: "p8",
    slug: "bellagio-sandalye",
    name: "Bellagio Sandalye",
    categorySlug: "sandalye-benchler",
    categoryName: "Sandalye",
    image: "/images/2026/06/Bellagio-Sandalye.png"
  }
];
