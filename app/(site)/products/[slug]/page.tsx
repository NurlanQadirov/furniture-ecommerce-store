import { notFound } from 'next/navigation';
import CategoryProducts from '@/components/products/CategoryProducts';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/store/server';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return <CategoryProducts category={category} products={products} />;
}
