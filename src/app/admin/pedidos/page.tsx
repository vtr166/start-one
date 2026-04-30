export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import AdminNav from '../AdminNav'

const statusColor: Record<string, string> = {
  APROVADO: 'text-green-400 bg-green-400/10 border-green-400/20',
  REJEITADO: 'text-red-400 bg-red-400/10 border-red-400/20',
  CANCELADO: 'text-red-400 bg-red-400/10 border-red-400/20',
  PENDENTE: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  ENVIADO: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  ENTREGUE: 'text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/20',
}

export default async function PedidosAdmin() {
  const pedidos = await prisma.pedido.findMany({
    include: { itens: true },
    orderBy: { criadoEm: 'desc' },
  })

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-8">Pedidos</h1>

          <div className="card-dark divide-y divide-[#2A2A2A]">
            {pedidos.length === 0 && (
              <p className="p-6 text-[#555] text-sm">Nenhum pedido ainda.</p>
            )}
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-[#F5F5F5]">{pedido.nomeCliente}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${statusColor[pedido.status] ?? 'text-[#888]'}`}>
                        {pedido.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#555]">{pedido.emailCliente}</p>
                    {pedido.telefoneCliente && (
                      <p className="text-xs text-[#555]">{pedido.telefoneCliente}</p>
                    )}
                    <p className="text-xs text-[#444] mt-1">
                      {new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#C9A84C]">{formatPrice(pedido.total)}</p>
                    <p className="text-xs text-[#555]">{pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}</p>
                  </div>
                </div>

                {/* Itens */}
                <div className="mt-3 space-y-1">
                  {pedido.itens.map((item) => (
                    <p key={item.id} className="text-xs text-[#666]">
                      {item.quantidade}× {item.nomeProduto} — {item.nomeVariacao} ({formatPrice(item.precoUnit)})
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
