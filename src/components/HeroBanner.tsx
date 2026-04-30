'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowRight, Gift, Droplets, Sparkles, Tag } from 'lucide-react'

// Imagens reais dos produtos — Fragrantica
const YARA      = 'https://fimgs.net/mdimg/perfume/375x500.76880.jpg'
const YARA_CANDY= 'https://fimgs.net/mdimg/perfume/375x500.95752.jpg'
const CDNI_MAN  = 'https://fimgs.net/mdimg/perfume/375x500.34696.jpg'
const ASAD      = 'https://fimgs.net/mdimg/perfume/375x500.72821.jpg'
const HAWAS_HIM = 'https://fimgs.net/mdimg/perfume/375x500.46890.jpg'
const MILLION   = 'https://fimgs.net/mdimg/perfume/375x500.3747.jpg'

const slides = [
  // ── SLIDE 1: Dia das Mães ───────────────────────────────
  {
    id: 'maes',
    bg: 'from-[#1a0010] via-[#0d0008] to-[#0A0A0A]',
    acento: '#E8A0C0',
    acentoHex: 'E8A0C0',
    badge: '🌸 Dia das Mães',
    titulo: 'O presente',
    destaque: 'que ela merece',
    desc: 'Lattafa Yara — o perfume feminino favorito das brasileiras. Doce, tropical e irresistível. Aproveite nosso combo especial.',
    cta: { label: 'Ver Promoção', href: '/promo/dia-das-maes' },
    ctaAlt: { label: 'Ver Yara', href: '/produto/lattafa-yara' },
    produtos: [
      { src: YARA, alt: 'Lattafa Yara', w: 160, h: 220, z: 20, x: '55%', rot: '-6deg', delay: '0s' },
      { src: YARA_CANDY, alt: 'Yara Candy', w: 130, h: 180, z: 10, x: '72%', rot: '8deg', delay: '0.15s' },
    ],
    tagPreco: 'A partir de R$ 22 (decant)',
    promoTag: { label: 'Kit 2 Yaras com desconto', cor: 'bg-pink-500/90 text-white' },
  },
  // ── SLIDE 2: Masculinos em destaque ────────────────────
  {
    id: 'masc',
    bg: 'from-[#00101a] via-[#080d12] to-[#0A0A0A]',
    acento: '#7EB8E0',
    acentoHex: '7EB8E0',
    badge: '🔵 Para Ele',
    titulo: 'Fragrâncias',
    destaque: 'de impacto',
    desc: 'Club de Nuit Intense Man, Asad, Hawas e muito mais. Projeção, fixação e elegância árabe pelo preço justo.',
    cta: { label: 'Ver Masculinos', href: '/?genero=MASCULINO' },
    ctaAlt: { label: 'Experimentar Decant', href: '/decants' },
    produtos: [
      { src: CDNI_MAN, alt: 'Club de Nuit', w: 150, h: 210, z: 20, x: '54%', rot: '-5deg', delay: '0s' },
      { src: ASAD, alt: 'Asad', w: 125, h: 175, z: 15, x: '68%', rot: '7deg', delay: '0.1s' },
      { src: HAWAS_HIM, alt: 'Hawas Him', w: 105, h: 148, z: 10, x: '80%', rot: '-3deg', delay: '0.2s' },
    ],
    tagPreco: 'Decants a partir de R$ 22',
    promoTag: null,
  },
  // ── SLIDE 3: Combos Decant ──────────────────────────────
  {
    id: 'decant',
    bg: 'from-[#1a1200] via-[#0d0c06] to-[#0A0A0A]',
    acento: '#C9A84C',
    acentoHex: 'C9A84C',
    badge: '💧 Combos Decant',
    titulo: 'Compre 3,',
    destaque: 'Pague 2',
    desc: 'Experimente qualquer perfume do catálogo em decants de 5ml — retirados dos frascos originais. Kit 5 pague 3 também disponível.',
    cta: { label: 'Montar meu Kit', href: '/decants' },
    ctaAlt: { label: 'Ver 1 Million', href: '/produto/rabanne-1-million' },
    produtos: [
      { src: MILLION, alt: '1 Million', w: 155, h: 215, z: 20, x: '55%', rot: '-5deg', delay: '0s' },
      { src: YARA, alt: 'Yara', w: 120, h: 168, z: 15, x: '70%', rot: '9deg', delay: '0.12s' },
      { src: HAWAS_HIM, alt: 'Hawas', w: 100, h: 140, z: 10, x: '83%', rot: '-4deg', delay: '0.22s' },
    ],
    tagPreco: '3 decants a partir de R$ 44',
    promoTag: { label: '33% de desconto', cor: 'bg-[#C9A84C] text-[#0A0A0A]' },
  },
]

export default function HeroBanner() {
  const [atual, setAtual] = useState(0)
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    const t = setInterval(() => trocar((atual + 1) % slides.length), 7000)
    return () => clearInterval(t)
  }, [atual])

  function trocar(idx: number) {
    if (idx === atual) return
    setSaindo(true)
    setTimeout(() => { setAtual(idx); setSaindo(false) }, 350)
  }

  const s = slides[atual]

  return (
    <section className={`relative w-full overflow-hidden bg-gradient-to-br ${s.bg} transition-colors duration-700`}
      style={{ minHeight: 'clamp(480px, 85vh, 720px)' }}>

      {/* Grid sutil de fundo */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(#${s.acentoHex} 1px,transparent 1px),linear-gradient(90deg,#${s.acentoHex} 1px,transparent 1px)`, backgroundSize: '50px 50px' }} />

      {/* Glow atrás das garrafas */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none">
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at 70% 50%, #${s.acentoHex}33, transparent 65%)` }} />
      </div>

      {/* Layout dividido */}
      <div className={`relative h-full flex items-center transition-all duration-350 ${saindo ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}
        style={{ minHeight: 'inherit' }}>

        {/* ── LADO ESQUERDO: texto ── */}
        <div className="w-full md:w-1/2 px-6 md:px-14 py-16 md:py-20 flex flex-col justify-center">

          {/* Badge */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border"
              style={{ color: `#${s.acentoHex}`, borderColor: `#${s.acentoHex}44`, background: `#${s.acentoHex}12` }}>
              {s.badge}
            </span>
            {s.promoTag && (
              <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${s.promoTag.cor} flex items-center gap-1`}>
                <Tag size={10} /> {s.promoTag.label}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-black leading-[0.88] text-[#F5F5F5] mb-1 drop-shadow">
            {s.titulo}
          </h1>
          <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-black leading-[0.88] mb-5 drop-shadow"
            style={{ color: `#${s.acentoHex}` }}>
            {s.destaque}
          </h1>

          <p className="text-[#999] text-sm md:text-base leading-relaxed mb-7 max-w-sm">
            {s.desc}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href={s.cta.href} className="btn-gold flex items-center gap-2 text-sm px-7 py-3">
              <Sparkles size={14} />
              {s.cta.label}
            </Link>
            <Link href={s.ctaAlt.href} className="btn-outline-gold flex items-center gap-2 text-sm px-6 py-3">
              <Droplets size={14} />
              {s.ctaAlt.label}
            </Link>
          </div>

          {/* Preço hint */}
          <p className="text-[11px] text-[#444]">{s.tagPreco}</p>
        </div>

        {/* ── LADO DIREITO: garrafas flutuantes ── */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none select-none">
          {s.produtos.map((p, i) => (
            <div
              key={i}
              className="absolute bottom-0"
              style={{
                left: p.x,
                transform: `rotate(${p.rot})`,
                zIndex: p.z,
                animationDelay: p.delay,
              }}
            >
              <div className="relative" style={{ width: p.w, height: p.h + 40 }}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="200px"
                  className="object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
                />
                {/* Reflexo sutil */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full blur-md opacity-20"
                  style={{ background: `#${s.acentoHex}` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Versão mobile: garrafas menores no topo */}
      <div className="md:hidden absolute top-4 right-4 flex gap-2 opacity-30 pointer-events-none">
        {s.produtos.slice(0, 2).map((p, i) => (
          <div key={i} className="relative" style={{ width: 60, height: 85 }}>
            <Image src={p.src} alt={p.alt} fill className="object-contain" sizes="80px" />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-6 md:left-14 flex items-center gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => trocar(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{ width: i === atual ? 28 : 8, background: i === atual ? `#${s.acentoHex}` : 'rgba(255,255,255,0.15)' }}
          />
        ))}
      </div>

      {/* Seta próximo */}
      <button onClick={() => trocar((atual + 1) % slides.length)}
        className="absolute right-4 bottom-5 p-2.5 rounded-full border text-white/40 hover:text-white/80 transition-colors backdrop-blur-sm"
        style={{ borderColor: `#${s.acentoHex}30`, background: 'rgba(0,0,0,0.3)' }}>
        <ArrowRight size={16} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 right-5 text-[10px] font-mono text-white/20 hidden md:block">
        {String(atual + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
