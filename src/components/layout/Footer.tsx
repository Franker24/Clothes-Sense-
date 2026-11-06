import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa6';
import { animateTrustStrip, animateFooterElements } from '../../utils/animations';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const trustStripRef = useRef<HTMLElement>(null);
  const footerNavRef = useRef<HTMLDivElement>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // GSAP animations on scroll
  useEffect(() => {
    const revertTrust = animateTrustStrip(trustStripRef.current);
    const revertFooter = animateFooterElements(footerNavRef.current);
    return () => {
      if (revertTrust) revertTrust();
      if (revertFooter) revertFooter();
    };
  }, []);

  return (
    <footer className="select-none overflow-hidden relative bg-[#0b0b0b]">
      {/* 
        1. Ultra-Minimalist Trust Banner (Directly ported from image_f28529ef.jpg)
        Pure white background, clean line art icons, uppercase bold typography,
        2x2 grid on mobile and 4 columns on desktop with hairline dividers.
      */}
      <section 
        ref={trustStripRef}
        className="bg-white border-t border-b border-[#e5e5e5] py-8 sm:py-14"
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            
            {/* 1. Free Shipping */}
            <div className="trust-item-anim flex flex-col items-center text-center p-4 sm:px-6 sm:py-6 border-r border-b lg:border-b-0 border-[#e5e5e5] transition-transform duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-2.5 sm:mb-4 text-[#111111]">
                <svg className="w-9 h-9 sm:w-12 sm:h-12 stroke-[1.25] text-black fill-none" viewBox="0 0 48 48" stroke="currentColor">
                  <rect x="7" y="14" width="21" height="18" rx="2" strokeWidth="1.5" />
                  <line x1="11" y1="19" x2="21" y2="19" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="11" y1="23" x2="21" y2="23" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="11" y1="27" x2="17" y2="27" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M28 20h7l5 5v7h-12V20z" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M29 23h5.5l3 3.5H29v-3.5z" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="14" cy="34" r="3.2" strokeWidth="1.5" fill="white" />
                  <circle cx="34" cy="34" r="3.2" strokeWidth="1.5" fill="white" />
                </svg>
              </div>
              <h3 className="text-[11px] sm:text-[13px] font-black tracking-[0.16em] uppercase text-[#111111]">
                FREE SHIPPING
              </h3>
              <p className="text-[10px] sm:text-xs text-[#555555] mt-1 sm:mt-1.5 font-normal tracking-tight max-w-[200px]">
                En órdenes mayores a $120.000 a todo el país
              </p>
            </div>

            {/* 2. Secure Payment */}
            <div className="trust-item-anim flex flex-col items-center text-center p-4 sm:px-6 sm:py-6 border-b lg:border-b-0 lg:border-r border-[#e5e5e5] transition-transform duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-2.5 sm:mb-4 text-[#111111]">
                <svg className="w-9 h-9 sm:w-12 sm:h-12 stroke-[1.25] text-black fill-none" viewBox="0 0 48 48" stroke="currentColor">
                  <rect x="7" y="13" width="34" height="22" rx="3.5" strokeWidth="1.5" />
                  <line x1="7" y1="19" x2="41" y2="19" strokeWidth="1.5" />
                  <rect x="11" y="24" width="7" height="5" rx="1.5" strokeWidth="1.5" />
                  <line x1="24" y1="27" x2="31" y2="27" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="33" y1="27" x2="37" y2="27" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-[11px] sm:text-[13px] font-black tracking-[0.16em] uppercase text-[#111111]">
                SECURE PAYMENT
              </h3>
              <p className="text-[10px] sm:text-xs text-[#555555] mt-1 sm:mt-1.5 font-normal tracking-tight max-w-[200px]">
                Checkout seguro y hasta 6 cuotas sin interés
              </p>
            </div>

            {/* 3. Easy Returns */}
            <div className="trust-item-anim flex flex-col items-center text-center p-4 sm:px-6 sm:py-6 border-r border-[#e5e5e5] transition-transform duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-2.5 sm:mb-4 text-[#111111]">
                <svg className="w-9 h-9 sm:w-12 sm:h-12 stroke-[1.25] text-black fill-none" viewBox="0 0 48 48" stroke="currentColor">
                  <path d="M13 24c0-6.075 4.925-11 11-11 4.1 0 7.67 2.25 9.55 5.58" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="28 19 34 19 34 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M35 24c0 6.075-4.925 11-11 11-4.1 0-7.67-2.25-9.55-5.58" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="20 29 14 29 14 35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-[11px] sm:text-[13px] font-black tracking-[0.16em] uppercase text-[#111111]">
                EASY RETURNS
              </h3>
              <p className="text-[10px] sm:text-xs text-[#555555] mt-1 sm:mt-1.5 font-normal tracking-tight max-w-[200px]">
                30 días para cambios de talle sin costo
              </p>
            </div>

            {/* 4. Quality Guarantee */}
            <div className="trust-item-anim flex flex-col items-center text-center p-4 sm:px-6 sm:py-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-2.5 sm:mb-4 text-[#111111]">
                <svg className="w-9 h-9 sm:w-12 sm:h-12 stroke-[1.25] text-black fill-none" viewBox="0 0 48 48" stroke="currentColor">
                  <path d="M24 9l13 5.5v9.5c0 8.5-5.5 14.5-13 17-7.5-2.5-13-8.5-13-17v-9.5L24 9z" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M19 24l3.8 4 7.2-8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-[11px] sm:text-[13px] font-black tracking-[0.16em] uppercase text-[#111111]">
                QUALITY GUARANTEE
              </h3>
              <p className="text-[10px] sm:text-xs text-[#555555] mt-1 sm:mt-1.5 font-normal tracking-tight max-w-[200px]">
                100% original, marcas y licencias oficiales
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 
        2. Black & White Minimalist Navigation Grid
      */}
      <div ref={footerNavRef} className="bg-[#0b0b0b] text-white pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
            
            {/* Brand Column */}
            <div className="footer-col-anim col-span-2 md:col-span-3 lg:col-span-2 pr-0 lg:pr-8">
              <Link to="/" className="inline-block text-2xl sm:text-3xl font-black tracking-tighter uppercase font-display text-white">
                SENSE
              </Link>
              <p className="text-[10.5px] font-bold tracking-[0.25em] text-neutral-400 uppercase mt-1">
                FIND YOUR SENSE.
              </p>
              <p className="text-xs text-neutral-400 mt-2.5 sm:mt-3 leading-relaxed max-w-sm">
                Plataforma multimarca de moda urbana y contemporánea en Argentina. Curaduría rigurosa de las marcas más influyentes del mundo.
              </p>
              
              <div className="mt-4 sm:mt-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                  BUENOS AIRES · ARS ($)
                </span>
              </div>

              {/* Newsletter */}
              <div className="mt-5 sm:mt-6 max-w-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white mb-2">
                  Newsletter Exclusivo
                </p>
                {subscribed ? (
                  <div className="flex items-center gap-2 text-xs text-white bg-neutral-900 border border-white/20 px-3 py-2.5 rounded-[2px]">
                    <Check className="w-4 h-4 text-white" />
                    <span>¡Suscripción confirmada al Club SENSE!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex items-center border border-white/25 focus-within:border-white transition-colors bg-black rounded-[2px] overflow-hidden">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingresá tu correo..."
                      className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none min-h-[42px]"
                      required
                    />
                    <button
                      type="submit"
                      aria-label="Suscribirse"
                      className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer min-h-[42px] active:scale-95"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Colecciones */}
            <div className="footer-col-anim">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-3 sm:mb-4">
                Colecciones
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link to="/hombres" className="hover:text-white transition-colors py-0.5 block">
                    Hombres
                  </Link>
                </li>
                <li>
                  <Link to="/damas" className="hover:text-white transition-colors py-0.5 block">
                    Damas
                  </Link>
                </li>
                <li>
                  <Link to="/kids" className="hover:text-white transition-colors py-0.5 block">
                    Niños
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=remeras-tops" className="hover:text-white transition-colors py-0.5 block">
                    Remeras & Estampas
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=calzado-zapatillas" className="hover:text-white transition-colors py-0.5 block">
                    Calzado & Zapas
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=pantalones-jeans" className="hover:text-white transition-colors py-0.5 block">
                    Denim & Jeans
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?sale=true" className="text-white font-semibold underline underline-offset-4 hover:text-neutral-300 py-0.5 block">
                    Sale (Hasta 50% OFF)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Marcas */}
            <div className="footer-col-anim">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-3 sm:mb-4">
                Marcas
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-400">
                <li><Link to="/brands" className="hover:text-white transition-colors py-0.5 block">Nike</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors py-0.5 block">Adidas Originals</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors py-0.5 block">Puma</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors py-0.5 block">Levi's</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors py-0.5 block">New Balance</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors py-0.5 block">Converse</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors text-white/80 py-0.5 block">Ver todas →</Link></li>
              </ul>
            </div>

            {/* Atención */}
            <div className="footer-col-anim col-span-2 sm:col-span-1">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-3 sm:mb-4">
                Atención
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-400">
                <li><Link to="/account" className="hover:text-white transition-colors py-0.5 block">Seguimiento de Envío</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors py-0.5 block">Preguntas Frecuentes</Link></li>
                <li><Link to="/catalog" className="hover:text-white transition-colors py-0.5 block">Guía de Talles</Link></li>
                <li><Link to="/account" className="hover:text-white transition-colors py-0.5 block">Cambios y Devoluciones</Link></li>
                <li><Link to="/account" className="hover:text-white transition-colors py-0.5 block">Botón de Arrepentimiento</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors text-neutral-500 py-0.5 block">Acceso Admin</Link></li>
              </ul>
            </div>
          </div>

          {/* Large Ghost SENSE Typography */}
          <div 
            aria-hidden="true" 
            className="select-none font-black tracking-widest text-center text-white/[0.04] text-[50px] sm:text-[110px] md:text-[150px] lg:text-[200px] leading-none my-5 sm:my-6 pointer-events-none font-display uppercase"
          >
            SENSE
          </div>

          {/* Bottom Bar: Copyright + Payment trust + Social Icons */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
            <p className="text-center md:text-left">© 2026 SENSE Argentina S.R.L. CUIT 30-71649201-9.</p>
            
            <div className="flex items-center gap-3 sm:gap-4 text-neutral-400 text-[10px] sm:text-[11px]">
              <span className="text-white/80 font-medium">Mercado Pago</span>
              <span>•</span>
              <span>Tarjetas</span>
              <span>•</span>
              <span>SSL 256-bit</span>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram SENSE"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/5491148291920" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp Oficial SENSE"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok SENSE"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
