const fs = require('fs');
let file = fs.readFileSync('c:/Users/TOLGA HOCA/Desktop/armonidesign.com/armoni-next/lib/data.ts', 'utf8');

// Update interface
file = file.replace('categoryName: string;', 'categoryName: Record<string, string>;\n  description: Record<string, string>;');

// Helper to create localized object
const loc = (tr, en, de, ru, ar) => `{ tr: '${tr}', en: '${en}', de: '${de}', ru: '${ru}', ar: '${ar}' }`;

const descLoc = loc('Zarif detayları ve yüksek kalite standartlarıyla üretilen bu tasarım, yaşam alanlarınıza sofistike bir dokunuş katıyor. İnce işçiliği ve modern çizgileriyle dikkat çeken bu parça, hem estetik hem de fonksiyonelliği bir araya getiriyor.', 
'Produced with elegant details and high quality standards, this design adds a sophisticated touch to your living spaces. Drawing attention with its fine craftsmanship and modern lines, this piece brings together both aesthetics and functionality.', 
'Dieses Design, das mit eleganten Details und hohen Qualitätsstandards hergestellt wird, verleiht Ihren Wohnräumen eine raffinierte Note. Dieses Stück, das durch seine feine Handwerkskunst und modernen Linien besticht, vereint Ästhetik und Funktionalität.', 
'Этот дизайн, созданный с элегантными деталями и высокими стандартами качества, придает изысканность вашим жилым помещениям. Привлекая внимание своим тонким мастерством и современными линиями, этот предмет сочетает в себе эстетику и функциональность.', 
'يضيف هذا التصميم، الذي تم إنتاجه بتفاصيل أنيقة ومعايير جودة عالية، لمسة متطورة إلى مساحات المعيشة الخاصة بك. يجذب هذا القطعة الانتباه بحرفيتها الدقيقة وخطوطها الحديثة، حيث يجمع بين الجمالية والوظائف.');

file = file.replace(/categoryName: "Berjer"/g, `categoryName: ${loc('Berjer', 'Armchair', 'Sessel', 'Кресло', 'كرسي')}, description: ${descLoc}`);

file = file.replace(/categoryName: "Kanepe & Köşe"/g, `categoryName: ${loc('Kanepe & Köşe', 'Sofa & Corner', 'Sofa & Ecke', 'Диван и угловой', 'أريكة وزاوية')}, description: ${descLoc}`);

file = file.replace(/categoryName: "Sandalye"/g, `categoryName: ${loc('Sandalye', 'Chair', 'Stuhl', 'Стул', 'كرسي')}, description: ${descLoc}`);

file = file.replace(/categoryName: "Yatak Odası"/g, `categoryName: ${loc('Yatak Odası', 'Bedroom', 'Schlafzimmer', 'Спальня', 'غرفة نوم')}, description: ${descLoc}`);

fs.writeFileSync('c:/Users/TOLGA HOCA/Desktop/armonidesign.com/armoni-next/lib/data.ts', file);
console.log('Done');
