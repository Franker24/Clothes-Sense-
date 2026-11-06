import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatARS, calculateDiscountPercent } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart, setIsCartOpen } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [swatchHoveredIndex, setSwatchHoveredIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);

  // Determine which image to show:
  let activeImageIndex = 0;
  if (swatchHoveredIndex !== null && product.images[swatchHoveredIndex]) {
    activeImageIndex = swatchHoveredIndex;
  } else if (selectedColorIndex !== null && product.images[selectedColorIndex]) {
    activeImageIndex = selectedColorIndex;
  } else if (isHovered && product.images[1]) {
    activeImageIndex = 1;
  }

  const displayImage = product.images[activeImageIndex] || product.images[0];

  // Transfer discount price (10% off)
  const transferPrice = Math.round(product.price * 0.90);
  // 3 cuotas sin interés
  const installmentPrice = Math.round(product.price / 3);

  // Is 3x2 promotion item
  const is3x2 = product.id.startsWith('prod-') && product.price === 21990;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const activeColor = product.availableColors[selectedColorIndex ?? 0] || product.availableColors[0] || { name: 'Único', hex: '#111111' };
    const defaultSize = product.availableSizes[0] || 'M';
    addToCart(product, activeColor.name, activeColor.hex, defaultSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    setIsCartOpen(true);
  };

  return (
    <article 
      className="product-card-anim group relative flex flex-col bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs hover:shadow-xl hover:border-black transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSwatchHoveredIndex(null);
      }}
    >
      {/* Product Image Frame with Soft Inset Border Box */}
      <div className="relative aspect-[3/3.8] bg-[#fbfbfb] rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center p-3 select-none border border-neutral-100/80">
        
        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
            isFavorite 
              ? 'bg-[#111111] text-white shadow-sm' 
              : 'bg-white/95 text-[#111111] hover:bg-white hover:scale-105 shadow-xs'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          aria-pressed={isFavorite}
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-transform ${
              isFavorite ? 'fill-white stroke-white scale-110' : 'stroke-[1.75]'
            }`} 
          />
        </button>

        {/* Promo Badge with Rounded Pill Styling */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none select-none">
          {is3x2 ? (
            <span className="bg-black text-white text-[9.5px] sm:text-[10.5px] font-black tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
              3x2
            </span>
          ) : discountPercent > 0 ? (
            <span className="bg-[#111111] text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : product.isNew ? (
            <span className="bg-[#111111] text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              NUEVO
            </span>
          ) : null}
        </div>

        {/* Image Link */}
        <Link to={`/product/${product.id}`} className="block w-full h-full relative flex items-center justify-center">
          {!imageError ? (
            <img
              src={displayImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-contain object-center transition-all duration-500 ease-out group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#F3F3F1] rounded-xl">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#777777] mb-1">
                {product.brand}
              </span>
              <p className="text-xs font-semibold text-[#111111] line-clamp-2">
                {product.name}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Product Details Area */}
      <div className="pt-3 sm:pt-3.5 pb-1 text-center flex flex-col items-center justify-between flex-1">
        <div className="w-full">
          {/* Product Name */}
          <Link 
            to={`/product/${product.id}`}
            className="text-[12px] sm:text-[13px] font-bold text-[#111111] line-clamp-1 hover:underline transition-all block w-full px-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Pricing */}
          <div className="mt-1 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-[12.5px] sm:text-sm font-bold text-[#111111] tabular-nums font-mono">
              {formatARS(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10.5px] sm:text-xs text-[#888888] line-through font-mono tabular-nums font-normal">
                {formatARS(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Transfer Discount */}
          <p className="text-[9.5px] sm:text-[11px] font-bold text-[#111111] mt-0.5 tracking-tight font-mono">
            {formatARS(transferPrice)} <span className="font-medium text-[#555555]">con Transferencia</span>
          </p>

          {/* Installments in warm rust red accent */}
          <p className="text-[9.5px] sm:text-[11px] font-bold text-[#b91c1c] mt-0.5 tracking-tight">
            3 cuotas sin interés de <span className="font-mono">{formatARS(installmentPrice)}</span>
          </p>

          {/* Color Swatches */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {product.availableColors.slice(0, 4).map((color, idx) => {
                const isSelected = (selectedColorIndex ?? 0) === idx;
                return (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColorIndex(idx);
                    }}
                    onTouchStart={() => setSelectedColorIndex(idx)}
                    onMouseEnter={() => setSwatchHoveredIndex(idx)}
                    onMouseLeave={() => setSwatchHoveredIndex(null)}
                    className="p-1 -m-0.5 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                    title={`${color.name} - Ver variante`}
                    aria-label={`Seleccionar color ${color.name}`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border block transition-all ${
                        isSelected 
                          ? 'border-[#111111] ring-2 ring-[#111111] scale-110 shadow-xs' 
                          : 'border-[#cccccc] hover:border-[#111111]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button: Rounded Pill Border-Box Style (Matching Uiverse) */}
        <button
          onClick={handleQuickBuy}
          className="mt-3 w-full py-2 px-4 rounded-full bg-black text-white hover:bg-transparent hover:text-black border-2 border-black duration-200 font-semibold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <span>{justAdded ? '¡Agregado!' : 'Comprar'}</span>
          <ShoppingBag className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
