export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import AdminNav from '../AdminNav'
import AfiliadoForm from './AfiliadoForm'
import AfiliadoToggle from './AfiliadoToggle'
import CopyLinkButton from './CopyLinkButton'
import EditarSlugButton from './EditarSlugButton'
import ComissaoMensal from './ComissaoMensal'
import { formatPrice } from '@/lib/utils'
import { Users, Tag, TrendingUp, Link2 } from 'lucide-react'

// Agrupa pedidos por mês e cruza com pagamentos já registrados
function calcularMeses(
  pedidos: { total: number; criadoEm: Date }[],
  comissaoPct: number,
  pagamentos: { periodoLabel: string; periodoInicio: Date; periodoFim: Date }[],
) {
  const map: Record<string, { label: string; inicio: Date; fim: Date; totalVendas: number; qtdPedidos: number }> = {}

  for (const p of pedidos) {
    const d     = new Date(p.criadoEm)
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, c => c.toUpperCase()) // "Maio 2025"
    if (!map[label]) {
      const inicio = new Date(d.getFullYear(), d.getMonth(), 1)
      const fim    = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
      map[label] = { label, inicio, fim, totalVendas: 0, qtdPedidos: 0 }
    }
    map[label].totalVendas += p.total
    map[label].qtdPedidos  += 1
  }

  // Ordena mais recente primeiro
  return Object.values(map)
    .sort((a, b) => b.inicio.getTime() - a.inicio.getTime())
    .map(m => ({
      ...m,
      inicio:        m.inicio.toISOString(),
      fim:           m.fim.toISOString(),
      comissaoValor: m.totalVendas * (comissaoPct / 100),
      pago: pagamentos.some(pg => pg.periodoLabel === m.label),
    }))
}

export default async function AfiliadosPage() {
  const afiliados = await prisma.afiliado.findMany({
    orderBy: { criadoEm: 'desc' },
    include: {
      pedidos: {   // via link ?ref=slug
        where: { status: { in: ['APROVADO', 'ENVIADO', 'ENTREGUE'] } },
        select: { total: true, criadoEm: true },
      },
      cupons: {    // via cupom
        include: {
          pedidos: {
            where: { status: { in: ['APROVADO', 'ENVIADO', 'ENTREGUE'] } },
            select: { total: true, criadoEm: true },
          },
        },
      },
      comissoesPagas: {
        orderBy: { criadoEm: 'desc' },
        select: { id: true, periodoLabel: true, periodoInicio: true, periodoFim: true, valor: true, observacao: true, criadoEm: true },
      },
    },
  })

  const comMetricas = afiliados.map(af => {
    const pedidosLink  = af.pedidos
    const pedidosCupom = af.cupons.flatMap(c => c.pedidos)
    const todosPedidos = [...pedidosLink, ...pedidosCupom]

    const totalLinkVendas  = pedidosLink.reduce((s, p) => s + p.total, 0)
    const totalCupomVendas = pedidosCupom.reduce((s, p) => s + p.total, 0)
    const totalVendas      = totalLinkVendas + totalCupomVendas
    const comissao         = totalVendas * (af.comissao / 100)

    const meses = calcularMeses(todosPedidos, af.comissao, af.comissoesPagas)
    const comissaoPendente = meses
      .filter(m => !m.pago && m.qtdPedidos > 0)
      .reduce((s, m) => s + m.comissaoValor, 0)

    return {
      ...af,
      totalVendas, totalLinkVendas, totalCupomVendas,
      comissao, comissaoPendente,
      qtdPedidos:      todosPedidos.length,
      qtdPedidosLink:  pedidosLink.length,
      qtdPedidosCupom: pedidosCupom.length,
      meses,
    }
  })

  const totalComissoesPendentes = comMetricas.reduce((s, a) => s + a.comissaoPendente, 0)
  const totalVendasAf           = comMetricas.reduce((s, a) => s + a.totalVendas, 0)

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, '') ?? 'https://sualoja.com.br'

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
                <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Comissões pendentes</p>
                <p className={`text-2xl font-black ${totalComissoesPendentes > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {formatPrice(totalComissoesPendentes)}
                </p>
                {totalComissoesPendentes === 0 && comMetricas.some(a => a.comissao > 0) && (
                  <p className="text-[10px] text-green-400 mt-0.5">✓ Tudo pago</p>
                )}
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
                  {/* Cabeçalho */}
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold text-[#F5F5F5]">{af.nome}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          af.ativo
                            ? 'text-green-400 bg-green-400/10 border-green-400/30'
                            : 'text-[#555] bg-[#111] border-[#2A2A2A]'
                        }`}>
                          {af.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        {af.comissaoPendente > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-yellow-400 bg-yellow-400/10 border-yellow-400/20">
                            💰 {formatPrice(af.comissaoPendente)} a pagar
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-[#888]">
                        {af.email    && <span>✉️ {af.email}</span>}
                        {af.whatsapp && (
                          <a href={`https://wa.me/55${af.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                            className="text-green-400 hover:underline">
                            📱 {af.whatsapp}
                          </a>
                        )}
                        <span className="text-[#C9A84C] font-bold">{af.comissao}% comissão</span>
                      </div>
                    </div>
                    <AfiliadoToggle id={af.id} ativo={af.ativo} nome={af.nome} />
                  </div>

                  {/* Link de rastreamento */}
                  <div className="mb-4 p-3 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/20">
                    <p className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                      <Link2 size={10} /> Link do afiliado — manda pra ele(a) divulgar
                    </p>
                    {af.slug ? (
                      <>
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="flex-1 min-w-0 text-xs text-[#F5F5F5] font-mono bg-[#0A0A0A] px-3 py-2 rounded-lg border border-[#2A2A2A] truncate">
                            {baseUrl}/?ref={af.slug}
                          </code>
                          <CopyLinkButton link={`${baseUrl}/?ref=${af.slug}`} />
                        </div>
                        <div className="mt-1.5">
                          <EditarSlugButton id={af.id} slugAtual={af.slug} />
                        </div>
                        <p className="text-[10px] text-[#555] mt-1">
                          Quem comprar em até 30 dias após clicar neste link é atribuído a <strong className="text-[#888]">{af.nome}</strong>.
                        </p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-[#666]">Nenhum link configurado ainda.</p>
                        <EditarSlugButton id={af.id} slugAtual={null} />
                      </div>
                    )}
                  </div>

                  {/* Cupons vinculados */}
                  {af.cupons.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Tag size={12} className="text-[#C9A84C]" />
                      <span className="text-xs text-[#888]">Cupons: </span>
                      {af.cupons.map(c => (
                        <span key={c.id} className="text-xs font-mono font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded">
                          {c.codigo}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Métricas resumidas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#1A1A1A] pt-4">
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5">Pedidos</p>
                      <p className="text-xl font-black text-[#F5F5F5]">{af.qtdPedidos}</p>
                      <div className="text-[10px] text-[#555] mt-0.5 space-y-0.5">
                        {af.qtdPedidosLink > 0  && <p>🔗 {af.qtdPedidosLink} via link</p>}
                        {af.qtdPedidosCupom > 0 && <p>🏷️ {af.qtdPedidosCupom} via cupom</p>}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5">Total vendido</p>
                      <p className="text-xl font-black text-[#C9A84C]">{formatPrice(af.totalVendas)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5 flex items-center gap-1">
                        <TrendingUp size={10} /> Comissão total
                      </p>
                      <p className="text-xl font-black text-green-400">{formatPrice(af.comissao)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-0.5">Pendente</p>
                      <p className={`text-xl font-black ${af.comissaoPendente > 0 ? 'text-yellow-400' : 'text-[#555]'}`}>
                        {formatPrice(af.comissaoPendente)}
                      </p>
                    </div>
                  </div>

                  {/* Controle mensal de pagamentos */}
                  <ComissaoMensal
                    afiliadoId={af.id}
                    nomeAfiliado={af.nome}
                    comissaoPct={af.comissao}
                    meses={af.meses}
                    historico={af.comissoesPagas}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
