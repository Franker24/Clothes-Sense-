import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQSection[] = [
  {
    title: 'Pedidos y Compras',
    items: [
      {
        question: '¿Cómo hago un pedido en SENSE?',
        answer: 'Navegá por nuestro catálogo, elegí el producto que te guste, seleccioná el talle y color, y hacé clic en "Agregar a la Bolsa". Luego ingresá al carrito y seguí los pasos del checkout para completar tu compra.',
      },
      {
        question: '¿Puedo comprar como invitado?',
        answer: 'Sí, ofrecemos la opción de comprar como invitado sin necesidad de crear una cuenta. Sin embargo, recomendamos registrarte para poder hacer seguimiento de tus pedidos y acceder a descuentos exclusivos del SENSE Club.',
      },
      {
        question: '¿Qué medios de pago aceptan?',
        answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), Mercado Pago, transferencia bancaria (con 20% de descuento) y pagos en cuotas sin interés según el banco y la promoción vigente.',
      },
      {
        question: '¿Ofrecen cuotas sin interés?',
        answer: 'Sí, ofrecemos hasta 6 cuotas sin interés con tarjetas bancarias seleccionadas. Las promociones varían según el banco emisor y se actualizan periódicamente. Podés ver las cuotas disponibles al momento del pago.',
      },
      {
        question: '¿Cómo aplico un cupón de descuento?',
        answer: 'Al momento del checkout, vas a encontrar un campo para ingresar tu código de cupón. Escribilo y hacé clic en "Aplicar". El descuento se reflejará automáticamente en el total de tu compra.',
      },
    ],
  },
  {
    title: 'Envíos',
    items: [
      {
        question: '¿Realizan envíos a todo el país?',
        answer: 'Sí, realizamos envíos a todo el territorio argentino a través de OCA, Andreani y Correo Argentino. Los tiempos de entrega varían según la zona.',
      },
      {
        question: '¿Cuánto tarda en llegar mi pedido?',
        answer: 'CABA y GBA: 2 a 4 días hábiles. Interior del país: 4 a 7 días hábiles. En períodos de alta demanda (Cyber Monday, Hot Sale, etc.) los tiempos pueden extenderse unos días adicionales.',
      },
      {
        question: '¿El envío tiene costo?',
        answer: 'Envío gratis en compras superiores a $85.000. Para compras menores, el costo estándar de envío es de $7.800. También podés usar el cupón ENVIOGRATIS para bonificar el envío en cualquier compra.',
      },
      {
        question: '¿Puedo hacer seguimiento de mi envío?',
        answer: 'Sí, una vez que tu pedido sea despachado, te enviaremos un email con el número de seguimiento para que puedas rastrear tu paquete en tiempo real desde la sección "Mi Cuenta".',
      },
    ],
  },
  {
    title: 'Cambios y Devoluciones',
    items: [
      {
        question: '¿Puedo cambiar un producto?',
        answer: 'Sí, tenés 30 días corridos desde la recepción del producto para solicitar un cambio. El producto debe estar sin uso, con etiquetas originales y en su empaque original. Los cambios son gratuitos.',
      },
      {
        question: '¿Cómo solicito una devolución?',
        answer: 'Escribinos por WhatsApp o email indicando tu número de pedido y el motivo de la devolución. Te vamos a enviar una etiqueta de envío prepago para que nos devuelvas el producto sin costo.',
      },
      {
        question: '¿Cuánto tarda el reembolso?',
        answer: 'Una vez recibido y verificado el producto, procesamos el reembolso en un plazo de 5 a 10 días hábiles. El tiempo de acreditación depende del medio de pago utilizado.',
      },
    ],
  },
  {
    title: 'Productos y Talles',
    items: [
      {
        question: '¿Los productos son originales?',
        answer: 'Sí, todos nuestros productos son 100% originales y certificados. Trabajamos directamente con marcas oficiales como Nike, Adidas, Puma, Levi\'s, New Balance y Converse, entre otras.',
      },
      {
        question: '¿Cómo elijo mi talle correcto?',
        answer: 'Cada producto cuenta con una guía de talles específica en su página de detalle. Si tenés dudas, nuestro equipo de atención al cliente puede asesorarte por WhatsApp para que elijas el talle ideal.',
      },
      {
        question: '¿Tienen stock de todos los productos que muestran?',
        answer: 'Nuestro stock se actualiza en tiempo real. Si un producto aparece disponible en la web, tenemos stock. En caso de que se agote después de tu compra, te contactaremos para ofrecerte alternativas o el reembolso completo.',
      },
    ],
  },
  {
    title: 'Mi Cuenta y SENSE Club',
    items: [
      {
        question: '¿Cómo creo una cuenta?',
        answer: 'Hacé clic en el ícono de usuario en la parte superior de la web y seleccioná "Registrarse". Solo necesitás tu nombre, email y teléfono. ¡Es rápido y te da acceso a beneficios exclusivos!',
      },
      {
        question: '¿Qué beneficios tiene el SENSE Club?',
        answer: 'Los miembros del SENSE Club acceden a drops exclusivos antes que nadie, descuentos privados, envío prioritario y acumulan puntos con cada compra que pueden canjear por descuentos futuros.',
      },
      {
        question: '¿Olvidé mi contraseña, qué hago?',
        answer: 'En la pantalla de inicio de sesión, hacé clic en "Olvidé mi contraseña" e ingresá tu email registrado. Te enviaremos un link para crear una nueva contraseña de forma segura.',
      },
    ],
  },
];

const FAQAccordion: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => (
  <div className="border-b border-[#DCDCD9]">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
    >
      <span className={`text-sm sm:text-base font-semibold pr-4 transition-colors ${isOpen ? 'text-[#111111]' : 'text-[#333333] group-hover:text-[#111111]'}`}>
        {item.question}
      </span>
      <ChevronDown 
        className={`w-5 h-5 text-[#777777] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-out ${
        isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
      }`}
    >
      <p className="text-sm text-[#555555] leading-relaxed pr-8">
        {item.answer}
      </p>
    </div>
  </div>
);

export const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      {/* Header */}
      <div className="bg-[#111111] text-white py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">Preguntas Frecuentes</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight uppercase">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
            Encontrá respuestas a las preguntas más frecuentes sobre pedidos, envíos, cambios, devoluciones y mucho más.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16">
          
          {/* Main FAQ Accordion */}
          <div className="space-y-10">
            {FAQ_DATA.map((section, sIdx) => (
              <div key={sIdx}>
                <h2 className="text-lg sm:text-xl font-bold font-display text-[#111111] mb-2 pb-3 border-b-2 border-[#111111]">
                  {section.title}
                </h2>
                <div>
                  {section.items.map((item, iIdx) => {
                    const key = `${sIdx}-${iIdx}`;
                    return (
                      <FAQAccordion
                        key={key}
                        item={item}
                        isOpen={openItems.has(key)}
                        onToggle={() => toggleItem(key)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: Contact Info */}
          <div className="lg:sticky lg:top-28 self-start space-y-6">
            <div className="bg-[#F3F3F1] rounded-xl p-6 sm:p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#777777] mb-4">
                ¿No encontrás tu respuesta?
              </h3>
              <p className="text-sm text-[#555555] mb-6 leading-relaxed">
                Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier consulta.
              </p>

              <div className="space-y-4">
                <a
                  href="https://wa.me/5491139028819"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">WhatsApp</span>
                    <span className="text-xs text-[#777777]">Respuesta inmediata</span>
                  </div>
                </a>

                <a
                  href="mailto:hola@sense.com.ar"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">Email</span>
                    <span className="text-xs text-[#777777]">hola@sense.com.ar</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">Teléfono</span>
                    <span className="text-xs text-[#777777]">+54 11 3902-8819</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] text-white rounded-xl p-6 sm:p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">
                Horarios de Atención
              </h3>
              <div className="space-y-1.5 text-sm text-white/80">
                <p><span className="font-semibold text-white">Lun a Vie:</span> 9:00 a 18:00 hs</p>
                <p><span className="font-semibold text-white">Sáb:</span> 10:00 a 14:00 hs</p>
                <p><span className="font-semibold text-white">Dom y Feriados:</span> Cerrado</p>
              </div>
            </div>

            <Link
              to="/catalog"
              className="block w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider bg-[#111111] text-white rounded-lg hover:bg-black transition-colors"
            >
              Explorar Catálogo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

