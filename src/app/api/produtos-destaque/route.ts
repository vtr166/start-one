import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: { ativo: true, destaque: true },
      include: { variacoes: { where: { ativo: true }, orderBy: { preco: 'asc' }, take: 3 } },
      orderBy: { criadoEm: 'desc' },
      take: 3,
    })
    return NextResponse.json({ produtos })
  } catch {
    return NextResponse.json({ produtos: [] })
  }
}
