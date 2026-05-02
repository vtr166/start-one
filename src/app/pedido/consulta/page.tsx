export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import ConsultaForm from './ConsultaForm'
import { Package, CheckCircle, Truck, Clock, XCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type Props = { searchParams: Promise<{ id?: string; cpf?: string }> }

const STATUS_INFO: Record<string, { label: string; icon: typeof Package; cor: string; desc: string }> = {
  PENDENTE:  { label: 'Aguardando pagamento', icon: Clock,        cor: 'text-yellow-400', desc: 'Seu pedido está aguardando confirmação do pagamento.' },
  APROVADO:  { label: 'Pagamento confirmado', icon: CheckCircle,  cor: 'text-green-400',  desc: 'Pagamento aprovado! Estamos preparando seu pedido.' },
  ENVIADO:   { label: 'Pedido enviado',        icon: Truck,        cor: 'text-blue-400',   desc: 'Seu pedido foi despachado e está a caminho.' },
  ENTREGUE:  { label: 'Pedido entregue',       icon: CheckCircle,  cor: 'text-[#C9A84C]',  desc: 'Pedido entregue com sucesso. Obrigado pela compra!' },
  CANCELADO: { label: 'Pedido cancelado',      icon: XCircle,      cor: 'text-red-400',    desc: 'Este pedido foi cancelado.' },
  REJEITADO: { label: 'Pagamento recusado',    icon: XCircle,      cor: 'text-red-400',    desc: 'O pagamento foi recusado. Tente novamente.' },
}

export default async function ConsultaPedidoPage({ searchParams }: Props) {
  const { id, cpf } = await searchParams

  type PedidoResult = Awaited<ReturnType<typeof prisma.pedido.findFirst<{ include: { itens: true } }>>>
  let pedido: PedidoResult = null

  if (id || cpf) {
    pedido = await prisma.pedido.findFirst({
      where: {
        ...(id  ? { id: { contains: id, mode: 'insensitive' } } : {}),
        ...(cpf ? { cpfCliente: { contains: cpf.replace(/\D/g, '') } } : {}),
      },
      include: { itens: true },
    })
  }

  const info = pedido ? STATUS_INFO[pedido.status] : null
  const StatusIcon = info?.icon ?? Package

  // Etapas visuais do pedido
  const etapas = [
    { key: 'PENDENTE',  label: 'Pedido criado' },
    { key: 'APROVADO',  label: 'Pago' },
    { key: 'ENVIADO',   label: 'Enviado' },
    { key: 'ENTREGUE',  label: 'Entregue' },
  ]
  const ordemStatus: Record<string, number> = { PENDENTE: 0, APROVADO: 1, ENVIADO: 2, ENTREGUE: 3 }
  const statusAtual = pedido ? (ordemStatus[pedido.status] ?? -1) : -1

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <Package size={36} className="mx-auto mb-4 text-[#C9A84C]" />
        <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">Acompanhar pedido</h1>
        <p className="text-sm text-[#888]">Informe o número do pedido ou o CPF usado na compra</p>
      </div>

      {/* Formulário de consulta */}
      <ConsultaForm idInicial={id} cpfInicial={cpf} />

      {/* Resultado */}
      {(id || cpf) && !pedido && (
        <div className="mt-8 p-5 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
          <p className="text-red-400 text-sm font-semibold mb-1">Pedido não encontrado</p>
          <p className="text-xs text-[#888]">Verifique o código e o e-mail informados.</p>
        </div>
      )}

      {pedido && info && (
        <div className="mt-8 space-y-5">
          {/* Status principal */}
          <div className="card-dark p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-current/10 ${info.cor}`}
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <StatusIcon size={22} className={info.cor} />
              </div>
              <div>
                <p className="text-xs text-[#555] font-mono mb-0.5">
                  Pedido #{pedido.id.slice(-6).toUpperCase()}
                </p>
                <p className={`text-base font-bold ${info.cor}`}>{info.label}</p>
              </div>
            </div>
            <p className="text-sm text-[#888]">{info.desc}</p>
          </div>

          {/* Barra de progresso do status */}
          {statusAtual >= 0 && (
            <div className="card-dark p-5">
              <div className="flex items-center gap-0">
                {etapas.map((et, i) => {
                  const done    = i <= statusAtual
                  const current = i === statusAtual
                  return (
                    <div key={et.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${
                          done
                            ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]'
                            : 'bg-[#0A0A0A] border-[#2A2A2A] text-[#444]'
                        } ${current ? 'ring-2 ring-[#C9A84C]/30' : ''}`}>
                          {done ? '✓' : i + 1}
                        </div>
                        <p className={`text-[10px] mt-1 text-center ${done ? 'text-[#C9A84C]' : 'text-[#444]'}`}>
                          {et.label}
                        </p>
                      </div>
                      {i < etapas.length - 1 && (
                        <div className={`h-px flex-1 mb-4 transition-colors ${i < statusAtual ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Código de rastreio */}
          {pedido.codigoRastreio && (
            <div className="card-dark p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3 flex items-center gap-1.5">
                <Truck size={11} /> Rastreamento
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-lg font-black text-blue-400 tracking-widest">
                  {pedido.codigoRastreio}
                </span>
                <a
                  href={`https://rastreamento.correios.com.br/app/index.php?objeto=${pedido.codigoRastreio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <ExternalLink size={11} /> Rastrear nos Correios
                </a>
              </div>
            </div>
          )}

          {/* Itens do pedido */}
          <div className="card-dark p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3 flex items-center gap-1.5">
              <Package size={11} /> Itens
            </p>
            <div className="space-y-2">
              {pedido.itens.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#CCC]">
                    <span className="text-[#555]">{item.quantidade}×</span> {item.nomeProduto} — {item.nomeVariacao}
                  </span>
                  <span className="text-[#888] ml-3 shrink-0">{formatPrice(item.precoUnit * item.quantidade)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#2A2A2A] flex justify-between font-bold text-sm">
                <span className="text-[#888]">Total</span>
                <span className="text-[#C9A84C]">{formatPrice(pedido.total)}</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-[#444]">
            Dúvidas? Fale com a gente pelo Instagram <strong className="text-[#888]">@start_oneoficial</strong>
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-xs text-[#555] hover:text-[#C9A84C] transition-colors">
          ← Voltar à loja
        </Link>
      </div>
    </div>
  )
}
