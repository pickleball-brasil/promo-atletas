import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { coupons } from '@/mocks/coupons';
import { formatCurrency } from '@/lib/utils';

export default function AdminCuponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Cupons</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {coupons.length} cupom(ns) cadastrado(s)
          </p>
        </div>
        <Link
          href="/admin/cupons/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Plus size={16} aria-hidden />
          Novo cupom
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-400">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Loja</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Usos</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3 font-mono font-semibold text-neutral-800">
                    {coupon.code}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{coupon.store}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {coupon.type === 'percent' ? 'Percentual' : 'Fixo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {coupon.type === 'percent'
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {coupon.uses.toLocaleString('pt-BR')} /{' '}
                    {coupon.maxUses.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    {coupon.isActive ? (
                      <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-400">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/cupons/${coupon.id}/editar`}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label={`Editar ${coupon.code}`}
                      >
                        <Pencil size={15} aria-hidden />
                      </Link>
                      <button
                        type="button"
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Excluir ${coupon.code}`}
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
