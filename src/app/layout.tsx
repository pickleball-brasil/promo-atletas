import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';

import { MainNavigation } from '@/components/layout';

import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const BASE_URL = 'https://promo-atletas.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Promo Atletas — Promoções esportivas com desconto',
    template: '%s | Promo Atletas',
  },
  description:
    'Encontre as melhores promoções de artigos esportivos com cupons de desconto e links de afiliado.',
  openGraph: {
    siteName: 'Promo Atletas',
    type: 'website',
    locale: 'pt_BR',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-neutral-700 font-sans">
        <MainNavigation />
        {children}
      </body>
    </html>
  );
}
