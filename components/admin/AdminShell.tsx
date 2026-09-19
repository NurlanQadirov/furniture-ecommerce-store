'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  CalculatorIcon,
  CubeIcon,
  PhoneIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

interface NavLink {
  href: string;
  label: string;
  icon: typeof CubeIcon;
}

const links: NavLink[] = [
  { href: '/admin', label: 'İcmal', icon: Squares2X2Icon },
  { href: '/admin/products', label: 'Məhsullar', icon: CubeIcon },
  { href: '/admin/categories', label: 'Kateqoriyalar', icon: RectangleGroupIcon },
  { href: '/admin/calculator', label: 'Kalkulyator', icon: CalculatorIcon },
  { href: '/admin/contact', label: 'Əlaqə məlumatları', icon: PhoneIcon },
  { href: '/admin/leads', label: 'Ölçü sorğuları', icon: UserGroupIcon },
];

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const navigation = (
    <nav className="flex-1 space-y-1">
      {links.map((link) => {
        const active =
          link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${
              active
                ? 'bg-dark-green text-white'
                : 'text-gray-600 hover:bg-custom-green hover:text-dark-green'
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-1 border-t border-gray-100 pt-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100"
      >
        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
        Sayta bax
      </Link>
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Çıxış
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-gray-200 px-4 h-16">
        <Image src="/Logo2.png" alt="Mebeltech" width={200} height={200} className="h-9 w-auto" />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Menyu"
          aria-expanded={menuOpen}
          className="-mr-3 p-3 touch-manipulation"
        >
          <Bars3Icon className="h-7 w-7 text-custom-black" />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-white p-6">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Bağla"
            className="self-end -mr-3 mb-6 p-3 touch-manipulation"
          >
            <XMarkIcon className="h-8 w-8 text-custom-black" />
          </button>
          {navigation}
          {footer}
        </div>
      )}

      <div className="flex">
        <aside className="hidden lg:flex w-64 flex-col gap-4 border-r border-gray-200 bg-white p-4 min-h-screen sticky top-0">
          <Link href="/admin" className="px-2 py-3">
            <Image
              src="/Logo2.png"
              alt="Mebeltech"
              width={300}
              height={300}
              className="h-10 w-auto"
            />
            <span className="mt-2 block text-[11px] uppercase tracking-widest text-gray-400">
              İdarə paneli
            </span>
          </Link>
          {navigation}
          {footer}
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
