import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  Ruler, 
  ChevronRight, 
  Minus, 
  Plus, 
  Check, 
  CreditCard,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatARS, formatInstallments, calculateDiscountPercent } from '../utils/formatters';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();

  // Find product by id or slug
  const product = products.find((p) => p.id === id || p.slug === id);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'detalles' | 'envios'>('descripcion');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Recently viewed tracker
  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem('sense_recent_v1');
      const recents: string[] = stored ? JSON.parse(stored) : [];
      const updated = [product.id, ...recents.filter((itemId) => itemId !== product.id)].slice(0, 6);
      localStorage.setItem('sense_recent_v1', JSON.stringify(updated));
      
      // Auto-select first available color
      if (product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0]);
      }
      setSelectedSize('');
      setQuantity(1);
      setSelectedImageIndex(0);
      setValidationError(null);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold font-display text-[#111111]">
          Producto no encontrado
        </h2>
        <p className="text-sm text-[#777777] mt-2">
          El artículo que estás buscando no existe o ya no se encuentra en el catálogo.
        </p>
        <Link
          to="/catalog"
          className="mt-6 inline-block px-6 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);

  // Check variant stock for current color & size
  const currentVariant = product.variants.find(
    (v) =>
      selectedColor &&
      v.colorName.toLowerCase() === selectedColor.name.toLowerCase() &&
      v.size === selectedSize
  );

  const isVariantOutOfStock = currentVariant ? currentVariant.stock <= 0 : false;

  const handleAddToCart = () => {
    if (!selectedColor) {
      setValidationError('Por favor elegí un color');
      return;
    }
    if (!selectedSize) {
      setValidationError('Por favor seleccioná tu talle');
      return;
    }
    if (isVariantOutOfStock) {
      setValidationError('Este talle se encuentra agotado en el color seleccionado');
      return;
    }
    setValidationError(null);
    addToCart(product, selectedColor.name, selectedColor.hex, selectedSize, quantity);
  };

  // Related products (same brand or category)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  // Recently viewed products
  const storedRecentIds: string[] = JSON.parse(localStorage.getItem('sense_recent_v1') || '[]');
  const recentlyViewedProducts = products
    .filter((p) => storedRecentIds.includes(p.id) && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#777777] mb-8">
        <Link to="/" className="hover:text-[#111111]">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/catalog?gender=${product.gender}`} className="hover:text-[#111111] capitalize">
          {product.gender}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link 
          to={`/catalog?brand=${product.brand.toLowerCase().replace(/['\s]/g, '-')}`} 
          className="hover:text-[#111111]"
        >
          {product.brand}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111111] font-semibold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main 2-Column PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        
        {/* LEFT COLUMN: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-y-auto max-h-[640px] hide-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-[2px] overflow-hidden border-2 transition-all cursor-pointer bg-[#F3F3F1] ${
                    selectedImageIndex === idx ? 'border-[#111111]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} vista ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Product Image */}
          <div className="relative flex-1 aspect-[4/5] bg-[#F3F3F1] rounded-[2px] overflow-hidden">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#C8102E] text-white text-xs font-bold tracking-wider px-2.5 py-1 rounded-[2px]">
                -{discountPercent}% SALE
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Purchase Module (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="lg:sticky lg:top-28 space-y-6">
            
            {/* Header: Brand & Title */}
            <div>
              <Link
                to={`/catalog?brand=${product.brand.toLowerCase().replace(/['\s]/g, '-')}`}
                className="text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#111111] transition-colors"
              >
                {product.brand}
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#111111] mt-1 tracking-tight">
                {product.name}
              </h1>
              
              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-mono tabular-nums">
                  {formatARS(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-[#777777] line-through font-mono tabular-nums">
                    {formatARS(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Installments & Mercado Pago notice */}
              <div className="mt-2 text-xs text-[#777777] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#111111]" />
                <span>
                  <strong>6 cuotas sin interés</strong> de{' '}
                  <strong className="text-[#111111] font-semibold">{formatARS(Math.round(product.price / 6))}</strong>
                </span>
              </div>
            </div>

            {/* Color Swatch Selection */}
            <div className="pt-4 border-t border-[#DCDCD9]">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold uppercase tracking-wider text-[#111111]">
                  Color: <strong className="font-semibold">{selectedColor?.name}</strong>
                </span>
              </div>
              <div className="flex gap-2">
                {product.availableColors.map((color) => {
                  const isSelected = selectedColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color);
                        setValidationError(null);
                      }}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                        isSelected ? 'border-[#111111] scale-110' : 'border-[#DCDCD9] hover:border-[#777777]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check 
                          className={`w-4 h-4 ${
                            color.hex === '#FFFFFF' || color.hex === '#E5E5E5' || color.hex === '#F0EAD6'
                              ? 'text-[#111111]' 
                              : 'text-white'
                          }`} 
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="pt-4 border-t border-[#DCDCD9]">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold uppercase tracking-wider text-[#111111]">
                  Talle: <strong className="font-semibold">{selectedSize || 'Seleccionar'}</strong>
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111111] underline underline-offset-4 hover:opacity-75"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guía de talles</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  // Check stock for this specific size with current color
                  const v = product.variants.find(
                    (item) =>
                      selectedColor &&
                      item.colorName.toLowerCase() === selectedColor.name.toLowerCase() &&
                      item.size === size
                  );
                  const isOutOfStock = v ? v.stock <= 0 : false;

                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setValidationError(null);
                      }}
                      disabled={isOutOfStock}
                      className={`h-11 rounded-[2px] text-xs font-bold uppercase transition-all flex items-center justify-center relative ${
                        isSelected
                          ? 'bg-[#111111] text-white border-2 border-[#111111]'
                          : isOutOfStock
                          ? 'bg-[#F3F3F1] text-[#777777] border border-[#DCDCD9] cursor-not-allowed line-through opacity-50'
                          : 'bg-white text-[#111111] border border-[#DCDCD9] hover:border-[#111111]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Stock availability indicator */}
              {selectedSize && currentVariant && (
                <p className="mt-2 text-xs text-[#777777]">
                  {currentVariant.stock > 0 ? (
                    <span className="text-emerald-700 font-medium">
                      ✓ En stock ({currentVariant.stock} unidades disponibles)
                    </span>
                  ) : (
                    <span className="text-[#C8102E] font-medium">
                      ✕ Agotado temporalmente en este talle
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 bg-red-50 border border-[#C8102E]/30 rounded text-xs text-[#C8102E] font-medium">
                {validationError}
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="pt-4 border-t border-[#DCDCD9] space-y-3">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#DCDCD9] rounded-[2px] h-12 px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#777777] hover:text-[#111111]"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-[#777777] hover:text-[#111111]"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
                >
                  <span>Agregar a la Bolsa</span>
                </button>

                {/* Wishlist Heart CTA */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 border rounded-[2px] flex items-center justify-center transition-colors cursor-pointer ${
                    isFavorite 
                      ? 'bg-[#111111] border-[#111111] text-white' 
                      : 'border-[#DCDCD9] hover:border-[#111111] text-[#111111]'
                  }`}
                  aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Commercial Trust Strip */}
            <div className="bg-[#F3F3F1] p-4 rounded-[2px] space-y-2.5 text-xs text-[#111111]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#111111] shrink-0" />
                <span>Envío gratis a todo el país desde $ 120.000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#111111] shrink-0" />
                <span>30 días para cambio sin costo en todo el país</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
                <span>Producto 100% original con garantía oficial {product.brand}</span>
              </div>
            </div>

            {/* Product Details Tabs / Accordion */}
            <div className="pt-4 border-t border-[#DCDCD9]">
              <div className="flex border-b border-[#DCDCD9] text-xs font-bold uppercase tracking-wider text-[#777777]">
                <button
                  onClick={() => setActiveTab('descripcion')}
                  className={`pb-2.5 mr-6 border-b-2 transition-colors ${
                    activeTab === 'descripcion' ? 'border-[#111111] text-[#111111]' : 'border-transparent hover:text-[#111111]'
                  }`}
                >
                  Descripción
                </button>
                <button
                  onClick={() => setActiveTab('detalles')}
                  className={`pb-2.5 mr-6 border-b-2 transition-colors ${
                    activeTab === 'detalles' ? 'border-[#111111] text-[#111111]' : 'border-transparent hover:text-[#111111]'
                  }`}
                >
                  Especificaciones
                </button>
                <button
                  onClick={() => setActiveTab('envios')}
                  className={`pb-2.5 border-b-2 transition-colors ${
                    activeTab === 'envios' ? 'border-[#111111] text-[#111111]' : 'border-transparent hover:text-[#111111]'
                  }`}
                >
                  Envíos & Devolución
                </button>
              </div>

              <div className="py-4 text-xs text-[#555555] leading-relaxed">
                {activeTab === 'descripcion' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'detalles' && (
                  <ul className="list-disc pl-4 space-y-1">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                    {product.careInstructions && (
                      <li className="pt-1 list-none font-semibold text-[#111111]">
                        Cuidados de la prenda:
                        <ul className="list-circle pl-4 font-normal mt-1">
                          {product.careInstructions.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </li>
                    )}
                  </ul>
                )}
                {activeTab === 'envios' && (
                  <div className="space-y-2">
                    <p>
                      <strong>Plazos de entrega:</strong> CABA y GBA en 24 a 48 hs hábiles. Resto del país de 3 a 5 días hábiles a través de Andreani o Correo Argentino.
                    </p>
                    <p>
                      <strong>Política de cambios:</strong> El primer cambio es 100% gratuito. Podés gestionar el cambio de talle desde tu cuenta o comunicándote con nuestro equipo de post-venta.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#DCDCD9]">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111111]">
              Productos relacionados
            </h2>
            <Link
              to={`/catalog?category=${product.category}`}
              className="text-xs font-semibold uppercase tracking-wider text-[#111111] hover:underline"
            >
              Ver más en esta categoría →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* RECENTLY VIEWED PRODUCTS */}
      {recentlyViewedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#DCDCD9]">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111111] mb-8">
            Vistos recientemente
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative border border-[#DCDCD9]">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#111111]" />
                <h3 className="font-display font-bold text-base text-[#111111]">
                  Guía de Talles Oficial {product.brand}
                </h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-1 text-[#777777] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-xs text-[#777777] mb-4">
                Medidas corporales de referencia expresadas en centímetros (cm).
              </p>

              {product.category === 'calzado-zapatillas' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#DCDCD9] font-bold text-[#111111]">
                        <th className="py-2">Talle ARG</th>
                        <th className="py-2">US</th>
                        <th className="py-2">EUR</th>
                        <th className="py-2">CM Plantilla</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCDCD9]/60 font-mono">
                      <tr><td className="py-2">39</td><td>7.5</td><td>40</td><td>25.5 cm</td></tr>
                      <tr><td className="py-2">40</td><td>8.5</td><td>41</td><td>26.5 cm</td></tr>
                      <tr><td className="py-2">41</td><td>9.5</td><td>42</td><td>27.5 cm</td></tr>
                      <tr><td className="py-2">42</td><td>10.0</td><td>43</td><td>28.0 cm</td></tr>
                      <tr><td className="py-2">43</td><td>11.0</td><td>44</td><td>29.0 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#DCDCD9] font-bold text-[#111111]">
                        <th className="py-2">Talle</th>
                        <th className="py-2">Pecho (cm)</th>
                        <th className="py-2">Cintura (cm)</th>
                        <th className="py-2">Cadera (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCDCD9]/60 font-mono">
                      <tr><td className="py-2 font-bold">S</td><td>88 - 94</td><td>76 - 82</td><td>90 - 96</td></tr>
                      <tr><td className="py-2 font-bold">M</td><td>95 - 102</td><td>83 - 90</td><td>97 - 104</td></tr>
                      <tr><td className="py-2 font-bold">L</td><td>103 - 110</td><td>91 - 98</td><td>105 - 112</td></tr>
                      <tr><td className="py-2 font-bold">XL</td><td>111 - 118</td><td>99 - 106</td><td>113 - 120</td></tr>
                      <tr><td className="py-2 font-bold">XXL</td><td>119 - 126</td><td>107 - 114</td><td>121 - 128</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#DCDCD9] text-center">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
