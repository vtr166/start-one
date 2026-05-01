'use client'

import { useState } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import { editarSlugAfiliado } from './actions'

export default function EditarSlugButton({ id, slugAtual }: { id: string; slugAtual: string | null }) {
  // Se não tem slug, já abre o modo de edição por padrão
  const [editando, setEditando] = useState(!slugAtual)
  const [valor, setValor]       = useState(slugAtual ?? '')
  const [loading, setLoading]   = useState(false)
  const [erro, setErro]         = useState('')

  async function salvar() {
    if (!valor.trim()) { setErro('Digite um identificador'); return }
    setLoading(true)
    setErro('')
    try {
      await editarSlugAfiliado(id, valor)
      setEditando(false)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Esse slug já está em uso')
    } finally { setLoading(false) }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); salvar() }
    if (e.key === 'Escape' && slugAtual) setEditando(false)
  }

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        className="flex items-center gap-1 text-[10px] text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors mt-1"
      >
        <Pencil size={9} /> Editar slug
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center flex-1 bg-[#0A0A0A] border border-[#C9A84C]/50 rounded-lg overflow-hidden focus-within:border-[#C9A84C] transition-colors">
          <span className="text-[11px] text-[#555] px-2 shrink-0 border-r border-[#2A2A2A]">?ref=</span>
          <input
            autoFocus
            value={valor}
            onChange={e => { setValor(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setErro('') }}
            onKeyDown={handleKey}
            placeholder="ex: larissa, joao"
            className="flex-1 bg-transparent px-2 py-2 text-xs text-[#F5F5F5] placeholder-[#444] focus:outline-none"
          />
        </div>
        <button onClick={salvar} disabled={loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-[#C9A84C] text-[#0A0A0A] hover:brightness-110 transition-all disabled:opacity-50 shrink-0">
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
          Salvar
        </button>
        {slugAtual && (
          <button onClick={() => { setEditando(false); setValor(slugAtual) }}
            className="p-2 rounded-lg bg-[#1A1A1A] text-[#888] hover:text-[#F5F5F5] transition-colors">
            <X size={11} />
          </button>
        )}
      </div>
      {erro && <p className="text-[10px] text-red-400">{erro}</p>}
      {!slugAtual && (
        <p className="text-[10px] text-[#555]">
          Use letras minúsculas e traços. Ex: <span className="text-[#888]">larissa</span>, <span className="text-[#888]">joao-silva</span>
        </p>
      )}
    </div>
  )
}
