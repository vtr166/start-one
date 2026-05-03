'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function toggleProdutoAtivo(id: string, ativo: boolean) {
  await prisma.produto.update({ where: { id }, data: { ativo } })
  revalidatePath('/admin/produtos')
  revalidatePath('/')
}

export async function salvarProduto(formData: FormData) {
  const id = formData.get('id') as string | null
  const nome = formData.get('nome') as string
  const marca = formData.get('marca') as string
  const descricao = formData.get('descricao') as string
  const categoria = formData.get('categoria') as 'ARABE' | 'IMPORTADO'
  const genero = formData.get('genero') as 'MASCULINO' | 'FEMININO' | 'UNISSEX'
  const notasTopo = (formData.get('notasTopo') as string) || null
  const notasCoracao = (formData.get('notasCoracao') as string) || null
  const notasBase = (formData.get('notasBase') as string) || null
  const destaque = formData.get('destaque') === 'on'
  const imagens = (formData.get('imagens') as string)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  // Variações
  const variacoesRaw = formData.get('variacoes') as string
  const variacoes: { tipo: 'FRASCO' | 'DECANT'; volume: string; preco: number; estoque: number }[] =
    JSON.parse(variacoesRaw || '[]')

  const slug = slugify(nome)

  if (id) {
    // Edição
    await prisma.produto.update({
      where: { id },
      data: {
        nome, marca, descricao, categoria, genero,
        notasTopo, notasCoracao, notasBase, destaque, imagens, slug,
      },
    })

    // Atualiza variações com segurança (sem deletar as que têm pedidos)
    const existentes = await prisma.variacao.findMany({ where: { produtoId: id } })

    for (const v of variacoes) {
      const match = existentes.find(e => e.tipo === v.tipo && e.volume === v.volume)
      if (match) {
        // Atualiza a variação existente
        await prisma.variacao.update({
          where: { id: match.id },
          data: { preco: v.preco, estoque: v.estoque },
        })
      } else {
        // Cria nova variação
        await prisma.variacao.create({
          data: { ...v, produtoId: id },
        })
      }
    }

    // Remove variações que saíram do form (só se não tiverem pedidos)
    const tiposVolumesForm = variacoes.map(v => `${v.tipo}|${v.volume}`)
    const paraRemover = existentes.filter(
      e => !tiposVolumesForm.includes(`${e.tipo}|${e.volume}`)
    )
    for (const v of paraRemover) {
      try {
        await prisma.variacao.delete({ where: { id: v.id } })
      } catch {
        // Tem pedidos vinculados — zera o estoque em vez de deletar
        await prisma.variacao.update({ where: { id: v.id }, data: { estoque: 0 } })
      }
    }
  } else {
    // Criação
    await prisma.produto.create({
      data: {
        nome, marca, descricao, categoria, genero,
        notasTopo, notasCoracao, notasBase, destaque, imagens, slug,
        variacoes: { create: variacoes },
      },
    })
  }

  revalidatePath('/admin/produtos')
  revalidatePath('/')
}

export async function deletarProduto(id: string) {
  await prisma.produto.delete({ where: { id } })
  revalidatePath('/admin/produtos')
  revalidatePath('/')
}
