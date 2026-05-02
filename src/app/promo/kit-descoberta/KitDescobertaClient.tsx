'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCarrinho } from '@/store/carrinho'
import { formatPrice } from '@/lib/utils'
import type { DecantInfo } from './page'
import {
  ShoppingBag, Star, Shield, Truck, RefreshCw,
  ChevronDown, Check, X, Sparkles,
} from 'lucide-react'

/* ─── Constantes ──────────────────────────────────────────── */
const QTD_KIT      = 3
const PRECO_UNIT   = 35       // R$ por decant — fixo para todos na landing
const PRECO_NORMAL = PRECO_UNIT * QTD_KIT   // R$105
const PRECO_KIT    = 89.90
const ECONOMIA     = PRECO_NORMAL - PRECO_KIT  // R$15,10
const CUPOM_CODIGO = 'KITDESCOBERTA'

/* ─── Imagens fallback por produto ───────────────────────── */
const IMAGENS_FALLBACK: Record<string, string> = {
  'Lattafa Yara':                    'https://fimgs.net/mdimg/perfume/375x500.76880.jpg',
  'Lattafa Yara Candy':              'https://fimgs.net/mdimg/perfume/375x500.95752.jpg',
  'Lattafa Yara Tous':               'https://fimgs.net/mdimg/perfume/375x500.99999.jpg',
  'Lattafa Asad':                    'https://fimgs.net/mdimg/perfume/375x500.47066.jpg',
  'Asad Elixir':                     'https://www.lattafa-usa.com/cdn/shop/files/ASADELIXIRBOTTLE.png?v=1760805808&width=500',
  'Rasasi Hawas for Him':            'https://fimgs.net/mdimg/perfume/375x500.35628.jpg',
  'Armaf Club de Nuit Intense Man':  'https://fimgs.net/mdimg/perfume/375x500.15467.jpg',
  'Salvo':                           'https://www.intenseoud.com/cdn/shop/files/Untitleddesign-2024-02-09T115949.531.png?v=1774732102',
  'Lattafa Fakhar Black':            'https://fimgs.net/mdimg/perfume/375x500.50428.jpg',
  'Lattafa Suqraat':                 'https://fimgs.net/mdimg/perfume/375x500.58521.jpg',
  'Afnan 9AM Dive':                  'https://fimgs.net/mdimg/perfume/375x500.66090.jpg',
  'Lattafa Fakhar Rose':             'https://fimgs.net/mdimg/perfume/375x500.50429.jpg',
  'Sabah Al Ward':                   'https://www.alwataniah.com/cdn/shop/files/sabah-al-ward.png?v=1759755351&width=500',
  'Afnan 9AM Pour Femme':            'https://fimgs.net/mdimg/perfume/375x500.64891.jpg',
  'Old Mystery Intense':             'https://static.sweetcare.com/img/prd/488/v-638549231203847569/al-wataniah-021477ww_01.webp',
  'Lattafa Ana Abiyedh Rouge':       'https://fimgs.net/mdimg/perfume/375x500.53241.jpg',
}

/* ─── Emojis de gênero ────────────────────────────────────── */
const GENERO_EMOJI = { MASCULINO: '🔵', FEMININO: '🩷', UNISSEX: '✨' }
const GENERO_LABEL = { MASCULINO: 'Masculino', FEMININO: 'Feminino', UNISSEX: 'Unissex' }

/* ─── Depoimentos ─────────────────────────────────────────── */
const DEP = [
  { nome: 'Lucas M.',      cidade: 'São Paulo, SP',     nota: 5, texto: 'Comprei o kit pra testar antes de investir em um frasco inteiro. Escolhi o Hawas e o Asad — dois tops. Chegou rápido e bem embalado.' },
  { nome: 'Fernanda A.',   cidade: 'Curitiba, PR',       nota: 5, texto: 'Escolhi 3 decants femininos e os três me surpreenderam. O Yara então... é viciante! Já pedi o frasco completo.' },
  { nome: 'Rafael S.',     cidade: 'Belo Horizonte, MG', nota: 5, texto: 'Melhor custo-benefício para descobrir novos perfumes. Por R$89 testei 3 opções que jamais compraria às cegas. Virei cliente fiel.' },
  { nome: 'Isabela T.',    cidade: 'Rio de Janeiro, RJ', nota: 5, texto: 'O kit chegou em 4 dias com um cartãozinho fofo. Os decants são de boa quantidade — deu pra usar por semanas e decidir qual comprar.' },
]

/* ─── FAQ ─────────────────────────────────────────────────── */
const FAQ = [
  { p: 'O que é um decant?',               r: 'Decant é uma amostra de 5ml extraída diretamente do frasco original. Você recebe o perfume autêntico em formato menor, ideal para testar antes de comprar o frasco inteiro (100ml).' },
  { p: 'Os perfumes são originais?',         r: 'Sim, 100%. Trabalhamos apenas com frascos originais importados. Nunca vendemos réplicas ou contratipo.' },
  { p: 'Quanto dura um decant de 5ml?',     r: 'Com 3-4 jatos por uso, um decant de 5ml dura em média 2 a 3 semanas de uso diário — tempo mais que suficiente para decidir se vale a pena o frasco.' },
  { p: 'Como funciona o pagamento?',         r: 'Aceitamos PIX (aprovação imediata com 5% de desconto extra!), cartão de crédito e boleto. Após confirmar, o pedido vai para separação no mesmo dia útil.' },
  { p: 'Quanto tempo para chegar?',          r: 'Enviamos via Correios e transportadoras. O prazo médio é de 3 a 7 dias úteis dependendo da sua região.' },
  { p: 'Posso comprar mais de um kit?',      r: 'Claro! Você pode escolher 3 decants por kit. Para mais decants, basta adicionar kits extras — o desconto é mantido para cada conjunto de 3.' },
]

/* ─── Subcomponentes ──────────────────────────────────────── */
function FaqItem({ p, r }: { p: string; r: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#1e1e1e]">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-[#F5F5F5] hover:text-amber-300 transition-colors gap-4">
        {p}
        <ChevronDown size={16} className={`shrink-0 text-amber-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-[#999] leading-relaxed">{r}</p>}
    </div>
  )
}

function DecantCard({
  decant,
  selecionado,
  desabilitado,
  onToggle,
}: {
  decant: DecantInfo
  selecionado: boolean
  desabilitado: boolean
  onToggle: () => void
}) {
  const imagem = decant.imagem || IMAGENS_FALLBACK[decant.nome] || ''
  const notas  = [decant.notasTopo, decant.notasCoracao].filter(Boolean).join(' · ')

  return (
    <button
      onClick={onToggle}
      disabled={desabilitado && !selecionado}
      className={`
        relative text-left rounded-2xl border transition-all duration-200 overflow-hidden
        ${selecionado
          ? 'border-amber-500/70 shadow-lg'
          : desabilitado
          ? 'border-[#1e1e1e] opacity-40 cursor-not-allowed'
          : 'border-[#1e1e1e] hover:border-amber-500/40 hover:shadow-md cursor-pointer'
        }
      `}
      style={{
        background: selecionado
          ? 'linear-gradient(135deg,#1a1200,#0f0900)'
          : '#0f0f0f',
        boxShadow: selecionado ? '0 0 0 1px #d97706, 0 8px 32px #d9770622' : undefined,
      }}
    >
      {/* Checkmark selecionado */}
      {selecionado && (
        <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: '#d97706' }}>
          <Check size={13} className="text-white" />
        </div>
      )}

      {/* Badge gênero */}
      <div className="absolute top-2 left-2 z-10 text-[10px] font-black px-2 py-0.5 rounded-full"
        style={{ background: '#0a0a0a99', backdropFilter: 'blur(6px)', color: '#aaa' }}>
        {GENERO_EMOJI[decant.genero]} {GENERO_LABEL[decant.genero]}
      </div>

      {/* Imagem */}
      <div className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 80%, #1a1200 0%, #0a0a0a 100%)' }}>
        {imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagem}
            alt={decant.nome}
            className="h-full w-full object-contain p-3"
            style={{ mixBlendMode: 'luminosity', filter: selecionado ? 'none' : 'grayscale(30%)' }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: '#1a1500' }}>
            🌿
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 pt-2">
        <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">
          {decant.marca}
        </p>
        <p className="text-xs font-bold text-[#F5F5F5] leading-tight mb-1.5 line-clamp-2">
          {decant.nome}
        </p>
        {notas && (
          <p className="text-[9px] text-[#666] leading-relaxed line-clamp-2">
            {notas}
          </p>
        )}
        <p className="text-xs font-black text-amber-400 mt-2">
          {formatPrice(PRECO_UNIT)} · 5ml
        </p>
      </div>
    </button>
  )
}

/* ─── Componente principal ────────────────────────────────── */
export default function KitDescobertaClient({ decants }: { decants: DecantInfo[] }) {
  const router = useRouter()
  const { adicionar, fecharCarrinho, limpar, itens } = useCarrinho()

  const [selecionados, setSelecionados] = useState<string[]>([])
  const [adicionando, setAdicionando]   = useState(false)
  const [filtroGenero, setFiltroGenero] = useState<string>('TODOS')

  const qtdSelecionados = selecionados.length
  const completo        = qtdSelecionados === QTD_KIT

  function toggleDecant(variacaoId: string) {
    setSelecionados(prev => {
      if (prev.includes(variacaoId)) return prev.filter(id => id !== variacaoId)
      if (prev.length >= QTD_KIT) return prev
      return [...prev, variacaoId]
    })
  }

  const decantsSelecionados = decants.filter(d => selecionados.includes(d.variacaoId))

  const decantsFiltrados = filtroGenero === 'TODOS'
    ? decants
    : decants.filter(d => d.genero === filtroGenero)

  async function finalizarKit() {
    if (!completo || adicionando) return
    setAdicionando(true)

    // Limpa o carrinho antes — a landing page tem seu próprio checkout
    limpar()

    for (const d of decantsSelecionados) {
      adicionar({
        variacaoId:   d.variacaoId,
        produtoId:    d.produtoId,
        nomeProduto:  d.nome,
        nomeVariacao: 'Decant 5ml',
        preco:        PRECO_UNIT,  // sempre R$35 na landing, independente do banco
        quantidade:   1,
        imagem:       d.imagem || IMAGENS_FALLBACK[d.nome] || '',
        // isDecant: false → não aciona o desconto combo 3x2
        // o cupom KITDESCOBERTA já contempla o desconto exclusivo do kit
        isDecant:     false,
      })
    }

    // Fecha o drawer que o adicionar() abre automaticamente e redireciona
    fecharCarrinho()
    await new Promise(r => setTimeout(r, 150))
    router.push(`/checkout?cupom=${CUPOM_CODIGO}`)
  }

  const filtros = [
    { label: '✨ Todos', value: 'TODOS' },
    { label: '🔵 Masculino', value: 'MASCULINO' },
    { label: '🩷 Feminino', value: 'FEMININO' },
    { label: '⚪ Unissex', value: 'UNISSEX' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 120% 90% at 50% 0%, #1a1000 0%, #0f0800 40%, #0A0A0A 100%)',
          minHeight: 'clamp(480px, 72vh, 720px)',
        }}
      >
        {/* Glows decorativos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{ background: '#d97706' }} />
          <div className="absolute top-0 right-1/4 w-56 h-56 rounded-full opacity-10 blur-3xl"
            style={{ background: '#fbbf24' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 pt-10 pb-8 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            <Sparkles size={11} />
            Oferta Exclusiva · Kit Descoberta
          </div>

          {/* Headline */}
          <h1 className="font-black leading-[0.9] mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}>
            <span className="text-white">Descubra qual perfume</span><br />
            <span style={{ color: '#fbbf24', textShadow: '0 0 80px #d9770688' }}>
              é feito pra você
            </span>
          </h1>

          <p className="text-[#aaa] text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Escolha <strong className="text-white">3 decants originais</strong> de 5ml — árabe ou importado —
            e teste antes de investir em um frasco inteiro.
          </p>

          {/* Preço destaque */}
          <div className="inline-flex items-center gap-6 mb-8 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-lg text-[#444] line-through">{formatPrice(PRECO_NORMAL)}</p>
              <p className="text-[10px] text-[#333] uppercase tracking-wide">separados</p>
            </div>
            <div className="w-px h-12 bg-[#2a2a2a] hidden sm:block" />
            <div className="text-center">
              <p className="text-5xl font-black leading-none" style={{ color: '#fbbf24' }}>
                {formatPrice(PRECO_KIT)}
              </p>
              <p className="text-xs text-green-400 font-bold mt-1">
                economia de {formatPrice(ECONOMIA)}
              </p>
            </div>
            <div className="bg-green-500/15 border border-green-500/30 rounded-full px-4 py-2">
              <span className="text-sm font-black text-green-400">
                -{Math.round((ECONOMIA / PRECO_NORMAL) * 100)}% OFF
              </span>
            </div>
          </div>

          {/* Progresso */}
          <div className="flex items-center justify-center gap-3 mb-3">
            {Array.from({ length: QTD_KIT }).map((_, i) => (
              <div key={i}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-black transition-all duration-300"
                style={{
                  borderColor: i < qtdSelecionados ? '#d97706' : '#2a2a2a',
                  background:  i < qtdSelecionados ? '#d97706' : 'transparent',
                  color:       i < qtdSelecionados ? 'white' : '#333',
                  boxShadow:   i < qtdSelecionados ? '0 0 16px #d9770655' : 'none',
                }}>
                {i < qtdSelecionados ? <Check size={16} /> : i + 1}
              </div>
            ))}
          </div>
          <p className="text-sm font-semibold text-[#666]">
            {qtdSelecionados === 0
              ? 'Selecione 3 decants abaixo ↓'
              : qtdSelecionados < QTD_KIT
              ? `${QTD_KIT - qtdSelecionados} decant${QTD_KIT - qtdSelecionados > 1 ? 's' : ''} restante${QTD_KIT - qtdSelecionados > 1 ? 's' : ''}`
              : '✅ Kit completo! Clique em finalizar'}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════════════════ */}
      <div className="border-y border-[#141414]" style={{ background: '#0d0d0d' }}>
        <div className="max-w-4xl mx-auto px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Shield size={14} />,    label: '100% originais' },
            { icon: <Truck size={14} />,     label: 'Frete para todo Brasil' },
            { icon: <ShoppingBag size={14}/>, label: 'Pagamento seguro' },
            { icon: <RefreshCw size={14} />, label: 'Troca em 7 dias' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-[#666]">
              <span className="text-amber-500">{t.icon}</span>
              <span className="text-xs font-semibold">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GRADE DE SELEÇÃO
      ══════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-10">

        {/* Header da seção */}
        <div className="text-center mb-8">
          <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-1">
            Passo 1
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Escolha seus 3 decants
          </h2>
          <p className="text-[#666] text-sm mt-1">
            {decants.length} opções disponíveis · Decant 5ml cada
          </p>
        </div>

        {/* Filtros de gênero */}
        <div className="flex gap-2 justify-center flex-wrap mb-8">
          {filtros.map(f => (
            <button key={f.value}
              onClick={() => setFiltroGenero(f.value)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
              style={{
                background:  filtroGenero === f.value ? '#d97706' : '#111',
                color:       filtroGenero === f.value ? 'white' : '#888',
                border:      `1px solid ${filtroGenero === f.value ? '#d97706' : '#222'}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {decantsFiltrados.map(d => (
            <DecantCard
              key={d.variacaoId}
              decant={d}
              selecionado={selecionados.includes(d.variacaoId)}
              desabilitado={qtdSelecionados >= QTD_KIT && !selecionados.includes(d.variacaoId)}
              onToggle={() => toggleDecant(d.variacaoId)}
            />
          ))}
        </div>

        {decantsFiltrados.length === 0 && (
          <p className="text-center text-[#444] py-12 text-sm">
            Nenhum decant disponível neste filtro no momento.
          </p>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════
          RESUMO DO KIT (aparece quando completo)
      ══════════════════════════════════════════════════════ */}
      {completo && (
        <section className="max-w-2xl mx-auto px-4 pb-6">
          <div className="rounded-2xl border border-amber-500/30 p-5"
            style={{ background: 'linear-gradient(135deg,#1a1000,#0f0900)' }}>
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-4">
              ✅ Seu Kit Descoberta
            </p>
            <div className="space-y-3 mb-5">
              {decantsSelecionados.map((d, i) => {
                const imagem = d.imagem || IMAGENS_FALLBACK[d.nome] || ''
                return (
                  <div key={d.variacaoId} className="flex items-center gap-3">
                    <span className="text-amber-500 font-black text-sm w-4">{i + 1}.</span>
                    {imagem && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagem} alt={d.nome}
                        className="w-10 h-10 object-contain rounded-lg"
                        style={{ background: '#0a0a0a', mixBlendMode: 'luminosity' }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{d.nome}</p>
                      <p className="text-[10px] text-[#666]">{d.marca} · Decant 5ml</p>
                    </div>
                    <p className="text-xs font-bold text-amber-400 shrink-0">{formatPrice(PRECO_UNIT)}</p>
                    <button onClick={() => toggleDecant(d.variacaoId)}
                      className="text-[#444] hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-[#1e1e1e] pt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-[#444] line-through">{formatPrice(PRECO_NORMAL)}</p>
                <p className="text-2xl font-black" style={{ color: '#fbbf24' }}>
                  {formatPrice(PRECO_KIT)}
                </p>
                <p className="text-xs text-green-400 font-bold">
                  cupom <span className="font-mono">{CUPOM_CODIGO}</span> aplicado automaticamente
                </p>
              </div>
              <button onClick={finalizarKit} disabled={adicionando}
                className="inline-flex items-center gap-2 font-black text-sm px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] disabled:opacity-70"
                style={{
                  background:  'linear-gradient(135deg,#b45309,#d97706)',
                  color:       'white',
                  boxShadow:   '0 6px 32px #d9770644',
                }}>
                <ShoppingBag size={16} />
                {adicionando ? 'Aguarde…' : 'Finalizar compra →'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-[#111] max-w-4xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-1">Simples assim</p>
          <h2 className="text-2xl md:text-3xl font-black text-white">Como funciona?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Escolha 3 decants', desc: 'Filtre por masculino, feminino ou unissex e escolha os 3 perfumes que mais te atraem.' },
            { n: '2', title: 'Receba em casa', desc: 'Cada decant vem com 5ml do perfume original — suficiente para usar por semanas.' },
            { n: '3', title: 'Decida com segurança', desc: 'Testou e amou? Compre o frasco cheio com confiança total. Sem arrependimento.' },
          ].map(s => (
            <div key={s.n} className="rounded-2xl border border-[#1e1e1e] p-6 text-center"
              style={{ background: '#0f0f0f' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg,#b45309,#d97706)', color: 'white' }}>
                {s.n}
              </div>
              <h3 className="font-black text-white mb-2">{s.title}</h3>
              <p className="text-xs text-[#666] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DEPOIMENTOS
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-[#111]" style={{ background: '#090909' }}>
        <div className="max-w-4xl mx-auto px-5 py-14">
          <div className="text-center mb-10">
            <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-1">Quem já testou aprovou</p>
            <h2 className="text-2xl md:text-3xl font-black text-white">+200 kits entregues ⭐</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEP.map((d, i) => (
              <div key={i} className="p-5 rounded-2xl border space-y-3"
                style={{ background: '#111', borderColor: '#1e1e1e' }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: d.nota }).map((_, j) => (
                    <Star key={j} size={11} className="text-[#C9A84C] fill-[#C9A84C]" />
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

      {/* ══════════════════════════════════════════════════════
          CTA CENTRAL
      ══════════════════════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-4">
          Estoque limitado de cada decant
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
          Monte seu kit agora<br />
          <span style={{ color: '#fbbf24' }}>por apenas {formatPrice(PRECO_KIT)}</span>
        </h2>
        <p className="text-[#888] text-sm mb-8">
          3 decants originais · 5ml cada · Enviamos para todo o Brasil
        </p>
        <button
          onClick={() => document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center gap-3 font-black text-base px-10 py-5 rounded-2xl transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] shadow-2xl"
          style={{
            background:  'linear-gradient(135deg,#b45309,#d97706)',
            color:       'white',
            boxShadow:   '0 8px 48px #d9770655',
          }}>
          <ShoppingBag size={18} />
          Escolher meus decants ↑
        </button>
        <p className="text-[11px] text-[#333] mt-4">
          Pagamento seguro · PIX com 5% extra de desconto · Produto original
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-[#111] max-w-2xl mx-auto px-5 py-14">
        <h2 className="text-xl font-black text-white mb-6 text-center">Dúvidas frequentes</h2>
        <div>
          {FAQ.map((f, i) => <FaqItem key={i} p={f.p} r={f.r} />)}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STICKY BAR (mobile)
      ══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background:     'rgba(10,8,0,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop:      '1px solid #201800',
        }}>
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <div className="shrink-0">
            <p className="text-[10px] text-[#444] line-through">{formatPrice(PRECO_NORMAL)}</p>
            <p className="text-lg font-black leading-none" style={{ color: '#fbbf24' }}>
              {formatPrice(PRECO_KIT)}
            </p>
          </div>

          {/* Mini indicador de seleção */}
          <div className="flex gap-1 flex-1">
            {Array.from({ length: QTD_KIT }).map((_, i) => (
              <div key={i}
                className="flex-1 h-1.5 rounded-full transition-all duration-300"
                style={{ background: i < qtdSelecionados ? '#d97706' : '#222' }} />
            ))}
          </div>

          {completo ? (
            <button onClick={finalizarKit} disabled={adicionando}
              className="px-5 py-3 rounded-xl font-black text-sm transition-all active:scale-95 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg,#b45309,#d97706)',
                color: 'white',
                boxShadow: '0 4px 24px #d9770644',
              }}>
              {adicionando ? '…' : '✅ Finalizar →'}
            </button>
          ) : (
            <button
              onClick={() => document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-3 rounded-xl font-black text-xs text-amber-400 border border-amber-500/30 transition-all">
              {qtdSelecionados}/{QTD_KIT} ↑ escolher
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
