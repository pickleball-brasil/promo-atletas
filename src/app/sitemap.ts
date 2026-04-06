import type { MetadataRoute } from 'next';

import { categories } from '@/mocks/categories';
import { promotions } from '@/mocks/promotions';
import { isPromotionExpired } from '@/lib/promotions';

const BASE_URL = 'https://promo-atletas.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/promocoes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cupons`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const promotionRoutes: MetadataRoute.Sitemap = promotions
    .filter((p) => p.isActive && !isPromotionExpired(p.expiresAt))
    .map((p) => ({
      url: `${BASE_URL}/promocoes/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/promocoes?categoria=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...promotionRoutes, ...categoryRoutes];
}
