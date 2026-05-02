'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { enviarEmailRastreio } from '@/lib/email'

export async function atualizarStatusPedido(
  id: string,
  status: 'APROVADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO',
  codigoRastreio?: string,
) {
  const pedido = await prisma.pedido.update({
    where: { id },
    data: {
      status,
      ...(codigoRastreio ? { codigoRastreio: codigoRastreio.trim().toUpperCase() } : {}),
    },
  })

  // Envia e-mail de rastreio ao marcar como ENVIADO
  if (status === 'ENVIADO' && codigoRastreio?.trim()) {
    await enviarEmailRastreio({
      nomeCliente:    pedido.nomeCliente,
      emailCliente:   pedido.emailCliente,
      pedidoId:       pedido.id,
      codigoRastreio: codigoRastreio.trim().toUpperCase(),
      freteEmpresa:   pedido.freteEmpresa,
    }).catch(err => console.error('[RASTREIO EMAIL]', err))
  }

  revalidatePath('/admin/pedidos')
}
