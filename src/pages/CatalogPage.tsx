import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  X, 
  ChevronDown, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORIES_CONFIG } from '../data/mockData';
import { Gender, ProductCategory } from '../types';
import { formatARS } from '../utils/formatters';
import { CategoryHeroBanner } from '../components/catalog/CategoryHeroBanner';
import { EditorialSidebar } from '../components/layout/EditorialSidebar';
import { animateProductGrid } from '../utils/animations';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '39', '40', '41', '42', '43', '44', '4A', '6A', '8A', '10A'];
const ALL_COLORS = [
  { name: 'Negro', hex: '#111111' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Gris', hex: '#888888' },
  { name: 'Azul', hex: '#1B3B6F' },
  { name: 'Verde', hex: '#2E5A36' },
  { name: 'Beige', hex: '#D8C3A5' },
  { name: 'Rojo', hex: '#C8102E' },
];

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, brands } = useStore();

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  // Editorial Category Sidebar state (same as home)
  const [editorialSidebarOpen, setEditorialSidebarOpen] = useState(false);

  // Read URL params
  const genderParam = searchParams.get('gender') as Gender | null;
  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const brandParam = searchParams.get('brand') || '';
  const saleParam = searchParams.get('sale') === 'true';
  const sortParam = searchParams.get('sort') || 'featured';

  // Local filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandParam ? [brandParam.toLowerCase()] : []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    genderParam ? [genderParam] : []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250000]);
  const [onlySale, setOnlySale] = useState<boolean>(saleParam);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(sortParam);

  const catalogGridRef = useRef<HTMLDivElement>(null);

  // Sync state when URL params change
  useEffect(() => {
    if (genderParam) setSelectedGenders([genderParam]);
    if (brandParam) setSelectedBrands([brandParam.toLowerCase()]);
    if (categoryParam) setSelectedCategory(categoryParam);
    if (saleParam) setOnlySale(true);
    if (sortParam) setSortBy(sortParam);
  }, [genderParam, brandParam, categoryParam, saleParam, sortParam]);

  // Handle Brand selection toggle
  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );
  };

  // Handle Size selection toggle
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Handle Color selection toggle
  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedGenders([]);
    setSelectedCategory('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 250000]);
    setOnlySale(false);
    setOnlyInStock(false);
    setSearchParams({});
  };

  // Compute active filter count
  const activeFiltersCount = 
    selectedBrands.length +
    selectedGenders.length +
    (selectedCategory ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (onlySale ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (priceRange[1] < 250000 || priceRange[0] > 0 ? 1 : 0);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Gender
    if (selectedGenders.length > 0) {
      result = result.filter(
        (p) => selectedGenders.includes(p.gender) || p.gender === 'unisex'
      );
    }

    // Brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => {
        const brandSlug = p.brand.toLowerCase().replace(/['\s]/g, '-');
        return selectedBrands.includes(brandSlug);
      });
    }

    // Category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sale
    if (onlySale) {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Size
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.availableSizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Color
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.availableColors.some((c) =>
          selectedColors.some((sc) => c.name.toLowerCase().includes(sc.toLowerCase()))
        )
      );
    }

    // Price
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // In Stock
    if (onlyInStock) {
      result = result.filter((p) =>
        p.variants.some((v) => v.stock > 0)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'best-seller':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [
    products,
    selectedGenders,
    selectedBrands,
    selectedCategory,
    onlySale,
    selectedSizes,
    selectedColors,
    priceRange,
    onlyInStock,
    sortBy,
  ]);

  // Animate product cards with GSAP whenever filtered list updates
  useEffect(() => {
    const revert = animateProductGrid(catalogGridRef.current);
    return () => {
      if (revert) revert();
    };
  }, [filteredProducts]);

  // Page title generator
  const getPageTitle = () => {
    if (onlySale) return 'Sale — Hasta 40% OFF';
    if (selectedBrands.length === 1) {
      const b = brands.find((brand) => brand.slug === selectedBrands[0]);
      if (b) return `Colección Oficial ${b.name}`;
    }
    if (selectedGenders.length === 1) {
      const g = selectedGenders[0];
      if (g === 'hombre') return 'Colección Hombre';
      if (g === 'mujer') return 'Colección Mujer';
      if (g === 'ninos') return 'Colección Niños';
    }
    if (selectedCategory) {
      const cat = CATEGORIES_CONFIG.find((c) => c.id === selectedCategory);
      if (cat) return cat.label;
    }
    return 'Catálogo Completo';
  };

  // Reusable Filter Sidebar Content with Soft Border-Box Treatment
  const renderFilterPanel = () => (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-6 text-xs text-[#111111]">
      {/* Header with clear all */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <span className="font-bold uppercase tracking-wider text-xs">Filtros</span>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[11px] text-[#777777] hover:text-[#111111] underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Gender Filter */}
      <div>
        <h4 className="font-bold uppercase tracking-wider mb-2.5">Género</h4>
        <div className="space-y-1.5">
          {[
            { id: 'hombre', label: 'Hombre' },
            { id: 'mujer', label: 'Mujer' },
            { id: 'ninos', label: 'Niños' },
          ].map((g) => (
            <label key={g.id} className="flex items-center gap-2 cursor-pointer hover:text-black">
              <input
                type="checkbox"
                checked={selectedGenders.includes(g.id)}
                onChange={() => {
                  setSelectedGenders((prev) =>
                    prev.includes(g.id) ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                  );
                }}
                className="w-3.5 h-3.5 accent-[#111111] rounded"
              />
              <span>{g.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="pt-4 border-t border-neutral-100">
        <h4 className="font-bold uppercase tracking-wider mb-2.5">Marca</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label key={b.id} className="flex items-center gap-2 cursor-pointer hover:text-black">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.slug)}
                onChange={() => toggleBrand(b.slug)}
                className="w-3.5 h-3.5 accent-[#111111] rounded"
              />
              <span className="capitalize">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Product Type / Category */}
      <div className="pt-4 border-t border-neutral-100">
        <h4 className="font-bold uppercase tracking-wider mb-2.5">Tipo de Producto</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer hover:text-black">
            <input
              type="radio"
              name="cat-radio"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="w-3.5 h-3.5 accent-[#111111]"
            />
            <span>Todos los tipos</span>
          </label>
          {CATEGORIES_CONFIG.map((c) => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:text-black">
              <input
                type="radio"
                name="cat-radio"
                checked={selectedCategory === c.id}
                onChange={() => setSelectedCategory(c.id)}
                className="w-3.5 h-3.5 accent-[#111111]"
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="pt-4 border-t border-neutral-100">
        <h4 className="font-bold uppercase tracking-wider mb-2.5">Talle</h4>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-2.5 py-1 text-[11px] font-semibold border rounded-full transition-colors ${
                  isSelected
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-neutral-200 hover:border-[#111111]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="pt-4 border-t border-neutral-100">
        <h4 className="font-bold uppercase tracking-wider mb-2.5">Color</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_COLORS.map((c) => {
            const isSelected = selectedColors.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleColor(c.name)}
                className={`flex items-center gap-2 px-2.5 py-1.5 border rounded-full text-[11px] transition-all text-left ${
                  isSelected ? 'border-[#111111] bg-neutral-100 font-semibold' : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full border border-neutral-300 shrink-0" 
                  style={{ backgroundColor: c.hex }} 
                />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-[#DCDCD9]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold uppercase tracking-wider">Precio Máximo</h4>
          <span className="font-mono tabular-nums text-xs font-semibold">{formatARS(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={30000}
          max={250000}
          step={5000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#111111] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#777777] font-mono mt-1">
          <span>{formatARS(30000)}</span>
          <span>{formatARS(250000)}</span>
        </div>
      </div>

      {/* Special Switches */}
      <div className="pt-4 border-t border-[#DCDCD9] space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlySale}
            onChange={(e) => setOnlySale(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#C8102E]"
          />
          <span className="font-semibold text-[#C8102E]">Solo productos en oferta</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#111111]"
          />
          <span>Solo con stock inmediato</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#777777] mb-6">
        <Link to="/" className="hover:text-[#111111]">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/catalog" className="hover:text-[#111111]">Tienda</Link>
        {selectedCategory && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="capitalize">{selectedCategory.replace('-', ' ')}</span>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111111] font-semibold">{getPageTitle()}</span>
      </nav>

      {/* Thematic Category "Pequeño Home" Campaign Hero Banner */}
      <CategoryHeroBanner
        gender={selectedGenders.length === 1 ? (selectedGenders[0] as Gender) : null}
        category={selectedCategory}
        isSale={onlySale}
        brand={selectedBrands.length === 1 ? brands.find(b => b.slug === selectedBrands[0])?.name : null}
        onQuickCategorySelect={(catId) => setSelectedCategory(catId)}
      />

      {/* Catalog Title & Subcategory Pills Strip */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#111111]">
            {getPageTitle()}
          </h1>
          <span className="text-xs text-[#777777] font-mono">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </span>
        </div>

        {/* Horizontal Subcategory Quick Tabs with Rounded Pill Border-Box Styling */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-4 border-b border-neutral-200/80">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border whitespace-nowrap transition-all shadow-2xs ${
              selectedCategory === ''
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#111111] border-neutral-200 hover:border-black'
            }`}
          >
            Todas las prendas
          </button>
          {CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? '' : cat.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat.id
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#111111] border-neutral-200 hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar: Mobile filter trigger + Sort dropdown */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200/80 mb-8">
        {/* Mobile filter button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200/90 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filtros ({activeFiltersCount})</span>
        </button>

        {/* Active Filter Chips (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 flex-wrap flex-1 mr-4">
          {activeFiltersCount > 0 && (
            <span className="text-xs text-[#777777] font-semibold">Filtros activos:</span>
          )}
          {selectedBrands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 text-xs font-medium rounded-full text-[#111111] shadow-2xs">
              <span className="capitalize">{b}</span>
              <button onClick={() => toggleBrand(b)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedSizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200/90 text-xs font-medium rounded-full text-[#111111] shadow-2xs">
              Talle: {s}
              <button onClick={() => toggleSize(s)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {onlySale && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8102E]/10 border border-[#C8102E]/20 text-[#C8102E] text-xs font-medium rounded-full">
              En Oferta
              <button onClick={() => setOnlySale(false)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#777777] hover:text-[#111111] underline ml-2 cursor-pointer"
            >
              Borrar todos
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#777777] whitespace-nowrap">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-white border border-neutral-200/90 rounded-full px-4 py-2 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer shadow-2xs"
          >
            <option value="featured">Destacados</option>
            <option value="newest">Más recientes</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="best-seller">Más vendidos</option>
          </select>
        </div>
      </div>

      {/* Main Catalog Layout (Sidebar + Product Grid) */}
      <div className="flex gap-10">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 space-y-4">
            {/* Quick trigger for the Editorial Categories Menu with pill border styling */}
            <button
              onClick={() => setEditorialSidebarOpen(true)}
              className="w-full flex items-center justify-between px-5 py-3 bg-[#111111] text-white text-[11px] font-bold uppercase tracking-[0.18em] rounded-full hover:bg-black transition-all cursor-pointer shadow-sm group border-2 border-black"
            >
              <span className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Menú Colecciones</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {renderFilterPanel()}
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-neutral-300 rounded-3xl bg-neutral-50/50 p-8">
              <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 mx-auto flex items-center justify-center text-[#777777] mb-3 shadow-xs">
                <Filter className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#111111]">
                No hay productos con los filtros seleccionados
              </h3>
              <p className="text-xs text-[#777777] mt-1 max-w-sm mx-auto">
                Intentá ampliando el rango de precios o quitando algunas de las marcas o talles elegidos.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 px-6 py-2.5 bg-[#111111] border-2 border-black text-white hover:bg-transparent hover:text-black text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <div ref={catalogGridRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setMobileFilterOpen(false)} 
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#DCDCD9]">
              <span className="font-bold text-sm uppercase tracking-wider">Filtros</span>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#777777] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex-1">
              {renderFilterPanel()}
            </div>
            <div className="p-4 border-t border-[#DCDCD9] bg-white sticky bottom-0">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-11 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                Ver {filteredProducts.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Sidebar matching Home Page styling and hover edge trigger */}
      <EditorialSidebar
        isOpen={editorialSidebarOpen}
        onToggle={() => setEditorialSidebarOpen(!editorialSidebarOpen)}
        onOpen={() => setEditorialSidebarOpen(true)}
        onClose={() => setEditorialSidebarOpen(false)}
        isScrolled={true}
      />
    </div>
  );
};
