import { CopyCouponButton } from '@/components/coupon/copy-coupon-button';
import { BadgeCheck, CircleOff } from 'lucide-react';
import {
  isCouponExhausted,
  isCouponExpired,
  isCouponUsable,
} from '@/lib/coupons';
import { testIds } from '@/lib/test-ids';
import type { Coupon } from '@/types/domain';

type CouponCardProps = {
  coupon: Coupon;
};

export function CouponCard({ coupon }: CouponCardProps) {
  const usable = isCouponUsable(coupon);
  const expired = isCouponExpired(coupon.expiresAt);
  const exhausted = isCouponExhausted(coupon.uses, coupon.maxUses);

  const StatusIcon = expired || exhausted ? CircleOff : BadgeCheck;
  const statusClass = expired || exhausted
    ? 'text-danger-500'
    : 'text-success-500';

  const discountLabel =
    coupon.type === 'percent' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} OFF`;

  return (
    <article
      data-testid={testIds.couponsPage.card}
      className="surface-card flex items-center gap-3 rounded-xl px-3 py-2.5"
    >
      <StatusIcon size={14} className={`shrink-0 ${statusClass}`} aria-hidden />

      <code
        data-testid={testIds.couponsPage.code}
        className="min-w-0 flex-1 truncate font-mono text-sm font-bold tracking-wider text-neutral-900"
      >
        {coupon.code}
      </code>

      <span className="hidden shrink-0 text-xs text-neutral-400 sm:inline">
        {coupon.store}
      </span>

      <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600">
        {discountLabel}
      </span>

      <CopyCouponButton
        couponCode={coupon.code}
        testId={testIds.couponsPage.copyButton}
        disabled={!usable}
        disabledLabel={expired ? 'Cupom expirado' : exhausted ? 'Cupom esgotado' : 'Cupom indisponivel'}
        className="shrink-0 rounded-lg border border-brand-500 px-2.5 py-1.5 text-xs font-semibold text-brand-500 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-500"
      />
    </article>
  );
}
