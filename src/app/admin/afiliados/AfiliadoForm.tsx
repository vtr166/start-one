'use client'

import { useState } from 'react'
import { criarAfiliado } from './actions'
import { Loader2, Plus } from 'lucide-react'

export default function AfiliadoForm() {
  const [aberto, setAberto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '', comissao: '10' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await criarAfiliado({ ...form, comissao: parseFloat(form.comissao) })
      setForm({ nome: '', email: '', whatsapp: '', comissao: '10' })
      setAberto(false)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar afiliado')
    } finally { setLoading(false) }
  }

  const input = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#C9A84C] transition-colors'

  return (
    <div className="mb-6">
      {!aberto ? (
        <button onClick={() => setAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold hover:brightness-110 transition-all">
          <Plus size={15} /> Novo Afiliado
        </button>
      ) : (
        <form onSubmit={submit} className="card-dark p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F5F5]">Cadastrar afiliado / influencer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#888] mb-1">Nome *</label>
              <input required placeholder="Nome do influencer" value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })} className={input} />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">Comissão (%)</label>
              <input required type="number" min="0" max="100" step="0.1" placeholder="10"
                value={form.comissao} onChange={e => setForm({ ...form, comissao: e.target.value })}
                className={input} />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">E-mail</label>
              <input type="email" placeholder="influencer@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} className={input} />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">WhatsApp</label>
              <input placeholder="(11) 99999-9999" value={form.whatsapp}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })} className={input} />
            </div>
          </div>
          <p className="text-[11px] text-[#555]">
            Após cadastrar, crie um cupom vinculado a este afiliado na aba Cupons.
          </p>
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold disabled:opacity-50">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Cadastrar
            </button>
            <button type="button" onClick={() => setAberto(false)}
              className="px-5 py-2.5 rounded-lg border border-[#2A2A2A] text-sm text-[#888] hover:text-[#F5F5F5]">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
