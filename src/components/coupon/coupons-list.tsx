import { coupons } from '@/mocks';
import { isCouponUsable } from '@/lib/coupons';
import { testIds } from '@/lib/test-ids';

import { CouponCard } from './coupon-card';

export function CouponsList() {
  const availableCoupons = coupons.filter((coupon) => isCouponUsable(coupon));
  const unavailableCoupons = coupons.filter((coupon) => !isCouponUsable(coupon));

  return (
    <section className="space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Cupons disponiveis</h2>
          <span data-testid={testIds.couponsPage.availableCount} className="text-sm text-neutral-500">
            {availableCoupons.length}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </div>

      {unavailableCoupons.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Cupons indisponiveis</h2>
            <span data-testid={testIds.couponsPage.unavailableCount} className="text-sm text-neutral-500">
              {unavailableCoupons.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unavailableCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}