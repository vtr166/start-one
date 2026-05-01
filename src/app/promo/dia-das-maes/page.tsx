'use client'

import { useCarrinho } from '@/store/carrinho'
import { formatPrice } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { ShoppingBag, Star, Shield, Truck, RefreshCw, ChevronDown, Check } from 'lucide-react'

/* ─── Imagens ─────────────────────────────────────────────── */
const YARA_IMG  = 'https://fimgs.net/mdimg/perfume/375x500.76880.jpg'
const CANDY_IMG = 'https://fimgs.net/mdimg/perfume/375x500.95752.jpg'

/* ─── Preços ──────────────────────────────────────────────── */
const PRECO_YARA   = 249.90
const PRECO_CANDY  = 229.90
const PRECO_NORMAL = PRECO_YARA + PRECO_CANDY   // 479,80
const PRECO_KIT    = 429.90
const ECONOMIA     = PRECO_NORMAL - PRECO_KIT   // 49,90

/* ─── Depoimentos ─────────────────────────────────────────── */
const DEP = [
  { nome: 'Ana Clara M.',    cidade: 'São Paulo, SP',    nota: 5, texto: 'Comprei o kit pra presentear minha mãe e ela amou! Chegou rapidinho, embalagem impecável. O cheiro do Yara é incrível, durou o dia todo.' },
  { nome: 'Fernanda R.',     cidade: 'Curitiba, PR',     nota: 5, texto: 'Presentei minha mãe com o Yara e foi um sucesso! Ela ficou impressionada com a fixação. Já vou pedir o Yara Candy pra experimentar.' },
  { nome: 'Juliana S.',      cidade: 'Rio de Janeiro, RJ', nota: 5, texto: 'O Yara Candy é perfeito para o verão! Levinho, doce sem exagerar. O kit é uma ótima pedida, ficou muito mais barato que comprar separado.' },
  { nome: 'Mariana T.',      cidade: 'Belo Horizonte, MG', nota: 5, texto: 'Recebi em 3 dias! Os dois perfumes chegaram embalados com cuidado. O Yara tem uma fixação absurda, recebi elogios o dia inteiro.' },
]

/* ─── FAQ ────────────────────────────────────────────────── */
const FAQ = [
  { p: 'Os perfumes são originais?',          r: 'Sim, 100%. Trabalhamos apenas com frascos originais lacrados, importados diretamente. Nunca vendemos réplicas.' },
  { p: 'Como funciona o pagamento?',           r: 'Aceitamos PIX (aprovação imediata), cartão de crédito e boleto. Após confirmar, o pedido vai para separação no mesmo dia.' },
  { p: 'Quanto tempo demora para chegar?',     r: 'Enviamos via Correios e transportadoras parceiras. O prazo médio é de 3 a 7 dias úteis dependendo da sua região.' },
  { p: 'Posso trocar se não gostar do cheiro?',r: 'Sim! Se o frasco chegar lacrado e você quiser trocar, entre em contato pelo WhatsApp em até 7 dias após o recebimento.' },
]

/* ─── Countdown até 10 Mai (Dia das Mães) ────────────────── */
function useCountdown() {
  const alvo = new Date('2025-05-11T23:59:00')
  const calc = () => {
    const diff = alvo.getTime() - Date.now()
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function Num({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center font-black text-2xl md:text-3xl text-white"
        style={{ background: 'linear-gradient(135deg,#be185d,#ec4899)', boxShadow: '0 4px 20px #ec489960' }}>
        {String(n).padStart(2, '0')}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider text-[#888] mt-1">{label}</span>
    </div>
  )
}

function FaqItem({ p, r }: { p: string; r: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#1e1e1e]">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-[#F5F5F5] hover:text-pink-300 transition-colors gap-4">
        {p}
        <ChevronDown size={16} className={`shrink-0 text-pink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-[#999] leading-relaxed">{r}</p>}
    </div>
  )
}

export default function LandingDiasMaes() {
  const { adicionar, abrirCarrinho, itens } = useCarrinho()
  const [ok, setOk] = useState(false)
  const cd = useCountdown()

  const noCarrinho = itens.some(i =>
    i.nomeProduto === 'Lattafa Yara' || i.nomeProduto === 'Lattafa Yara Candy'
  )

  function comprar() {
    if (ok || noCarrinho) { abrirCarrinho(); return }
    adicionar({
      variacaoId: 'yara-promo-lp',
      produtoId:  'yara-promo',
      nomeProduto: 'Lattafa Yara',
      nomeVariacao: 'Frasco 100ml',
      preco: PRECO_YARA,
      quantidade: 1,
      imagem: YARA_IMG,
      isDecant: false,
    })
    adicionar({
      variacaoId: 'yara-candy-promo-lp',
      produtoId:  'yara-candy-promo',
      nomeProduto: 'Lattafa Yara Candy',
      nomeVariacao: 'Frasco 100ml',
      preco: PRECO_CANDY,
      quantidade: 1,
      imagem: CANDY_IMG,
      isDecant: false,
    })
    setOk(true)
    setTimeout(() => { setOk(false); abrirCarrinho() }, 900)
  }

  const ctaLabel = ok
    ? '✓ Adicionado! Abrindo carrinho…'
    : noCarrinho
    ? 'Ver carrinho →'
    : `🎁 Quero o Kit — ${formatPrice(PRECO_KIT)}`

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 120% 100% at 50% 0%, #2d0020 0%, #150010 45%, #0A0A0A 100%)',
          minHeight: 'clamp(620px, 92vh, 860px)',
        }}
      >
        {/* Glows decorativos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: '#ec4899' }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
            style={{ background: '#f9a8d4' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 md:px-10 pt-10 pb-0 flex flex-col md:flex-row items-center gap-8 md:gap-0"
          style={{ minHeight: 'inherit' }}>

          {/* ── TEXTO ── */}
          <div className="flex-1 z-10 text-center md:text-left order-2 md:order-1 pb-12 md:pb-24">

            {/* Urgência topo */}
            <div className="inline-flex items-center gap-2 bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              🌸 Oferta Dia das Mães · Tempo Limitado
            </div>

            {/* Headline */}
            <h1 className="font-black leading-[0.88] mb-3 tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
              <span className="text-white">O presente que</span><br />
              <span style={{ color: '#f9a8d4', textShadow: '0 0 80px #ec489988' }}>ela vai lembrar</span><br />
              <span className="text-white">pra sempre.</span>
            </h1>

            <p className="text-[#aaa] text-base md:text-lg leading-relaxed mb-7 max-w-lg mx-auto md:mx-0">
              Lattafa Yara + Yara Candy — o duo feminino mais amado do catálogo.
              Dois perfumes incríveis em um kit especial de Dia das Mães.
            </p>

            {/* Preço */}
            <div className="flex items-center gap-4 mb-6 justify-center md:justify-start flex-wrap">
              <div className="text-center">
                <p className="text-base text-[#555] line-through">{formatPrice(PRECO_NORMAL)}</p>
                <p className="text-[10px] text-[#444] uppercase tracking-wide">separados</p>
              </div>
              <div className="w-px h-10 bg-[#2a2a2a]" />
              <div>
                <p className="text-5xl font-black leading-none" style={{ color: '#f9a8d4' }}>
                  {formatPrice(PRECO_KIT)}
                </p>
                <p className="text-xs text-green-400 font-bold mt-0.5">
                  economia de {formatPrice(ECONOMIA)} no kit
                </p>
              </div>
              <div className="bg-green-500/15 border border-green-500/30 rounded-full px-3 py-1.5">
                <span className="text-xs font-black text-green-400">
                  -{Math.round((ECONOMIA / PRECO_NORMAL) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* CTA principal */}
            <button onClick={comprar}
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 font-black text-base px-10 py-5 rounded-2xl transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] shadow-2xl mb-4"
              style={{
                background: ok || noCarrinho ? '#22c55e' : 'linear-gradient(135deg,#be185d 0%,#ec4899 100%)',
                color: 'white',
                boxShadow: ok || noCarrinho ? '0 8px 40px #22c55e55' : '0 8px 48px #ec489966',
              }}>
              <ShoppingBag size={18} />
              {ctaLabel}
            </button>

            {/* Micro garantias */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-[11px] text-[#666] font-medium">
              {['✓ Produto 100% original', '✓ Frete para todo Brasil', '✓ Pagamento seguro via PIX'].map(g => (
                <span key={g}>{g}</span>
              ))}
            </div>
          </div>

          {/* ── GARRAFAS ── */}
          <div className="relative flex-shrink-0 order-1 md:order-2 flex items-end justify-center"
            style={{ width: 'clamp(280px, 42vw, 520px)', height: 'clamp(320px, 50vw, 600px)' }}>

            {/* Glow embaixo */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-20 rounded-full blur-3xl opacity-40"
              style={{ background: '#ec4899' }} />

            {/* Yara Candy — atrás */}
            <div className="absolute bottom-0 right-[8%] z-10 bottle-float"
              style={{ animationDelay: '0.3s' }}>
              <img src={CANDY_IMG} alt="Yara Candy"
                style={{
                  height: 'clamp(200px, 30vw, 380px)',
                  width:  'auto',
                  objectFit: 'contain',
                  transform: 'rotate(9deg)',
                  filter: 'drop-shadow(0 20px 50px #ec489966)',
                  mixBlendMode: 'multiply',
                  opacity: 0.9,
                }}
              />
            </div>

            {/* Yara rosa — frente */}
            <div className="absolute bottom-0 left-[8%] z-20 bottle-float">
              <img src={YARA_IMG} alt="Lattafa Yara"
                style={{
                  height: 'clamp(240px, 38vw, 480px)',
                  width:  'auto',
                  objectFit: 'contain',
                  transform: 'rotate(-5deg)',
                  filter: 'drop-shadow(0 24px 60px #ec489988)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>

            {/* Badge kit */}
            <div className="absolute top-4 right-4 z-30 bg-pink-500 text-white text-xs font-black px-3 py-2 rounded-xl shadow-xl"
              style={{ transform: 'rotate(5deg)' }}>
              🌸 Kit Especial<br />
              <span className="text-[10px] opacity-80">2 perfumes</span>
            </div>
          </div>
        </div>

        {/* ── COUNTDOWN ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pb-10">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center md:justify-start">
            <p className="text-[#888] text-xs font-semibold uppercase tracking-wider">
              ⏳ Oferta encerra em:
            </p>
            <div className="flex items-center gap-3">
              <Num n={cd.d} label="dias" />
              <span className="text-2xl font-black text-pink-400 mb-4">:</span>
              <Num n={cd.h} label="horas" />
              <span className="text-2xl font-black text-pink-400 mb-4">:</span>
              <Num n={cd.m} label="min" />
              <span className="text-2xl font-black text-pink-400 mb-4">:</span>
              <Num n={cd.s} label="seg" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="border-y border-[#1a1a1a]" style={{ background: '#0f0f0f' }}>
        <div className="max-w-5xl mx-auto px-5 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Shield size={16}/>,    label: 'Produto 100% original' },
            { icon: <Truck size={16}/>,     label: 'Envio para todo Brasil' },
            { icon: <ShoppingBag size={16}/>, label: 'Pagamento seguro PIX' },
            { icon: <RefreshCw size={16}/>, label: 'Troca em até 7 dias' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[#888]">
              <span className="text-pink-400">{t.icon}</span>
              <span className="text-xs font-semibold">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          O QUE ESTÁ NO KIT
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-5 py-16 md:py-20">
        <div className="text-center mb-12">
          <p className="text-pink-400 text-xs font-black uppercase tracking-widest mb-2">O que você recebe</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Dois perfumes. Uma experiência.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Yara */}
          <div className="rounded-3xl border p-7 flex gap-6 items-start"
            style={{ background: 'linear-gradient(135deg,#1a0012,#100009)', borderColor: '#E8A0C025' }}>
            <div className="shrink-0 w-24 h-36 flex items-center justify-center rounded-2xl overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at 50% 60%, #3d0028 0%, #1a0014 100%)' }}>
              <img src={YARA_IMG} alt="Lattafa Yara" className="w-full h-full object-contain p-2"
                style={{ mixBlendMode: 'multiply' }} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-400 mb-1">Perfume 1</p>
              <h3 className="text-lg font-black text-white mb-1">Lattafa Yara EDP</h3>
              <p className="text-xs text-[#888] leading-relaxed mb-3">
                O hit feminino do Oriente Médio. Floral frutal com notas de orquídea, baunilha e almíscar.
                Fixação de 8h+, projeção marcante.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Orquídea 🌸', 'Baunilha 🍦', 'Almíscar 🤍', 'Âmbar ✨'].map(n => (
                  <span key={n} className="text-[10px] px-2.5 py-1 rounded-full border"
                    style={{ borderColor: '#E8A0C025', color: '#f9a8d4', background: '#E8A0C008' }}>
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#555] mt-3 line-through">{formatPrice(PRECO_YARA)} separado</p>
            </div>
          </div>

          {/* Yara Candy */}
          <div className="rounded-3xl border p-7 flex gap-6 items-start"
            style={{ background: 'linear-gradient(135deg,#1a0012,#100009)', borderColor: '#E8A0C025' }}>
            <div className="shrink-0 w-24 h-36 flex items-center justify-center rounded-2xl overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at 50% 60%, #3d0028 0%, #1a0014 100%)' }}>
              <img src={CANDY_IMG} alt="Lattafa Yara Candy" className="w-full h-full object-contain p-2"
                style={{ mixBlendMode: 'multiply' }} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-400 mb-1">Perfume 2</p>
              <h3 className="text-lg font-black text-white mb-1">Lattafa Yara Candy EDP</h3>
              <p className="text-xs text-[#888] leading-relaxed mb-3">
                A versão mais doce e jovial da linha Yara. Gourmand com toques de morango, caramelo
                e madeiras. Perfeito para o dia a dia.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Morango 🍓', 'Caramelo 🍮', 'Floral 🌺', 'Madeira 🌿'].map(n => (
                  <span key={n} className="text-[10px] px-2.5 py-1 rounded-full border"
                    style={{ borderColor: '#E8A0C025', color: '#f9a8d4', background: '#E8A0C008' }}>
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#555] mt-3 line-through">{formatPrice(PRECO_CANDY)} separado</p>
            </div>
          </div>
        </div>

        {/* Resumo do kit */}
        <div className="mt-6 rounded-2xl border border-pink-500/20 p-5 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: '#E8A0C008' }}>
          <div className="flex flex-wrap gap-4 text-sm">
            {['2 frascos 100ml originais', 'Embalagem para presente', 'Nota fiscal inclusa'].map(i => (
              <span key={i} className="flex items-center gap-1.5 text-[#ccc] font-medium">
                <Check size={13} className="text-green-400" /> {i}
              </span>
            ))}
          </div>
          <div className="text-right">
            <p className="text-xs text-[#555] line-through">{formatPrice(PRECO_NORMAL)}</p>
            <p className="text-2xl font-black" style={{ color: '#f9a8d4' }}>{formatPrice(PRECO_KIT)}</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          DEPOIMENTOS
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#111]" style={{ background: '#090909' }}>
        <div className="max-w-5xl mx-auto px-5 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="text-pink-400 text-xs font-black uppercase tracking-widest mb-2">Quem comprou aprovou</p>
            <h2 className="text-3xl font-black text-white">+500 kits entregues ❤️</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEP.map((d, i) => (
              <div key={i} className="p-5 rounded-2xl border space-y-3"
                style={{ background: '#111', borderColor: '#1e1e1e' }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: d.nota }).map((_, j) => (
                    <Star key={j} size={12} className="text-[#C9A84C] fill-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-sm text-[#ccc] leading-relaxed">"{d.texto}"</p>
                <div>
                  <p className="text-xs font-bold text-white">{d.nome}</p>
                  <p className="text-[10px] text-[#555]">{d.cidade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA CENTRAL
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto px-5 py-16 md:py-20 text-center">
        <p className="text-pink-400 text-xs font-black uppercase tracking-widest mb-4">Aproveite antes que acabe</p>
        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
          Garanta o Kit Dia das Mães<br />
          <span style={{ color: '#f9a8d4' }}>agora com {Math.round((ECONOMIA / PRECO_NORMAL) * 100)}% de desconto</span>
        </h2>
        <p className="text-[#888] text-sm mb-8">
          Oferta por tempo limitado. Estoque restrito. Entrega garantida até o Dia das Mães.
        </p>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="text-center">
            <p className="text-sm text-[#555] line-through">{formatPrice(PRECO_NORMAL)}</p>
            <p className="text-[10px] text-[#444]">preço normal</p>
          </div>
          <p className="text-5xl font-black" style={{ color: '#f9a8d4' }}>{formatPrice(PRECO_KIT)}</p>
        </div>

        <button onClick={comprar}
          className="w-full inline-flex items-center justify-center gap-3 font-black text-lg px-10 py-5 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.97] shadow-2xl mb-4"
          style={{
            background: ok || noCarrinho ? '#22c55e' : 'linear-gradient(135deg,#be185d 0%,#ec4899 100%)',
            color: 'white',
            boxShadow: ok || noCarrinho ? '0 8px 40px #22c55e55' : '0 8px 48px #ec489966',
          }}>
          <ShoppingBag size={20} />
          {ctaLabel}
        </button>

        <p className="text-[11px] text-[#444]">
          Pagamento seguro via PIX · Produto original lacrado · Frete calculado no checkout
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-[#111] max-w-2xl mx-auto px-5 py-14">
        <h2 className="text-xl font-black text-white mb-6 text-center">Dúvidas frequentes</h2>
        <div>
          {FAQ.map((f, i) => <FaqItem key={i} p={f.p} r={f.r} />)}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STICKY BAR — sempre visível no mobile
      ══════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ background: 'rgba(10,0,8,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid #2a1020' }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div>
            <p className="text-[10px] text-[#666] line-through">{formatPrice(PRECO_NORMAL)}</p>
            <p className="text-lg font-black leading-none" style={{ color: '#f9a8d4' }}>{formatPrice(PRECO_KIT)}</p>
          </div>
          <button onClick={comprar} className="flex-1 py-3.5 rounded-xl font-black text-sm transition-all"
            style={{
              background: ok || noCarrinho ? '#22c55e' : 'linear-gradient(135deg,#be185d,#ec4899)',
              color: 'white',
            }}>
            {ok || noCarrinho ? '✓ Ver carrinho' : '🎁 Quero o Kit agora'}
          </button>
        </div>
      </div>

      {/* Espaço extra p/ sticky bar no mobile */}
      <div className="h-20 md:hidden" />

      <style>{`
        @keyframes bottleFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        .bottle-float { animation: bottleFloat 4.8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
