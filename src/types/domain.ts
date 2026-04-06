export type Platform = 'mercadolivre' | 'shopee' | 'amazon' | 'generic';

export type Sport =
  | 'corrida'
  | 'musculacao'
  | 'crossfit'
  | 'yoga'
  | 'ciclismo'
  | 'futebol'
  | 'tenis'
  | 'natacao';

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  store: string;
  expiresAt: string;
  maxUses: number;
  uses: number;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  platform: Platform;
  platformLogoUrl: string;
  categoryId: string;
  sport: Sport;
  originalPrice: number;
  promoPrice: number;
  discountPercent: number;
  affiliateUrl: string;
  couponId?: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}