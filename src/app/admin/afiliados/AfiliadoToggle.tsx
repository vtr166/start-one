'use client'

import { useState } from 'react'
import { toggleAfiliado, deletarAfiliado } from './actions'
import { Loader2, Trash2 } from 'lucide-react'

export default function AfiliadoToggle({ id, ativo, nome }: { id: string; ativo: boolean; nome: string }) {
  const [loading, setLoading] = useState<'toggle' | 'delete' | null>(null)

  async function toggle() {
    setLoading('toggle')
    await toggleAfiliado(id, !ativo)
    setLoading(null)
  }

  async function excluir() {
    if (!confirm(`Excluir o afiliado "${nome}"?\n\nOs pedidos atribuídos a ele serão mantidos, mas deixarão de estar vinculados a este afiliado.`)) return
    setLoading('delete')
    await deletarAfiliado(id)
    setLoading(null)
  }

  if (loading) return <Loader2 size={14} className="animate-spin text-[#888]" />

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button onClick={toggle}
        className="text-xs px-3 py-1.5 rounded-lg border border-[#2A2A2A] transition-colors hover:border-[#C9A84C] text-[#888] hover:text-[#C9A84C]">
        {ativo ? 'Desativar' : 'Ativar'}
      </button>
      <button onClick={excluir}
        className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-colors"
        title="Excluir afiliado">
        <Trash2 size={14} />
      </button>
    </div>
  )
}
