import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax } from 'swiper/modules'; 

import 'swiper/css';

import { ArrowRightIcon } from '@heroicons/react/24/solid';

function HeroSlider() {
    const { t } = useTranslation();

    const sliderData = [
        {
            img: '/furniture.jpg',
            title: t('hero_slide1_title'),
            desc: t('hero_slide1_desc'),
            subtitle: "Yeni Kolleksiya"
        },
        {
            img: '/furniture2.jpg',
            title: t('hero_slide2_title'),
            desc: t('hero_slide2_desc'),
            subtitle: "Modern Stil"
        },
        {
            img: '/furniture3.jpg',
            title: t('hero_slide3_title'),
            desc: t('hero_slide3_desc'),
            subtitle: "Premium Keyfiyyət"
        }
    ];

    return (
        <section className="relative w-full h-[calc(100vh-72px)] min-h-[600px] bg-gray-900 group overflow-hidden">
            <Swiper
                modules={[Autoplay, Parallax]} 
                spaceBetween={0}
                slidesPerView={1}
                speed={1500}
                parallax={true}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                navigation={false} 
                pagination={false}
                className="w-full h-full"
            >
                {sliderData.map((slide, index) => (
                    <SwiperSlide key={index} className="relative w-full h-full overflow-hidden">
                        
                    
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.img})` }}
                            data-swiper-parallax="50%"
                        ></div>

                      
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10"></div>

                        {/* Məzmun Hissəsi */}
                        <div className="relative z-20 w-full h-full max-w-[1200px] mx-auto px-6 md:px-12 flex items-center">
                            <div className="max-w-2xl text-white space-y-6 pl-4 md:pl-0">
                                
                                {/* Subtitle */}
                                <span 
                                    className="font-serif text-3xl md:text-4xl text-custom-green/90 block"
                                    data-swiper-parallax="-100"
                                >
                                    {slide.subtitle}
                                </span>

                                {/* Title */}
                                <h1 
                                    className="font-sans font-bold text-5xl md:text-7xl leading-tight drop-shadow-sm"
                                    data-swiper-parallax="-200"
                                >
                                    {slide.title}
                                </h1>

                                {/* Description */}
                                <p 
                                    className="font-sans text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg"
                                    data-swiper-parallax="-300"
                                >
                                    {slide.desc}
                                </p>

                                {/* Button */}
                                <div className="pt-4" data-swiper-parallax="-400">
                                    <Link 
                                        to="/products" 
                                        className="inline-flex items-center gap-3 bg-white text-custom-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-dark-green hover:text-white hover:shadow-lg group/btn"
                                    >
                                        <span>{t('goToCatalog')}</span>
                                        <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
          
        </section>
    );
}

export default HeroSlider;