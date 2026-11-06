import React, { useEffect, useRef } from 'react';
import { Tag, Sparkles, Zap, CreditCard, Truck, RefreshCw } from 'lucide-react';
import gsap from 'gsap';

export const DiscountTape: React.FC = () => {
  const tapeRef = useRef<HTMLDivElement>(null);

  const perks = [
    { icon: Zap, text: 'HASTA 50% OFF EN SELECCIÓN DE ZAPATILLAS & DENIM', badge: 'PROMO CYBER' },
    { icon: CreditCard, text: '6 Y 9 CUOTAS SIN INTERÉS EN TODA LA TIENDA', badge: 'TODAS LAS TARJETAS' },
    { icon: Truck, text: 'ENVÍO GRATIS A TODO EL PAÍS A PARTIR DE $100.000', badge: 'CORREO & ANDREANI' },
    { icon: Tag, text: '10% OFF EXTRA ABONANDO POR TRANSFERENCIA BANCARIA', badge: 'DESCUENTO DIRECTO' },
    { icon: Sparkles, text: 'CUPÓN DE BIENVENIDA: SENSE10 (10% OFF EXTRA)', badge: 'NUEVOS CLIENTES' },
    { icon: RefreshCw, text: 'PRIMER CAMBIO 100% GRATUITO A DOMICILIO O EN TIENDA', badge: 'GARANTÍA OFICIAL' },
  ];

  return (
    <div className="w-full bg-[#0a0a0a] text-white border-y border-white/10 overflow-hidden py-3 select-none relative shadow-lg">
      {/* Tape continuous ticker */}
      <div 
        ref={tapeRef}
        className="animate-marquee flex items-center whitespace-nowrap"
      >
        {/* Double array for seamless 50% translation infinite loop */}
        {[...perks, ...perks].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="inline-flex items-center gap-3 px-6 text-xs font-bold uppercase tracking-wider shrink-0">
              <span className="bg-white text-black px-2 py-0.5 rounded-[2px] text-[10px] font-extrabold tracking-widest">
                {item.badge}
              </span>
              <Icon className="w-4 h-4 text-white shrink-0" />
              <span className="text-white/90 hover:text-white transition-colors">
                {item.text}
              </span>
              <span className="text-white/40 font-bold ml-3" aria-hidden="true">
                ✦
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
