import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get('codigo')?.toUpperCase().trim()
  const total  = parseFloat(req.nextUrl.searchParams.get('total') ?? '0')

  if (!codigo) return NextResponse.json({ erro: 'Código não informado' }, { status: 400 })

  const cupom = await prisma.cupom.findUnique({
    where: { codigo },
    include: { afiliado: { select: { nome: true } } },
  })

  if (!cupom || !cupom.ativo) {
    return NextResponse.json({ erro: 'Cupom inválido ou inativo' }, { status: 404 })
  }

  if (cupom.expiresAt && new Date() > cupom.expiresAt) {
    return NextResponse.json({ erro: 'Cupom expirado' }, { status: 400 })
  }

  if (cupom.maxUsos !== null && cupom.usosAtuais >= cupom.maxUsos) {
    return NextResponse.json({ erro: 'Cupom esgotado' }, { status: 400 })
  }

  if (cupom.minPedido && total < cupom.minPedido) {
    return NextResponse.json({
      erro: `Pedido mínimo de R$ ${cupom.minPedido.toFixed(2).replace('.', ',')} para este cupom`,
    }, { status: 400 })
  }

  const desconto = cupom.tipo === 'PERCENTUAL'
    ? Math.round((total * cupom.valor / 100) * 100) / 100
    : Math.min(cupom.valor, total)

  return NextResponse.json({
    id:        cupom.id,
    codigo:    cupom.codigo,
    tipo:      cupom.tipo,
    valor:     cupom.valor,
    desconto,
    afiliado:  cupom.afiliado?.nome ?? null,
    descricao: cupom.descricao ?? null,
  })
}
