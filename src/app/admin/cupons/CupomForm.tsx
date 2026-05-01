'use client'

import { useState } from 'react'
import { criarCupom } from './actions'
import { Loader2, Plus } from 'lucide-react'

type Afiliado = { id: string; nome: string }

export default function CupomForm({ afiliados }: { afiliados: Afiliado[] }) {
  const [aberto, setAberto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    codigo: '', tipo: 'PERCENTUAL' as 'PERCENTUAL' | 'FIXO',
    valor: '', minPedido: '', maxUsos: '', expiresAt: '',
    descricao: '', afiliadoId: '',
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await criarCupom({
        codigo:     form.codigo,
        tipo:       form.tipo,
        valor:      parseFloat(form.valor),
        minPedido:  form.minPedido ? parseFloat(form.minPedido) : null,
        maxUsos:    form.maxUsos   ? parseInt(form.maxUsos)     : null,
        expiresAt:  form.expiresAt || null,
        descricao:  form.descricao,
        afiliadoId: form.afiliadoId || null,
      })
      setForm({ codigo: '', tipo: 'PERCENTUAL', valor: '', minPedido: '', maxUsos: '', expiresAt: '', descricao: '', afiliadoId: '' })
      setAberto(false)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar cupom')
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#C9A84C] transition-colors'
  const label = 'block text-xs text-[#888] mb-1 font-medium'

  return (
    <div className="mb-6">
      {!aberto ? (
        <button onClick={() => setAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold hover:brightness-110 transition-all">
          <Plus size={15} /> Novo Cupom
        </button>
      ) : (
        <form onSubmit={submit} className="card-dark p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F5F5] mb-2">Criar novo cupom</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Código *</label>
              <input required placeholder="EX: LARISSA10" value={form.codigo}
                onChange={e => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                className={input} />
            </div>
            <div>
              <label className={label}>Tipo *</label>
              <select required value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value as 'PERCENTUAL' | 'FIXO' })}
                className={input}>
                <option value="PERCENTUAL">Percentual (%)</option>
                <option value="FIXO">Valor fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className={label}>{form.tipo === 'PERCENTUAL' ? 'Desconto (%)' : 'Desconto (R$)'} *</label>
              <input required type="number" step="0.01" min="0.01" placeholder={form.tipo === 'PERCENTUAL' ? '10' : '30'}
                value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })}
                className={input} />
            </div>
            <div>
              <label className={label}>Pedido mínimo (R$)</label>
              <input type="number" step="0.01" min="0" placeholder="Sem mínimo"
                value={form.minPedido} onChange={e => setForm({ ...form, minPedido: e.target.value })}
                className={input} />
            </div>
            <div>
              <label className={label}>Máx. usos</label>
              <input type="number" min="1" placeholder="Ilimitado"
                value={form.maxUsos} onChange={e => setForm({ ...form, maxUsos: e.target.value })}
                className={input} />
            </div>
            <div>
              <label className={label}>Expira em</label>
              <input type="date" value={form.expiresAt}
                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                className={input} />
            </div>
            <div>
              <label className={label}>Afiliado (opcional)</label>
              <select value={form.afiliadoId}
                onChange={e => setForm({ ...form, afiliadoId: e.target.value })}
                className={input}>
                <option value="">— Sem afiliado —</option>
                {afiliados.map(a => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Descrição interna</label>
              <input placeholder="Ex: Cupom influencer Larissa" value={form.descricao}
                onChange={e => setForm({ ...form, descricao: e.target.value })}
                className={input} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Criar Cupom
            </button>
            <button type="button" onClick={() => setAberto(false)}
              className="px-5 py-2.5 rounded-lg border border-[#2A2A2A] text-sm text-[#888] hover:text-[#F5F5F5] transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
