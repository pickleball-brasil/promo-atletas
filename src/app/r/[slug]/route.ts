import { NextResponse } from 'next/server';

import { getPromotionBySlug, isPromotionExpired } from '@/lib/promotions';

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { slug } = await params;
  const promotion = getPromotionBySlug(slug);

  if (!promotion || !promotion.isActive || isPromotionExpired(promotion.expiresAt)) {
    return new NextResponse('Oferta encerrada', { status: 410 });
  }

  return NextResponse.redirect(promotion.affiliateUrl, 302);
}