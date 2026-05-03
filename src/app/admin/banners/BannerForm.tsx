'use client'

import { useState, useRef } from 'react'
import { criarBanner, atualizarBanner } from './actions'
import { Loader2, Upload, X, ChevronDown, ChevronUp } from 'lucide-react'

type BannerData = {
  id?: string; badge: string; titulo1: string; titulo2: string; subtitulo: string
  imagemUrl: string; acento: string; glow: string
  ctaLabel: string; ctaHref: string; ctaSecLabel: string; ctaSecHref: string
  stat1n: string; stat1label: string; stat2n: string; stat2label: string
  stat3n: string; stat3label: string; ordem: string
}

const EMPTY: BannerData = {
  badge: '', titulo1: '', titulo2: '', subtitulo: '', imagemUrl: '',
  acento: '#fde68a', glow: '#d97706',
  ctaLabel: 'Ver produtos', ctaHref: '/', ctaSecLabel: 'Ver decants', ctaSecHref: '/decants',
  stat1n: '', stat1label: '', stat2n: '', stat2label: '', stat3n: '', stat3label: '', ordem: '0',
}

const TEMAS = [
  { nome: '✨ Dourado', acento: '#fde68a', glow: '#d97706' },
  { nome: '🌸 Rosa',   acento: '#fbb6ce', glow: '#ec4899' },
  { nome: '🔵 Azul',   acento: '#93c5fd', glow: '#3b82f6' },
  { nome: '🤍 Prata',  acento: '#f1f5f9', glow: '#94a3b8' },
]

const OVERLAYS: Record<string, string> = {
  '#d97706': 'linear-gradient(100deg,rgba(10,8,0,0.97) 0%,rgba(25,18,0,0.87) 38%,rgba(60,40,0,0.45) 65%,transparent 100%)',
  '#ec4899': 'linear-gradient(100deg,rgba(20,0,16,0.97) 0%,rgba(40,0,30,0.87) 38%,rgba(100,0,60,0.45) 65%,transparent 100%)',
  '#3b82f6': 'linear-gradient(100deg,rgba(0,8,20,0.97) 0%,rgba(0,15,40,0.87) 38%,rgba(0,40,100,0.45) 65%,transparent 100%)',
  '#94a3b8': 'linear-gradient(100deg,rgba(5,5,10,0.97) 0%,rgba(10,10,20,0.87) 38%,rgba(20,20,40,0.45) 65%,transparent 100%)',
}

export default function BannerForm({ initial, onClose }: { initial?: BannerData & { id: string }; onClose?: () => void }) {
  const [form, setForm]       = useState<BannerData>(initial ?? EMPTY)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avancado, setAvancado]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editando = !!initial?.id

  function set(key: keyof BannerData, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  // Upload de imagem para Cloudinary
  async function uploadImagem(file: File) {
    const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) return alert('Cloudinary não configurado.')

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', uploadPreset)
    fd.append('folder', 'startone/banners')

    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) set('imagemUrl', data.secure_url)
      else alert('Erro no upload da imagem.')
    } catch {
      alert('Falha ao enviar imagem.')
    } finally {
      setUploading(false)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const overlay = OVERLAYS[form.glow] ?? OVERLAYS['#d97706']
      const payload = { ...form, ordem: parseInt(form.ordem) || 0, overlay }
      if (editando && initial?.id) await atualizarBanner(initial.id, payload)
      else await criarBanner(payload)
      onClose?.()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar banner')
    } finally { setLoading(false) }
  }

  const inp = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#C9A84C] transition-colors'
  const lbl = 'block text-[10px] text-[#888] mb-1 font-bold uppercase tracking-wider'

  return (
    <form onSubmit={submit} className="card-dark p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#F5F5F5]">{editando ? 'Editar banner' : 'Novo banner'}</h3>
        {onClose && <button type="button" onClick={onClose}><X size={16} className="text-[#555] hover:text-[#F5F5F5]" /></button>}
      </div>

      {/* ── IMAGEM ─────────────────────────────────────── */}
      <div>
        <label className={lbl}>Imagem do banner *</label>

        {/* Preview + botão trocar */}
        {form.imagemUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-[#2A2A2A]">
            <img src={form.imagemUrl} alt="preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-xs font-bold">
                <Upload size={13} /> Trocar imagem
              </button>
              <button type="button" onClick={() => set('imagemUrl', '')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/80 text-white text-xs font-bold">
                <X size={13} /> Remover
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-[#2A2A2A] cursor-pointer hover:border-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all"
          >
            {uploading ? (
              <><Loader2 size={28} className="text-[#C9A84C] animate-spin" /><p className="text-sm text-[#888]">Enviando...</p></>
            ) : (
              <><Upload size={28} className="text-[#555]" /><p className="text-sm text-[#888]"><span className="text-[#C9A84C] font-semibold">Clique para enviar</span> a imagem</p><p className="text-xs text-[#555]">JPG, PNG ou WEBP · Tamanho ideal: 1440×600px</p></>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && uploadImagem(e.target.files[0])} />

        {uploading && form.imagemUrl === '' && (
          <p className="text-xs text-[#C9A84C] mt-1 flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Enviando imagem...</p>
        )}
      </div>

      {/* ── TEMA DE CORES ──────────────────────────────── */}
      <div>
        <label className={lbl}>Cor do tema</label>
        <div className="flex flex-wrap gap-2">
          {TEMAS.map(t => (
            <button key={t.nome} type="button" onClick={() => setForm(f => ({ ...f, acento: t.acento, glow: t.glow }))}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all"
              style={{
                borderColor: form.glow === t.glow ? t.glow : '#2A2A2A',
                color:       form.glow === t.glow ? t.acento : '#888',
                background:  form.glow === t.glow ? `${t.glow}20` : 'transparent',
              }}>
              {t.nome}
            </button>
          ))}
        </div>
      </div>

      {/* ── TEXTOS ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <label className={lbl}>Texto pequeno (topo do banner)</label>
          <input placeholder="Ex: 🌸 Dia das Mães · Oferta Especial" value={form.badge}
            onChange={e => set('badge', e.target.value)} className={inp} />
        </div>
        <div>
          <label className={lbl}>Título principal *</label>
          <input required placeholder="Ex: O perfume que elas não esquecem" value={form.titulo1}
            onChange={e => set('titulo1', e.target.value)} className={inp} />
        </div>
        <div>
          <label className={lbl}>Subtítulo</label>
          <input placeholder="Ex: Lattafa Yara EDP — doce, tropical, fixação de 8h+" value={form.subtitulo}
            onChange={e => set('subtitulo', e.target.value)} className={inp} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Texto do botão</label>
            <input placeholder="Ver produtos" value={form.ctaLabel}
              onChange={e => set('ctaLabel', e.target.value)} className={inp} />
          </div>
          <div>
            <label className={lbl}>Link do botão</label>
            <input placeholder="/produtos" value={form.ctaHref}
              onChange={e => set('ctaHref', e.target.value)} className={inp} />
          </div>
        </div>
      </div>

      {/* ── CONFIGURAÇÕES AVANÇADAS ────────────────────── */}
      <div>
        <button type="button" onClick={() => setAvancado(v => !v)}
          className="flex items-center gap-2 text-xs text-[#555] hover:text-[#888] transition-colors">
          {avancado ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          Configurações avançadas (título linha 2, botão secundário, stats, ordem)
        </button>

        {avancado && (
          <div className="mt-4 space-y-4 pt-4 border-t border-[#1A1A1A]">
            <div>
              <label className={lbl}>Título linha 2 (destaque em cor)</label>
              <input placeholder="Ex: elas não esquecem." value={form.titulo2}
                onChange={e => set('titulo2', e.target.value)} className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Texto botão secundário</label>
                <input placeholder="Ver decants" value={form.ctaSecLabel}
                  onChange={e => set('ctaSecLabel', e.target.value)} className={inp} />
              </div>
              <div>
                <label className={lbl}>Link botão secundário</label>
                <input placeholder="/decants" value={form.ctaSecHref}
                  onChange={e => set('ctaSecHref', e.target.value)} className={inp} />
              </div>
            </div>
            <div>
              <label className={lbl}>Números de destaque (opcional)</label>
              <div className="grid grid-cols-3 gap-3">
                {([['stat1n', 'stat1label'], ['stat2n', 'stat2label'], ['stat3n', 'stat3label']] as const).map(([n, l], i) => (
                  <div key={n} className="space-y-1.5">
                    <input placeholder={['500+', '4.9★', '8h+'][i]} value={form[n]}
                      onChange={e => set(n, e.target.value)} className={inp} />
                    <input placeholder={['pedidos', 'avaliação', 'fixação'][i]} value={form[l]}
                      onChange={e => set(l, e.target.value)} className={inp} />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-32">
              <label className={lbl}>Ordem (0 = primeiro)</label>
              <input type="number" min="0" value={form.ordem}
                onChange={e => set('ordem', e.target.value)} className={inp} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading || uploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all">
          {loading ? <Loader2 size={14} className="animate-spin" /> : null}
          {editando ? 'Salvar alterações' : 'Publicar banner'}
        </button>
        {onClose && (
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#2A2A2A] text-sm text-[#888] hover:text-[#F5F5F5]">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
