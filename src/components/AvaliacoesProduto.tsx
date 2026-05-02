'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

type Avaliacao = {
  id: string
  nome: string
  nota: number
  comentario: string | null
  criadoEm: string
}

type Props = {
  produtoId: string
  avaliacoes: Avaliacao[]
  mediaNotas: number
  totalAvaliacoes: number
}

function Estrelas({ nota, size = 14, interativa = false, onChange }: {
  nota: number
  size?: number
  interativa?: boolean
  onChange?: (n: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          onClick={() => interativa && onChange?.(n)}
          onMouseEnter={() => interativa && setHover(n)}
          onMouseLeave={() => interativa && setHover(0)}
          className={`transition-colors ${interativa ? 'cursor-pointer' : ''}
            ${n <= (hover || nota) ? 'fill-[#C9A84C] text-[#C9A84C]' : 'fill-transparent text-[#444]'}
          `}
        />
      ))}
    </div>
  )
}

export default function AvaliacoesProduto({ produtoId, avaliacoes, mediaNotas, totalAvaliacoes }: Props) {
  const [nota, setNota] = useState(5)
  const [nome, setNome] = useState('')
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setErro('Informe seu nome.'); return }
    setLoading(true); setErro('')
    try {
      const res = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoId, nome, nota, comentario }),
      })
      const data = await res.json()
      if (data.erro) { setErro(data.erro); return }
      setEnviado(true)
    } catch {
      setErro('Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const distribuicao = [5, 4, 3, 2, 1].map((n) => ({
    nota: n,
    count: avaliacoes.filter((a) => a.nota === n).length,
    pct: totalAvaliacoes > 0
      ? Math.round((avaliacoes.filter((a) => a.nota === n).length / totalAvaliacoes) * 100)
      : 0,
  }))

  return (
    <section className="mt-16 border-t border-[#2A2A2A] pt-12">
      <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-8 flex items-center gap-2">
        <Star size={15} />
        Avaliações dos clientes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Resumo */}
        <div>
          {totalAvaliacoes > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-[#C9A84C]">{mediaNotas.toFixed(1)}</span>
                <div>
                  <Estrelas nota={Math.round(mediaNotas)} size={18} />
                  <p className="text-xs text-[#555] mt-1">{totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {distribuicao.map(({ nota: n, count, pct }) => (
                  <div key={n} className="flex items-center gap-2 text-xs">
                    <span className="text-[#555] w-4">{n}</span>
                    <Star size={10} className="text-[#C9A84C] fill-[#C9A84C] shrink-0" />
                    <div className="flex-1 bg-[#1A1A1A] rounded-full h-1.5">
                      <div className="bg-[#C9A84C] h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[#555] w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[#555]">
              <Star size={32} className="mx-auto mb-3 text-[#333]" />
              <p className="text-sm">Seja o primeiro a avaliar!</p>
            </div>
          )}

          {/* Lista de avaliações */}
          {avaliacoes.length > 0 && (
            <div className="mt-6 space-y-4 max-h-80 overflow-y-auto pr-2">
              {avaliacoes.map((av) => (
                <div key={av.id} className="p-4 rounded-xl bg-[#111] border border-[#2A2A2A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#F5F5F5]">{av.nome}</span>
                    <Estrelas nota={av.nota} size={12} />
                  </div>
                  {av.comentario && <p className="text-xs text-[#888] leading-relaxed">{av.comentario}</p>}
                  <p className="text-[10px] text-[#444] mt-2">
                    {new Date(av.criadoEm).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulário */}
        <div>
          <h3 className="text-sm font-bold text-[#F5F5F5] mb-4">Deixe sua avaliação</h3>
          {enviado ? (
            <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
              <p className="text-green-400 font-semibold text-sm mb-1">Avaliação enviada!</p>
              <p className="text-xs text-[#888]">Será publicada após revisão. Obrigado!</p>
            </div>
          ) : (
            <form onSubmit={enviar} className="space-y-4">
              <div>
                <label className="block text-xs text-[#888] mb-2">Sua nota *</label>
                <Estrelas nota={nota} size={24} interativa onChange={setNota} />
              </div>
              <div>
                <label className="block text-xs text-[#888] mb-1.5">Seu nome *</label>
                <input
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Maria S."
                  maxLength={100}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#888] mb-1.5">Comentário (opcional)</label>
                <textarea
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  placeholder="Conte sobre o perfume, fixação, projeção..."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                />
              </div>
              {erro && <p className="text-xs text-red-400">{erro}</p>}
              <button type="submit" disabled={loading} className="btn-gold text-sm">
                {loading ? 'Enviando...' : 'Enviar avaliação'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
