import ProductsManager from '@/components/admin/ProductsManager';
import { getCategories, getProducts } from '@/lib/store/server';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return <ProductsManager products={products} categories={categories} />;
}
