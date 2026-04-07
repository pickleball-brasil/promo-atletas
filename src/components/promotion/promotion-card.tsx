import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Store, Ticket } from 'lucide-react';
import { useState } from 'react';

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
  compact?: boolean;
}

export function PromotionCard({ promotion, priority = false, compact = false }: PromotionCardProps) {
  const coupon = getCouponById(promotion.couponId);
  const usableCoupon = coupon && isCouponUsable(coupon) ? coupon : undefined;
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoToStore = async () => {
    if (isRedirecting) return;

    setIsRedirecting(true);

    if (usableCoupon) {
      try {
        await navigator.clipboard.writeText(usableCoupon.code);
      } catch {
        // clipboard indisponivel: segue para a loja mesmo assim
      }

      for (let remaining = 4; remaining > 0; remaining -= 1) {
        setCountdown(remaining);
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
      }

      setCountdown(null);
    }

    setIsRedirecting(false);

    window.open(`/r/${promotion.slug}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      data-testid={testIds.promotionCard.container}
      className={`surface-card group relative w-full overflow-hidden rounded-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${compact ? 'sm:mx-auto sm:max-w-[19rem]' : ''}`}
    >
      <Link
        href={`/promocoes/${promotion.slug}`}
        data-testid={testIds.promotionCard.detailsLink}
        aria-label={`Ver detalhes de ${promotion.title}`}
        className="absolute inset-0 z-10"
      />

      {usableCoupon ? (
        <div className="pointer-events-none absolute left-3 right-3 top-3 z-20">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-300/80 bg-white px-2.5 py-1.5">
            <Ticket size={14} className="shrink-0 text-brand-500" aria-hidden />
            <code
              data-testid={testIds.promotionCard.couponCode}
              className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-neutral-900"
            >
              {usableCoupon.code}
            </code>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-success-500">cupom</span>
          </div>
        </div>
      ) : null}

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

      <div className="pointer-events-none relative z-20 flex flex-col gap-2.5 p-3 pb-3">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span
              data-testid={testIds.promotionCard.platform}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${platformBadgeClass[promotion.platform]}`}
            >
              <Store size={12} aria-hidden />
              {platformLabel[promotion.platform]}
            </span>

            <div className="pointer-events-auto">
              <SharePromotionButton
                slug={promotion.slug}
                title={promotion.title}
                price={formatCurrency(promotion.promoPrice)}
                variant="compact"
              />
            </div>
          </div>

          <h2
            data-testid={testIds.promotionCard.title}
            className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 transition-colors duration-200 group-hover:text-brand-500"
          >
            {promotion.title}
          </h2>

          <div className="space-y-0.5">
            <p className="text-xs text-neutral-500 line-through" data-testid={testIds.promotionCard.originalPrice}>
              {formatCurrency(promotion.originalPrice)}
            </p>
            <div className="flex items-center gap-1.5">
              <p data-testid={testIds.promotionCard.promoPrice} className="text-lg font-bold leading-tight text-neutral-900">
                {formatCurrency(promotion.promoPrice)}
              </p>
              <span data-testid={testIds.promotionCard.discount} className="text-sm font-semibold text-success-500">
                {promotion.discountPercent}%
              </span>
              {usableCoupon ? (
                <span className="inline-flex items-center rounded-full bg-success-50 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-success-500">
                  com cupom
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={handleGoToStore}
              data-testid={testIds.promotionCard.offerLink}
              disabled={isRedirecting}
              className="pointer-events-auto inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-2 text-xs font-semibold text-white transition duration-200 hover:bg-brand-400 disabled:cursor-not-allowed"
            >
              {usableCoupon ? 'Copiar cupom e ir pra loja' : 'Ir direto para loja'}
              <ExternalLink size={14} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {usableCoupon && countdown ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/55 p-4">
          <div className="max-w-[260px] rounded-xl border border-success-500/40 bg-white px-3 py-2 text-center shadow-lg">
            <p className="text-xs font-semibold text-success-500">
              Cupom copiado com sucesso!
            </p>
            <p className="mt-2 text-[11px] text-neutral-700">
              Na loja, cole o cupom <strong>{usableCoupon.code}</strong> no campo de cupom ao finalizar a compra.
            </p>
            <p className="mt-2 text-[11px] font-semibold text-neutral-900">
              Abrindo a loja em {countdown} segundos...
            </p>
          </div>
        </div>
      ) : null}

    </article>
  );
}