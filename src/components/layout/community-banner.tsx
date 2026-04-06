'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'promo-atletas:community-banner:hidden-until';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function CommunityBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    try {
      const hiddenUntilRaw = window.localStorage.getItem(DISMISS_KEY);
      const hiddenUntil = hiddenUntilRaw ? Number(hiddenUntilRaw) : 0;

      if (hiddenUntil && !Number.isNaN(hiddenUntil) && Date.now() < hiddenUntil) {
        setVisible(false);
      }
    } catch {
      // localStorage indisponivel — manter visivel
    }
  }, [pathname]);

  if (pathname.startsWith('/admin') || !visible) return null;

  const dismissBanner = () => {
    try {
      window.localStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + SEVEN_DAYS_MS),
      );
    } catch {
      // Se nao conseguir persistir, ainda assim fecha nesta sessao
    }

    setVisible(false);
  };

  return (
    <div className="relative overflow-hidden border-b border-brand-400/30 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-2">
        <p className="mr-auto text-xs font-semibold tracking-wide text-white/95 sm:text-sm">
          Comunidade ativa: ofertas em tempo real no Telegram e WhatsApp.
        </p>

        <div className="flex items-center gap-2">
          <Link
            href="https://t.me/promoatletas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/30 transition hover:bg-white/25"
          >
            <Send size={13} aria-hidden />
            Telegram
          </Link>

          <Link
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/30 transition hover:bg-white/25"
          >
            <MessageCircle size={13} aria-hidden />
            WhatsApp
          </Link>

          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Fechar banner da comunidade"
            className="inline-flex size-7 items-center justify-center rounded-md bg-black/15 text-white transition hover:bg-black/25"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
