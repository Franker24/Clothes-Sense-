import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { DiscountTape } from '../components/common/DiscountTape';
import { GenderCategoriesSection } from '../components/home/GenderCategoriesSection';
import { FeaturedBrandsSection } from '../components/home/FeaturedBrandsSection';
import { EditorialSidebar } from '../components/layout/EditorialSidebar';
import { StoreLocatorModal } from '../components/common/StoreLocatorModal';
import { 
  animateHeroElements, 
  animateProductGrid, 
  animateCategoryBoxes, 
  animateExclusiveBanner 
} from '../utils/animations';

// Dedicated SVG Icon Component matching App_fdab7e0f.tsx exactly
type IconName = "menu" | "close" | "search" | "pin" | "user" | "bag" | "arrow" | "sparkle";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21c.7-4.2 3.2-6 7.5-6s6.8 1.8 7.5 6" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    sparkle: (
      <>
        <path d="M12 2c.7 5 2 6.3 7 7-5 .7-6.3 2-7 7-.7-5-2-6.3-7-7 5-.7 6.3-2 7-7Z" />
        <path d="M19 16c.3 2.2.8 2.7 3 3-2.2.3-2.7.8-3 3-.3-2.2-.8-2.7-3-3 2.2-.3 2.7-.8 3-3Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {paths[name]}
    </svg>
  );
}

const promos = [
  "6 cuotas sin interés",
  "Envío gratis desde $85.000",
  "20% off transferencia",
  "Cambios gratis",
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, cartItemCount, setIsCartOpen, addToCart } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [storeLocatorOpen, setStoreLocatorOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Sidebar state
  const [menuOpen, setMenuOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Best sellers gender tabs
  const [bestSellerTab, setBestSellerTab] = useState<'mujer' | 'hombre' | 'ninos'>('mujer');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterErrorMsg, setNewsletterErrorMsg] = useState('');

  // Animation refs for GSAP
  const heroContentRef = useRef<HTMLDivElement>(null);
  const featuredSectionRef = useRef<HTMLElement>(null);
  const featuredGridRef = useRef<HTMLDivElement>(null);
  const genderCategoriesRef = useRef<HTMLDivElement>(null);
  const bestSellersSectionRef = useRef<HTMLElement>(null);
  const bestSellersGridRef = useRef<HTMLDivElement>(null);
  const exclusiveBannerRef = useRef<HTMLElement>(null);
  const brandsSectionRef = useRef<HTMLDivElement>(null);

  const heroSlides = [
    {
      eyebrow: "F I N D   Y O U R   S E N S E .",
      title: "NUEVA\nTEMPORADA",
      subtitle: "Descubrí las últimas tendencias en moda urbana y contemporánea.",
      image: "/images/homeimg.png",
      ctaText: "EXPLORAR COLECCIÓN",
      ctaLink: "/catalog",
    },
    {
      eyebrow: "S S 2 7   D R O P .",
      title: "STREET\nARCHIVE",
      subtitle: "Siluetas oversize, denim relaxed y calzado de edición limitada.",
      image: "/images/homeimg.png",
      ctaText: "VER NOVEDADES",
      ctaLink: "/catalog?sort=newest",
    },
    {
      eyebrow: "E X C L U S I V E   R E L E A S E .",
      title: "URBAN\nESSENTIALS",
      subtitle: "Básicos elevados y camperas streetwear para todos los días.",
      image: "/images/homeimg.png",
      ctaText: "DESCUBRIR",
      ctaLink: "/hombres",
    },
  ];

  const brandLogos = [
    { name: 'Nike', slug: 'nike', logo: '/images/brands-strip/logo-nike.png' },
    { name: 'Adidas', slug: 'adidas', logo: '/images/brands-strip/logo-adidas.png' },
    { name: 'Puma', slug: 'puma', logo: '/images/brands-strip/logo-puma.png' },
    { name: "Levi's", slug: 'levis', logo: '/images/brands-strip/logo-levis.png' },
    { name: 'New Balance', slug: 'new-balance', logo: '/images/brands-strip/logo-newbalance.png' },
    { name: 'Converse', slug: 'converse', logo: '/images/brands-strip/logo-converse.png' },
  ];

  // GSAP Entrance & Scroll Animations
  useEffect(() => {
    const revertHero = animateHeroElements(heroContentRef.current);
    const revertFeatured = animateProductGrid(featuredGridRef.current, featuredSectionRef.current);
    const revertCategories = animateCategoryBoxes(genderCategoriesRef.current);
    const revertExclusive = animateExclusiveBanner(exclusiveBannerRef.current);
    const revertBrands = animateCategoryBoxes(brandsSectionRef.current);

    return () => {
      if (revertHero) revertHero();
      if (revertFeatured) revertFeatured();
      if (revertCategories) revertCategories();
      if (revertExclusive) revertExclusive();
      if (revertBrands) revertBrands();
    };
  }, []);

  // Re-animate Best Sellers when changing gender tab
  useEffect(() => {
    const revertBestSellers = animateProductGrid(bestSellersGridRef.current, bestSellersSectionRef.current);
    return () => {
      if (revertBestSellers) revertBestSellers();
    };
  }, [bestSellerTab]);

  // Track window scroll to switch sidebar and header between transparent and Black & White
  // Automatically minimizes the sidebar on scroll, and re-expands it when back at the top of home
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setIsScrolled((prevScrolled) => {
        if (prevScrolled !== scrolled) {
          if (scrolled) {
            setMenuOpen(false); // Minimize on scroll
          } else {
            setMenuOpen(true); // Visible on home top
          }
        }
        return scrolled;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search overlay on Escape
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shopNow = () => {
    if (products.length > 0) {
      const featured = products[0];
      const color = featured.availableColors?.[0] || { name: 'Predeterminado', hex: '#111111' };
      const size = featured.availableSizes?.[0] || 'M';
      addToCart(featured, color.name, color.hex, size, 1);
    }
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };

  const handleSuggestionClick = (term: string) => {
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail || !emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterErrorMsg('Por favor ingresá un correo electrónico válido.');
      return;
    }
    setNewsletterStatus('success');
    setNewsletterErrorMsg('');
  };

  // Featured Products (proddes.png style: Ezur, Bondone, Detroit, Lazlo first)
  const proddesItems = products.filter((p) => p.id.startsWith('proddes-'));
  const otherFeatured = products.filter((p) => !p.id.startsWith('proddes-') && (p.isFeatured || p.isNew));
  const featuredProducts = [...proddesItems, ...otherFeatured].slice(0, 8);

  const bestSellers = products.filter((p) => {
    if (bestSellerTab === 'ninos') return p.gender === 'ninos';
    return p.gender === bestSellerTab || p.gender === 'unisex';
  }).slice(0, 8);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-white text-[#111111]">

      {/* EDITORIAL SIDEBAR — visible on home, auto-minimizes on scroll */}
      <EditorialSidebar
        isOpen={menuOpen}
        onToggle={() => setMenuOpen((prev) => !prev)}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        isScrolled={isScrolled}
      />
      
      {/* 
        HERO SECTION — Full-bleed image, no white gradient, text with text-shadow for legibility
      */}
      <section className="relative w-full overflow-hidden">
        <div className="relative min-h-[560px] sm:min-h-[620px] md:min-h-[700px] lg:min-h-[92vh] flex items-end sm:items-center">
          
          {/* Background Photography — full coverage, no gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroSlides[currentSlide].image}
              alt="SENSE — Nueva Temporada"
              className="w-full h-full object-cover object-[65%_20%] sm:object-[60%_25%] md:object-[center_20%] transition-opacity duration-700"
            />
            {/* Subtle dark vignette for text legibility — NOT white */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent sm:w-3/5" />
          </div>

          {/* Hero Content (Left-bottom aligned, white text on photo) */}
          <div ref={heroContentRef} className="relative z-10 max-w-[1440px] mx-auto w-full px-5 sm:px-10 md:px-14 pb-14 sm:pb-0 sm:py-16 flex flex-col items-start justify-end sm:justify-center">
            
            {/* Eyebrow Label */}
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.28em] uppercase text-white/90 mb-3 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {heroSlides[currentSlide].eyebrow}
            </span>

            {/* Massive Bold Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-black tracking-[-0.035em] font-sans text-white uppercase leading-[0.88] select-none whitespace-pre-line drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              {heroSlides[currentSlide].title}
            </h1>

            {/* Clean Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/90 max-w-md font-medium leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* CTA Button */}
            <Link
              to={heroSlides[currentSlide].ctaLink}
              className="mt-6 sm:mt-8 px-7 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-neutral-100 text-black text-xs sm:text-sm font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-2.5 transition-all shadow-lg active:scale-95 cursor-pointer group"
            >
              <span>{heroSlides[currentSlide].ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Bottom-left slider indicators: 01 / 03 and circular arrow buttons */}
            <div className="mt-10 sm:mt-14 flex items-center gap-3 select-none">
              <span className="text-xs font-mono font-bold tracking-widest text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                0{currentSlide + 1} / 0{heroSlides.length}
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/40 bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/40 bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
                  aria-label="Siguiente slide"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 
        OFFICIAL BRANDS STRIP (MATCHING REFERENCE IMAGE EXACTLY)
        Nike | Adidas | Puma | Levi's | New Balance | Converse
      */}
      <section className="w-full bg-white border-b border-neutral-200 py-3.5 sm:py-5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-neutral-200 items-center justify-center">
            {brandLogos.map((brand) => (
              <Link
                key={brand.slug}
                to={`/catalog?brand=${brand.slug}`}
                className="flex items-center justify-center px-4 py-2 hover:opacity-75 transition-opacity group"
                title={`Ver productos ${brand.name}`}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-6 sm:h-7 md:h-8 object-contain filter contrast-125 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 
        SEARCH OVERLAY MODAL
      */}
      {searchOpen && (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar productos"
        >
          <button
            className="search-close cursor-pointer"
            onClick={() => setSearchOpen(false)}
            aria-label="Cerrar búsqueda"
          >
            <Icon name="close" size={30} />
          </button>
          <div>
            <p>¿Qué estás buscando?</p>
            <form onSubmit={handleSearchSubmit}>
              <label>
                <span className="sr-only">Buscar productos</span>
                <input
                  autoFocus
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Escribí para buscar..."
                />
                <button type="submit" aria-label="Ejecutar búsqueda" className="cursor-pointer">
                  <Icon name="search" size={28} />
                </button>
              </label>
            </form>
            <div className="search-suggestions">
              <span>Popular:</span>
              <button className="cursor-pointer" onClick={() => handleSuggestionClick('Camperas')}>Camperas</button>
              <button className="cursor-pointer" onClick={() => handleSuggestionClick('Denim')}>Denim</button>
              <button className="cursor-pointer" onClick={() => handleSuggestionClick('Botas')}>Botas</button>
              <button className="cursor-pointer" onClick={() => handleSuggestionClick('Camisa')}>Camisa</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (Black & White) */}
      <div className="toast" data-visible={toastVisible}>
        Look agregado a tu bolsa
      </div>

      {/* Store Locator Modal */}
      <StoreLocatorModal 
        isOpen={storeLocatorOpen} 
        onClose={() => setStoreLocatorOpen(false)} 
      />

      {/* 
        SECTION: CINTA DE BENEFICIOS Y DESCUENTOS
      */}
      <div className="relative z-10">
        <DiscountTape />
      </div>

      {/* 
        SECTION: SHOP BY CATEGORY (DAMAS, NIÑOS, HOMBRES)
      */}
      <div ref={genderCategoriesRef} className="relative z-10 bg-[#FAFAFA] text-[#111111]">
        <GenderCategoriesSection />
      </div>

      {/* 
        SECTION: PRODUCTOS DESTACADOS (FULL-WIDTH PRODUCT GRID)
      */}
      <section ref={featuredSectionRef} className="bg-white text-[#111111] py-12 sm:py-20 border-t border-[#DCDCD9] relative z-10 w-full">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          
          {/* Centered header */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display text-[#111111]">
              Productos destacados
            </h2>
          </div>

          {/* Product Grid stretching across full viewport width */}
          <div ref={featuredGridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 w-full">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 
        SECTION: MÁS VENDIDOS WITH INTERACTIVE TABS (FULL-WIDTH PRODUCT GRID)
      */}
      <section ref={bestSellersSectionRef} className="bg-white text-[#111111] py-12 sm:py-20 border-t border-[#DCDCD9] relative z-10 w-full">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#777777]">
                Favoritos de la temporada
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111111] mt-0.5 sm:mt-1">
                Más vendidos
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Interactive Gender Tabs */}
              <div className="flex items-center gap-1 bg-[#F3F3F1] p-1 rounded-md border border-[#DCDCD9]">
                <button
                  onClick={() => setBestSellerTab('mujer')}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer active:scale-95 ${
                    bestSellerTab === 'mujer'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-[#777777] hover:text-[#111111]'
                  }`}
                >
                  Damas
                </button>
                <button
                  onClick={() => setBestSellerTab('hombre')}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer active:scale-95 ${
                    bestSellerTab === 'hombre'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-[#777777] hover:text-[#111111]'
                  }`}
                >
                  Hombres
                </button>
                <button
                  onClick={() => setBestSellerTab('ninos')}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer active:scale-95 ${
                    bestSellerTab === 'ninos'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-[#777777] hover:text-[#111111]'
                  }`}
                >
                  Niños
                </button>
              </div>

              <Link
                to={bestSellerTab === 'mujer' ? '/damas' : bestSellerTab === 'hombre' ? '/hombres' : '/kids'}
                className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                Ver todo {bestSellerTab === 'mujer' ? 'Damas' : bestSellerTab === 'hombre' ? 'Hombres' : 'Niños'} →
              </Link>
            </div>
          </div>

          {/* Product Grid stretching across full viewport width */}
          <div ref={bestSellersGridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 w-full">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 
        SECTION: OPORTUNIDAD EXCLUSIVA
      */}
      <section ref={exclusiveBannerRef} className="bg-[#111111] text-white relative z-10 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="exclusive-img-anim relative aspect-[4/3] lg:aspect-auto min-h-[280px] sm:min-h-[380px] bg-[#1a1a1a] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial Sale"
              className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 group-hover:scale-102"
            />
          </div>

          <div className="exclusive-text-anim p-6 sm:p-14 lg:p-20 flex flex-col justify-center items-start">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/80 mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              OPORTUNIDAD EXCLUSIVA
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              Hasta 50% OFF + 25% Extra.
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-neutral-300 leading-relaxed font-normal max-w-lg">
              Zapatillas de colección, camperas streetwear y denim seleccionado con descuentos por tiempo limitado. Pagá en 3 y 6 cuotas sin interés y recibilo en todo el país.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/catalog?sale=true"
                className="h-11 sm:h-12 px-8 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Ver Todas las Ofertas
              </Link>
              <span className="text-xs text-neutral-400 font-mono text-center sm:text-left">
                CUPÓN: <strong className="text-white">SENSE10</strong> para 10% extra
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 
        SECTION: LAS MARCAS MÁS GRANDES (DIRECTLY BELOW OPORTUNIDAD EXCLUSIVA)
      */}
      <div ref={brandsSectionRef} className="relative z-10">
        <FeaturedBrandsSection />
      </div>

      {/* 
        SECTION: NEWSLETTER
      */}
      <section className="bg-[#F3F3F1] text-[#111111] py-20 px-4 sm:px-8 text-center border-t border-[#DCDCD9] relative z-10">
        <div className="max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#777777]">
            Comunidad Oficial
          </span>
          <h2 className="text-3xl font-bold font-display text-[#111111] mt-2">
            Sumate al Club
          </h2>
          <p className="text-sm text-[#777777] mt-3">
            Accedé primero a los lanzamientos de temporada, drops exclusivos y descuentos privados. Sin spam, prometido.
          </p>

          {newsletterStatus === 'success' ? (
            <div className="mt-6 p-4 bg-white border border-[#DCDCD9] rounded flex items-center justify-center gap-2 text-sm text-[#111111]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>¡Listo! Ya formás parte del club. Revisá tu casilla de correo.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2" noValidate>
              <input
                type="email"
                placeholder="Ingresá tu correo electrónico"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setNewsletterStatus('idle');
                }}
                className="flex-1 h-12 px-4 text-sm bg-white border border-[#DCDCD9] rounded text-[#111111] placeholder:text-[#777777] focus:outline-none focus:border-[#111111]"
              />
              <button
                type="submit"
                className="h-12 px-8 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Suscribirme
              </button>
            </form>
          )}

          {newsletterStatus === 'error' && (
            <p className="mt-2 text-xs text-[#C8102E]">{newsletterErrorMsg}</p>
          )}

          <p className="text-[11px] text-[#777777] mt-4">
            Al suscribirte aceptás nuestros términos y condiciones y políticas de privacidad.
          </p>
        </div>
      </section>

    </main>
  );
};
