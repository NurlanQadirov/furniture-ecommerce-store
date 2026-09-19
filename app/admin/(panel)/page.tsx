import Link from 'next/link';
import {
  CubeIcon,
  RectangleGroupIcon,
  StarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import { getCategories, getLeads, getProducts } from '@/lib/store/server';

interface Tile {
  href: string;
  label: string;
  value: number;
  icon: typeof CubeIcon;
}

export default async function AdminDashboardPage() {
  const [products, categories, leads] = await Promise.all([
    getProducts(),
    getCategories(),
    getLeads(),
  ]);

  const tiles: Tile[] = [
    { href: '/admin/products', label: 'Məhsul', value: products.length, icon: CubeIcon },
    {
      href: '/admin/categories',
      label: 'Kateqoriya',
      value: categories.length,
      icon: RectangleGroupIcon,
    },
    {
      href: '/admin/products',
      label: 'Əsas səhifədə',
      value: products.filter((product) => product.featured).length,
      icon: StarIcon,
    },
    { href: '/admin/leads', label: 'Ölçü sorğusu', value: leads.length, icon: UserGroupIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">İcmal</h1>
        <p className="text-sm text-gray-500">Saytın məzmununu buradan idarə edin.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-dark-green transition-colors"
            >
              <Icon className="h-6 w-6 text-dark-green" />
              <p className="mt-3 text-3xl font-bold tabular-nums">{tile.value}</p>
              <p className="text-xs text-gray-500">{tile.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
