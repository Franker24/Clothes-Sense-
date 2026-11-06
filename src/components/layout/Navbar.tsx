import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  MapPin,
  User, 
  ShoppingBag, 
  Heart,
  Menu, 
  X, 
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreLocatorModal } from '../common/StoreLocatorModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { 
    cartItemCount, 
    wishlistCount, 
    setIsCartOpen, 
    setIsSearchOpen, 
    currentUser,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeLocatorOpen, setStoreLocatorOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  // Track scroll for transparent → solid transition on home
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    handleScroll(); // initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Hombre', href: '/hombres', activeMatch: '/hombres' },
    { label: 'Mujer', href: '/damas', activeMatch: '/damas' },
    { label: 'Niños', href: '/kids', activeMatch: '/kids' },
    { label: 'Marcas', href: '/brands', activeMatch: '/brands' },
    { label: 'Ofertas', href: '/catalog?sale=true', activeMatch: 'sale=true' },
  ];

  const isLinkActive = (item: typeof navLinks[0]) => {
    if (item.activeMatch === 'sale=true') {
      return location.search.includes('sale=true');
    }
    return location.pathname === item.activeMatch;
  };

  // Transparent mode: on home page and not scrolled
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent text-white'
            : 'bg-white/95 backdrop-blur-md text-[#111111] border-b border-neutral-200 shadow-2xs'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo Wordmark */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 -ml-2 focus:outline-none cursor-pointer transition-colors ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-neutral-800 hover:text-black'
              }`}
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>

            <Link 
              to="/" 
              className={`text-2xl sm:text-3xl font-black font-display tracking-tight uppercase select-none transition-colors ${
                isTransparent 
                  ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:opacity-90' 
                  : 'text-[#111111] hover:opacity-85'
              }`}
            >
              SENSE
            </Link>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold tracking-wide">
            {navLinks.map((item) => {
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`py-2 relative transition-all cursor-pointer ${
                    isTransparent
                      ? active
                        ? 'text-white font-extrabold'
                        : 'text-white/80 hover:text-white font-medium'
                      : active 
                        ? 'text-black font-extrabold' 
                        : 'text-neutral-600 hover:text-black font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                      isTransparent ? 'bg-white' : 'bg-black'
                    }`} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* 1. Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isTransparent 
                  ? 'text-white hover:bg-white/15' 
                  : 'text-[#111111] hover:bg-neutral-100'
              }`}
              aria-label="Buscar en la tienda"
              title="Buscar"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
            </button>

            {/* 2. Wishlist Heart */}
            <Link
              to="/favorites"
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isTransparent 
                  ? 'text-white hover:bg-white/15' 
                  : 'text-[#111111] hover:bg-neutral-100'
              }`}
              aria-label={`Favoritos (${wishlistCount})`}
              title="Favoritos"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
              <span className={`absolute top-0.5 right-0.5 min-w-[16px] h-[16px] text-[9.5px] font-bold flex items-center justify-center rounded-full px-1 shadow-2xs transition-colors ${
                isTransparent
                  ? wishlistCount > 0 ? 'bg-white text-black' : 'bg-white/30 text-white'
                  : wishlistCount > 0 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {wishlistCount}
              </span>
            </Link>

            {/* 3. MapPin (Store Locator) - Desktop only */}
            <button
              onClick={() => setStoreLocatorOpen(true)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full hidden lg:flex items-center justify-center transition-all cursor-pointer ${
                isTransparent 
                  ? 'text-white hover:bg-white/15' 
                  : 'text-[#111111] hover:bg-neutral-100'
              }`}
              aria-label="Nuestras tiendas y locales"
              title="Nuestras Tiendas"
            >
              <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
            </button>

            {/* 4. User (Account) */}
            <Link
              to="/account"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full hidden sm:flex items-center justify-center transition-all ${
                isTransparent 
                  ? 'text-white hover:bg-white/15' 
                  : 'text-[#111111] hover:bg-neutral-100'
              }`}
              aria-label="Mi Cuenta"
              title={currentUser ? `Mi Cuenta (${currentUser.firstName})` : 'Mi Cuenta'}
            >
              <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
            </Link>

            {/* 5. ShoppingBag (Cart with live counter) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isTransparent 
                  ? 'text-white hover:bg-white/15' 
                  : 'text-[#111111] hover:bg-neutral-100'
              }`}
              aria-label={`Ver carrito de compras (${cartItemCount} prendas)`}
              title="Bolsa de Compras"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
              <span className={`absolute top-0.5 right-0.5 min-w-[16px] h-[16px] text-[9.5px] font-bold flex items-center justify-center rounded-full px-1 shadow-2xs transition-colors ${
                isTransparent
                  ? cartItemCount > 0 ? 'bg-white text-black' : 'bg-white/30 text-white'
                  : cartItemCount > 0 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {cartItemCount}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Spacer for fixed navbar — only on non-home pages or when scrolled */}
      {!isHome && <div className="h-16 sm:h-20" />}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />

          <div className="relative w-4/5 max-w-sm bg-white text-[#111111] h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200">
              <span className="font-display font-black text-2xl tracking-tight text-[#111111] uppercase">
                SENSE
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-black cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Gender Quick Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 rounded-lg">
                <Link
                  to="/hombres"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md text-black hover:bg-black hover:text-white transition-all"
                >
                  Hombre
                </Link>
                <Link
                  to="/damas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md text-black hover:bg-black hover:text-white transition-all"
                >
                  Mujer
                </Link>
                <Link
                  to="/kids"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-bold uppercase tracking-wider rounded-md text-black hover:bg-black hover:text-white transition-all"
                >
                  Niños
                </Link>
              </div>

              {/* Main Links */}
              <div className="space-y-1 text-sm font-bold uppercase tracking-wider border-t border-neutral-200 pt-4">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 text-neutral-800 hover:text-black border-b border-neutral-100"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>

              {/* Direct links to categories */}
              <div className="pt-2 space-y-2 text-xs font-semibold text-neutral-600">
                <Link
                  to="/catalog?category=remeras-tops"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-black"
                >
                  Remeras & Tops
                </Link>
                <Link
                  to="/catalog?category=calzado-zapatillas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-black"
                >
                  Calzado & Zapatillas
                </Link>
                <Link
                  to="/catalog?category=pantalones-jeans"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-black"
                >
                  Denim & Jeans
                </Link>
                <Link
                  to="/catalog?category=buzos-hoodies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-black"
                >
                  Buzos & Hoodies
                </Link>
              </div>

              {/* Utilities */}
              <div className="pt-4 border-t border-neutral-200 space-y-3 text-xs text-neutral-700 font-medium">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setStoreLocatorOpen(true);
                  }}
                  className="flex items-center gap-2 hover:text-black cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Nuestros Locales</span>
                </button>
                <Link 
                  to="/account" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-black"
                >
                  <User className="w-4 h-4" />
                  <span>{currentUser ? `Mi Cuenta (${currentUser.firstName})` : 'Ingresar / Registrarse'}</span>
                </Link>
                <Link 
                  to="/favorites" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-black"
                >
                  <Heart className="w-4 h-4" />
                  <span>Mis Favoritos ({wishlistCount})</span>
                </Link>
              </div>
            </div>

            <div className="mt-auto p-5 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500">
              <p className="font-bold text-black uppercase tracking-wider">SENSE ARGENTINA</p>
              <p className="mt-0.5">Envíos a todo el país · 3 y 6 cuotas sin interés</p>
            </div>
          </div>
        </div>
      )}

      {/* Store Locator Modal */}
      <StoreLocatorModal 
        isOpen={storeLocatorOpen} 
        onClose={() => setStoreLocatorOpen(false)} 
      />
    </>
  );
};
