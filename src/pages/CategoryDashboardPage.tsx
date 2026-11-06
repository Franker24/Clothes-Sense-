import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Sparkles,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Gender, Product } from '../types';
import { formatARS } from '../utils/formatters';

interface DashboardConfig {
  gender: Gender;
  title: string;
  tagline: string;
  heroImage: string;
  heroMobileImage?: string;
  subcategories: { id: string; label: string; filterCat?: string; isSpecial?: boolean }[];
  shopCategories: {
    title: string;
    image: string;
    filterCat?: string;
    tag?: string;
  }[];
  promoBanner: {
    title: string;
    subtitle: string;
    image?: string;
    badge: string;
  };
}

export const CategoryDashboardPage: React.FC<{ defaultGender?: Gender }> = ({ defaultGender }) => {
  const params = useParams<{ gender?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { products, toggleWishlist, isInWishlist, addToCart } = useStore();

  // Determine current active gender
  const rawGender = params.gender || defaultGender || searchParams.get('gender') || 'ninos';
  const currentGender: Gender = useMemo(() => {
    const g = rawGender.toLowerCase();
    if (g === 'hombre' || g === 'hombres' || g === 'men') return 'hombre';
    if (g === 'mujer' || g === 'damas' || g === 'women') return 'mujer';
    return 'ninos';
  }, [rawGender]);

  // Active subcategory filter
  const [activeSubTab, setActiveSubTab] = useState<string>('todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<string>('novedades');
  const [heroSlide, setHeroSlide] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const novedadesScrollRef = useRef<HTMLDivElement>(null);
  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Configuration for each gender's dashboard
  const config: DashboardConfig = useMemo(() => {
    if (currentGender === 'ninos') {
      return {
        gender: 'ninos',
        title: 'SENSE KIDS',
        tagline: 'Pequeños looks. Grandes aventuras.',
        heroImage: '/images/dashboard/kids/hero.jpg',
        subcategories: [
          { id: 'todos', label: 'Todos' },
          { id: 'ninos', label: 'Niños', filterCat: 'buzos-hoodies' },
          { id: 'ninas', label: 'Niñas', filterCat: 'remeras-tops' },
          { id: 'bebes', label: 'Bebés', filterCat: 'remeras-tops' },
          { id: 'marcas', label: 'Marcas', isSpecial: true },
          { id: 'ofertas', label: 'Ofertas', isSpecial: true },
        ],
        shopCategories: [
          {
            title: 'Niños',
            image: '/images/dashboard/kids/cat-ninos.jpg',
            filterCat: 'buzos-hoodies',
            tag: 'BOYS COLLECTION'
          },
          {
            title: 'Niñas',
            image: '/images/dashboard/kids/cat-ninas.jpg',
            filterCat: 'remeras-tops',
            tag: 'GIRLS COLLECTION'
          },
          {
            title: 'Bebés',
            image: '/images/dashboard/kids/cat-bebes.jpg',
            filterCat: 'remeras-tops',
            tag: 'BABY ESSENTIALS'
          },
        ],
        promoBanner: {
          title: 'NUEVA TEMPORADA',
          subtitle: 'Descubrí las últimas tendencias en moda infantil.',
          image: '/images/dashboard/kids/promo-banner.jpg',
          badge: 'DROP INFANTIL 2026'
        }
      };
    }

    if (currentGender === 'hombre') {
      return {
        gender: 'hombre',
        title: 'SENSE MEN',
        tagline: 'Siluetas urbanas. Máximo confort.',
        heroImage: '/images/categoria/hombres.png',
        subcategories: [
          { id: 'todos', label: 'Todos' },
          { id: 'remeras', label: 'Remeras', filterCat: 'remeras-tops' },
          { id: 'buzos', label: 'Buzos & Hoodies', filterCat: 'buzos-hoodies' },
          { id: 'pantalones', label: 'Pantalones & Jeans', filterCat: 'pantalones-jeans' },
          { id: 'calzado', label: 'Calzado', filterCat: 'calzado-zapatillas' },
          { id: 'marcas', label: 'Marcas', isSpecial: true },
          { id: 'ofertas', label: 'Ofertas', isSpecial: true },
        ],
        shopCategories: [
          {
            title: 'Remeras & Tops',
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
            filterCat: 'remeras-tops',
            tag: 'OVERSIZE & GRAPHIC'
          },
          {
            title: 'Jeans & Cargo',
            image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
            filterCat: 'pantalones-jeans',
            tag: 'DENIM ARCHIVE'
          },
          {
            title: 'Calzado & Zapas',
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
            filterCat: 'calzado-zapatillas',
            tag: 'SNEAKERS'
          },
        ],
        promoBanner: {
          title: 'NUEVA TEMPORADA',
          subtitle: 'Descubrí las últimas tendencias en streetwear y calzado urbano.',
          image: '/assets/aistudio/marcas1_1399340a.png',
          badge: 'DROP MASCULINO 2026'
        }
      };
    }

    // Default: Damas / Mujer
    return {
      gender: 'mujer',
      title: 'SENSE WOMEN',
      tagline: 'Estilo contemporáneo. Actitud sin límites.',
      heroImage: '/images/categoria/damas.png',
      subcategories: [
        { id: 'todos', label: 'Todos' },
        { id: 'tops', label: 'Tops & Remeras', filterCat: 'remeras-tops' },
        { id: 'buzos', label: 'Buzos & Abrigos', filterCat: 'buzos-hoodies' },
        { id: 'jeans', label: 'Jeans & Sastrería', filterCat: 'pantalones-jeans' },
        { id: 'calzado', label: 'Calzado', filterCat: 'calzado-zapatillas' },
        { id: 'marcas', label: 'Marcas', isSpecial: true },
        { id: 'ofertas', label: 'Ofertas', isSpecial: true },
      ],
      shopCategories: [
        {
          title: 'Tops & Remeras',
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
          filterCat: 'remeras-tops',
          tag: 'BASIC ELEVATION'
        },
        {
          title: 'Denim & Sastrería',
          image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
          filterCat: 'pantalones-jeans',
          tag: 'WIDE LEG & TAILORING'
        },
        {
          title: 'Calzado & Botas',
          image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
          filterCat: 'calzado-zapatillas',
          tag: 'RETRO & PLATFORM'
        },
      ],
      promoBanner: {
        title: 'NUEVA TEMPORADA',
        subtitle: 'Descubrí las últimas tendencias en moda femenina contemporánea.',
        image: '/assets/aistudio/marcas_b2a92e70.png',
        badge: 'DROP FEMENINO 2026'
      }
    };
  }, [currentGender]);

  // Reset tab when gender switches
  useEffect(() => {
    setActiveSubTab('todos');
    setSelectedBrand('todas');
  }, [currentGender]);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  // Scroll novedades carousel left/right
  const scrollNovedades = (direction: 'left' | 'right') => {
    if (!novedadesScrollRef.current) return;
    const scrollAmount = 320;
    novedadesScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Scroll smoothly to full collection
  const scrollToCollection = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter products for this gender
  const genderProducts = useMemo(() => {
    return products.filter((p) => {
      if (currentGender === 'ninos') return p.gender === 'ninos';
      return p.gender === currentGender || p.gender === 'unisex';
    });
  }, [products, currentGender]);

  // Novedades: 5 curated spotlight products matching the mockups exactly
  const novedadesProducts = useMemo(() => {
    if (currentGender === 'ninos') {
      // Prioritize the 5 kids products from the screenshot:
      // Nike Remera Logo, Adidas Buzo Essentials, Puma Remera Better, Adidas Pantalón Deportivo, Levi's Buzo Logo
      const screenshotKidsIds = [
        'prod-kids-nike-remera',
        'prod-kids-adidas-buzo',
        'prod-kids-puma-remera',
        'prod-kids-adidas-pant',
        'prod-kids-levis-buzo'
      ];
      const matched = screenshotKidsIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as Product[];

      if (matched.length > 0) return matched;
      return genderProducts.slice(0, 5);
    }

    // For Hombres & Damas: 5 newest and featured items
    const featured = genderProducts.filter((p) => p.isNew || p.isFeatured || p.isBestSeller);
    return (featured.length >= 5 ? featured : genderProducts).slice(0, 5);
  }, [genderProducts, currentGender, products]);

  // Filtered collection for the bottom section
  const catalogProducts = useMemo(() => {
    let list = [...genderProducts];

    // Filter by subcategory
    const activeSub = config.subcategories.find((s) => s.id === activeSubTab);
    if (activeSub && activeSub.filterCat) {
      list = list.filter((p) => p.category === activeSub.filterCat);
    } else if (activeSubTab === 'ofertas') {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Filter by brand
    if (selectedBrand !== 'todas') {
      list = list.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Sort
    switch (sortBy) {
      case 'precio-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'precio-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'mas-vendidos':
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'novedades':
      default:
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return list;
  }, [genderProducts, activeSubTab, selectedBrand, sortBy, config]);

  // Handle category card click
  const handleCategoryCardClick = (filterCat?: string) => {
    if (filterCat) {
      const matchingSub = config.subcategories.find((s) => s.filterCat === filterCat);
      if (matchingSub) setActiveSubTab(matchingSub.id);
    }
    scrollToCollection();
  };

  const handleSubTabClick = (sub: typeof config.subcategories[0]) => {
    if (sub.id === 'marcas') {
      navigate('/brands');
      return;
    }
    if (sub.id === 'ofertas') {
      setActiveSubTab('ofertas');
      scrollToCollection();
      return;
    }
    setActiveSubTab(sub.id);
    scrollToCollection();
  };

  const handleQuickWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    const added = !isInWishlist(product.id);
    setToastMsg(added ? `Agregaste "${product.name}" a tus favoritos` : `Quitaste "${product.name}" de tus favoritos`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.availableColors?.[0] || { name: 'Predeterminado', hex: '#111111' };
    const size = product.availableSizes?.[0] || 'M';
    addToCart(product, color.name, color.hex, size, 1);
    setToastMsg(`Agregaste "${product.name}" a tu bolsa`);
  };

  return (
    <div className="w-full bg-white text-[#111111] min-h-screen">
      
      {/* 
        1. TOP CATEGORY NAVIGATION TABS (MATCHING USER SCREENSHOT EXACTLY)
        Clean white bar with active underline indicator
      */}
      <nav className="w-full border-b border-neutral-200 bg-white sticky top-16 sm:top-20 z-30 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between overflow-x-auto hide-scrollbar py-1">
            <div className="flex items-center gap-6 sm:gap-10">
              {config.subcategories.map((sub) => {
                const isActive = activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubTabClick(sub)}
                    className={`py-3 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap cursor-pointer transition-all relative ${
                      isActive 
                        ? 'text-black font-extrabold' 
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Gender Switch Pills */}
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-neutral-200">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">Colección:</span>
              <Link
                to="/kids"
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  currentGender === 'ninos'
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Niños
              </Link>
              <Link
                to="/hombres"
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  currentGender === 'hombre'
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Hombres
              </Link>
              <Link
                to="/damas"
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  currentGender === 'mujer'
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Damas
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 
        2. HERO BANNER (MATCHING USER SCREENSHOT EXACTLY)
        Left: Bold SENSE KIDS / MEN / WOMEN + Slogan + Black Button
        Right: High-impact lifestyle photography of the models
        Bottom Right: Circle carousel controls < >
      */}
      <section className="w-full bg-[#F4F4F4] overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto">
          {/* Responsive Hero Container */}
          <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center">
            
            {/* Background Lifestyle Photography */}
            <div className="absolute inset-0 z-0">
              <img
                src={config.heroImage}
                alt={config.title}
                className="w-full h-full object-cover object-top sm:object-center filter brightness-100"
              />
              {/* Subtle gradient scrim so white typography on the left remains ultra-legible */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-3/5" />
            </div>

            {/* Hero Typographic Content (Left Aligned) */}
            <div className="relative z-10 px-6 sm:px-12 md:px-16 py-12 max-w-xl flex flex-col items-start">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-[#111111] uppercase leading-[0.95]">
                {config.title.split(' ')[0]}
                <br />
                {config.title.split(' ')[1] || ''}
              </h1>

              <p className="mt-4 sm:mt-5 text-base sm:text-xl font-medium text-[#222222] max-w-md leading-snug">
                {config.tagline}
              </p>

              <button
                onClick={scrollToCollection}
                className="mt-6 sm:mt-8 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-[3px] flex items-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer group"
              >
                <span>Descubrir Colección</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Bottom-right carousel arrows matching mockup */}
            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-10 z-10 flex items-center gap-2">
              <button
                onClick={() => setHeroSlide((prev) => (prev === 0 ? 1 : 0))}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-black shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90 border border-neutral-200"
                aria-label="Anterior slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setHeroSlide((prev) => (prev === 0 ? 1 : 0))}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-black shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90 border border-neutral-200"
                aria-label="Siguiente slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 
        3. VALUE PROPOSITION STRIP (EXACT 3-COLUMN TREATMENT FROM MOCKUP)
        - Envíos a todo el país
        - Comprá como invitado
        - Compras seguras
      */}
      <section className="w-full bg-white border-b border-neutral-200 py-4 sm:py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 gap-3 md:gap-0">
            
            {/* Benefit 1 */}
            <div className="flex items-center justify-center gap-3 py-2 sm:px-6">
              <Truck className="w-5 h-5 text-[#111111] stroke-[1.7]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#111111]">
                Envíos a todo el país
              </span>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-center justify-center gap-3 py-2 sm:px-6">
              <CreditCard className="w-5 h-5 text-[#111111] stroke-[1.7]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#111111]">
                Comprá como invitado
              </span>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-center justify-center gap-3 py-2 sm:px-6">
              <ShieldCheck className="w-5 h-5 text-[#111111] stroke-[1.7]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#111111]">
                Compras seguras
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 
        4. "SHOP POR CATEGORÍA" SECTION (EXACT 3-CARD LAYOUT FROM MOCKUP)
        Left: Shop por categoría
        Right: VER TODAS →
        Cards: 3 photographic blocks with title & "VER COLECCIÓN →"
      */}
      <section className="w-full bg-white py-10 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-display text-[#111111]">
              Shop por categoría
            </h2>
            <button
              onClick={scrollToCollection}
              className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1 group cursor-pointer"
            >
              <span>Ver Todas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 3 Large Photographic Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {config.shopCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryCardClick(cat.filterCat)}
                className="relative aspect-[4/3] sm:aspect-[16/10] rounded-[3px] overflow-hidden bg-neutral-100 group cursor-pointer shadow-2xs hover:shadow-xl transition-all duration-300"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Text Content at Bottom Left */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col items-start text-white">
                  {cat.tag && (
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-300 mb-1">
                      {cat.tag}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {cat.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/90 group-hover:text-white group-hover:underline">
                    <span>Ver Colección</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 
        5. "NOVEDADES" SECTION (PRODUCT CAROUSEL / ROW MATCHING MOCKUP)
        Left: Novedades
        Right: Carousel Navigation Buttons < >
        Cards: 5 Clean products with Heart icon, Brand, Title, Price and Discount
      */}
      <section className="w-full bg-white pb-12 sm:pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-display text-[#111111]">
              Novedades
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollNovedades('left')}
                className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft className="w-4 h-4 text-neutral-700" />
              </button>
              <button
                onClick={() => scrollNovedades('right')}
                className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight className="w-4 h-4 text-neutral-700" />
              </button>
            </div>
          </div>

          {/* Product Row / Slider (5 Products) */}
          <div
            ref={novedadesScrollRef}
            className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4 pt-1 snap-x snap-mandatory"
          >
            {novedadesProducts.map((product) => {
              const isFav = isInWishlist(product.id);
              const discount = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                : 0;

              return (
                <div
                  key={product.id}
                  className="w-[200px] sm:w-[240px] md:w-[260px] shrink-0 snap-start bg-[#F9F9F8] rounded-[4px] p-3 sm:p-4 flex flex-col justify-between group transition-all duration-300 hover:shadow-lg border border-neutral-200/80 hover:border-neutral-300 relative"
                >
                  {/* Top Wishlist Heart Button */}
                  <button
                    onClick={(e) => handleQuickWishlist(e, product)}
                    aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-neutral-700 stroke-[1.7]'
                      }`}
                    />
                  </button>

                  {/* Product Image Area */}
                  <Link
                    to={`/product/${product.id}`}
                    className="block aspect-square w-full rounded-[2px] overflow-hidden mb-3 relative bg-white flex items-center justify-center p-2"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Quick Add Overlay on Desktop Hover */}
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="absolute inset-x-2 bottom-2 py-2 bg-black/90 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Comprar</span>
                    </button>
                  </Link>

                  {/* Product Meta */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-neutral-600 block uppercase tracking-wider mb-0.5">
                        {product.brand}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-xs sm:text-sm font-semibold text-[#111111] hover:underline line-clamp-1 block leading-tight"
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Price and Discount Tag */}
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-extrabold text-[#111111]">
                        {formatARS(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-[11px] text-neutral-400 line-through">
                            {formatARS(product.originalPrice)}
                          </span>
                          <span className="text-[10px] font-bold bg-[#111111] text-white px-1.5 py-0.5 rounded-[2px]">
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 
        6. SECONDARY PROMO CAMPAIGN BANNER (MATCHING MOCKUP EXACTLY)
        "NUEVA TEMPORADA - Descubrí las últimas tendencias en moda infantil. EXPLORAR →"
      */}
      <section className="w-full bg-white pb-14 sm:pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          
          <div className="relative rounded-[4px] overflow-hidden bg-[#ECECE9] border border-neutral-300 grid grid-cols-1 md:grid-cols-12 items-center min-h-[200px] sm:min-h-[240px]">
            
            {/* Promo Banner Visual */}
            <div className="md:col-span-6 h-48 md:h-full relative overflow-hidden">
              <img
                src={config.promoBanner.image || config.heroImage}
                alt={config.promoBanner.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#ECECE9] hidden md:block" />
            </div>

            {/* Promo Banner Copy & Action */}
            <div className="md:col-span-6 p-6 sm:p-10 flex flex-col items-start justify-center">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-1">
                {config.promoBanner.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-[#111111] uppercase leading-tight">
                {config.promoBanner.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-md font-medium">
                {config.promoBanner.subtitle}
              </p>
              <button
                onClick={scrollToCollection}
                className="mt-5 px-6 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95"
              >
                <span>Explorar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 
        7. FULL FILTERABLE CATALOG SECTION (#coleccion)
        Allows visitors to browse all products of this gender with instant filters
      */}
      <section ref={catalogSectionRef} id="coleccion" className="w-full bg-[#FAFAFA] py-14 sm:py-20 border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          
          {/* Section Heading & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Catálogo Oficial
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span className="text-[11px] font-semibold text-black uppercase">
                  {catalogProducts.length} {catalogProducts.length === 1 ? 'producto' : 'prendas disponibles'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#111111] mt-1">
                Toda la Colección {config.title.replace('SENSE ', '')}
              </h2>
            </div>

            {/* Quick Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Brand Selector */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="text-xs font-semibold bg-white border border-neutral-300 rounded-[3px] px-3 py-2 text-[#111111] focus:outline-none focus:border-black cursor-pointer shadow-2xs"
              >
                <option value="todas">Todas las marcas</option>
                <option value="nike">Nike</option>
                <option value="adidas">Adidas</option>
                <option value="puma">Puma</option>
                <option value="levis">Levi's</option>
                <option value="new-balance">New Balance</option>
                <option value="converse">Converse</option>
              </select>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-white border border-neutral-300 rounded-[3px] px-3 py-2 text-[#111111] focus:outline-none focus:border-black cursor-pointer shadow-2xs"
              >
                <option value="novedades">Más recientes</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="mas-vendidos">Más vendidos</option>
              </select>

              {(activeSubTab !== 'todos' || selectedBrand !== 'todas') && (
                <button
                  onClick={() => {
                    setActiveSubTab('todos');
                    setSelectedBrand('todas');
                  }}
                  className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Products */}
          {catalogProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[4px] border border-dashed border-neutral-300 p-8">
              <p className="text-base font-bold text-neutral-800">
                No encontramos productos con los filtros seleccionados
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Probá seleccionando "Todos" o cambiando de marca.
              </p>
              <button
                onClick={() => {
                  setActiveSubTab('todos');
                  setSelectedBrand('todas');
                }}
                className="mt-4 px-5 py-2 bg-black text-white text-xs font-bold uppercase rounded-[2px]"
              >
                Ver todos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {catalogProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Floating Wishlist Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-4 py-3 rounded-[3px] text-xs font-semibold shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};

