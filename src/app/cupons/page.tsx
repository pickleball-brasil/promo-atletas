import type { Metadata } from 'next';
import { CouponsList } from '@/components/coupon/coupons-list';
import { testIds } from '@/lib/test-ids';
import { Scissors, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cupons de Desconto',
  description:
    'Cupons exclusivos de desconto para artigos esportivos nas melhores lojas: Shopee, MercadoLivre e Amazon.',
  alternates: { canonical: '/cupons' },
};

export default function CuponsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <header data-mobile-submenu-anchor className="mb-6 animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-600">
          <Scissors size={12} aria-hidden />
          Economia imediata
        </span>
        <h1
          data-testid={testIds.couponsPage.title}
          className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-neutral-900 sm:text-3xl"
        >
          <Tag size={22} className="text-brand-500" aria-hidden />
          Cupons
        </h1>
        <p className="mt-1 text-sm text-neutral-500 sm:text-base">
          Copie o cupom e finalize a compra usando o link da promocao para garantir o melhor valor.
        </p>
      </header>

      <CouponsList />
    </main>
  );
}