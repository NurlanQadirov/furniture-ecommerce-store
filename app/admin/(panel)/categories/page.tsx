import CategoriesManager from '@/components/admin/CategoriesManager';
import { getCategories, getProducts } from '@/lib/store/server';

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const counts = products.reduce<Record<string, number>>((totals, product) => {
    totals[product.categoryId] = (totals[product.categoryId] ?? 0) + 1;
    return totals;
  }, {});

  return <CategoriesManager categories={categories} counts={counts} />;
}
