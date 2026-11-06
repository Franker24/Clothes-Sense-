import React from 'react';
import { Sparkles, ArrowRight, Tag, Zap, ShieldCheck } from 'lucide-react';
import { Gender, ProductCategory } from '../../types';

interface CategoryHeroBannerProps {
  gender?: Gender | null;
  category?: ProductCategory | string | null;
  isSale?: boolean;
  brand?: string | null;
  onQuickCategorySelect?: (catId: string) => void;
}

export const CategoryHeroBanner: React.FC<CategoryHeroBannerProps> = ({
  gender,
  category,
  isSale,
  brand,
  onQuickCategorySelect,
}) => {
  // 1. OFERTAS / CYBER BANNER (Matching ofertas_c9e05352.png)
  if (isSale) {
    return (
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10 select-none">
        <div className="relative min-h-[340px] sm:min-h-[420px] md:min-h-[460px] flex items-center">
          {/* Background Image using the uploaded ofertas image */}
          <img
            src="/assets/aistudio/ofertas_c9e05352.png"
            alt="Cyber Ofertas SENSE"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
          />
          {/* Subtle gradient vignette to blend with store aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Quick Floating Highlights at bottom */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-black/60 px-4 py-2.5 rounded-lg border border-white/15">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>OFERTAS EXCLUSIVAS DE TEMPORADA</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-white/80">
              <span>3 Y 6 CUOTAS SIN INTERÉS</span>
              <span>·</span>
              <span>ENVÍOS A TODO EL PAÍS</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. HOMBRE
  if (gender === 'hombre' && !category) {
    return (
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-xl bg-[#0f1715] text-white border border-white/10 select-none">
        <div className="relative min-h-[280px] sm:min-h-[340px] grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/assets/aistudio/marcas1_1399340a.png"
              alt="Colección Hombre"
              className="w-full h-full object-cover object-top opacity-55 filter brightness-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
          </div>

          <div className="relative z-10 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-3">
              <Sparkles className="w-3 h-3 text-white" />
              <span>SS27 MENSWEAR DROP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display uppercase leading-none text-white">
              Colección Hombre
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed font-normal">
              Siluetas oversize, denim relaxed, bermudas utilitarias, camisas bowling texturadas y zapatillas urbanas de archivo.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {['remeras-tops', 'pantalones-jeans', 'calzado-zapatillas', 'camperas-abrigos'].map((catId) => (
                <button
                  key={catId}
                  onClick={() => onQuickCategorySelect && onQuickCategorySelect(catId)}
                  className="px-3.5 py-1.5 bg-white/15 hover:bg-white hover:text-black text-white text-[11px] font-semibold uppercase tracking-wider rounded-md border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
                >
                  {catId === 'remeras-tops' && 'Remeras & Camisas'}
                  {catId === 'pantalones-jeans' && 'Jeans & Bermudas'}
                  {catId === 'calzado-zapatillas' && 'Zapatillas'}
                  {catId === 'camperas-abrigos' && 'Camperas'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. DAMAS / MUJER
  if (gender === 'mujer' && !category) {
    return (
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-xl bg-[#1a1816] text-white border border-white/10 select-none">
        <div className="relative min-h-[280px] sm:min-h-[340px] grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="absolute inset-0">
            <img
              src="/assets/aistudio/marcas_b2a92e70.png"
              alt="Colección Damas"
              className="w-full h-full object-cover object-center opacity-50 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
          </div>

          <div className="relative z-10 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-3">
              <Sparkles className="w-3 h-3 text-white" />
              <span>NEW IN ✦ CONTEMPORARY WOMAN</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display uppercase leading-none text-white">
              Damas & Mujer
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed font-normal">
              Prendas fluidas, sastrería relajada, denim wide leg, abrigos texturados y calzado contemporáneo seleccionado para todos los días.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {['vestidos', 'remeras-tops', 'pantalones-jeans', 'calzado-zapatillas'].map((catId) => (
                <button
                  key={catId}
                  onClick={() => onQuickCategorySelect && onQuickCategorySelect(catId)}
                  className="px-3.5 py-1.5 bg-white/15 hover:bg-white hover:text-black text-white text-[11px] font-semibold uppercase tracking-wider rounded-md border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
                >
                  {catId === 'vestidos' && 'Vestidos'}
                  {catId === 'remeras-tops' && 'Tops & Remeras'}
                  {catId === 'pantalones-jeans' && 'Wide Leg & Denim'}
                  {catId === 'calzado-zapatillas' && 'Calzado'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. NIÑOS
  if (gender === 'ninos' && !category) {
    return (
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-xl bg-[#141b24] text-white border border-white/10 select-none">
        <div className="relative min-h-[280px] sm:min-h-[340px] grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="absolute inset-0">
            <img
              src="/assets/aistudio/hnm_29aefa2f.png"
              alt="Colección Niños"
              className="w-full h-full object-cover object-center opacity-50 filter brightness-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
          </div>

          <div className="relative z-10 md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-3">
              <Sparkles className="w-3 h-3 text-white" />
              <span>URBAN KIDS & TEENS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display uppercase leading-none text-white">
              Niños & Junior
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed font-normal">
              Moda resistente y cómoda para jugar y moverse. Zapatillas con amortiguación, buzos suaves y prendas lavables de alta durabilidad.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {['buzos-hoodies', 'pantalones-jeans', 'calzado-zapatillas', 'remeras-tops'].map((catId) => (
                <button
                  key={catId}
                  onClick={() => onQuickCategorySelect && onQuickCategorySelect(catId)}
                  className="px-3.5 py-1.5 bg-white/15 hover:bg-white hover:text-black text-white text-[11px] font-semibold uppercase tracking-wider rounded-md border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
                >
                  {catId === 'buzos-hoodies' && 'Buzos & Hoodies'}
                  {catId === 'pantalones-jeans' && 'Pantalones'}
                  {catId === 'calzado-zapatillas' && 'Zapatillas'}
                  {catId === 'remeras-tops' && 'Remeras'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. CALZADO & ZAPATILLAS
  if (category === 'calzado-zapatillas') {
    return (
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-xl bg-black text-white border border-white/10 select-none">
        <div className="relative min-h-[280px] sm:min-h-[340px] grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="absolute inset-0">
            <img
              src="/assets/aistudio/home_c5ec447b.jpg"
              alt="Calzado y Zapatillas"
              className="w-full h-full object-cover object-center opacity-65 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
          </div>

          <div className="relative z-10 md:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-3">
              <Sparkles className="w-3 h-3 text-white" />
              <span>SNEAKERS ARCHIVE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display uppercase leading-none text-white">
              Zapatillas & Calzado
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed font-normal">
              Las siluetas más buscadas de Nike, Adidas Originals, New Balance y Puma. Modelos retro running, urbanos y botas de estación.
            </p>

            <div className="mt-5 flex items-center gap-4 text-xs font-mono text-neutral-300">
              <span className="bg-white/20 px-2.5 py-1 rounded text-white font-bold">HASTA 9 CUOTAS SIN INTERÉS</span>
              <span>·</span>
              <span>CAMBIO DE TALLE GRATIS</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. DENIM & JEANS
  if (category === 'pantalones-jeans') {
    return (
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-xl bg-[#141a24] text-white border border-white/10 select-none">
        <div className="relative min-h-[260px] sm:min-h-[320px] flex items-center p-6 sm:p-10 lg:p-12">
          <div className="relative z-10 max-w-2xl flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-3">
              <Tag className="w-3 h-3 text-white" />
              <span>DENIM SPECIAL EDITION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display uppercase leading-none text-white">
              Denim & Jeans
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              Wide Leg, Relaxed Skater, Cargo y cortes Slim contemporáneos. Tejidos 100% algodón y mezclas elastizadas para máxima durabilidad.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 7. DEFAULT BRAND OR GENERAL BANNER
  if (brand) {
    return (
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-xl bg-[#111111] text-white border border-white/10 select-none p-6 sm:p-10">
        <div className="flex flex-col items-start">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400">
            TIENDA OFICIAL
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display uppercase text-white mt-1">
            {brand}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-xl">
            Descubrí la colección completa de indumentaria, calzado y accesorios de {brand} disponibles con garantía oficial y cuotas sin interés.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
