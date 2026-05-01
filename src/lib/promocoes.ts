import { prisma } from './prisma'

export type PromocaoAtiva = {
  tipo: 'PERCENTUAL' | 'FIXO'
  valor: number
  categoria: string | null
  genero: string | null
}

let cache: PromocaoAtiva[] | null = null
let cacheAt = 0
const TTL = 60_000 // 1 minuto

export async function getPromocoesAtivas(): Promise<PromocaoAtiva[]> {
  if (cache && Date.now() - cacheAt < TTL) return cache

  const agora = new Date()
  const rows = await prisma.promocao.findMany({
    where: {
      ativo: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: agora } }],
    },
    select: { tipo: true, valor: true, categoria: true, genero: true },
  })

  cache  = rows as PromocaoAtiva[]
  cacheAt = Date.now()
  return cache
}

export function calcularPrecoPromocional(
  preco: number,
  categoria: string,
  genero: string,
  promocoes: PromocaoAtiva[],
): { preco: number; desconto: number; temDesconto: boolean } {
  // Pega a melhor promoção aplicável
  const aplicaveis = promocoes.filter(p => {
    const matchCat    = !p.categoria || p.categoria === categoria
    const matchGenero = !p.genero    || p.genero    === genero
    return matchCat && matchGenero
  })

  if (aplicaveis.length === 0) return { preco, desconto: 0, temDesconto: false }

  // Aplica a de maior desconto
  let melhor = 0
  for (const p of aplicaveis) {
    const d = p.tipo === 'PERCENTUAL' ? preco * (p.valor / 100) : Math.min(p.valor, preco)
    if (d > melhor) melhor = d
  }

  const precoFinal = Math.max(0, preco - melhor)
  return { preco: precoFinal, desconto: melhor, temDesconto: true }
}
