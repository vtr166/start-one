export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminNav from '../AdminNav'
import CupomForm from './CupomForm'
import CupomRow from './CupomRow'
import { Tag } from 'lucide-react'

export default async function CuponsPage() {
  const [cupons, afiliados] = await Promise.all([
    prisma.cupom.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { afiliado: { select: { nome: true } } },
    }),
    prisma.afiliado.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true },
    }),
  ])

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Tag size={20} className="text-[#C9A84C]" />
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Cupons de Desconto</h1>
          </div>

          <CupomForm afiliados={afiliados} />

          {cupons.length === 0 ? (
            <div className="card-dark p-12 text-center text-[#555] text-sm">
              Nenhum cupom cadastrado ainda. Crie o primeiro!
            </div>
          ) : (
            <div className="card-dark overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    {['Código', 'Desconto', 'Afiliado', 'Usos', 'Mín. pedido', 'Expira', 'Status', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#555]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cupons.map(c => <CupomRow key={c.id} c={c} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
