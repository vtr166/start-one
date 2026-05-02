import { NextRequest, NextResponse } from 'next/server'

// Verifica o cookie de autenticação do admin usando Web Crypto (Edge Runtime)
async function verificarToken(token: string): Promise<boolean> {
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
      assinaturaHex.match(/.{2}/g)!.map(b => parseInt(b, 16)),
    )
    return await crypto.subtle.verify(
      'HMAC', key,
      assinatura,
      new TextEncoder().encode(dadosB64),
    )
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Só protege rotas /admin (exceto a própria página de login)
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('admin_auth')?.value

  if (!token || !(await verificarToken(token))) {
    const login = new URL('/admin/login', req.url)
    login.searchParams.set('redirect', pathname)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
