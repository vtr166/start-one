'use client'

import { useState } from 'react'
import { atualizarStatusPedido } from './actions'
import { Truck, CheckCircle, X, Loader2, ExternalLink } from 'lucide-react'

type Status = 'PENDENTE' | 'APROVADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO' | 'REJEITADO'

export default function AcoesPedido({
  id,
  status,
  codigoRastreio,
}: {
  id: string
  status: Status
  codigoRastreio?: string | null
}) {
  const [carregando, setCarregando]         = useState(false)
  const [mostraRastreio, setMostraRastreio] = useState(false)
  const [codigo, setCodigo]                 = useState('')

  async function atualizar(novoStatus: 'ENVIADO' | 'ENTREGUE' | 'CANCELADO', rastreio?: string) {
    setCarregando(true)
    await atualizarStatusPedido(id, novoStatus, rastreio)
    setCarregando(false)
  }

  async function confirmarEnvio() {
    await atualizar('ENVIADO', codigo || undefined)
    setMostraRastreio(false)
  }

  if (carregando) return (
    <div className="flex items-center gap-2 text-[#888] text-xs">
      <Loader2 size={13} className="animate-spin" /> Atualizando...
    </div>
  )

  return (
    <div className="space-y-3">
      {/* Código de rastreio existente */}
      {codigoRastreio && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#555]">Rastreio:</span>
          <span className="font-mono text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
            {codigoRastreio}
          </span>
          <a
            href={`https://rastreamento.correios.com.br/app/index.php?objeto=${codigoRastreio}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#555] hover:text-[#C9A84C] flex items-center gap-0.5 transition-colors"
          >
            <ExternalLink size={11} /> Ver nos Correios
          </a>
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-2">
        {status === 'APROVADO' && !mostraRastreio && (
          <button
            onClick={() => setMostraRastreio(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Truck size={12} /> Marcar como Enviado
          </button>
        )}

        {status === 'ENVIADO' && (
          <>
            <button
              onClick={() => setMostraRastreio(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1A1A1A] border border-[#2A2A2A] text-[#888] hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-colors"
            >
              <Truck size={12} /> {codigoRastreio ? 'Atualizar rastreio' : 'Adicionar rastreio'}
            </button>
            <button
              onClick={() => atualizar('ENTREGUE')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle size={12} /> Marcar como Entregue
            </button>
          </>
        )}

        {(status === 'APROVADO' || status === 'PENDENTE') && (
          <button
            onClick={() => atualizar('CANCELADO')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <X size={12} /> Cancelar
          </button>
        )}
      </div>

      {/* Input de código de rastreio */}
      {mostraRastreio && (
        <div className="flex gap-2 items-center flex-wrap p-3 rounded-xl bg-[#0A0A0A] border border-blue-500/20">
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ex: AA123456789BR (opcional)"
            className="flex-1 bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#444] focus:outline-none focus:border-[#C9A84C] font-mono transition-colors"
            onKeyDown={e => e.key === 'Enter' && confirmarEnvio()}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={confirmarEnvio}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 transition-colors whitespace-nowrap"
            >
              <Truck size={12} className="inline mr-1" />
              {status === 'APROVADO' ? 'Confirmar envio' : 'Salvar'}
            </button>
            <button
              onClick={() => { setMostraRastreio(false); setCodigo('') }}
              className="px-3 py-2 rounded-lg text-xs text-[#555] hover:text-[#888] border border-[#2A2A2A] transition-colors"
            >
              Cancelar
            </button>
          </div>
          <p className="w-full text-[10px] text-[#555]">
            O código é opcional. Se informado, o cliente recebe e-mail com link de rastreamento.
          </p>
        </div>
      )}
    </div>
  )
}
