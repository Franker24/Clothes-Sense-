import React from 'react';
import { X, MapPin, Phone, Clock, Navigation } from 'lucide-react';

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORES = [
  {
    name: 'SENSE Flagship Palermo Soho',
    address: 'Honduras 4820, Palermo, CABA',
    hours: 'Lunes a Sábados 10:00 a 20:30 hs · Domingos 14:00 a 20:00 hs',
    phone: '+54 11 4829-1920',
    pickup: 'Retiro Pick-Up Inmediato disponible',
  },
  {
    name: 'SENSE Alto Palermo Shopping',
    address: 'Av. Santa Fe 3253, Nivel 2, Local 42, CABA',
    hours: 'Todos los días 10:00 a 22:00 hs',
    phone: '+54 11 4829-1921',
    pickup: 'Retiro Pick-Up Inmediato disponible',
  },
  {
    name: 'SENSE Unicenter Shopping',
    address: 'Paraná 3745, Planta Baja, Martínez, Buenos Aires',
    hours: 'Todos los días 10:00 a 22:00 hs',
    phone: '+54 11 4829-1922',
    pickup: 'Retiro Pick-Up Inmediato disponible',
  },
  {
    name: 'SENSE Alcorta Shopping',
    address: 'Jerónimo Salguero 3172, Nivel 1, CABA',
    hours: 'Todos los días 10:00 a 21:00 hs',
    phone: '+54 11 4829-1923',
    pickup: 'Retiro Pick-Up Inmediato disponible',
  },
  {
    name: 'SENSE Córdoba Shopping',
    address: 'José de Goyechea 2851, Villa Cabrera, Córdoba',
    hours: 'Todos los días 10:00 a 22:00 hs',
    phone: '+54 351 482-9192',
    pickup: 'Retiro Pick-Up disponible en 24 hs',
  },
  {
    name: 'SENSE Alto Rosario',
    address: 'Junín 501, Local 18, Rosario, Santa Fe',
    hours: 'Todos los días 10:00 a 21:00 hs',
    phone: '+54 341 482-9192',
    pickup: 'Retiro Pick-Up disponible en 24 hs',
  },
];

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="min-h-screen px-2.5 py-4 sm:px-4 sm:py-8 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-[2px] overflow-hidden z-10 border border-[#DCDCD9] max-h-[92vh] flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#DCDCD9] flex items-center justify-between bg-[#111111] text-white shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <MapPin className="w-5 h-5 text-white shrink-0" />
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider">
                  Locales Oficiales SENSE
                </h3>
                <p className="text-[11px] text-neutral-300">
                  Pick-up gratuito en tiendas y envíos a todo el país
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full transition-colors"
              aria-label="Cerrar modal de locales"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Store List */}
          <div className="p-6 max-h-[70vh] overflow-y-auto divide-y divide-[#DCDCD9] space-y-4">
            {STORES.map((st, i) => (
              <div key={i} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#111111]">{st.name}</h4>
                  <p className="text-[#555] flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#777777] shrink-0" />
                    <span>{st.address}</span>
                  </p>
                  <p className="text-[#777777] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#777777] shrink-0" />
                    <span>{st.hours}</span>
                  </p>
                  <p className="text-[#777777] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#777777] shrink-0" />
                    <span>{st.phone}</span>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {st.pickup}
                  </span>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(st.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start sm:self-center px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors whitespace-nowrap"
                >
                  Cómo llegar →
                </a>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#F3F3F1] border-t border-[#DCDCD9] text-center text-xs text-[#777777]">
            <span>¿Buscás comprar online? Enviamos a todo el país vía Correo Argentino y Andreani.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
