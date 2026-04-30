'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, Droplets, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useCarrinho } from '@/store/carrinho'

type Variacao = {
  id: string
  tipo: string
  volume: string
  preco: number
  estoque: number
  ativo: boolean
}

type Produto = {
  id: string
  nome: string
  slug: string
  marca: string
  categoria: string
  genero: string
  descricao: string
  notasTopo: string | null
  notasCoracao: string | null
  notasBase: string | null
  imagens: string[]
  variacoes: Variacao[]
}

export default function ProdutoDetalhes({ produto }: { produto: Produto }) {
  const { adicionar } = useCarrinho()
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [variacaoSelecionada, setVariacaoSelecionada] = useState<Variacao>(
    produto.variacoes[0]
  )
  const [adicionado, setAdicionado] = useState(false)

  const generoLabel: Record<string, string> = {
    MASCULINO: 'Masculino',
    FEMININO: 'Feminino',
    UNISSEX: 'Unissex',
  }

  function handleAdicionar() {
    if (!variacaoSelecionada) return
    adicionar({
      variacaoId: variacaoSelecionada.id,
      produtoId: produto.id,
      nomeProduto: produto.nome,
      nomeVariacao: `${variacaoSelecionada.tipo === 'DECANT' ? 'Decant' : 'Frasco'} ${variacaoSelecionada.volume}`,
      preco: variacaoSelecionada.preco,
      quantidade: 1,
      imagem: produto.imagens[0] ?? '',
    })
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Voltar */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[#888] hover:text-[#C9A84C] transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Galeria */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] relative">
            {produto.imagens[imagemAtiva] ? (
              <Image
                src={produto.imagens[imagemAtiva]}
                alt={produto.nome}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#333]">
                <ShoppingBag size={80} />
              </div>
            )}
          </div>

          {produto.imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {produto.imagens.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagemAtiva(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    imagemAtiva === i ? 'border-[#C9A84C]' : 'border-[#2A2A2A]'
                  }`}
                >
                  <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#C9A84C] font-bold mb-1">{produto.marca}</p>
            <h1 className="text-3xl font-bold text-[#F5F5F5] leading-tight mb-2">{produto.nome}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888]">
                {produto.categoria === 'ARABE' ? 'Árabe' : 'Importado'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888]">
                {generoLabel[produto.genero] ?? produto.genero}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#888] leading-relaxed">{produto.descricao}</p>

          {/* Notas olfativas */}
          {(produto.notasTopo || produto.notasCoracao || produto.notasBase) && (
            <div className="p-4 rounded-xl bg-[#111] border border-[#2A2A2A] space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] mb-3">
                Notas Olfativas
              </p>
              {produto.notasTopo && (
                <div className="flex gap-2 text-sm">
                  <span className="text-[#555] w-20 shrink-0">Topo</span>
                  <span className="text-[#888]">{produto.notasTopo}</span>
                </div>
              )}
              {produto.notasCoracao && (
                <div className="flex gap-2 text-sm">
                  <span className="text-[#555] w-20 shrink-0">Coração</span>
                  <span className="text-[#888]">{produto.notasCoracao}</span>
                </div>
              )}
              {produto.notasBase && (
                <div className="flex gap-2 text-sm">
                  <span className="text-[#555] w-20 shrink-0">Base</span>
                  <span className="text-[#888]">{produto.notasBase}</span>
                </div>
              )}
            </div>
          )}

          {/* Seletor de variação */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3">
              Escolha o tamanho
            </p>
            <div className="flex flex-wrap gap-2">
              {produto.variacoes.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariacaoSelecionada(v)}
                  disabled={v.estoque === 0}
                  className={`flex flex-col items-center px-4 py-3 rounded-xl border text-xs font-semibold transition-all
                    ${variacaoSelecionada?.id === v.id
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'border-[#2A2A2A] text-[#888] hover:border-[#444]'
                    }
                    ${v.estoque === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}
                  `}
                >
                  <span className="flex items-center gap-1 mb-0.5">
                    {v.tipo === 'DECANT' ? <Droplets size={11} /> : <ShoppingBag size={11} />}
                    {v.tipo === 'DECANT' ? 'Decant' : 'Frasco'} {v.volume}
                  </span>
                  <span className={variacaoSelecionada?.id === v.id ? 'text-[#C9A84C]' : 'text-[#F5F5F5]'}>
                    {formatPrice(v.preco)}
                  </span>
                  {v.estoque === 0 && <span className="text-[10px] text-[#555]">Esgotado</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Preço + Botão */}
          {variacaoSelecionada && (
            <div className="pt-2">
              <p className="text-3xl font-bold text-[#C9A84C] mb-4">
                {formatPrice(variacaoSelecionada.preco)}
              </p>
              <button
                onClick={handleAdicionar}
                disabled={variacaoSelecionada.estoque === 0}
                className={`btn-gold w-full flex items-center justify-center gap-2 text-sm ${
                  variacaoSelecionada.estoque === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingBag size={16} />
                {adicionado ? 'Adicionado ao carrinho ✓' : 'Adicionar ao Carrinho'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
