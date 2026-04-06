import type { Coupon } from '@/types/domain';

export function isCouponExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}

export function isCouponExhausted(uses: number, maxUses: number): boolean {
  return uses >= maxUses;
}

export function isCouponUsable(coupon: Coupon): boolean {
  if (!coupon.isActive) return false;
  if (isCouponExpired(coupon.expiresAt)) return false;
  if (isCouponExhausted(coupon.uses, coupon.maxUses)) return false;

  return true;
}

export function calculateFinalPriceWithCoupon(price: number, coupon: Coupon): number {
  if (coupon.type === 'percent') {
    const discounted = price * (1 - coupon.value / 100);
    return Math.max(0, discounted);
  }

  return Math.max(0, price - coupon.value);
}