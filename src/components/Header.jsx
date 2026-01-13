import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo2.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const desktopNavLinkStyle = ({ isActive }) => {
    return `text-sm font-bold transition-colors ${
      isActive ? "text-dark-green" : "text-custom-black hover:text-dark-green"
    }`;
  };

  return (
    <>
      
      <div className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <header className="w-full max-w-[1200px] mx-auto px-4 flex justify-between items-center h-[72px]">
          <NavLink to="/">
            <img src={logo} alt="Mebeltech Logo" className="h-12 w-auto" />
          </NavLink>

          <nav className="hidden md:flex items-center gap-x-8">
            <ul className="flex items-center gap-x-8 font-inter">
              <li>
                <NavLink to="/" className={desktopNavLinkStyle}>
                  {t("home")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" className={desktopNavLinkStyle}>
                  {t("products")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={desktopNavLinkStyle}>
                  {t("about")}
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={desktopNavLinkStyle}>
                  {t("contact")}
                </NavLink>
              </li>
            </ul>
            <LanguageSwitcher />
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <Bars3Icon className="h-8 w-8 text-custom-black" />
            </button>
          </div>
        </header>
      </div>

      {/*  MOBİL MENYU === */}

      <div
        className={`
          fixed inset-0 z-50 flex flex-col items-center justify-center 
          bg-white p-6
          transition-opacity duration-300 ease-in-out 
          md:hidden
          ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="absolute top-6 right-6"
        >
          <XMarkIcon className="h-10 w-10 text-custom-black" />
        </button>

        <nav>
          <ul className="flex flex-col items-center space-y-10 font-inter text-center">
            <li>
              <NavLink
                to="/"
                className="text-3xl font-bold text-custom-black hover:text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("home")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className="text-3xl font-bold text-custom-black hover:text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("products")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="text-3xl font-bold text-custom-black hover:text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("about")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="text-3xl font-bold text-custom-black hover:text-dark-green"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("contact")}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-10">
          <LanguageSwitcher size="small" />
        </div>
      </div>
    </>
  );
}

export default Header;
