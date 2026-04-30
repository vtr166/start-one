export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProdutoDetalhes from './ProdutoDetalhes'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const produto = await prisma.produto.findUnique({ where: { slug } })
  if (!produto) return {}
  return {
    title: `${produto.nome} | Start One Imports`,
    description: produto.descricao,
  }
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params
  const produto = await prisma.produto.findUnique({
    where: { slug, ativo: true },
    include: { variacoes: { where: { ativo: true }, orderBy: { preco: 'asc' } } },
  })

  if (!produto) notFound()

  return <ProdutoDetalhes produto={produto} />
}
