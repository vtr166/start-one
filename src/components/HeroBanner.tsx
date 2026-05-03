'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { ChevronRight, Droplets, ShoppingBag, Sparkles } from 'lucide-react'

/* ─── Tipo banner do banco ─────────────────────────────────── */
type BannerDB = {
  id: string; badge: string | null; titulo1: string; titulo2: string; subtitulo: string | null
  imagemUrl: string; acento: string; glow: string; overlay: string
  ctaLabel: string | null; ctaHref: string | null; ctaSecLabel: string | null; ctaSecHref: string | null
  stat1n: string | null; stat1label: string | null; stat2n: string | null; stat2label: string | null
  stat3n: string | null; stat3label: string | null
}

/* ─── Fotos reais do Unsplash ──────────────────────────────────
   Licença Unsplash — uso comercial gratuito permitido           */
const FOTO_FEM  = 'https://images.unsplash.com/photo-1595425959632-34f2822322ce?auto=format&fit=crop&w=1920&q=85'
const FOTO_MASC = 'https://images.unsplash.com/photo-IEmvTxmJvxY?auto=format&fit=crop&w=1920&q=85'
const FOTO_GOLD = 'https://images.unsplash.com/photo-NPLI1mFBxlw?auto=format&fit=crop&w=1920&q=85'

const SLIDES = [
  /* ── 1. FEMININO ───────────────────────────────────────────── */
  {
    id: 'fem',
    foto: FOTO_FEM,
    /* overlay: escuro à esquerda (legibilidade) + toque colorido */
    overlay: 'linear-gradient(100deg, rgba(10,0,8,0.97) 0%, rgba(30,0,20,0.85) 38%, rgba(80,0,50,0.45) 65%, rgba(0,0,0,0.15) 100%)',
    acento: '#f9a8d4',
    glow: '#ec4899',
    badge: '🌸 Mais Vendido',
    titulo1: 'O cheiro que', titulo2: 'elas não esquecem.',
    sub: 'Lattafa Yara EDP — doce, tropical, fixação de 8h+.\nO favorito absoluto das brasileiras.',
    preco: 'Frasco a partir de R$ 199 · Decant R$ 22',
    cta:    { label: 'Comprar Yara',        href: '/produto/lattafa-yara', icon: <ShoppingBag size={15}/> },
    ctaSec: { label: 'Experimentar decant', href: '/decants',             icon: <Droplets size={14}/> },
    stats: [
      { n: '+500',  label: 'pedidos\nentregues'   },
      { n: '4.9★',  label: 'avaliação\nmedia'     },
      { n: '8h+',   label: 'fixação\ngarantida'   },
    ],
  },

  /* ── 2. MASCULINO ──────────────────────────────────────────── */
  {
    id: 'masc',
    foto: FOTO_MASC,
    overlay: 'linear-gradient(100deg, rgba(0,8,20,0.97) 0%, rgba(0,15,35,0.87) 38%, rgba(0,30,70,0.45) 65%, rgba(0,0,0,0.15) 100%)',
    acento: '#93c5fd',
    glow: '#3b82f6',
    badge: '🔵 Para Ele',
    titulo1: 'Luxo árabe no', titulo2: 'seu pescoço.',
    sub: 'Club de Nuit, Asad e Hawas — projeção real,\nfixação poderosa, elegância que impressiona.',
    preco: 'Decants a partir de R$ 22 · Frascos R$ 189+',
    cta:    { label: 'Ver masculinos',    href: '/?genero=MASCULINO', icon: <ShoppingBag size={15}/> },
    ctaSec: { label: 'Montar kit decant', href: '/decants',           icon: <Droplets size={14}/> },
    stats: [
      { n: '+40',   label: 'fragrâncias\nno catálogo' },
      { n: '100%',  label: 'frascos\noriginais'       },
      { n: '24h',   label: 'entrega\nexpressa'        },
    ],
  },

  /* ── 3. DECANTS / COLEÇÃO ──────────────────────────────────── */
  {
    id: 'decant',
    foto: FOTO_GOLD,
    overlay: 'linear-gradient(100deg, rgba(10,8,0,0.97) 0%, rgba(25,18,0,0.87) 38%, rgba(60,40,0,0.45) 65%, rgba(0,0,0,0.15) 100%)',
    acento: '#fde68a',
    glow: '#d97706',
    badge: '💧 Decants Originais',
    titulo1: 'Experimente antes', titulo2: 'de comprar.',
    sub: 'Decants de 5ml retirados dos frascos originais.\nKit 3 pague 2 — experimente sem compromisso.',
    preco: 'Kit 3 decants — pague só 2 · a partir de R$ 44',
    cta:    { label: 'Montar meu kit',       href: '/decants', icon: <Sparkles size={15}/> },
    ctaSec: { label: 'Ver catálogo completo', href: '/',        icon: <ShoppingBag size={14}/> },
    stats: [
      { n: '5ml',   label: 'por decant\npuro original' },
      { n: '3×2',   label: 'kit com\ndesconto'         },
      { n: '+40',   label: 'opções\ndisponíveis'       },
    ],
  },
]

export default function HeroBanner() {
  const [idx, setIdx]           = useState(0)
  const [saindo, setSaindo]     = useState(false)
  const [prog, setProg]         = useState(0)
  const [bannersDB, setBannersDB]     = useState<BannerDB[]>([])
  const [totalBanners, setTotalBanners] = useState<number | null>(null)
  const [carregando, setCarregando]   = useState(true)

  // Busca banners do banco
  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then((data: { banners: BannerDB[]; total: number }) => {
        setTotalBanners(data.total ?? 0)
        if (Array.isArray(data.banners) && data.banners.length > 0) setBannersDB(data.banners)
      })
      .catch(() => { setTotalBanners(0) })
      .finally(() => setCarregando(false))
  }, [])

  // Computa slides (vazio enquanto carrega)
  const usarFallback = !carregando && totalBanners === 0
  const slidesAtivos = carregando ? [] : bannersDB.length > 0
    ? bannersDB.map(b => ({
        id:      b.id,
        foto:    b.imagemUrl,
        overlay: b.overlay,
        acento:  b.acento,
        glow:    b.glow,
        badge:   b.badge ?? '',
        titulo1: b.titulo1,
        titulo2: b.titulo2,
        sub:     b.subtitulo ?? '',
        preco:   '',
        cta:     { label: b.ctaLabel ?? 'Ver produtos', href: b.ctaHref ?? '/', icon: <ShoppingBag size={15}/> },
        ctaSec:  { label: b.ctaSecLabel ?? 'Ver decants', href: b.ctaSecHref ?? '/decants', icon: <Droplets size={14}/> },
        stats: [
          b.stat1n ? { n: b.stat1n, label: b.stat1label ?? '' } : null,
          b.stat2n ? { n: b.stat2n, label: b.stat2label ?? '' } : null,
          b.stat3n ? { n: b.stat3n, label: b.stat3label ?? '' } : null,
        ].filter(Boolean) as { n: string; label: string }[],
      }))
    : usarFallback ? SLIDES : []

  // Todos os hooks ANTES de qualquer return condicional
  const trocar = useCallback((next: number) => {
    if (next === idx) return
    setSaindo(true)
    setTimeout(() => { setIdx(next); setSaindo(false); setProg(0) }, 450)
  }, [idx])

  useEffect(() => { setIdx(0) }, [bannersDB.length])

  useEffect(() => {
    const total = slidesAtivos.length
    if (total <= 1) return
    const TICK = 80
    const inc  = (TICK / 7000) * 100
    const t = setInterval(() => {
      setProg(p => {
        if (p >= 100) { trocar((idx + 1) % total); return 0 }
        return p + inc
      })
    }, TICK)
    return () => clearInterval(t)
  }, [idx, trocar, slidesAtivos.length])

  // Returns condicionais DEPOIS de todos os hooks
  if (carregando) return <div className="w-full h-[420px] md:h-[540px] bg-[#0A0A0A]" />
  if (!usarFallback && slidesAtivos.length === 0) return null

  const s = slidesAtivos[idx] ?? slidesAtivos[0]
  if (!s) return null

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'clamp(560px, 90vh, 800px)', background: '#0A0A0A' }}
    >
      {/* ── Foto de fundo ────────────────────────────────────── */}
      <div
        key={s.id + '-bg'}
        className="absolute inset-0 bg-center bg-cover hero-bg-enter"
        style={{ backgroundImage: `url('${s.foto}')` }}
      />

      {/* ── Overlay direcional — escurece à esq. p/ legibilidade */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: s.overlay }}
      />

      {/* ── Vinheta nas bordas ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.6)' }} />

      {/* ── Conteúdo ─────────────────────────────────────────── */}
      <div
        key={s.id + '-content'}
        className="relative z-10 flex flex-col justify-center h-full px-7 md:px-16 lg:px-24 py-16 hero-content-enter"
        style={{ minHeight: 'inherit', maxWidth: 680 }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 self-start px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border backdrop-blur-sm"
          style={{ color: s.acento, borderColor: `${s.glow}60`, background: `${s.glow}20` }}
        >
          {s.badge}
        </div>

        {/* Headline */}
        <h1 className="font-black leading-[0.87] tracking-tight drop-shadow-2xl text-white mb-0.5"
          style={{ fontSize: 'clamp(3rem, 7vw, 5.8rem)', textShadow: '0 2px 30px rgba(0,0,0,0.7)' }}>
          {s.titulo1}
        </h1>
        <h1 className="font-black leading-[0.87] tracking-tight drop-shadow-2xl mb-7"
          style={{ fontSize: 'clamp(3rem, 7vw, 5.8rem)', color: s.acento, textShadow: `0 0 100px ${s.glow}bb` }}>
          {s.titulo2}
        </h1>

        {/* Subtítulo */}
        <p
          className="text-[#ccc] text-sm md:text-[15px] leading-relaxed mb-9 drop-shadow"
          style={{ whiteSpace: 'pre-line', maxWidth: 420 }}
        >
          {s.sub}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href={s.cta.href}
            className="inline-flex items-center gap-2.5 font-black text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97] shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${s.glow} 0%, ${s.acento} 120%)`,
              color: '#0A0A0A',
              boxShadow: `0 8px 48px ${s.glow}60`,
            }}
          >
            {s.cta.icon}
            {s.cta.label}
          </Link>
          <Link
            href={s.ctaSec.href}
            className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
            style={{ color: s.acento, borderColor: `${s.glow}55`, background: 'rgba(0,0,0,0.35)' }}
          >
            {s.ctaSec.icon}
            {s.ctaSec.label}
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-6 md:gap-8">
          {s.stats.map((st, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span
                className="text-xl md:text-2xl font-black leading-none"
                style={{ color: s.acento, textShadow: `0 0 30px ${s.glow}88` }}
              >
                {st.n}
              </span>
              <span className="text-[10px] text-[#777] leading-tight font-medium" style={{ whiteSpace: 'pre-line' }}>
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Barra de progresso + navegação ───────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Gradiente rodapé */}
        <div className="h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />

        {/* Progress bar */}
        <div className="h-[2px]" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full"
            style={{ width: `${prog}%`, background: s.glow, transition: 'width 0.08s linear' }}
          />
        </div>

        <div
          className="flex items-center justify-between px-7 md:px-16 py-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)' }}
        >
          {/* Dots */}
          <div className="flex items-center gap-2.5">
            {slidesAtivos.map((sl, i) => (
              <button
                key={sl.id}
                onClick={() => trocar(i)}
                aria-label={`Slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width:  i === idx ? 28 : 7,
                  height: 7,
                  background: i === idx ? s.glow : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>

          {/* Label slide atual */}
          <span className="text-[11px] text-[#666] hidden md:block font-medium tracking-wider uppercase">
            {String(idx + 1).padStart(2, '0')} / {String(slidesAtivos.length).padStart(2, '0')}
          </span>

          {/* Próximo */}
          {slidesAtivos.length > 1 && (
            <button
              onClick={() => trocar((idx + 1) % slidesAtivos.length)}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-100 opacity-60"
              style={{ color: s.acento }}
            >
              Próximo <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Animações CSS ─────────────────────────────────────── */}
      <style>{`
        @keyframes heroBgEnter {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes heroContentEnter {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hero-bg-enter {
          animation: heroBgEnter 0.9s ease forwards;
        }
        .hero-content-enter {
          animation: heroContentEnter 0.6s ease 0.15s forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
