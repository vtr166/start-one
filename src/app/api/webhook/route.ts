import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const statusMap: Record<string, string> = {
  approved: 'APROVADO',
  rejected: 'REJEITADO',
  pending: 'PENDENTE',
  cancelled: 'CANCELADO',
  in_process: 'PENDENTE',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const payment = await new Payment(client).get({ id: data.id })

    const pedidoId = payment.external_reference
    const status = statusMap[payment.status ?? ''] ?? 'PENDENTE'

    if (pedidoId) {
      await prisma.pedido.update({
        where: { id: pedidoId },
        data: {
          status: status as 'APROVADO' | 'REJEITADO' | 'PENDENTE' | 'CANCELADO',
          mpPaymentId: String(data.id),
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[WEBHOOK]', error)
    return NextResponse.json({ erro: 'Erro no webhook' }, { status: 500 })
  }
}
