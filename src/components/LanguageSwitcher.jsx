import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher({ size = 'default' }) {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'az', name: 'AZ' },
    { code: 'en', name: 'EN' },
    { code: 'ru', name: 'RU' },
  ];


  const containerStyle = size === 'small' 
    ? 'inline-flex bg-dark-green rounded-full p-1' 
    : 'inline-flex bg-gray-200 rounded-full p-1';
  
  const buttonStyle = size === 'small' 
    ? 'px-2 py-0.5 text-xs min-w-[28px]' 
    : 'px-3 py-1 text-sm min-w-[36px]';
  
  const activeButtonStyle = size === 'small' 
    ? 'bg-white text-dark-green' 
    : 'bg-dark-green text-white';

  const inactiveButtonStyle = size === 'small' 
    ? 'text-gray-200 hover:bg-white/20' 
    : 'text-gray-600 hover:bg-gray-300';

  return (
    <div className={containerStyle}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`${buttonStyle} font-bold rounded-full transition-colors duration-300 ${i18n.language.startsWith(lang.code) ? activeButtonStyle : inactiveButtonStyle}`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;