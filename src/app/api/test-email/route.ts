import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Start One <onboarding@resend.dev>',
      to: [process.env.SELLER_EMAIL],
      subject: '✅ Teste de email — Start One',
      html: '<p>Email de teste funcionando!</p>',
    }),
  })

  const data = await res.json()

  return NextResponse.json({
    status: res.status,
    ok: res.ok,
    resend_response: data,
    seller_email: process.env.SELLER_EMAIL,
    has_api_key: !!process.env.RESEND_API_KEY,
  })
}
