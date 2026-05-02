export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import ProdutoCard from '@/components/ProdutoCard'
import HeroBanner from '@/components/HeroBanner'
import TrustBar from '@/components/TrustBar'
import BannerDiasMaes from '@/components/BannerDiasMaes'
import ProvasSociais from '@/components/ProvasSociais'
import SecaoDecants from '@/components/SecaoDecants'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { getPromocoesAtivas, calcularPrecoPromocional } from '@/lib/promocoes'
import ProgramaFidelidade from '@/components/ProgramaFidelidade'

type SearchParams = Promise<{ categoria?: string; tipo?: string; genero?: string; q?: string }>

// ─── Componente de seção de perfumes ───────────────────────
function SecaoPerfumes({
  titulo, emoji, href, produtos, mostrarTodos = false
}: {
  titulo: string
  emoji: string
  href: string
  produtos: Parameters<typeof ProdutoCard>[0][]
  mostrarTodos?: boolean
}) {
  if (produtos.length === 0) return null
  const exibidos = mostrarTodos ? produtos : produtos.slice(0, 4)

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <h2 className="text-lg font-bold text-[#F5F5F5]">{titulo}</h2>
          <span className="text-xs text-[#444] ml-1">({produtos.length})</span>
        </div>
        {!mostrarTodos && produtos.length > 4 && (
          <Link href={href} className="flex items-center gap-1 text-xs text-[#C9A84C] hover:underline font-semibold">
            Ver todos <ArrowRight size={13} />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exibidos.map((p) => <ProdutoCard key={p.id} {...p} />)}
      </div>
    </section>
  )
}

// Helper: enriquece produto com dados de promoção
type ProdutoComVariacoes = Awaited<ReturnType<typeof prisma.produto.findMany<{ include: { variacoes: true } }>>>[number]
type Promocoes = Awaited<ReturnType<typeof getPromocoesAtivas>>
function enriquecerComPromocao(produto: ProdutoComVariacoes, promocoes: Promocoes) {
  const menorPreco = produto.variacoes.filter(v => v.estoque > 0).sort((a, b) => a.preco - b.preco)[0]
  if (!menorPreco) return { ...produto, precoPromocional: null as number | null, descontoPercent: null as number | null }
  const { preco: precoFinal, desconto, temDesconto } = calcularPrecoPromocional(
    menorPreco.preco, produto.categoria, produto.genero, promocoes
  )
  return {
    ...produto,
    precoPromocional: temDesconto ? precoFinal : null as number | null,
    descontoPercent: temDesconto ? (desconto / menorPreco.preco) * 100 : null as number | null,
  }
}

// ─── Página principal ────────────────────────────────────────
export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { categoria, tipo, genero, q } = await searchParams
  const promocoes = await getPromocoesAtivas()

  const isFiltrado = !!(categoria || tipo || genero || q)

  // Busca filtrada
  const produtosFiltrados = isFiltrado
    ? await prisma.produto.findMany({
        where: {
          ativo: true,
          ...(categoria ? { categoria: categoria as 'ARABE' | 'IMPORTADO' } : {}),
          ...(genero ? { genero: genero as 'MASCULINO' | 'FEMININO' | 'UNISSEX' } : {}),
          ...(q ? { nome: { contains: q, mode: 'insensitive' as const } } : {}),
          ...(tipo === 'DECANT' ? { variacoes: { some: { tipo: 'DECANT', estoque: { gt: 0 } } } } : {}),
        },
        include: { variacoes: true },
        orderBy: [{ destaque: 'desc' }, { criadoEm: 'desc' }],
      })
    : []

  // Busca por seções (home)
  const [masculinos, femininos, unissex, destaques] = isFiltrado
    ? [[], [], [], []]
    : await Promise.all([
        prisma.produto.findMany({
          where: { ativo: true, genero: 'MASCULINO' },
          include: { variacoes: true },
          orderBy: [{ destaque: 'desc' }, { criadoEm: 'desc' }],
        }),
        prisma.produto.findMany({
          where: { ativo: true, genero: 'FEMININO' },
          include: { variacoes: true },
          orderBy: [{ destaque: 'desc' }, { criadoEm: 'desc' }],
        }),
        prisma.produto.findMany({
          where: { ativo: true, genero: 'UNISSEX' },
          include: { variacoes: true },
          orderBy: [{ destaque: 'desc' }, { criadoEm: 'desc' }],
        }),
        prisma.produto.findMany({
          where: { ativo: true, destaque: true },
          include: { variacoes: true },
          orderBy: { criadoEm: 'desc' },
          take: 8,
        }),
      ])

  // Enriquecer com promoções
  const filtradosEnriquecidos = produtosFiltrados.map(p => enriquecerComPromocao(p, promocoes))
  const masculinosEnriquecidos = masculinos.map(p => enriquecerComPromocao(p, promocoes))
  const femininosEnriquecidos  = femininos.map(p => enriquecerComPromocao(p, promocoes))
  const unissexEnriquecidos    = unissex.map(p => enriquecerComPromocao(p, promocoes))
  const destaquesEnriquecidos  = destaques.map(p => enriquecerComPromocao(p, promocoes))

  // ── RESULTADO DE BUSCA/FILTRO ─────────────────────────────────
  if (isFiltrado) {
    const titulo =
      categoria === 'ARABE' ? '🕌 Perfumes Árabes'
      : categoria === 'IMPORTADO' ? '✈️ Importados'
      : tipo === 'DECANT' ? '💧 Decants'
      : genero === 'MASCULINO' ? '🔵 Masculinos'
      : genero === 'FEMININO' ? '🩷 Femininos'
      : genero === 'UNISSEX' ? '⚪ Unissex'
      : q ? `Resultados para "${q}"`
      : 'Catálogo'

    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#F5F5F5]">{titulo}</h1>
          <Link href="/" className="text-xs text-[#C9A84C] hover:underline">← Voltar</Link>
        </div>
        {filtradosEnriquecidos.length === 0 ? (
          <div className="text-center py-24 text-[#555]">
            <p className="text-lg mb-2">Nenhum produto encontrado</p>
            <Link href="/" className="text-sm text-[#C9A84C] hover:underline">Ver todos os perfumes</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtradosEnriquecidos.map((p) => <ProdutoCard key={p.id} {...p} />)}
          </div>
        )}
      </div>
    )
  }

  // ── HOME ─────────────────────────────────────────────────────
  return (
    <div>
      {/* 1. Banner hero rotativo */}
      <HeroBanner />

      {/* 2. Trust bar */}
      <TrustBar />

      {/* 3. Banner Dia das Mães */}
      <BannerDiasMaes />

      {/* 4. Destaques */}
      {destaquesEnriquecidos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-12 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-[#C9A84C]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">Mais Vendidos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {destaquesEnriquecidos.map((p) => <ProdutoCard key={p.id} {...p} />)}
          </div>
        </section>
      )}

      {/* 5. Banner decants */}
      <SecaoDecants />

      {/* 6. Masculinos */}
      <SecaoPerfumes
        titulo="Para Ele"
        emoji="🔵"
        href="/?genero=MASCULINO"
        produtos={masculinosEnriquecidos}
      />

      {/* 7. Femininos */}
      <SecaoPerfumes
        titulo="Para Ela"
        emoji="🩷"
        href="/?genero=FEMININO"
        produtos={femininosEnriquecidos}
      />

      {/* 8. Unissex */}
      <SecaoPerfumes
        titulo="Unissex"
        emoji="⚪"
        href="/?genero=UNISSEX"
        produtos={unissexEnriquecidos}
      />

      {/* 8. Provas sociais */}
      <ProvasSociais />

      {/* 9. Programa de fidelidade */}
      <ProgramaFidelidade />

      {/* 10. CTA final */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center py-16 border border-[#2A2A2A] rounded-2xl bg-[#111]">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] font-bold mb-3">Start One Imports</p>
          <h2 className="text-3xl font-black text-[#F5F5F5] mb-3">Sua jornada olfativa começa aqui</h2>
          <p className="text-[#888] text-sm mb-8 max-w-md mx-auto">
            Mais de 20 fragrâncias originais com decants disponíveis. Encontre seu próximo perfume favorito.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/?categoria=ARABE" className="btn-gold text-sm px-7 py-3">Ver Árabes</Link>
            <Link href="/?categoria=IMPORTADO" className="btn-outline-gold text-sm px-7 py-3">Ver Importados</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
