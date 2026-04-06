import Image from 'next/image';
import Link from 'next/link';
import { BadgePercent, ExternalLink, Store, Ticket } from 'lucide-react';

import { CopyCouponButton } from '@/components/coupon';
import { SharePromotionButton } from './share-promotion-button';
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

interface PromotionCardProps {
  promotion: Promotion;
  priority?: boolean;
}

export function PromotionCard({ promotion, priority = false }: PromotionCardProps) {
  const coupon = getCouponById(promotion.couponId);
  const usableCoupon = coupon && isCouponUsable(coupon) ? coupon : undefined;

  return (
    <article
      data-testid={testIds.promotionCard.container}
      className="surface-card relative overflow-hidden rounded-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-36 w-full bg-neutral-100 sm:h-40">
        <Image
          src={promotion.imageUrl}
          alt={promotion.title}
          fill
          className="object-cover transition duration-500 hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          priority={priority}
        />
      </div>

      <div className="flex flex-col gap-3 p-3 pb-12">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span
              data-testid={testIds.promotionCard.discount}
              className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white"
            >
              <BadgePercent size={12} aria-hidden />
              -{promotion.discountPercent}%
            </span>
            <span
              data-testid={testIds.promotionCard.platform}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${platformBadgeClass[promotion.platform]}`}
            >
              <Store size={12} aria-hidden />
              {platformLabel[promotion.platform]}
            </span>
          </div>

          <h2
            data-testid={testIds.promotionCard.title}
            className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug text-neutral-900"
          >
            {promotion.title}
          </h2>

          <div className="mt-2.5 space-y-0.5 rounded-lg border border-neutral-300/80 bg-white p-2">
            <p data-testid={testIds.promotionCard.originalPrice} className="text-xs text-neutral-500 line-through">
              {formatCurrency(promotion.originalPrice)}
            </p>
            <p data-testid={testIds.promotionCard.promoPrice} className="text-lg font-bold text-neutral-900">
              {formatCurrency(promotion.promoPrice)}
            </p>
          </div>

          {usableCoupon ? (
            <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-neutral-300/80 bg-white px-2.5 py-1.5">
              <Ticket size={14} className="shrink-0 text-brand-500" aria-hidden />
              <code
                data-testid={testIds.promotionCard.couponCode}
                className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-neutral-900"
              >
                {usableCoupon.code}
              </code>
              <CopyCouponButton
                couponCode={usableCoupon.code}
                testId={testIds.promotionCard.couponCopy}
                className="shrink-0 rounded-md border border-brand-500 px-2 py-1 text-[11px] font-semibold text-brand-500 transition duration-200 hover:bg-brand-50"
              />
            </div>
          ) : null}

          <div className="mt-2.5 flex flex-col gap-1.5 sm:flex-row">
            <Link
              href={`/promocoes/${promotion.slug}`}
              data-testid={testIds.promotionCard.detailsLink}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-brand-500 px-2.5 py-2 text-xs font-semibold text-brand-500 transition duration-200 hover:bg-brand-50"
            >
              Ver detalhes
            </Link>
            <Link
              href={`/r/${promotion.slug}`}
              data-testid={testIds.promotionCard.offerLink}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-2 text-xs font-semibold text-white transition duration-200 hover:bg-brand-400"
            >
              Ver oferta
              <ExternalLink size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 right-3">
        <SharePromotionButton
          slug={promotion.slug}
          title={promotion.title}
          price={formatCurrency(promotion.promoPrice)}
          variant="compact"
        />
      </div>
    </article>
  );
}