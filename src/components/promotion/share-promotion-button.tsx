'use client';

import { Check, Link2, Share2 } from 'lucide-react';
import { useState } from 'react';

interface SharePromotionButtonProps {
  title: string;
  slug: string;
  /** Valor promocional formatado, ex: "R$ 199,90" */
  price: string;
  /** Compact: exibe só ícones (para cards). Full: exibe texto + ícones (para detalhes). */
  variant?: 'compact' | 'full';
}

function buildUrl(slug: string) {
  return `${window.location.origin}/promocoes/${slug}`;
}

function buildWhatsAppUrl(title: string, slug: string, price: string) {
  const url = buildUrl(slug);
  const text = `*${title}*\nPor apenas *${price}*!\n\nVeja a oferta completa: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

export function SharePromotionButton({
  title,
  slug,
  price,
  variant = 'compact',
}: SharePromotionButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(title, slug, price), '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const url = buildUrl(slug);

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text: `Confira essa promoção: ${title}`,
          url,
        });
        return;
      } catch {
        // usuário cancelou o share nativo — não faz nada
        return;
      }
    }

    // Fallback: copiar link
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — ignora silenciosamente
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 pt-1">
        <button
          type="button"
          onClick={handleWhatsApp}
          aria-label="Compartilhar no WhatsApp"
          title="Compartilhar no WhatsApp"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-neutral-500 transition duration-200 hover:-translate-y-0.5 hover:bg-[#25D366]/10 hover:text-[#25D366]"
        >
          <WhatsAppIcon />
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label={copied ? 'Link copiado!' : 'Compartilhar link'}
          title={copied ? 'Link copiado!' : 'Compartilhar link'}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-neutral-500 transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 hover:text-neutral-700"
        >
          {copied ? (
            <Check size={14} className="text-success-500" aria-hidden />
          ) : (
            <Share2 size={14} aria-hidden />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={handleWhatsApp}
        className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#25D366] bg-[#25D366]/5 px-4 py-2.5 text-sm font-semibold text-[#25D366] transition duration-200 hover:-translate-y-0.5 hover:bg-[#25D366]/10"
      >
        <WhatsAppIcon />
        Compartilhar no WhatsApp
      </button>
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? 'Link copiado!' : 'Copiar link da promoção'}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:w-auto"
      >
        {copied ? (
          <>
            <Check size={15} className="text-success-500" aria-hidden />
            Link copiado!
          </>
        ) : (
          <>
            <Link2 size={15} aria-hidden />
            Copiar link
          </>
        )}
      </button>
    </div>
  );
}
