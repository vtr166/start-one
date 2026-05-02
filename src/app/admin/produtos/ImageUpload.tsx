'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, GripVertical, ImageIcon } from 'lucide-react'

type Props = {
  imagens: string[]
  onChange: (imagens: string[]) => void
}

export default function ImageUpload({ imagens, onChange }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [enviando, setEnviando] = useState(false)
  const [erros, setErros]       = useState<string[]>([])
  const [drag, setDrag]         = useState(false)
  const [dragOver, setDragOver] = useState<number | null>(null)

  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  async function uploadArquivos(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!cloudName || !uploadPreset) {
      setErros(['Configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET no Vercel.'])
      return
    }

    setEnviando(true)
    setErros([])
    const novasUrls: string[] = []
    const novosErros: string[] = []

    await Promise.all(Array.from(files).map(async (file) => {
      // Valida tipo e tamanho
      if (!file.type.startsWith('image/')) {
        novosErros.push(`${file.name}: não é uma imagem.`)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        novosErros.push(`${file.name}: muito grande (máx 10MB).`)
        return
      }

      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', uploadPreset)
      fd.append('folder', 'startone/produtos')

      try {
        const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
        const data = await res.json()
        if (data.secure_url) {
          novasUrls.push(data.secure_url)
        } else {
          novosErros.push(`${file.name}: erro no upload.`)
        }
      } catch {
        novosErros.push(`${file.name}: falha na conexão.`)
      }
    }))

    onChange([...imagens, ...novasUrls])
    setErros(novosErros)
    setEnviando(false)
  }

  function remover(url: string) {
    onChange(imagens.filter(i => i !== url))
  }

  // Drag-and-drop reorder
  const dragIndex = useRef<number | null>(null)

  function onDragStart(i: number) { dragIndex.current = i }
  function onDragEnter(i: number) { setDragOver(i) }
  function onDragEnd() {
    if (dragIndex.current === null || dragOver === null || dragIndex.current === dragOver) {
      dragIndex.current = null; setDragOver(null); return
    }
    const nova = [...imagens]
    const [item] = nova.splice(dragIndex.current, 1)
    nova.splice(dragOver, 0, item)
    onChange(nova)
    dragIndex.current = null
    setDragOver(null)
  }

  return (
    <div className="space-y-3">
      {/* Zona de drop */}
      <div
        onClick={() => !enviando && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); uploadArquivos(e.dataTransfer.files) }}
        className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all"
        style={{
          borderColor: drag ? '#C9A84C' : '#2A2A2A',
          background:  drag ? '#C9A84C10' : '#0A0A0A',
        }}
      >
        {enviando ? (
          <>
            <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
            <p className="text-sm text-[#888]">Enviando para o Cloudinary...</p>
          </>
        ) : (
          <>
            <Upload size={28} className="text-[#555]" />
            <p className="text-sm text-[#888]">
              <span className="text-[#C9A84C] font-semibold">Clique para selecionar</span> ou arraste as fotos aqui
            </p>
            <p className="text-xs text-[#555]">PNG, JPG, WEBP · até 10MB cada · várias de uma vez</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => uploadArquivos(e.target.files)}
        />
      </div>

      {/* Erros */}
      {erros.length > 0 && (
        <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 space-y-0.5">
          {erros.map((e, i) => <p key={i} className="text-xs text-red-400">{e}</p>)}
        </div>
      )}

      {/* Preview das imagens — arrastar para reordenar */}
      {imagens.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {imagens.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              className="relative group rounded-xl overflow-hidden bg-[#1A1A1A] border transition-all cursor-grab active:cursor-grabbing aspect-square"
              style={{
                borderColor: dragOver === i ? '#C9A84C' : '#2A2A2A',
                opacity:     dragIndex.current === i ? 0.5 : 1,
              }}
            >
              {/* Imagem */}
              {url ? (
                <img src={url} alt={`Imagem ${i + 1}`} className="w-full h-full object-contain p-1" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={24} className="text-[#333]" />
                </div>
              )}

              {/* Badge posição */}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C9A84C] text-[#0A0A0A]">
                  CAPA
                </span>
              )}

              {/* Overlay: ícone arraste + botão remover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <GripVertical size={16} className="text-white/60" />
                <button
                  type="button"
                  onClick={() => remover(url)}
                  className="p-1 rounded-full bg-red-500 text-white hover:bg-red-400 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {imagens.length > 1 && (
        <p className="text-[10px] text-[#555]">
          Arraste as fotos para reordenar · A primeira é a foto principal do produto
        </p>
      )}
    </div>
  )
}
