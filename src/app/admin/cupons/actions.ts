'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function criarCupom(data: {
  codigo: string
  tipo: 'PERCENTUAL' | 'FIXO'
  valor: number
  minPedido?: number | null
  maxUsos?: number | null
  expiresAt?: string | null
  descricao?: string
  afiliadoId?: string | null
}) {
  await prisma.cupom.create({
    data: {
      codigo:     data.codigo.toUpperCase().trim(),
      tipo:       data.tipo,
      valor:      data.valor,
      minPedido:  data.minPedido || null,
      maxUsos:    data.maxUsos || null,
      expiresAt:  data.expiresAt ? new Date(data.expiresAt) : null,
      descricao:  data.descricao || null,
      afiliadoId: data.afiliadoId || null,
    },
  })
  revalidatePath('/admin/cupons')
}

export async function toggleCupom(id: string, ativo: boolean) {
  await prisma.cupom.update({ where: { id }, data: { ativo } })
  revalidatePath('/admin/cupons')
}

export async function deletarCupom(id: string) {
  await prisma.cupom.delete({ where: { id } })
  revalidatePath('/admin/cupons')
}
