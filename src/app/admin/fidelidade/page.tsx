export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Gift, Star, Trophy, Crown } from 'lucide-react'

// Agrupa pedidos aprovados por e-mail e calcula progresso
async function getProgresso() {
  const pedidos = await prisma.pedido.findMany({
    where: { status: 'APROVADO' },
    select: {
      emailCliente: true,
      nomeCliente: true,
      telefoneCliente: true,
      total: true,
      criadoEm: true,
    },
    orderBy: { criadoEm: 'asc' },
  })

  // Agrupa por e-mail
  const mapa = new Map<string, {
    nome: string
    email: string
    telefone: string | null
    totalCompras: number
    totalGasto: number
    proximaRecompensa: number
    ultimaCompra: Date
  }>()

  for (const p of pedidos) {
    const existente = mapa.get(p.emailCliente)
    if (existente) {
      existente.totalCompras++
      existente.totalGasto += p.total
      existente.ultimaCompra = p.criadoEm
    } else {
      mapa.set(p.emailCliente, {
        nome: p.nomeCliente,
        email: p.emailCliente,
        telefone: p.telefoneCliente,
        totalCompras: 1,
        totalGasto: p.total,
        proximaRecompensa: 5,
        ultimaCompra: p.criadoEm,
      })
    }
  }

  // Calcula próxima recompensa
  for (const [, c] of mapa) {
    const ciclo = c.totalCompras % 5
    c.proximaRecompensa = ciclo === 0 ? 5 : 5 - ciclo
  }

  return Array.from(mapa.values()).sort((a, b) => b.totalCompras - a.totalCompras)
}

function BadgeNivel({ compras }: { compras: number }) {
  if (compras >= 20) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">👑 VIP</span>
  if (compras >= 10) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] font-bold border border-[#C9A84C]/30">🏆 Ouro</span>
  if (compras >= 5)  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-400/20 text-slate-300 font-bold border border-slate-400/30">⭐ Prata</span>
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-900/20 text-orange-400 font-bold border border-orange-500/30">🔰 Bronze</span>
}

export default async function AdminFidelidadePage() {
  const clientes = await getProgresso()

  // Cupons de fidelidade gerados
  const cupons = await prisma.cupom.findMany({
    where: { descricao: { startsWith: 'Decant grátis — Fidelidade' } },
    orderBy: { criadoEm: 'desc' },
    take: 20,
  })

  const totalClientes   = clientes.length
  const chegandoNa5     = clientes.filter(c => c.totalCompras % 5 === 4).length // falta 1
  const jaGanharam      = clientes.filter(c => c.totalCompras >= 5).length
  const cuponsAtivos    = cupons.filter(c => c.ativo && c.usosAtuais === 0).length

  return (
    <div className="p-6 max-w-5xl space-y-8">
      <h1 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
        <Gift size={20} className="text-[#C9A84C]" /> Programa de Fidelidade
      </h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Clientes ativos',    value: totalClientes, icon: Star,   cor: 'text-[#C9A84C]' },
          { label: 'Quase na recompensa', value: chegandoNa5,  icon: Trophy, cor: 'text-orange-400' },
          { label: 'Já ganharam',         value: jaGanharam,   icon: Crown,  cor: 'text-purple-400' },
          { label: 'Cupons ativos',        value: cuponsAtivos, icon: Gift,   cor: 'text-green-400' },
        ].map(({ label, value, icon: Icon, cor }) => (
          <div key={label} className="card-dark p-4">
            <Icon size={18} className={`${cor} mb-2`} />
            <p className="text-2xl font-black text-[#F5F5F5]">{value}</p>
            <p className="text-xs text-[#555]">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabela de clientes */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#888] mb-4">Clientes por compras</h2>
        <div className="space-y-2">
          {clientes.length === 0 ? (
            <p className="text-xs text-[#555] py-8 text-center">Nenhum pedido aprovado ainda.</p>
          ) : clientes.map((c) => {
            const cicloAtual = c.totalCompras % 5
            const pct = cicloAtual === 0 ? 100 : (cicloAtual / 5) * 100

            return (
              <div key={c.email} className="card-dark p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Info do cliente */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-[#F5F5F5] truncate">{c.nome}</span>
                    <BadgeNivel compras={c.totalCompras} />
                  </div>
                  <p className="text-xs text-[#555]">{c.email}</p>
                  {c.telefone && <p className="text-xs text-[#555]">{c.telefone}</p>}
                </div>

                {/* Estatísticas */}
                <div className="flex items-center gap-6 text-center shrink-0">
                  <div>
                    <p className="text-lg font-black text-[#C9A84C]">{c.totalCompras}</p>
                    <p className="text-[10px] text-[#555]">compras</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F5F5F5]">{formatPrice(c.totalGasto)}</p>
                    <p className="text-[10px] text-[#555]">gasto total</p>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="w-full sm:w-40 shrink-0">
                  <div className="flex justify-between text-[10px] text-[#555] mb-1">
                    <span>{cicloAtual === 0 ? '🎁 Ganhou!' : `falta ${c.proximaRecompensa}`}</span>
                    <span>{cicloAtual === 0 ? 5 : cicloAtual}/5</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cicloAtual === 0 ? 'bg-green-400' : 'bg-[#C9A84C]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cupons gerados */}
      {cupons.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#888] mb-4">Cupons de fidelidade gerados</h2>
          <div className="space-y-2">
            {cupons.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-sm">
                <span className="font-mono font-bold text-[#C9A84C] text-sm">{c.codigo}</span>
                <span className="flex-1 text-xs text-[#555] truncate">{c.descricao}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  c.usosAtuais > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  c.ativo && (!c.expiresAt || c.expiresAt > new Date())
                    ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                    : 'bg-[#333] text-[#555] border border-[#2A2A2A]'
                }`}>
                  {c.usosAtuais > 0 ? 'Usado' : c.ativo && (!c.expiresAt || c.expiresAt > new Date()) ? 'Disponível' : 'Expirado'}
                </span>
                {c.expiresAt && (
                  <span className="text-xs text-[#444] shrink-0">
                    {c.expiresAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
