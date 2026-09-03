'use client';

import { Phone } from 'lucide-react';

interface FloatingWhatsAppProps {
  settings?: any;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const whatsappUrl = settings?.whatsapp 
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` 
    : 'https://wa.me/905525833234';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp İletişim"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 border border-white/20 group"
    >
      <Phone className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-neutral-900/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-lg font-medium">
        WhatsApp ile Yazın
      </span>
    </a>
  );
}
