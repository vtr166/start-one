'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCarrinho, calcularDescontoDecants, calcularDescontoYara } from '@/store/carrinho'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingBag, Loader2, Tag, Copy, Check, CheckCircle, QrCode, Clock
} from 'lucide-react'
import Image from 'next/image'

type Fase = 'form' | 'pix' | 'aprovado'

type PixData = {
  pedidoId: string
  qrCode: string
  qrCodeBase64: string
  total: number
}

function mascaraCPF(valor: string) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

function mascaraTel(valor: string) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

export default function CheckoutPage() {
  const { itens, subtotal, desconto, total, limpar } = useCarrinho()
  const combo = calcularDescontoDecants(itens)
  const comboYara = calcularDescontoYara(itens)

  const [fase, setFase] = useState<Fase>('form')
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cpf: '' })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [segundos, setSegundos] = useState(30 * 60) // 30 min

  // Countdown do PIX
  useEffect(() => {
    if (fase !== 'pix') return
    const t = setInterval(() => setSegundos(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [fase])

  // Polling de status (a cada 5s)
  const verificarStatus = useCallback(async () => {
    if (!pixData) return
    try {
      const res = await fetch(`/api/pedido-status?id=${pixData.pedidoId}`)
      const data = await res.json()
      if (data.status === 'APROVADO') {
        limpar()
        setFase('aprovado')
      }
    } catch { /* ignora erros de rede */ }
  }, [pixData, limpar])

  useEffect(() => {
    if (fase !== 'pix') return
    const t = setInterval(verificarStatus, 5000)
    return () => clearInterval(t)
  }, [fase, verificarStatus])

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    try {
      const res = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itens, cliente: form, total: total() }),
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

  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0')
  const segs = String(segundos % 60).padStart(2, '0')

  // ── Carrinho vazio ──────────────────────────────────────────
  if (itens.length === 0 && fase === 'form') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-[#333]" />
        <p className="text-[#888] mb-4">Seu carrinho está vazio.</p>
        <a href="/" className="btn-gold text-sm px-6 py-2.5 inline-block">
          Ver perfumes
        </a>
      </div>
    )
  }

  // ── Aprovado ────────────────────────────────────────────────
  if (fase === 'aprovado') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle size={72} className="mx-auto mb-6 text-green-400" />
        <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">PIX confirmado! 🎉</h1>
        <p className="text-[#888] text-sm mb-2 leading-relaxed">
          Seu pagamento foi aprovado. Você receberá a confirmação no e-mail informado.
        </p>
        <p className="text-[#888] text-sm mb-8">
          Em breve entraremos em contato para combinar a entrega.
        </p>
        <a href="/" className="btn-gold text-sm px-8 py-3 inline-block">
          Continuar comprando
        </a>
      </div>
    )
  }

  // ── QR Code PIX ─────────────────────────────────────────────
  if (fase === 'pix' && pixData) {
    return (
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
          {/* QR Code */}
          {pixData.qrCodeBase64 ? (
            <div className="p-4 bg-white rounded-2xl shadow-lg">
              <img
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-52 h-52 md:w-64 md:h-64"
              />
            </div>
          ) : (
            <div className="w-52 h-52 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
              <QrCode size={48} className="text-[#444]" />
            </div>
          )}

          {/* Valor */}
          <div className="text-center">
            <p className="text-xs text-[#888] mb-1">Valor a pagar</p>
            <p className="text-4xl font-black text-[#C9A84C]">{formatPrice(pixData.total)}</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2 text-sm text-[#888]">
            <Clock size={14} />
            <span>Expira em <strong className="text-[#F5F5F5]">{minutos}:{segs}</strong></span>
          </div>

          {/* Copia e Cola */}
          <div className="w-full">
            <p className="text-xs text-[#888] mb-2 font-semibold">PIX Copia e Cola</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-xs text-[#888] font-mono truncate">
                {pixData.qrCode}
              </div>
              <button
                onClick={copiarCodigo}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex-shrink-0"
                style={{
                  background: copiado ? '#22c55e' : '#C9A84C',
                  color: copiado ? 'white' : '#0A0A0A',
                }}
              >
                {copiado ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
              </button>
            </div>
          </div>

          {/* Instrução */}
          <div className="w-full rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4 space-y-2">
            {[
              '1. Abra o app do seu banco',
              '2. Acesse a área PIX',
              '3. Escolha "Pagar com QR Code" ou "Copia e Cola"',
              '4. Cole o código ou escaneie o QR Code',
              '5. Confirme o pagamento',
            ].map((passo) => (
              <p key={passo} className="text-xs text-[#888]">{passo}</p>
            ))}
          </div>

          <p className="text-[11px] text-[#444] text-center">
            A confirmação é automática. Esta página será atualizada assim que o pagamento for detectado.
          </p>
        </div>
      </div>
    )
  }

  // ── Formulário ──────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário */}
        <form onSubmit={handleCheckout} className="space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">
            Seus dados
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#888] mb-1.5">Nome completo *</label>
              <input
                type="text" required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5">E-mail *</label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5">CPF *</label>
              <input
                type="text" required
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: mascaraCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
              <p className="text-[10px] text-[#555] mt-1">Obrigatório para gerar o PIX via Mercado Pago</p>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1.5">WhatsApp</label>
              <input
                type="tel"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: mascaraTel(e.target.value) })}
                placeholder="(11) 99999-9999"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>
          </div>

          {erro && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              {erro}
            </p>
          )}

          <button
            type="submit" disabled={carregando}
            className="btn-gold w-full flex items-center justify-center gap-2 py-4"
          >
            {carregando ? (
              <><Loader2 size={16} className="animate-spin" /> Gerando PIX...</>
            ) : (
              <><QrCode size={16} /> Gerar QR Code PIX — {formatPrice(total())}</>
            )}
          </button>

          <p className="text-xs text-[#555] text-center">
            Pagamento 100% seguro via Mercado Pago · PIX aprovado na hora
          </p>
        </form>

        {/* Resumo do pedido */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-5">
            Resumo do pedido
          </h2>
          <div className="card-dark p-5 space-y-4">
            {itens.map((item) => (
              <div key={item.variacaoId} className="flex gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1A1A1A] shrink-0">
                  {item.imagem ? (
                    <Image src={item.imagem} alt={item.nomeProduto} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#333]">
                      <ShoppingBag size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F5F5F5] truncate">{item.nomeProduto}</p>
                  <p className="text-xs text-[#888]">{item.nomeVariacao} × {item.quantidade}</p>
                </div>
                <p className="text-sm font-bold text-[#C9A84C] shrink-0">
                  {formatPrice(item.preco * item.quantidade)}
                </p>
              </div>
            ))}

            <div className="border-t border-[#2A2A2A] pt-3 space-y-2">
              <div className="flex justify-between text-xs text-[#888]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
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
              <div className="flex justify-between items-center pt-1 border-t border-[#2A2A2A]">
                <span className="text-sm font-bold text-[#F5F5F5]">Total</span>
                <span className="text-xl font-bold text-[#C9A84C]">{formatPrice(total())}</span>
              </div>
            </div>
          </div>

          {/* Info PIX */}
          <div className="mt-4 p-4 rounded-xl border border-[#2A2A2A] bg-[#111] space-y-2">
            <p className="text-xs font-bold text-[#F5F5F5]">💡 Como funciona o PIX</p>
            <p className="text-xs text-[#888] leading-relaxed">
              Após clicar em "Gerar QR Code", um código PIX será gerado. Basta escanear no app do seu banco.
              A confirmação é automática e instantânea.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
