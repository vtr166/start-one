'use client'

import { useState, useTransition } from 'react'
import { Plus, Download, Loader2 } from 'lucide-react'
import BannerForm from './BannerForm'
import BannerCard from './BannerCard'
import { importarBannersPadrao } from './actions'

type Banner = {
  id: string; badge: string | null; titulo1: string; titulo2: string
  subtitulo: string | null; imagemUrl: string; acento: string; glow: string; overlay: string
  ctaLabel: string | null; ctaHref: string | null; ctaSecLabel: string | null; ctaSecHref: string | null
  stat1n: string | null; stat1label: string | null; stat2n: string | null; stat2label: string | null
  stat3n: string | null; stat3label: string | null; ativo: boolean; ordem: number
}

export default function BannersPageClient({ banners }: { banners: Banner[] }) {
  const [criando, setCriando] = useState(false)
  const [isPending, startTransition] = useTransition()

  function importar() {
    startTransition(async () => {
      await importarBannersPadrao()
    })
  }

  return (
    <>
      <div className="flex gap-3 mb-6">
        {!criando && (
          <button onClick={() => setCriando(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold hover:brightness-110 transition-all">
            <Plus size={15} /> Novo Banner
          </button>
        )}
        {banners.length === 0 && !criando && (
          <button onClick={importar} disabled={isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-bold hover:bg-[#C9A84C]/10 transition-all disabled:opacity-50">
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Importar banners atuais do site
          </button>
        )}
      </div>

      {criando && (
        <div className="mb-6">
          <BannerForm onClose={() => setCriando(false)} />
        </div>
      )}

      {banners.length === 0 && !criando && (
        <div className="card-dark p-12 text-center">
          <p className="text-[#555] text-sm mb-2">Nenhum banner cadastrado ainda.</p>
          <p className="text-[#444] text-xs">Clique em <strong className="text-[#C9A84C]">Importar banners atuais do site</strong> para trazer os 3 banners existentes e editá-los.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(b => <BannerCard key={b.id} banner={b} />)}
      </div>
    </>
  )
}
