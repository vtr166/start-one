'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function criarPromocao(data: {
  nome: string; tipo: 'PERCENTUAL' | 'FIXO'; valor: number
  categoria?: string | null; genero?: string | null; expiresAt?: string | null
}) {
  await prisma.promocao.create({
    data: {
      nome:      data.nome,
      tipo:      data.tipo,
      valor:     data.valor,
      categoria: (data.categoria as 'ARABE' | 'IMPORTADO' | undefined) ?? null,
      genero:    (data.genero    as 'MASCULINO' | 'FEMININO' | 'UNISSEX' | undefined) ?? null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  })
  revalidatePath('/admin/promocoes')
  revalidatePath('/')
}

export async function togglePromocao(id: string, ativo: boolean) {
  await prisma.promocao.update({ where: { id }, data: { ativo } })
  revalidatePath('/admin/promocoes')
  revalidatePath('/')
}

export async function deletarPromocao(id: string) {
  await prisma.promocao.delete({ where: { id } })
  revalidatePath('/admin/promocoes')
  revalidatePath('/')
}
