import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { categories } from '@/mocks/categories';
import { promotions } from '@/mocks/promotions';

const promotionCountByCategory = promotions.reduce<Record<string, number>>(
  (acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1;
    return acc;
  },
  {},
);

export default function AdminCategoriasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categorias</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {categories.length} categoria(s) cadastrada(s)
          </p>
        </div>
        <Link
          href="/admin/categorias/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Plus size={16} aria-hidden />
          Nova categoria
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Ícone</th>
                <th className="px-4 py-3">Promoções</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-neutral-500">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{cat.icon}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {promotionCountByCategory[cat.id] ?? 0} promoção(ões)
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/categorias/${cat.id}/editar`}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label={`Editar ${cat.name}`}
                      >
                        <Pencil size={15} aria-hidden />
                      </Link>
                      <button
                        type="button"
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Excluir ${cat.name}`}
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
