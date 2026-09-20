import type { Metadata } from 'next';
import CategoriesGrid from '@/components/products/CategoriesGrid';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import {
  breadcrumbNode,
  categoryListNode,
  graph,
  webPageNode,
} from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { nodeId } from '@/lib/seo/site';
import { getCategories, getProducts } from '@/lib/store/server';

export async function generateMetadata(): Promise<Metadata> {
  const [{ language, t, loc }, categories] = await Promise.all([
    getSchemaContext(),
    getCategories(),
  ]);

  // The category names are the page's real keywords: "Mətbəx mebeli, Qarderob
  // və şkaflar…" is what somebody actually types, and it is admin-managed
  // rather than a fixed list a new category would fall out of.
  const names = categories.map((category) => loc(category.name)).join(', ');

  return pageMetadata({
    path: '/products',
    title: t('seo_products_title'),
    description: names
      ? `${t('seo_products_description')} ${names}.`
      : t('seo_products_description'),
    images: categories.slice(0, 4).map((category) => category.image),
    language,
    t,
  });
}

export default async function ProductsPage() {
  const [categories, products, schema] = await Promise.all([
    getCategories(),
    getProducts(),
    getSchemaContext(),
  ]);

  const counts = products.reduce<Record<string, number>>((totals, product) => {
    totals[product.categoryId] = (totals[product.categoryId] ?? 0) + 1;
    return totals;
  }, {});

  const pageGraph = graph([
    webPageNode(schema, {
      type: 'CollectionPage',
      path: '/products',
      name: schema.t('categories_title'),
      description: schema.t('seo_products_description'),
      mainEntity: nodeId('/products', 'itemlist'),
      hasBreadcrumb: true,
    }),
    breadcrumbNode(
      schema,
      [
        { name: schema.t('home'), path: '/' },
        { name: schema.t('categories_title'), path: '/products' },
      ],
      '/products',
    ),
    categoryListNode(schema, categories, counts),
  ]);

  return (
    <>
      <JsonLd id="mebeltech-categories" data={pageGraph} />
      <CategoriesGrid categories={categories} counts={counts} />
    </>
  );
}
