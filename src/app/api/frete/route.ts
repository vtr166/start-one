import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export type OpcaoFrete = {
  id: number
  nome: string
  empresa: string
  logo: string
  preco: number
  prazo: number
}

export async function GET(req: NextRequest) {
  const cep = req.nextUrl.searchParams.get('cep')?.replace(/\D/g, '')
  const peso = parseFloat(req.nextUrl.searchParams.get('peso') ?? '0.5')

  if (!cep || cep.length !== 8) {
    return NextResponse.json({ erro: 'CEP inválido' }, { status: 400 })
  }

  try {
    const res = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'StartOneImports (vwmalves@gmail.com)',
      },
      body: JSON.stringify({
        from: { postal_code: process.env.MELHOR_ENVIO_CEP_ORIGEM },
        to: { postal_code: cep },
        package: {
          height: 10,
          width: 15,
          length: 15,
          weight: Math.max(0.3, peso),
        },
        options: { receipt: false, own_hand: false },
        services: '1,2,17', // PAC, SEDEX, Mini Envios Correios
      }),
    })

    const data = await res.json()

    if (!Array.isArray(data)) {
      return NextResponse.json({ opcoes: [] })
    }

    const opcoes: OpcaoFrete[] = data
      .filter((s) => !s.error && s.price)
      .map((s) => ({
        id: s.id,
        nome: s.name,
        empresa: s.company?.name ?? '',
        logo: s.company?.picture ?? '',
        preco: parseFloat(s.price),
        prazo: s.delivery_time ?? 0,
      }))
      .sort((a, b) => a.preco - b.preco)

    return NextResponse.json({ opcoes })
  } catch (error) {
    console.error('[FRETE]', error)
    return NextResponse.json({ erro: 'Erro ao calcular frete' }, { status: 500 })
  }
}
