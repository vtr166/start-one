import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-32 text-center">
      <SearchX size={56} className="mx-auto mb-6 text-[#333]" />
      <h1 className="text-5xl font-black text-[#2A2A2A] mb-4">404</h1>
      <p className="text-lg font-bold text-[#F5F5F5] mb-2">Página não encontrada</p>
      <p className="text-sm text-[#555] mb-8">
        O link que você acessou não existe ou foi removido.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/" className="btn-gold text-sm px-8 py-3">
          Ir para a loja
        </Link>
        <Link href="/pedido/consulta" className="btn-outline-gold text-sm px-8 py-3">
          Consultar pedido
        </Link>
      </div>
    </div>
  )
}
