'use client'

import { useEffect, useState } from 'react'
import { useCarrinho } from '@/store/carrinho'
import { CheckCircle, MessageCircle, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

type ProdutoDestaque = {
  id: string
  nome: string
  slug: string
  marca: string
  imagens: string[]
  variacoes: { id: string; tipo: string; volume: string; preco: number; estoque: number }[]
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'

export default function SucessoPage() {
  const { limpar } = useCarrinho()
  const [destaques, setDestaques] = useState<ProdutoDestaque[]>([])

  useEffect(() => {
    limpar()
    // Busca produtos em destaque para upsell
    fetch('/api/produtos-destaque')
      .then(r => r.json())
      .then(data => { if (data.produtos) setDestaques(data.produtos) })
      .catch(() => {})
  }, [limpar])

  const nomeCliente = typeof window !== 'undefined' ? localStorage.getItem('cliente_nome') ?? '' : ''

  function abrirWhatsApp() {
    const msg = `Olá! Acabei de fazer um pedido na Start One Imports e adorei! Podem me enviar as novidades? ${nomeCliente ? `Sou ${nomeCliente}` : ''}`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Confirmação */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-6">
          <CheckCircle size={40} className="text-[#C9A84C]" />
        </div>
        <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">Pedido confirmado!</h1>
        <p className="text-[#888] text-sm leading-relaxed max-w-sm mx-auto">
          Seu pagamento foi aprovado. Você receberá a confirmação no e-mail informado.
          Em breve entraremos em contato para combinar a entrega.
        </p>
      </div>

      {/* CTAs de engajamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <button
          onClick={abrirWhatsApp}
          className="flex items-center gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <MessageCircle size={20} className="text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5F5F5]">Falar no WhatsApp</p>
            <p className="text-xs text-[#555]">Tire dúvidas e receba novidades</p>
          </div>
        </button>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5">
          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
            <Star size={20} className="text-[#C9A84C]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5F5F5]">Programa Fidelidade</p>
            <p className="text-xs text-[#888]">A cada 5 compras, 1 decant grátis</p>
          </div>
        </div>
      </div>

      {/* Upsell — produtos em destaque */}
      {destaques.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">
              🔥 Complete sua coleção
            </p>
            <Link href="/" className="text-xs text-[#555] hover:text-[#C9A84C] flex items-center gap-1 transition-colors">
              Ver tudo <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {destaques.slice(0, 3).map((p) => {
              const menor = p.variacoes.filter(v => v.estoque > 0).sort((a, b) => a.preco - b.preco)[0]
              return (
                <Link
                  key={p.id}
                  href={`/produto/${p.slug}`}
                  className="card-dark flex flex-col overflow-hidden group"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 70%, #1e1a10 0%, #0d0d0d 100%)' }} />
                    {p.imagens[0] && (
                      <img
                        src={p.imagens[0]}
                        alt={p.nome}
                        className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-[#C9A84C] font-semibold uppercase tracking-widest mb-0.5">{p.marca}</p>
                    <p className="text-xs font-bold text-[#F5F5F5] line-clamp-1 group-hover:text-[#C9A84C] transition-colors">{p.nome}</p>
                    {menor && (
                      <p className="text-xs text-[#888] mt-1">
                        A partir de <span className="text-[#C9A84C] font-bold">{formatPrice(menor.preco)}</span>
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="text-center">
        <Link href="/" className="btn-gold text-sm px-8 py-3 inline-block">
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
