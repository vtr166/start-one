import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { enviarEmailVendedor, enviarEmailComprador, enviarWhatsAppVendedor, enviarEmailFidelidade } from '@/lib/email'

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

    // Baixa de estoque ao aprovar (só uma vez por pedido)
    if (status === 'APROVADO') {
      await Promise.allSettled(
        pedido.itens.map(item =>
          prisma.variacao.update({
            where: { id: item.variacaoId },
            data: { estoque: { decrement: item.quantidade } },
          })
        )
      )
    }

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

      // ── Programa de Fidelidade ────────────────────────────────
      // Conta quantos pedidos APROVADOS esse e-mail já tem (incluindo o atual)
      const totalCompras = await prisma.pedido.count({
        where: {
          emailCliente: pedido.emailCliente,
          status: 'APROVADO',
        },
      })

      // A cada múltiplo de 5 → gera cupom de decant grátis
      if (totalCompras > 0 && totalCompras % 5 === 0) {
        const codigo = `FIEL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 dias

        await prisma.cupom.create({
          data: {
            codigo,
            tipo: 'FIXO',
            valor: 30,          // cobre até o decant mais caro (R$30)
            maxUsos: 1,
            ativo: true,
            expiresAt,
            descricao: `Decant grátis — Fidelidade ${totalCompras}ª compra — ${pedido.nomeCliente} (${pedido.emailCliente})`,
          },
        })

        await enviarEmailFidelidade({
          nomeCliente: pedido.nomeCliente,
          emailCliente: pedido.emailCliente,
          codigoCupom: codigo,
          totalCompras,
          expiresAt,
        }).catch(err => console.error('[FIDELIDADE EMAIL]', err))

        console.log(`[FIDELIDADE] ${pedido.emailCliente} → ${totalCompras}ª compra → cupom ${codigo}`)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[WEBHOOK]', error)
    return NextResponse.json({ erro: 'Erro no webhook' }, { status: 500 })
  }
}
