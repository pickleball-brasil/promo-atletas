import { promotions } from '@/mocks/promotions';
import { coupons } from '@/mocks/coupons';
import { MousePointerClick, TicketPercent, Tag, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const totalClicks = promotions.reduce((sum, p) => sum + p.clicks, 0);
const activePromotions = promotions.filter((p) => p.isActive).length;
const activeCoupons = coupons.filter((c) => c.isActive).length;

const topCoupons = [...coupons]
  .filter((c) => c.uses > 0)
  .sort((a, b) => b.uses - a.uses)
  .slice(0, 5);

const platformClicks = promotions.reduce<Record<string, number>>((acc, p) => {
  acc[p.platform] = (acc[p.platform] ?? 0) + p.clicks;
  return acc;
}, {});

const topPlatforms = Object.entries(platformClicks)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 4);

const platformLabels: Record<string, string> = {
  mercadolivre: 'MercadoLivre',
  shopee: 'Shopee',
  amazon: 'Amazon',
  generic: 'Outros',
};

const statCards = [
  {
    label: 'Total de Cliques',
    value: totalClicks.toLocaleString('pt-BR'),
    icon: MousePointerClick,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    label: 'Promoções Ativas',
    value: activePromotions,
    icon: TicketPercent,
    color: 'text-green-600 bg-green-50',
  },
  {
    label: 'Cupons Ativos',
    value: activeCoupons,
    icon: Tag,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    label: 'Maior Desconto',
    value: `${Math.max(...promotions.map((p) => p.discountPercent))}%`,
    icon: TrendingUp,
    color: 'text-orange-600 bg-orange-50',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Visão geral do sistema — dados estáticos (mock)
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${card.color}`}>
                <Icon size={20} aria-hidden />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
              <p className="mt-0.5 text-sm text-neutral-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top coupons */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-neutral-900">
            Cupons Mais Usados
          </h2>
          <div className="space-y-3">
            {topCoupons.map((coupon, idx) => (
              <div key={coupon.id} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-800">
                    {coupon.code}
                  </p>
                  <p className="text-xs text-neutral-500">{coupon.store}</p>
                </div>
                <span className="text-sm font-semibold text-neutral-700">
                  {coupon.uses} usos
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top platforms */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-neutral-900">
            Plataformas Populares
          </h2>
          <div className="space-y-4">
            {topPlatforms.map(([platform, clicks]) => {
              const pct = Math.round((clicks / totalClicks) * 100);
              return (
                <div key={platform}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-800">
                      {platformLabels[platform] ?? platform}
                    </span>
                    <span className="text-neutral-500">
                      {clicks.toLocaleString('pt-BR')} cliques ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top promotions */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Promoções Mais Clicadas
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs font-semibold uppercase text-neutral-400">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">Título</th>
                <th className="pb-2 pr-4">Plataforma</th>
                <th className="pb-2 pr-4">Preço promo</th>
                <th className="pb-2 text-right">Cliques</th>
              </tr>
            </thead>
            <tbody>
              {[...promotions]
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 5)
                .map((p, idx) => (
                  <tr
                    key={p.id}
                    className="border-b border-neutral-50 last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-neutral-400">{idx + 1}</td>
                    <td className="py-2.5 pr-4 font-medium text-neutral-800">
                      {p.title}
                    </td>
                    <td className="py-2.5 pr-4 capitalize text-neutral-500">
                      {platformLabels[p.platform] ?? p.platform}
                    </td>
                    <td className="py-2.5 pr-4 text-neutral-700">
                      {formatCurrency(p.promoPrice)}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-neutral-800">
                      {p.clicks.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
