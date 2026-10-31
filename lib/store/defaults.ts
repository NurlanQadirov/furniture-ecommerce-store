import type { Category, ContactInfo, Product } from '@/types';
import type { SiteStore } from '@/lib/store/schema';

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
  email: 'info@bakumebel.az',
  address: {
    az: 'Bakı, Nizami küç. 123',
    en: 'Baku, Nizami str. 123',
    ru: 'Баку, ул. Низами 123',
  },
  instagram: 'https://instagram.com/mebeltech',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.748348274363!2d49.85175631539423!3d40.36987327940175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d079efb5163%3A0xc202bfd8e906324!2sNizami%20St%2C%20Baku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1673883343343!5m2!1sen!2s',
};

export function createDefaultStore(): SiteStore {
  return {
    // Seeding is the moment the content comes into being.
    contentModifiedAt: new Date().toISOString(),
    categories: defaultCategories,
    products: defaultProducts,
    contact: defaultContact,
  };
}
