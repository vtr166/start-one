'use client'

import { useState } from 'react'
import { atualizarBanner, deletarBanner } from './actions'
import BannerForm from './BannerForm'
import { Pencil, Trash2, Eye, EyeOff, Loader2, GripVertical } from 'lucide-react'

type Banner = {
  id: string; badge: string | null; titulo1: string; titulo2: string
  subtitulo: string | null; imagemUrl: string; acento: string; glow: string; overlay: string
  ctaLabel: string | null; ctaHref: string | null; ctaSecLabel: string | null; ctaSecHref: string | null
  stat1n: string | null; stat1label: string | null; stat2n: string | null; stat2label: string | null
  stat3n: string | null; stat3label: string | null; ativo: boolean; ordem: number
}

export default function BannerCard({ banner }: { banner: Banner }) {
  const [editando, setEditando] = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function toggle() {
    setLoading(true)
    await atualizarBanner(banner.id, { ativo: !banner.ativo })
    setLoading(false)
  }

  async function deletar() {
    if (!confirm(`Deletar banner "${banner.titulo1} ${banner.titulo2}"?`)) return
    setLoading(true)
    await deletarBanner(banner.id)
    setLoading(false)
  }

  if (editando) return (
    <BannerForm
      initial={{
        id: banner.id,
        badge:      banner.badge      ?? '',
        titulo1:    banner.titulo1,
        titulo2:    banner.titulo2,
        subtitulo:  banner.subtitulo  ?? '',
        imagemUrl:  banner.imagemUrl,
        acento:     banner.acento,
        glow:       banner.glow,
        ctaLabel:   banner.ctaLabel   ?? '',
        ctaHref:    banner.ctaHref    ?? '',
        ctaSecLabel: banner.ctaSecLabel ?? '',
        ctaSecHref: banner.ctaSecHref ?? '',
        stat1n:     banner.stat1n     ?? '',
        stat1label: banner.stat1label ?? '',
        stat2n:     banner.stat2n     ?? '',
        stat2label: banner.stat2label ?? '',
        stat3n:     banner.stat3n     ?? '',
        stat3label: banner.stat3label ?? '',
        ordem:      String(banner.ordem),
      }}
      onClose={() => setEditando(false)}
    />
  )

  return (
    <div className={`card-dark overflow-hidden transition-opacity ${banner.ativo ? '' : 'opacity-50'}`}>
      {/* Preview imagem */}
      <div className="relative h-32 overflow-hidden">
        <img src={banner.imagemUrl} alt={banner.titulo1} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: banner.overlay }} />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          {banner.badge && <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: banner.acento }}>{banner.badge}</p>}
          <p className="text-sm font-black text-white leading-tight">{banner.titulo1}</p>
          <p className="text-sm font-black leading-tight" style={{ color: banner.acento }}>{banner.titulo2}</p>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${banner.ativo ? 'bg-green-500 text-white' : 'bg-[#444] text-[#888]'}`}>
            {banner.ativo ? 'ATIVO' : 'INATIVO'}
          </span>
          <span className="text-[9px] font-mono bg-black/60 text-[#888] px-2 py-0.5 rounded-full">#{banner.ordem}</span>
        </div>
        <div className="absolute top-2 left-2 cursor-grab">
          <GripVertical size={14} className="text-white/40" />
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 p-3 border-t border-[#1a1a1a]">
        <button onClick={() => setEditando(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#888] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
          <Pencil size={11} /> Editar
        </button>
        {loading
          ? <Loader2 size={13} className="animate-spin text-[#888]" />
          : <>
            <button onClick={toggle}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#888] hover:text-white transition-colors">
              {banner.ativo ? <EyeOff size={11} /> : <Eye size={11} />}
              {banner.ativo ? 'Ocultar' : 'Publicar'}
            </button>
            <button onClick={deletar}
              className="ml-auto p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-colors">
              <Trash2 size={13} />
            </button>
          </>
        }
      </div>
    </div>
  )
}
