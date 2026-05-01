export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminNav from '../AdminNav'
import PromocoesClient from './PromocoesClient'
import { Percent } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function PromocoesPage() {
  const promocoes = await prisma.promocao.findMany({ orderBy: { criadoEm: 'desc' } })

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Percent size={20} className="text-[#C9A84C]" />
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Promoções</h1>
          </div>
          <p className="text-xs text-[#555] mb-6">
            Desconto automático aplicado nos produtos da categoria/gênero selecionado.
            O preço promocional aparece no catálogo e no checkout.
          </p>

          <PromocoesClient promocoes={promocoes} />
        </div>
      </main>
    </div>
  )
}
