'use client'

import { useEffect, useRef } from 'react'
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'

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

// Inicializa o SDK uma única vez
let sdkIniciado = false

export default function CartaoForm({ total, onSuccess, onError, dadosPedido }: CartaoFormProps) {
  const dadosRef = useRef(dadosPedido)
  dadosRef.current = dadosPedido // sempre atualizado sem re-render

  useEffect(() => {
    if (sdkIniciado) return
    const key = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
    if (!key) { onError('NEXT_PUBLIC_MP_PUBLIC_KEY não configurada no Vercel.'); return }
    initMercadoPago(key, { locale: 'pt-BR' })
    sdkIniciado = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSubmit(formData: any) {
    const res = await fetch('/api/pagamento-cartao', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, ...dadosRef.current }),
    })

    const data = await res.json()

    if (!res.ok || data.erro) {
      // Lançar erro faz o Brick mostrar a mensagem de erro internamente
      throw new Error(data.erro ?? 'Erro ao processar pagamento')
    }

    if (data.status === 'APROVADO' || data.status === 'PENDENTE') {
      onSuccess(data.pedidoId)
    } else {
      throw new Error('Pagamento recusado. Verifique os dados ou tente outro cartão.')
    }
  }

  if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
    return (
      <div className="p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 text-xs text-yellow-400">
        Configure a variável <code>NEXT_PUBLIC_MP_PUBLIC_KEY</code> no Vercel para habilitar o pagamento por cartão.
      </div>
    )
  }

  return (
    <div className="mp-brick-wrapper">
      <CardPayment
        initialization={{ amount: total }}
        customization={{
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                // Cores do tema Start One
                baseColor:               '#C9A84C',
                baseColorFirstVariant:   '#d4b560',
                baseColorSecondVariant:  '#a88835',
                // Textos
                textPrimaryColor:        '#F5F5F5',
                textSecondaryColor:      '#888888',
                textErrorColor:          '#f87171',
                // Inputs
                inputBackgroundColor:    '#111111',
                inputFocusedBorderColor: '#C9A84C',
                inputErrorBorderColor:   '#f87171',
                // Fundo do form
                formBackgroundColor:     '#0A0A0A',
                // Borda
                borderRadiusMedium:      '8px',
                borderRadiusLarge:       '12px',
              },
            },
          },
          paymentMethods: {
            maxInstallments: 12,
          },
        }}
        onSubmit={handleSubmit}
        onError={(err) => {
          console.error('[MP Brick error]', err)
          onError('Erro no formulário de cartão. Verifique os dados.')
        }}
      />
      <p className="text-[10px] text-[#555] text-center mt-3">
        🔒 Dados processados com segurança pelo Mercado Pago. Não armazenamos dados do cartão.
        <br />Juros e encargos de parcelamento são do emissor do cartão.
      </p>
    </div>
  )
}
