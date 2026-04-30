export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AdminNav from '../../AdminNav'
import FormProduto from '../FormProduto'
import DeletarProduto from './DeletarProduto'

type Props = { params: Promise<{ id: string }> }

export default async function EditarProduto({ params }: Props) {
  const { id } = await params
  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { variacoes: { orderBy: { preco: 'asc' } } },
  })

  if (!produto) notFound()

  const produtoSerializado = {
    ...produto,
    variacoes: produto.variacoes.map((v) => ({
      tipo: v.tipo as 'FRASCO' | 'DECANT',
      volume: v.volume,
      preco: v.preco,
      estoque: v.estoque,
    })),
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Editar Produto</h1>
            <DeletarProduto id={produto.id} />
          </div>
          <div className="card-dark p-6">
            <FormProduto produto={produtoSerializado} />
          </div>
        </div>
      </main>
    </div>
  )
}
