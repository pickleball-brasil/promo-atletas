'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const currentYear = new Date().getFullYear();

export function MainFooter() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="mt-8 border-t border-neutral-800 bg-neutral-950 text-neutral-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-base font-semibold text-white sm:text-lg">
          As melhores ofertas esportivas, reunidas em um so lugar.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link
            href="/politica-de-privacidade"
            className="text-neutral-300 transition hover:text-brand-400"
          >
            Politica de Privacidade
          </Link>
          <Link
            href="/institucional"
            className="text-neutral-300 transition hover:text-brand-400"
          >
            Institucional
          </Link>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          {currentYear} Promo Atletas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
