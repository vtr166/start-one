'use client'

import { useState } from 'react'
import { criarAfiliado } from './actions'
import { Loader2, Plus, Link2 } from 'lucide-react'

export default function AfiliadoForm() {
  const [aberto, setAberto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: '', slug: '', email: '', whatsapp: '', comissao: '10' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await criarAfiliado({
        ...form,
        slug: form.slug.trim().toLowerCase() || null,
        comissao: parseFloat(form.comissao),
      })
      setForm({ nome: '', slug: '', email: '', whatsapp: '', comissao: '10' })
      setAberto(false)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar afiliado')
    } finally { setLoading(false) }
  }

  const input = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#C9A84C] transition-colors'
  const label = 'block text-xs text-[#888] mb-1'

  // Preview do link de afiliado
  const slugPreview = form.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

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
              <label className={label}>Nome *</label>
              <input required placeholder="Ex: Larissa Silva" value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })} className={input} />
            </div>
            <div>
              <label className={label}>Comissão (%)</label>
              <input required type="number" min="0" max="100" step="0.1" placeholder="10"
                value={form.comissao} onChange={e => setForm({ ...form, comissao: e.target.value })}
                className={input} />
            </div>

            {/* Campo chave: slug para o link */}
            <div className="md:col-span-2">
              <label className={label}>
                <span className="flex items-center gap-1.5 text-[#C9A84C]">
                  <Link2 size={11} /> Identificador do link (slug) *
                </span>
              </label>
              <input
                required
                placeholder="Ex: larissa, joao, influencer2024"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                className={input}
              />
              {form.slug && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20">
                  <Link2 size={11} className="text-[#C9A84C] shrink-0" />
                  <p className="text-xs text-[#C9A84C] font-mono break-all">
                    sualoja.com.br/?ref=<strong>{slugPreview}</strong>
                  </p>
                </div>
              )}
              <p className="text-[10px] text-[#555] mt-1">
                Este será o link que o afiliado divulga. Qualquer compra feita por alguém que clicou no link nas últimas 30 dias será atribuída a ele.
              </p>
            </div>

            <div>
              <label className={label}>E-mail</label>
              <input type="email" placeholder="influencer@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} className={input} />
            </div>
            <div>
              <label className={label}>WhatsApp</label>
              <input placeholder="(11) 99999-9999" value={form.whatsapp}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })} className={input} />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[11px] text-[#666] space-y-1">
            <p className="font-semibold text-[#888]">Como funciona o rastreamento por link:</p>
            <p>1. Afiliado compartilha o link com ?ref=slug nas redes sociais</p>
            <p>2. Visitante clica → cookie de 30 dias é salvo no navegador</p>
            <p>3. Se comprar em até 30 dias, o pedido é atribuído a este afiliado</p>
            <p>4. Você vê os pedidos e comissão a pagar na página de Afiliados</p>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all">
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
