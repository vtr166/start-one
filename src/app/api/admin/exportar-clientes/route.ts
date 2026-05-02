import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Verifica autenticação admin (mesmo mecanismo do middleware)
async function verificarAuth(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_auth')?.value
  if (!token) return false

  const secret = process.env.ADMIN_SECRET
  if (!secret) return false

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const [dadosB64, assinaturaHex] = token.split('.')
    if (!dadosB64 || !assinaturaHex) return false
    const assinatura = Uint8Array.from(
      assinaturaHex.match(/.{2}/g)!.map((b: string) => parseInt(b, 16)),
    )
    return await crypto.subtle.verify('HMAC', key, assinatura, new TextEncoder().encode(dadosB64))
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  if (!(await verificarAuth(req))) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  const tipo = req.nextUrl.searchParams.get('tipo') ?? 'clientes'

  // Clientes com pedidos aprovados
  if (tipo === 'clientes') {
    const pedidos = await prisma.pedido.findMany({
      where: { status: 'APROVADO' },
      select: {
        nomeCliente: true,
        emailCliente: true,
        telefoneCliente: true,
        total: true,
        criadoEm: true,
      },
      orderBy: { criadoEm: 'desc' },
    })

    // Agrupa por e-mail (cliente único)
    const mapa = new Map<string, {
      nome: string; email: string; telefone: string
      totalCompras: number; totalGasto: number; ultimaCompra: Date
    }>()
    for (const p of pedidos) {
      const ex = mapa.get(p.emailCliente)
      if (ex) {
        ex.totalCompras++
        ex.totalGasto += p.total
        ex.ultimaCompra = p.criadoEm
      } else {
        mapa.set(p.emailCliente, {
          nome: p.nomeCliente,
          email: p.emailCliente,
          telefone: p.telefoneCliente ?? '',
          totalCompras: 1,
          totalGasto: p.total,
          ultimaCompra: p.criadoEm,
        })
      }
    }

    const linhas = [
      'Nome,Email,WhatsApp,Total Compras,Total Gasto,Última Compra',
      ...Array.from(mapa.values()).map(c =>
        [
          `"${c.nome}"`,
          c.email,
          c.telefone,
          c.totalCompras,
          c.totalGasto.toFixed(2).replace('.', ','),
          c.ultimaCompra.toLocaleDateString('pt-BR'),
        ].join(',')
      ),
    ]

    return new NextResponse(linhas.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="clientes_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  // Todos os pedidos
  if (tipo === 'pedidos') {
    const pedidos = await prisma.pedido.findMany({
      include: { itens: true },
      orderBy: { criadoEm: 'desc' },
    })

    const linhas = [
      'ID,Status,Cliente,Email,Telefone,Total,Itens,Endereço,Frete,Data',
      ...pedidos.map(p =>
        [
          p.id.slice(-6).toUpperCase(),
          p.status,
          `"${p.nomeCliente}"`,
          p.emailCliente,
          p.telefoneCliente ?? '',
          p.total.toFixed(2).replace('.', ','),
          `"${p.itens.map(i => `${i.quantidade}x ${i.nomeProduto} (${i.nomeVariacao})`).join(' | ')}"`,
          `"${p.enderecoEntrega ?? ''}"`,
          p.freteServico ?? '',
          p.criadoEm.toLocaleDateString('pt-BR'),
        ].join(',')
      ),
    ]

    return new NextResponse(linhas.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="pedidos_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  return NextResponse.json({ erro: 'Tipo inválido' }, { status: 400 })
}
