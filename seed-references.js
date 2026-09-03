const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/armonidesign';

const ReferenceSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    logo: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Reference = mongoose.models.Reference || mongoose.model('Reference', ReferenceSchema);

const REFERENCES = [
  { slug: 'asuman', name: 'ASUMAN', file: 'ASUMAN-renkli.png', href: 'https://www.asuman.com/' },
  { slug: 'evar', name: 'EVAR', file: 'EVAR-renkli.png', href: 'https://www.instagram.com/evardiyarbakir/' },
  { slug: 'kaspia', name: 'KASPIA', file: 'KASPIA-renkli.png', href: 'https://caviarkaspia.com/' },
  { slug: 'kadayifzade', name: 'KADAYIFZADE', file: 'Kadayıfzade-renkli.png', href: 'https://www.kadayifzade.com.tr/' },
  { slug: 'muratchef', name: 'MURATCHEF', file: 'MURAT-CHEF-renkli.png', href: 'https://www.muratchef.com.tr/' },
  { slug: 'nine', name: 'NINE', file: 'NINE-renkli.png', href: 'https://www.instagram.com/ninewestturkiye/' },
  { slug: 'akmerkez', name: 'AKMERKEZ', file: 'ak-merkez-renkli.webp', href: 'https://www.akmerkez.com.tr/' },
  { slug: 'azura', name: 'AZURA', file: 'azura-renkli.png', href: 'https://azura.london/' },
  { slug: 'bigmamas', name: 'BIGMAMA\'S', file: 'big-mammas-renkli.png', href: 'https://www.bigmamaspre.com/tr/' },
  { slug: 'blueseahotel', name: 'BLUESEAHOTEL', file: 'blue-sea-hotel-renkli.png', href: 'https://www.blueseahotel.com.tr/' },
  { slug: 'buyukyali', name: 'BÜYÜKYALI', file: 'büyükyalı-istanbul-renkli.png', href: 'https://www.instagram.com/buyukyali/' },
  { slug: 'cahide-palazzo', name: 'CAHİDE PALAZZO', file: 'cahide-plazzo-renkli.png', href: 'https://cahidepalazzo.com.tr/' },
  { slug: 'celal-aga', name: 'CELAL AĞA', file: 'cella-otel-renkli.png', href: 'https://www.celalagakonagi.com/' },
  { slug: 'chamada-hotel', name: 'CHAMADA HOTEL', file: 'chamada-prestige-renkli.png', href: 'https://booking.chamadahotels.com/booking' },
  { slug: 'cvk-hotel', name: 'CVK HOTEL', file: 'cvk park otel-renkli.png', href: 'https://www.cvkhotelsandresorts.com/' },
  { slug: 'czn-burak', name: 'CZN BURAK', file: 'czn-burak-renkli.png', href: 'https://www.cznburak.tr/tr' },
  { slug: 'aqua-florya', name: 'AQUA FLORYA', file: 'aqua-florya-renkli.png', href: 'https://aquaflorya.com/' },
  { slug: 'double-tree', name: 'DOUBLE TREE', file: 'double-tree-by-hilton-renkli.webp', href: 'https://www.hilton.com/en/hotels/istimdi-doubletree-istanbul-moda/' },
  { slug: 'eln-london', name: 'EL&N LONDON', file: 'el&n-renkli.webp', href: 'https://elnlondon.com/' },
  { slug: 'ercan-havalimani', name: 'ERCAN HAVALİMANI', file: 'ercan-havalimanı-renkli.webp', href: 'https://www.ercanhavalimani.com/' },
  { slug: 'fisekhane', name: 'FİŞEKHANE', file: 'fişekhane-renkli.png', href: 'https://www.fisekhane.com/tr/' },
  { slug: 'galataport', name: 'GALATAPORT', file: 'galataport-renkli.png', href: 'https://galataport.com/' },
  { slug: 'gleam', name: 'GLEAM', file: 'gleam-koleksiyon-renkli.png', href: 'https://www.gleamcollection.com/' },
  { slug: 'golab', name: 'GOLAB', file: 'golab-renkli.png', href: 'https://golabrestaurant.com/' },
  { slug: 'haci-levent', name: 'HACI LEVENT', file: 'hacı-levent-renkli.png', href: 'https://www.hacilevent.com.tr/' },
  { slug: 'happymoons', name: 'HAPPYMOON\'S', file: 'happy-moons-renkli.png', href: 'https://www.happygroup.com.tr/' },
  { slug: 'huqqabaz', name: 'HuQQabaz', file: 'hoqqabaaz-renkli.webp', href: 'https://huqqabaz.com/tr/' },
  { slug: 'les-ambassadeurs', name: 'LES AMBASSADEURS', file: 'les-ambassadeurs-renkli.png', href: 'https://lesambassadeurs.net/' },
  { slug: 'lulu', name: 'LULU', file: 'lulu-renkli.png', href: 'https://www.qrlim.com/LULULNG/index.php?/1001' },
  { slug: 'maslak-1453', name: 'MASLAK 1453', file: 'maslak-1453-renkli.png', href: 'https://www.maslak1453yonetim.com/' },
  { slug: 'mylounge', name: 'MYLOUNGE', file: 'my-lounge-renkli.png', href: 'https://www.tripadvisor.com/Restaurant_Review-g34515-d24180858-Reviews-MYLounge_Orlando-Orlando_Florida.html' },
  { slug: 'niyokki', name: 'NİYOKKİ', file: 'niyokki-renkli.png', href: 'https://niyokki.com.tr/' },
  { slug: 'ramada', name: 'RAMADA', file: 'ramada-otel-renkli.png', href: 'https://www.wyndhamhotels.com/tr-tr/ramada/istanbul-turkiye/ramada-hotel-and-suites-istanbul-sisli/overview' },
  { slug: 'rhain', name: 'RHAIN', file: 'rhaın-restorant-renkli.png', href: 'https://www.facebook.com/RhainDubai/' },
  { slug: 'skyland', name: 'SKYLAND', file: 'skyland-ist-renkli.webp', href: 'https://www.skylandistanbul.com/' },
  { slug: 'socar', name: 'SOCAR', file: 'socar-renkli.png', href: 'https://www.socar.com.tr/' },
  { slug: 'sodexo', name: 'SODEXO', file: 'sodexo-renkli.webp', href: 'https://www.sodexo.com/' },
  { slug: 'tav-havalimani', name: 'TAV HAVALİMANI', file: 'tav-havalimanı-renkli.webp', href: 'https://tavairports.com/tr' },
  { slug: 'tezgah-kebap', name: 'TEZGAH KEBAP', file: 'tezgah-kebao-renkli.png', href: 'https://www.instagram.com/tezgahkebap/' },
  { slug: 'the-mark', name: 'THE MARK', file: 'the-mark-renkli.png', href: 'https://www.themarkhotel.com/' },
  { slug: 'yalikavak', name: 'YALIKAVAK', file: 'yalıkavak-marina.png', href: 'https://yalikavakmarina.com.tr/tr/' },
  { slug: 'zeytinburnu-belediyesi', name: 'ZEYTİNBURNU BELEDİYESİ', file: 'zeytinburnu-belediyesi-renkli.png', href: 'https://zeytinburnu.istanbul/' },
  { slug: 'zorlu-center', name: 'ZORLU CENTER', file: 'zorlu-center-renkli.png', href: 'https://www.zorlucenter.com.tr/' },
  { slug: 'zuhal-muzik', name: 'ZUHAL MÜZİK', file: 'zuhal-renkli.webp', href: 'https://www.zuhalmuzik.com/' },
  { slug: 'cicek-sepeti', name: 'ÇİÇEK SEPETİ', file: 'çiçek-sepeti-renkli.png', href: 'https://www.ciceksepeti.com/' },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const count = await Reference.countDocuments();
  if (count > 0) {
    console.log('References already seeded.');
    process.exit(0);
  }

  for (let i = 0; i < REFERENCES.length; i++) {
    const ref = REFERENCES[i];
    await Reference.create({
      companyName: ref.name,
      logo: `/referanslar/renkli/${ref.file}`,
      link: ref.href !== '#' ? ref.href : '',
      isActive: true,
      order: i,
    });
  }

  console.log('Seeded successfully!');
  process.exit(0);
}

seed().catch(console.error);
