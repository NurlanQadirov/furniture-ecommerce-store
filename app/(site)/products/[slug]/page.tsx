import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryProducts from '@/components/products/CategoryProducts';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import {
  breadcrumbNode,
  graph,
  productListNode,
  webPageNode,
} from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { nodeId } from '@/lib/seo/site';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/store/server';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [category, { language, t, loc }] = await Promise.all([
    getCategoryBySlug(slug),
    getSchemaContext(),
  ]);

  // A slug nobody owns renders `notFound()`; the tab should not advertise it.
  if (!category) {
    return { title: t('product_not_found'), robots: { index: false, follow: false } };
  }

  const name = loc(category.name);
  const products = await getProductsByCategory(category.id);
  const prices = products
    .map((product) => product.price)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  return pageMetadata({
    path: `/products/${category.slug}`,
    title: t('seo_category_title', { name }),
    // Facts first, in the order a searcher asks them — what, where, from how
    // much, which models — then the category's own copy. The snippet is cut at
    // 160 characters, and the model names used to sit after that cut.
    description: [
      t('seo_category_description', { name }),
      prices.length > 0 ? t('seo_price_from', { price: Math.min(...prices) }) : '',
      products.length > 0
        ? t('seo_category_models', {
            models: products.slice(0, 4).map((product) => loc(product.name)).join(', '),
          })
        : '',
      loc(category.description),
      t('seo_service_promise'),
    ]
      .filter(Boolean)
      .join(' '),
    images: [category.image, ...products.slice(0, 3).map((product) => product.mainImage)],
    keywords: [
      name,
      ...products.slice(0, 6).map((product) => loc(product.name)),
      ...t('seo_keywords').split(',').map((word) => word.trim()),
    ],
    language,
    t,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, schema] = await Promise.all([
    getProductsByCategory(category.id),
    getSchemaContext(),
  ]);

  const path = `/products/${category.slug}`;
  const name = schema.loc(category.name);

  const pageGraph = graph([
    webPageNode(schema, {
      type: 'CollectionPage',
      path,
      name,
      description: schema.loc(category.description),
      image: category.image,
      mainEntity: nodeId(path, 'itemlist'),
      hasBreadcrumb: true,
      parentPath: '/products',
    }),
    breadcrumbNode(
      schema,
      [
        { name: schema.t('home'), path: '/' },
        { name: schema.t('categories_title'), path: '/products' },
        { name, path },
      ],
      path,
    ),
    productListNode(schema, products, path, name),
  ]);

  return (
    <>
      <JsonLd id="mebeltech-category" data={pageGraph} />
      <CategoryProducts category={category} products={products} />
    </>
  );
}
