'use client'

import { useState, useTransition } from 'react'
import { toggleProdutoAtivo } from './actions'

export default function ToggleAtivo({ id, ativo }: { id: string; ativo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [estado, setEstado] = useState(ativo)

  function toggle() {
    startTransition(async () => {
      await toggleProdutoAtivo(id, !estado)
      setEstado(!estado)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      title={estado ? 'Desativar' : 'Ativar'}
      className={`w-10 h-5 rounded-full transition-colors relative ${
        estado ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          estado ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
