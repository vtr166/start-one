'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function atualizarEstoque(variacaoId: string, estoque: number) {
  await prisma.variacao.update({
    where: { id: variacaoId },
    data: { estoque: Math.max(0, estoque) },
  })
  revalidatePath('/admin/estoque')
  revalidatePath('/admin/produtos')
}
