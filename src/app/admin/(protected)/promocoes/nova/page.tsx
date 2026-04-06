'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { categories } from '@/mocks/categories';

const promotionSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  imageUrl: z.string().url('URL da imagem inválida'),
  platform: z.enum(['mercadolivre', 'shopee', 'amazon', 'generic'], 'Selecione uma plataforma'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  originalPrice: z
    .number('Preço inválido')
    .positive('Preço deve ser positivo'),
  promoPrice: z
    .number('Preço inválido')
    .positive('Preço deve ser positivo'),
  affiliateUrl: z.string().url('URL de afiliado inválida'),
  expiresAt: z.string().min(1, 'Data de validade obrigatória'),
  isActive: z.boolean(),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

export default function NovaPromocaoPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: { isActive: true },
  });

  function onSubmit(_data: PromotionFormData) {
    // Mock: sem persistência real
    router.push('/admin/promocoes');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/promocoes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft size={15} aria-hidden />
          Promoções
        </Link>
        <span className="text-neutral-300">/</span>
        <h1 className="text-base font-semibold text-neutral-900">Nova promoção</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Título *" error={errors.title?.message}>
              <input
                type="text"
                {...register('title')}
                className={inputClass}
                placeholder="Ex: Tênis Nike Air Max 90"
              />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField label="Descrição *" error={errors.description?.message}>
              <textarea
                rows={3}
                {...register('description')}
                className={inputClass}
                placeholder="Descreva brevemente a promoção..."
              />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField label="URL da imagem *" error={errors.imageUrl?.message}>
              <input
                type="url"
                {...register('imageUrl')}
                className={inputClass}
                placeholder="https://..."
              />
            </FormField>
          </div>

          <FormField label="Plataforma *" error={errors.platform?.message}>
            <select {...register('platform')} className={inputClass}>
              <option value="">Selecione...</option>
              <option value="mercadolivre">MercadoLivre</option>
              <option value="shopee">Shopee</option>
              <option value="amazon">Amazon</option>
              <option value="generic">Outro</option>
            </select>
          </FormField>

          <FormField label="Categoria *" error={errors.categoryId?.message}>
            <select {...register('categoryId')} className={inputClass}>
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Preço original (R$) *" error={errors.originalPrice?.message}>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('originalPrice', { valueAsNumber: true })}
              className={inputClass}
              placeholder="0,00"
            />
          </FormField>

          <FormField label="Preço promocional (R$) *" error={errors.promoPrice?.message}>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('promoPrice', { valueAsNumber: true })}
              className={inputClass}
              placeholder="0,00"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="URL de afiliado *" error={errors.affiliateUrl?.message}>
              <input
                type="url"
                {...register('affiliateUrl')}
                className={inputClass}
                placeholder="https://..."
              />
            </FormField>
          </div>

          <FormField label="Válido até *" error={errors.expiresAt?.message}>
            <input
              type="datetime-local"
              {...register('expiresAt')}
              className={inputClass}
            />
          </FormField>

          <FormField label="Status" error={errors.isActive?.message}>
            <div className="flex items-center gap-2 pt-1">
              <input
                id="isActive"
                type="checkbox"
                {...register('isActive')}
                className="size-4 rounded border-neutral-300 text-brand-500"
              />
              <label htmlFor="isActive" className="text-sm text-neutral-700">
                Promoção ativa
              </label>
            </div>
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/promocoes"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar promoção'}
          </button>
        </div>
      </form>
    </div>
  );
}
