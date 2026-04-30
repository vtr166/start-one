export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import DecantsCatalogo from './DecantsCatalogo'

export const metadata: Metadata = {
  title: 'Decants 5ml — Combos Exclusivos | Start One Imports',
  description: 'Experimente qualquer perfume em decants de 5ml. Compre 3 pague 2, compre 5 pague 3. Originais garantidos.',
}

export default async function DecantsPage() {
  const produtos = await prisma.produto.findMany({
    where: {
      ativo: true,
      variacoes: { some: { tipo: 'DECANT', estoque: { gt: 0 } } },
    },
    include: {
      variacoes: { where: { tipo: 'DECANT', estoque: { gt: 0 } } },
    },
    orderBy: [{ genero: 'asc' }, { nome: 'asc' }],
  })

  return <DecantsCatalogo produtos={produtos} />
}
