'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCarrinho } from '@/store/carrinho'
import { formatPrice } from '@/lib/utils'
import { Gift, ShoppingBag, Sparkles, Star, Heart, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const YARA_IMG    = 'https://fimgs.net/mdimg/perfume/375x500.76880.jpg'
const CANDY_IMG   = 'https://fimgs.net/mdimg/perfume/375x500.95752.jpg'

const PRECO_UNIT  = 249.90
const PRECO_KIT   = 429.90
const ECONOMIA    = (PRECO_UNIT * 2) - PRECO_KIT

const notas = [
  { nome: 'Orquídea', emoji: '🌸' },
  { nome: 'Frutas Tropicais', emoji: '🍓' },
  { nome: 'Baunilha', emoji: '🍦' },
  { nome: 'Almíscar', emoji: '🤍' },
  { nome: 'Âmbar', emoji: '✨' },
]

const avaliacoes = [
  { nome: 'Ana C.', estrelas: 5, texto: 'Presenteei minha mãe com o Yara e ela amou! Cheiro incrível, durou o dia todo.' },
  { nome: 'Fernanda R.', estrelas: 5, texto: 'O melhor perfume que já comprei. Fixação impressionante e o preço é ótimo.' },
  { nome: 'Julia M.', estrelas: 5, texto: 'Comprei pra mim e pra minha irmã. As duas amaram. Muito doce e feminino.' },
]

export default function PromoDiasDasMaes() {
  const { adicionar, abrirCarrinho } = useCarrinho()
  const [adicionado, setAdicionado] = useState(false)

  function adicionarKit() {
    for (let i = 0; i < 2; i++) {
      adicionar({
        variacaoId: `yara-frasco-kit-${i}`,
        produtoId:  'yara-promo',
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
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0010 0%, #0d0008 50%, #0A0A0A 100%)',
          minHeight: 'clamp(500px, 80vh, 700px)',
        }}
      >
        {/* Glow rosa */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-15"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, #ff69b4, transparent 60%)' }} />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            style={{ background: 'radial-gradient(ellipse at 70% 50%, #C9A84C, transparent 60%)' }} />
        </div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {['🌸', '✨', '💕', '🌺', '⭐'].map((e, i) => (
            <span key={i} className="absolute text-sm opacity-20"
              style={{ left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 25}%` }}>
              {e}
            </span>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* Texto */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <Heart size={14} className="text-pink-400 fill-pink-400" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">Dia das Mães 2025</span>
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-tight text-[#F5F5F5] mb-2">
              O presente
            </h1>
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-tight mb-5"
              style={{ color: '#E8A0C0' }}>
              que ela merece
            </h1>

            <p className="text-[#999] text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
              Lattafa Yara — o perfume feminino <strong className="text-[#F5F5F5]">mais vendido do Brasil</strong>.
              Tropical, doce e com fixação de mais de 8 horas. Aproveite nosso kit especial Dia das Mães
              com desconto exclusivo.
            </p>

            {/* Preço destaque */}
            <div className="flex items-center gap-5 mb-8 justify-center md:justify-start flex-wrap">
              <div className="text-center">
                <p className="text-sm text-[#555] line-through">{formatPrice(PRECO_UNIT * 2)}</p>
                <p className="text-xs text-[#666]">preço normal</p>
              </div>
              <div className="text-4xl font-black" style={{ color: '#E8A0C0' }}>
                {formatPrice(PRECO_KIT)}
              </div>
              <div className="bg-green-500/15 border border-green-500/30 px-3 py-1.5 rounded-full">
                <p className="text-xs font-black text-green-400">
                  ECONOMIZE {formatPrice(ECONOMIA)}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={adicionarKit}
                className="flex items-center gap-2 text-base font-bold px-8 py-4 rounded-xl transition-all shadow-lg"
                style={{
                  background: adicionado
                    ? '#22c55e'
                    : 'linear-gradient(135deg, #be185d, #ec4899)',
                  color: 'white',
                  boxShadow: adicionado ? '0 0 20px #22c55e40' : '0 0 30px #ec489940',
                }}
              >
                {adicionado ? (
                  <><ShoppingBag size={16} /> Kit adicionado! ✓</>
                ) : (
                  <><Gift size={16} /> Quero o Kit — {formatPrice(PRECO_KIT)}</>
                )}
              </button>
              <Link href="/produto/lattafa-yara"
                className="flex items-center gap-2 text-sm font-semibold px-6 py-4 rounded-xl border transition-colors"
                style={{ borderColor: '#E8A0C040', color: '#E8A0C0' }}>
                Ver produto <ArrowRight size={14} />
              </Link>
            </div>

            <p className="text-[11px] text-[#444] mt-4">
              * 2 frascos de 100ml · Desconto automático no carrinho · Produto original
            </p>
          </div>

          {/* Garrafas */}
          <div className="relative w-64 h-72 md:w-80 md:h-96 flex-shrink-0 order-1 md:order-2">
            {/* Glow embaixo */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full blur-2xl opacity-50"
              style={{ background: '#ff69b4' }} />

            {/* Garrafa 2 (atrás, mais clara) */}
            <div className="absolute bottom-0 right-4 md:right-6" style={{ zIndex: 1 }}>
              <div className="relative w-32 h-48 md:w-40 md:h-60" style={{ transform: 'rotate(10deg)' }}>
                <Image src={CANDY_IMG} alt="Yara Candy" fill className="object-contain opacity-60 drop-shadow-xl" sizes="160px" />
              </div>
            </div>

            {/* Garrafa 1 (frente, principal) */}
            <div className="absolute bottom-0 left-4 md:left-6" style={{ zIndex: 2 }}>
              <div className="relative w-40 h-60 md:w-52 md:h-80" style={{ transform: 'rotate(-6deg)' }}>
                <Image src={YARA_IMG} alt="Lattafa Yara" fill className="object-contain drop-shadow-2xl" sizes="210px" />
              </div>
            </div>

            {/* Badge flutuante */}
            <div className="absolute top-0 right-0 z-10 bg-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
              style={{ transform: 'rotate(8deg)' }}>
              🌸 Kit Especial
            </div>
          </div>
        </div>
      </section>

      {/* ── O QUE ESTÁ INCLUSO ── */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <Sparkles size={20} className="text-pink-400 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-[#F5F5F5]">O que está incluso no Kit</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              img: YARA_IMG,
              titulo: 'Lattafa Yara EDP × 1',
              desc: 'Frasco de 100ml, embalagem original lacrada. O hit feminino mais amado do catálogo.',
            },
            {
              img: YARA_IMG,
              titulo: 'Lattafa Yara EDP × 1',
              desc: 'Segundo frasco incluso no kit — perfeito para presentear ou ter uma reserva.',
            },
          ].map((item, i) => (
            <div key={i}
              className="flex items-center gap-4 p-5 rounded-2xl border"
              style={{ background: '#111', borderColor: '#E8A0C020' }}>
              <div className="relative w-16 h-24 flex-shrink-0">
                <Image src={item.img} alt={item.titulo} fill className="object-contain" sizes="64px" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F5F5F5] mb-1">{item.titulo}</p>
                <p className="text-xs text-[#888] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOTAS OLFATIVAS ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div
          className="rounded-2xl p-8 border"
          style={{ background: 'linear-gradient(135deg, #1a0010, #0d0008)', borderColor: '#E8A0C015' }}>
          <h2 className="text-lg font-black text-[#F5F5F5] mb-6 text-center">Notas Olfativas</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {notas.map((n) => (
              <div key={n.nome}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border"
                style={{ background: '#E8A0C010', borderColor: '#E8A0C030' }}>
                <span>{n.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: '#E8A0C0' }}>{n.nome}</span>
              </div>
            ))}
          </div>
          <p className="text-[#666] text-sm text-center mt-6">
            Família olfativa: Floral Frutal · Concentração: EDP · Fixação: 8h+ · Projeção: Alta
          </p>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-black text-[#F5F5F5] text-center mb-8">
          Quem comprou, aprovou ❤️
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {avaliacoes.map((a, i) => (
            <div key={i}
              className="p-5 rounded-2xl border space-y-3"
              style={{ background: '#111', borderColor: '#2A2A2A' }}>
              <div className="flex gap-0.5">
                {Array.from({ length: a.estrelas }).map((_, j) => (
                  <Star key={j} size={13} className="text-[#C9A84C] fill-[#C9A84C]" />
                ))}
              </div>
              <p className="text-sm text-[#CCC] leading-relaxed italic">"{a.texto}"</p>
              <p className="text-xs font-bold text-[#C9A84C]">— {a.nome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <div
          className="rounded-3xl p-10 border"
          style={{
            background: 'linear-gradient(135deg, #1a0010, #0d0008)',
            borderColor: '#E8A0C030',
          }}>
          <Heart size={28} className="text-pink-400 fill-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#F5F5F5] mb-2">Surpreenda no Dia das Mães</h2>
          <p className="text-[#888] text-sm mb-6">
            Presente único, cheiro marcante, preço justo. Aproveite enquanto dura.
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <p className="text-sm text-[#555] line-through">{formatPrice(PRECO_UNIT * 2)}</p>
            <p className="text-4xl font-black" style={{ color: '#E8A0C0' }}>{formatPrice(PRECO_KIT)}</p>
          </div>
          <button
            onClick={adicionarKit}
            className="w-full max-w-xs flex items-center justify-center gap-2 text-base font-bold px-8 py-4 rounded-xl mx-auto transition-all"
            style={{
              background: adicionado
                ? '#22c55e'
                : 'linear-gradient(135deg, #be185d, #ec4899)',
              color: 'white',
            }}
          >
            {adicionado ? (
              <><ShoppingBag size={16} /> Kit adicionado! ✓</>
            ) : (
              <><Gift size={16} /> Quero o Kit agora</>
            )}
          </button>
        </div>
      </section>
    </div>
  )
}
