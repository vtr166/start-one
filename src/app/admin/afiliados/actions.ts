'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function criarAfiliado(data: {
  nome: string; email?: string; whatsapp?: string; comissao: number
}) {
  await prisma.afiliado.create({
    data: {
      nome:      data.nome.trim(),
      email:     data.email?.trim()    || null,
      whatsapp:  data.whatsapp?.trim() || null,
      comissao:  data.comissao,
    },
  })
  revalidatePath('/admin/afiliados')
}

export async function toggleAfiliado(id: string, ativo: boolean) {
  await prisma.afiliado.update({ where: { id }, data: { ativo } })
  revalidatePath('/admin/afiliados')
}
