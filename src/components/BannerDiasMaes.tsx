'use client'

import Link from 'next/link'
import { useCarrinho } from '@/store/carrinho'
import { formatPrice } from '@/lib/utils'
import { Gift, ShoppingBag, Sparkles } from 'lucide-react'
import { useState } from 'react'

const YARA_IMG   = 'https://fimgs.net/mdimg/perfume/375x500.76880.jpg'

const PRECO_UNIT = 249.90
const PRECO_KIT  = 429.90
const ECONOMIA   = (PRECO_UNIT * 2) - PRECO_KIT

export default function BannerDiasMaes() {
  const { adicionar, abrirCarrinho, itens } = useCarrinho()
  const [adicionado, setAdicionado] = useState(false)

  // Quantas Yaras já estão no carrinho (para feedback visual)
  const yarasNoCarrinho = itens
    .filter(i => i.nomeProduto === 'Lattafa Yara')
    .reduce((a, i) => a + i.quantidade, 0)
  const kitNoCarrinho = yarasNoCarrinho >= 2

  function adicionarKit() {
    // Adiciona 2 unidades — o desconto é calculado automaticamente no carrinho
    for (let i = 0; i < 2; i++) {
      adicionar({
        variacaoId: `yara-frasco-kit-${i}`,
        produtoId: 'yara-promo',
        nomeProduto: 'Lattafa Yara',
        nomeVariacao: 'Frasco 100ml',
        preco: PRECO_UNIT,
        quantidade: 1,
        imagem: YARA_IMG,
        isDecant: false,
      })
    }
    setAdicionado(true)
    setTimeout(() => { setAdicionado(false); abrirCarrinho() }, 800)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl border border-pink-500/20"
        style={{ background: 'linear-gradient(135deg, #1a0010 0%, #0f000a 40%, #0A0A0A 100%)' }}>

        {/* Brilho de fundo rosa */}
        <div className="absolute -left-20 top-0 bottom-0 w-96 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at left, #ff69b4, transparent 70%)' }} />
        <div className="absolute -right-10 top-0 bottom-0 w-64 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right, #C9A84C, transparent 70%)' }} />

        <div className="relative flex flex-col md:flex-row items-center gap-0">

          {/* ── Garrafas ── */}
          <div className="relative w-full md:w-72 h-56 md:h-80 flex-shrink-0 flex items-end justify-center md:justify-end pr-0 md:pr-6">
            {/* Sombra/glow embaixo */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full blur-xl opacity-40"
              style={{ background: '#ff69b4' }} />

            {/* Garrafa 2 (atrás) */}
            <div className="absolute bottom-0 right-6 md:right-14" style={{ zIndex: 1 }}>
              <div className="relative w-24 h-36 md:w-28 md:h-44" style={{ transform: 'rotate(8deg)' }}>
                <img src={YARA_IMG} alt="Yara 2" className="w-full h-full object-contain opacity-70 drop-shadow-xl" />
              </div>
            </div>
            {/* Garrafa 1 (frente) */}
            <div className="absolute bottom-0 left-6 md:left-8" style={{ zIndex: 2 }}>
              <div className="relative w-28 h-44 md:w-36 md:h-56" style={{ transform: 'rotate(-5deg)' }}>
                <img src={YARA_IMG} alt="Lattafa Yara" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
            </div>

            {/* Tag flutuante */}
            <div className="absolute top-4 right-2 md:right-4 z-10 bg-pink-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-lg"
              style={{ transform: 'rotate(6deg)' }}>
              🌸 Dia das Mães
            </div>
          </div>

          {/* ── Texto ── */}
          <div className="flex-1 px-6 md:px-8 pb-8 md:py-10 text-center md:text-left">
            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
              <Sparkles size={13} className="text-pink-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">Oferta especial</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#F5F5F5] leading-tight mb-1">
              Kit Dia das Mães
            </h2>
            <p className="text-2xl md:text-3xl font-black mb-4" style={{ color: '#E8A0C0' }}>
              2× Lattafa Yara EDP
            </p>

            <p className="text-[#888] text-sm leading-relaxed mb-5 max-w-sm mx-auto md:mx-0">
              O perfume feminino <strong className="text-[#F5F5F5]">mais vendido do catálogo</strong>.
              Tropical, doce e com fixação de mais de 8h. Presenteie com classe.
            </p>

            {/* Preços */}
            <div className="flex items-center gap-4 mb-5 justify-center md:justify-start flex-wrap">
              <div className="text-center">
                <p className="text-xs text-[#555] line-through">{formatPrice(PRECO_UNIT * 2)}</p>
                <p className="text-xs text-[#888]">preço normal</p>
              </div>
              <div className="w-px h-8 bg-[#2A2A2A]" />
              <div className="text-center">
                <p className="text-3xl font-black" style={{ color: '#E8A0C0' }}>{formatPrice(PRECO_KIT)}</p>
                <p className="text-xs text-green-400 font-bold">economia de {formatPrice(ECONOMIA)}</p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                <p className="text-xs font-black text-green-400">-{Math.round((ECONOMIA / (PRECO_UNIT * 2)) * 100)}% OFF</p>
              </div>
            </div>

            {/* Notas rápidas */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
              {['Orquídea', 'Frutas Tropicais', 'Baunilha', 'Almíscar'].map(n => (
                <span key={n} className="text-[10px] px-2 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300">
                  {n}
                </span>
              ))}
            </div>

            {/* Botões */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={adicionarKit}
                className="flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-lg transition-all"
                style={{
                  background: adicionado || kitNoCarrinho ? '#22c55e' : 'linear-gradient(135deg, #be185d, #ec4899)',
                  color: 'white',
                }}
              >
                {adicionado || kitNoCarrinho ? (
                  <><ShoppingBag size={15} /> Kit no carrinho ✓</>
                ) : (
                  <><Gift size={15} /> Quero o Kit — {formatPrice(PRECO_KIT)}</>
                )}
              </button>
              <Link href="/produto/lattafa-yara" className="btn-outline-gold text-sm px-5 py-3">
                Ver detalhes
              </Link>
            </div>

            <p className="text-[10px] text-[#444] mt-3">
              * Desconto aplicado automaticamente no carrinho · Válido por tempo limitado
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
