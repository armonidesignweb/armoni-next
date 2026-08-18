export const GOOGLE_REVIEWS = Array.from({ length: 96 }).map((_, i) => {
  const avatars = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
  const names = [
    'Ahmet Yılmaz', 'Mehmet Kaya', 'Ayşe Demir', 'Fatma Çelik', 'Mustafa Şahin', 
    'Emre Yıldız', 'Zeynep Aydın', 'Burak Öz', 'Hakan Can', 'Elif Tekin',
    'Ali Koç', 'Caner Er', 'Sinem Ak', 'Deniz Gök', 'Cemil Taş', 'Gizem Uysal'
  ];
  
  const comments = [
    "Armoni Design ile çalışmak harika bir deneyimdi. Mobilyaların kalitesi ve işçilik tek kelimeyle mükemmel.",
    "Sipariş ettiğimiz koltuk takımı beklediğimizden de güzel geldi. İtalyan tasarımı evimize çok yakıştı.",
    "Özel üretim taleplerimizi harfiyen yerine getirdiler. Müşteri memnuniyetine verdikleri önem takdire şayan.",
    "Teslimat tam zamanında yapıldı. Ürünlerin paketlenmesi çok özenliydi.",
    "Fiyat/Performans açısından harika ürünler. Kalitesinden kesinlikle ödün vermiyorlar.",
    "Tasarım sürecinden teslimata kadar her aşamada bilgilendirildik. Çok profesyonel bir ekip.",
    "Mağazadaki ilgi ve alaka süperdi. Aradığımızı bulmamızda çok yardımcı oldular.",
    "Yatak odası takımımız çok şık. Detaylardaki işçilik kalitesi hemen göze çarpıyor."
  ];

  return {
    id: `review-${i}`,
    name: names[i % names.length] + (i > 15 ? ` ${String.fromCharCode(65 + (i % 26))}.` : ''),
    avatarColor: avatars[i % avatars.length],
    initial: names[i % names.length].charAt(0),
    rating: 5,
    date: `${Math.floor(Math.random() * 11) + 1} ay önce`,
    text: comments[i % comments.length]
  };
});
