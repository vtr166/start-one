'use client'

import { useEffect, useRef } from 'react'

type CartaoFormProps = {
  total: number
  onSuccess: (pedidoId: string) => void
  onError: (msg: string) => void
  dadosPedido: {
    itens: unknown[]
    cliente: unknown
    frete: unknown
    cupom: unknown
    afiliadoRef: string | null
  }
}

/**
 * Formulário de cartão usando o SDK JS do Mercado Pago (CardForm).
 * Lida com tokenização, parcelamento e envio ao nosso backend.
 */
export default function CartaoForm({ total, onSuccess, onError, dadosPedido }: CartaoFormProps) {
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
    if (!publicKey) {
      onError('Chave pública do Mercado Pago não configurada (NEXT_PUBLIC_MP_PUBLIC_KEY).')
      return
    }

    // Carrega o SDK do MP dinamicamente
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = () => inicializar(publicKey)
    document.head.appendChild(script)

    return () => {
      // Cleanup: remove o script se o componente for desmontado antes de carregar
      try { document.head.removeChild(script) } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function inicializar(publicKey: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mp = new (window as any).MercadoPago(publicKey, { locale: 'pt-BR' })

    const cardForm = mp.cardForm({
      amount: String(total.toFixed(2)),
      iframe:  true,
      form: {
        id: 'mp-card-form',
        cardNumber:           { id: 'mp-cardNumber',           placeholder: 'Número do cartão' },
        expirationDate:       { id: 'mp-expirationDate',       placeholder: 'MM/AA' },
        securityCode:         { id: 'mp-securityCode',         placeholder: 'CVV' },
        cardholderName:       { id: 'mp-cardholderName',       placeholder: 'Nome no cartão' },
        issuer:               { id: 'mp-issuer' },
        installments:         { id: 'mp-installments' },
        identificationType:   { id: 'mp-identificationType' },
        identificationNumber: { id: 'mp-identificationNumber', placeholder: 'CPF do titular' },
        cardholderEmail:      { id: 'mp-cardholderEmail',      placeholder: 'E-mail' },
      },
      callbacks: {
        onFormMounted: (err: unknown) => { if (err) console.warn('[MP] Form mount error:', err) },
        onSubmit: async (e: Event) => {
          e.preventDefault()
          const btn = document.getElementById('mp-submit') as HTMLButtonElement
          if (btn) { btn.disabled = true; btn.textContent = 'Processando...' }

          try {
            const {
              paymentMethodId, issuerId, cardholderEmail,
              amount, token, installments,
              identificationNumber, identificationType,
            } = cardForm.getCardFormData()

            const res = await fetch('/api/pagamento-cartao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token,
                payment_method_id:  paymentMethodId,
                issuer_id:          issuerId,
                installments:       Number(installments),
                transaction_amount: Number(amount),
                payer: {
                  email: cardholderEmail,
                  identification: { type: identificationType, number: identificationNumber },
                },
                ...dadosPedido,
              }),
            })

            const data = await res.json()
            if (!res.ok || data.erro) throw new Error(data.erro ?? 'Erro ao processar')

            if (data.status === 'APROVADO') {
              onSuccess(data.pedidoId)
            } else if (data.status === 'REJEITADO') {
              onError(traduzirRecusa(data.statusDetail))
              if (btn) { btn.disabled = false; btn.textContent = 'Pagar com cartão' }
            } else {
              // PENDENTE — pagamento em análise
              onSuccess(data.pedidoId)
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erro inesperado'
            onError(msg)
            if (btn) { btn.disabled = false; btn.textContent = 'Pagar com cartão' }
          }
        },
      },
    })
  }

  return (
    <form id="mp-card-form" className="space-y-4">
      {/* Número do cartão */}
      <div>
        <label className="block text-xs text-[#888] mb-1.5">Número do cartão</label>
        <div id="mp-cardNumber"
          className="w-full h-10 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 focus-within:border-[#C9A84C] transition-colors" />
      </div>

      {/* Titular + CPF */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#888] mb-1.5">Nome no cartão</label>
          <div id="mp-cardholderName"
            className="w-full h-10 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 focus-within:border-[#C9A84C] transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-[#888] mb-1.5">CPF do titular</label>
          <div id="mp-identificationNumber"
            className="w-full h-10 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 focus-within:border-[#C9A84C] transition-colors" />
        </div>
      </div>

      {/* Validade + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#888] mb-1.5">Validade</label>
          <div id="mp-expirationDate"
            className="w-full h-10 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 focus-within:border-[#C9A84C] transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-[#888] mb-1.5">CVV</label>
          <div id="mp-securityCode"
            className="w-full h-10 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 focus-within:border-[#C9A84C] transition-colors" />
        </div>
      </div>

      {/* Parcelas */}
      <div>
        <label className="block text-xs text-[#888] mb-1.5">Parcelas</label>
        <div id="mp-installments"
          className="w-full h-10 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 focus-within:border-[#C9A84C] transition-colors" />
      </div>

      {/* E-mail + campos ocultos */}
      <div id="mp-cardholderEmail" className="hidden" />
      <div id="mp-issuer" className="hidden" />
      <div id="mp-identificationType" className="hidden" />

      <button
        id="mp-submit"
        type="submit"
        className="btn-gold w-full flex items-center justify-center gap-2 text-sm mt-2"
      >
        Pagar com cartão
      </button>

      <p className="text-[10px] text-[#555] text-center">
        Seus dados de cartão são processados com segurança pelo Mercado Pago. Não armazenamos nenhuma informação do cartão.
      </p>
    </form>
  )
}

// Traduz os códigos de recusa do MP para mensagens amigáveis
function traduzirRecusa(detail: string): string {
  const map: Record<string, string> = {
    cc_rejected_insufficient_amount: 'Saldo insuficiente no cartão.',
    cc_rejected_bad_filled_card_number: 'Número do cartão incorreto.',
    cc_rejected_bad_filled_date: 'Data de validade incorreta.',
    cc_rejected_bad_filled_security_code: 'Código de segurança (CVV) incorreto.',
    cc_rejected_blacklist: 'Cartão recusado. Entre em contato com o banco.',
    cc_rejected_call_for_authorize: 'Ligue para o banco para autorizar este pagamento.',
    cc_rejected_card_disabled: 'Cartão desativado. Entre em contato com o banco.',
    cc_rejected_duplicated_payment: 'Pagamento duplicado detectado.',
    cc_rejected_high_risk: 'Pagamento recusado por segurança. Tente outro cartão.',
    cc_rejected_max_attempts: 'Número máximo de tentativas atingido. Tente novamente amanhã.',
  }
  return map[detail] ?? 'Pagamento recusado pelo banco. Verifique os dados ou tente outro cartão.'
}
