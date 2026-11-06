import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../utils/formatters';

const POPULAR_SEARCHES = ['Nike Air Force', 'Gazelle', 'Levi 501', 'Hoodie', 'New Balance 550', 'Chuck 70'];
const QUICK_CATEGORIES = [
  { label: 'Zapatillas', q: 'zapatillas' },
  { label: 'Remeras', q: 'remera' },
  { label: 'Buzos & Hoodies', q: 'hoodie' },
  { label: 'Camperas', q: 'campera' },
  { label: 'Pantalones', q: 'pantalon' },
  { label: 'Accesorios', q: 'accesorios' },
];

export const SearchModal: React.FC = () => {
  const navigate = useNavigate();
  const { isSearchOpen, setIsSearchOpen, products, brands } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  // Keyboard shortcut: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Real-time matched products — memoized for performance
  const cleanQ = query.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!cleanQ) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(cleanQ) ||
        p.brand.toLowerCase().includes(cleanQ) ||
        p.category.toLowerCase().includes(cleanQ) ||
        p.gender.toLowerCase().includes(cleanQ)
    ).slice(0, 6);
  }, [cleanQ, products]);

  const matchingBrands = useMemo(() => {
    if (!cleanQ) return [];
    return brands.filter((b) => b.name.toLowerCase().includes(cleanQ));
  }, [cleanQ, brands]);

  if (!isSearchOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectSuggestion = (text: string) => {
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleProductClick = (productId: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleBrandClick = (slug: string) => {
    setIsSearchOpen(false);
    navigate(`/catalog?brand=${slug}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white animate-in fade-in-0 duration-200">
      
      {/* Top Bar — Logo + Close */}
      <div className="flex items-center justify-between px-6 sm:px-10 h-16 sm:h-20 border-b border-[#DCDCD9] shrink-0">
        <span className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase text-[#111111] select-none">
          SENSE
        </span>
        <button
          onClick={() => setIsSearchOpen(false)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F1] transition-all cursor-pointer"
          aria-label="Cerrar búsqueda"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Search Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10 sm:py-16">
          
          {/* Large Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center border-b-2 border-[#111111] pb-3 gap-4">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 text-[#111111] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full text-2xl sm:text-4xl md:text-5xl font-bold text-[#111111] placeholder:text-[#DCDCD9] focus:outline-none bg-transparent font-display tracking-tight"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-2 text-[#777777] hover:text-[#111111] transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-[#777777] font-medium">
                Buscá por producto, marca, categoría o palabra clave
              </p>
              <span className="text-[10px] text-[#777777] font-mono hidden sm:block">
                ESC para cerrar · ⌘K para abrir
              </span>
            </div>
          </form>

          {/* Content Below Search */}
          <div className="mt-10 sm:mt-14">
            
            {/* When EMPTY query: show discovery content */}
            {!cleanQ && (
              <div className="space-y-10">
                
                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-[#777777]" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#777777]">
                      Búsquedas populares
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSelectSuggestion(item)}
                        className="px-4 py-2.5 bg-[#F3F3F1] hover:bg-[#111111] hover:text-white text-sm font-semibold text-[#111111] rounded-full transition-all cursor-pointer active:scale-95"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Categories */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#777777] mb-4">
                    Categorías
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {QUICK_CATEGORIES.map((cat) => (
                      <button
                        key={cat.q}
                        onClick={() => handleSelectSuggestion(cat.q)}
                        className="p-4 bg-[#F3F3F1] hover:bg-[#111111] hover:text-white text-left rounded-lg transition-all cursor-pointer group active:scale-[0.98]"
                      >
                        <span className="text-sm font-bold">{cat.label}</span>
                        <ArrowRight className="w-4 h-4 mt-1 text-[#777777] group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explore by Brand */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#777777] mb-4">
                    Explorar por marca
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleBrandClick(b.slug)}
                        className="px-4 py-2.5 border border-[#DCDCD9] hover:border-[#111111] hover:bg-[#111111] hover:text-white text-xs font-bold uppercase tracking-wider rounded-full text-[#111111] transition-all cursor-pointer active:scale-95"
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* When TYPING: show live results */}
            {cleanQ && (
              <div className="space-y-8">
                
                {/* Brand match shortcuts */}
                {matchingBrands.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#777777] mb-3">
                      Marcas
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {matchingBrands.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => handleBrandClick(b.slug)}
                          className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold tracking-wider uppercase rounded-full hover:bg-black transition-colors cursor-pointer active:scale-95 flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Ver colección {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product results */}
                {matchingProducts.length > 0 ? (
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#777777] mb-3">
                      Productos sugeridos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {matchingProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleProductClick(p.id)}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F3F3F1] cursor-pointer transition-colors group active:scale-[0.98]"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-20 object-cover rounded-lg bg-[#F3F3F1] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                              {p.brand}
                            </span>
                            <h4 className="text-sm font-semibold text-[#111111] truncate">
                              {p.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-[#111111] font-mono tabular-nums">
                                {formatARS(p.price)}
                              </span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <span className="text-xs text-[#777777] line-through font-mono">
                                  {formatARS(p.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-[#111111] shrink-0 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSearchSubmit}
                      className="w-full mt-6 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-black rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      Ver todos los resultados para "{query}" →
                    </button>
                  </div>
                ) : (
                  matchingBrands.length === 0 && (
                    <div className="py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#F3F3F1] flex items-center justify-center mx-auto mb-5">
                        <Search className="w-7 h-7 text-[#DCDCD9]" />
                      </div>
                      <p className="text-lg font-bold text-[#111111]">
                        No encontramos resultados para "{query}"
                      </p>
                      <p className="text-sm text-[#777777] mt-2 max-w-md mx-auto">
                        Probá buscando por términos como "Zapatillas", "Nike", "Pantalones" o "Hoodie".
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
