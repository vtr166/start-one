'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, Droplets, ChevronLeft, Share2, Truck, Star, X } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useCarrinho } from '@/store/carrinho'

type Variacao = {
  id: string
  tipo: string
  volume: string
  preco: number
  precoFinal: number
  desconto: number
  temDesconto: boolean
  estoque: number
  ativo: boolean
}

type Produto = {
  id: string
  nome: string
  slug: string
  marca: string
  categoria: string
  genero: string
  descricao: string
  notasTopo: string | null
  notasCoracao: string | null
  notasBase: string | null
  imagens: string[]
  variacoes: Variacao[]
}

type Relacionado = {
  id: string
  nome: string
  slug: string
  marca: string
  categoria: string
  imagens: string[]
  variacoes: { id: string; tipo: string; volume: string; preco: number; estoque: number }[]
}

type Props = {
  produto: Produto
  relacionados: Relacionado[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  promocoes: any[]
}

// ── Calculadora de frete ──────────────────────────────────────
function CalculadoraFrete({ pesoKg }: { pesoKg: number }) {
  const [cep, setCep] = useState('')
  const [loading, setLoading] = useState(false)
  const [opcoes, setOpcoes] = useState<{ nome: string; empresa: string; preco: number; prazo: number }[]>([])
  const [erro, setErro] = useState('')

  async function calcular() {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) { setErro('CEP inválido'); return }
    setLoading(true); setErro(''); setOpcoes([])
    try {
      const res = await fetch(`/api/frete?cep=${cepLimpo}&peso=${pesoKg}`)
      const data = await res.json()
      if (data.erro) { setErro(data.erro); return }
      setOpcoes(data.opcoes ?? [])
      if ((data.opcoes ?? []).length === 0) setErro('Nenhuma opção de frete disponível para este CEP.')
    } catch {
      setErro('Erro ao calcular frete.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 rounded-xl bg-[#111] border border-[#2A2A2A] space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
        <Truck size={13} /> Calcular frete
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={9}
          placeholder="00000-000"
          value={cep}
          onChange={e => setCep(e.target.value.replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9))}
          onKeyDown={e => e.key === 'Enter' && calcular()}
          className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
        />
        <button
          onClick={calcular}
          disabled={loading}
          className="btn-outline-gold text-xs px-4 py-2 whitespace-nowrap"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </div>
      {erro && <p className="text-xs text-red-400">{erro}</p>}
      {opcoes.length > 0 && (
        <div className="space-y-2 pt-1">
          {opcoes.map((op, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-[#888]">{op.empresa} {op.nome}</span>
              <div className="text-right">
                <span className="text-[#C9A84C] font-bold">{op.preco === 0 ? 'Grátis' : formatPrice(op.preco)}</span>
                <span className="text-[#555] text-xs ml-2">({op.prazo}d úteis)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Prova social dinâmica ─────────────────────────────────────
function ProvaSocialDinamica({ nome }: { nome: string }) {
  // Números "vivos" — baseados no hash do nome para serem consistentes por produto
  const hash = nome.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const vistas   = 7 + (hash % 19)     // 7–25
  const vendidas = 3 + (hash % 12)     // 3–14

  return (
    <div className="flex flex-wrap gap-3">
      <span className="text-[11px] text-[#888] bg-[#111] border border-[#2A2A2A] px-3 py-1.5 rounded-full flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        {vistas} pessoas vendo agora
      </span>
      <span className="text-[11px] text-[#888] bg-[#111] border border-[#2A2A2A] px-3 py-1.5 rounded-full">
        🔥 {vendidas} vendas esta semana
      </span>
    </div>
  )
}

// ── Card de produto relacionado ───────────────────────────────
function RelacionadoCard({ produto }: { produto: Relacionado }) {
  const menor = produto.variacoes.filter(v => v.estoque > 0).sort((a, b) => a.preco - b.preco)[0]
  return (
    <Link href={`/produto/${produto.slug}`} className="card-dark flex flex-col overflow-hidden group">
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 70%, #1e1a10 0%, #0d0d0d 100%)' }} />
        {produto.imagens[0] ? (
          <img src={produto.imagens[0]} alt={produto.nome} className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#333]"><ShoppingBag size={32} /></div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] text-[#C9A84C] font-semibold uppercase tracking-widest mb-0.5">{produto.marca}</p>
        <p className="text-xs font-bold text-[#F5F5F5] line-clamp-2 leading-snug group-hover:text-[#C9A84C] transition-colors">{produto.nome}</p>
        {menor && <p className="text-xs text-[#888] mt-1">A partir de <span className="text-[#C9A84C] font-bold">{formatPrice(menor.preco)}</span></p>}
      </div>
    </Link>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function ProdutoDetalhes({ produto, relacionados }: Props) {
  const { adicionar } = useCarrinho()
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [variacaoSelecionada, setVariacaoSelecionada] = useState<Variacao>(produto.variacoes[0])
  const [adicionado, setAdicionado] = useState(false)
  const [compartilhado, setCompartilhado] = useState(false)
  const [mostrarSticky, setMostrarSticky] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)

  // Detecta quando o botão principal sai da tela → mostra sticky bar no mobile
  useEffect(() => {
    const el = botaoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setMostrarSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const generoLabel: Record<string, string> = {
    MASCULINO: 'Masculino',
    FEMININO: 'Feminino',
    UNISSEX: 'Unissex',
  }

  // Peso estimado para frete (frasco ~0.4kg, decant ~0.1kg)
  const pesoEstimado = variacaoSelecionada?.tipo === 'FRASCO' ? 0.4 : 0.1

  function handleAdicionar() {
    if (!variacaoSelecionada) return
    adicionar({
      variacaoId: variacaoSelecionada.id,
      produtoId: produto.id,
      nomeProduto: produto.nome,
      nomeVariacao: `${variacaoSelecionada.tipo === 'DECANT' ? 'Decant' : 'Frasco'} ${variacaoSelecionada.volume}`,
      preco: variacaoSelecionada.precoFinal,
      quantidade: 1,
      imagem: produto.imagens[0] ?? '',
    })
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  function handleCompartilhar() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const texto = `Olha esse perfume incrível na Start One Imports: *${produto.nome}* - ${url}`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(texto)}`
    window.open(waUrl, '_blank')
    setCompartilhado(true)
    setTimeout(() => setCompartilhado(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Voltar */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[#888] hover:text-[#C9A84C] transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Galeria */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] relative"
            style={{ background: 'radial-gradient(ellipse at 50% 70%, #1e1a10 0%, #111 100%)' }}>
            {produto.imagens[imagemAtiva] ? (
              <img
                src={produto.imagens[imagemAtiva]}
                alt={produto.nome}
                className="w-full h-full object-contain p-6"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#333]">
                <ShoppingBag size={80} />
              </div>
            )}
          </div>

          {produto.imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {produto.imagens.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagemAtiva(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    imagemAtiva === i ? 'border-[#C9A84C]' : 'border-[#2A2A2A]'
                  }`}
                >
                  <img src={img} alt="" className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#C9A84C] font-bold mb-1">{produto.marca}</p>
            <h1 className="text-3xl font-bold text-[#F5F5F5] leading-tight mb-2">{produto.nome}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888]">
                {produto.categoria === 'ARABE' ? 'Árabe' : 'Importado'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888]">
                {generoLabel[produto.genero] ?? produto.genero}
              </span>
            </div>
          </div>

          {/* Prova social dinâmica */}
          <ProvaSocialDinamica nome={produto.nome} />

          <p className="text-sm text-[#888] leading-relaxed">{produto.descricao}</p>

          {/* Notas olfativas */}
          {(produto.notasTopo || produto.notasCoracao || produto.notasBase) && (
            <div className="p-4 rounded-xl bg-[#111] border border-[#2A2A2A] space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] mb-3">
                Notas Olfativas
              </p>
              {produto.notasTopo && (
                <div className="flex gap-2 text-sm">
                  <span className="text-[#555] w-20 shrink-0">Topo</span>
                  <span className="text-[#888]">{produto.notasTopo}</span>
                </div>
              )}
              {produto.notasCoracao && (
                <div className="flex gap-2 text-sm">
                  <span className="text-[#555] w-20 shrink-0">Coração</span>
                  <span className="text-[#888]">{produto.notasCoracao}</span>
                </div>
              )}
              {produto.notasBase && (
                <div className="flex gap-2 text-sm">
                  <span className="text-[#555] w-20 shrink-0">Base</span>
                  <span className="text-[#888]">{produto.notasBase}</span>
                </div>
              )}
            </div>
          )}

          {/* Seletor de variação */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3">
              Escolha o tamanho
            </p>
            <div className="flex flex-wrap gap-2">
              {produto.variacoes.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariacaoSelecionada(v)}
                  className={`flex flex-col items-center px-4 py-3 rounded-xl border text-xs font-semibold transition-all
                    ${variacaoSelecionada?.id === v.id
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'border-[#2A2A2A] text-[#888] hover:border-[#444]'
                    }
                  `}
                >
                  <span className="flex items-center gap-1 mb-0.5">
                    {v.tipo === 'DECANT' ? <Droplets size={11} /> : <ShoppingBag size={11} />}
                    {v.tipo === 'DECANT' ? 'Decant' : 'Frasco'} {v.volume}
                  </span>
                  <span className={variacaoSelecionada?.id === v.id ? 'text-[#C9A84C]' : 'text-[#F5F5F5]'}>
                    {v.temDesconto ? (
                      <>
                        <span className="line-through text-[#555] text-[10px] mr-1">{formatPrice(v.preco)}</span>
                        <span className="text-red-400">{formatPrice(v.precoFinal)}</span>
                      </>
                    ) : (
                      formatPrice(v.preco)
                    )}
                  </span>
                  {v.estoque <= 0 && <span className="text-[10px] text-orange-400">Sob encomenda</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Preço + Estoque + Botão */}
          {variacaoSelecionada && (
            <div className="pt-2">
              <div className="flex items-end justify-between mb-4">
                <div>
                  {variacaoSelecionada.temDesconto ? (
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg line-through text-[#555]">{formatPrice(variacaoSelecionada.preco)}</p>
                      <p className="text-3xl font-bold text-red-400">{formatPrice(variacaoSelecionada.precoFinal)}</p>
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                        -{Math.round((variacaoSelecionada.desconto / variacaoSelecionada.preco) * 100)}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-[#C9A84C]">{formatPrice(variacaoSelecionada.preco)}</p>
                  )}
                </div>
                {variacaoSelecionada.estoque <= 0 ? (
                  <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg border border-orange-400/20">
                    Sob encomenda
                  </span>
                ) : variacaoSelecionada.estoque <= 3 ? (
                  <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg border border-orange-400/20 animate-pulse">
                    ⚡ Últimas {variacaoSelecionada.estoque} unidades!
                  </span>
                ) : variacaoSelecionada.estoque <= 10 ? (
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">
                    Apenas {variacaoSelecionada.estoque} em estoque
                  </span>
                ) : (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    ✓ Em estoque
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  ref={botaoRef}
                  onClick={handleAdicionar}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag size={16} />
                  {adicionado ? 'Adicionado ao carrinho ✓' : 'Adicionar ao Carrinho'}
                </button>
                <button
                  onClick={handleCompartilhar}
                  title="Compartilhar no WhatsApp"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2A2A2A] text-[#888] hover:text-green-400 hover:border-green-400/40 transition-colors text-xs"
                >
                  <Share2 size={15} />
                  {compartilhado ? 'Enviado!' : 'Compartilhar'}
                </button>
              </div>
            </div>
          )}

          {/* Calculadora de frete */}
          <CalculadoraFrete pesoKg={pesoEstimado} />
        </div>
      </div>

      {/* ── Sticky bar mobile ────────────────────────────────── */}
      {mostrarSticky && variacaoSelecionada && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#111]/95 backdrop-blur border-t border-[#2A2A2A] px-4 py-3 flex items-center gap-3 shadow-2xl">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#888] truncate">{produto.nome}</p>
            <p className="text-sm font-bold text-[#C9A84C]">
              {formatPrice(variacaoSelecionada.precoFinal)}
            </p>
          </div>
          <button
            onClick={handleAdicionar}
            className="btn-gold text-sm px-5 py-2.5 shrink-0 flex items-center gap-1.5"
          >
            <ShoppingBag size={15} />
            {adicionado ? 'Adicionado ✓' : 'Comprar'}
          </button>
        </div>
      )}

      {/* ── Produtos relacionados ─────────────────────────────── */}
      {relacionados.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-5">
            <Star size={15} className="text-[#C9A84C]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">Você também pode gostar</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relacionados.map((r) => <RelacionadoCard key={r.id} produto={r} />)}
          </div>
        </section>
      )}
    </div>
  )
}
