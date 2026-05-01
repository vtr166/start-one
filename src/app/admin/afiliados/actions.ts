'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function criarAfiliado(data: {
  nome: string; slug?: string | null; email?: string; whatsapp?: string; comissao: number
}) {
  await prisma.afiliado.create({
    data: {
      nome:     data.nome.trim(),
      slug:     data.slug?.trim().toLowerCase() || null,
      email:    data.email?.trim()    || null,
      whatsapp: data.whatsapp?.trim() || null,
      comissao: data.comissao,
    },
  })
  revalidatePath('/admin/afiliados')
}

export async function toggleAfiliado(id: string, ativo: boolean) {
  await prisma.afiliado.update({ where: { id }, data: { ativo } })
  revalidatePath('/admin/afiliados')
}

export async function editarSlugAfiliado(id: string, slug: string) {
  const slugLimpo = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!slugLimpo) throw new Error('Slug inválido')
  await prisma.afiliado.update({ where: { id }, data: { slug: slugLimpo } })
  revalidatePath('/admin/afiliados')
}

export async function deletarAfiliado(id: string) {
  // Cupons vinculados: desvincula (não deleta o cupom, só remove a referência)
  await prisma.cupom.updateMany({ where: { afiliadoId: id }, data: { afiliadoId: null } })
  // Deleta o afiliado (ComissaoPaga tem Cascade, Pedido tem SetNull — já no schema)
  await prisma.afiliado.delete({ where: { id } })
  revalidatePath('/admin/afiliados')
}

export async function marcarComissaoPaga(data: {
  afiliadoId: string
  valor: number
  periodoLabel: string
  periodoInicio: string
  periodoFim: string
  observacao?: string
}) {
  await prisma.comissaoPaga.create({
    data: {
      afiliadoId:    data.afiliadoId,
      valor:         data.valor,
      periodoLabel:  data.periodoLabel,
      periodoInicio: new Date(data.periodoInicio),
      periodoFim:    new Date(data.periodoFim),
      observacao:    data.observacao?.trim() || null,
    },
  })
  revalidatePath('/admin/afiliados')
}
