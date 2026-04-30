import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function FalhaPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <XCircle size={64} className="mx-auto mb-6 text-red-400" />
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">Pagamento não aprovado</h1>
      <p className="text-[#888] text-sm mb-8 leading-relaxed">
        Ocorreu um problema com seu pagamento. Verifique os dados e tente novamente.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/checkout" className="btn-gold text-sm px-6 py-2.5 inline-block">
          Tentar novamente
        </Link>
        <Link href="/" className="btn-outline-gold text-sm px-6 py-2.5 inline-block">
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  )
}
