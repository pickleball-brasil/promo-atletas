'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  icon: z.string().min(1, 'Ícone obrigatório'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

export default function NovaCategoriaPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  function onSubmit(_data: CategoryFormData) {
    // Mock: sem persistência real
    router.push('/admin/categorias');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/categorias"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft size={15} aria-hidden />
          Categorias
        </Link>
        <span className="text-neutral-300">/</span>
        <h1 className="text-base font-semibold text-neutral-900">
          Nova categoria
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Nome *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={inputClass}
              placeholder="Ex: Calçados"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-400">
              O slug será gerado automaticamente a partir do nome.
            </p>
          </div>

          <div>
            <label
              htmlFor="icon"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Ícone *
            </label>
            <input
              id="icon"
              type="text"
              {...register('icon')}
              className={inputClass}
              placeholder="Ex: footprints"
            />
            {errors.icon && (
              <p className="mt-1 text-xs text-red-500">{errors.icon.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-400">
              Nome do ícone Lucide (ex: footprints, shirt, pill).
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/categorias"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar categoria'}
          </button>
        </div>
      </form>
    </div>
  );
}
