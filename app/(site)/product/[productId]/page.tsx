import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import {
  getCategories,
  getProductById,
  getProductsByCategory,
} from '@/lib/store/server';

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);
  if (!product) notFound();

  const categories = await getCategories();
  const category = categories.find((item) => item.id === product.categoryId);

  const related = (await getProductsByCategory(product.categoryId))
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return <ProductDetail product={product} category={category} related={related} />;
}
