import { CopyCouponButton } from '@/components/coupon/copy-coupon-button';
import { BadgeCheck, CircleOff, Clock3, Store, TicketPercent } from 'lucide-react';
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

  const statusLabel = expired ? 'Expirado' : exhausted ? 'Esgotado' : 'Ativo';
  const StatusIcon = expired || exhausted ? CircleOff : BadgeCheck;
  const statusClass = expired || exhausted
    ? 'bg-danger-50 text-danger-500 border-danger-500'
    : 'bg-success-50 text-success-500 border-success-500';

  const discountLabel =
    coupon.type === 'percent' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} OFF`;

  return (
    <article
      data-testid={testIds.couponsPage.card}
      className="surface-card rounded-2xl p-4 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <Store size={12} aria-hidden />
            Loja
          </p>
          <p className="text-sm font-semibold text-neutral-900">{coupon.store}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
          <StatusIcon size={12} aria-hidden />
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-neutral-50 p-3">
        <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <TicketPercent size={12} aria-hidden />
          Codigo
        </p>
        <code
          data-testid={testIds.couponsPage.code}
          className="mt-1 block font-mono text-lg font-semibold text-neutral-900"
        >
          {coupon.maskedCode}
        </code>
        <p className="mt-1 text-xs font-medium text-neutral-600">Desconto: {discountLabel}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1 text-xs text-neutral-500">
          <Clock3 size={12} aria-hidden />
          Validade: {coupon.expiresAt.slice(0, 10)}
        </p>
        <CopyCouponButton
          couponCode={coupon.code}
          testId={testIds.couponsPage.copyButton}
          disabled={!usable}
          disabledLabel={expired ? 'Cupom expirado' : exhausted ? 'Cupom esgotado' : 'Cupom indisponivel'}
          className="min-h-10 rounded-lg border border-brand-500 px-3 py-2 text-xs font-semibold text-brand-500 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-500"
        />
      </div>
    </article>
  );
}
