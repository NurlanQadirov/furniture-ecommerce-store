import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ProductCard({ product }) {
  const { t } = useTranslation();

  if (!product) return null;

  return (
    <Link to={`/product/${product.id}`} className="block bg-white shadow-lg rounded-lg overflow-hidden group">
      <div className="overflow-hidden h-64">
        <img 
          src={product.photo} 
          alt={t(product.titleKey)} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-custom-black">{t(product.titleKey)}</h3>
        {product.price && <p className="text-dark-green font-serif text-2xl mt-2">{product.price} AZN</p>}
      </div>
    </Link>
  );
}

export default ProductCard;