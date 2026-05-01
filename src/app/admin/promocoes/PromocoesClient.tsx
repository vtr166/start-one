'use client'

import { useState } from 'react'
import { criarPromocao, togglePromocao, deletarPromocao } from './actions'
import { formatPrice } from '@/lib/utils'
import { Plus, Loader2, Trash2 } from 'lucide-react'

type Promocao = {
  id: string; nome: string; tipo: string; valor: number
  categoria: string | null; genero: string | null
  ativo: boolean; expiresAt: Date | null; criadoEm: Date
}

const CATEGORIAS = [{ v: '', l: 'Todas as categorias' }, { v: 'ARABE', l: 'Árabe' }, { v: 'IMPORTADO', l: 'Importado' }]
const GENEROS    = [{ v: '', l: 'Todos os gêneros' }, { v: 'MASCULINO', l: 'Masculino' }, { v: 'FEMININO', l: 'Feminino' }, { v: 'UNISSEX', l: 'Unissex' }]

export default function PromocoesClient({ promocoes }: { promocoes: Promocao[] }) {
  const [aberto,  setAberto]  = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [form, setForm] = useState({
    nome: '', tipo: 'PERCENTUAL' as 'PERCENTUAL' | 'FIXO',
    valor: '', categoria: '', genero: '', expiresAt: '',
  })

  async function criar(e: React.FormEvent) {
    e.preventDefault()
    setLoading('criar')
    try {
      await criarPromocao({ ...form, valor: parseFloat(form.valor), categoria: form.categoria || null, genero: form.genero || null, expiresAt: form.expiresAt || null })
      setForm({ nome: '', tipo: 'PERCENTUAL', valor: '', categoria: '', genero: '', expiresAt: '' })
      setAberto(false)
    } finally { setLoading(null) }
  }

  const inp = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#C9A84C] transition-colors'
  const lbl = 'block text-[10px] text-[#888] mb-1 font-bold uppercase tracking-wider'

  const BADGE: Record<string, string> = {
    ARABE: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    IMPORTADO: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    MASCULINO: 'text-blue-300 bg-blue-300/10 border-blue-300/20',
    FEMININO:  'text-pink-300 bg-pink-300/10 border-pink-300/20',
    UNISSEX:   'text-purple-300 bg-purple-300/10 border-purple-300/20',
  }

  return (
    <>
      {!aberto ? (
        <button onClick={() => setAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold hover:brightness-110 transition-all mb-6">
          <Plus size={15} /> Nova Promoção
        </button>
      ) : (
        <form onSubmit={criar} className="card-dark p-5 space-y-4 mb-6">
          <h3 className="text-sm font-bold text-[#F5F5F5]">Criar promoção</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={lbl}>Nome da promoção *</label>
              <input required placeholder="Ex: Árabes em oferta · 15% off" value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })} className={inp} />
            </div>
            <div>
              <label className={lbl}>Tipo *</label>
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as 'PERCENTUAL' | 'FIXO' })} className={inp}>
                <option value="PERCENTUAL">Percentual (%)</option>
                <option value="FIXO">Valor fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className={lbl}>{form.tipo === 'PERCENTUAL' ? 'Desconto (%)' : 'Desconto (R$)'} *</label>
              <input required type="number" step="0.1" min="0.1" placeholder={form.tipo === 'PERCENTUAL' ? '15' : '30'}
                value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} className={inp} />
            </div>
            <div>
              <label className={lbl}>Categoria (deixe vazio = todas)</label>
              <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className={inp}>
                {CATEGORIAS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Gênero (deixe vazio = todos)</label>
              <select value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} className={inp}>
                {GENEROS.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Expira em</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className={inp} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading === 'criar'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all">
              {loading === 'criar' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Criar
            </button>
            <button type="button" onClick={() => setAberto(false)}
              className="px-5 py-2.5 rounded-lg border border-[#2A2A2A] text-sm text-[#888]">Cancelar</button>
          </div>
        </form>
      )}

      {promocoes.length === 0 && (
        <div className="card-dark p-12 text-center text-[#555] text-sm">Nenhuma promoção ativa. Crie uma para oferecer descontos automáticos no catálogo.</div>
      )}

      <div className="space-y-3">
        {promocoes.map(p => {
          const expirado = p.expiresAt && new Date() > new Date(p.expiresAt)
          return (
            <div key={p.id} className={`card-dark p-4 flex items-center gap-4 flex-wrap transition-opacity ${p.ativo && !expirado ? '' : 'opacity-50'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold text-[#F5F5F5]">{p.nome}</p>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full border"
                    style={{ color: '#22c55e', background: '#22c55e15', borderColor: '#22c55e30' }}>
                    {p.tipo === 'PERCENTUAL' ? `-${p.valor}%` : `-${formatPrice(p.valor)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {p.categoria && <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${BADGE[p.categoria] ?? ''}`}>{p.categoria}</span>}
                  {p.genero    && <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${BADGE[p.genero] ?? ''}`}>{p.genero}</span>}
                  {!p.categoria && !p.genero && <span className="text-[10px] text-[#555]">Todos os produtos</span>}
                  {p.expiresAt && <span className={`text-[10px] text-[#555] ${expirado ? 'text-red-400' : ''}`}>· até {new Date(p.expiresAt).toLocaleDateString('pt-BR')}</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ml-1 ${p.ativo && !expirado ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-[#555] bg-[#111] border-[#2A2A2A]'}`}>
                    {!p.ativo ? 'Inativa' : expirado ? 'Expirada' : 'Ativa'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {loading === p.id
                  ? <Loader2 size={14} className="animate-spin text-[#888]" />
                  : <>
                    <button onClick={async () => { setLoading(p.id); await togglePromocao(p.id, !p.ativo); setLoading(null) }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#888] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
                      {p.ativo ? 'Pausar' : 'Ativar'}
                    </button>
                    <button onClick={async () => { if(!confirm('Deletar promoção?')) return; setLoading(p.id); await deletarPromocao(p.id); setLoading(null) }}
                      className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </>
                }
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
