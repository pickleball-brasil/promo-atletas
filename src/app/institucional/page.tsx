import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Institucional',
  description:
    'Conheca a proposta do Promo Atletas e como selecionamos promocoes para a comunidade.',
  alternates: { canonical: '/institucional' },
};

export default function InstitucionalPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
        Institucional
      </h1>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
        <p>
          O Promo Atletas e um catalogo de ofertas esportivas com foco em curadoria,
          transparencia e economia real para a comunidade.
        </p>
        <p>
          Selecionamos promocoes com base em relevancia, percentual de desconto e
          confiabilidade da loja parceira.
        </p>
        <p>
          Alguns links podem ser afiliados, sem custo adicional para voce.
        </p>
      </div>
    </main>
  );
}
