import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Suspense } from 'react'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarrinhoDrawer from '@/components/CarrinhoDrawer'
import BotaoWhatsApp from '@/components/BotaoWhatsApp'
import AffiliateTracker from '@/components/AffiliateTracker'
import PopupCaptura from '@/components/PopupCaptura'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://startoneimports.com.br'

export const metadata: Metadata = {
  title: 'Start One Imports | Perfumes Árabes e Importados',
  description:
    'Perfumes árabes e importados originais com qualidade garantida. Decants disponíveis para experimentar antes de comprar.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Start One Imports | Perfumes Árabes e Importados',
    description: 'Perfumes árabes e importados originais com qualidade garantida.',
    siteName: 'Start One Imports',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start One Imports',
    description: 'Perfumes árabes e importados originais.',
  },
}

const GA_ID  = process.env.NEXT_PUBLIC_GA_ID
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <head>
        {/* ── Google Analytics GA4 ───────────────────────────────── */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}

        {/* ── Meta Pixel ─────────────────────────────────────────── */}
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        <Header />
        <CarrinhoDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
        <BotaoWhatsApp />
        {/* Popup de captura de lead */}
        <Suspense fallback={null}>
          <PopupCaptura />
        </Suspense>
      </body>
    </html>
  )
}
