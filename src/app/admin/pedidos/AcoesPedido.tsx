'use client'

import { useState } from 'react'
import { atualizarStatusPedido } from './actions'
import { Truck, CheckCircle, X, Loader2 } from 'lucide-react'

type Status = 'PENDENTE' | 'APROVADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO' | 'REJEITADO'

export default function AcoesPedido({ id, status }: { id: string; status: Status }) {
  const [carregando, setCarregando] = useState(false)

  async function atualizar(novoStatus: 'ENVIADO' | 'ENTREGUE' | 'CANCELADO') {
    setCarregando(true)
    await atualizarStatusPedido(id, novoStatus)
    setCarregando(false)
  }

  if (carregando) return (
    <div className="flex items-center gap-2 text-[#888] text-xs">
      <Loader2 size={13} className="animate-spin" /> Atualizando...
    </div>
  )

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {status === 'APROVADO' && (
        <button onClick={() => atualizar('ENVIADO')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <Truck size={12} /> Marcar como Enviado
        </button>
      )}
      {status === 'ENVIADO' && (
        <button onClick={() => atualizar('ENTREGUE')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors">
          <CheckCircle size={12} /> Marcar como Entregue
        </button>
      )}
      {(status === 'APROVADO' || status === 'PENDENTE') && (
        <button onClick={() => atualizar('CANCELADO')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
          <X size={12} /> Cancelar
        </button>
      )}
    </div>
  )
}
