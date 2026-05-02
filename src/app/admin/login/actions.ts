'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Gera token HMAC assinado com o secret
async function gerarToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const dados = btoa(`admin:${Date.now()}`)
  const sig   = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(dados))
  const hex   = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${dados}.${hex}`
}

export async function fazerLogin(formData: FormData): Promise<{ erro?: string }> {
  const senha  = formData.get('senha') as string
  const redirect_to = formData.get('redirect') as string || '/admin'

  const senhaCorreta = process.env.ADMIN_PASSWORD
  const secret       = process.env.ADMIN_SECRET

  if (!senhaCorreta || !secret) {
    return { erro: 'Variáveis ADMIN_PASSWORD e ADMIN_SECRET não configuradas no Vercel.' }
  }

  if (senha !== senhaCorreta) {
    return { erro: 'Senha incorreta.' }
  }

  const token = await gerarToken(secret)

  const cookieStore = await cookies()
  cookieStore.set('admin_auth', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/admin',
    maxAge:   60 * 60 * 24 * 7, // 7 dias
  })

  redirect(redirect_to)
}

export async function fazerLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin/login')
}
