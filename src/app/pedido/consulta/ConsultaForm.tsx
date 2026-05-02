'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

function mascaraCPF(v: string) {
  return v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').slice(0,14)
}

export default function ConsultaForm({
  idInicial,
  cpfInicial,
}: {
  idInicial?: string
  cpfInicial?: string
}) {
  const router = useRouter()
  const [id, setId]   = useState(idInicial ?? '')
  const [cpf, setCpf] = useState(cpfInicial ?? '')
  const [erro, setErro] = useState('')

  function buscar(e: React.FormEvent) {
    e.preventDefault()
    const idLimpo  = id.trim()
    const cpfLimpo = cpf.replace(/\D/g, '')

    if (!idLimpo && !cpfLimpo) {
      setErro('Informe o número do pedido ou o CPF.')
      return
    }
    setErro('')
    const params = new URLSearchParams()
    if (idLimpo)  params.set('id', idLimpo)
    if (cpfLimpo) params.set('cpf', cpfLimpo)
    router.push(`/pedido/consulta?${params.toString()}`)
  }

  const input = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-3 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors'

  return (
    <form onSubmit={buscar} className="card-dark p-6 space-y-4">

      <div>
        <label className="block text-xs text-[#888] mb-1.5 font-semibold uppercase tracking-wider">
          Número do pedido
        </label>
        <input
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Ex: ABC123"
          className={input}
        />
        <p className="text-[10px] text-[#444] mt-1">
          Está no e-mail de confirmação que você recebeu.
        </p>
      </div>

      <div className="flex items-center gap-3 text-[#444]">
        <div className="flex-1 h-px bg-[#2A2A2A]" />
        <span className="text-xs">ou</span>
        <div className="flex-1 h-px bg-[#2A2A2A]" />
      </div>

      <div>
        <label className="block text-xs text-[#888] mb-1.5 font-semibold uppercase tracking-wider">
          CPF usado na compra
        </label>
        <input
          value={cpf}
          onChange={e => setCpf(mascaraCPF(e.target.value))}
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
          className={input}
        />
      </div>

      {erro && <p className="text-red-400 text-xs">{erro}</p>}

      <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 py-3 text-sm">
        <Search size={15} />
        Consultar pedido
      </button>
    </form>
  )
}
