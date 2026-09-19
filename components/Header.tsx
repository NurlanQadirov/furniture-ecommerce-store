'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { TranslationKey } from '@/lib/i18n/resources';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
}

const navItems: NavItem[] = [
  { href: '/', labelKey: 'home' },
  { href: '/products', labelKey: 'products' },
  { href: '/calculator', labelKey: 'calculator' },
  { href: '/about', labelKey: 'about' },
  { href: '/contact', labelKey: 'contact' },
];

/** Mirrors react-router's `NavLink` matching: exact, or a nested child route. */
function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const desktopNavLinkStyle = (isActive: boolean): string =>
    `text-sm font-bold transition-colors ${
      isActive ? 'text-dark-green' : 'text-custom-black hover:text-dark-green'
    }`;

  return (
    <>
      <div className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <header className="w-full max-w-[1200px] mx-auto px-4 flex justify-between items-center h-[72px]">
          <Link href="/">
            <Image
              src="/Logo2.png"
              alt="Mebeltech Logo"
              width={500}
              height={500}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-8">
            <ul className="flex items-center gap-x-6 lg:gap-x-8 font-inter">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={desktopNavLinkStyle(isRouteActive(pathname, item.href))}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </nav>

          <div className="md:hidden -mr-3">
            {/*
              The negative margin keeps the icon where it was while the padding
              grows the tap target to 56px: the bare 32px icon sat 16px from the
              screen edge, where a slightly-off thumb tap hit nothing.
            */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              className="p-3 touch-manipulation"
            >
              <Bars3Icon className="h-8 w-8 text-custom-black" />
            </button>
          </div>
        </header>
      </div>

      {/*  MOBİL MENYU === */}

      <div
        className={`
          fixed inset-0 z-50 flex flex-col items-center justify-center gap-10
          overflow-y-auto overscroll-contain bg-white px-6 py-20
          transition-opacity duration-300 ease-in-out 
          md:hidden
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="absolute top-3 right-3 p-3 touch-manipulation"
        >
          <XMarkIcon className="h-10 w-10 text-custom-black" />
        </button>

        <nav>
          <ul className="flex flex-col items-center space-y-8 font-inter text-center">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-1 text-3xl font-bold text-custom-black hover:text-dark-green"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* In flow rather than pinned to the bottom, so it cannot land on top
            of the links when the overlay is shorter than its contents. */}
        <LanguageSwitcher size="small" />
      </div>
    </>
  );
}
