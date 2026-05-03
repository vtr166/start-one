import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [banners, total] = await Promise.all([
    prisma.banner.findMany({ where: { ativo: true }, orderBy: { ordem: 'asc' } }),
    prisma.banner.count(),
  ])
  // total > 0 significa que o admin já configurou banners (mesmo que todos ocultos)
  return NextResponse.json({ banners, total })
}
