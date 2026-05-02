'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[ERROR BOUNDARY]', error)
  }, [error])

  return (
    <div className="max-w-lg mx-auto px-4 py-32 text-center">
      <AlertTriangle size={56} className="mx-auto mb-6 text-[#C9A84C]" />
      <h1 className="text-lg font-bold text-[#F5F5F5] mb-2">Algo deu errado</h1>
      <p className="text-sm text-[#555] mb-8">
        Ocorreu um erro inesperado. Tente novamente ou volte para a loja.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={reset} className="btn-gold text-sm px-8 py-3">
          Tentar novamente
        </button>
        <a href="/" className="btn-outline-gold text-sm px-8 py-3">
          Voltar à loja
        </a>
      </div>
    </div>
  )
}
