import { formatPrice } from './utils'

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

      <div style="padding:24px;background:#fff">
        <p style="color:#555;margin:0">Em breve entraremos em contato via WhatsApp para confirmar a entrega. Qualquer dúvida, fale com a gente pelo Instagram <strong>@start_oneoficial</strong>.</p>
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
