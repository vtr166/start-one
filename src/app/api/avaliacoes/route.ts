import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { produtoId, nome, nota, comentario } = await req.json()

    if (!produtoId || !nome || !nota) {
      return NextResponse.json({ erro: 'Dados obrigatórios faltando.' }, { status: 400 })
    }
    if (nota < 1 || nota > 5) {
      return NextResponse.json({ erro: 'Nota deve ser entre 1 e 5.' }, { status: 400 })
    }

    await prisma.avaliacao.create({
      data: {
        produtoId,
        nome: nome.trim().slice(0, 100),
        nota: parseInt(nota),
        comentario: comentario?.trim().slice(0, 500) || null,
        aprovado: false, // moderação manual
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[AVALIACAO]', error)
    return NextResponse.json({ erro: 'Erro ao enviar avaliação.' }, { status: 500 })
  }
}
