import { BadgePercent, ExternalLink, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CopyCouponButton } from '@/components/coupon';
import { isCouponUsable } from '@/lib/coupons';
import { getCouponById } from '@/lib/promotions';
import type { Promotion } from '@/types/domain';
import { testIds } from '@/lib/test-ids';
import { formatCurrency } from '@/lib/utils';

const platformLabel: Record<Promotion['platform'], string> = {
  mercadolivre: 'MercadoLivre',
  shopee: 'Shopee',
  amazon: 'Amazon',
  generic: 'Parceiro',
};

const platformBadgeClass: Record<Promotion['platform'], string> = {
  mercadolivre: 'bg-[#FFE600] text-black',
  shopee: 'bg-[#EE4D2D] text-white',
  amazon: 'bg-[#146EB4] text-white',
  generic: 'bg-neutral-300 text-neutral-900',
};

interface PromotionsListProps {
  promotions: Promotion[];
}

export function PromotionsList({ promotions }: PromotionsListProps) {
  return (
    <div data-testid={testIds.promotionsPage.list} className="space-y-2">
      {promotions.map((promotion) => {
        const coupon = getCouponById(promotion.couponId);
        const usableCoupon = coupon && isCouponUsable(coupon) ? coupon : undefined;

        return (
          <article
            key={promotion.id}
            className="surface-card flex flex-col gap-3 rounded-lg p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Imagem pequena */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-100 sm:h-14 sm:w-14">
              <Image
                src={promotion.imageUrl}
                alt={promotion.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            {/* Info coluna 1: Desconto + Título + Preço */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white shrink-0">
                  <BadgePercent size={12} aria-hidden />
                  -{promotion.discountPercent}%
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0 ${platformBadgeClass[promotion.platform]}`}>
                  <Store size={12} aria-hidden />
                  {platformLabel[promotion.platform]}
                </span>
              </div>
              <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900">
                {promotion.title}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                {formatCurrency(promotion.originalPrice)} →{' '}
                <span className="font-semibold text-neutral-900">{formatCurrency(promotion.promoPrice)}</span>
              </p>
            </div>

            {/* Cupom */}
            {usableCoupon && (
              <div className="flex items-center gap-2 rounded-lg border border-neutral-300/80 bg-white px-2.5 py-1.5 shrink-0">
                <code className="font-mono text-xs font-semibold text-neutral-900 truncate">
                  {usableCoupon.code}
                </code>
                <CopyCouponButton
                  couponCode={usableCoupon.code}
                  testId={testIds.promotionCard.couponCopy}
                  className="shrink-0 rounded-md border border-brand-500 px-2 py-1 text-[10px] font-semibold text-brand-500 transition duration-200 hover:bg-brand-50"
                />
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-1.5 shrink-0">
              <Link
                href={`/promocoes/${promotion.slug}`}
                className="inline-flex items-center justify-center rounded-lg border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-500 transition duration-200 hover:bg-brand-50"
              >
                Detalhes
              </Link>
              <Link
                href={`/r/${promotion.slug}`}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition duration-200 hover:bg-brand-400"
              >
                Oferta
                <ExternalLink size={12} aria-hidden />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
