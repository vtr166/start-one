'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'

export default function BannerLGPD() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('lgpd_aceito')) {
      setVisivel(true)
    }
  }, [])

  function aceitar() {
    localStorage.setItem('lgpd_aceito', '1')
    setVisivel(false)
  }

  if (!visivel) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-5">
      <div className="max-w-4xl mx-auto bg-[#111] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie size={20} className="text-[#C9A84C] shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs text-[#888] flex-1 leading-relaxed">
          Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar o tráfego.
          Ao continuar, você concorda com nossa{' '}
          <Link href="/privacidade" className="text-[#C9A84C] hover:underline">
            Política de Privacidade
          </Link>
          , conforme a LGPD.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={aceitar}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#b8963e] transition-colors whitespace-nowrap"
          >
            Aceitar
          </button>
          <button
            onClick={() => setVisivel(false)}
            className="p-2 text-[#555] hover:text-[#888] transition-colors"
            title="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
