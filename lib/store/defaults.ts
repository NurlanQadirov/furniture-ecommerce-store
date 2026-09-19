import type { Category, ContactInfo, Product } from '@/types';
import type { CalculatorSettings, SiteStore } from '@/lib/store/schema';

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const defaultCategories: Category[] = [
  {
    id: 'cat-kitchen',
    slug: 'metbex-mebeli',
    name: { az: 'Mətbəx mebeli', en: 'Kitchen furniture', ru: 'Кухонная мебель' },
    description: {
      az: 'Ölçüyə görə hazırlanan mətbəx dəstləri — MDF, akril və şpon fasadlar, keyfiyyətli furnitura.',
      en: 'Made-to-measure kitchen sets — MDF, acrylic and veneer fronts with quality hardware.',
      ru: 'Кухонные гарнитуры на заказ — фасады МДФ, акрил и шпон с качественной фурнитурой.',
    },
    image: U('photo-1556909212-d5b604d0c90d'),
    order: 1,
  },
  {
    id: 'cat-living',
    slug: 'salon-mebeli',
    name: { az: 'Salon mebeli', en: 'Living room furniture', ru: 'Мебель для гостиной' },
    description: {
      az: 'TV divarları, vitrinlər və kitab rəfləri — salonunuzun ölçüsünə tam uyğun.',
      en: 'TV walls, display units and bookshelves fitted exactly to your living room.',
      ru: 'ТВ-стенки, витрины и книжные полки точно по размеру вашей гостиной.',
    },
    image: U('photo-1567767292278-a4f21aa2d36e'),
    order: 2,
  },
  {
    id: 'cat-bedroom',
    slug: 'yataq-mebeli',
    name: { az: 'Yataq otağı mebeli', en: 'Bedroom furniture', ru: 'Мебель для спальни' },
    description: {
      az: 'Çarpayı, komod və tumbalar — rahat yuxu üçün tam dəst.',
      en: 'Beds, chests and nightstands — a complete set for restful sleep.',
      ru: 'Кровати, комоды и тумбы — полный комплект для спокойного сна.',
    },
    image: U('photo-1505693416388-ac5ce068fe85'),
    order: 3,
  },
  {
    id: 'cat-wardrobe',
    slug: 'qarderob',
    name: { az: 'Qarderob və şkaflar', en: 'Wardrobes', ru: 'Гардеробы и шкафы' },
    description: {
      az: 'Kupe və açılan qapılı qarderoblar, güzgülü və lakobel fasadlar.',
      en: 'Sliding and hinged wardrobes with mirror or lacobel fronts.',
      ru: 'Шкафы-купе и распашные с зеркальными и лакобель фасадами.',
    },
    image: U('photo-1558997519-83ea9252edf8'),
    order: 4,
  },
  {
    id: 'cat-office',
    slug: 'ofis-mebeli',
    name: { az: 'Ofis mebeli', en: 'Office furniture', ru: 'Офисная мебель' },
    description: {
      az: 'İş masaları, sənəd şkafları və qəbul masaları.',
      en: 'Desks, document cabinets and reception counters.',
      ru: 'Рабочие столы, шкафы для документов и стойки ресепшн.',
    },
    image: U('photo-1518455027359-f3f8164ba6bd'),
    order: 5,
  },
  {
    id: 'cat-kids',
    slug: 'usaq-otagi',
    name: { az: 'Uşaq otağı', en: 'Kids room', ru: 'Детская комната' },
    description: {
      az: 'Təhlükəsiz materiallardan hazırlanan uşaq çarpayıları, yazı masaları və rəflər.',
      en: 'Kids beds, desks and shelving built from safe, certified materials.',
      ru: 'Детские кровати, письменные столы и полки из безопасных материалов.',
    },
    image: U('photo-1631679706909-1844bbd07221'),
    order: 6,
  },
];

const now = '2024-01-01T00:00:00.000Z';

export const defaultProducts: Product[] = [
  {
    id: 'p-kitchen-akril',
    categoryId: 'cat-kitchen',
    name: { az: 'Akril mətbəx — Milano', en: 'Acrylic kitchen — Milano', ru: 'Акриловая кухня — Milano' },
    description: {
      az: 'Yüksək parıltılı akril fasadlar, Blum furnitura və süni mərmər tezgah. Künc bölmələrdə çıxarıcı mexanizm, yuxarı şkaflarda qaldırıcı sistem standart daxildir.',
      en: 'High-gloss acrylic fronts, Blum hardware and a solid-surface worktop. Corner pull-outs and lift-up mechanisms on the upper units come as standard.',
      ru: 'Глянцевые акриловые фасады, фурнитура Blum и столешница из искусственного камня. Угловые выдвижные механизмы и подъёмники входят в стандарт.',
    },
    mainImage: U('photo-1556911220-bff31c812dba'),
    images: [
      U('photo-1556909190-eccf4a8bf97a'),
      U('photo-1600489000022-c2086d79f9d4'),
      U('photo-1565538810643-b5bdb714032a'),
    ],
    price: 4200,
    featured: true,
    order: 1,
    createdAt: now,
  },
  {
    id: 'p-kitchen-mdf',
    categoryId: 'cat-kitchen',
    name: { az: 'MDF emal mətbəx — Klassik', en: 'Milled MDF kitchen — Classic', ru: 'Кухня из фрезерованного МДФ — Классик' },
    description: {
      az: 'Freze emallı MDF fasadlar, mat lak örtük. Klassik interyerlər üçün ideal, sifarişə görə rəng seçimi.',
      en: 'Milled MDF fronts with a matte lacquer finish. Ideal for classic interiors, colour matched to order.',
      ru: 'Фрезерованные МДФ фасады с матовым лаком. Идеально для классических интерьеров, цвет на заказ.',
    },
    mainImage: U('photo-1600489000022-c2086d79f9d4'),
    images: [U('photo-1541123437800-1bb1317badc2'), U('photo-1600607686527-6fb886090705')],
    price: 3400,
    featured: true,
    order: 2,
    createdAt: now,
  },
  {
    id: 'p-living-tv',
    categoryId: 'cat-living',
    name: { az: 'TV divarı — Oslo', en: 'TV wall — Oslo', ru: 'ТВ-стенка — Oslo' },
    description: {
      az: 'Asma bölmələr, gizli LED işıqlandırma və şüşə vitrin. Kabellər üçün gizli kanal sistemi ilə.',
      en: 'Floating modules, concealed LED lighting and a glass display cabinet, with hidden cable routing.',
      ru: 'Подвесные модули, скрытая LED-подсветка и стеклянная витрина со скрытой прокладкой кабелей.',
    },
    mainImage: U('photo-1586023492125-27b2c045efd7'),
    images: [U('photo-1600121848594-d8644e57abab'), U('photo-1524758631624-e2822e304c36')],
    price: 1850,
    featured: true,
    order: 1,
    createdAt: now,
  },
  {
    id: 'p-bedroom-bed',
    categoryId: 'cat-bedroom',
    name: { az: 'Çarpayı — Aura', en: 'Bed — Aura', ru: 'Кровать — Aura' },
    description: {
      az: 'Yumşaq başlıqlı ikinəfərlik çarpayı, qaldırıcı mexanizm və yataq dəsti üçün saxlama bölməsi ilə.',
      en: 'Upholstered double bed with a lift-up base and integrated bedding storage.',
      ru: 'Двуспальная кровать с мягким изголовьем, подъёмным механизмом и бельевым ящиком.',
    },
    mainImage: U('photo-1505693416388-ac5ce068fe85'),
    images: [U('photo-1540518614846-7eded433c457'), U('photo-1609766857041-ed402ea8069a')],
    price: 1250,
    featured: true,
    order: 1,
    createdAt: now,
  },
  {
    id: 'p-wardrobe-kupe',
    categoryId: 'cat-wardrobe',
    name: { az: 'Kupe qarderob — Linea', en: 'Sliding wardrobe — Linea', ru: 'Шкаф-купе — Linea' },
    description: {
      az: 'Güzgülü sürüşən qapılar, yumşaq bağlanma sistemi, daxildə ştanq, rəflər və şuflyad blokları.',
      en: 'Mirrored sliding doors with soft-close runners; rails, shelving and drawer blocks inside.',
      ru: 'Зеркальные раздвижные двери с доводчиками; внутри штанги, полки и блоки ящиков.',
    },
    mainImage: U('photo-1558997519-83ea9252edf8'),
    images: [U('photo-1595428774223-ef52624120d2'), U('photo-1615874959474-d609969a20ed')],
    price: 1600,
    featured: false,
    order: 1,
    createdAt: now,
  },
  {
    id: 'p-office-desk',
    categoryId: 'cat-office',
    name: { az: 'İş masası — Nova', en: 'Desk — Nova', ru: 'Рабочий стол — Nova' },
    description: {
      az: 'Metal ayaqlı iş masası, kabel kanalı və çəkməcə bloku ilə. Ofis və ev ofisi üçün.',
      en: 'Steel-legged desk with a cable tray and drawer unit, for the office or a home study.',
      ru: 'Стол на металлических опорах с кабель-каналом и тумбой — для офиса и домашнего кабинета.',
    },
    mainImage: U('photo-1593062096033-9a26b09da705'),
    images: [U('photo-1518455027359-f3f8164ba6bd')],
    price: 780,
    featured: false,
    order: 1,
    createdAt: now,
  },
];

export const defaultContact: ContactInfo = {
  phone: '+994 50 123 45 67',
  whatsapp: '994501234567',
  email: 'info@mebeltech.az',
  address: {
    az: 'Bakı, Nizami küç. 123',
    en: 'Baku, Nizami str. 123',
    ru: 'Баку, ул. Низами 123',
  },
  instagram: 'https://instagram.com/mebeltech',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.748348274363!2d49.85175631539423!3d40.36987327940175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d079efb5163%3A0xc202bfd8e906324!2sNizami%20St%2C%20Baku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1673883343343!5m2!1sen!2s',
};

const hardwareLevels = [
  {
    id: 'hw-economy',
    name: { az: 'Ekonom', en: 'Economy', ru: 'Эконом' },
    description: {
      az: 'Sadə petlələr və sürüşmə mexanizmləri.',
      en: 'Basic hinges and runners.',
      ru: 'Базовые петли и направляющие.',
    },
    multiplier: 1,
  },
  {
    id: 'hw-standard',
    name: { az: 'Standart', en: 'Standard', ru: 'Стандарт' },
    description: {
      az: 'Yumşaq bağlanma, tam çıxan şuflyadlar.',
      en: 'Soft-close hinges and full-extension drawers.',
      ru: 'Доводчики и ящики полного выдвижения.',
    },
    multiplier: 1.15,
  },
  {
    id: 'hw-premium',
    name: { az: 'Premium', en: 'Premium', ru: 'Премиум' },
    description: {
      az: 'Blum / Hettich səviyyəsində furnitura, ömürlük zəmanət.',
      en: 'Blum / Hettich grade hardware with a lifetime guarantee.',
      ru: 'Фурнитура уровня Blum / Hettich с пожизненной гарантией.',
    },
    multiplier: 1.35,
  },
];

export const defaultCalculator: CalculatorSettings = {
  rangePercent: 8,
  roundTo: 50,
  installationFee: 100,
  deliveryFee: 50,
  kitchen: {
    materials: [
      {
        id: 'km-ldsp',
        name: { az: 'LDSP (laminat)', en: 'Laminated chipboard', ru: 'ЛДСП (ламинат)' },
        image: U('photo-1556909190-eccf4a8bf97a', 600),
        lowerPerM: 260,
        upperPerM: 190,
      },
      {
        id: 'km-mdf',
        name: { az: 'MDF emal', en: 'Milled MDF', ru: 'Фрезерованный МДФ' },
        image: U('photo-1600489000022-c2086d79f9d4', 600),
        lowerPerM: 400,
        upperPerM: 300,
      },
      {
        id: 'km-akril',
        name: { az: 'Akril (parlaq)', en: 'Acrylic (gloss)', ru: 'Акрил (глянец)' },
        image: U('photo-1556911220-bff31c812dba', 600),
        lowerPerM: 520,
        upperPerM: 390,
      },
      {
        id: 'km-masiv',
        name: { az: 'Şpon / masiv', en: 'Veneer / solid wood', ru: 'Шпон / массив' },
        image: U('photo-1600607686527-6fb886090705', 600),
        lowerPerM: 700,
        upperPerM: 520,
      },
    ],
    counterTops: [
      {
        id: 'ct-ldsp',
        name: { az: 'Laminat tezgah', en: 'Laminate worktop', ru: 'Ламинированная столешница' },
        image: U('photo-1556909212-d5b604d0c90d', 600),
        pricePerM: 90,
      },
      {
        id: 'ct-akril',
        name: { az: 'Akril daş', en: 'Solid surface', ru: 'Акриловый камень' },
        image: U('photo-1541123437800-1bb1317badc2', 600),
        pricePerM: 250,
      },
      {
        id: 'ct-kvars',
        name: { az: 'Kvars aqlomerat', en: 'Quartz', ru: 'Кварцевый агломерат' },
        image: U('photo-1565538810643-b5bdb714032a', 600),
        pricePerM: 420,
      },
    ],
    hardwareLevels,
    accessories: [
      {
        id: 'acc-cargo',
        name: { az: 'Karqo (butılka çıxarıcı)', en: 'Pull-out cargo unit', ru: 'Карго (бутылочница)' },
        price: 160,
        max: 2,
      },
      {
        id: 'acc-lift',
        name: { az: 'Qaldırıcı mexanizm', en: 'Lift-up mechanism', ru: 'Подъёмный механизм' },
        price: 60,
        max: 6,
      },
      {
        id: 'acc-led',
        name: { az: 'LED işıqlandırma', en: 'LED lighting', ru: 'LED-подсветка' },
        price: 120,
        max: 1,
      },
      {
        id: 'acc-corner',
        name: { az: 'Künc çıxarıcı', en: 'Corner pull-out', ru: 'Угловой выдвижной механизм' },
        price: 220,
        max: 2,
      },
    ],
  },
  wardrobe: {
    materials: [
      {
        id: 'wm-ldsp',
        name: { az: 'LDSP (laminat)', en: 'Laminated chipboard', ru: 'ЛДСП (ламинат)' },
        image: U('photo-1595428774223-ef52624120d2', 600),
        pricePerM2: 190,
      },
      {
        id: 'wm-mdf',
        name: { az: 'MDF emal', en: 'Milled MDF', ru: 'Фрезерованный МДФ' },
        image: U('photo-1566665797739-1674de7a421a', 600),
        pricePerM2: 280,
      },
      {
        id: 'wm-akril',
        name: { az: 'Akril (parlaq)', en: 'Acrylic (gloss)', ru: 'Акрил (глянец)' },
        image: U('photo-1558997519-83ea9252edf8', 600),
        pricePerM2: 360,
      },
    ],
    doorTypes: [
      {
        id: 'wd-hinged',
        name: { az: 'Açılan qapı', en: 'Hinged doors', ru: 'Распашные двери' },
        multiplier: 1,
      },
      {
        id: 'wd-sliding',
        name: { az: 'Kupe (sürüşən)', en: 'Sliding doors', ru: 'Двери-купе' },
        multiplier: 1.2,
      },
    ],
    depthOptions: [
      {
        id: 'wdp-60',
        name: { az: 'Dərinlik 60 sm', en: 'Depth 60 cm', ru: 'Глубина 60 см' },
        multiplier: 1,
      },
      {
        id: 'wdp-45',
        name: { az: 'Dərinlik 45 sm', en: 'Depth 45 cm', ru: 'Глубина 45 см' },
        multiplier: 0.88,
      },
    ],
    glassOptions: [
      {
        id: 'wg-none',
        name: { az: 'Əlavəsiz', en: 'No insert', ru: 'Без вставок' },
        image: U('photo-1615874959474-d609969a20ed', 600),
        pricePerM2: 0,
      },
      {
        id: 'wg-mirror',
        name: { az: 'Güzgü', en: 'Mirror', ru: 'Зеркало' },
        image: U('photo-1609766857041-ed402ea8069a', 600),
        pricePerM2: 70,
      },
      {
        id: 'wg-lacobel',
        name: { az: 'Lakobel / şüşə', en: 'Lacobel / glass', ru: 'Лакобель / стекло' },
        image: U('photo-1618221195710-dd6b41faaea6', 600),
        pricePerM2: 95,
      },
    ],
    interiorItems: [
      { id: 'wi-shelf', name: { az: 'Rəf', en: 'Shelf', ru: 'Полка' }, price: 35, max: 12 },
      { id: 'wi-rail', name: { az: 'Ştanq', en: 'Hanging rail', ru: 'Штанга' }, price: 25, max: 6 },
      { id: 'wi-drawer', name: { az: 'Şuflyad', en: 'Drawer', ru: 'Ящик' }, price: 65, max: 10 },
      {
        id: 'wi-led',
        name: { az: 'LED işıqlandırma', en: 'LED lighting', ru: 'LED-подсветка' },
        price: 110,
        max: 1,
      },
    ],
    hardwareLevels,
  },
  living: {
    materials: [
      {
        id: 'lm-ldsp',
        name: { az: 'LDSP (laminat)', en: 'Laminated chipboard', ru: 'ЛДСП (ламинат)' },
        image: U('photo-1600121848594-d8644e57abab', 600),
        pricePerM2: 180,
      },
      {
        id: 'lm-mdf',
        name: { az: 'MDF emal', en: 'Milled MDF', ru: 'Фрезерованный МДФ' },
        image: U('photo-1586023492125-27b2c045efd7', 600),
        pricePerM2: 270,
      },
      {
        id: 'lm-akril',
        name: { az: 'Akril (parlaq)', en: 'Acrylic (gloss)', ru: 'Акрил (глянец)' },
        image: U('photo-1618221195710-dd6b41faaea6', 600),
        pricePerM2: 350,
      },
    ],
    modules: [
      {
        id: 'lv-hanging',
        name: { az: 'Asma bölmə', en: 'Floating module', ru: 'Подвесной модуль' },
        price: 130,
        max: 6,
      },
      {
        id: 'lv-vitrin',
        name: { az: 'Vitrin şüşəsi', en: 'Glass display front', ru: 'Стеклянная витрина' },
        price: 180,
        max: 4,
      },
      {
        id: 'lv-led',
        name: { az: 'LED işıqlandırma', en: 'LED lighting', ru: 'LED-подсветка' },
        price: 120,
        max: 1,
      },
      {
        id: 'lv-book',
        name: { az: 'Kitab rəfi', en: 'Bookshelf', ru: 'Книжная полка' },
        price: 95,
        max: 8,
      },
    ],
    hardwareLevels,
  },
  fixed: {
    models: [
      {
        id: 'fx-bed-standard',
        name: { az: 'Çarpayı — Standart', en: 'Bed — Standard', ru: 'Кровать — Стандарт' },
        description: {
          az: '160x200, sadə başlıq, laminat korpus.',
          en: '160x200, plain headboard, laminate carcass.',
          ru: '160x200, простое изголовье, ламинированный корпус.',
        },
        image: U('photo-1522771739844-6a9f6d5f14af', 600),
        price: 750,
      },
      {
        id: 'fx-bed-soft',
        name: { az: 'Çarpayı — Yumşaq başlıq', en: 'Bed — Upholstered', ru: 'Кровать — Мягкое изголовье' },
        description: {
          az: '160x200, parça üzlük, qaldırıcı mexanizm.',
          en: '160x200, fabric upholstery, lift-up base.',
          ru: '160x200, тканевая обивка, подъёмный механизм.',
        },
        image: U('photo-1505693416388-ac5ce068fe85', 600),
        price: 1250,
      },
      {
        id: 'fx-komod',
        name: { az: 'Komod — 4 şuflyad', en: 'Chest — 4 drawers', ru: 'Комод — 4 ящика' },
        description: {
          az: '120 sm en, tam çıxan şuflyadlar.',
          en: '120 cm wide, full-extension drawers.',
          ru: 'Ширина 120 см, ящики полного выдвижения.',
        },
        image: U('photo-1513694203232-719a280e022f', 600),
        price: 540,
      },
      {
        id: 'fx-tumba',
        name: { az: 'Yataq tumbası (cüt)', en: 'Nightstands (pair)', ru: 'Прикроватные тумбы (пара)' },
        description: {
          az: 'İki ədəd, 2 şuflyadlı.',
          en: 'Two units, two drawers each.',
          ru: 'Две штуки, по два ящика.',
        },
        image: U('photo-1631049307264-da0ec9d70304', 600),
        price: 290,
      },
    ],
  },
};

export function createDefaultStore(): SiteStore {
  return {
    categories: defaultCategories,
    products: defaultProducts,
    contact: defaultContact,
    calculator: defaultCalculator,
    leads: [],
  };
}
