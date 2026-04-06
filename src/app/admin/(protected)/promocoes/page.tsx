import Link from 'next/link';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { promotions } from '@/mocks/promotions';
import { categories } from '@/mocks/categories';
import { formatCurrency } from '@/lib/utils';

const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

export default function AdminPromocoesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Promoções</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {promotions.length} promoção(ões) cadastrada(s)
          </p>
        </div>
        <Link
          href="/admin/promocoes/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Plus size={16} aria-hidden />
          Nova promoção
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Plataforma</th>
                <th className="px-4 py-3">Preço promo</th>
                <th className="px-4 py-3">Desconto</th>
                <th className="px-4 py-3">Cliques</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {categoryMap[p.categoryId] ?? '—'}
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-500">
                    {p.platform}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {formatCurrency(p.promoPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                      {p.discountPercent}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {p.clicks.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    {p.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                        <ToggleRight size={14} aria-hidden />
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400">
                        <ToggleLeft size={14} aria-hidden />
                        Inativa
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/promocoes/${p.id}/editar`}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label={`Editar ${p.title}`}
                      >
                        <Pencil size={15} aria-hidden />
                      </Link>
                      <button
                        type="button"
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Excluir ${p.title}`}
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
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
