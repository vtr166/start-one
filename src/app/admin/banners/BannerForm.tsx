'use client'

import { useState } from 'react'
import { criarBanner, atualizarBanner } from './actions'
import { Loader2, Plus, X } from 'lucide-react'

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
  { nome: '🌸 Rosa (Feminino)',  acento: '#fbb6ce', glow: '#ec4899', overlay: 'linear-gradient(100deg,rgba(20,0,16,0.97) 0%,rgba(40,0,30,0.87) 38%,rgba(100,0,60,0.45) 65%,transparent 100%)' },
  { nome: '🔵 Azul (Masculino)', acento: '#93c5fd', glow: '#3b82f6', overlay: 'linear-gradient(100deg,rgba(0,8,20,0.97) 0%,rgba(0,15,40,0.87) 38%,rgba(0,40,100,0.45) 65%,transparent 100%)' },
  { nome: '✨ Dourado (Premium)', acento: '#fde68a', glow: '#d97706', overlay: 'linear-gradient(100deg,rgba(10,8,0,0.97) 0%,rgba(25,18,0,0.87) 38%,rgba(60,40,0,0.45) 65%,transparent 100%)' },
  { nome: '🤍 Branco (Claro)',   acento: '#f1f5f9', glow: '#94a3b8', overlay: 'linear-gradient(100deg,rgba(5,5,10,0.97) 0%,rgba(10,10,20,0.87) 38%,rgba(20,20,40,0.45) 65%,transparent 100%)' },
]

export default function BannerForm({ initial, onClose }: { initial?: BannerData & { id: string }; onClose?: () => void }) {
  const [form, setForm]   = useState<BannerData>(initial ?? EMPTY)
  const [loading, setLoading] = useState(false)
  const editando = !!initial?.id

  function set(key: keyof BannerData, val: string) { setForm(f => ({ ...f, [key]: val })) }

  function aplicarTema(t: typeof TEMAS[0]) {
    setForm(f => ({ ...f, acento: t.acento, glow: t.glow }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const overlay = TEMAS.find(t => t.glow === form.glow)?.overlay ?? TEMAS[2].overlay
      const payload = { ...form, ordem: parseInt(form.ordem) || 0, overlay }
      if (editando && initial?.id) {
        await atualizarBanner(initial.id, payload)
      } else {
        await criarBanner(payload)
      }
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

      {/* Tema rápido */}
      <div>
        <label className={lbl}>Tema de cores</label>
        <div className="flex flex-wrap gap-2">
          {TEMAS.map(t => (
            <button key={t.nome} type="button" onClick={() => aplicarTema(t)}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:border-[#C9A84C]"
              style={{
                borderColor: form.glow === t.glow ? t.glow : '#2A2A2A',
                color: form.glow === t.glow ? t.acento : '#888',
                background: form.glow === t.glow ? `${t.glow}15` : 'transparent',
              }}>
              {t.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Imagem */}
      <div>
        <label className={lbl}>URL da imagem de fundo *</label>
        <input required placeholder="https://images.unsplash.com/photo-..." value={form.imagemUrl}
          onChange={e => set('imagemUrl', e.target.value)} className={inp} />
        <p className="text-[10px] text-[#555] mt-1">
          Use fotos do Unsplash (unsplash.com), Google Drive (link público) ou qualquer URL de imagem.
          Tamanho ideal: 1440×600px. Formato: JPG ou PNG.
        </p>
        {form.imagemUrl && (
          <img src={form.imagemUrl} alt="preview" className="mt-2 h-28 w-full object-cover rounded-lg opacity-60" />
        )}
      </div>

      {/* Textos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Badge (linha pequena acima) *</label>
          <input required placeholder="🌸 Dia das Mães · Oferta Especial" value={form.badge}
            onChange={e => set('badge', e.target.value)} className={inp} />
        </div>
        <div>
          <label className={lbl}>Ordem (0 = primeiro)</label>
          <input type="number" min="0" value={form.ordem}
            onChange={e => set('ordem', e.target.value)} className={inp} />
        </div>
        <div>
          <label className={lbl}>Título linha 1 *</label>
          <input required placeholder="O perfume que" value={form.titulo1}
            onChange={e => set('titulo1', e.target.value)} className={inp} />
        </div>
        <div>
          <label className={lbl}>Título linha 2 (destaque) *</label>
          <input required placeholder="elas não esquecem." value={form.titulo2}
            onChange={e => set('titulo2', e.target.value)} className={inp} />
        </div>
        <div className="md:col-span-2">
          <label className={lbl}>Subtítulo</label>
          <input placeholder="Lattafa Yara EDP — doce, tropical, fixação de 8h+." value={form.subtitulo}
            onChange={e => set('subtitulo', e.target.value)} className={inp} />
        </div>
      </div>

      {/* Botões CTA */}
      <div>
        <label className={lbl}>Botões de ação</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="Texto botão principal" value={form.ctaLabel}
            onChange={e => set('ctaLabel', e.target.value)} className={inp} />
          <input placeholder="Link botão principal (ex: /produto/yara)" value={form.ctaHref}
            onChange={e => set('ctaHref', e.target.value)} className={inp} />
          <input placeholder="Texto botão secundário" value={form.ctaSecLabel}
            onChange={e => set('ctaSecLabel', e.target.value)} className={inp} />
          <input placeholder="Link botão secundário (ex: /decants)" value={form.ctaSecHref}
            onChange={e => set('ctaSecHref', e.target.value)} className={inp} />
        </div>
      </div>

      {/* Stats */}
      <div>
        <label className={lbl}>Números de destaque (opcional — aparece embaixo dos botões)</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: 'stat1n' as const, l: 'stat1label' as const, ph: '+500 · pedidos entregues' },
            { n: 'stat2n' as const, l: 'stat2label' as const, ph: '4.9★ · avaliação média' },
            { n: 'stat3n' as const, l: 'stat3label' as const, ph: '8h+ · fixação garantida' },
          ].map(({ n, l, ph }) => (
            <div key={n} className="space-y-1.5">
              <input placeholder={ph.split('·')[0].trim()} value={form[n]}
                onChange={e => set(n, e.target.value)} className={inp} />
              <input placeholder={ph.split('·')[1].trim()} value={form[l]}
                onChange={e => set(l, e.target.value)} className={inp} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A0A0A] text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
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
