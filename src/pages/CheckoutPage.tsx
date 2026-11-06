import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Printer
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatARS } from '../utils/formatters';
import { Order, OrderItem } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShippingCost, 
    cartTotal, 
    appliedCoupon, 
    createOrder, 
    currentUser 
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  // Step 2: Shipping
  const defaultAddr = currentUser?.addresses.find((a) => a.isDefault) || currentUser?.addresses[0];
  const [shippingInfo, setShippingInfo] = useState({
    postalCode: defaultAddr?.postalCode || 'C1425',
    province: defaultAddr?.province || 'Ciudad Autónoma de Buenos Aires',
    city: defaultAddr?.city || 'Palermo, CABA',
    street: defaultAddr?.street || 'Av. Santa Fe',
    number: defaultAddr?.number || '3245',
    floorApt: defaultAddr?.floorApt || '4 B',
    notes: '',
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<'andreani' | 'correo' | 'express'>('andreani');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'Mercado Pago' | 'Tarjeta de Crédito / Débito' | 'Transferencia Bancaria'>('Mercado Pago');
  const [demoCardData, setDemoCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardName: 'MATEO ROMERO',
    expiry: '08/28',
    installments: '6',
  });

  // Step 4: Confirmed Order Output
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Guard: Cart empty on steps 1-3
  if (cart.length === 0 && currentStep !== 4) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-display text-[#111111]">
          No hay artículos en tu bolsa de compras
        </h2>
        <p className="text-xs text-[#777777] mt-2">
          Agregá prendas a tu bolsa antes de proceder al checkout.
        </p>
        <Link
          to="/catalog"
          className="mt-6 inline-block px-6 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  // Validations per step
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!personalInfo.firstName.trim()) errors.firstName = 'Ingresá tu nombre';
    if (!personalInfo.lastName.trim()) errors.lastName = 'Ingresá tu apellido';
    if (!personalInfo.email.trim() || !personalInfo.email.includes('@')) errors.email = 'Ingresá un email válido';
    if (!personalInfo.phone.trim()) errors.phone = 'Ingresá un teléfono de contacto';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!shippingInfo.postalCode.trim()) errors.postalCode = 'Ingresá tu código postal';
    if (!shippingInfo.province.trim()) errors.province = 'Ingresá la provincia';
    if (!shippingInfo.city.trim()) errors.city = 'Ingresá la localidad o ciudad';
    if (!shippingInfo.street.trim()) errors.street = 'Ingresá la calle';
    if (!shippingInfo.number.trim()) errors.number = 'Ingresá la altura';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmOrder = () => {
    // Generate order item records
    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      brand: item.product.brand,
      image: item.product.images[0],
      color: item.selectedColor,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.unitPrice,
    }));

    const shippingMethodLabel = 
      selectedShippingMethod === 'andreani' 
        ? 'Andreani Estándar a Domicilio'
        : selectedShippingMethod === 'correo'
        ? 'Correo Argentino Sucursal / Domicilio'
        : 'SENSE Express Prioritario';

    const order = createOrder({
      customer: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
      },
      shippingAddress: {
        street: shippingInfo.street,
        number: shippingInfo.number,
        floorApt: shippingInfo.floorApt,
        city: shippingInfo.city,
        province: shippingInfo.province,
        postalCode: shippingInfo.postalCode,
        notes: shippingInfo.notes,
      },
      shippingMethod: shippingMethodLabel,
      shippingCost: cartShippingCost,
      paymentMethod,
      paymentStatus: 'aprobado',
      fulfillmentStatus: 'preparando',
      trackingNumber: `SNE-${Math.floor(100000 + Math.random() * 900000)}-AR`,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      discountCode: appliedCoupon || undefined,
      total: cartTotal,
    });

    setConfirmedOrder(order);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      
      {/* Checkout Progress Stepper (Only on Steps 1, 2, 3) */}
      {currentStep !== 4 && (
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            
            {/* Step 1 Indicator */}
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#111111]' : 'text-[#777777]'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep > 1 ? 'bg-[#111111] text-white' : currentStep === 1 ? 'border-2 border-[#111111] text-[#111111]' : 'bg-[#F3F3F1] text-[#777777]'
              }`}>
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span className="hidden sm:inline">Datos Personales</span>
            </div>

            <div className={`flex-1 h-0.5 mx-3 ${currentStep > 1 ? 'bg-[#111111]' : 'bg-[#DCDCD9]'}`} />

            {/* Step 2 Indicator */}
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#111111]' : 'text-[#777777]'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep > 2 ? 'bg-[#111111] text-white' : currentStep === 2 ? 'border-2 border-[#111111] text-[#111111]' : 'bg-[#F3F3F1] text-[#777777]'
              }`}>
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className="hidden sm:inline">Envío</span>
            </div>

            <div className={`flex-1 h-0.5 mx-3 ${currentStep > 2 ? 'bg-[#111111]' : 'bg-[#DCDCD9]'}`} />

            {/* Step 3 Indicator */}
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#111111]' : 'text-[#777777]'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                currentStep === 3 ? 'border-2 border-[#111111] text-[#111111]' : 'bg-[#F3F3F1] text-[#777777]'
              }`}>
                3
              </span>
              <span className="hidden sm:inline">Pago</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER CONFIRMATION VIEW */}
      {currentStep === 4 && confirmedOrder && (
        <div className="max-w-2xl mx-auto py-8 text-left space-y-8">
          
          {/* Header Card */}
          <div className="bg-white p-8 border border-[#DCDCD9] rounded-[2px] shadow-xs text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#777777]">
                ¡Muchas gracias por tu compra!
              </span>
              <h1 className="text-3xl font-extrabold font-display text-[#111111] mt-1">
                Orden #{confirmedOrder.orderNumber}
              </h1>
              <p className="text-xs text-[#777777] mt-2">
                Enviamos el comprobante y el detalle del pedido a <strong>{confirmedOrder.customer.email}</strong>.
              </p>
            </div>

            {/* Tracking Code Chip */}
            <div className="bg-[#F3F3F1] p-3 rounded flex items-center justify-between text-xs max-w-sm mx-auto">
              <div>
                <span className="text-[#777777] block text-[10px] uppercase">Código de seguimiento Andreani:</span>
                <span className="font-mono font-bold text-[#111111]">{confirmedOrder.trackingNumber}</span>
              </div>
              <button
                onClick={() => handleCopyOrderNumber(confirmedOrder.trackingNumber || '')}
                className="text-xs text-[#111111] hover:underline font-semibold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedOrder ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="bg-white p-6 sm:p-8 border border-[#DCDCD9] rounded-[2px] space-y-6">
            <h2 className="font-display font-bold text-base text-[#111111] pb-3 border-b border-[#DCDCD9]">
              Detalle del Pedido
            </h2>

            {/* Items */}
            <div className="divide-y divide-[#DCDCD9]/60">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-14 object-cover rounded bg-[#F3F3F1]"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                        {item.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-[#111111]">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-[#777777]">
                        Talle: {item.size} · Color: {item.color} · Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold tabular-nums text-[#111111]">
                    {formatARS(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-[#DCDCD9] space-y-1.5 text-xs text-[#777777]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#111111] font-semibold">{formatARS(confirmedOrder.subtotal)}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-[#C8102E]">
                  <span>Descuento aplicado ({confirmedOrder.discountCode})</span>
                  <span className="font-mono font-semibold">-{formatARS(confirmedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Costo de envío ({confirmedOrder.shippingMethod})</span>
                <span className="font-mono text-[#111111] font-semibold">
                  {confirmedOrder.shippingCost === 0 ? 'Gratis' : formatARS(confirmedOrder.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#DCDCD9]">
                <span>Total Abonado</span>
                <span className="font-mono">{formatARS(confirmedOrder.total)}</span>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#DCDCD9] text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-[#777777] block mb-1">
                  Datos de Entrega
                </span>
                <p className="font-semibold text-[#111111]">
                  {confirmedOrder.customer.firstName} {confirmedOrder.customer.lastName}
                </p>
                <p className="text-[#555]">
                  {confirmedOrder.shippingAddress.street} {confirmedOrder.shippingAddress.number}
                  {confirmedOrder.shippingAddress.floorApt && `, ${confirmedOrder.shippingAddress.floorApt}`}
                </p>
                <p className="text-[#555]">
                  {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.province} ({confirmedOrder.shippingAddress.postalCode})
                </p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-[#777777] block mb-1">
                  Forma de Pago
                </span>
                <p className="font-semibold text-[#111111]">{confirmedOrder.paymentMethod}</p>
                <p className="text-emerald-700 font-medium">Estado: Pago Aprobado</p>
                <p className="text-neutral-500 mt-1">
                  Fulfillment: En preparación para despacho
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#DCDCD9] flex flex-wrap gap-4 justify-between items-center">
              <Link
                to="/catalog"
                className="px-6 py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Volver a la Tienda
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#DCDCD9] text-xs font-semibold uppercase rounded hover:bg-[#F3F3F1]"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprobante</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STEPS 1, 2, 3 LAYOUT (FORM ON LEFT + SUMMARY ON RIGHT) */}
      {currentStep !== 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Area (7 Cols) */}
          <div className="lg:col-span-7">
            
            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep1} className="bg-white p-6 sm:p-8 border border-[#DCDCD9] rounded-[2px] space-y-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#111111]">
                    Paso 1 — Datos de Contacto
                  </h2>
                  <p className="text-xs text-[#777777] mt-1">
                    Ingresá tus datos para recibir la confirmación de compra y el seguimiento del envío.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      placeholder="Ej: Mateo"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.firstName && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      placeholder="Ej: Romero"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.lastName && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    placeholder="ejemplo@email.com"
                    className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                  />
                  {formErrors.email && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Teléfono Móvil (con código de área) *
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="+54 11 4829-1920"
                    className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                  />
                  {formErrors.phone && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.phone}</p>}
                </div>

                <div className="pt-4 border-t border-[#DCDCD9] flex items-center justify-between">
                  <Link to="/cart" className="text-xs font-semibold text-[#777777] hover:text-[#111111] flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a la bolsa</span>
                  </Link>
                  <button
                    type="submit"
                    className="h-12 px-8 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 hover:bg-black transition-colors"
                  >
                    <span>Continuar al Envío</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: SHIPPING ADDRESS & METHOD */}
            {currentStep === 2 && (
              <form onSubmit={handleNextStep2} className="bg-white p-6 sm:p-8 border border-[#DCDCD9] rounded-[2px] space-y-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#111111]">
                    Paso 2 — Dirección de Envío
                  </h2>
                  <p className="text-xs text-[#777777] mt-1">
                    ¿Dónde querés recibir tu paquete? Realizamos envíos a toda la República Argentina.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      placeholder="C1425"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111] uppercase"
                    />
                    {formErrors.postalCode && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.postalCode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Provincia *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.province}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, province: e.target.value })}
                      placeholder="Buenos Aires"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.province && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.province}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Ciudad / Localidad *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      placeholder="Palermo, CABA"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.city && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Calle *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                      placeholder="Av. Santa Fe"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.street && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.street}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.number}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, number: e.target.value })}
                      placeholder="3245"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.number && <p className="text-[11px] text-[#C8102E] mt-1">{formErrors.number}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Piso / Departamento (opcional)
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.floorApt}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, floorApt: e.target.value })}
                      placeholder="4 B"
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                      Referencias de entrega
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.notes}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                      placeholder="Entre calles, timbre..."
                      className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                {/* Shipping Method Options */}
                <div className="pt-4 border-t border-[#DCDCD9]">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                    Método de Envío
                  </span>
                  <div className="space-y-2">
                    <label 
                      onClick={() => setSelectedShippingMethod('andreani')}
                      className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                        selectedShippingMethod === 'andreani' ? 'border-[#111111] bg-[#F3F3F1]' : 'border-[#DCDCD9] hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={selectedShippingMethod === 'andreani'}
                          onChange={() => setSelectedShippingMethod('andreani')}
                          className="accent-[#111111]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#111111]">Andreani Estándar a Domicilio</p>
                          <p className="text-[11px] text-[#777777]">Plazo de entrega estimado: 2 a 4 días hábiles</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#111111]">
                        {cartShippingCost === 0 ? 'GRATIS' : formatARS(cartShippingCost)}
                      </span>
                    </label>

                    <label 
                      onClick={() => setSelectedShippingMethod('correo')}
                      className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                        selectedShippingMethod === 'correo' ? 'border-[#111111] bg-[#F3F3F1]' : 'border-[#DCDCD9] hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={selectedShippingMethod === 'correo'}
                          onChange={() => setSelectedShippingMethod('correo')}
                          className="accent-[#111111]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#111111]">Correo Argentino a Sucursal</p>
                          <p className="text-[11px] text-[#777777]">Retiro en sucursal más cercana (3 a 5 días hábiles)</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#111111]">
                        {cartShippingCost === 0 ? 'GRATIS' : formatARS(cartShippingCost)}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DCDCD9] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-[#777777] hover:text-[#111111] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a Datos Personales</span>
                  </button>
                  <button
                    type="submit"
                    className="h-12 px-8 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 hover:bg-black transition-colors"
                  >
                    <span>Continuar al Pago</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT METHOD (DEMO FLOW) */}
            {currentStep === 3 && (
              <div className="bg-white p-6 sm:p-8 border border-[#DCDCD9] rounded-[2px] space-y-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#111111]">
                    Paso 3 — Medio de Pago
                  </h2>
                  <p className="text-xs text-[#777777] mt-1">
                    Seleccioná tu forma de pago favorita. Todas las operaciones están respaldadas por Mercado Pago y cifrado SSL.
                  </p>
                </div>

                {/* Important Demo Notice */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Modo Demostración / Simulación de Compra:</strong>
                    <p className="mt-0.5">
                      Esta tienda es un prototipo interactivo frontend preparado para Mercado Pago. No se debitará dinero real ni se solicitarán credenciales bancarias auténticas.
                    </p>
                  </div>
                </div>

                {/* Payment Selection Options */}
                <div className="space-y-3">
                  {/* Mercado Pago Option */}
                  <label 
                    onClick={() => setPaymentMethod('Mercado Pago')}
                    className={`block p-4 border rounded cursor-pointer transition-colors ${
                      paymentMethod === 'Mercado Pago' ? 'border-[#111111] bg-[#F3F3F1]' : 'border-[#DCDCD9] hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_opt"
                          checked={paymentMethod === 'Mercado Pago'}
                          onChange={() => setPaymentMethod('Mercado Pago')}
                          className="accent-[#111111]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#111111]">Mercado Pago</p>
                          <p className="text-[11px] text-[#777777]">Tarjetas de débito, crédito en 6 cuotas y dinero en cuenta</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#009EE3]/15 text-[#009EE3] px-2 py-0.5 rounded">
                        MERCADO PAGO
                      </span>
                    </div>
                  </label>

                  {/* Credit Card Option */}
                  <label 
                    onClick={() => setPaymentMethod('Tarjeta de Crédito / Débito')}
                    className={`block p-4 border rounded cursor-pointer transition-colors ${
                      paymentMethod === 'Tarjeta de Crédito / Débito' ? 'border-[#111111] bg-[#F3F3F1]' : 'border-[#DCDCD9] hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_opt"
                          checked={paymentMethod === 'Tarjeta de Crédito / Débito'}
                          onChange={() => setPaymentMethod('Tarjeta de Crédito / Débito')}
                          className="accent-[#111111]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#111111]">Tarjeta Directa (Visa / Mastercard)</p>
                          <p className="text-[11px] text-[#777777]">Hasta 6 cuotas sin interés bancarias</p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-[#111111]" />
                    </div>

                    {paymentMethod === 'Tarjeta de Crédito / Débito' && (
                      <div className="mt-4 pt-4 border-t border-[#DCDCD9] space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-[#777777] uppercase mb-1">
                            Número de Tarjeta Simulado
                          </label>
                          <input
                            type="text"
                            value={demoCardData.cardNumber}
                            disabled
                            className="w-full h-10 px-3 bg-white border border-[#DCDCD9] rounded font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#777777] uppercase mb-1">
                              Titular
                            </label>
                            <input
                              type="text"
                              value={demoCardData.cardName}
                              disabled
                              className="w-full h-10 px-3 bg-white border border-[#DCDCD9] rounded font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#777777] uppercase mb-1">
                              Vencimiento
                            </label>
                            <input
                              type="text"
                              value={demoCardData.expiry}
                              disabled
                              className="w-full h-10 px-3 bg-white border border-[#DCDCD9] rounded font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#777777] uppercase mb-1">
                            Cuotas
                          </label>
                          <select
                            value={demoCardData.installments}
                            onChange={(e) => setDemoCardData({ ...demoCardData, installments: e.target.value })}
                            className="w-full h-10 px-3 bg-white border border-[#DCDCD9] rounded font-semibold"
                          >
                            <option value="1">1 pago de {formatARS(cartTotal)}</option>
                            <option value="3">3 cuotas sin interés de {formatARS(Math.round(cartTotal / 3))}</option>
                            <option value="6">6 cuotas sin interés de {formatARS(Math.round(cartTotal / 6))}</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Transfer Option */}
                  <label 
                    onClick={() => setPaymentMethod('Transferencia Bancaria')}
                    className={`block p-4 border rounded cursor-pointer transition-colors ${
                      paymentMethod === 'Transferencia Bancaria' ? 'border-[#111111] bg-[#F3F3F1]' : 'border-[#DCDCD9] hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_opt"
                          checked={paymentMethod === 'Transferencia Bancaria'}
                          onChange={() => setPaymentMethod('Transferencia Bancaria')}
                          className="accent-[#111111]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#111111]">Transferencia Bancaria Directa</p>
                          <p className="text-[11px] text-[#777777]">CBU / Alias bancario con confirmación instantánea</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        10% OFF EXTRA
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#DCDCD9] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-[#777777] hover:text-[#111111] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a Envío</span>
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    className="h-12 px-8 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 hover:bg-black transition-colors shadow-md"
                  >
                    <span>Finalizar y Confirmar Compra</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Mini Order Summary (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#F3F3F1] p-6 rounded-[2px] border border-[#DCDCD9] space-y-5">
              <h3 className="font-display font-bold text-sm text-[#111111] pb-2 border-b border-[#DCDCD9]">
                Resumen de tu Compra ({cart.length} prendas)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#DCDCD9]/60 pr-1 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-12 object-cover rounded bg-white"
                      />
                      <div>
                        <p className="font-semibold text-[#111111] line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-[#777777]">
                          Talle: {item.selectedSize} · Color: {item.selectedColor}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#111111]">
                      {formatARS(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-[#DCDCD9] space-y-1.5 text-xs text-[#777777]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-[#111111]">{formatARS(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#C8102E]">
                    <span>Descuento cupón</span>
                    <span className="font-mono font-semibold">-{formatARS(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío a domicilio</span>
                  <span className="font-mono font-semibold text-[#111111]">
                    {cartShippingCost === 0 ? 'Gratis' : formatARS(cartShippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#DCDCD9]">
                  <span>Total</span>
                  <span className="font-mono">{formatARS(cartTotal)}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#777777] flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#111111]" />
                <span>Garantía de cambio 30 días sin cargo</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
