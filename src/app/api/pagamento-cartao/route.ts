import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

type ItemReq = {
  produtoId: string; variacaoId: string; nomeProduto: string
  nomeVariacao: string; preco: number; quantidade: number; isDecant?: boolean
}

export async function POST(req: NextRequest) {
  try {
    const {
      // Dados do cartão (vêm do brick do MP)
      token, payment_method_id, issuer_id, installments, transaction_amount,
      payer,
      // Dados do pedido (vêm do nosso checkout)
      itens, cliente, frete, cupom, afiliadoRef,
    } = await req.json()

    if (!token) return NextResponse.json({ erro: 'Token do cartão inválido' }, { status: 400 })
    if (!itens?.length) return NextResponse.json({ erro: 'Carrinho vazio' }, { status: 400 })

    const cpfLimpo = String(cliente?.cpf ?? payer?.identification?.number ?? '').replace(/\D/g, '')

    // Resolve afiliado por slug
    let afiliadoId: string | null = null
    if (afiliadoRef) {
      const af = await prisma.afiliado.findUnique({ where: { slug: String(afiliadoRef) }, select: { id: true, ativo: true } })
      if (af?.ativo) afiliadoId = af.id
    }

    // Cria pedido no banco
    const pedido = await prisma.pedido.create({
      data: {
        total: transaction_amount,
        nomeCliente:     cliente.nome,
        emailCliente:    payer.email ?? cliente.email,
        telefoneCliente: cliente.telefone ?? null,
        cpfCliente:      cpfLimpo || null,
        cep:             cliente.cep?.replace(/\D/g, '') ?? null,
        enderecoEntrega: cliente.enderecoFormatado ?? null,
        freteServico:    frete?.nome ?? null,
        freteEmpresa:    frete?.empresa ?? null,
        freteValor:      frete?.preco ?? 0,
        cupomId:         cupom?.id ?? null,
        desconto:        cupom?.desconto ?? 0,
        afiliadoId,
        itens: {
          create: itens.map((item: ItemReq) => ({
            produtoId:   item.produtoId,
            variacaoId:  item.variacaoId,
            nomeProduto: item.nomeProduto,
            nomeVariacao: item.nomeVariacao,
            precoUnit:   item.preco,
            quantidade:  item.quantidade,
          })),
        },
      },
    })

    // Incrementa usos do cupom
    if (cupom?.id) {
      await prisma.cupom.update({ where: { id: cupom.id }, data: { usosAtuais: { increment: 1 } } })
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? 'https://localhost:3000'

    // Cria pagamento no MP com cartão
    const payment = await new Payment(client).create({
      body: {
        token,
        payment_method_id,
        issuer_id:          issuer_id ? Number(issuer_id) : undefined,
        installments:       Number(installments ?? 1),
        transaction_amount: Number(transaction_amount),
        description: `Start One Imports — Pedido #${pedido.id.slice(-6).toUpperCase()}`,
        payer: {
          email: payer.email ?? cliente.email,
          identification: {
            type:   payer.identification?.type ?? 'CPF',
            number: payer.identification?.number ?? cpfLimpo,
          },
        },
        external_reference: pedido.id,
        notification_url:   `${baseUrl}/api/webhook`,
      },
    })

    // Atualiza pedido com status e payment id
    const statusMap: Record<string, string> = {
      approved:   'APROVADO',
      rejected:   'REJEITADO',
      in_process: 'PENDENTE',
      pending:    'PENDENTE',
    }
    const novoStatus = statusMap[payment.status ?? ''] ?? 'PENDENTE'

    await prisma.pedido.update({
      where: { id: pedido.id },
      data: {
        mpPaymentId: String(payment.id),
        status: novoStatus as 'APROVADO' | 'REJEITADO' | 'PENDENTE',
      },
    })

    // Baixa de estoque imediata se aprovado (cartão aprova na hora)
    if (novoStatus === 'APROVADO') {
      await Promise.allSettled(
        itens.map((item: ItemReq) =>
          prisma.variacao.update({
            where: { id: item.variacaoId },
            data: { estoque: { decrement: item.quantidade } },
          })
        )
      )
    }

    return NextResponse.json({
      pedidoId: pedido.id,
      status:   novoStatus,
      // Status de recusa para mostrar mensagem amigável
      statusDetail: payment.status_detail,
    })
  } catch (error) {
    console.error('[PAGAMENTO CARTÃO]', error)
    return NextResponse.json({ erro: 'Erro ao processar pagamento' }, { status: 500 })
  }
}
