export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminNav from '../AdminNav'
import AfiliadoForm from './AfiliadoForm'
import AfiliadoToggle from './AfiliadoToggle'
import { formatPrice } from '@/lib/utils'
import { Users, Tag, TrendingUp } from 'lucide-react'

export default async function AfiliadosPage() {
  const afiliados = await prisma.afiliado.findMany({
    orderBy: { criadoEm: 'desc' },
    include: {
      cupons: {
        include: {
          pedidos: {
            where: { status: { in: ['APROVADO', 'ENVIADO', 'ENTREGUE'] } },
            select: { total: true, desconto: true, criadoEm: true },
          },
        },
      },
    },
  })

  // Calcula métricas por afiliado
  const comMetricas = afiliados.map(af => {
    const todosPedidos = af.cupons.flatMap(c => c.pedidos)
    const totalVendas  = todosPedidos.reduce((s, p) => s + p.total, 0)
    const comissao     = totalVendas * (af.comissao / 100)
    const qtdPedidos   = todosPedidos.length
    const codigoCupons = af.cupons.map(c => c.codigo).join(', ')
    return { ...af, totalVendas, comissao, qtdPedidos, codigoCupons }
  })

  const totalComissoes = comMetricas.reduce((s, a) => s + a.comissao, 0)
  const totalVendasAf  = comMetricas.reduce((s, a) => s + a.totalVendas, 0)

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users size={20} className="text-[#C9A84C]" />
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Afiliados & Influencers</h1>
          </div>

          {/* Cards resumo */}
          {comMetricas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="card-dark p-4">
                <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Total via afiliados</p>
                <p className="text-2xl font-black text-[#C9A84C]">{formatPrice(totalVendasAf)}</p>
              </div>
              <div className="card-dark p-4">
                <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Comissões a pagar</p>
                <p className="text-2xl font-black text-green-400">{formatPrice(totalComissoes)}</p>
              </div>
              <div className="card-dark p-4">
                <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Afiliados ativos</p>
                <p className="text-2xl font-black text-[#F5F5F5]">{comMetricas.filter(a => a.ativo).length}</p>
              </div>
            </div>
          )}

          <AfiliadoForm />

          {comMetricas.length === 0 ? (
            <div className="card-dark p-12 text-center text-[#555] text-sm">
              Nenhum afiliado cadastrado. Cadastre o primeiro influencer!
            </div>
          ) : (
            <div className="space-y-4">
              {comMetricas.map(af => (
                <div key={af.id} className="card-dark p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-[#F5F5F5]">{af.nome}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          af.ativo
                            ? 'text-green-400 bg-green-400/10 border-green-400/30'
                            : 'text-[#555] bg-[#111] border-[#2A2A2A]'
                        }`}>
                          {af.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-[#888]">
                        {af.email    && <span>✉️ {af.email}</span>}
                        {af.whatsapp && <a href={`https://wa.me/55${af.whatsapp.replace(/\D/g,'')}`} target="_blank" className="text-green-400 hover:underline">📱 {af.whatsapp}</a>}
                        <span className="text-[#C9A84C] font-bold">{af.comissao}% comissão</span>
                      </div>
                    </div>
                    <AfiliadoToggle id={af.id} ativo={af.ativo} />
                  </div>

                  {/* Cupons vinculados */}
                  {af.codigoCupons && (
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={12} className="text-[#C9A84C]" />
                      <span className="text-xs text-[#888]">Cupons: </span>
                      {af.cupons.map(c => (
                        <span key={c.id} className="text-xs font-mono font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded">
                          {c.codigo}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Métricas */}
                  <div className="grid grid-cols-3 gap-4 border-t border-[#1A1A1A] pt-4">
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5">Pedidos</p>
                      <p className="text-lg font-black text-[#F5F5F5]">{af.qtdPedidos}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5">Total vendido</p>
                      <p className="text-lg font-black text-[#C9A84C]">{formatPrice(af.totalVendas)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5 flex items-center gap-1">
                        <TrendingUp size={10} /> Comissão a pagar
                      </p>
                      <p className="text-lg font-black text-green-400">{formatPrice(af.comissao)}</p>
                    </div>
                  </div>

                  {/* Últimos pedidos */}
                  {af.qtdPedidos > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#1A1A1A]">
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Últimos pedidos via cupom</p>
                      <div className="space-y-1">
                        {af.cupons.flatMap(c => c.pedidos).slice(0, 5).map((p, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-[#888]">{new Date(p.criadoEm).toLocaleDateString('pt-BR')}</span>
                            <span className="text-[#F5F5F5] font-medium">{formatPrice(p.total)}</span>
                            <span className="text-green-400">+{formatPrice(p.total * (af.comissao / 100))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
