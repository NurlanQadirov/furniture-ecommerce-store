import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { productsData } from '../data/products.js';

function ProductCard({ product }) {
  if (!product) return null;
  return (
    <Link to={`/product/${product.id}`} className="block bg-white shadow-lg rounded-lg overflow-hidden group">
      <div className="overflow-hidden h-64">
        <img src={product.photo} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"/>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-custom-black">{product.title}</h3>
        {product.price && <p className="text-dark-green font-serif text-2xl mt-2">{product.price} AZN</p>}
      </div>
    </Link>
  );
}

function ProductsPage() {
  const { t } = useTranslation();
  const comp = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-item", {
        opacity: 0, y: 60, duration: 0.8, ease: "power3.out", stagger: 0.15,
        scrollTrigger: { trigger: comp.current, start: "top 85%", toggleActions: "play none none none", once: true, },
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full max-w-[1100px] mx-auto px-4 py-16">
      <section className="text-center mb-12">
        <h1 className="font-serif text-5xl text-dark-green animate-item">{t('all_products_title')}</h1>
        <p className="mt-2 text-custom-black animate-item">{t('all_products_subtitle')}</p>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productsData.map(product => (
          <div key={product.id} className="animate-item">
            <ProductCard product={product} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default ProductsPage;