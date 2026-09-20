import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import {
  breadcrumbNode,
  graph,
  productId as productSchemaId,
  productNode,
  webPageNode,
} from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import {
  getCategories,
  getProductById,
  getProductsByCategory,
} from '@/lib/store/server';

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { productId } = await params;
  const [product, categories, { language, t, loc }] = await Promise.all([
    getProductById(productId),
    getCategories(),
    getSchemaContext(),
  ]);

  if (!product) {
    return { title: t('product_not_found'), robots: { index: false, follow: false } };
  }

  const category = categories.find((item) => item.id === product.categoryId);
  const name = loc(product.name);
  const categoryName = category ? loc(category.name) : t('products');

  return pageMetadata({
    path: `/product/${product.id}`,
    title: t('seo_product_title', { name, category: categoryName }),
    // Price first when there is one: it is the single fact most likely to win
    // the click, and the one an answer engine quotes back.
    description: [
      typeof product.price === 'number'
        ? t('seo_product_price_note', { price: product.price })
        : '',
      t('seo_product_description', { name, description: loc(product.description) }),
    ]
      .filter(Boolean)
      .join(' '),
    images: [product.mainImage, ...product.images],
    type: 'article',
    publishedTime: product.createdAt,
    keywords: [
      name,
      categoryName,
      ...t('seo_keywords').split(',').map((word) => word.trim()),
    ],
    language,
    t,
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);
  if (!product) notFound();

  const [categories, schema] = await Promise.all([getCategories(), getSchemaContext()]);
  const category = categories.find((item) => item.id === product.categoryId);

  const related = (await getProductsByCategory(product.categoryId))
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const path = `/product/${product.id}`;
  const name = schema.loc(product.name);

  const pageGraph = graph([
    webPageNode(schema, {
      type: 'ItemPage',
      path,
      name,
      description: schema.loc(product.description),
      image: product.mainImage,
      mainEntity: productSchemaId(product),
      hasBreadcrumb: true,
    }),
    breadcrumbNode(
      schema,
      [
        { name: schema.t('home'), path: '/' },
        { name: schema.t('categories_title'), path: '/products' },
        ...(category
          ? [{ name: schema.loc(category.name), path: `/products/${category.slug}` }]
          : []),
        { name, path },
      ],
      path,
    ),
    productNode(schema, product, category),
  ]);

  return (
    <>
      <JsonLd id="mebeltech-product" data={pageGraph} />
      <ProductDetail product={product} category={category} related={related} />
    </>
  );
}
