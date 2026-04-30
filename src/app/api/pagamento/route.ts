import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

type ItemReq = {
  produtoId: string
  variacaoId: string
  nomeProduto: string
  nomeVariacao: string
  preco: number
  quantidade: number
  isDecant?: boolean
}

// Resolve IDs falsos do kit Yara para IDs reais do banco
async function resolverItem(item: ItemReq): Promise<ItemReq> {
  if (item.produtoId !== 'yara-promo') return item

  const yara = await prisma.produto.findFirst({
    where: {
      nome: { contains: 'Yara', mode: 'insensitive' },
      variacoes: { some: { tipo: 'FRASCO', ativo: true } },
    },
    include: { variacoes: { where: { tipo: 'FRASCO', ativo: true }, take: 1 } },
  })

  if (yara?.variacoes[0]) {
    return { ...item, produtoId: yara.id, variacaoId: yara.variacoes[0].id }
  }

  return item
}

export async function POST(req: NextRequest) {
  try {
    const { itens, cliente, total } = await req.json()

    if (!itens?.length) {
      return NextResponse.json({ erro: 'Carrinho vazio' }, { status: 400 })
    }

    if (!cliente?.cpf) {
      return NextResponse.json({ erro: 'CPF obrigatório para PIX' }, { status: 400 })
    }

    const cpfLimpo = String(cliente.cpf).replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      return NextResponse.json({ erro: 'CPF inválido' }, { status: 400 })
    }

    // Resolve IDs fake (kit Yara) para IDs reais
    const itensResolvidos = await Promise.all(itens.map(resolverItem))

    // Salva pedido no banco
    const pedido = await prisma.pedido.create({
      data: {
        total,
        nomeCliente: cliente.nome,
        emailCliente: cliente.email,
        telefoneCliente: cliente.telefone ?? null,
        itens: {
          create: itensResolvidos.map((item: ItemReq) => ({
            produtoId: item.produtoId,
            variacaoId: item.variacaoId,
            nomeProduto: item.nomeProduto,
            nomeVariacao: item.nomeVariacao,
            precoUnit: item.preco,
            quantidade: item.quantidade,
          })),
        },
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL ?? 'https://localhost:3000'

    // Cria pagamento PIX no Mercado Pago
    const payment = await new Payment(client).create({
      body: {
        payment_method_id: 'pix',
        transaction_amount: Math.round(total * 100) / 100,
        description: `Start One Imports — Pedido #${pedido.id.slice(-6).toUpperCase()}`,
        payer: {
          email: cliente.email,
          first_name: cliente.nome.split(' ')[0],
          last_name: cliente.nome.split(' ').slice(1).join(' ') || '-',
          identification: {
            type: 'CPF',
            number: cpfLimpo,
          },
        },
        external_reference: pedido.id,
        notification_url: `${baseUrl}/api/webhook`,
      },
    })

    // Salva o payment ID
    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { mpPaymentId: String(payment.id) },
    })

    const qrCode = payment.point_of_interaction?.transaction_data?.qr_code ?? ''
    const qrCodeBase64 = payment.point_of_interaction?.transaction_data?.qr_code_base64 ?? ''

    return NextResponse.json({ pedidoId: pedido.id, qrCode, qrCodeBase64, total })
  } catch (error) {
    console.error('[PAGAMENTO PIX]', error)
    return NextResponse.json({ erro: 'Erro interno ao gerar PIX' }, { status: 500 })
  }
}
