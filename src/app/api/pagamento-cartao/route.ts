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

/**
 * Busca o valor TOTAL com juros do comprador para um dado número de parcelas.
 * O MP retorna payer_costs[] com total_amount (valor cheio com juros) por parcela.
 * Se não encontrar, retorna o valor original (fallback seguro).
 */
async function getValorComJuros(
  paymentMethodId: string,
  issuerId: string | undefined,
  valorOriginal: number,
  parcelas: number,
): Promise<number> {
  if (parcelas <= 1) return valorOriginal

  try {
    const params = new URLSearchParams({
      payment_method_id: paymentMethodId,
      amount:            String(valorOriginal),
      locale:            'pt-BR',
    })
    if (issuerId) params.set('issuer_id', issuerId)

    const res = await fetch(
      `https://api.mercadopago.com/v1/payment_methods/installments?${params}`,
      { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } },
    )

    if (!res.ok) return valorOriginal

    const data = await res.json()
    const payerCosts: { installments: number; total_amount: number }[] =
      data[0]?.payer_costs ?? []

    const plano = payerCosts.find(p => p.installments === parcelas)

    console.log(
      `[JUROS] ${parcelas}x — original: R$${valorOriginal} → com juros: R$${plano?.total_amount ?? valorOriginal}`,
    )

    return plano?.total_amount ?? valorOriginal
  } catch (e) {
    console.error('[JUROS] Erro ao buscar parcelas:', e)
    return valorOriginal
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      token, payment_method_id, issuer_id, installments, transaction_amount,
      payer,
      itens, cliente, frete, cupom, afiliadoRef,
    } = await req.json()

    if (!token)        return NextResponse.json({ erro: 'Token do cartão inválido' }, { status: 400 })
    if (!itens?.length) return NextResponse.json({ erro: 'Carrinho vazio' }, { status: 400 })

    const parcelas    = Number(installments ?? 1)
    const valorBase   = Number(transaction_amount)

    // ── Valor real cobrado do comprador (inclui juros das parcelas) ──
    const valorFinal = await getValorComJuros(
      payment_method_id,
      issuer_id,
      valorBase,
      parcelas,
    )

    const cpfLimpo = String(cliente?.cpf ?? payer?.identification?.number ?? '').replace(/\D/g, '')

    // Resolve afiliado por slug
    let afiliadoId: string | null = null
    if (afiliadoRef) {
      const af = await prisma.afiliado.findUnique({
        where: { slug: String(afiliadoRef) },
        select: { id: true, ativo: true },
      })
      if (af?.ativo) afiliadoId = af.id
    }

    // Cria pedido — salva o valor FINAL (com juros) como total
    const pedido = await prisma.pedido.create({
      data: {
        total:           valorFinal,
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
            produtoId:    item.produtoId,
            variacaoId:   item.variacaoId,
            nomeProduto:  item.nomeProduto,
            nomeVariacao: item.nomeVariacao,
            precoUnit:    item.preco,
            quantidade:   item.quantidade,
          })),
        },
      },
    })

    if (cupom?.id) {
      await prisma.cupom.update({
        where: { id: cupom.id },
        data:  { usosAtuais: { increment: 1 } },
      })
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? 'https://localhost:3000'

    // Cria pagamento no MP — valorFinal já inclui juros do comprador
    const payment = await new Payment(client).create({
      body: {
        token,
        payment_method_id,
        issuer_id:          issuer_id ? Number(issuer_id) : undefined,
        installments:       parcelas,
        transaction_amount: valorFinal,   // ← valor com juros
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
        status:      novoStatus as 'APROVADO' | 'REJEITADO' | 'PENDENTE',
      },
    })

    if (novoStatus === 'APROVADO') {
      await Promise.allSettled(
        itens.map((item: ItemReq) =>
          prisma.variacao.update({
            where: { id: item.variacaoId },
            data:  { estoque: { decrement: item.quantidade } },
          }),
        ),
      )
    }

    return NextResponse.json({
      pedidoId:     pedido.id,
      status:       novoStatus,
      statusDetail: payment.status_detail,
      valorCobrado: valorFinal,
      parcelas,
    })
  } catch (error) {
    console.error('[PAGAMENTO CARTÃO]', error)
    return NextResponse.json({ erro: 'Erro ao processar pagamento' }, { status: 500 })
  }
}
