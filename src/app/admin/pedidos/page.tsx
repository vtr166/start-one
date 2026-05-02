export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import AdminNav from '../AdminNav'
import AcoesPedido from './AcoesPedido'
import { MapPin, Phone, Mail, Package, Copy } from 'lucide-react'

type StatusFiltro = 'TODOS' | 'APROVADO' | 'ENVIADO' | 'ENTREGUE' | 'PENDENTE' | 'CANCELADO'

const BADGE: Record<string, string> = {
  APROVADO: 'text-green-400 bg-green-400/10 border-green-400/30',
  PENDENTE:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  ENVIADO:   'text-blue-400 bg-blue-400/10 border-blue-400/30',
  ENTREGUE:  'text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/30',
  CANCELADO: 'text-red-400 bg-red-400/10 border-red-400/30',
  REJEITADO: 'text-red-400 bg-red-400/10 border-red-400/30',
}

const EMOJI: Record<string, string> = {
  APROVADO: '✅', PENDENTE: '⏳', ENVIADO: '📦', ENTREGUE: '🎉', CANCELADO: '❌', REJEITADO: '❌',
}

type Props = { searchParams: Promise<{ status?: string }> }

export default async function PedidosAdmin({ searchParams }: Props) {
  const { status: filtro = 'TODOS' } = await searchParams

  const where = filtro !== 'TODOS'
    ? { status: filtro as 'APROVADO' | 'PENDENTE' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO' }
    : {}

  const [pedidos, contagens] = await Promise.all([
    prisma.pedido.findMany({
      where,
      include: { itens: true },
      orderBy: { criadoEm: 'desc' },
    }),
    prisma.pedido.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  const contagemMap: Record<string, number> = {}
  let total = 0
  for (const c of contagens) {
    contagemMap[c.status] = c._count
    total += c._count
  }

  const abas: { key: StatusFiltro; label: string }[] = [
    { key: 'TODOS',    label: `Todos (${total})` },
    { key: 'APROVADO', label: `✅ Pago (${contagemMap['APROVADO'] ?? 0})` },
    { key: 'ENVIADO',  label: `📦 Enviado (${contagemMap['ENVIADO'] ?? 0})` },
    { key: 'ENTREGUE', label: `🎉 Entregue (${contagemMap['ENTREGUE'] ?? 0})` },
    { key: 'PENDENTE', label: `⏳ Pendente (${contagemMap['PENDENTE'] ?? 0})` },
    { key: 'CANCELADO',label: `❌ Cancelado (${contagemMap['CANCELADO'] ?? 0})` },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-6">Pedidos</h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6">
            {abas.map(aba => (
              <a key={aba.key} href={`/admin/pedidos?status=${aba.key}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                style={{
                  background: filtro === aba.key ? '#C9A84C' : '#111',
                  color: filtro === aba.key ? '#0A0A0A' : '#888',
                  borderColor: filtro === aba.key ? '#C9A84C' : '#2A2A2A',
                }}>
                {aba.label}
              </a>
            ))}
          </div>

          {/* Lista */}
          {pedidos.length === 0 ? (
            <div className="card-dark p-12 text-center text-[#555] text-sm">
              Nenhum pedido nessa categoria.
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido: typeof pedidos[number]) => {
                const tel = pedido.telefoneCliente?.replace(/\D/g, '')
                const waLink = tel ? `https://wa.me/55${tel}` : null

                return (
                  <div key={pedido.id} className="card-dark p-5 space-y-4">

                    {/* Cabeçalho do pedido */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono text-[#555]">#{pedido.id.slice(-6).toUpperCase()}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${BADGE[pedido.status] ?? ''}`}>
                            {EMOJI[pedido.status]} {pedido.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#444]">
                          {new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <p className="text-xl font-black text-[#C9A84C]">{formatPrice(pedido.total)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Dados do cliente */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#555] mb-2">Cliente</p>
                        <p className="text-sm font-semibold text-[#F5F5F5]">{pedido.nomeCliente}</p>
                        <a href={`mailto:${pedido.emailCliente}`}
                          className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#C9A84C] transition-colors">
                          <Mail size={11} /> {pedido.emailCliente}
                        </a>
                        {waLink && (
                          <a href={waLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors font-semibold">
                            <Phone size={11} />
                            WhatsApp: {pedido.telefoneCliente}
                          </a>
                        )}
                        {pedido.cpfCliente && (
                          <p className="text-xs text-[#555]">CPF: {pedido.cpfCliente}</p>
                        )}
                      </div>

                      {/* Endereço */}
                      {pedido.enderecoEntrega && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-[#555] mb-2">Endereço</p>
                          <div className="flex items-start gap-1.5">
                            <MapPin size={11} className="text-[#C9A84C] mt-0.5 shrink-0" />
                            <p className="text-xs text-[#CCC] leading-relaxed">{pedido.enderecoEntrega}</p>
                          </div>
                          {pedido.freteServico && (
                            <p className="text-xs text-[#888] mt-1">
                              📦 {pedido.freteEmpresa} — {pedido.freteServico}
                              {pedido.freteValor ? ` (${formatPrice(pedido.freteValor)})` : ''}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Itens */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#555] mb-2 flex items-center gap-1.5">
                        <Package size={11} /> Itens
                      </p>
                      <div className="space-y-1">
                        {pedido.itens.map((item: typeof pedido.itens[number]) => (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-[#CCC]">
                              <span className="text-[#888]">{item.quantidade}×</span> {item.nomeProduto} — {item.nomeVariacao}
                            </span>
                            <span className="text-[#888] shrink-0 ml-2">{formatPrice(item.precoUnit * item.quantidade)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="border-t border-[#2A2A2A] pt-3">
                      <AcoesPedido
                        id={pedido.id}
                        status={pedido.status as 'PENDENTE' | 'APROVADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO' | 'REJEITADO'}
                        codigoRastreio={pedido.codigoRastreio}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
