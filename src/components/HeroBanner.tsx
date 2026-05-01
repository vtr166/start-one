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

const SLIDES = [
  {
    id: 'fem',
    bg: 'radial-gradient(ellipse 80% 100% at 70% 50%, #3d0030 0%, #1c0016 40%, #0A0A0A 100%)',
    glow: '#e879b0',
    acento: '#fbb6ce',
    spot: 'radial-gradient(ellipse 55% 75% at 62% 55%, rgba(255,240,248,0.92) 0%, rgba(255,220,238,0.6) 35%, transparent 70%)',
    label: '🌸 Mais Vendido',
    titulo1: 'O cheiro que',
    titulo2: 'elas não esquecem.',
    sub: 'Lattafa Yara EDP — doce, tropical e com fixação de 8h+. O favorito absoluto das brasileiras.',
    preco: 'Frasco a partir de R$ 199 · Decant R$ 22',
    cta:    { label: 'Comprar Yara',         href: '/produto/lattafa-yara' },
    ctaSec: { label: 'Experimentar decant',  href: '/decants' },
    garrafas: [
      { src: YARA_CANDY, scale: 0.62, bottom: '-2%', left: '70%', rot: '12deg',  z: 10, delay: '0.25s' },
      { src: YARA,       scale: 1,    bottom: '-2%', left: '38%', rot: '-5deg',  z: 30, delay: '0s'    },
    ],
    mobile: YARA,
  },
  {
    id: 'masc',
    bg: 'radial-gradient(ellipse 80% 100% at 70% 50%, #001e3c 0%, #00111f 40%, #0A0A0A 100%)',
    glow: '#3b82f6',
    acento: '#93c5fd',
    spot: 'radial-gradient(ellipse 60% 80% at 62% 52%, rgba(235,245,255,0.90) 0%, rgba(210,232,255,0.55) 38%, transparent 68%)',
    label: '🔵 Para Ele',
    titulo1: 'Luxo árabe no',
    titulo2: 'seu pescoço.',
    sub: 'Club de Nuit, Asad e Hawas — projeção real, fixação poderosa, elegância que impressiona.',
    preco: 'Decants a partir de R$ 22 · Frascos R$ 189+',
    cta:    { label: 'Ver masculinos',      href: '/?genero=MASCULINO' },
    ctaSec: { label: 'Montar kit decant',   href: '/decants' },
    garrafas: [
      { src: HAWAS,    scale: 0.54, bottom: '-2%', left: '72%', rot: '-9deg',  z: 10, delay: '0.3s'  },
      { src: ASAD,     scale: 0.70, bottom: '-2%', left: '55%', rot: '7deg',   z: 20, delay: '0.15s' },
      { src: CDNI_MAN, scale: 1,    bottom: '-2%', left: '32%', rot: '-3deg',  z: 30, delay: '0s'    },
    ],
    mobile: CDNI_MAN,
  },
  {
    id: 'decant',
    bg: 'radial-gradient(ellipse 80% 100% at 70% 50%, #2a1f00 0%, #161000 40%, #0A0A0A 100%)',
    glow: '#d97706',
    acento: '#fde68a',
    spot: 'radial-gradient(ellipse 55% 75% at 62% 54%, rgba(255,252,235,0.90) 0%, rgba(255,245,200,0.55) 36%, transparent 68%)',
    label: '💧 Decants Originais',
    titulo1: 'Experimente antes',
    titulo2: 'de comprar.',
    sub: 'Decants de 5 ml retirados dos frascos originais. +40 fragrâncias disponíveis. Kit 3 pague 2.',
    preco: 'Kit 3 decants — pague só 2',
    cta:    { label: 'Montar meu kit',         href: '/decants' },
    ctaSec: { label: 'Ver catálogo completo',  href: '/' },
    garrafas: [
      { src: YARA,    scale: 0.60, bottom: '-2%', left: '70%', rot: '11deg', z: 10, delay: '0.25s' },
      { src: MILLION, scale: 0.78, bottom: '-2%', left: '52%', rot: '-7deg', z: 20, delay: '0.12s' },
      { src: HAWAS,   scale: 1,    bottom: '-2%', left: '30%', rot: '2deg',  z: 30, delay: '0s'    },
    ],
    mobile: MILLION,
  },
]

/* altura base da garrafa principal */
const BASE_H = 500

export default function HeroBanner() {
  const [idx, setIdx]       = useState(0)
  const [saindo, setSaindo] = useState(false)
  const [prog, setProg]     = useState(0)

  const trocar = useCallback((next: number) => {
    if (next === idx) return
    setSaindo(true)
    setTimeout(() => { setIdx(next); setSaindo(false); setProg(0) }, 420)
  }, [idx])

  useEffect(() => {
    const TICK = 80
    const inc  = (TICK / 6500) * 100
    const t = setInterval(() => {
      setProg(p => {
        if (p >= 100) { trocar((idx + 1) % SLIDES.length); return 0 }
        return p + inc
      })
    }, TICK)
    return () => clearInterval(t)
  }, [idx, trocar])

  const s = SLIDES[idx]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 'clamp(540px, 90vh, 780px)',
        background: s.bg,
        transition: 'background 0.8s ease',
      }}
    >
      {/* Noise grain */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '300px',
        }} />

      {/* Spot de luz branca atrás das garrafas — elimina fundo branco das imagens */}
      <div className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: s.spot, transition: 'background 0.8s ease' }} />

      {/* Conteúdo */}
      <div
        className="relative h-full flex items-stretch"
        style={{
          minHeight: 'inherit',
          opacity:   saindo ? 0 : 1,
          transform: saindo ? 'translateX(-20px) scale(0.985)' : 'translateX(0) scale(1)',
          transition: 'opacity 0.42s ease, transform 0.42s ease',
        }}
      >

        {/* ── TEXTO ──────────────────────────────────────────────── */}
        <div className="relative z-20 flex flex-col justify-center w-full md:w-[48%] px-7 md:px-14 lg:px-20 py-16 md:py-20">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-7 self-start px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.18em] border"
            style={{ color: s.acento, borderColor: `${s.glow}55`, background: `${s.glow}18` }}
          >
            {s.label}
          </div>

          {/* Headline */}
          <h1
            className="font-black text-white leading-[0.88] mb-2 tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
          >
            {s.titulo1}
          </h1>
          <h1
            className="font-black leading-[0.88] mb-8 tracking-tight"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              color: s.acento,
              textShadow: `0 0 80px ${s.glow}99, 0 2px 24px rgba(0,0,0,0.4)`,
            }}
          >
            {s.titulo2}
          </h1>

          <p className="text-[#bbb] text-sm md:text-[15px] leading-relaxed max-w-[400px] mb-9">
            {s.sub}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href={s.cta.href}
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97] shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${s.glow} 0%, ${s.acento} 100%)`,
                color: '#0A0A0A',
                boxShadow: `0 8px 40px ${s.glow}55`,
              }}
            >
              <ShoppingBag size={15} />
              {s.cta.label}
            </Link>
            <Link
              href={s.ctaSec.href}
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
              style={{ color: s.acento, borderColor: `${s.glow}55`, background: `${s.glow}10` }}
            >
              <Droplets size={14} />
              {s.ctaSec.label}
            </Link>
          </div>

          <p className="text-[11px] text-[#555]">{s.preco}</p>
        </div>

        {/* ── GARRAFAS DESKTOP ───────────────────────────────────── */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[58%] pointer-events-none select-none">

          {/* Sombra no chão */}
          <div className="absolute bottom-0 left-0 right-0 h-32 z-40"
            style={{ background: 'linear-gradient(to top, #0A0A0A 10%, transparent)' }} />

          {s.garrafas.map((g, i) => {
            const h = Math.round(BASE_H * g.scale)
            const w = Math.round(h * 0.65)
            return (
              <div
                key={i}
                className="absolute bottle-float"
                style={{
                  bottom: g.bottom,
                  left:   g.left,
                  zIndex: g.z,
                  animationDelay: g.delay,
                  transform: `rotate(${g.rot})`,
                }}
              >
                {/* mix-blend-mode: multiply remove o fundo branco das imagens do Fragrantica */}
                <img
                  src={g.src}
                  alt="perfume"
                  draggable={false}
                  style={{
                    width:  w,
                    height: h,
                    objectFit:      'contain',
                    objectPosition: 'bottom',
                    mixBlendMode:   'multiply',
                    display: 'block',
                  }}
                />
                {/* Sombra colorida projetada */}
                <div style={{
                  width:  w * 0.55,
                  height: 16,
                  background: s.glow,
                  opacity: 0.35 * g.scale,
                  borderRadius: '50%',
                  filter: 'blur(10px)',
                  margin: '0 auto',
                  marginTop: -8,
                }} />
              </div>
            )
          })}
        </div>

        {/* ── GARRAFA MOBILE ─────────────────────────────────────── */}
        <div className="md:hidden absolute top-0 right-0 bottom-0 w-36 pointer-events-none select-none flex items-end pb-8 pr-2 opacity-30">
          <img
            src={s.mobile}
            alt=""
            style={{
              width: '100%',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
            }}
          />
        </div>
      </div>

      {/* ── BARRA INFERIOR ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        {/* progress */}
        <div className="h-[2px]" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full" style={{ width: `${prog}%`, background: s.glow, transition: 'width 0.08s linear' }} />
        </div>

        <div className="flex items-center justify-between px-7 md:px-14 py-3.5">
          {/* Dots */}
          <div className="flex items-center gap-2.5">
            {SLIDES.map((sl, i) => (
              <button key={sl.id} onClick={() => trocar(i)} aria-label={`Slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{ width: i === idx ? 26 : 7, height: 7, background: i === idx ? s.glow : 'rgba(255,255,255,0.18)' }}
              />
            ))}
          </div>

          <button onClick={() => trocar((idx + 1) % SLIDES.length)}
            className="flex items-center gap-1 text-[11px] font-semibold opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: s.acento }}>
            Próximo <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bottleFloat {
          0%,100% { transform: translateY(0);     }
          50%      { transform: translateY(-14px); }
        }
        .bottle-float { animation: bottleFloat 5s ease-in-out infinite; }
      `}</style>
    </section>
  )
}
