'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function criarBanner(data: {
  badge?: string; titulo1: string; titulo2: string; subtitulo?: string
  imagemUrl: string; acento: string; glow: string; overlay: string
  ctaLabel?: string; ctaHref?: string; ctaSecLabel?: string; ctaSecHref?: string
  stat1n?: string; stat1label?: string; stat2n?: string; stat2label?: string
  stat3n?: string; stat3label?: string; ordem: number
}) {
  await prisma.banner.create({ data })
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function atualizarBanner(id: string, data: Partial<{
  badge: string; titulo1: string; titulo2: string; subtitulo: string
  imagemUrl: string; acento: string; glow: string; overlay: string
  ctaLabel: string; ctaHref: string; ctaSecLabel: string; ctaSecHref: string
  stat1n: string; stat1label: string; stat2n: string; stat2label: string
  stat3n: string; stat3label: string; ordem: number; ativo: boolean
}>) {
  await prisma.banner.update({ where: { id }, data })
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function deletarBanner(id: string) {
  await prisma.banner.delete({ where: { id } })
  revalidatePath('/admin/banners')
  revalidatePath('/')
}
