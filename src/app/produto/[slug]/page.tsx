export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProdutoDetalhes from './ProdutoDetalhes'
import { getPromocoesAtivas, calcularPrecoPromocional } from '@/lib/promocoes'
import AvaliacoesProduto from '@/components/AvaliacoesProduto'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const produto = await prisma.produto.findUnique({ where: { slug } })
  if (!produto) return {}
  return {
    title: `${produto.nome} | Start One Imports`,
    description: produto.descricao,
    openGraph: {
      title: `${produto.nome} | Start One Imports`,
      description: produto.descricao,
      images: produto.imagens[0] ? [produto.imagens[0]] : [],
    },
  }
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params
  const [produto, promocoes] = await Promise.all([
    prisma.produto.findUnique({
      where: { slug, ativo: true },
      include: { variacoes: { where: { ativo: true }, orderBy: { preco: 'asc' } } },
    }),
    getPromocoesAtivas(),
  ])

  if (!produto) notFound()

  // Calcula desconto por variação
  const variacoesComDesconto = produto.variacoes.map((v) => {
    const { preco: precoFinal, desconto, temDesconto } = calcularPrecoPromocional(
      v.preco, produto.categoria, produto.genero, promocoes
    )
    return { ...v, precoFinal: temDesconto ? precoFinal : v.preco, desconto, temDesconto }
  })

  // Relacionados + avaliações em paralelo
  const [rel, avaliacoesRaw] = await Promise.all([
    prisma.produto.findMany({
      where: {
        ativo: true,
        slug: { not: slug },
        OR: [
          { categoria: produto.categoria },
          { genero: produto.genero },
        ],
      },
      include: { variacoes: { where: { ativo: true }, orderBy: { preco: 'asc' } } },
      orderBy: { destaque: 'desc' },
      take: 4,
    }),
    prisma.avaliacao.findMany({
      where: { produtoId: produto.id, aprovado: true },
      orderBy: { criadoEm: 'desc' },
    }),
  ])

  const totalAvaliacoes = avaliacoesRaw.length
  const mediaNotas = totalAvaliacoes > 0
    ? avaliacoesRaw.reduce((sum, a) => sum + a.nota, 0) / totalAvaliacoes
    : 0

  // Serializar datas para client component
  const avaliacoes = avaliacoesRaw.map(a => ({
    ...a,
    criadoEm: a.criadoEm.toISOString(),
  }))

  return (
    <>
      <ProdutoDetalhes
        produto={{ ...produto, variacoes: variacoesComDesconto }}
        relacionados={rel}
        promocoes={promocoes}
      />
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <AvaliacoesProduto
          produtoId={produto.id}
          avaliacoes={avaliacoes}
          mediaNotas={mediaNotas}
          totalAvaliacoes={totalAvaliacoes}
        />
      </div>
    </>
  )
}
