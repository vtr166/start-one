'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Droplets, ShoppingBag, Tag, Plus, Minus, Check, Gift } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCarrinho, calcularDescontoDecants } from '@/store/carrinho'

type Variacao = { id: string; tipo: string; volume: string; preco: number; estoque: number }
type Produto = {
  id: string; nome: string; slug: string; marca: string
  categoria: string; genero: string; imagens: string[]; variacoes: Variacao[]
}

const combos = [
  {
    id: '4x3', label: 'Kit 4 Pague 3', qtd: 4, gratis: 1, badge: '25% OFF',
    desc: 'Escolha 4 decants — o mais barato é por nossa conta.',
    cor: 'border-[#C9A84C]/40 bg-[#C9A84C]/5',
    badgeCor: 'bg-[#C9A84C] text-[#0A0A0A]',
  },
  {
    id: '6x4', label: 'Kit 6 Pague 4', qtd: 6, gratis: 2, badge: '33% OFF',
    desc: 'Escolha 6 decants — os 2 mais baratos são grátis!',
    cor: 'border-green-500/40 bg-green-500/5',
    badgeCor: 'bg-green-500 text-white',
  },
]

const generoLabel: Record<string, string> = { MASCULINO: '🔵 Para Ele', FEMININO: '🩷 Para Ela', UNISSEX: '⚪ Unissex' }

export default function DecantsCatalogo({ produtos }: { produtos: Produto[] }) {
  const { itens, adicionar, remover, alterarQuantidade, abrirCarrinho } = useCarrinho()
  const [filtroGenero, setFiltroGenero] = useState<string>('TODOS')

  const combo = calcularDescontoDecants(itens)
  const totalDecants = itens.filter(i => i.isDecant).reduce((a, i) => a + i.quantidade, 0)
  const faltam4 = Math.max(0, 4 - totalDecants)
  const faltam6 = Math.max(0, 6 - totalDecants)
  const progressoAtual = totalDecants >= 6 ? 6 : totalDecants >= 4 ? 4 : totalDecants

  const generos = ['TODOS', 'MASCULINO', 'FEMININO', 'UNISSEX']
  const produtosFiltrados = filtroGenero === 'TODOS'
    ? produtos
    : produtos.filter(p => p.genero === filtroGenero)

  function getItemDecant(produtoId: string) {
    return itens.find(i => i.produtoId === produtoId && i.isDecant)
  }

  function handleAdicionar(p: Produto, v: Variacao) {
    adicionar({
      variacaoId: v.id,
      produtoId: p.id,
      nomeProduto: p.nome,
      nomeVariacao: `Decant ${v.volume}`,
      preco: v.preco,
      quantidade: 1,
      imagem: p.imagens[0] ?? '',
      isDecant: true,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20">
          <Droplets size={14} className="text-[#C9A84C]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Decants 5ml</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#F5F5F5] mb-3">
          Experimente antes<br />
          <span className="gold-text">de investir</span>
        </h1>
        <p className="text-[#888] text-sm max-w-lg mx-auto leading-relaxed">
          Todos os perfumes do catálogo disponíveis em decants de 5ml — retirados diretamente dos frascos originais.
          Aproveite nossos combos e economize.
        </p>
      </div>

      {/* Cards de combo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {combos.map((c) => (
          <div key={c.id} className={`rounded-2xl border p-6 ${c.cor} relative overflow-hidden`}>
            <span className={`absolute top-4 right-4 text-xs font-black px-2.5 py-1 rounded-full ${c.badgeCor}`}>
              {c.badge}
            </span>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                <Gift size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <p className="font-black text-lg text-[#F5F5F5]">{c.label}</p>
                <p className="text-xs text-[#888]">{c.desc}</p>
              </div>
            </div>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: c.qtd }).map((_, i) => (
                <div key={i}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i < c.qtd - c.gratis
                      ? 'bg-[#C9A84C]'
                      : 'bg-[#C9A84C]/20 border border-dashed border-[#C9A84C]/40'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-[#555] mt-2">
              {c.gratis === 1 ? '1 decant grátis' : `${c.gratis} decants grátis`} (o{c.gratis > 1 ? 's' : ''} mais barato{c.gratis > 1 ? 's' : ''})
            </p>
          </div>
        ))}
      </div>

      {/* Progresso do combo em tempo real */}
      {totalDecants > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-[#111] border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-[#C9A84C]" />
              <span className="text-sm font-bold text-[#F5F5F5]">
                {totalDecants} decant{totalDecants > 1 ? 's' : ''} no carrinho
              </span>
            </div>
            {combo ? (
              <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                <Check size={13} /> {combo.descricao}!
              </span>
            ) : (
              <span className="text-xs text-[#888]">
                {faltam4 > 0 ? `+${faltam4} para Kit 4 Pague 3` : `+${faltam6} para Kit 6 Pague 4`}
              </span>
            )}
          </div>
          <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (progressoAtual / 5) * 100)}%`,
                background: combo ? '#22c55e' : '#C9A84C',
              }}
            />
          </div>
          {combo && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-green-400">🎉 Você está economizando {formatPrice(combo.economia)}!</p>
              <button onClick={abrirCarrinho} className="text-xs btn-gold px-4 py-1.5">
                Ver carrinho
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filtro por gênero */}
      <div className="flex gap-2 flex-wrap mb-6">
        {generos.map((g) => (
          <button
            key={g}
            onClick={() => setFiltroGenero(g)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filtroGenero === g
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:border-[#C9A84C]/40 hover:text-[#C9A84C]'
            }`}
          >
            {g === 'TODOS' ? '🌐 Todos' : generoLabel[g] ?? g}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#555] self-center">{produtosFiltrados.length} decants disponíveis</span>
      </div>

      {/* Grid de decants */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {produtosFiltrados.map((p) => {
          const v = p.variacoes[0]
          if (!v) return null
          const itemNoCarrinho = getItemDecant(p.id)
          const qtdNoCarrinho = itemNoCarrinho?.quantidade ?? 0

          return (
            <div key={p.id} className="card-dark flex flex-col overflow-hidden group">
              {/* Imagem */}
              <div className="relative aspect-square bg-[#1A1A1A] overflow-hidden">
                {p.imagens[0] ? (
                  <Image
                    src={p.imagens[0]}
                    alt={p.nome}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#333]">
                    <Droplets size={32} />
                  </div>
                )}
                <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#C9A84C] text-[#0A0A0A]">
                  5ml
                </span>
                {qtdNoCarrinho > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {qtdNoCarrinho}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-1.5 flex-1">
                <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-wider">{p.marca}</p>
                <p className="text-xs font-bold text-[#F5F5F5] leading-tight line-clamp-2">{p.nome}</p>
                <p className="text-xs font-bold text-[#C9A84C] mt-auto">{formatPrice(v.preco)}</p>

                {/* Botão de quantidade */}
                {qtdNoCarrinho === 0 ? (
                  <button
                    onClick={() => handleAdicionar(p, v)}
                    className="w-full mt-1 py-2 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-bold hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all flex items-center justify-center gap-1"
                  >
                    <Plus size={13} /> Adicionar
                  </button>
                ) : (
                  <div className="flex items-center justify-between mt-1 gap-1">
                    <button
                      onClick={() => {
                        if (itemNoCarrinho) alterarQuantidade(itemNoCarrinho.variacaoId, qtdNoCarrinho - 1)
                      }}
                      className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#888] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold text-[#F5F5F5] flex-1 text-center">{qtdNoCarrinho}</span>
                    <button
                      onClick={() => handleAdicionar(p, v)}
                      className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center text-[#0A0A0A] hover:opacity-90 transition-opacity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA no final */}
      {totalDecants >= 3 && (
        <div className="mt-10 text-center">
          <button onClick={abrirCarrinho} className="btn-gold text-sm px-10 py-3 flex items-center gap-2 mx-auto">
            <ShoppingBag size={16} />
            Ver carrinho — {formatPrice(
              itens.reduce((a, i) => a + i.preco * i.quantidade, 0) -
              (calcularDescontoDecants(itens)?.economia ?? 0)
            )}
            {combo && <Tag size={14} className="text-green-300" />}
          </button>
        </div>
      )}
    </div>
  )
}
