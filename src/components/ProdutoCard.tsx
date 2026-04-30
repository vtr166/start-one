'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Droplets } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCarrinho } from '@/store/carrinho'

type Variacao = {
  id: string
  tipo: string
  volume: string
  preco: number
  estoque: number
  ativo?: boolean
}

type Props = {
  id: string
  nome: string
  slug: string
  marca: string
  categoria: string
  imagens: string[]
  variacoes: Variacao[]
}

export default function ProdutoCard({ id, nome, slug, marca, categoria, imagens, variacoes }: Props) {
  const { adicionar } = useCarrinho()

  const decant = variacoes.find((v) => v.tipo === 'DECANT' && v.ativo !== false && v.estoque > 0)
  const frasco = variacoes.find((v) => v.tipo === 'FRASCO' && v.ativo !== false && v.estoque > 0)
  const menorPreco = variacoes
    .filter((v) => v.estoque > 0)
    .sort((a, b) => a.preco - b.preco)[0]

  const imagem = imagens?.[0] ?? ''
  const temEstoque = variacoes.some((v) => v.estoque > 0)

  function adicionarDecant() {
    if (!decant) return
    adicionar({
      variacaoId: decant.id,
      produtoId: id,
      nomeProduto: nome,
      nomeVariacao: `Decant ${decant.volume}`,
      preco: decant.preco,
      quantidade: 1,
      imagem,
      isDecant: true,
    })
  }

  return (
    <div className="card-dark group flex flex-col overflow-hidden">
      {/* Imagem */}
      <Link href={`/produto/${slug}`} className="relative block aspect-square overflow-hidden bg-[#1A1A1A]">
        {imagem ? (
          <Image
            src={imagem}
            alt={nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333]">
            <ShoppingBag size={48} />
          </div>
        )}

        {/* Badge categoria */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0A0A0A]/80 text-[#C9A84C] border border-[#C9A84C]/30">
          {categoria === 'ARABE' ? 'Árabe' : 'Importado'}
        </span>

        {!temEstoque && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-bold text-[#888] border border-[#444] px-3 py-1 rounded-full">
              Esgotado
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-[11px] text-[#C9A84C] font-semibold uppercase tracking-widest">{marca}</p>
        <Link href={`/produto/${slug}`}>
          <h3 className="text-sm font-bold text-[#F5F5F5] leading-snug line-clamp-2 hover:text-[#C9A84C] transition-colors">
            {nome}
          </h3>
        </Link>

        {menorPreco && (
          <p className="text-xs text-[#888]">
            A partir de{' '}
            <span className="text-[#C9A84C] font-bold text-sm">{formatPrice(menorPreco.preco)}</span>
          </p>
        )}

        {/* Botões */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          {decant && (
            <button
              onClick={adicionarDecant}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#C9A84C] text-xs font-semibold hover:border-[#C9A84C]/50 transition-colors"
            >
              <Droplets size={13} />
              Decant {decant.volume} — {formatPrice(decant.preco)}
            </button>
          )}
          {frasco && (
            <Link
              href={`/produto/${slug}`}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg btn-gold text-xs"
            >
              <ShoppingBag size={13} />
              Ver Frasco
            </Link>
          )}
          {!frasco && !decant && (
            <span className="text-center text-xs text-[#555] py-2">Indisponível</span>
          )}
        </div>
      </div>
    </div>
  )
}
