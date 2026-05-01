'use client'

import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { marcarComissaoPaga } from './actions'
import { formatPrice } from '@/lib/utils'

type Mes = {
  label: string        // "Maio 2025"
  inicio: string       // ISO
  fim: string          // ISO
  totalVendas: number
  comissaoValor: number
  qtdPedidos: number
  pago: boolean        // já existe registro de pagamento cobrindo esse mês
}

type PagamentoHistorico = {
  id: string
  periodoLabel: string
  valor: number
  observacao: string | null
  criadoEm: Date
}

export default function ComissaoMensal({
  afiliadoId,
  nomeAfiliado,
  comissaoPct,
  meses,
  historico,
}: {
  afiliadoId: string
  nomeAfiliado: string
  comissaoPct: number
  meses: Mes[]
  historico: PagamentoHistorico[]
}) {
  const [aberto, setAberto]       = useState(false)
  const [loading, setLoading]     = useState<string | null>(null)
  const [obs, setObs]             = useState<Record<string, string>>({})

  const pendentes = meses.filter(m => !m.pago && m.qtdPedidos > 0)
  const totalPendente = pendentes.reduce((s, m) => s + m.comissaoValor, 0)

  async function pagar(mes: Mes) {
    setLoading(mes.label)
    try {
      await marcarComissaoPaga({
        afiliadoId,
        valor:         mes.comissaoValor,
        periodoLabel:  mes.label,
        periodoInicio: mes.inicio,
        periodoFim:    mes.fim,
        observacao:    obs[mes.label] || undefined,
      })
    } finally { setLoading(null) }
  }

  if (meses.length === 0) return null

  return (
    <div className="mt-3 pt-3 border-t border-[#1A1A1A]">
      <button
        onClick={() => setAberto(a => !a)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider">
            Controle de comissões
          </span>
          {pendentes.length > 0 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
              {formatPrice(totalPendente)} pendente
            </span>
          )}
          {pendentes.length === 0 && meses.some(m => m.pago) && (
            <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
              <CheckCircle size={10} /> Tudo pago
            </span>
          )}
        </div>
        {aberto ? <ChevronUp size={13} className="text-[#555]" /> : <ChevronDown size={13} className="text-[#555]" />}
      </button>

      {aberto && (
        <div className="mt-3 space-y-2">
          {/* Meses com pedidos */}
          {meses.filter(m => m.qtdPedidos > 0).map(mes => (
            <div
              key={mes.label}
              className={`p-3 rounded-xl border ${
                mes.pago
                  ? 'border-green-500/20 bg-green-500/5'
                  : 'border-yellow-400/20 bg-yellow-400/5'
              }`}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-[#F5F5F5]">{mes.label}</span>
                    {mes.pago
                      ? <span className="text-[10px] text-green-400 flex items-center gap-0.5 font-bold"><CheckCircle size={9} /> Pago</span>
                      : <span className="text-[10px] text-yellow-400 font-bold">Pendente</span>
                    }
                  </div>
                  <p className="text-[10px] text-[#666]">
                    {mes.qtdPedidos} pedido{mes.qtdPedidos !== 1 ? 's' : ''} ·
                    vendas {formatPrice(mes.totalVendas)} ·
                    comissão ({comissaoPct}%) = <strong className="text-[#C9A84C]">{formatPrice(mes.comissaoValor)}</strong>
                  </p>
                </div>
                {!mes.pago && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      placeholder="Observação (opcional)"
                      value={obs[mes.label] ?? ''}
                      onChange={e => setObs(o => ({ ...o, [mes.label]: e.target.value }))}
                      className="text-xs bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#C9A84C] w-36"
                    />
                    <button
                      onClick={() => pagar(mes)}
                      disabled={loading === mes.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    >
                      {loading === mes.label
                        ? <Loader2 size={11} className="animate-spin" />
                        : <CheckCircle size={11} />
                      }
                      Marcar como pago
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Histórico de pagamentos */}
          {historico.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[#1A1A1A]">
              <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Histórico de pagamentos</p>
              <div className="space-y-1.5">
                {historico.map(pg => (
                  <div key={pg.id} className="flex items-center justify-between text-xs text-[#888] gap-2">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle size={10} className="text-green-400 shrink-0" />
                      {pg.periodoLabel}
                      {pg.observacao && <span className="text-[#555]">— {pg.observacao}</span>}
                    </span>
                    <div className="text-right shrink-0">
                      <span className="text-green-400 font-bold">{formatPrice(pg.valor)}</span>
                      <span className="text-[#555] ml-2">{new Date(pg.criadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
