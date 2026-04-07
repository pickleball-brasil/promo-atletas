import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Store } from 'lucide-react';

import { CopyCouponButton } from '@/components/coupon';
import { SharePromotionButton } from '@/components/promotion/share-promotion-button';
import {
  calculateFinalPriceWithCoupon,
  isCouponUsable,
} from '@/lib/coupons';
import { testIds } from '@/lib/test-ids';
import { formatCurrency } from '@/lib/utils';
import {
  getCouponById,
  getPromotionBySlug,
  isPromotionExpired,
} from '@/lib/promotions';

type PromotionDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const platformLabel = {
  mercadolivre: 'MercadoLivre',
  shopee: 'Shopee',
  amazon: 'Amazon',
  generic: 'Parceiro',
} as const;

const platformBadgeClass = {
  mercadolivre: 'bg-[#FFE600] text-black',
  shopee: 'bg-[#EE4D2D] text-white',
  amazon: 'bg-[#146EB4] text-white',
  generic: 'bg-neutral-300 text-neutral-900',
} as const;

export async function generateMetadata({
  params,
}: PromotionDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const promotion = getPromotionBySlug(slug);

  if (!promotion) {
    return {
      title: 'Promocao nao encontrada | Promo Atletas',
      description: 'A promocao solicitada nao foi encontrada.',
    };
  }

  const title = `${promotion.title} | Promo Atletas`;
  const description = `${promotion.title} com ${promotion.discountPercent}% de desconto por ${formatCurrency(promotion.promoPrice)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [promotion.imageUrl],
      type: 'website',
    },
    alternates: {
      canonical: `/promocoes/${promotion.slug}`,
    },
  };
}

export default async function PromotionDetailsPage({
  params,
}: PromotionDetailsPageProps) {
  const { slug } = await params;
  const promotion = getPromotionBySlug(slug);

  if (!promotion) {
    notFound();
  }

  const coupon = getCouponById(promotion.couponId);
  const expired = isPromotionExpired(promotion.expiresAt) || !promotion.isActive;
  const usableCoupon = coupon && isCouponUsable(coupon) ? coupon : undefined;
  const finalPrice = usableCoupon
    ? calculateFinalPriceWithCoupon(promotion.promoPrice, usableCoupon)
    : promotion.promoPrice;
  const formattedExpiresAt = new Intl.DateTimeFormat('pt-BR').format(new Date(promotion.expiresAt));

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: promotion.title,
    price: promotion.promoPrice,
    priceCurrency: 'BRL',
    availability: expired ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    url: `https://promo-atletas.vercel.app/promocoes/${promotion.slug}`,
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />

      <div className="mb-4">
        <Link
          href="/promocoes"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Voltar para promoções
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative h-72 w-full overflow-hidden rounded-xl bg-neutral-100 sm:h-96">
            <Image
              src={promotion.imageUrl}
              alt={promotion.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${platformBadgeClass[promotion.platform]}`}
              >
                <Store size={12} aria-hidden />
                {platformLabel[promotion.platform]}
              </span>
              <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                {promotion.title}
              </h1>
              <p className="text-sm text-neutral-500">Válida até: {formattedExpiresAt}</p>
            </div>

            <div className="space-y-0.5 rounded-xl bg-neutral-50 p-3">
              <p className="text-sm text-neutral-500 line-through">
                {formatCurrency(promotion.originalPrice)}
              </p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold leading-tight text-neutral-900">
                  {formatCurrency(promotion.promoPrice)}
                </p>
                <span className="pb-0.5 text-base font-semibold text-success-500">
                  {promotion.discountPercent}% off
                </span>
                {usableCoupon ? (
                  <span className="mb-1 inline-flex items-center rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold leading-none text-success-500">
                    com cupom
                  </span>
                ) : null}
              </div>
            </div>

            {coupon ? (
              <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Cupom</p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p
                    data-testid={testIds.promotionDetails.couponCode}
                    className="font-mono text-lg font-semibold text-neutral-900"
                  >
                    {coupon.code}
                  </p>
                  <CopyCouponButton
                    couponCode={coupon.code}
                    disabled={!usableCoupon}
                    testId={testIds.promotionDetails.couponCopy}
                    className="min-h-10 rounded-md border border-brand-500 px-3 py-2 text-xs font-semibold text-brand-500 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {!usableCoupon ? (
                  <p className="mt-1 text-xs text-danger-500">
                    Cupom indisponivel no momento. Verifique validade e limite de uso.
                  </p>
                ) : null}
              </div>
            ) : null}

            {expired ? (
              <p className="rounded-xl border border-danger-500 bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-500">
                Promoção encerrada
              </p>
            ) : (
              <Link
                href={`/r/${promotion.slug}`}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
              >
                Ir direto para loja
              </Link>
            )}

            <SharePromotionButton
              slug={promotion.slug}
              title={promotion.title}
              price={formatCurrency(promotion.promoPrice)}
              variant="full"
            />
          </div>
        </div>

        <div className="border-t border-neutral-300 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-neutral-900">Descrição</h2>
          <p className="mt-2 text-neutral-700">{promotion.description}</p>
        </div>

        <div className="border-t border-neutral-300 bg-neutral-50 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-neutral-900">Como chegar no valor final</h2>
          <ol className="mt-2 space-y-1 text-sm text-neutral-700">
            <li>1. Clique em Ir direto para loja para abrir a oferta.</li>
            <li>2. Confira o preco promocional exibido na pagina da loja.</li>
            <li>
              3. {usableCoupon
                ? `Se houver cupom, ele sera copiado automaticamente. Cole ${usableCoupon.code} na etapa de finalizar compra.`
                : 'Caso exista cupom para esta oferta, aplique no checkout para reduzir ainda mais o valor.'}
            </li>
          </ol>

          <p data-testid={testIds.promotionDetails.finalPrice} className="mt-3 text-sm font-semibold text-neutral-900">
            Valor final estimado: {formatCurrency(finalPrice)}
          </p>
          <p
            data-testid={testIds.promotionDetails.finalPriceNote}
            className="mt-1 text-xs text-neutral-500"
          >
            Importante: use o botao desta pagina para garantir o rastreio correto da promocao e de eventuais cupons.
          </p>
        </div>
      </article>
    </main>
  );
}