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

  return pageMetadata({
    path: `/products/${category.slug}`,
    title: t('seo_category_title', { name }),
    // The description carries the category's own copy plus the model names
    // inside it, so the snippet answers "which wardrobes do they make?".
    description: [
      t('seo_category_description', { name, description: loc(category.description) }),
      products.length > 0
        ? products.slice(0, 4).map((product) => loc(product.name)).join(', ')
        : '',
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
