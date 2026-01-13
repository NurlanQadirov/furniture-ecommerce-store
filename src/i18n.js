import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false, 
    fallbackLng: 'az',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      az: {
        translation: {
          // Header
          home: 'Əsas Səhifə',
          products: 'Məhsullar',
          about: 'Haqqımızda',
          contact: 'Əlaqə',

          // Hero Slider
          hero_slide1_title: 'Evinizin Rahatlığı',
          hero_slide1_desc: 'Hər zövqə uyğun, keyfiyyətli və müasir mebel modelləri ilə tanış olun.',
          hero_slide2_title: 'Mükəmməl Dizayn',
          hero_slide2_desc: 'İnteryerinizə uyğun ən son trendləri kəşf edin.',
          hero_slide3_title: 'Keyfiyyət və Zəmanət',
          hero_slide3_desc: 'Uzunömürlü materiallar və rəsmi zəmanətlə tam arxayın olun.',
          goToCatalog: 'Kataloqa Keçid',

          // Home Page
          whyMebeltech_title: 'Niyə Mebeltech?',
          whyMebeltech_desc: 'Biz sadəcə mebel satmırıq, biz sizin evinizə rahatlıq və gözəllik gətiririk. Keyfiyyət, etibar və müasir dizayn bizim əsas prinsiplərimizdir.',
          quality_title: 'Yüksək Keyfiyyət',
          quality_desc: 'Avropa standartlarına uyğun, uzunömürlü və davamlı materiallar.',
          delivery_title: 'Sürətli Çatdırılma',
          delivery_desc: 'Sifarişlərinizi Bakı şəhəri daxilində qısa müddətdə ünvanınıza çatdırırıq.',
          warranty_title: 'Rəsmi Zəmanət',
          warranty_desc: 'Bütün məhsullarımıza rəsmi zəmanət verərək keyfiyyətimizə arxayın olmanızı təmin edirik.',
          catalog_picks_title: 'Kataloqdan Seçmələr',
          philosophy_title: 'Bizim Fəlsəfəmiz',
          philosophy_desc: 'Hər bir detalda mükəmməlliyə can atırıq. Dizayndan istehsala qədər olan hər mərhələdə müştəri məmnuniyyətini əsas tutaraq, evinizə sadəcə bir əşya deyil, illərlə sizinlə olacaq bir dəyər qatırıq.',
          about_us_more: 'Haqqımızda Daha Ətraflı',
          weekly_offer_title: 'Həftənin Təklifi',
          details: 'Ətraflı',
          next: 'Növbəti',
          
          // Products Page
          all_products_title: 'Bütün Məhsullar',
          all_products_subtitle: 'Eviniz üçün ən son modellər',

          // Product Detail Page
          back_to_products: 'Bütün Məhsullara Geri Dön',
          add_to_cart: 'Səbətə Əlavə Et',
          product_not_found: 'Məhsul tapılmadı.',

          // About Page
          about_page_title: 'Biz Kimik?',
          about_page_subtitle: 'Məqsədimiz sadəcə mebel satmaq deyil, evinizə və ofisinizə rahatlıq, funksionallıq və gözəllik gətirən həllər təqdim etməkdir.',
          our_story_title: 'Bizim Hekayəmiz',
          our_story_p1: '**Mebeltech** olaraq 2015-ci ildən fəaliyyət göstəririk. Bizim üçün hər bir müştəri dəyərlidir və onların məmnuniyyəti bizim əsas prioritetimizdir.',
          our_story_p2: 'Komandamız peşəkar dizaynerlər, sənətkarlar və satış mütəxəssislərindən ibarətdir. Hər bir məhsulun dizaynından tutmuş istehsalına qədər olan bütün proseslərə ciddi nəzarət edir, yalnız ən keyfiyyətli və ekoloji təmiz materiallardan istifadə edirik.',
          contact_us: 'Bizimlə Əlaqə',

          // Contact Page
          contact_page_title: 'Bizimlə Əlaqə',
          contact_page_subtitle: 'Sizi məmnuniyyətlə mağazamızda gözləyirik!',
          our_address: 'Ünvanımız',
          phone_label: 'Telefon',
          email_label: 'Email',
          
          // Footer
          footer_desc: 'Evinizə və ofisinizə rahatlıq, funksionallıq və gözəllik gətirən müasir mebel həlləri.',
          footer_menu: 'Menyu',
          footer_contact_info: 'Əlaqə Məlumatları',
          footer_address_label: 'Ünvan:',
          footer_address_value: 'Bakı, Nizami küç. 123',
          footer_phone_value: '+994 50 123 45 67',
          footer_email_value: 'info@mebeltech.az',
          footer_copyright: '© {{year}} Mebeltech. Bütün hüquqlar qorunur.',
          // 
          product1_title: "Cincinnati",
          product1_desc: "Fərqli hündürlüklərdə və formalarda olan Floema alçaq masalarının dörd versiyası, işdən tutmuş istirahət anlarına qədər müxtəlif ehtiyacları və istifadələri qarşılamaq üçün müxtəlif səthlər təklif edir.",
          product2_title: "Daytona",
          product2_desc: "Wendelbo-dan Circle Coffee masası, sanki vizual bir hiyləni təqlid edir. Kütlə və cazibə qüvvəsinin dayandırıldığı bir çərçivə və nazik, zərif quruluş, havada asılı bir platforma kimi mərmər üstü dəstəkləyir.",
          product3_title: "Indiana",
          product3_desc: "Eyni zamanda yüngül və zərif görünüşü ilə Workshop Qəhvə Masası hər hansı bir qonaq otağına mükəmməl uyğunlaşır, həm ənənəvi qəhvə masası, həm də yan masa kimi xidmət edir.",
          product4_title: "Amarillo",
          product4_desc: "Davamlı şəkildə əldə edilmiş bərk Amerika palıdından hazırlanan Duo Masası, bir tərəfdən bir-birinə birləşdirilmiş iki ayrı üst hissədən ibarətdir. Üst hissələr bərkdir və yumşaq bir kənar yaratmaq üçün oyulmuşdur.",
        }
      },
      en: {
        translation: {
          // Header
          home: 'Home',
          products: 'Products',
          about: 'About Us',
          contact: 'Contact',

          // Hero Slider
          hero_slide1_title: 'Comfort for Your Home',
          hero_slide1_desc: 'Discover quality and modern furniture models for every taste.',
          hero_slide2_title: 'Perfect Design',
          hero_slide2_desc: 'Explore the latest trends that match your interior.',
          hero_slide3_title: 'Quality and Warranty',
          hero_slide3_desc: 'Be completely confident with durable materials and an official warranty.',
          goToCatalog: 'Go to Catalog',

          // Home Page
          whyMebeltech_title: 'Why Mebeltech?',
          whyMebeltech_desc: 'We don\'t just sell furniture; we bring comfort and beauty to your home. Quality, reliability, and modern design are our core principles.',
          quality_title: 'High Quality',
          quality_desc: 'Long-lasting and durable materials compliant with European standards.',
          delivery_title: 'Fast Delivery',
          delivery_desc: 'We deliver your orders within Baku city in a short time.',
          warranty_title: 'Official Warranty',
          warranty_desc: 'We provide an official warranty for all our products, ensuring you can trust our quality.',
          catalog_picks_title: 'Picks from the Catalog',
          philosophy_title: 'Our Philosophy',
          philosophy_desc: 'We strive for perfection in every detail. From design to production, we prioritize customer satisfaction, adding not just an item to your home, but a value that will be with you for years.',
          about_us_more: 'More About Us',
          weekly_offer_title: 'Offer of the Week',
          details: 'Details',
          next: 'Next',
          
          // Products Page
          all_products_title: 'All Products',
          all_products_subtitle: 'The latest models for your home',

          // Product Detail Page
          back_to_products: 'Back to All Products',
          add_to_cart: 'Add to Cart',
          product_not_found: 'Product not found.',

          // About Page
          about_page_title: 'Who Are We?',
          about_page_subtitle: 'Our goal is not just to sell furniture, but to offer solutions that bring comfort, functionality, and beauty to your home and office.',
          our_story_title: 'Our Story',
          our_story_p1: 'As **Mebeltech**, we have been operating since 2015. Every customer is valuable to us, and their satisfaction is our main priority.',
          our_story_p2: 'Our team consists of professional designers, craftsmen, and sales specialists. We strictly control all processes from design to production, using only the highest quality and eco-friendly materials.',
          contact_us: 'Contact Us',

          // Contact Page
          contact_page_title: 'Contact Us',
          contact_page_subtitle: 'We are pleased to welcome you in our store!',
          our_address: 'Our Address',
          phone_label: 'Phone',
          email_label: 'Email',

          // Footer
          footer_desc: 'Modern furniture solutions that bring comfort, functionality, and beauty to your home and office.',
          footer_menu: 'Menu',
          footer_contact_info: 'Contact Information',
          footer_address_label: 'Address:',
          footer_address_value: 'Baku, Nizami st. 123',
          footer_phone_value: '+994 50 123 45 67',
          footer_email_value: 'info@mebeltech.az',
          footer_copyright: '© {{year}} Mebeltech. All rights reserved.',
          // 
          product1_title: "Cincinnati",
          product1_desc: "In different heights and shapes, the four versions of Floema low tables offer a variety of surfaces to satisfy different needs and uses in a contract environment, from work to moments of relaxation.",
          product2_title: "Daytona",
          product2_desc: "The Circle Coffee table from Wendelbo emulates almost a visual trick. A frame where mass and gravity is suspended, and the slim and delicate structure support the marble top, like a hovering platform.",
          product3_title: "Indiana",
          product3_desc: "With an appearance that is at once light and elegant, the Workshop Coffee Table fits perfectly into any living room, serving as a traditional coffee table as well as side table.",
          product4_title: "Amarillo",
          product4_desc: "Made from sustainably sourced solid American Oak, the Duo Table is composed of two seperate tops joined together on one side. The tops are solid and carved out to create a gentle lip.",
        }
      },
      ru: {
        translation: {
          // Header
          home: 'Главная',
          products: 'Продукты',
          about: 'О Нас',
          contact: 'Контакты',

          // Hero Slider
          hero_slide1_title: 'Уют для Вашего Дома',
          hero_slide1_desc: 'Откройте для себя качественные и современные модели мебели на любой вкус.',
          hero_slide2_title: 'Идеальный Дизайн',
          hero_slide2_desc: 'Изучите последние тенденции, соответствующие вашему интерьeru.',
          hero_slide3_title: 'Качество и Гарантия',
          hero_slide3_desc: 'Будьте полностью уверены с долговечными материалами и официальной гарантией.',
          goToCatalog: 'Перейти в каталог',

          // Home Page
          whyMebeltech_title: 'Почему Mebeltech?',
          whyMebeltech_desc: 'Мы не просто продаем мебель, мы приносим комфорт и красоту в ваш дом. Качество, надежность и современный дизайн – наши главные принципы.',
          quality_title: 'Высокое Качество',
          quality_desc: 'Долговечные и прочные материалы, соответствующие европейским стандартам.',
          delivery_title: 'Быстрая Доставка',
          delivery_desc: 'Мы доставляем ваши заказы по городу Баку в кратчайшие сроки.',
          warranty_title: 'Официальная Гарантия',
          warranty_desc: 'Мы предоставляем официальную гарантию на всю нашу продукцию, чтобы вы были уверены в нашем качестве.',
          catalog_picks_title: 'Выбор из Каталога',
          philosophy_title: 'Наша Философия',
          philosophy_desc: 'Мы стремимся к совершенству в каждой детали. От дизайна до производства мы ставим во главу угла удовлетворенность клиентов, добавляя в ваш дом не просто предмет, а ценность, которая будет с вами долгие годы.',
          about_us_more: 'Подробнее о нас',
          weekly_offer_title: 'Предложение Недели',
          details: 'Подробнее',
          next: 'Далее',

          // Products Page
          all_products_title: 'Все Продукты',
          all_products_subtitle: 'Самые последние модели для вашего дома',

          // Product Detail Page
          back_to_products: 'Назад ко всем продуктам',
          add_to_cart: 'Добавить в корзину',
          product_not_found: 'Продукт не найден.',

          // About Page
          about_page_title: 'Кто Мы?',
          about_page_subtitle: 'Наша цель — не просто продавать мебель, а предлагать решения, которые приносят комфорт, функциональность и красоту в ваш дом и офис.',
          our_story_title: 'Наша История',
          our_story_p1: 'Как **Mebeltech**, мы работаем с 2015 года. Каждый клиент для нас ценен, и их удовлетворение — наш главный приоритет.',
          our_story_p2: 'Наша команда состоит из профессиональных дизайнеров, мастеров и специалистов по продажам. Мы строго контролируем все процессы от дизайна до производства, используя только самые качественные и экологически чистые материалы.',
          contact_us: 'Связаться с нами',
          
          // Contact Page
          contact_page_title: 'Свяжитесь с Нами',
          contact_page_subtitle: 'Мы рады приветствовать вас в нашем магазине!',
          our_address: 'Наш Адрес',
          phone_label: 'Телефон',
          email_label: 'Email',

          // Footer
          footer_desc: 'Современные мебельные решения, которые приносят комфорт, функциональность и красоту в ваш дом и офис.',
          footer_menu: 'Меню',
          footer_contact_info: 'Контактная информация',
          footer_address_label: 'Адрес:',
          footer_address_value: 'Баку, ул. Низами 123',
          footer_phone_value: '+994 50 123 45 67',
          footer_email_value: 'info@mebeltech.az',
          footer_copyright: '© {{year}} Mebeltech. Все права защищены.',
          // 
          product1_title: "Цинциннати",
          product1_desc: "Четыре версии низких столиков Floema, различающиеся по высоте и форме, предлагают разнообразие поверхностей для удовлетворения различных потребностей и использования в контрактной среде, от работы до моментов отдыха.",
          product2_title: "Дайтона",
          product2_desc: "Кофейный столик Circle от Wendelbo имитирует почти визуальный трюк. Рама, в которой масса и гравитация как бы подвешены, а тонкая и изящная структура поддерживает мраморную столешницу, словно парящую платформу.",
          product3_title: "Индиана",
          product3_desc: "Обладая одновременно легким и элегантным видом, кофейный столик Workshop идеально вписывается в любую гостиную, служа как традиционным кофейным столиком, так и приставным.",
          product4_title: "Амарилло",
          product4_desc: "Изготовленный из экологически чистого массива американского дуба, стол Duo состоит из двух отдельных столешниц, соединенных с одной стороны. Столешницы цельные и вырезаны так, чтобы создать мягкий изгиб.",
        }
      }
    }
  });

export default i18n;