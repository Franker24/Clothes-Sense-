import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X, Sparkles } from 'lucide-react';

export interface SubCategoryItem {
  label: string;
  link: string;
  isBold?: boolean;
}

export interface MenuItemConfig {
  id: string;
  label: string;
  link: string;
  highlight?: boolean;
  tag?: string;
  subcategories?: SubCategoryItem[];
}

export const SIDEBAR_ITEMS: MenuItemConfig[] = [
  {
    id: 'sense-cyber',
    label: 'SENSE Cyber',
    link: '/catalog?sale=true',
    highlight: true,
    tag: '✦',
  },
  {
    id: 'descuentos',
    label: 'Descuentos hasta 50% OFF',
    link: '/catalog?sale=true',
    highlight: true,
  },
  {
    id: 'cyber-trends',
    label: 'Cyber Trends',
    link: '/catalog?sort=newest',
  },
  {
    id: 'ss27',
    label: 'Colección SS27',
    link: '/catalog?sort=newest',
  },
  {
    id: 'denim',
    label: 'Denim & Jeans',
    link: '/catalog?category=pantalones-jeans',
    subcategories: [
      { label: 'Ver Todo Denim', link: '/catalog?category=pantalones-jeans', isBold: true },
      { label: 'Jeans Wide Leg & Relaxed', link: '/catalog?category=pantalones-jeans&q=wide' },
      { label: 'Jeans Cargo & Carpenter', link: '/catalog?category=pantalones-jeans&q=cargo' },
      { label: 'Bermudas & Shorts', link: '/catalog?category=pantalones-jeans&q=bermuda' },
      { label: 'Camperas Denim', link: '/catalog?category=camperas-abrigos&q=denim' },
      { label: 'Jeans Slim & Regular', link: '/catalog?category=pantalones-jeans&q=slim' },
    ],
  },
  {
    id: 'calzado',
    label: 'Calzado & Zapatillas',
    link: '/catalog?category=calzado-zapatillas',
    subcategories: [
      { label: 'Ver Todo Calzado', link: '/catalog?category=calzado-zapatillas', isBold: true },
      { label: 'Zapatillas Urbanas', link: '/catalog?category=calzado-zapatillas&q=urban' },
      { label: 'Zapatillas Retro & Running', link: '/catalog?category=calzado-zapatillas&q=retro' },
      { label: 'Botas & Borcegos', link: '/catalog?category=calzado-zapatillas&q=bota' },
      { label: 'Sandalias & Slides', link: '/catalog?category=calzado-zapatillas&q=sandalia' },
    ],
  },
  {
    id: 'remeras',
    label: 'Remeras & Tops',
    link: '/catalog?category=remeras-tops',
    subcategories: [
      { label: 'Ver Todas las Remeras', link: '/catalog?category=remeras-tops', isBold: true },
      { label: 'Remeras Oversize', link: '/catalog?category=remeras-tops&q=oversize' },
      { label: 'Remeras Estampadas', link: '/catalog?category=remeras-tops&q=estampada' },
      { label: 'Remeras Lisas & Básicas', link: '/catalog?category=remeras-tops&q=basica' },
      { label: 'Camisas & Bowling', link: '/catalog?category=remeras-tops&q=camisa' },
      { label: 'Tops & Musculosas', link: '/catalog?category=remeras-tops&q=top' },
    ],
  },
  {
    id: 'abrigos',
    label: 'Camperas & Abrigos',
    link: '/catalog?category=camperas-abrigos',
    subcategories: [
      { label: 'Ver Todos los Abrigos', link: '/catalog?category=camperas-abrigos', isBold: true },
      { label: 'Buzos & Hoodies', link: '/catalog?category=buzos-hoodies' },
      { label: 'Camperas Puffer & Parkas', link: '/catalog?category=camperas-abrigos&q=puffer' },
      { label: 'Camperas Bomber & Cuero', link: '/catalog?category=camperas-abrigos&q=bomber' },
      { label: 'Chalecos Térmicos', link: '/catalog?category=camperas-abrigos&q=chaleco' },
    ],
  },
  {
    id: 'accesorios',
    label: 'Accesorios',
    link: '/catalog?category=accesorios',
    subcategories: [
      { label: 'Ver Todos los Accesorios', link: '/catalog?category=accesorios', isBold: true },
      { label: 'Gorras & Pilusos', link: '/catalog?category=accesorios&q=gorra' },
      { label: 'Mochilas & Riñoneras', link: '/catalog?category=accesorios&q=mochila' },
      { label: 'Medias & Ropa Interior', link: '/catalog?category=accesorios&q=medias' },
      { label: 'Cinturones & Billeteras', link: '/catalog?category=accesorios&q=cinturon' },
    ],
  },
  {
    id: 'licencias',
    label: 'Licencias & Marcas',
    link: '/brands',
  },
  {
    id: 'club',
    label: 'SENSE Club',
    link: '/account',
  },
];

interface EditorialSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  isScrolled: boolean;
}

export const EditorialSidebar: React.FC<EditorialSidebarProps> = ({
  isOpen,
  onToggle,
  onOpen,
  onClose,
  isScrolled,
}) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const activeCategory = SIDEBAR_ITEMS.find((item) => item.id === hoveredItemId);

  const closeSidebar = useCallback(() => {
    setHoveredItemId(null);
    if (onClose) onClose();
    else onToggle();
  }, [onClose, onToggle]);

  const handleMouseLeaveSidebar = useCallback(() => {
    setHoveredItemId(null);
    if (isScrolled && isOpen) {
      closeSidebar();
    }
  }, [isScrolled, isOpen, closeSidebar]);

  return (
    <>
      {/* Hover trigger zone on left edge when closed */}
      {!isOpen && (
        <div
          className="fixed top-0 bottom-0 left-0 w-4 z-40 cursor-pointer pointer-events-auto"
          onMouseEnter={() => {
            if (onOpen) onOpen();
            else onToggle();
          }}
          aria-hidden="true"
        />
      )}

      {/* Dark backdrop when sidebar is open in scrolled state */}
      {isScrolled && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar — using will-change and transform for GPU acceleration */}
      <aside
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          willChange: 'transform',
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-out ${
          isScrolled
            ? 'bg-[#0c0c0c]/96 text-white border-r border-white/15 shadow-2xl backdrop-blur-xl'
            : 'bg-gradient-to-r from-black/60 via-black/30 to-transparent text-white'
        } w-[85vw] max-w-[280px] sm:w-[280px] flex flex-col select-none`}
        onMouseEnter={() => {/* keep open */}}
        onMouseLeave={handleMouseLeaveSidebar}
      >
        {/* Header */}
        {isScrolled ? (
          <div className="h-16 sm:h-[68px] px-4 sm:px-5 flex items-center justify-between border-b border-white/10 shrink-0">
            <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-white">
              MENÚ SENSE
            </span>
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <div className="h-20 sm:h-24 shrink-0" aria-hidden="true" />
        )}

        {/* Scrollable Category List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar py-2 px-3 sm:px-4 flex flex-col justify-start">
          <nav className="flex flex-col gap-0.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isHovered = hoveredItemId === item.id;
              const hasSub = !!item.subcategories && item.subcategories.length > 0;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasSub && window.innerWidth >= 640) setHoveredItemId(item.id);
                    else if (!hasSub) setHoveredItemId(null);
                  }}
                >
                  <Link
                    to={item.link}
                    onClick={(e) => {
                      if (hasSub && window.innerWidth < 640) {
                        e.preventDefault();
                        setHoveredItemId(hoveredItemId === item.id ? null : item.id);
                      } else if (!hasSub && isScrolled) {
                        closeSidebar();
                      }
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded text-[13.5px] tracking-wide transition-colors duration-150 group ${
                      isHovered
                        ? isScrolled
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/20 text-white font-semibold'
                        : item.highlight
                          ? 'text-white font-bold hover:bg-white/10'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {item.label}
                      {item.tag && (
                        <span className="text-[9px] text-white/80 font-mono">
                          {item.tag}
                        </span>
                      )}
                    </span>

                    {hasSub && (
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-150 shrink-0 ${
                          isHovered
                            ? isScrolled ? 'text-black rotate-90 sm:rotate-0' : 'text-white rotate-90 sm:rotate-0'
                            : 'text-white/50'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mobile Accordion */}
                  {hasSub && isHovered && (
                    <div className="sm:hidden pl-3 py-1.5 flex flex-col gap-0.5 border-l-2 border-white/20 my-1 bg-white/5 rounded">
                      {item.subcategories!.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.link}
                          onClick={() => {
                            closeSidebar();
                            setHoveredItemId(null);
                          }}
                          className={`py-1.5 px-2.5 text-xs rounded text-white/85 hover:text-white active:bg-white/10 ${
                            sub.isBold ? 'font-bold text-white' : ''
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-5 border-t border-white/10 flex items-center justify-between text-[10px] tracking-wider uppercase text-white/60 shrink-0">
          <Link to="/account" className="hover:text-white transition-colors">
            Mi cuenta
          </Link>
          <span className="text-white/25">•</span>
          <Link to="/faq" className="hover:text-white transition-colors">
            Ayuda
          </Link>
          <span className="text-white/25">•</span>
          <span className="font-mono text-white/80">AR / ES</span>
        </div>

        {/* Desktop Submenu Flyout */}
        {activeCategory && activeCategory.subcategories && (
          <div
            className="hidden sm:flex absolute top-0 bottom-0 left-full w-[260px] flex-col z-50 shadow-2xl transition-opacity duration-150 bg-[#161616]/90 backdrop-blur-xl border-l border-white/15 rounded-r-xl overflow-hidden"
            onMouseEnter={() => setHoveredItemId(activeCategory.id)}
            onMouseLeave={handleMouseLeaveSidebar}
          >
            {/* Submenu Header */}
            <div className={`h-16 sm:h-20 px-6 flex items-center justify-between border-b border-white/10 ${!isScrolled ? 'pt-4' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {activeCategory.label}
                </span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-white/50" />
            </div>

            {/* Subcategories */}
            <div className="flex-1 overflow-y-auto hide-scrollbar py-4 px-3 flex flex-col gap-1">
              {activeCategory.subcategories.map((sub, idx) => (
                <Link
                  key={idx}
                  to={sub.link}
                  onClick={() => {
                    if (isScrolled) closeSidebar();
                    setHoveredItemId(null);
                  }}
                  className={`px-3.5 py-2.5 text-[13px] rounded-lg transition-colors duration-150 block ${
                    sub.isBold
                      ? 'font-bold text-white bg-white/10 border border-white/15 mb-1 hover:bg-white hover:text-black'
                      : 'text-neutral-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {sub.label}
                </Link>
              ))}
            </div>

            <div className="p-3.5 border-t border-white/10 text-[10px] uppercase tracking-widest text-neutral-400 text-center font-medium bg-black/20">
              Ver colección completa
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
