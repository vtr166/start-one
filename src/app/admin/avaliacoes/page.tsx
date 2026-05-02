export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Check, Trash2, Star } from 'lucide-react'
import AdminNav from '../AdminNav'

async function aprovar(id: string) {
  'use server'
  await prisma.avaliacao.update({ where: { id }, data: { aprovado: true } })
  revalidatePath('/admin/avaliacoes')
}

async function deletar(id: string) {
  'use server'
  await prisma.avaliacao.delete({ where: { id } })
  revalidatePath('/admin/avaliacoes')
}

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={12} className={n <= nota ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#333]'} />
      ))}
    </div>
  )
}

export default async function AdminAvaliacoesPage() {
  const pendentes = await prisma.avaliacao.findMany({
    where: { aprovado: false },
    include: { produto: { select: { nome: true, slug: true } } },
    orderBy: { criadoEm: 'asc' },
  })

  const aprovadas = await prisma.avaliacao.findMany({
    where: { aprovado: true },
    include: { produto: { select: { nome: true, slug: true } } },
    orderBy: { criadoEm: 'desc' },
    take: 20,
  })

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
      <h1 className="text-xl font-bold text-[#F5F5F5] mb-6">Avaliações</h1>

      {/* Pendentes */}
      {pendentes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Aguardando aprovação ({pendentes.length})
            </h2>
          </div>
          <div className="space-y-3">
            {pendentes.map(av => (
              <div key={av.id} className="card-dark p-4 flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-semibold text-[#F5F5F5]">{av.nome}</span>
                    <Estrelas nota={av.nota} />
                  </div>
                  <p className="text-xs text-[#C9A84C] mb-1">{av.produto.nome}</p>
                  {av.comentario && <p className="text-xs text-[#888] leading-relaxed">{av.comentario}</p>}
                  <p className="text-[10px] text-[#444] mt-2">
                    {av.criadoEm.toLocaleDateString('pt-BR', { dateStyle: 'short' })}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <form action={aprovar.bind(null, av.id)}>
                    <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors">
                      <Check size={12} /> Aprovar
                    </button>
                  </form>
                  <form action={deletar.bind(null, av.id)}>
                    <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                      <Trash2 size={12} /> Excluir
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendentes.length === 0 && (
        <div className="mb-8 p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-sm text-green-400">
          ✓ Nenhuma avaliação pendente
        </div>
      )}

      {/* Aprovadas */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#888] mb-4">
          Aprovadas recentes
        </h2>
        {aprovadas.length === 0 ? (
          <p className="text-xs text-[#555]">Nenhuma avaliação aprovada ainda.</p>
        ) : (
          <div className="space-y-2">
            {aprovadas.map(av => (
              <div key={av.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A]">
                <Estrelas nota={av.nota} />
                <span className="text-sm text-[#F5F5F5] font-medium">{av.nome}</span>
                <span className="text-xs text-[#555]">→</span>
                <span className="text-xs text-[#C9A84C]">{av.produto.nome}</span>
                {av.comentario && <span className="text-xs text-[#555] flex-1 truncate">{av.comentario}</span>}
                <form action={deletar.bind(null, av.id)}>
                  <button type="submit" className="text-[#555] hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
      </main>
    </div>
  )
}
