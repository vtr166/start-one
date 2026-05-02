export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminNav from '../AdminNav'
import { formatPrice } from '@/lib/utils'
import EstoqueInput from './EstoqueInput'
import { Package, Droplets, AlertTriangle, XCircle } from 'lucide-react'

export default async function EstoquePage() {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    include: { variacoes: { where: { ativo: true }, orderBy: [{ tipo: 'asc' }, { preco: 'asc' }] } },
    orderBy: { nome: 'asc' },
  })

  // Totais para o resumo
  const todasVar = produtos.flatMap(p => p.variacoes)
  const esgotadas = todasVar.filter(v => v.estoque === 0).length
  const criticas  = todasVar.filter(v => v.estoque > 0 && v.estoque <= 3).length
  const baixas    = todasVar.filter(v => v.estoque > 3 && v.estoque <= 10).length

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Package size={20} className="text-[#C9A84C]" />
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Gestão de Estoque</h1>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="card-dark p-4 text-center">
              <p className="text-2xl font-black text-[#F5F5F5]">{todasVar.length}</p>
              <p className="text-[10px] text-[#555] uppercase tracking-widest mt-0.5">Total variações</p>
            </div>
            <div className="card-dark p-4 text-center">
              <p className="text-2xl font-black text-red-400">{esgotadas}</p>
              <p className="text-[10px] text-[#555] uppercase tracking-widest mt-0.5">Esgotadas</p>
            </div>
            <div className="card-dark p-4 text-center">
              <p className="text-2xl font-black text-orange-400">{criticas}</p>
              <p className="text-[10px] text-[#555] uppercase tracking-widest mt-0.5">Críticas (≤3)</p>
            </div>
            <div className="card-dark p-4 text-center">
              <p className="text-2xl font-black text-yellow-400">{baixas}</p>
              <p className="text-[10px] text-[#555] uppercase tracking-widest mt-0.5">Baixas (4–10)</p>
            </div>
          </div>

          {/* Alertas */}
          {(esgotadas > 0 || criticas > 0) && (
            <div className="mb-6 p-4 rounded-xl border border-orange-400/20 bg-orange-400/5 space-y-1.5">
              <p className="text-xs font-bold text-orange-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle size={13} /> Atenção necessária
              </p>
              {todasVar.filter(v => v.estoque === 0).slice(0, 5).map(v => {
                const prod = produtos.find(p => p.variacoes.some(vv => vv.id === v.id))
                return (
                  <p key={v.id} className="text-xs text-[#888] flex items-center gap-2">
                    <XCircle size={11} className="text-red-400 shrink-0" />
                    <strong className="text-[#F5F5F5]">{prod?.nome}</strong>
                    — {v.tipo === 'FRASCO' ? 'Frasco' : 'Decant'} {v.volume} ({formatPrice(v.preco)})
                    <span className="text-red-400 font-bold">ESGOTADO</span>
                  </p>
                )
              })}
              {esgotadas > 5 && (
                <p className="text-[10px] text-[#555]">...e mais {esgotadas - 5} esgotadas.</p>
              )}
            </div>
          )}

          {/* Lista de produtos */}
          <div className="space-y-3">
            {produtos.map(produto => {
              const temAlerta = produto.variacoes.some(v => v.estoque <= 5)
              return (
                <div key={produto.id}
                  className={`card-dark p-4 border ${temAlerta ? 'border-orange-400/20' : 'border-[#2A2A2A]'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-bold text-[#F5F5F5]">{produto.nome}</h3>
                    <span className="text-[10px] text-[#555]">{produto.marca}</span>
                    {temAlerta && <AlertTriangle size={12} className="text-orange-400 ml-auto" />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {produto.variacoes.map(v => (
                      <div key={v.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                          v.estoque === 0      ? 'border-red-400/20 bg-red-400/5'
                          : v.estoque <= 3     ? 'border-orange-400/20 bg-orange-400/5'
                          : v.estoque <= 10    ? 'border-yellow-400/20 bg-yellow-400/5'
                          :                     'border-[#1A1A1A] bg-[#0A0A0A]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {v.tipo === 'DECANT'
                            ? <Droplets size={13} className="text-[#888] shrink-0" />
                            : <Package size={13} className="text-[#C9A84C] shrink-0" />
                          }
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#F5F5F5] truncate">
                              {v.tipo === 'DECANT' ? 'Decant' : 'Frasco'} {v.volume}
                            </p>
                            <p className="text-[10px] text-[#C9A84C]">{formatPrice(v.preco)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {v.estoque === 0 ? (
                            <span className="text-[10px] font-bold text-red-400">Esgotado</span>
                          ) : v.estoque <= 3 ? (
                            <span className="text-[10px] font-bold text-orange-400">⚡ Crítico</span>
                          ) : v.estoque <= 10 ? (
                            <span className="text-[10px] font-bold text-yellow-400">Baixo</span>
                          ) : null}
                          <EstoqueInput variacaoId={v.id} estoqueAtual={v.estoque} />
                        </div>
                      </div>
                    ))}
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
