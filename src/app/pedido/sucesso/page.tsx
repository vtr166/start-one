'use client'

import { useEffect } from 'react'
import { useCarrinho } from '@/store/carrinho'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SucessoPage() {
  const { limpar } = useCarrinho()

  useEffect(() => {
    limpar()
  }, [limpar])

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle size={64} className="mx-auto mb-6 text-[#C9A84C]" />
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">Pedido confirmado!</h1>
      <p className="text-[#888] text-sm mb-8 leading-relaxed">
        Seu pagamento foi aprovado. Você receberá a confirmação no e-mail informado.
        Em breve entraremos em contato para combinar a entrega.
      </p>
      <Link href="/" className="btn-gold text-sm px-8 py-3 inline-block">
        Continuar comprando
      </Link>
    </div>
  )
}
