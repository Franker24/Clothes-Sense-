import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { products } = useStore();

  const [inputQuery, setInputQuery] = useState(queryParam);

  useEffect(() => {
    setInputQuery(queryParam);
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    setSearchParams({ q: inputQuery.trim() });
  };

  const cleanQuery = queryParam.trim().toLowerCase();

  const searchResults = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.brand.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.gender.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* Search Header */}
      <div className="pb-8 border-b border-[#DCDCD9] mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#777777]">
          Buscador de Productos
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#111111] mt-1">
          {queryParam ? `Resultados para "${queryParam}"` : 'Buscar en SENSE'}
        </h1>

        <form onSubmit={handleSearch} className="mt-6 max-w-lg flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Buscar por zapatilla, remera, marca..."
              className="w-full h-11 pl-10 pr-10 text-xs bg-[#F3F3F1] border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => setInputQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#777777] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="h-11 px-6 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black"
          >
            Buscar
          </button>
        </form>

        {queryParam && (
          <p className="text-xs text-[#777777] mt-3 font-mono">
            {searchResults.length} {searchResults.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        )}
      </div>

      {/* Results Grid or Empty State */}
      {!queryParam ? (
        <div className="py-16 text-center text-[#777777]">
          <p className="text-sm">Escribí una palabra clave para comenzar la búsqueda.</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#DCDCD9] rounded-lg">
          <h3 className="font-display font-bold text-lg text-[#111111]">
            No encontramos resultados para "{queryParam}"
          </h3>
          <p className="text-xs text-[#777777] mt-2 max-w-sm mx-auto">
            Verificá la ortografía o probá con términos más generales como "Nike", "Adidas", "Jeans" o "Calzado".
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-block px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded"
          >
            Ver todo el catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
          {searchResults.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
