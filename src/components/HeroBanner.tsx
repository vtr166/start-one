'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { ChevronRight, Droplets, ShoppingBag } from 'lucide-react'

/* ─── Imagens reais dos produtos ─────────────────────────────── */
const YARA       = 'https://fimgs.net/mdimg/perfume/375x500.76880.jpg'
const YARA_CANDY = 'https://fimgs.net/mdimg/perfume/375x500.95752.jpg'
const CDNI_MAN   = 'https://fimgs.net/mdimg/perfume/375x500.34696.jpg'
const ASAD       = 'https://fimgs.net/mdimg/perfume/375x500.72821.jpg'
const HAWAS      = 'https://fimgs.net/mdimg/perfume/375x500.46890.jpg'
const MILLION    = 'https://fimgs.net/mdimg/perfume/375x500.3747.jpg'

/* ─── Slides ─────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 'fem',
    /* cores */
    bg1: '#1c0014',
    bg2: '#0d0009',
    glow: '#d946a8',
    acento: '#f9a8d4',
    /* texto */
    label: '🌸 Mais Vendido',
    titulo1: 'O cheiro que',
    titulo2: 'elas não esquecem.',
    sub: 'Lattafa Yara EDP — doce, tropical e com fixação de 8h. O favorito absoluto das brasileiras.',
    preco: 'Frasco a partir de R$ 199 · Decant R$ 22',
    cta: { label: 'Comprar Yara', href: '/produto/lattafa-yara' },
    ctaSec: { label: 'Experimentar decant', href: '/decants' },
    /* garrafas desktop */
    garrafas: [
      { src: YARA_CANDY, w: 160, h: 230, bottom: 0,  left: '52%', rot: '12deg',  z: 10, op: 0.65, delay: '0.2s' },
      { src: YARA,       w: 240, h: 340, bottom: 0,  left: '34%', rot: '-4deg',  z: 30, op: 1,    delay: '0s'   },
    ],
    /* garrafa hero mobile */
    mobile: { src: YARA, w: 130, h: 185 },
  },
  {
    id: 'masc',
    bg1: '#00111f',
    bg2: '#020b14',
    glow: '#2563eb',
    acento: '#93c5fd',
    label: '🔵 Para Ele',
    titulo1: 'Luxo árabe no',
    titulo2: 'seu pescoço.',
    sub: 'Club de Nuit, Asad e Hawas — projeção real, fixação poderosa e elegância que impressiona.',
    preco: 'Decants a partir de R$ 22 · Frascos R$ 189+',
    cta: { label: 'Ver masculinos', href: '/?genero=MASCULINO' },
    ctaSec: { label: 'Montar kit decant', href: '/decants' },
    garrafas: [
      { src: HAWAS,    w: 140, h: 200, bottom: 0, left: '62%', rot: '-8deg',  z: 10, op: 0.55, delay: '0.25s' },
      { src: ASAD,     w: 165, h: 235, bottom: 0, left: '47%', rot: '6deg',   z: 20, op: 0.8,  delay: '0.12s' },
      { src: CDNI_MAN, w: 230, h: 325, bottom: 0, left: '28%', rot: '-3deg',  z: 30, op: 1,    delay: '0s'    },
    ],
    mobile: { src: CDNI_MAN, w: 125, h: 180 },
  },
  {
    id: 'decant',
    bg1: '#131000',
    bg2: '#0b0900',
    glow: '#ca8a04',
    acento: '#fde68a',
    label: '💧 Decants Originais',
    titulo1: 'Experimente antes',
    titulo2: 'de comprar.',
    sub: 'Decants de 5 ml retirados dos frascos originais. Mais de 40 fragrâncias disponíveis. Kit 3 pague 2.',
    preco: 'Kit 3 decants · pague só 2',
    cta: { label: 'Montar meu kit', href: '/decants' },
    ctaSec: { label: 'Ver catálogo completo', href: '/' },
    garrafas: [
      { src: YARA,    w: 145, h: 205, bottom: 0, left: '60%', rot: '10deg', z: 10, op: 0.6,  delay: '0.2s'  },
      { src: MILLION, w: 175, h: 250, bottom: 0, left: '43%', rot: '-6deg', z: 20, op: 0.85, delay: '0.1s'  },
      { src: HAWAS,   w: 220, h: 315, bottom: 0, left: '24%', rot: '2deg',  z: 30, op: 1,    delay: '0s'    },
    ],
    mobile: { src: MILLION, w: 125, h: 175 },
  },
]

export default function HeroBanner() {
  const [idx, setIdx]       = useState(0)
  const [saindo, setSaindo] = useState(false)
  const [prog, setProg]     = useState(0)

  const trocar = useCallback((next: number) => {
    if (next === idx) return
    setSaindo(true)
    setTimeout(() => { setIdx(next); setSaindo(false); setProg(0) }, 400)
  }, [idx])

  /* auto-avanço com progress bar */
  useEffect(() => {
    const INTERVAL = 6000
    const step     = 100
    const inc      = (step / INTERVAL) * 100

    const timer = setInterval(() => {
      setProg(p => {
        if (p >= 100) { trocar((idx + 1) % SLIDES.length); return 0 }
        return p + inc
      })
    }, step)
    return () => clearInterval(timer)
  }, [idx, trocar])

  const s = SLIDES[idx]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 'clamp(520px, 88vh, 760px)',
        background: `linear-gradient(135deg, ${s.bg1} 0%, ${s.bg2} 60%, #0A0A0A 100%)`,
        transition: 'background 0.7s ease',
      }}
    >
      {/* ── Glow radial de fundo ───────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 65% 55%, ${s.glow}22 0%, transparent 70%)`,
          transition: 'background 0.7s ease',
        }}
      />

      {/* ── Grain sutil ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      {/* ── Conteúdo principal ────────────────────────────────────── */}
      <div
        className="relative h-full flex items-stretch"
        style={{
          minHeight: 'inherit',
          opacity: saindo ? 0 : 1,
          transform: saindo ? 'translateX(-16px)' : 'translateX(0)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >

        {/* ─ ESQUERDO: Texto ─────────────────────────────────────── */}
        <div className="relative z-20 flex flex-col justify-center w-full md:w-[52%] px-6 md:px-16 lg:px-24 py-16 md:py-20">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-6 self-start px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border"
            style={{
              color: s.acento,
              borderColor: `${s.glow}55`,
              background: `${s.glow}15`,
            }}
          >
            {s.label}
          </div>

          {/* Headline */}
          <h1 className="font-black text-[#F5F5F5] leading-[0.9] mb-2 drop-shadow-lg"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)' }}>
            {s.titulo1}
          </h1>
          <h1
            className="font-black leading-[0.9] mb-7 drop-shadow-lg"
            style={{
              fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)',
              color: s.acento,
              textShadow: `0 0 60px ${s.glow}88`,
            }}
          >
            {s.titulo2}
          </h1>

          {/* Subtítulo */}
          <p className="text-[#aaa] text-sm md:text-base leading-relaxed max-w-[400px] mb-8">
            {s.sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-7">
            <Link
              href={s.cta.href}
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${s.glow}, ${s.acento}cc)`,
                color: '#0A0A0A',
                boxShadow: `0 8px 32px ${s.glow}44`,
              }}
            >
              <ShoppingBag size={15} />
              {s.cta.label}
            </Link>
            <Link
              href={s.ctaSec.href}
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
              style={{
                color: s.acento,
                borderColor: `${s.glow}44`,
                background: `${s.glow}0d`,
              }}
            >
              <Droplets size={14} />
              {s.ctaSec.label}
            </Link>
          </div>

          {/* Preço hint */}
          <p className="text-[11px] text-[#555] font-medium">{s.preco}</p>
        </div>

        {/* ─ DIREITO: Garrafas desktop ────────────────────────────── */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none select-none">

          {/* Spot light atrás das garrafas */}
          <div
            className="absolute bottom-0 right-0 w-full h-full"
            style={{
              background: `radial-gradient(ellipse 55% 65% at 55% 80%, ${s.glow}30 0%, transparent 65%)`,
            }}
          />

          {/* Reflexo no chão */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24"
            style={{ background: 'linear-gradient(to top, #0A0A0A 20%, transparent)' }}
          />

          {/* Garrafas empilhadas */}
          {s.garrafas.map((g, i) => (
            <div
              key={i}
              className="absolute bottom-0 bottle-float"
              style={{
                left: g.left,
                zIndex: g.z,
                animationDelay: g.delay,
              }}
            >
              <div style={{ transform: `rotate(${g.rot})` }}>
                <img
                  src={g.src}
                  alt="perfume"
                  draggable={false}
                  style={{
                    width: g.w,
                    height: g.h,
                    objectFit: 'contain',
                    opacity: g.op,
                    filter: `drop-shadow(0 24px 48px ${s.glow}66) drop-shadow(0 4px 12px rgba(0,0,0,0.8))`,
                    display: 'block',
                  }}
                />
                {/* Sombra no chão */}
                <div
                  className="mx-auto rounded-full blur-lg"
                  style={{
                    width: g.w * 0.6,
                    height: 14,
                    background: s.glow,
                    opacity: g.op * 0.25,
                    marginTop: -6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ─ Garrafa mobile (canto superior direito) ──────────────── */}
        <div className="md:hidden absolute top-5 right-4 pointer-events-none select-none z-10 opacity-25">
          <img
            src={s.mobile.src}
            alt=""
            style={{
              width: s.mobile.w,
              height: s.mobile.h,
              objectFit: 'contain',
              filter: `drop-shadow(0 8px 20px ${s.glow}88)`,
            }}
          />
        </div>
      </div>

      {/* ── Barra de progresso + navegação ──────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">

        {/* Progress bar */}
        <div className="h-[2px] bg-white/5">
          <div
            className="h-full transition-none"
            style={{ width: `${prog}%`, background: s.glow }}
          />
        </div>

        <div className="flex items-center justify-between px-6 md:px-14 py-3">

          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((sl, i) => (
              <button
                key={sl.id}
                onClick={() => trocar(i)}
                aria-label={`Slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 24 : 6,
                  height: 6,
                  background: i === idx ? s.glow : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {/* Próximo */}
          <button
            onClick={() => trocar((idx + 1) % SLIDES.length)}
            className="flex items-center gap-1.5 text-[11px] font-semibold transition-opacity hover:opacity-80"
            style={{ color: s.acento }}
          >
            Próximo <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Animação CSS ─────────────────────────────────────────── */}
      <style>{`
        @keyframes bottleFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .bottle-float {
          animation: bottleFloat 4.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
