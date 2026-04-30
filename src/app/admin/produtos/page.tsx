export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import AdminNav from '../AdminNav'
import ToggleAtivo from './ToggleAtivo'

export default async function ProdutosAdmin() {
  const produtos = await prisma.produto.findMany({
    include: { variacoes: true },
    orderBy: { criadoEm: 'desc' },
  })

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Produtos</h1>
            <Link href="/admin/produtos/novo" className="btn-gold text-sm flex items-center gap-2">
              <Plus size={16} />
              Novo Produto
            </Link>
          </div>

          <div className="card-dark divide-y divide-[#2A2A2A]">
            {produtos.length === 0 && (
              <p className="p-6 text-[#555] text-sm">Nenhum produto cadastrado.</p>
            )}
            {produtos.map((p: typeof produtos[number]) => {
              const menorPreco = p.variacoes.sort((a, b) => a.preco - b.preco)[0]
              return (
                <div key={p.id} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#F5F5F5] truncate">{p.nome}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#888]">
                        {p.categoria === 'ARABE' ? 'Árabe' : 'Importado'}
                      </span>
                      {p.destaque && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
                          Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#555] mt-0.5">
                      {p.marca} · {p.variacoes.length} variações
                      {menorPreco && ` · a partir de ${formatPrice(menorPreco.preco)}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <ToggleAtivo id={p.id} ativo={p.ativo} />
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="p-2 text-[#888] hover:text-[#C9A84C] transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
