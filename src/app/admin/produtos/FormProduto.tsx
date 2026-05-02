'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2, Package, Droplets } from 'lucide-react'
import { salvarProduto } from './actions'
import ImageUpload from './ImageUpload'

type Variacao = {
  tipo: 'FRASCO' | 'DECANT'
  volume: string
  preco: number
  estoque: number
}

type Produto = {
  id: string
  nome: string
  marca: string
  descricao: string
  categoria: string
  genero: string
  notasTopo: string | null
  notasCoracao: string | null
  notasBase: string | null
  destaque: boolean
  imagens: string[]
  variacoes: Variacao[]
}

// ── Faixas de preço definidas pelo Victor ────────────────────
const PRECOS_FRASCO = [249.9, 289.9, 349.9, 389.9]
const PRECOS_DECANT = [15, 18, 20, 22, 25, 30]

const VOLUMES_FRASCO = ['30ml', '50ml', '60ml', '75ml', '80ml', '100ml', '125ml']
const VOLUMES_DECANT = ['3ml', '5ml', '10ml']

// Badge de estoque
function EstoqueBadge({ estoque }: { estoque: number }) {
  if (estoque === 0)  return <span className="text-[10px] font-bold text-red-400">● Esgotado</span>
  if (estoque <= 3)   return <span className="text-[10px] font-bold text-orange-400">● Crítico ({estoque})</span>
  if (estoque <= 10)  return <span className="text-[10px] font-bold text-yellow-400">● Baixo ({estoque})</span>
  return <span className="text-[10px] font-bold text-green-400">● Em estoque ({estoque})</span>
}

export default function FormProduto({ produto }: { produto?: Produto }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [imagens, setImagens] = useState<string[]>(produto?.imagens ?? [])
  const [variacoes, setVariacoes] = useState<Variacao[]>(
    produto?.variacoes ?? [{ tipo: 'DECANT', volume: '5ml', preco: 22, estoque: 0 }]
  )

  function addVariacao(tipo: 'FRASCO' | 'DECANT') {
    const preco = tipo === 'FRASCO' ? 249.9 : 22
    const volume = tipo === 'FRASCO' ? '100ml' : '5ml'
    setVariacoes([...variacoes, { tipo, volume, preco, estoque: 0 }])
  }

  function removeVariacao(i: number) {
    setVariacoes(variacoes.filter((_, idx) => idx !== i))
  }

  function updateVariacao(i: number, key: keyof Variacao, val: string | number) {
    setVariacoes(variacoes.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('variacoes', JSON.stringify(variacoes))
    fd.set('imagens', imagens.join('\n'))   // sobrescreve o campo de imagens
    startTransition(async () => {
      await salvarProduto(fd)
      router.push('/admin/produtos')
    })
  }

  const input = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors'
  const label = 'block text-xs text-[#888] mb-1.5'

  const frascos = variacoes.filter(v => v.tipo === 'FRASCO')
  const decants = variacoes.filter(v => v.tipo === 'DECANT')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {produto && <input type="hidden" name="id" value={produto.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={label}>Nome do perfume *</label>
          <input name="nome" required defaultValue={produto?.nome} placeholder="Ex: Oud Royal" className={input} />
        </div>
        <div>
          <label className={label}>Marca *</label>
          <input name="marca" required defaultValue={produto?.marca} placeholder="Ex: Ajmal" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={label}>Categoria *</label>
          <select name="categoria" required defaultValue={produto?.categoria ?? 'ARABE'} className={input}>
            <option value="ARABE">Árabe</option>
            <option value="IMPORTADO">Importado</option>
          </select>
        </div>
        <div>
          <label className={label}>Gênero</label>
          <select name="genero" defaultValue={produto?.genero ?? 'UNISSEX'} className={input}>
            <option value="UNISSEX">Unissex</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Descrição *</label>
        <textarea name="descricao" required rows={3} defaultValue={produto?.descricao}
          placeholder="Descreva o perfume, sua família olfativa, ocasião..." className={input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={label}>Notas de Topo</label>
          <input name="notasTopo" defaultValue={produto?.notasTopo ?? ''} placeholder="Bergamota, Limão" className={input} />
        </div>
        <div>
          <label className={label}>Notas de Coração</label>
          <input name="notasCoracao" defaultValue={produto?.notasCoracao ?? ''} placeholder="Rosa, Jasmim" className={input} />
        </div>
        <div>
          <label className={label}>Notas de Base</label>
          <input name="notasBase" defaultValue={produto?.notasBase ?? ''} placeholder="Oud, Âmbar" className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Fotos do produto</label>
        <ImageUpload imagens={imagens} onChange={setImagens} />
        {/* Campo hidden para o server action receber as URLs */}
        <input type="hidden" name="imagens" value={imagens.join('\n')} />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" name="destaque" id="destaque" defaultChecked={produto?.destaque} className="accent-[#C9A84C] w-4 h-4" />
        <label htmlFor="destaque" className="text-sm text-[#888]">Exibir como destaque na home</label>
      </div>

      {/* ── VARIAÇÕES ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Variações, preços e estoque
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => addVariacao('FRASCO')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors">
              <Package size={12} /> + Frasco
            </button>
            <button type="button" onClick={() => addVariacao('DECANT')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#555]/40 text-[#888] hover:border-[#888] transition-colors">
              <Droplets size={12} /> + Decant
            </button>
          </div>
        </div>

        {/* Frascos */}
        {frascos.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Package size={9} /> Frascos
            </p>
            {variacoes.map((v, i) => v.tipo !== 'FRASCO' ? null : (
              <div key={i} className="grid grid-cols-12 gap-2 p-4 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A]">
                {/* Volume */}
                <div className="col-span-3">
                  <label className={label}>Volume</label>
                  <select value={v.volume} onChange={e => updateVariacao(i, 'volume', e.target.value)} className={input}>
                    {VOLUMES_FRASCO.map(vol => <option key={vol} value={vol}>{vol}</option>)}
                    <option value="outro">Outro</option>
                  </select>
                </div>

                {/* Faixa de preço */}
                <div className="col-span-4">
                  <label className={label}>Faixa de preço</label>
                  <select
                    value={v.preco}
                    onChange={e => updateVariacao(i, 'preco', parseFloat(e.target.value))}
                    className={input}
                  >
                    {PRECOS_FRASCO.map(p => (
                      <option key={p} value={p}>R$ {p.toFixed(2).replace('.', ',')}</option>
                    ))}
                  </select>
                </div>

                {/* Estoque */}
                <div className="col-span-4">
                  <label className={label}>
                    Estoque <EstoqueBadge estoque={v.estoque} />
                  </label>
                  <input type="number" min="0" value={v.estoque}
                    onChange={e => updateVariacao(i, 'estoque', parseInt(e.target.value) || 0)}
                    className={input} />
                </div>

                {/* Remover */}
                <div className="col-span-1 flex items-end pb-0.5">
                  {variacoes.length > 1 && (
                    <button type="button" onClick={() => removeVariacao(i)}
                      className="p-2 text-[#555] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Decants */}
        {decants.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Droplets size={9} /> Decants
            </p>
            {variacoes.map((v, i) => v.tipo !== 'DECANT' ? null : (
              <div key={i} className="grid grid-cols-12 gap-2 p-4 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A]">
                {/* Volume */}
                <div className="col-span-3">
                  <label className={label}>Volume</label>
                  <select value={v.volume} onChange={e => updateVariacao(i, 'volume', e.target.value)} className={input}>
                    {VOLUMES_DECANT.map(vol => <option key={vol} value={vol}>{vol}</option>)}
                  </select>
                </div>

                {/* Preço */}
                <div className="col-span-4">
                  <label className={label}>Preço</label>
                  <select value={v.preco} onChange={e => updateVariacao(i, 'preco', parseFloat(e.target.value))} className={input}>
                    {PRECOS_DECANT.map(p => (
                      <option key={p} value={p}>R$ {p.toFixed(2).replace('.', ',')}</option>
                    ))}
                  </select>
                </div>

                {/* Estoque */}
                <div className="col-span-4">
                  <label className={label}>
                    Estoque <EstoqueBadge estoque={v.estoque} />
                  </label>
                  <input type="number" min="0" value={v.estoque}
                    onChange={e => updateVariacao(i, 'estoque', parseInt(e.target.value) || 0)}
                    className={input} />
                </div>

                {/* Remover */}
                <div className="col-span-1 flex items-end pb-0.5">
                  {variacoes.length > 1 && (
                    <button type="button" onClick={() => removeVariacao(i)}
                      className="p-2 text-[#555] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {variacoes.length === 0 && (
          <p className="text-xs text-[#555] text-center py-4">Adicione pelo menos uma variação.</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="btn-gold flex items-center gap-2">
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {produto ? 'Salvar alterações' : 'Cadastrar produto'}
        </button>
        <button type="button" onClick={() => router.push('/admin/produtos')} className="btn-outline-gold text-sm">
          Cancelar
        </button>
      </div>
    </form>
  )
}
