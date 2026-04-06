import { coupons, promotions } from '@/mocks';

export function getPromotionBySlug(slug: string) {
  return promotions.find((promotion) => promotion.slug === slug);
}

export function getCouponById(couponId?: string) {
  if (!couponId) return undefined;
  return coupons.find((coupon) => coupon.id === couponId);
}

export function isPromotionExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}

export function isPromotionAvailable(slug: string): boolean {
  const promotion = getPromotionBySlug(slug);
  if (!promotion) return false;

  return promotion.isActive && !isPromotionExpired(promotion.expiresAt);
}