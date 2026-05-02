import { prisma } from '@/lib/prisma'
import KitDescobertaClient from './KitDescobertaClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kit Descoberta — 3 Decants por R$89,90 | Start One Imports',
  description: 'Escolha 3 decants originais de perfumes árabes e importados por apenas R$89,90. Descubra seu próximo perfume favorito antes de comprar o frasco.',
  robots: 'noindex',   // landing de tráfego pago — não indexar
}

// Nomes exatos como estão no banco (bate com o campo `nome` do Produto)
const NOMES_CURADOS = [
  // Masculino
  'Lattafa Asad',
  'Asad Elixir',
  'Rasasi Hawas for Him',
  'Armaf Club de Nuit Intense Man',
  'Salvo',
  'Lattafa Fakhar Black',
  'Lattafa Suqraat',
  'Afnan 9AM Dive',
  // Feminino
  'Lattafa Yara',
  'Lattafa Yara Candy',
  'Lattafa Yara Tous',
  'Lattafa Fakhar Rose',
  'Sabah Al Ward',
  'Afnan 9AM Pour Femme',
  // Unissex
  'Old Mystery Intense',
  'Lattafa Ana Abiyedh Rouge',
]

export type DecantInfo = {
  produtoId: string
  variacaoId: string
  nome: string
  marca: string
  genero: 'MASCULINO' | 'FEMININO' | 'UNISSEX'
  imagem: string
  preco: number
  notasTopo: string | null
  notasCoracao: string | null
}

export default async function KitDescobertaPage() {
  const produtos = await prisma.produto.findMany({
    where: {
      ativo: true,
      nome: { in: NOMES_CURADOS },
    },
    include: {
      variacoes: {
        where: { tipo: 'DECANT', ativo: true },
      },
    },
  })

  // Mapeia para o formato que o client precisa, filtrando sem decant
  const decants: DecantInfo[] = produtos
    .filter(p => p.variacoes.length > 0)
    .map(p => {
      const v = p.variacoes[0]
      return {
        produtoId:   p.id,
        variacaoId:  v.id,
        nome:        p.nome,
        marca:       p.marca,
        genero:      p.genero as 'MASCULINO' | 'FEMININO' | 'UNISSEX',
        imagem:      p.imagens?.[0] ?? '',
        preco:       v.preco,
        notasTopo:   p.notasTopo ?? null,
        notasCoracao: p.notasCoracao ?? null,
      }
    })
    // Ordena pela ordem original da curadoria
    .sort((a, b) => NOMES_CURADOS.indexOf(a.nome) - NOMES_CURADOS.indexOf(b.nome))

  return <KitDescobertaClient decants={decants} />
}
