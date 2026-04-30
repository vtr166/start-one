export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import AdminNav from './AdminNav'

export default async function AdminDashboard() {
  const [totalProdutos, totalPedidos, pedidosRecentes] = await Promise.all([
    prisma.produto.count({ where: { ativo: true } }),
    prisma.pedido.count(),
    prisma.pedido.findMany({
      take: 5,
      orderBy: { criadoEm: 'desc' },
      include: { itens: true },
    }),
  ])

  const faturamento = await prisma.pedido.aggregate({
    where: { status: 'APROVADO' },
    _sum: { total: true },
  })

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Dashboard</h1>
            <Link href="/admin/produtos/novo" className="btn-gold text-sm flex items-center gap-2">
              <Plus size={16} />
              Novo Produto
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="card-dark p-6">
              <div className="flex items-center gap-3 mb-3">
                <Package size={18} className="text-[#C9A84C]" />
                <span className="text-xs text-[#888] uppercase tracking-widest">Produtos ativos</span>
              </div>
              <p className="text-3xl font-bold text-[#F5F5F5]">{totalProdutos}</p>
            </div>

            <div className="card-dark p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag size={18} className="text-[#C9A84C]" />
                <span className="text-xs text-[#888] uppercase tracking-widest">Pedidos</span>
              </div>
              <p className="text-3xl font-bold text-[#F5F5F5]">{totalPedidos}</p>
            </div>

            <div className="card-dark p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp size={18} className="text-[#C9A84C]" />
                <span className="text-xs text-[#888] uppercase tracking-widest">Faturado</span>
              </div>
              <p className="text-3xl font-bold text-[#C9A84C]">
                {formatPrice(faturamento._sum.total ?? 0)}
              </p>
            </div>
          </div>

          {/* Pedidos recentes */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#888] mb-4">
              Pedidos Recentes
            </h2>
            <div className="card-dark divide-y divide-[#2A2A2A]">
              {pedidosRecentes.length === 0 && (
                <p className="p-6 text-[#555] text-sm">Nenhum pedido ainda.</p>
              )}
              {pedidosRecentes.map((pedido: typeof pedidosRecentes[number]) => {
                const statusColor: Record<string, string> = {
                  APROVADO: 'text-green-400',
                  REJEITADO: 'text-red-400',
                  CANCELADO: 'text-red-400',
                  PENDENTE: 'text-yellow-400',
                  ENVIADO: 'text-blue-400',
                  ENTREGUE: 'text-[#C9A84C]',
                }
                return (
                  <div key={pedido.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#F5F5F5]">{pedido.nomeCliente}</p>
                      <p className="text-xs text-[#555]">
                        {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')} · {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#F5F5F5]">{formatPrice(pedido.total)}</p>
                      <p className={`text-xs font-semibold ${statusColor[pedido.status] ?? 'text-[#888]'}`}>
                        {pedido.status}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            {totalPedidos > 5 && (
              <div className="mt-3 text-center">
                <Link href="/admin/pedidos" className="text-xs text-[#C9A84C] hover:underline">
                  Ver todos os pedidos →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
