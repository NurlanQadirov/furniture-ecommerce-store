'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/components/providers/TranslationProvider';
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
  const t = useT();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = pathname === '/';
  // Over the home page's dark hero the bar goes transparent with light type.
  // Starts true there so the first paint already matches the photograph.
  const [overHero, setOverHero] = useState(isHome);

  useEffect(() => {
    const zone = isHome ? document.querySelector('[data-header-overlay]') : null;
    if (!zone) {
      setOverHero(false);
      return;
    }

    // Watches only the strip the bar itself occupies, so the light styling
    // holds exactly while the hero is behind it. No scroll listener needed.
    let observer: IntersectionObserver | null = null;
    const watch = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => setOverHero(entry?.isIntersecting ?? false),
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - 72)}px 0px` },
      );
      observer.observe(zone);
    };

    watch();
    window.addEventListener('resize', watch);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', watch);
    };
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const desktopNavLinkStyle = (isActive: boolean): string => {
    if (overHero) {
      return `text-sm font-bold transition-colors ${
        isActive ? 'text-lux-sand' : 'text-lux-sand/75 hover:text-lux-sand'
      }`;
    }
    return `text-sm font-bold transition-colors ${
      isActive ? 'text-dark-green' : 'text-custom-black hover:text-dark-green'
    }`;
  };

  // The home page's solid state drops the backdrop blur: re-blurring the
  // page under a sticky bar on every scroll frame is expensive on phones.
  const barStyle = overHero
    ? 'bg-gradient-to-b from-lux-obsidian/60 to-transparent'
    : isHome
      ? 'bg-lux-sand/95 shadow-sm'
      : 'bg-white/90 backdrop-blur-sm shadow-sm';

  return (
    <>
      <div
        className={`w-full sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${barStyle}`}
      >
        <header className="w-full max-w-[1200px] mx-auto px-4 flex justify-between items-center h-[72px]">
          <Link href="/" aria-label={`${t('alt_logo')} — ${t('home')}`}>
            <Image
              src="/Logo2.png"
              alt={t('alt_logo')}
              width={500}
              height={500}
              className={`h-12 w-auto transition-[filter] duration-500 ${
                overHero ? 'brightness-0 invert' : ''
              }`}
              priority
            />
          </Link>

          <nav
            aria-label={t('aria_main_nav')}
            className="hidden md:flex items-center gap-x-6 lg:gap-x-8"
          >
            <ul className="flex items-center gap-x-6 lg:gap-x-8 font-inter">
              {navItems.map((item) => {
                const isActive = isRouteActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={desktopNavLinkStyle(isActive)}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
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
              aria-label={t('aria_open_menu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="p-3 touch-manipulation"
            >
              <Bars3Icon
                className={`h-8 w-8 transition-colors duration-500 ${
                  overHero ? 'text-lux-sand' : 'text-custom-black'
                }`}
              />
            </button>
          </div>
        </header>
      </div>

      {/*  MOBİL MENYU === */}

      <div
        id="mobile-menu"
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
          aria-label={t('aria_close_menu')}
          className="absolute top-3 right-3 p-3 touch-manipulation"
        >
          <XMarkIcon className="h-10 w-10 text-custom-black" />
        </button>

        <nav aria-label={t('aria_mobile_nav')}>
          <ul className="flex flex-col items-center space-y-8 font-inter text-center">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isRouteActive(pathname, item.href) ? 'page' : undefined}
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
