import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../utils/formatters';

const FREE_SHIPPING_LIMIT = 120000;

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    cartDiscount, 
    cartShippingCost, 
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_LIMIT) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#DCDCD9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-[#111111]">
                Bolsa de Compras
              </h2>
              <span className="text-xs text-[#777777] font-semibold">
                ({cart.reduce((sum, item) => sum + item.quantity, 0)} prendas)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F1] rounded-full transition-colors"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#F3F3F1] px-6 py-3 border-b border-[#DCDCD9]">
            <div className="flex items-center gap-2 text-xs font-medium text-[#111111] mb-1.5">
              <Truck className="w-4 h-4 shrink-0 text-[#111111]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Te faltan <strong className="font-semibold">{formatARS(remainingForFreeShipping)}</strong> para envío gratis
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">
                  ¡Felicitaciones! Tenés envío gratis a todo el país
                </span>
              )}
            </div>
            <div className="w-full bg-[#DCDCD9] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#111111] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-[#DCDCD9]/60">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F3F3F1] flex items-center justify-center mb-4 text-[#777777]">
                  <Truck className="w-8 h-8 stroke-[1.25]" />
                </div>
                <h3 className="font-display font-bold text-base text-[#111111]">
                  Tu bolsa está vacía
                </h3>
                <p className="text-xs text-[#777777] mt-1 max-w-xs">
                  Descubrí nuestras colecciones de temporada y encontrá tu estilo.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalog');
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-black transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#F3F3F1] rounded overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                          {item.product.brand}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#777777] hover:text-[#C8102E] p-1 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-medium text-[#111111] line-clamp-1">
                        {item.product.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#777777]">
                        <span>Talle: <strong className="text-[#111111] font-semibold">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          Color:
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-[#DCDCD9] inline-block"
                            style={{ backgroundColor: item.selectedColorHex }}
                          />
                          <strong className="text-[#111111] font-semibold">{item.selectedColor}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DCDCD9] rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-xs text-[#111111] hover:bg-[#F3F3F1] transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs text-[#111111] hover:bg-[#F3F3F1] transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Price for item */}
                      <span className="text-xs font-bold text-[#111111] font-mono tabular-nums">
                        {formatARS(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#DCDCD9] bg-white space-y-4">
              {/* Promo code field */}
              <div className="space-y-1">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F3F3F1] px-3 py-2 rounded text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-[#111111]">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Cupón <strong>{appliedCoupon}</strong> aplicado</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#C8102E] hover:underline font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de descuento (ej: SENSE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111] uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#F3F3F1] hover:bg-[#EAEAE7] text-xs font-semibold uppercase tracking-wider rounded border border-[#DCDCD9]"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-[#C8102E]">{couponError}</p>
                )}
              </div>

              {/* Subtotal, discount, total */}
              <div className="space-y-1.5 text-xs text-[#777777]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#111111]">{formatARS(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#C8102E]">
                    <span>Descuento cupón</span>
                    <span className="font-mono tabular-nums">-{formatARS(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-mono tabular-nums text-[#111111]">
                    {cartShippingCost === 0 ? 'Gratis' : formatARS(cartShippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#DCDCD9]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">{formatARS(cartTotal)}</span>
                </div>
                <p className="text-[11px] text-[#777777]">
                  O hasta 6 cuotas sin interés de <span className="font-semibold text-[#111111]">{formatARS(Math.round(cartTotal / 6))}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-md"
                >
                  <span>Iniciar Compra</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block text-center text-xs font-semibold text-[#111111] hover:underline py-1"
                >
                  Ver carrito detallado
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
