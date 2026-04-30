import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ erro: 'ID não informado' }, { status: 400 })

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    select: { status: true },
  })

  if (!pedido) return NextResponse.json({ erro: 'Pedido não encontrado' }, { status: 404 })

  return NextResponse.json({ status: pedido.status })
}
