import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PromotionsCatalog } from '@/components/promotion/promotions-catalog';
import { testIds } from '@/lib/test-ids';
import { Flame, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Promoções Esportivas',
  description:
    'Catálogo completo de promoções de artigos esportivos com descontos exclusivos, cupons e links de afiliado.',
  alternates: { canonical: '/promocoes' },
};

export default function PromocoesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div data-mobile-submenu-anchor className="mb-5 animate-fade-in-up sm:mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand-500/30">
          <Sparkles size={11} aria-hidden />
          Curadoria ativa
        </span>
        <h1
          data-testid={testIds.promotionsPage.title}
          className="mt-3 flex items-center gap-2.5 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl"
        >
          <Flame size={28} className="text-brand-500" aria-hidden />
          Promoções Esportivas
        </h1>
        <p className="mt-2 text-sm text-neutral-500 sm:text-base">
          Filtre por esporte, categoria ou plataforma e encontre as melhores ofertas para você.
        </p>
      </div>

      <Suspense>
        <PromotionsCatalog />
      </Suspense>
    </main>
  );
}