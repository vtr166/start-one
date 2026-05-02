import { formatPrice } from './utils'

export async function enviarWhatsAppVendedor(pedido: DadosPedido) {
  const numero = process.env.SELLER_WHATSAPP?.replace(/\D/g, '')
  if (!numero) return

  const itensTexto = pedido.itens
    .map(i => `• ${i.quantidade}× ${i.nomeProduto} (${i.nomeVariacao})`)
    .join('\n')

  const mensagem = encodeURIComponent(
    `🛍️ *NOVO PEDIDO CONFIRMADO — Start One*\n\n` +
    `*Pedido:* #${pedido.id.slice(-6).toUpperCase()}\n` +
    `*Cliente:* ${pedido.nomeCliente}\n` +
    `*WhatsApp:* ${pedido.telefoneCliente || 'não informado'}\n` +
    `*Email:* ${pedido.emailCliente}\n\n` +
    `*Itens:*\n${itensTexto}\n\n` +
    (pedido.freteValor ? `*Frete (${pedido.freteServico}):* ${formatPrice(pedido.freteValor)}\n` : '') +
    `*Total:* ${formatPrice(pedido.total)}\n\n` +
    (pedido.enderecoEntrega ? `*Endereço:* ${pedido.enderecoEntrega}\n\n` : '') +
    `Acesse o painel: lojastartone.com.br/admin`
  )

  // Usa a API do CallMeBot (gratuita para WhatsApp pessoal)
  // O vendedor precisa ativar em: https://www.callmebot.com/blog/free-api-whatsapp-messages/
  const apiKey = process.env.CALLMEBOT_API_KEY
  if (!apiKey) return

  await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=${numero}&text=${mensagem}&apikey=${apiKey}`
  ).catch(() => {})
}

type ItemEmail = {
  nomeProduto: string
  nomeVariacao: string
  quantidade: number
  precoUnit: number
}

type DadosPedido = {
  id: string
  nomeCliente: string
  emailCliente: string
  telefoneCliente?: string | null
  enderecoEntrega?: string | null
  freteServico?: string | null
  freteEmpresa?: string | null
  freteValor?: number | null
  total: number
  itens: ItemEmail[]
}

async function enviarEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Start One Imports <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  })
  if (!res.ok) console.error('[EMAIL]', await res.text())
}

export async function enviarEmailVendedor(pedido: DadosPedido) {
  const itensHtml = pedido.itens
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.nomeProduto} — ${i.nomeVariacao}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantidade}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.precoUnit * i.quantidade)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0A0A0A;padding:24px;text-align:center">
        <h1 style="color:#C9A84C;margin:0;font-size:20px">Start One Imports</h1>
        <p style="color:#888;margin:4px 0 0">Novo pedido confirmado 🎉</p>
      </div>

      <div style="padding:24px;background:#fff">
        <h2 style="color:#111;margin-top:0">Pedido #${pedido.id.slice(-6).toUpperCase()}</h2>

        <h3 style="color:#333;margin-bottom:8px">📦 Itens</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Produto</th>
              <th style="padding:8px;text-align:center">Qtd</th>
              <th style="padding:8px;text-align:right">Valor</th>
            </tr>
          </thead>
          <tbody>${itensHtml}</tbody>
        </table>

        <div style="margin-top:16px;text-align:right">
          ${pedido.freteValor ? `<p style="color:#555;margin:4px 0">Frete (${pedido.freteServico}): ${formatPrice(pedido.freteValor)}</p>` : ''}
          <p style="font-size:18px;font-weight:bold;color:#C9A84C">Total: ${formatPrice(pedido.total)}</p>
        </div>

        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">

        <h3 style="color:#333;margin-bottom:8px">👤 Cliente</h3>
        <p style="margin:4px 0;color:#555"><strong>Nome:</strong> ${pedido.nomeCliente}</p>
        <p style="margin:4px 0;color:#555"><strong>Email:</strong> ${pedido.emailCliente}</p>
        ${pedido.telefoneCliente ? `<p style="margin:4px 0;color:#555"><strong>WhatsApp:</strong> ${pedido.telefoneCliente}</p>` : ''}
        ${pedido.enderecoEntrega ? `
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
        <h3 style="color:#333;margin-bottom:8px">📍 Endereço de entrega</h3>
        <p style="margin:4px 0;color:#555">${pedido.enderecoEntrega}</p>
        ${pedido.freteServico ? `<p style="margin:4px 0;color:#555"><strong>Envio:</strong> ${pedido.freteEmpresa} — ${pedido.freteServico}</p>` : ''}
        ` : ''}
      </div>

      <div style="background:#f5f5f5;padding:16px;text-align:center">
        <p style="color:#888;font-size:12px;margin:0">Start One Imports · Painel Admin: lojastartone.com.br/admin</p>
      </div>
    </div>
  `

  await enviarEmail(
    process.env.SELLER_EMAIL!,
    `🛍️ Novo Pedido #${pedido.id.slice(-6).toUpperCase()} — ${formatPrice(pedido.total)}`,
    html
  )
}

export async function enviarEmailRastreio(dados: {
  nomeCliente: string
  emailCliente: string
  pedidoId: string
  codigoRastreio: string
  freteEmpresa?: string | null
}) {
  const primeiroNome = dados.nomeCliente.split(' ')[0]
  const rastreioUrl = `https://rastreamento.correios.com.br/app/index.php?objeto=${dados.codigoRastreio}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://startoneimports.com.br'

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0A0A0A;padding:24px;text-align:center">
        <h1 style="color:#C9A84C;margin:0;font-size:20px">Start One Imports</h1>
      </div>

      <div style="padding:32px;background:#fff;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">📦</div>
        <h2 style="color:#111;margin:0 0 8px">Seu pedido foi enviado!</h2>
        <p style="color:#555;margin:0">
          Olá, <strong>${primeiroNome}</strong>! Seu pedido <strong>#${dados.pedidoId.slice(-6).toUpperCase()}</strong>
          já está a caminho.
        </p>
      </div>

      <div style="padding:24px;background:#F9F9F9;text-align:center;border-top:3px solid #C9A84C">
        <p style="color:#888;font-size:13px;margin:0 0 12px">Código de rastreamento${dados.freteEmpresa ? ` — ${dados.freteEmpresa}` : ''}:</p>
        <div style="display:inline-block;background:#0A0A0A;color:#C9A84C;font-size:22px;font-weight:900;letter-spacing:3px;padding:14px 28px;border-radius:8px;margin:8px 0">
          ${dados.codigoRastreio}
        </div>
        <p style="margin:16px 0 0">
          <a href="${rastreioUrl}" style="background:#C9A84C;color:#0A0A0A;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block">
            Rastrear pedido →
          </a>
        </p>
        <p style="color:#aaa;font-size:11px;margin:12px 0 0">
          Atualizações podem levar até 24h para aparecer no sistema dos Correios.
        </p>
      </div>

      <div style="padding:20px;background:#fff;text-align:center">
        <p style="color:#555;font-size:13px;margin:0">
          Dúvidas? Fale com a gente pelo <strong>Instagram @start_oneoficial</strong> ou WhatsApp.
        </p>
      </div>

      <div style="background:#0A0A0A;padding:16px;text-align:center">
        <p style="color:#666;font-size:12px;margin:0">Start One Imports · ${siteUrl}</p>
      </div>
    </div>
  `

  await enviarEmail(
    dados.emailCliente,
    `📦 Pedido #${dados.pedidoId.slice(-6).toUpperCase()} enviado — rastreie agora`,
    html
  )
}

export async function enviarEmailFidelidade(dados: {
  nomeCliente: string
  emailCliente: string
  codigoCupom: string
  totalCompras: number
  expiresAt: Date
}) {
  const dataExpiracao = dados.expiresAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const primeiroNome = dados.nomeCliente.split(' ')[0]

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0A0A0A;padding:24px;text-align:center">
        <h1 style="color:#C9A84C;margin:0;font-size:20px">Start One Imports</h1>
        <p style="color:#888;margin:4px 0 0">Programa de Fidelidade</p>
      </div>

      <div style="padding:32px;background:#fff;text-align:center">
        <div style="font-size:56px;margin-bottom:16px">🎁</div>
        <h2 style="color:#111;margin:0 0 8px">Parabéns, ${primeiroNome}!</h2>
        <p style="color:#555;margin:0 0 8px">
          Você completou sua <strong>${dados.totalCompras}ª compra</strong> na Start One Imports.<br>
          Ganhou um <strong>decant grátis</strong> da sua escolha!
        </p>
      </div>

      <div style="padding:24px;background:#FFF9EC;border-top:3px solid #C9A84C;text-align:center">
        <p style="color:#888;font-size:13px;margin:0 0 12px">Use este cupom no seu próximo pedido:</p>
        <div style="display:inline-block;background:#0A0A0A;color:#C9A84C;font-size:28px;font-weight:900;letter-spacing:4px;padding:16px 32px;border-radius:8px;margin:8px 0">
          ${dados.codigoCupom}
        </div>
        <p style="color:#888;font-size:12px;margin:12px 0 0">
          Válido para 1 decant grátis (até R$30) · Expira em ${dataExpiracao}
        </p>
      </div>

      <div style="padding:24px;background:#fff;text-align:center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://startoneimports.com.br'}/decants"
          style="background:#C9A84C;color:#0A0A0A;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;display:inline-block">
          Escolher meu decant →
        </a>
        <p style="color:#aaa;font-size:12px;margin:16px 0 0">
          Obrigado por ser um cliente fiel! ❤️
        </p>
      </div>

      <div style="background:#0A0A0A;padding:16px;text-align:center">
        <p style="color:#666;font-size:12px;margin:0">Start One Imports · ${process.env.NEXT_PUBLIC_SITE_URL ?? 'startoneimports.com.br'}</p>
      </div>
    </div>
  `

  await enviarEmail(
    dados.emailCliente,
    `🎁 Você ganhou um decant grátis! — Start One Imports`,
    html
  )
}

export async function enviarEmailComprador(pedido: DadosPedido) {
  const itensHtml = pedido.itens
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.nomeProduto} — ${i.nomeVariacao}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantidade}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.precoUnit * i.quantidade)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0A0A0A;padding:24px;text-align:center">
        <h1 style="color:#C9A84C;margin:0;font-size:20px">Start One Imports</h1>
      </div>

      <div style="padding:32px;background:#fff;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">✅</div>
        <h2 style="color:#111;margin:0 0 8px">Pagamento confirmado!</h2>
        <p style="color:#555;margin:0">Olá, <strong>${pedido.nomeCliente.split(' ')[0]}</strong>! Seu pedido foi recebido e está sendo preparado.</p>
      </div>

      <div style="padding:24px;background:#fafafa">
        <h3 style="color:#333;margin-top:0">Resumo do pedido #${pedido.id.slice(-6).toUpperCase()}</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f0f0f0">
              <th style="padding:8px;text-align:left">Produto</th>
              <th style="padding:8px;text-align:center">Qtd</th>
              <th style="padding:8px;text-align:right">Valor</th>
            </tr>
          </thead>
          <tbody>${itensHtml}</tbody>
        </table>

        <div style="margin-top:16px;text-align:right">
          ${pedido.freteValor ? `<p style="color:#555;margin:4px 0">Frete (${pedido.freteServico}): ${formatPrice(pedido.freteValor)}</p>` : ''}
          <p style="font-size:18px;font-weight:bold;color:#C9A84C">Total pago: ${formatPrice(pedido.total)}</p>
        </div>

        ${pedido.enderecoEntrega ? `
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0">
        <h3 style="color:#333;margin-bottom:8px">📍 Seu endereço</h3>
        <p style="color:#555;margin:0">${pedido.enderecoEntrega}</p>
        ${pedido.freteServico ? `<p style="color:#555;margin:8px 0 0"><strong>Envio:</strong> ${pedido.freteEmpresa} — ${pedido.freteServico}</p>` : ''}
        ` : ''}
      </div>

      <div style="padding:24px;background:#fff;text-align:center">
        <p style="color:#555;margin:0 0 16px">Em breve entraremos em contato via WhatsApp para confirmar a entrega.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://startoneimports.com.br'}/pedido/consulta?id=${pedido.id.slice(-6).toUpperCase()}&email=${encodeURIComponent(pedido.emailCliente)}"
          style="background:#111;color:#C9A84C;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:600;font-size:13px;display:inline-block;border:1px solid #2A2A2A">
          Acompanhar pedido #${pedido.id.slice(-6).toUpperCase()} →
        </a>
      </div>

      <div style="background:#0A0A0A;padding:16px;text-align:center">
        <p style="color:#666;font-size:12px;margin:0">Start One Imports · lojastartone.com.br</p>
      </div>
    </div>
  `

  await enviarEmail(
    pedido.emailCliente,
    `✅ Pedido confirmado — Start One Imports #${pedido.id.slice(-6).toUpperCase()}`,
    html
  )
}
