import ProductDetail from '@/components/products/ProductDetail';
import { getProductById, productsData } from '@/data/products';

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

/** Pre-renders every catalogue entry at build time. */
export function generateStaticParams(): Array<{ productId: string }> {
  return productsData.map((product) => ({ productId: String(product.id) }));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const product = getProductById(Number.parseInt(productId, 10));

  return <ProductDetail product={product} />;
}
