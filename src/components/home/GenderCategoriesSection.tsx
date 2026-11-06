import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const GenderCategoriesSection: React.FC = () => {
  const categories = [
    {
      id: 'hombres',
      title: 'Hombres',
      subtitle: 'COLECCIÓN MASCULINA',
      link: '/hombres',
      image: '/images/categoria/hombres.png',
      badge: 'Neutros, Denim & Calzado',
    },
    {
      id: 'damas',
      title: 'Damas',
      subtitle: 'COLECCIÓN FEMENINA',
      link: '/damas',
      image: '/images/categoria/damas.png',
      badge: 'Tendencias & Sastrería',
    },
    {
      id: 'ninos',
      title: 'Niños',
      subtitle: 'COLECCIÓN INFANTIL',
      link: '/kids',
      image: '/images/categoria/ninos.png',
      badge: 'Comodidad & Estilo Diario',
    },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] py-14 sm:py-20 border-t border-[#DCDCD9]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#777777]">
                Comprar por Categoría
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
              <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider">
                Nueva Temporada
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-[#111111] mt-1 tracking-tight">
              Elegí tu estilo
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1.5 group"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 
          Responsive Grid (1 column on mobile, 3 columns on tablet/desktop)
          Each card uses Framer Motion / GSAP subtle entrance effect
          Typography is cleanly separated so NO texts ever overlap
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="category-box-anim relative aspect-[9/15] rounded-[4px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 bg-[#EAEAE7] group cursor-pointer border border-neutral-200"
            >
              <Link to={cat.link} className="block w-full h-full relative" aria-label={`Ver colección ${cat.title}`}>
                
                {/* 
                  Category Photography from hnm reference.
                  It contains the clean serif wordmark in the image.
                  We DO NOT place another duplicate title over it to prevent overlap!
                */}
                <img
                  src={cat.image}
                  alt={`Colección ${cat.title}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle scrim that deepens smoothly on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top minimalist collection badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-[2px] border border-white/15">
                    {cat.subtitle}
                  </span>
                  <span className="text-[10px] text-white/80 font-mono hidden sm:inline-block">
                    0{idx + 1}
                  </span>
                </div>

                {/* Bottom interactive action bar (reveals on hover without obscuring models in idle state) */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col justify-end pointer-events-none">
                  
                  <div className="transform translate-y-0 sm:translate-y-3 opacity-100 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-xs text-[#111111] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-[2px] shadow-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-wider text-[#777777] block">
                        {cat.badge}
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-widest font-display flex items-center gap-1.5 text-[#111111]">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                        <span>Ver {cat.title}</span>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#111111] group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>

              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
