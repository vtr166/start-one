import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarrinhoDrawer from '@/components/CarrinhoDrawer'
import BotaoWhatsApp from '@/components/BotaoWhatsApp'
import AffiliateTracker from '@/components/AffiliateTracker'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Start One Imports | Perfumes Árabes e Importados',
  description:
    'Perfumes árabes e importados originais com qualidade garantida. Decants disponíveis para experimentar antes de comprar.',
  openGraph: {
    title: 'Start One Imports',
    description: 'Perfumes árabes e importados originais.',
    siteName: 'Start One Imports',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        <Header />
        <CarrinhoDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
        <BotaoWhatsApp />
      </body>
    </html>
  )
}
