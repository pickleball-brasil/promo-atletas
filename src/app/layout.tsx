import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';

import { CommunityBanner, MainFooter, MainNavigation } from '@/components/layout';

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
  icons: {
    icon: [
      { url: '/brand/favicon.ico' },
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'icon',
        url: '/brand/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/brand/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
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
        <CommunityBanner />
        <MainNavigation />
        {children}
        <MainFooter />
      </body>
    </html>
  );
}
