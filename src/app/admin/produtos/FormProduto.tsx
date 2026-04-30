'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { salvarProduto } from './actions'

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

export default function FormProduto({ produto }: { produto?: Produto }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [variacoes, setVariacoes] = useState<Variacao[]>(
    produto?.variacoes ?? [{ tipo: 'DECANT', volume: '5ml', preco: 0, estoque: 0 }]
  )

  function addVariacao() {
    setVariacoes([...variacoes, { tipo: 'FRASCO', volume: '', preco: 0, estoque: 0 }])
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

    startTransition(async () => {
      await salvarProduto(fd)
      router.push('/admin/produtos')
    })
  }

  const input = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors'
  const label = 'block text-xs text-[#888] mb-1.5'

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
        <textarea
          name="descricao"
          required
          rows={3}
          defaultValue={produto?.descricao}
          placeholder="Descreva o perfume, sua família olfativa, ocasião..."
          className={input}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={label}>Notas de Topo</label>
          <input name="notasTopo" defaultValue={produto?.notasTopo ?? ''} placeholder="Ex: Bergamota, Limão" className={input} />
        </div>
        <div>
          <label className={label}>Notas de Coração</label>
          <input name="notasCoracao" defaultValue={produto?.notasCoracao ?? ''} placeholder="Ex: Rosa, Jasmim" className={input} />
        </div>
        <div>
          <label className={label}>Notas de Base</label>
          <input name="notasBase" defaultValue={produto?.notasBase ?? ''} placeholder="Ex: Oud, Âmbar" className={input} />
        </div>
      </div>

      <div>
        <label className={label}>URLs das imagens (uma por linha)</label>
        <textarea
          name="imagens"
          rows={3}
          defaultValue={produto?.imagens.join('\n') ?? ''}
          placeholder="https://res.cloudinary.com/..."
          className={input}
        />
        <p className="text-xs text-[#555] mt-1">Cole as URLs do Cloudinary após fazer o upload das fotos.</p>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" name="destaque" id="destaque" defaultChecked={produto?.destaque} className="accent-[#C9A84C] w-4 h-4" />
        <label htmlFor="destaque" className="text-sm text-[#888]">Exibir como destaque na home</label>
      </div>

      {/* Variações */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            Variações (tamanhos e preços) *
          </label>
          <button type="button" onClick={addVariacao} className="btn-outline-gold text-xs px-3 py-1.5 flex items-center gap-1">
            <Plus size={13} /> Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {variacoes.map((v, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A]">
              <div>
                <label className={label}>Tipo</label>
                <select
                  value={v.tipo}
                  onChange={(e) => updateVariacao(i, 'tipo', e.target.value)}
                  className={input}
                >
                  <option value="DECANT">Decant</option>
                  <option value="FRASCO">Frasco</option>
                </select>
              </div>
              <div>
                <label className={label}>Volume</label>
                <input
                  value={v.volume}
                  onChange={(e) => updateVariacao(i, 'volume', e.target.value)}
                  placeholder="5ml"
                  className={input}
                />
              </div>
              <div>
                <label className={label}>Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={v.preco}
                  onChange={(e) => updateVariacao(i, 'preco', parseFloat(e.target.value))}
                  className={input}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={label}>Estoque</label>
                  <input
                    type="number"
                    min="0"
                    value={v.estoque}
                    onChange={(e) => updateVariacao(i, 'estoque', parseInt(e.target.value))}
                    className={input}
                  />
                </div>
                {variacoes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariacao(i)}
                    className="self-end mb-0.5 p-2 text-[#555] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="btn-gold flex items-center gap-2">
          {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
          {produto ? 'Salvar alterações' : 'Cadastrar produto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/produtos')}
          className="btn-outline-gold text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
