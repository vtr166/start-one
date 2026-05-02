import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trocas e Devoluções | Start One Imports',
  description: 'Política de trocas e devoluções da Start One Imports. Saiba como proceder caso precise devolver ou trocar seu pedido.',
}

export default function TrocasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Trocas e Devoluções</h1>
      <p className="text-sm text-[#555] mb-10">Última atualização: maio de 2025</p>

      <div className="space-y-8 text-sm text-[#888] leading-relaxed">

        <div className="p-5 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/20">
          <p className="text-[#C9A84C] font-bold mb-1">✅ Produto 100% original ou devolvemos seu dinheiro</p>
          <p>Todos os nossos perfumes são originais e verificados antes do envio. Caso haja qualquer problema, entre em contato imediatamente.</p>
        </div>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">1. Direito de arrependimento (CDC)</h2>
          <p>
            Conforme o <strong className="text-[#CCC]">Art. 49 do Código de Defesa do Consumidor</strong>, você tem
            até <strong className="text-[#CCC]">7 dias corridos</strong> após o recebimento do produto para solicitar
            a devolução sem precisar justificar o motivo.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>O produto deve estar <strong className="text-[#CCC]">sem uso e com a embalagem original intacta</strong></li>
            <li>O reembolso será feito em até <strong className="text-[#CCC]">10 dias úteis</strong> após o recebimento da devolução</li>
            <li>O frete de devolução é por nossa conta neste caso</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">2. Produto com defeito ou diferente do anunciado</h2>
          <p>
            Se você receber um produto com defeito, avariado no transporte ou diferente do que foi anunciado:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>Entre em contato em até <strong className="text-[#CCC]">30 dias</strong> após o recebimento</li>
            <li>Envie fotos do produto e da embalagem pelo WhatsApp ou Instagram</li>
            <li>Realizaremos a troca ou reembolso integral, incluindo frete</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">3. Decants</h2>
          <p>
            Por serem produtos fracionados e de uso pessoal, <strong className="text-[#CCC]">decants abertos não são elegíveis para devolução</strong> por arrependimento,
            salvo em caso de defeito ou produto errado enviado.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">4. Como solicitar</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Entre em contato pelo Instagram{' '}
              <strong className="text-[#C9A84C]">@start_oneoficial</strong>{' '}
              ou WhatsApp informando o número do pedido
            </li>
            <li>Aguarde o nosso retorno em até 1 dia útil</li>
            <li>Enviaremos as instruções para devolução se necessário</li>
            <li>Após confirmação, o reembolso ou troca será processado</li>
          </ol>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#F5F5F5] mb-3">5. Reembolso</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-[#CCC]">PIX:</strong> reembolso em até 1 dia útil após aprovação da devolução</li>
            <li><strong className="text-[#CCC]">Cartão de crédito:</strong> estorno feito à operadora em até 2 dias úteis — pode levar 1 a 2 faturas para aparecer</li>
          </ul>
        </section>

        <div className="pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row gap-3">
          <a
            href="https://instagram.com/start_oneoficial"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-sm px-6 py-3 text-center"
          >
            Falar no Instagram
          </a>
          <Link href="/pedido/consulta" className="btn-outline-gold text-sm px-6 py-3 text-center">
            Consultar meu pedido
          </Link>
        </div>

      </div>
    </div>
  )
}
