'use client'

import { useState } from 'react'
import { toggleCupom, deletarCupom } from './actions'
import { Trash2, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Cupom = {
  id: string; codigo: string; tipo: string; valor: number
  minPedido: number | null; maxUsos: number | null; usosAtuais: number
  ativo: boolean; expiresAt: Date | null; descricao: string | null
  afiliado: { nome: string } | null
}

export default function CupomRow({ c }: { c: Cupom }) {
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    await toggleCupom(c.id, !c.ativo)
    setLoading(false)
  }

  async function deletar() {
    if (!confirm(`Deletar cupom ${c.codigo}?`)) return
    setLoading(true)
    await deletarCupom(c.id)
    setLoading(false)
  }

  const expirado = c.expiresAt && new Date() > new Date(c.expiresAt)

  return (
    <tr className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
      <td className="px-4 py-3">
        <span className="font-mono font-bold text-[#C9A84C] text-sm">{c.codigo}</span>
        {c.descricao && <p className="text-[10px] text-[#555] mt-0.5">{c.descricao}</p>}
      </td>
      <td className="px-4 py-3 text-sm text-[#F5F5F5]">
        {c.tipo === 'PERCENTUAL' ? `${c.valor}%` : formatPrice(c.valor)}
      </td>
      <td className="px-4 py-3 text-xs text-[#888]">
        {c.afiliado?.nome ?? <span className="text-[#444]">—</span>}
      </td>
      <td className="px-4 py-3 text-xs text-[#888]">
        {c.usosAtuais}{c.maxUsos ? ` / ${c.maxUsos}` : ' / ∞'}
      </td>
      <td className="px-4 py-3 text-xs text-[#888]">
        {c.minPedido ? formatPrice(c.minPedido) : <span className="text-[#444]">—</span>}
      </td>
      <td className="px-4 py-3 text-xs text-[#888]">
        {c.expiresAt
          ? <span className={expirado ? 'text-red-400' : ''}>{new Date(c.expiresAt).toLocaleDateString('pt-BR')}</span>
          : <span className="text-[#444]">Sem prazo</span>}
      </td>
      <td className="px-4 py-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          c.ativo && !expirado
            ? 'text-green-400 bg-green-400/10 border-green-400/30'
            : 'text-[#555] bg-[#111] border-[#2A2A2A]'
        }`}>
          {!c.ativo ? 'Inativo' : expirado ? 'Expirado' : 'Ativo'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {loading ? <Loader2 size={14} className="animate-spin text-[#888]" /> : (
            <>
              <button onClick={toggle}
                className="text-xs px-3 py-1 rounded-lg border transition-colors hover:border-[#C9A84C] text-[#888] hover:text-[#C9A84C]"
                style={{ borderColor: '#2A2A2A' }}>
                {c.ativo ? 'Desativar' : 'Ativar'}
              </button>
              <button onClick={deletar}
                className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
