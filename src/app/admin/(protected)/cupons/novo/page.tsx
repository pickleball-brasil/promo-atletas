'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

const couponSchema = z.object({
  code: z
    .string()
    .min(2, 'Código deve ter pelo menos 2 caracteres')
    .max(30, 'Código muito longo')
    .regex(/^[A-Z0-9]+$/i, 'Use apenas letras e números'),
  store: z.string().min(2, 'Nome da loja obrigatório'),
  type: z.enum(['percent', 'fixed'], 'Selecione o tipo'),
  value: z
    .number('Valor inválido')
    .positive('Valor deve ser positivo'),
  maxUses: z
    .number('Quantidade inválida')
    .int('Deve ser número inteiro')
    .positive('Deve ser positivo'),
  expiresAt: z.string().min(1, 'Data de validade obrigatória'),
  isActive: z.boolean(),
});

type CouponFormData = z.infer<typeof couponSchema>;

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

export default function NovoCupomPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: { isActive: true },
  });

  function onSubmit(_data: CouponFormData) {
    // Mock: sem persistência real
    router.push('/admin/cupons');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/cupons"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft size={15} aria-hidden />
          Cupons
        </Link>
        <span className="text-neutral-300">/</span>
        <h1 className="text-base font-semibold text-neutral-900">Novo cupom</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Código *" error={errors.code?.message}>
            <input
              type="text"
              {...register('code')}
              className={inputClass}
              placeholder="Ex: ATLETA20"
            />
          </FormField>

          <FormField label="Loja *" error={errors.store?.message}>
            <input
              type="text"
              {...register('store')}
              className={inputClass}
              placeholder="Ex: Shopee Sports"
            />
          </FormField>

          <FormField label="Tipo *" error={errors.type?.message}>
            <select {...register('type')} className={inputClass}>
              <option value="">Selecione...</option>
              <option value="percent">Percentual (%)</option>
              <option value="fixed">Valor fixo (R$)</option>
            </select>
          </FormField>

          <FormField label="Valor *" error={errors.value?.message}>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('value', { valueAsNumber: true })}
              className={inputClass}
              placeholder="Ex: 20"
            />
          </FormField>

          <FormField label="Máximo de usos *" error={errors.maxUses?.message}>
            <input
              type="number"
              min="1"
              {...register('maxUses', { valueAsNumber: true })}
              className={inputClass}
              placeholder="Ex: 500"
            />
          </FormField>

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
                Cupom ativo
              </label>
            </div>
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/cupons"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar cupom'}
          </button>
        </div>
      </form>
    </div>
  );
}
