import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickQuestions = [
    'Hola! Quería consultar por stock de zapatillas.',
    'Hola, ¿cómo gestiono un cambio de talle?',
    'Quería saber el estado de mi pedido.',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || message;
    if (!text.trim()) return;
    const url = `https://wa.me/5491148291920?text=${encodeURIComponent(text)}`;
    window.location.href = url;
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Popover Chat window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] max-w-[320px] sm:w-80 bg-white rounded-lg shadow-2xl border border-[#DCDCD9] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-[#111111] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold">
                <FaWhatsapp className="w-4.5 h-4.5 fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-display uppercase tracking-wider">
                  SENSE Atención al Cliente
                </h4>
                <p className="text-[10px] text-neutral-300">En línea · Respuesta en minutos</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white"
              aria-label="Cerrar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-[#F3F3F1] text-xs space-y-3 max-h-64 overflow-y-auto">
            <div className="bg-white p-3 rounded-lg shadow-2xs text-[#111111]">
              <p className="font-medium">¡Hola! 👋</p>
              <p className="text-[#555] mt-1 text-[11px]">
                ¿Tenés alguna consulta sobre talles, envíos o promociones de SENSE? Escribinos y te asesoramos al instante.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">Preguntas rápidas:</span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2 bg-white hover:bg-neutral-50 rounded border border-[#DCDCD9] text-[11px] text-[#111111] font-medium transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#DCDCD9] flex gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribí tu mensaje..."
              className="flex-1 text-xs px-3 py-2 border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#25D366] hover:bg-emerald-600 text-white rounded transition-colors"
              aria-label="Enviar WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button (Matching the mint-green bubble with official WhatsApp icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-90 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer relative"
        aria-label="Contactar por WhatsApp"
        title="Atención WhatsApp SENSE"
      >
        <FaWhatsapp className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 fill-white" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full border-2 border-[#25D366] animate-pulse" />
      </button>
    </div>
  );
};
