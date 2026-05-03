import { enviarEmailVendedor } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET() {
  await enviarEmailVendedor({
    id: 'teste123456',
    nomeCliente: 'Cliente Teste',
    emailCliente: 'cliente@teste.com',
    telefoneCliente: '(11) 99999-9999',
    enderecoEntrega: 'Rua das Flores, 123 — Centro, São Paulo/SP — CEP 01310-100',
    freteServico: 'PAC',
    freteEmpresa: 'Correios',
    freteValor: 19.90,
    total: 89.90,
    itens: [
      { nomeProduto: 'Lattafa Yara', nomeVariacao: 'Decant 5ml', quantidade: 1, precoUnit: 35 },
      { nomeProduto: 'Fakhar Rose', nomeVariacao: 'Decant 5ml', quantidade: 1, precoUnit: 35 },
      { nomeProduto: 'Sabah Al Ward', nomeVariacao: 'Decant 5ml', quantidade: 1, precoUnit: 35 },
    ],
  })

  return NextResponse.json({ ok: true, mensagem: 'Email de teste enviado para ' + process.env.SELLER_EMAIL })
}
