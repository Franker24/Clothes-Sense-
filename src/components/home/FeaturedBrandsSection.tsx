import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';

export const FeaturedBrandsSection: React.FC = () => {
  const { brands } = useStore();
  const [activeBrandTab, setActiveBrandTab] = useState<'mujer' | 'hombre'>('mujer');

  const womenBrandCards = [
    {
      id: 'adidas-w',
      name: 'Adidas Originals',
      image: '/assets/aistudio/brand_adidas.png',
      link: '/catalog?brand=adidas',
    },
    {
      id: 'arket-w',
      name: 'ARKET',
      image: '/assets/aistudio/brand_arket.png',
      link: '/catalog?brand=nike',
    },
    {
      id: 'asos-w',
      name: 'ASOS DESIGN',
      image: '/assets/aistudio/brand_asos.png',
      link: '/catalog?brand=levis',
    },
    {
      id: 'topshop-w',
      name: 'TOPSHOP',
      image: '/assets/aistudio/brand_topshop.png',
      link: '/catalog?brand=puma',
    },
  ];

  const menBrandCards = [
    {
      id: 'adidas-m',
      name: 'Adidas Originals',
      image: '/assets/aistudio/brand_men_adidas.png',
      link: '/catalog?brand=adidas',
    },
    {
      id: 'newbalance-m',
      name: 'New Balance',
      image: '/assets/aistudio/brand_men_newbalance.png',
      link: '/catalog?brand=new-balance',
    },
    {
      id: 'asos-m',
      name: 'ASOS DESIGN Men',
      image: '/assets/aistudio/brand_men_asos.png',
      link: '/catalog?brand=levis',
    },
    {
      id: 'topman-m',
      name: 'TOPMAN',
      image: '/assets/aistudio/brand_men_topman.png',
      link: '/catalog?brand=puma',
    },
  ];

  const activeCards = activeBrandTab === 'mujer' ? womenBrandCards : menBrandCards;

  return (
    <section className="w-full bg-white py-14 sm:py-20 border-t border-[#DCDCD9]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Centered title matching the original reference screenshot */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-[#111111] tracking-tight">
            Las marcas mas grandes
          </h2>

          {/* Minimalist Gender Toggle */}
          <div className="mt-4 flex items-center p-1 bg-[#F3F3F1] rounded-full border border-[#DCDCD9]">
            <button
              onClick={() => setActiveBrandTab('mujer')}
              className={`px-4 sm:px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeBrandTab === 'mujer'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Mujer
            </button>
            <button
              onClick={() => setActiveBrandTab('hombre')}
              className={`px-4 sm:px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeBrandTab === 'hombre'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Hombre
            </button>
          </div>
        </div>

        {/* 
          4-Column Brand Visual Cards:
          Directly renders the original image assets with the logos overlaid on photography.
          Pure, clean photographic blocks with smooth hover zoom.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrandTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full"
          >
            {activeCards.map((brand) => (
              <div
                key={brand.id}
                className="relative aspect-[3/4.4] sm:aspect-[4/5.8] rounded-[2px] overflow-hidden bg-neutral-100 group cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <Link
                  to={brand.link}
                  className="block w-full h-full relative"
                  aria-label={`Ver colección ${brand.name}`}
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle darkening on hover to elevate interactivity */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Link>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Quick Brand Directory Strip */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#DCDCD9]">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#777777] mr-1">
              Catálogo oficial:
            </span>
            {brands.map((b) => (
              <Link
                key={b.id}
                to={`/catalog?brand=${b.slug}`}
                className="px-3 py-1 bg-[#F3F3F1] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                {b.name}
              </Link>
            ))}
          </div>

          <Link
            to="/brands"
            className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1.5 whitespace-nowrap group"
          >
            <span>Ver todas las marcas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
