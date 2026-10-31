import {
  SITE_NAME,
  SITE_URL,
  absoluteImageUrl,
  absoluteUrl,
  defaultOgImage,
  localizedUrl,
  nodeId,
} from '@/lib/seo/site';
import { supportedLanguages } from '@/lib/i18n/languages';
import type { Translator } from '@/lib/i18n/translate';
import type { Category, ContactInfo, Language, Localized, Product } from '@/types';

/**
 * Every schema.org node the site emits.
 *
 * The nodes are written into one `@graph` per page and joined by `@id`, so a
 * parser — Google's or an answer engine's — resolves "who sells this product"
 * to the same organisation it read on the home page, rather than to three
 * unrelated copies of a name. The stable ids are:
 *
 *   #organization   the business as a legal/brand entity — products point here
 *   #localbusiness  the Baku storefront: address, geo, service area
 *   #website        the site itself, publisher → #organization
 *   #service        made-to-measure work, offering the catalogue
 *
 * Nothing here invents a fact. Opening hours, ratings and reviews are absent
 * because the store holds none, and fabricated ones are both a Google
 * structured-data violation and exactly the kind of claim an answer engine
 * would repeat.
 */

export type JsonLdNode = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;
export const SERVICE_ID = `${SITE_URL}/#service`;
const CATALOG_ID = nodeId('/products', 'catalog');

/** A reference to another node in the graph. */
const ref = (id: string) => ({ '@id': id });

const cityNames: Record<Language, string> = { az: 'Bakı', en: 'Baku', ru: 'Баку' };

const countryNames: Record<Language, string> = {
  az: 'Azərbaycan',
  en: 'Azerbaijan',
  ru: 'Азербайджан',
};

const languageNames: Record<Language, string> = {
  az: 'Azerbaijani',
  en: 'English',
  ru: 'Russian',
};

/** Context every builder needs: the active language and the admin-managed data. */
export interface SchemaContext {
  language: Language;
  t: Translator;
  loc: (value: Localized | undefined) => string;
  contact: ContactInfo;
}

/* ------------------------------------------------------------------ helpers */

/** `+994 50 123 45 67` → `+994501234567`, the form schema.org expects. */
function telephone(raw: string): string | undefined {
  const digits = raw.replace(/[^\d]/g, '');
  return digits ? `+${digits}` : undefined;
}

/**
 * "Bakı, Nizami küç. 123" → locality + street.
 *
 * The panel stores one free-text line per language, so the first comma is the
 * only structure there is. A single-segment address stays whole as the street.
 */
function postalAddress(context: SchemaContext): JsonLdNode {
  const full = context.loc(context.contact.address).trim();
  const parts = full.split(',').map((part) => part.trim()).filter(Boolean);

  const locality = parts.length > 1 ? parts[0] : cityNames[context.language];

  return {
    '@type': 'PostalAddress',
    streetAddress: parts.length > 1 ? parts.slice(1).join(', ') : full,
    addressLocality: locality,
    // Baku is a city with republic status, so locality and region are the same
    // string; repeating it adds nothing a parser can use.
    addressRegion: locality === cityNames[context.language] ? undefined : cityNames[context.language],
    addressCountry: 'AZ',
  };
}

/** The Google Maps embed the owner pasted carries `!2d<lng>!3d<lat>`. */
function geoCoordinates(mapEmbedUrl: string): JsonLdNode | undefined {
  const longitude = mapEmbedUrl.match(/!2d(-?\d+(?:\.\d+)?)/)?.[1];
  const latitude = mapEmbedUrl.match(/!3d(-?\d+(?:\.\d+)?)/)?.[1];
  if (!latitude || !longitude) return undefined;

  return {
    '@type': 'GeoCoordinates',
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}

/**
 * A map page a person or an agent can open. The embed URL itself only renders
 * inside an iframe, so it is no use as `hasMap`.
 */
function mapUrl(geo: JsonLdNode | undefined): string | undefined {
  if (!geo) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${geo.latitude},${geo.longitude}`;
}

/** Where the workshop delivers and installs — Baku, inside Azerbaijan. */
function areaServed(language: Language): JsonLdNode[] {
  return [
    {
      '@type': 'City',
      name: cityNames[language],
      // The other two spellings only: a name repeated as its own alternate is
      // noise a reconciler has to throw away.
      alternateName: supportedLanguages
        .filter((code) => code !== language)
        .map((code) => cityNames[code]),
      containedInPlace: { '@type': 'Country', name: countryNames[language] },
    },
    { '@type': 'Country', name: countryNames[language], alternateName: 'AZ' },
  ];
}

/** The public profiles a knowledge panel can reconcile the business against. */
function sameAs(contact: ContactInfo): string[] | undefined {
  const profiles = [contact.instagram].filter(
    (value): value is string => Boolean(value?.trim()),
  );
  return profiles.length > 0 ? profiles : undefined;
}

function knowsLanguage(): JsonLdNode[] {
  return supportedLanguages.map((code) => ({
    '@type': 'Language',
    name: languageNames[code],
    alternateName: code,
  }));
}

/** A real price band read off the catalogue, never a guessed row of currency signs. */
function priceRange(products: Product[]): string | undefined {
  const prices = products
    .map((product) => product.price)
    .filter((price): price is number => typeof price === 'number' && price > 0);
  if (prices.length === 0) return undefined;

  return `${Math.min(...prices)}–${Math.max(...prices)} AZN`;
}

/* ------------------------------------------------------------- core entities */

export function organizationNode(
  context: SchemaContext,
  categories: Category[] = [],
): JsonLdNode {
  const { contact, language, t } = context;

  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: ['Mebel Tech', 'Мебельтех', `${SITE_NAME} ${countryNames[language]}`],
    // No `legalName` or `slogan`: the store holds neither, and the brand name
    // or a section heading passed off as one is a claim an answer engine repeats.
    url: localizedUrl('/', language),
    description: t('footer_desc'),
    // Stated in the About copy in all three languages.
    foundingDate: '2015',
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: absoluteUrl('/bakumebel-logo.png'),
      contentUrl: absoluteUrl('/bakumebel-logo.png'),
      caption: SITE_NAME,
    },
    image: ref(LOGO_ID),
    email: contact.email || undefined,
    telephone: telephone(contact.phone),
    address: postalAddress(context),
    areaServed: areaServed(language),
    knowsLanguage: knowsLanguage(),
    knowsAbout: categories.map((category) => context.loc(category.name)),
    sameAs: sameAs(contact),
    contactPoint: contactPointNodes(context),
    hasOfferCatalog: categories.length > 0 ? ref(CATALOG_ID) : undefined,
    subOrganization: ref(LOCAL_BUSINESS_ID),
  };
}

function contactPointNodes(context: SchemaContext): JsonLdNode[] {
  const { contact, language, t } = context;
  const availableLanguage = supportedLanguages.map((code) => languageNames[code]);
  const points: JsonLdNode[] = [];

  const phone = telephone(contact.phone);
  if (phone) {
    points.push({
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: phone,
      email: contact.email || undefined,
      areaServed: 'AZ',
      availableLanguage,
      name: t('contact_us'),
    });
  }

  const whatsapp = telephone(contact.whatsapp);
  if (whatsapp) {
    points.push({
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: whatsapp,
      url: `https://wa.me/${whatsapp.replace('+', '')}`,
      areaServed: 'AZ',
      availableLanguage,
      name: t('write_whatsapp'),
    });
  }

  return points.length > 0 ? points : [{ '@type': 'ContactPoint', availableLanguage }];
}

/**
 * The storefront. `FurnitureStore` is a `LocalBusiness`, which is the type a
 * map pack and a "furniture shop near me" answer both key off.
 */
export function localBusinessNode(
  context: SchemaContext,
  products: Product[] = [],
): JsonLdNode {
  const { contact, language, t } = context;
  const geo = geoCoordinates(contact.mapEmbedUrl);

  return {
    '@type': ['FurnitureStore', 'HomeAndConstructionBusiness'],
    '@id': LOCAL_BUSINESS_ID,
    name: SITE_NAME,
    alternateName: ['Mebel Tech', 'Мебельтех'],
    description: t('footer_desc'),
    url: localizedUrl('/', language),
    image: [absoluteUrl('/bakumebel-logo.png'), defaultOgImage],
    logo: ref(LOGO_ID),
    email: contact.email || undefined,
    telephone: telephone(contact.phone),
    address: postalAddress(context),
    geo,
    hasMap: mapUrl(geo),
    areaServed: areaServed(language),
    currenciesAccepted: 'AZN',
    priceRange: priceRange(products),
    knowsLanguage: knowsLanguage(),
    sameAs: sameAs(contact),
    parentOrganization: ref(ORGANIZATION_ID),
  };
}

export function webSiteNode(context: SchemaContext): JsonLdNode {
  const { language, t } = context;

  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    alternateName: 'bakumebel.az',
    url: localizedUrl('/', language),
    description: t('footer_desc'),
    inLanguage: supportedLanguages,
    publisher: ref(ORGANIZATION_ID),
    copyrightHolder: ref(ORGANIZATION_ID),
  };
}


/**
 * What the workshop actually does, as opposed to what it lists. This is the
 * node an answer engine reads to decide whether "custom kitchen in Baku"
 * describes this business.
 */
export function serviceNode(context: SchemaContext, categories: Category[]): JsonLdNode {
  const { language, t } = context;

  return {
    '@type': 'Service',
    '@id': SERVICE_ID,
    name: t('schema_service_name'),
    serviceType: categories.map((category) => context.loc(category.name)),
    description: t('seo_home_description'),
    url: localizedUrl('/', language),
    provider: ref(ORGANIZATION_ID),
    areaServed: areaServed(language),
    hasOfferCatalog: categories.length > 0 ? ref(CATALOG_ID) : undefined,
  };
}

/**
 * The catalogue as a nested offer catalogue, one branch per category, each
 * branch naming the products in it. That makes the relation readable in both
 * directions from any page: a product says who makes it, and the organisation
 * says what it makes.
 */
export function offerCatalogNode(
  context: SchemaContext,
  categories: Category[],
  counts: Record<string, number> = {},
  products: Product[] = [],
): JsonLdNode {
  const { language, loc, t } = context;

  return {
    '@type': 'OfferCatalog',
    '@id': CATALOG_ID,
    name: t('categories_title'),
    description: t('categories_subtitle'),
    url: localizedUrl('/products', language),
    numberOfItems: categories.length,
    itemListElement: categories.map((category) => ({
      '@type': 'OfferCatalog',
      '@id': nodeId(`/products/${category.slug}`, 'catalog'),
      name: loc(category.name),
      description: loc(category.description),
      url: localizedUrl(`/products/${category.slug}`, language),
      image: absoluteImageUrl(category.image),
      numberOfItems: counts[category.id] ?? undefined,
      itemListElement: products
        .filter((product) => product.categoryId === category.id)
        .map((product) => ({
          '@type': 'Offer',
          itemOffered: productStub(context, product),
          ...priceFields(product),
          seller: ref(ORGANIZATION_ID),
        })),
    })),
  };
}

/* --------------------------------------------------------------- page nodes */

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export function breadcrumbNode(
  context: SchemaContext,
  entries: BreadcrumbEntry[],
  pagePath: string,
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': nodeId(pagePath, 'breadcrumb'),
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: localizedUrl(entry.path, context.language),
    })),
  };
}

interface WebPageOptions {
  type?: 'WebPage' | 'CollectionPage' | 'ItemPage' | 'AboutPage' | 'ContactPage';
  path: string;
  name: string;
  description: string;
  image?: string;
  /** The `@id` of the thing this page is primarily about. */
  mainEntity?: string;
  hasBreadcrumb?: boolean;
  /** Route path of the page this one sits under — a product's category. */
  parentPath?: string;
  /** Only where the store records it; nothing here guesses a date. */
  datePublished?: string;
}

export function webPageNode(context: SchemaContext, options: WebPageOptions): JsonLdNode {
  const { language } = context;
  const url = localizedUrl(options.path, language);
  const image = absoluteImageUrl(options.image);

  return {
    '@type': options.type ?? 'WebPage',
    '@id': nodeId(options.path, 'webpage'),
    url,
    name: options.name,
    description: options.description,
    inLanguage: language,
    isPartOf: options.parentPath
      ? [ref(WEBSITE_ID), ref(nodeId(options.parentPath, 'webpage'))]
      : ref(WEBSITE_ID),
    // What the page is about is what it is mainly about; the organisation is
    // only the fallback, and it is the publisher of every page anyway.
    about: ref(options.mainEntity ?? ORGANIZATION_ID),
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: image } : undefined,
    mainEntity: options.mainEntity ? ref(options.mainEntity) : undefined,
    breadcrumb: options.hasBreadcrumb ? ref(nodeId(options.path, 'breadcrumb')) : undefined,
    datePublished: options.datePublished,
    publisher: ref(ORGANIZATION_ID),
    potentialAction: {
      '@type': 'ReadAction',
      target: supportedLanguages.map((code) => localizedUrl(options.path, code)),
    },
  };
}

/* ------------------------------------------------------------------ product */

export const productId = (product: Product) => nodeId(`/product/${product.id}`, 'product');

const productPath = (product: Product) => `/product/${product.id}`;

/** December 31st of next year — a horizon that never quietly expires mid-year. */
function priceValidUntil(): string {
  return `${new Date().getFullYear() + 1}-12-31`;
}

/**
 * Everything in the catalogue is built to the customer's measurements — the
 * catalogue copy says so in all three languages — so "in stock" would be the
 * one false thing in an otherwise factual offer.
 */
const MADE_TO_ORDER = 'https://schema.org/MadeToOrder';

/** Only quoted where the owner entered a price; a placeholder would be a false claim. */
function priceFields(product: Product): JsonLdNode {
  return typeof product.price === 'number'
    ? { price: product.price, priceCurrency: 'AZN', availability: MADE_TO_ORDER }
    : {};
}

/** A named, linkable reference to a product described in full on its own page. */
function productStub(context: SchemaContext, product: Product): JsonLdNode {
  return {
    '@type': 'Product',
    '@id': productId(product),
    name: context.loc(product.name),
    url: localizedUrl(productPath(product), context.language),
  };
}

export function productNode(
  context: SchemaContext,
  product: Product,
  category: Category | undefined,
  related: Product[] = [],
): JsonLdNode {
  const { language, loc, t } = context;
  const path = productPath(product);
  const images = [product.mainImage, ...product.images]
    .map(absoluteImageUrl)
    .filter((url): url is string => Boolean(url));

  return {
    '@type': 'Product',
    '@id': productId(product),
    name: loc(product.name),
    description: loc(product.description),
    image: images.length > 0 ? images : [defaultOgImage],
    url: localizedUrl(path, language),
    mainEntityOfPage: ref(nodeId(path, 'webpage')),
    sku: product.id,
    productID: product.id,
    category: category ? loc(category.name) : undefined,
    countryOfOrigin: { '@type': 'Country', name: countryNames[language] },
    // The seller is the brand here: everything in the catalogue is made in the
    // workshop, so both point at the one organisation node.
    brand: ref(ORGANIZATION_ID),
    manufacturer: ref(ORGANIZATION_ID),
    // The same models the page shows under "Picks from the catalogue".
    isRelatedTo:
      related.length > 0 ? related.map((item) => productStub(context, item)) : undefined,
    offers:
      typeof product.price === 'number'
        ? {
            '@type': 'Offer',
            '@id': nodeId(path, 'offer'),
            url: localizedUrl(path, language),
            ...priceFields(product),
            priceValidUntil: priceValidUntil(),
            itemCondition: 'https://schema.org/NewCondition',
            seller: ref(ORGANIZATION_ID),
            areaServed: areaServed(language),
            eligibleRegion: { '@type': 'Country', name: countryNames[language] },
          }
        : undefined,
    // Without a price the catalogue still says how to ask for one.
    potentialAction:
      typeof product.price === 'number'
        ? undefined
        : {
            '@type': 'CommunicateAction',
            name: t('request_price'),
            target: localizedUrl('/contact', language),
          },
  };
}

/** A category page: the products it holds, in the order the page shows them. */
export function productListNode(
  context: SchemaContext,
  products: Product[],
  path: string,
  name: string,
): JsonLdNode {
  const { language, loc } = context;

  return {
    '@type': 'ItemList',
    '@id': nodeId(path, 'itemlist'),
    name,
    numberOfItems: products.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: localizedUrl(productPath(product), language),
      item: {
        ...productStub(context, product),
        description: loc(product.description),
        image: absoluteImageUrl(product.mainImage) ?? defaultOgImage,
        sku: product.id,
        brand: ref(ORGANIZATION_ID),
        offers:
          typeof product.price === 'number'
            ? {
                '@type': 'Offer',
                ...priceFields(product),
                url: localizedUrl(productPath(product), language),
                seller: ref(ORGANIZATION_ID),
              }
            : undefined,
      },
    })),
  };
}

/** `/products`: the list of categories rather than of products. */
export function categoryListNode(
  context: SchemaContext,
  categories: Category[],
  counts: Record<string, number>,
): JsonLdNode {
  const { language, loc, t } = context;

  return {
    '@type': 'ItemList',
    '@id': nodeId('/products', 'itemlist'),
    name: t('categories_title'),
    description: t('categories_subtitle'),
    numberOfItems: categories.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: localizedUrl(`/products/${category.slug}`, language),
      name: loc(category.name),
      item: {
        '@type': 'CollectionPage',
        '@id': nodeId(`/products/${category.slug}`, 'webpage'),
        name: loc(category.name),
        description: loc(category.description),
        url: localizedUrl(`/products/${category.slug}`, language),
        image: absoluteImageUrl(category.image),
        about: ref(nodeId(`/products/${category.slug}`, 'catalog')),
        numberOfItems: counts[category.id] ?? 0,
      },
    })),
  };
}

/* --------------------------------------------------------------- the wrapper */

/** Wraps nodes as one linked graph — the form parsers resolve `@id` across. */
export function graph(nodes: (JsonLdNode | undefined)[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is JsonLdNode => Boolean(node)),
  };
}
