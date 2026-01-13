import React, { useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { productsData } from '../data/products.js';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

function ProductDetailPage() {
    const { t } = useTranslation();
    const { productId } = useParams();
    const product = productsData.find(p => p.id === parseInt(productId));
    const comp = useRef(null);

    useLayoutEffect(() => {
        if (!product) return;
        const ctx = gsap.context(() => {
            gsap.from(".animate-item", { opacity: 0, y: 50, duration: 0.8, ease: "power3.out", stagger: 0.2, });
        }, comp);
        return () => ctx.revert();
    }, [product]);

    if (!product) {
        return <div className="text-center py-20">{t('product_not_found')}</div>;
    }

    return (
        <div ref={comp} className="w-full max-w-[1100px] mx-auto px-4 py-12">
            <div className="mb-8 animate-item">
                <Link to="/products" className="inline-flex items-center gap-2 text-dark-green font-bold hover:underline">
                    <ArrowLeftIcon className="h-5 w-5" />
                    {t('back_to_products')}
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="animate-item">
                    <img src={product.photo} alt={t(product.titleKey)} className="w-full rounded-lg shadow-xl" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="font-serif text-6xl text-dark-green animate-item">{t(product.titleKey)}</h1>
                    {product.price && <p className="text-3xl text-custom-black font-bold my-4 animate-item">{product.price} AZN</p>}
                    <p className="text-custom-black leading-7 animate-item">{t(product.descKey)}</p>
                    <div className="animate-item">
                        <button className="bg-dark-green text-white font-bold py-3 px-8 mt-6 rounded-lg hover:bg-opacity-90 transition-all w-full md:w-auto self-start">
                            {t('add_to_cart')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;