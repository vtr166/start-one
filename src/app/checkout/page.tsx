'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCarrinho, calcularDescontoDecants, calcularDescontoYara } from '@/store/carrinho'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingBag, Loader2, Tag, Copy, Check, CheckCircle,
  QrCode, Clock, Truck, MapPin, ChevronRight, X,
} from 'lucide-react'
import Image from 'next/image'
import type { OpcaoFrete } from '@/app/api/frete/route'

type Fase = 'form' | 'pix' | 'aprovado'

type PixData = {
  pedidoId: string
  qrCode: string
  qrCodeBase64: string
  total: number
}

function mascaraCPF(v: string) {
  return v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').slice(0,14)
}
function mascaraTel(v: string) {
  return v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2').slice(0,15)
}
function mascaraCEP(v: string) {
  return v.replace(/\D/g,'').replace(/(\d{5})(\d)/,'$1-$2').slice(0,9)
}

export default function CheckoutPage() {
  const { itens, subtotal, desconto, total, limpar } = useCarrinho()
  const combo     = calcularDescontoDecants(itens)
  const comboYara = calcularDescontoYara(itens)

  const [fase, setFase]           = useState<Fase>('form')
  const [pixData, setPixData]     = useState<PixData | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro]           = useState('')
  const [copiado, setCopiado]     = useState(false)
  const [segundos, setSegundos]   = useState(30 * 60)

  // Form
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  })

  // Frete
  const [freteOpcoes, setFreteOpcoes]       = useState<OpcaoFrete[]>([])
  const [freteSelecionado, setFreteSelecionado] = useState<OpcaoFrete | null>(null)
  const [buscandoCEP, setBuscandoCEP]       = useState(false)
  const [buscandoFrete, setBuscandoFrete]   = useState(false)
  const cepBuscadoRef = useRef('')

  // Cupom
  type CupomAplicado = { id: string; codigo: string; tipo: string; valor: number; desconto: number; afiliado: string | null }
  const [codigoCupom, setCodigoCupom]       = useState('')
  const [cupomAplicado, setCupomAplicado]   = useState<CupomAplicado | null>(null)
  const [cupomErro, setCupomErro]           = useState('')
  const [validandoCupom, setValidandoCupom] = useState(false)

  // Peso estimado baseado nos itens
  const pesoEstimado = itens.reduce((acc, i) => {
    const unitario = i.isDecant ? 0.1 : 0.35
    return acc + unitario * i.quantidade
  }, 0.3)

  // Auto-preenche endereço e busca frete quando CEP completo
  useEffect(() => {
    const cepLimpo = form.cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8 || cepLimpo === cepBuscadoRef.current) return
    cepBuscadoRef.current = cepLimpo

    async function buscar() {
      setBuscandoCEP(true)
      setFreteOpcoes([])
      setFreteSelecionado(null)
      try {
        const [viaCep, freteRes] = await Promise.all([
          fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`).then(r => r.json()),
          fetch(`/api/frete?cep=${cepLimpo}&peso=${pesoEstimado.toFixed(2)}`).then(r => r.json()),
        ])
        if (!viaCep.erro) {
          setForm(f => ({
            ...f,
            rua: viaCep.logradouro || f.rua,
            bairro: viaCep.bairro || f.bairro,
            cidade: viaCep.localidade || f.cidade,
            estado: viaCep.uf || f.estado,
          }))
        }
        if (freteRes.opcoes?.length) {
          setFreteOpcoes(freteRes.opcoes)
          setFreteSelecionado(freteRes.opcoes[0])
        }
      } catch { /* ignora */ }
      finally { setBuscandoCEP(false); setBuscandoFrete(false) }
    }
    buscar()
  }, [form.cep, pesoEstimado])

  // Countdown PIX
  useEffect(() => {
    if (fase !== 'pix') return
    const t = setInterval(() => setSegundos(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [fase])

  // Polling status
  const verificarStatus = useCallback(async () => {
    if (!pixData) return
    try {
      const res = await fetch(`/api/pedido-status?id=${pixData.pedidoId}`)
      const data = await res.json()
      if (data.status === 'APROVADO') { limpar(); setFase('aprovado') }
    } catch { /* ignora */ }
  }, [pixData, limpar])

  useEffect(() => {
    if (fase !== 'pix') return
    const t = setInterval(verificarStatus, 5000)
    return () => clearInterval(t)
  }, [fase, verificarStatus])

  async function aplicarCupom() {
    const cod = codigoCupom.trim().toUpperCase()
    if (!cod) return
    setValidandoCupom(true)
    setCupomErro('')
    try {
      const base = total() + (freteSelecionado?.preco ?? 0)
      const res  = await fetch(`/api/cupom?codigo=${cod}&total=${base}`)
      const data = await res.json()
      if (!res.ok) { setCupomErro(data.erro); return }
      setCupomAplicado(data)
    } catch { setCupomErro('Erro ao validar cupom') }
    finally { setValidandoCupom(false) }
  }

  function removerCupom() { setCupomAplicado(null); setCodigoCupom(''); setCupomErro('') }

  const totalComFrete  = total() + (freteSelecionado?.preco ?? 0)
  const totalComDesconto = totalComFrete - (cupomAplicado?.desconto ?? 0)

  // Lê cookie do afiliado (rastreamento por link ?ref=slug)
  function lerCookieAfiliado(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)affiliate_ref=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : null
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!freteSelecionado) { setErro('Selecione uma opção de frete'); return }
    setCarregando(true)
    setErro('')

    const enderecoFormatado = `${form.rua}, ${form.numero}${form.complemento ? `, ${form.complemento}` : ''} — ${form.bairro}, ${form.cidade} - ${form.estado}, ${form.cep}`
    const afiliadoRef = lerCookieAfiliado()

    try {
      const res = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itens,
          cliente: { ...form, enderecoFormatado },
          total: totalComDesconto,
          frete: freteSelecionado,
          cupom: cupomAplicado,
          afiliadoRef,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro ?? 'Erro ao gerar PIX')
      setPixData(data)
      setFase('pix')
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setCarregando(false)
    }
  }

  function copiarCodigo() {
    if (!pixData?.qrCode) return
    navigator.clipboard.writeText(pixData.qrCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  const minutos = String(Math.floor(segundos / 60)).padStart(2,'0')
  const segs    = String(segundos % 60).padStart(2,'0')

  // ── Carrinho vazio ─────────────────────────────────────────
  if (itens.length === 0 && fase === 'form') return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <ShoppingBag size={48} className="mx-auto mb-4 text-[#333]" />
      <p className="text-[#888] mb-4">Seu carrinho está vazio.</p>
      <a href="/" className="btn-gold text-sm px-6 py-2.5 inline-block">Ver perfumes</a>
    </div>
  )

  // ── Aprovado ───────────────────────────────────────────────
  if (fase === 'aprovado') return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle size={72} className="mx-auto mb-6 text-green-400" />
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">PIX confirmado! 🎉</h1>
      <p className="text-[#888] text-sm mb-2 leading-relaxed">Você receberá a confirmação no e-mail informado em instantes.</p>
      <p className="text-[#888] text-sm mb-8">Entraremos em contato pelo WhatsApp para combinar a entrega.</p>
      <a href="/" className="btn-gold text-sm px-8 py-3 inline-block">Continuar comprando</a>
    </div>
  )

  // ── QR Code PIX ────────────────────────────────────────────
  if (fase === 'pix' && pixData) return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-green-400 font-semibold">Aguardando pagamento</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">Pague com PIX</h1>
        <p className="text-[#888] text-sm">Abra o app do seu banco e escaneie o QR Code</p>
      </div>

      <div className="card-dark p-6 md:p-10 flex flex-col items-center gap-6">
        {pixData.qrCodeBase64 ? (
          <div className="p-4 bg-white rounded-2xl shadow-lg">
            <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-52 h-52 md:w-64 md:h-64" />
          </div>
        ) : (
          <div className="w-52 h-52 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
            <QrCode size={48} className="text-[#444]" />
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-[#888] mb-1">Valor a pagar</p>
          <p className="text-4xl font-black text-[#C9A84C]">{formatPrice(pixData.total)}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#888]">
          <Clock size={14} />
          <span>Expira em <strong className="text-[#F5F5F5]">{minutos}:{segs}</strong></span>
        </div>

        <div className="w-full">
          <p className="text-xs text-[#888] mb-2 font-semibold">PIX Copia e Cola</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-xs text-[#888] font-mono truncate">
              {pixData.qrCode}
            </div>
            <button onClick={copiarCodigo}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex-shrink-0"
              style={{ background: copiado ? '#22c55e' : '#C9A84C', color: copiado ? 'white' : '#0A0A0A' }}>
              {copiado ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
            </button>
          </div>
        </div>

        <div className="w-full rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4 space-y-1.5">
          {['1. Abra o app do seu banco','2. Acesse a área PIX','3. Escolha "Pagar com QR Code" ou "Copia e Cola"','4. Cole o código ou escaneie o QR Code','5. Confirme o pagamento'].map(p => (
            <p key={p} className="text-xs text-[#888]">{p}</p>
          ))}
        </div>
        <p className="text-[11px] text-[#444] text-center">A confirmação é automática. Esta página será atualizada assim que o pagamento for detectado.</p>
      </div>
    </div>
  )

  // ── Formulário ─────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleCheckout} className="space-y-6">

          {/* Dados pessoais */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-4">
              Seus dados
            </h2>
            <div className="space-y-3">
              <input type="text" required placeholder="Nome completo *"
                value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
              <input type="email" required placeholder="E-mail *"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input type="text" required placeholder="CPF *" maxLength={14}
                    value={form.cpf} onChange={e => setForm({...form, cpf: mascaraCPF(e.target.value)})}
                    className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
                  <p className="text-[10px] text-[#555] mt-1">Obrigatório para o PIX</p>
                </div>
                <input type="tel" placeholder="WhatsApp"
                  value={form.telefone} onChange={e => setForm({...form, telefone: mascaraTel(e.target.value)})}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-4 flex items-center gap-2">
              <MapPin size={14} /> Endereço de entrega
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <input type="text" required placeholder="CEP *" maxLength={9}
                  value={form.cep} onChange={e => setForm({...form, cep: mascaraCEP(e.target.value)})}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors pr-10" />
                {buscandoCEP && <Loader2 size={14} className="animate-spin absolute right-3 top-3.5 text-[#C9A84C]" />}
              </div>

              <input type="text" required placeholder="Rua / Avenida *"
                value={form.rua} onChange={e => setForm({...form, rua: e.target.value})}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />

              <div className="grid grid-cols-2 gap-3">
                <input type="text" required placeholder="Número *"
                  value={form.numero} onChange={e => setForm({...form, numero: e.target.value})}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
                <input type="text" placeholder="Complemento"
                  value={form.complemento} onChange={e => setForm({...form, complemento: e.target.value})}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Bairro"
                  value={form.bairro} onChange={e => setForm({...form, bairro: e.target.value})}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
                <input type="text" placeholder="Cidade"
                  value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value})}
                  className="col-span-1 w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
                <input type="text" placeholder="UF" maxLength={2}
                  value={form.estado} onChange={e => setForm({...form, estado: e.target.value.toUpperCase()})}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>
            </div>
          </div>

          {/* Opções de frete */}
          {(freteOpcoes.length > 0 || buscandoFrete) && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-4 flex items-center gap-2">
                <Truck size={14} /> Frete
              </h2>
              {buscandoFrete ? (
                <div className="flex items-center gap-2 text-[#888] text-sm p-4">
                  <Loader2 size={14} className="animate-spin" /> Calculando frete...
                </div>
              ) : (
                <div className="space-y-2">
                  {freteOpcoes.map(op => (
                    <button key={op.id} type="button"
                      onClick={() => setFreteSelecionado(op)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left"
                      style={{
                        background: freteSelecionado?.id === op.id ? '#C9A84C15' : '#111',
                        borderColor: freteSelecionado?.id === op.id ? '#C9A84C60' : '#2A2A2A',
                      }}>
                      <div className="flex items-center gap-3">
                        {op.logo && <img src={op.logo} alt={op.empresa} className="w-8 h-8 object-contain rounded" />}
                        <div>
                          <p className="text-sm font-semibold text-[#F5F5F5]">{op.nome}</p>
                          <p className="text-xs text-[#888]">{op.prazo} {op.prazo === 1 ? 'dia útil' : 'dias úteis'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#C9A84C]">{formatPrice(op.preco)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cupom de desconto */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-4 flex items-center gap-2">
              <Tag size={14} /> Cupom de desconto
            </h2>
            {cupomAplicado ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-green-500/30 bg-green-500/10">
                <div>
                  <p className="text-sm font-bold text-green-400 flex items-center gap-1.5">
                    <Check size={14} /> {cupomAplicado.codigo}
                    {cupomAplicado.afiliado && <span className="text-xs font-normal text-[#888]">· {cupomAplicado.afiliado}</span>}
                  </p>
                  <p className="text-xs text-green-300 mt-0.5">
                    {cupomAplicado.tipo === 'PERCENTUAL' ? `${cupomAplicado.valor}% de desconto` : `R$ ${cupomAplicado.valor.toFixed(2)} de desconto`}
                    {' '}— economizando <strong>{formatPrice(cupomAplicado.desconto)}</strong>
                  </p>
                </div>
                <button type="button" onClick={removerCupom}
                  className="p-1.5 rounded-lg text-[#888] hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={codigoCupom}
                  onChange={e => { setCodigoCupom(e.target.value.toUpperCase()); setCupomErro('') }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), aplicarCupom())}
                  className="flex-1 bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors uppercase"
                />
                <button type="button" onClick={aplicarCupom} disabled={validandoCupom || !codigoCupom.trim()}
                  className="px-4 py-3 rounded-lg text-sm font-bold bg-[#1A1A1A] border border-[#2A2A2A] text-[#C9A84C] hover:border-[#C9A84C] transition-colors disabled:opacity-40 shrink-0">
                  {validandoCupom ? <Loader2 size={14} className="animate-spin" /> : 'Aplicar'}
                </button>
              </div>
            )}
            {cupomErro && <p className="text-red-400 text-xs mt-2">{cupomErro}</p>}
          </div>

          {erro && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{erro}</p>
          )}

          <button type="submit" disabled={carregando || !freteSelecionado}
            className="btn-gold w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50">
            {carregando
              ? <><Loader2 size={16} className="animate-spin" /> Gerando PIX...</>
              : <><QrCode size={16} /> Gerar QR Code PIX — {formatPrice(totalComDesconto)}</>
            }
          </button>
          <p className="text-xs text-[#555] text-center">Pagamento 100% seguro via Mercado Pago · PIX aprovado na hora</p>
        </form>

        {/* Resumo */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">Resumo do pedido</h2>
          <div className="card-dark p-5 space-y-4">
            {itens.map(item => (
              <div key={item.variacaoId} className="flex gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1A1A1A] shrink-0">
                  {item.imagem
                    ? <Image src={item.imagem} alt={item.nomeProduto} width={48} height={48} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center text-[#333]"><ShoppingBag size={16} /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F5F5F5] truncate">{item.nomeProduto}</p>
                  <p className="text-xs text-[#888]">{item.nomeVariacao} × {item.quantidade}</p>
                </div>
                <p className="text-sm font-bold text-[#C9A84C] shrink-0">{formatPrice(item.preco * item.quantidade)}</p>
              </div>
            ))}

            <div className="border-t border-[#2A2A2A] pt-3 space-y-2">
              <div className="flex justify-between text-xs text-[#888]">
                <span>Subtotal</span><span>{formatPrice(subtotal())}</span>
              </div>
              {combo && (
                <div className="flex justify-between text-xs text-green-400">
                  <span className="flex items-center gap-1"><Tag size={11} /> {combo.descricao}</span>
                  <span>- {formatPrice(combo.economia)}</span>
                </div>
              )}
              {comboYara && (
                <div className="flex justify-between text-xs text-pink-400">
                  <span className="flex items-center gap-1"><Tag size={11} /> {comboYara.descricao}</span>
                  <span>- {formatPrice(comboYara.economia)}</span>
                </div>
              )}
              {freteSelecionado && (
                <div className="flex justify-between text-xs text-[#888]">
                  <span className="flex items-center gap-1"><Truck size={11} /> {freteSelecionado.nome}</span>
                  <span>{formatPrice(freteSelecionado.preco)}</span>
                </div>
              )}
              {cupomAplicado && (
                <div className="flex justify-between text-xs text-green-400">
                  <span className="flex items-center gap-1"><Tag size={11} /> Cupom {cupomAplicado.codigo}</span>
                  <span>- {formatPrice(cupomAplicado.desconto)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 border-t border-[#2A2A2A]">
                <span className="text-sm font-bold text-[#F5F5F5]">Total</span>
                <div className="text-right">
                  {cupomAplicado && <p className="text-xs text-[#555] line-through">{formatPrice(totalComFrete)}</p>}
                  <span className="text-xl font-bold text-[#C9A84C]">{formatPrice(totalComDesconto)}</span>
                </div>
              </div>
            </div>
          </div>

          {!freteSelecionado && (
            <div className="p-4 rounded-xl border border-[#2A2A2A] bg-[#111] flex items-center gap-3 text-[#888]">
              <ChevronRight size={14} className="text-[#C9A84C] shrink-0" />
              <p className="text-xs">Digite seu CEP para calcular o frete automaticamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
