'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function ConsultaForm({
  idInicial,
  emailInicial,
}: {
  idInicial?: string
  emailInicial?: string
}) {
  const router = useRouter()
  const [id, setId]       = useState(idInicial ?? '')
  const [email, setEmail] = useState(emailInicial ?? '')

  function buscar(e: React.FormEvent) {
    e.preventDefault()
    if (!id.trim() || !email.trim()) return
    router.push(`/pedido/consulta?id=${encodeURIComponent(id.trim())}&email=${encodeURIComponent(email.trim())}`)
  }

  const input = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors'

  return (
    <form onSubmit={buscar} className="card-dark p-6 space-y-4">
      <div>
        <label className="block text-xs text-[#888] mb-1.5 font-semibold uppercase tracking-wider">
          Código do pedido
        </label>
        <input
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Ex: ABC123 ou ID completo"
          required
          className={input}
        />
        <p className="text-[10px] text-[#444] mt-1">
          Está no e-mail de confirmação que você recebeu.
        </p>
      </div>
      <div>
        <label className="block text-xs text-[#888] mb-1.5 font-semibold uppercase tracking-wider">
          E-mail usado na compra
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
          required
          className={input}
        />
      </div>
      <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 py-3 text-sm">
        <Search size={15} />
        Consultar pedido
      </button>
    </form>
  )
}
