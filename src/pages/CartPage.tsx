import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Truck, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatARS } from '../utils/formatters';

const FREE_SHIPPING_LIMIT = 120000;

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartSubtotal, 
    cartDiscount, 
    cartShippingCost, 
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [shippingQuote, setShippingQuote] = useState<string | null>(null);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponMsg({ text: res.message });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode.trim()) return;
    if (cartSubtotal >= FREE_SHIPPING_LIMIT || appliedCoupon === 'ENVIOGRATIS') {
      setShippingQuote(`CP ${postalCode}: ¡Envío gratuito incluido a domicilio por Andreani! (2 a 4 días hábiles)`);
    } else {
      setShippingQuote(`CP ${postalCode}: Andreani estándar a domicilio: $ 7.800 (2 a 4 días hábiles)`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#F3F3F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#777777]">
          <Truck className="w-10 h-10 stroke-[1.25]" />
        </div>
        <h1 className="text-3xl font-bold font-display text-[#111111]">
          Tu bolsa de compras está vacía
        </h1>
        <p className="text-sm text-[#777777] mt-2 max-w-md mx-auto">
          No tenés productos agregados. Te invitamos a explorar nuestras nuevas colecciones de calzado e indumentaria.
        </p>
        <Link
          to="/catalog"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
        >
          <span>Descubrir Catálogo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#DCDCD9] mb-8 gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#111111]">
          Mi Bolsa de Compras
        </h1>
        <span className="text-xs text-[#777777] font-mono">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} prendas seleccionadas
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free shipping progress notification */}
          <div className="bg-[#F3F3F1] p-4 rounded-[2px] border border-[#DCDCD9] flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#111111] shrink-0" />
            <div className="text-xs">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Sumá <strong>{formatARS(remainingForFreeShipping)}</strong> más a tu bolsa para obtener <strong>Envío Gratis</strong> a todo el país.
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">
                  ¡Genial! Tu pedido califica para <strong>Envío Gratis a todo el país</strong>.
                </span>
              )}
            </div>
          </div>

          {/* Cart Table */}
          <div className="border border-[#DCDCD9] rounded-[2px] divide-y divide-[#DCDCD9]">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Image and product info */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 bg-[#F3F3F1] rounded-[2px] overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="block text-sm font-semibold text-[#111111] hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-[#777777] mt-1">
                      <span>Talle: <strong className="text-[#111111]">{item.selectedSize}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        Color:
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-[#DCDCD9] inline-block"
                          style={{ backgroundColor: item.selectedColorHex }}
                        />
                        <strong className="text-[#111111]">{item.selectedColor}</strong>
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium text-[#777777] mt-1 block">
                      Unitario: {formatARS(item.unitPrice)}
                    </span>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#DCDCD9]/40">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#DCDCD9] rounded-[2px] h-9">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-[#111111] hover:bg-[#F3F3F1] transition-colors"
                      aria-label="Disminuir"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs text-[#111111] hover:bg-[#F3F3F1] transition-colors"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <span className="text-sm font-bold text-[#111111] font-mono tabular-nums min-w-[90px] text-right">
                    {formatARS(item.unitPrice * item.quantity)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-[#777777] hover:text-[#C8102E] transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continuar comprando</span>
            </Link>
            <button
              onClick={clearCart}
              className="text-xs text-[#777777] hover:text-[#C8102E] underline"
            >
              Vaciar bolsa
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-[#F3F3F1] p-6 rounded-[2px] border border-[#DCDCD9] space-y-6">
            <h2 className="font-display font-bold text-lg text-[#111111] pb-3 border-b border-[#DCDCD9]">
              Resumen del Pedido
            </h2>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-[#777777]">
              <div className="flex justify-between">
                <span>Subtotal prendas</span>
                <span className="font-mono tabular-nums text-[#111111] font-semibold">{formatARS(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#C8102E]">
                  <span>Descuento cupón ({appliedCoupon})</span>
                  <span className="font-mono tabular-nums font-semibold">-{formatARS(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Costo de envío estimado</span>
                <span className="font-mono tabular-nums text-[#111111] font-semibold">
                  {cartShippingCost === 0 ? 'Gratis' : formatARS(cartShippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#DCDCD9]">
                <span>Total Final</span>
                <span className="font-mono tabular-nums">{formatARS(cartTotal)}</span>
              </div>
              <p className="text-[11px] text-[#777777] pt-1">
                Pagá en <strong>6 cuotas sin interés</strong> de <span className="font-semibold text-[#111111]">{formatARS(Math.round(cartTotal / 6))}</span>
              </p>
            </div>

            {/* Promo Code Form */}
            <div className="pt-4 border-t border-[#DCDCD9] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>¿Tenés un código de descuento?</span>
              </span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-[#DCDCD9] text-xs">
                  <span className="font-bold text-[#111111]">{appliedCoupon}</span>
                  <button onClick={removeCoupon} className="text-[#C8102E] font-semibold hover:underline">
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="SENSE10 o ENVIOGRATIS"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded hover:bg-black"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.isError ? 'text-[#C8102E]' : 'text-emerald-700'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Postal Code Simulator */}
            <div className="pt-4 border-t border-[#DCDCD9] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Calcular costo de envío</span>
              </span>
              <form onSubmit={handleCalculateShipping} className="flex gap-2">
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Tu código postal (ej: C1425)"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-white text-[#111111] border border-[#DCDCD9] text-xs font-bold uppercase rounded hover:bg-[#EAEAE7]"
                >
                  Calcular
                </button>
              </form>
              {shippingQuote && (
                <p className="text-[11px] text-[#111111] bg-white p-2 rounded border border-[#DCDCD9]">
                  {shippingQuote}
                </p>
              )}
            </div>

            {/* Primary Proceed to Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full h-12 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Iniciar Compra</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Safety tags */}
            <div className="text-[11px] text-[#777777] flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <span>Compra 100% segura con garantía oficial</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
