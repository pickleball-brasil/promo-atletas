import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de Privacidade',
  description: 'Saiba como tratamos dados e cookies no Promo Atletas.',
  alternates: { canonical: '/politica-de-privacidade' },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
        Politica de Privacidade
      </h1>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
        <p>
          Respeitamos sua privacidade. Este site pode coletar dados de navegacao
          anonimizados para analises de desempenho e melhoria de experiencia.
        </p>
        <p>
          Nao armazenamos dados sensiveis sem base legal e consentimento quando
          aplicavel.
        </p>
        <p>
          Para solicitacoes relacionadas a privacidade, entre em contato pelos
          canais oficiais do projeto.
        </p>
      </div>
    </main>
  );
}
