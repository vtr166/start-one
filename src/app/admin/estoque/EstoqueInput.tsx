'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { atualizarEstoque } from './actions'

export default function EstoqueInput({ variacaoId, estoqueAtual }: { variacaoId: string; estoqueAtual: number }) {
  const [valor, setValor]   = useState(estoqueAtual)
  const [loading, setLoading] = useState(false)
  const [salvo, setSalvo]   = useState(false)

  async function salvar() {
    if (valor === estoqueAtual) return
    setLoading(true)
    try {
      await atualizarEstoque(variacaoId, valor)
      setSalvo(true)
      setTimeout(() => setSalvo(false), 2000)
    } finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        value={valor}
        onChange={e => setValor(parseInt(e.target.value) || 0)}
        onBlur={salvar}
        onKeyDown={e => e.key === 'Enter' && salvar()}
        className="w-16 bg-[#111] border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-sm text-center text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C] transition-colors"
      />
      <div className="w-5 flex items-center justify-center">
        {loading ? (
          <Loader2 size={12} className="animate-spin text-[#888]" />
        ) : salvo ? (
          <Check size={12} className="text-green-400" />
        ) : null}
      </div>
    </div>
  )
}
