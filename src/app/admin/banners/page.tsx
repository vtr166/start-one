export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminNav from '../AdminNav'
import BannerForm from './BannerForm'
import BannerCard from './BannerCard'
import { ImageIcon } from 'lucide-react'

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { ordem: 'asc' } })
  const [criando, setCriando] = [false, null] // server-side default

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon size={20} className="text-[#C9A84C]" />
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Banners do Site</h1>
          </div>
          <p className="text-xs text-[#555] mb-6">
            Os banners aparecem no carrossel principal da home. Ordem menor = aparece primeiro.
            Se não houver banners ativos, o site usa o banner padrão do código.
          </p>

          {/* Formulário de criação */}
          <div className="mb-8">
            <BannersPageClient banners={banners} />
          </div>
        </div>
      </main>
    </div>
  )
}

// Client wrapper para controlar o "Novo Banner"
import BannersPageClient from './BannersPageClient'
