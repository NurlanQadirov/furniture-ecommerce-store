import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

function Hero() {
  const comp = useRef(null);
  
  useLayoutEffect(() => {
    
  }, []);

  return (
    <div ref={comp} className="relative w-full h-screen overflow-hidden">
    
      <div 
        className="absolute inset-0 bg-cover bg-center animate-kenburns"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070')" }}
      ></div>
      
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 id="hero-title" className="font-serif text-6xl md:text-8xl drop-shadow-lg">Evinizin Rahatlığı</h1>
        <p id="hero-desc" className="mt-4 max-w-xl text-lg md:text-xl font-light drop-shadow-md">Hər zövqə uyğun, keyfiyyətli və müasir mebel modelləri ilə tanış olun.</p>
        <Link 
          id="hero-button"
          to="/mebeller" 
          className="mt-8 bg-dark-green text-white font-bold py-4 px-12 rounded-lg text-lg border-2 border-transparent hover:bg-white hover:text-dark-green hover:border-dark-green transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
        >
          Kataloqa Keçid
        </Link>
      </div>
    </div>
  );
}

export default Hero;