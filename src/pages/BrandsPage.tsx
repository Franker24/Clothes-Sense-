import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BrandsPage: React.FC = () => {
  const { brands, products } = useStore();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.origin.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* Page Title */}
      <div className="pb-8 border-b border-[#DCDCD9] mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#777777]">
          Marcas Oficiales
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#111111] mt-1">
          Directorio de Marcas
        </h1>
        <p className="text-sm text-[#777777] mt-3 max-w-2xl leading-relaxed">
          En SENSE trabajamos exclusivamente con distribuidores oficiales autorizados. Todos los productos son 100% auténticos y cuentan con garantía de fábrica directa.
        </p>

        {/* Filter Input */}
        <div className="mt-6 max-w-md relative">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Buscar por nombre de marca..."
            className="w-full h-11 pl-10 pr-4 text-xs bg-[#F3F3F1] border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      {/* Brand Grid - Styled after Uiverse rounded-3xl card design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredBrands.map((b) => {
          const brandProductCount = products.filter(
            (p) => p.brand.toLowerCase() === b.name.toLowerCase()
          ).length;

          return (
            <div
              key={b.id}
              className="group flex flex-col bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-black transition-all duration-300 overflow-hidden"
            >
              <div className="px-6 py-8 sm:p-10 sm:pb-6 flex-1">
                <div className="grid items-center justify-center w-full grid-cols-1 text-left">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tighter text-gray-900 font-display">
                        {b.name}
                      </h2>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 bg-[#F3F3F1] px-2.5 py-1 rounded-full border border-neutral-200">
                        {b.origin}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-light tracking-tight text-black font-mono">
                        {brandProductCount}
                      </span>
                      <span className="text-base font-medium text-gray-500"> / prendas en stock </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex px-6 pb-8 sm:px-8">
                <Link
                  to={`/catalog?brand=${b.slug}`}
                  aria-describedby={`tier-${b.slug}`}
                  className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm font-semibold uppercase tracking-wider group-hover:shadow-md transition-all"
                >
                  <span>Explorar {b.name}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
