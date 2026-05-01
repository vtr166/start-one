'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyLinkButton({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText(link)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <button
      onClick={copiar}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0"
      style={{
        background: copiado ? '#22c55e20' : '#C9A84C20',
        border: `1px solid ${copiado ? '#22c55e50' : '#C9A84C50'}`,
        color: copiado ? '#22c55e' : '#C9A84C',
      }}
    >
      {copiado ? <><Check size={11} /> Copiado!</> : <><Copy size={11} /> Copiar link</>}
    </button>
  )
}
