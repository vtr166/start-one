'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const categorias = [
  {
    titulo: '💧 Decants',
    perguntas: [
      {
        q: 'O que é um decant?',
        a: 'Decant é uma amostra de 5ml retirada diretamente do frasco original. É a maneira perfeita de testar um perfume antes de comprar o frasco completo — você usa por alguns dias e decide se quer investir.',
      },
      {
        q: 'O decant é retirado do frasco original?',
        a: 'Sim! Todos os nossos decants são retirados diretamente dos frascos originais que vendemos. Você experimenta exatamente o que vai comprar.',
      },
      {
        q: 'O decant vem com o mesmo cheiro que o frasco?',
        a: 'Completamente idêntico. O decant é o mesmo líquido do frasco, em menor quantidade. Não há diferença de fórmula ou qualidade.',
      },
      {
        q: 'Como o decant é embalado?',
        a: 'Os decants são acondicionados em frascos de vidro ou atomizadores próprios, devidamente vedados e identificados com o nome do perfume.',
      },
    ],
  },
  {
    titulo: '🛡️ Autenticidade',
    perguntas: [
      {
        q: 'Os perfumes são originais?',
        a: 'Sim, 100%. Todos os perfumes vendidos pela Start One Imports são adquiridos diretamente de distribuidores autorizados. Nunca vendemos réplicas, inspirações ou similares.',
      },
      {
        q: 'Como posso ter certeza de que é original?',
        a: 'Além de comprar de fontes confiáveis, todas as características do perfume (embalagem, cheiro, fixação, notas) são verificadas antes de entrar no estoque. Temos fotos e vídeos dos frascos disponíveis mediante solicitação.',
      },
      {
        q: 'Vocês vendem inspirações ou perfumes similares?',
        a: 'Não. Vendemos apenas produtos originais das marcas anunciadas. Marcas como Lattafa e Armaf são frequentemente comparadas a grifes de luxo, mas são produtos originais dessas marcas — não cópias.',
      },
    ],
  },
  {
    titulo: '🚚 Entrega',
    perguntas: [
      {
        q: 'Vocês entregam para todo o Brasil?',
        a: 'Sim! Enviamos para todos os estados via Correios e transportadoras. O prazo e o frete são calculados no momento do pedido com base no seu CEP.',
      },
      {
        q: 'Qual o prazo de entrega?',
        a: 'Em média de 5 a 12 dias úteis após a confirmação do pagamento, dependendo da sua região. Capitais e grandes cidades costumam receber mais rápido.',
      },
      {
        q: 'A embalagem é discreta?',
        a: 'Sim. Embalamos de forma segura e discreta, com proteção extra para que o frasco chegue intacto. O conteúdo não é especificado externamente.',
      },
      {
        q: 'O pedido tem rastreamento?',
        a: 'Sim! Você recebe o código de rastreamento por e-mail assim que o pedido é despachado.',
      },
    ],
  },
  {
    titulo: '💳 Pagamento',
    perguntas: [
      {
        q: 'Quais formas de pagamento são aceitas?',
        a: 'Aceitamos Pix, cartão de crédito (até 12x dependendo do valor) e cartão de débito — tudo processado com segurança pelo Mercado Pago.',
      },
      {
        q: 'O pagamento é seguro?',
        a: 'Sim. Utilizamos o Mercado Pago como processador de pagamentos, uma das plataformas mais seguras da América Latina. Seus dados não ficam armazenados em nosso site.',
      },
      {
        q: 'Posso pagar com Pix?',
        a: 'Sim! O Pix é aceito e garante processamento imediato do pedido.',
      },
    ],
  },
  {
    titulo: '🔄 Trocas e devoluções',
    perguntas: [
      {
        q: 'E se o perfume chegar quebrado ou vazado?',
        a: 'Entre em contato conosco imediatamente via WhatsApp com fotos do produto. Resolveremos de forma ágil — reenvio ou reembolso total, sem burocracia.',
      },
      {
        q: 'Posso trocar se não gostar do cheiro?',
        a: 'Por isso recomendamos sempre começar pelo decant! O cheiro é uma questão pessoal, então não fazemos troca por preferência olfativa. Mas se o produto tiver qualquer problema, resolvemos.',
      },
    ],
  },
]

function Pergunta({ q, a }: { q: string; a: string }) {
  const [aberta, setAberta] = useState(false)
  return (
    <div className="border border-[#2A2A2A] rounded-xl overflow-hidden">
      <button
        onClick={() => setAberta(!aberta)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-[#1A1A1A] transition-colors"
      >
        <span className="text-sm font-semibold text-[#F5F5F5]">{q}</span>
        <ChevronDown
          size={16}
          className={`text-[#C9A84C] shrink-0 transition-transform duration-200 ${aberta ? 'rotate-180' : ''}`}
        />
      </button>
      {aberta && (
        <div className="px-5 pb-4 text-sm text-[#888] leading-relaxed border-t border-[#2A2A2A] pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] font-bold mb-3">Dúvidas?</p>
        <h1 className="text-4xl font-black text-[#F5F5F5] mb-4">Perguntas Frequentes</h1>
        <p className="text-[#888] text-sm">
          Encontre respostas para as dúvidas mais comuns. Se não encontrar, fale com a gente!
        </p>
      </div>

      {/* Perguntas por categoria */}
      <div className="space-y-10">
        {categorias.map((cat) => (
          <div key={cat.titulo}>
            <h2 className="text-sm font-bold text-[#C9A84C] uppercase tracking-widest mb-4">
              {cat.titulo}
            </h2>
            <div className="space-y-2">
              {cat.perguntas.map((p) => (
                <Pergunta key={p.q} q={p.q} a={p.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA WhatsApp */}
      <div className="mt-14 card-dark p-8 text-center">
        <MessageCircle size={32} className="text-[#C9A84C] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#F5F5F5] mb-2">Ainda tem dúvidas?</h3>
        <p className="text-sm text-[#888] mb-5">
          Fale diretamente com a gente pelo Instagram ou WhatsApp. Respondemos rapidinho!
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="https://wa.me/55SEUNUMERO"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-sm px-6 py-2.5"
          >
            Chamar no WhatsApp
          </a>
          <Link href="/" className="btn-outline-gold text-sm px-6 py-2.5">
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
