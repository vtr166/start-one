import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { enviarEmailVendedor, enviarEmailComprador, enviarWhatsAppVendedor } from '@/lib/email'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const statusMap: Record<string, string> = {
  approved:   'APROVADO',
  rejected:   'REJEITADO',
  pending:    'PENDENTE',
  cancelled:  'CANCELADO',
  in_process: 'PENDENTE',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type !== 'payment') return NextResponse.json({ ok: true })

    const payment = await new Payment(client).get({ id: data.id })
    const pedidoId = payment.external_reference
    const status = statusMap[payment.status ?? ''] ?? 'PENDENTE'

    if (!pedidoId) return NextResponse.json({ ok: true })

    const pedido = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        status: status as 'APROVADO' | 'REJEITADO' | 'PENDENTE' | 'CANCELADO',
        mpPaymentId: String(data.id),
      },
      include: { itens: true },
    })

    // Envia emails somente quando aprovado
    if (status === 'APROVADO') {
      const dadosEmail = {
        id: pedido.id,
        nomeCliente: pedido.nomeCliente,
        emailCliente: pedido.emailCliente,
        telefoneCliente: pedido.telefoneCliente,
        enderecoEntrega: pedido.enderecoEntrega,
        freteServico: pedido.freteServico,
        freteEmpresa: pedido.freteEmpresa,
        freteValor: pedido.freteValor,
        total: pedido.total,
        itens: pedido.itens.map((i) => ({
          nomeProduto: i.nomeProduto,
          nomeVariacao: i.nomeVariacao,
          quantidade: i.quantidade,
          precoUnit: i.precoUnit,
        })),
      }

      await Promise.allSettled([
        enviarEmailVendedor(dadosEmail),
        enviarEmailComprador(dadosEmail),
        enviarWhatsAppVendedor(dadosEmail),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[WEBHOOK]', error)
    return NextResponse.json({ erro: 'Erro no webhook' }, { status: 500 })
  }
}
