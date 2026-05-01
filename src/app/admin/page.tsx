export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import AdminNav from './AdminNav'
import {
  Package, ShoppingBag, TrendingUp, Plus, Clock,
  CheckCircle, Truck, Tag, Users, Image, Percent,
} from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  APROVADO: 'text-green-400 bg-green-400/10 border-green-400/30',
  PENDENTE:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  ENVIADO:   'text-blue-400 bg-blue-400/10 border-blue-400/30',
  ENTREGUE:  'text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/30',
  CANCELADO: 'text-red-400 bg-red-400/10 border-red-400/30',
  REJEITADO: 'text-red-400 bg-red-400/10 border-red-400/30',
}

export default async function AdminDashboard() {
  const agora   = new Date()
  const hoje    = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
  const semana  = new Date(agora.getTime() - 7 * 86400000)
  const mes     = new Date(agora.getFullYear(), agora.getMonth(), 1)

  const [
    pedidosHoje, pedidosSemana, pedidosMes,
    porStatus, totalProdutos, topProdutos,
    pedidosRecentes, totalCupons, totalAfiliados,
    promocoesAtivas,
  ] = await Promise.all([
    // Faturamento por período
    prisma.pedido.aggregate({ where: { status: { in: ['APROVADO','ENVIADO','ENTREGUE'] }, criadoEm: { gte: hoje } }, _sum: { total: true }, _count: true }),
    prisma.pedido.aggregate({ where: { status: { in: ['APROVADO','ENVIADO','ENTREGUE'] }, criadoEm: { gte: semana } }, _sum: { total: true }, _count: true }),
    prisma.pedido.aggregate({ where: { status: { in: ['APROVADO','ENVIADO','ENTREGUE'] }, criadoEm: { gte: mes } }, _sum: { total: true }, _count: true }),
    // Por status
    prisma.pedido.groupBy({ by: ['status'], _count: true }),
    // Produtos
    prisma.produto.count({ where: { ativo: true } }),
    // Top 5 produtos por quantidade vendida
    prisma.itemPedido.groupBy({
      by: ['nomeProduto'],
      _sum: { quantidade: true },
      orderBy: { _sum: { quantidade: 'desc' } },
      take: 5,
    }),
    // Recentes
    prisma.pedido.findMany({
      take: 8, orderBy: { criadoEm: 'desc' },
      include: { itens: { take: 1 }, cupom: { select: { codigo: true } } },
    }),
    // Cupons
    prisma.cupom.count({ where: { ativo: true } }),
    // Afiliados
    prisma.afiliado.count({ where: { ativo: true } }),
    // Promoções
    prisma.promocao.count({ where: { ativo: true } }),
  ])

  const statusMap: Record<string, number> = {}
  for (const s of porStatus) statusMap[s.status] = s._count

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">Dashboard</h1>
              <p className="text-xs text-[#555] mt-0.5">
                {agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Link href="/admin/produtos/novo" className="btn-gold text-sm flex items-center gap-2">
              <Plus size={15} /> Novo Produto
            </Link>
          </div>

          {/* ── Faturamento ── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-3">Faturamento (pedidos pagos)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Hoje',          valor: pedidosHoje._sum.total ?? 0,   qtd: pedidosHoje._count,   cor: '#C9A84C' },
                { label: 'Últimos 7 dias',valor: pedidosSemana._sum.total ?? 0, qtd: pedidosSemana._count, cor: '#C9A84C' },
                { label: 'Este mês',      valor: pedidosMes._sum.total ?? 0,    qtd: pedidosMes._count,    cor: '#C9A84C' },
              ].map(c => (
                <div key={c.label} className="card-dark p-5">
                  <p className="text-xs text-[#555] mb-1">{c.label}</p>
                  <p className="text-2xl font-black" style={{ color: c.cor }}>{formatPrice(c.valor)}</p>
                  <p className="text-[10px] text-[#555] mt-1">{c.qtd} pedido{c.qtd !== 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Status dos pedidos ── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-3">Pedidos por status</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { status: 'PENDENTE',  label: 'Pendentes',  icon: Clock,        href: '/admin/pedidos?status=PENDENTE'  },
                { status: 'APROVADO',  label: 'Pagos',      icon: CheckCircle,  href: '/admin/pedidos?status=APROVADO'  },
                { status: 'ENVIADO',   label: 'Enviados',   icon: Truck,        href: '/admin/pedidos?status=ENVIADO'   },
                { status: 'ENTREGUE',  label: 'Entregues',  icon: Package,      href: '/admin/pedidos?status=ENTREGUE'  },
                { status: 'CANCELADO', label: 'Cancelados', icon: ShoppingBag,  href: '/admin/pedidos?status=CANCELADO' },
              ].map(({ status, label, icon: Icon, href }) => (
                <Link key={status} href={href}
                  className={`card-dark p-4 flex flex-col items-center gap-1.5 border transition-all hover:scale-[1.02] ${STATUS_COLOR[status] ?? ''}`}>
                  <Icon size={18} />
                  <span className="text-2xl font-black">{statusMap[status] ?? 0}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── Top produtos ── */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-3">Top produtos vendidos</p>
              <div className="card-dark divide-y divide-[#1a1a1a]">
                {topProdutos.length === 0 && (
                  <p className="p-6 text-[#555] text-sm text-center">Sem dados ainda.</p>
                )}
                {topProdutos.map((p, i) => (
                  <div key={p.nomeProduto} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-xs font-black text-[#444] w-5">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm text-[#F5F5F5] font-medium truncate">{p.nomeProduto}</p>
                    </div>
                    <span className="text-sm font-black text-[#C9A84C]">{p._sum.quantidade ?? 0} un.</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Atalhos rápidos ── */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-3">Gerenciar</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: '/admin/pedidos',    icon: ShoppingBag, label: 'Pedidos',    badge: (statusMap['PENDENTE'] ?? 0) + (statusMap['APROVADO'] ?? 0), badgeColor: 'bg-yellow-500' },
                  { href: '/admin/produtos',   icon: Package,     label: 'Produtos',   badge: totalProdutos, badgeColor: 'bg-[#C9A84C]' },
                  { href: '/admin/cupons',     icon: Tag,         label: 'Cupons',     badge: totalCupons, badgeColor: 'bg-pink-500' },
                  { href: '/admin/afiliados',  icon: Users,       label: 'Afiliados',  badge: totalAfiliados, badgeColor: 'bg-blue-500' },
                  { href: '/admin/banners',    icon: Image,       label: 'Banners',    badge: null, badgeColor: '' },
                  { href: '/admin/promocoes',  icon: Percent,     label: 'Promoções',  badge: promocoesAtivas, badgeColor: 'bg-green-500' },
                ].map(({ href, icon: Icon, label, badge, badgeColor }) => (
                  <Link key={href} href={href}
                    className="card-dark p-4 flex items-center gap-3 hover:border-[#C9A84C]/30 transition-all group">
                    <Icon size={16} className="text-[#C9A84C] shrink-0" />
                    <span className="text-sm text-[#F5F5F5] font-medium flex-1">{label}</span>
                    {badge !== null && badge > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full text-white ${badgeColor}`}>{badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Últimos pedidos ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Últimos pedidos</p>
              <Link href="/admin/pedidos" className="text-xs text-[#C9A84C] hover:underline">Ver todos →</Link>
            </div>
            <div className="card-dark overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    {['Pedido', 'Cliente', 'Total', 'Cupom', 'Status', 'Data'].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#555]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pedidosRecentes.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-[#555] text-sm">Nenhum pedido ainda.</td></tr>
                  )}
                  {pedidosRecentes.map(p => (
                    <tr key={p.id} className="border-b border-[#111] hover:bg-[#111] transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-[#555]">#{p.id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm text-[#F5F5F5] font-medium">{p.nomeCliente}</td>
                      <td className="px-4 py-3 text-sm font-bold text-[#C9A84C]">{formatPrice(p.total)}</td>
                      <td className="px-4 py-3 text-xs">
                        {p.cupom ? <span className="font-mono text-pink-400">{p.cupom.codigo}</span> : <span className="text-[#444]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[p.status] ?? ''}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#555]">
                        {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
