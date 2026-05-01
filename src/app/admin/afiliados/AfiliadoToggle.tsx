'use client'

import { useState } from 'react'
import { toggleAfiliado } from './actions'
import { Loader2 } from 'lucide-react'

export default function AfiliadoToggle({ id, ativo }: { id: string; ativo: boolean }) {
  const [loading, setLoading] = useState(false)
  async function toggle() {
    setLoading(true)
    await toggleAfiliado(id, !ativo)
    setLoading(false)
  }
  return loading
    ? <Loader2 size={14} className="animate-spin text-[#888]" />
    : (
      <button onClick={toggle}
        className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-[#C9A84C] text-[#888] hover:text-[#C9A84C]"
        style={{ borderColor: '#2A2A2A' }}>
        {ativo ? 'Desativar' : 'Ativar'}
      </button>
    )
}
